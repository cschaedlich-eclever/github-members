import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { Injectable, Logger } from '@nestjs/common';

export type GithubMember = { id: number; login: string };
export type GithubMemberDetails = { name: string };
export type GithubRepo = { id: number; name: string; fork: boolean };
export type GithubContributor = { id: number };
export type GithubLanguages = Record<string, number>;
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubApiClient {
  private logger = new Logger(GithubApiClient.name);
  readonly urlTemplate: string;
  private readonly token: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.urlTemplate = configService.get<string>('githubUrlTemplate');
    this.token = configService.get<string>('githubToken');
  }

  private async get<T>(uriPath: string) {
    const uri = this.urlTemplate.replace('<path>', uriPath);
    const { data } = await lastValueFrom(
      this.httpService.get<T>(uri, {
        headers: { Authorization: `Bearer ${this.token}` }
      })
    );

    return data;
  }

  async getMembers(company: string) {
    const uri = `/orgs/${company}/members`;
    const data = await this.get<GithubMember[]>(uri);
    return data;
  }

  async getUserDetails(login: string) {
    const uri = `/users/${login}`;
    const data = await this.get<GithubMemberDetails>(uri);
    return data;
  }

  async getRepos(login: string) {
    const uri = `/users/${login}/repos`;
    const data = await this.get<GithubRepo[]>(uri);
    return data;
  }

  async getContributors(login: string, repoName: string) {
    const uri = `/repos/${login}/${repoName}/contributors`;
    const data = await this.get<GithubContributor[]>(uri);
    return data;
  }

  async getLanguages(login: string, repoName: string) {
    const uri = `/repos/${login}/${repoName}/languages`;
    const data = await this.get<GithubLanguages>(uri);
    return data;
  }
}
