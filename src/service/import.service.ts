import { GithubApiClient } from '../client/github-api.client';
import { Injectable, Logger } from '@nestjs/common';
import Bottleneck from 'bottleneck';
import { EmployeeModel } from '../database/models/employee.model';
import { LanguageModel } from '../database/models/language.model';
import { ProjectModel } from '../database/models/project.model';
import { RefIdCache } from '../database/helper/ref-id-cache';
import { PartialModelGraph } from 'objection';

const limiter = new Bottleneck({
  minTime: 50
});

export type Contributor = { id: number };

export type Project = {
  contributors: Contributor[];
  languages: Record<string, number>;
  id: number;
  name: string;
};

export type MemberWithProjects = {
  id: number;
  name: string | null;
  login: string;
  repos: Project[];
};

@Injectable()
export class ImportService {
  private logger = new Logger(ImportService.name);

  constructor(private readonly client: GithubApiClient) {}

  public async fetchMembersWithProjects(): Promise<MemberWithProjects[]> {
    this.logger.log(`Started fetching data from ${this.client.urlTemplate}`);

    const membersResponse = await this.client.getMembers('codecentric');
    const membersWithDetails = await Promise.all(
      membersResponse.map((member, idx) =>
        limiter.schedule(async () => {
          const memberDetails = await limiter.schedule(() =>
            this.client.getUserDetails(member.login)
          );
          this.logger.log(
            `${idx + 1} / ${membersResponse.length} members fetched`
          );
          return { ...member, ...memberDetails };
        })
      )
    );

    const membersWithProjects = await Promise.all(
      membersWithDetails.map((member) =>
        limiter.schedule(async () => {
          const reposOfMember = await limiter.schedule(() =>
            this.client.getRepos(member.login)
          );
          const repos = await Promise.all(
            reposOfMember
              .filter((x) => !x.fork)
              .map(async (repo) => {
                const contributors = await limiter.schedule(() =>
                  this.client.getContributors(member.login, repo.name)
                );
                const languages = await limiter.schedule(() =>
                  this.client.getLanguages(member.login, repo.name)
                );
                return {
                  ...repo,
                  name: `${member.login}/${repo.name}`,
                  contributors: contributors ?? [member],
                  languages
                };
              })
          );

          this.logger.log(`All repos fetched from ${member.login}`);
          return { ...member, repos };
        })
      )
    );

    this.logger.log('All data fetched');
    return membersWithProjects;
  }

  public async fetchEmployees(): Promise<PartialModelGraph<EmployeeModel>[]> {
    const membersWithProjects = await this.fetchMembersWithProjects();

    const memberCache = membersWithProjects.reduce((prev, curr) => {
      prev.getOrAdd(curr.id, {
        name: curr.name,
        login: curr.login,
        projects: []
      } as EmployeeModel);
      return prev;
    }, new RefIdCache<number, PartialModelGraph<EmployeeModel>>('member'));

    const projectCache = new RefIdCache<
      number,
      PartialModelGraph<ProjectModel>
    >('project');
    const languageCache = new RefIdCache<
      string,
      PartialModelGraph<LanguageModel>
    >('language');

    membersWithProjects.forEach((curr) => {
      curr.repos.forEach((x) => {
        const contributors = x.contributors || [curr];

        contributors.forEach((contributor) => {
          memberCache.get(contributor.id)?.projects.push(
            projectCache.getOrAdd(x.id, {
              name: x.name,
              languages: Object.entries(x.languages).map(([language, loc]) => ({
                loc,
                ...languageCache.getOrAdd(language, { name: language })
              }))
            })
          );
        });
      });
    });

    return memberCache.getValues();
  }
}
