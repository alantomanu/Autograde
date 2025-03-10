/** @type { import("drizzle-kit").Config } */
const config = {
  schema: "./drizzle/schema.ts",
  dialect: 'postgresql',
  dbCredentials: {
      url: process.env.DATABASE_URL,
  }
};

export default config;