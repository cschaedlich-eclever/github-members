export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    client: 'pg',
    connection: process.env.DATABASE_URL!
  },
  githubUrlTemplate: process.env.GITHUB_URL_TEMPLATE ?? '',
  githubToken: process.env.GITHUB_TOKEN ?? ''
});
