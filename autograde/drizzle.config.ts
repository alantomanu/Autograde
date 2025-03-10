/** @type { import("drizzle-kit").Config } */
const config = {
  schema: "./drizzle/schema.ts",
  dialect: 'postgresql',
  dbCredentials: {
      url: 'postgresql://autograde-db_owner:npg_YD8oCSWaj0yQ@ep-little-shadow-a86f80gk-pooler.eastus2.azure.neon.tech/autograde-db?sslmode=require',
  }
};

export default config;