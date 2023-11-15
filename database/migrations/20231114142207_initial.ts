import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('employees', (table) => {
    table.increments().primary();
    table.string('login', 255).notNullable().unique();
    table.string('name', 255);
  });
  await knex.schema.createTable('projects', (table) => {
    table.increments().primary();
    table.string('name', 255).notNullable().unique();
  });
  await knex.schema.createTable('languages', (table) => {
    table.increments().primary();
    table.string('name', 255).notNullable().unique();
  });

  await knex.schema.createTable('employees_projects', (table) => {
    table.integer('employee_id').notNullable();
    table.integer('project_id').notNullable();
    table.primary(['employee_id', 'project_id']);

    table
      .foreign('employee_id')
      .references('id')
      .inTable('employees')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table
      .foreign('project_id')
      .references('id')
      .inTable('projects')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
  });

  await knex.schema.createTable('projects_languages', (table) => {
    table.integer('project_id').notNullable();
    table.integer('language_id').notNullable();
    table.integer('loc').notNullable();
    table.primary(['project_id', 'language_id']);

    table
      .foreign('project_id')
      .references('id')
      .inTable('projects')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table
      .foreign('language_id')
      .references('id')
      .inTable('languages')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('employees_projects');
  await knex.schema.dropTable('projects_languages');
  await knex.schema.dropTable('employees');
  await knex.schema.dropTable('projects');
  await knex.schema.dropTable('languages');
}
