import { loadEnv, defineConfig } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV || "development", process.cwd());

module.exports = defineConfig({
  projectConfig: {
    redisUrl: 'redis://default:gDEL8qWTm7AWVOzD2oAC1VTlDMPB5pHd@redis-12595.c267.us-east-1-4.ec2.redns.redis-cloud.com:12595',
    
    databaseUrl: process.env.DATABASE_URL,
    databaseDriverOptions: {
      connection: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    },
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  modules: [
    {
      resolve: "@medusajs/medusa/event-bus-redis",
      options: { 
        redisUrl: "redis://default:gDEL8qWTm7AWVOzD2oAC1VTlDMPB5pHd@redis-12595.c267.us-east-1-4.ec2.redns.redis-cloud.com:12595",
      },
    },
  ],

});
