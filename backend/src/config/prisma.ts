import { PrismaClient } from "@prisma/client";
import { config } from "./index.js";

// Fungsi pembuat instance Prisma dengan event logger canggih untuk development
export const createPrismaClient = () => {
  if (config.prismaLog) {
    const client = new PrismaClient({
      log: [
        { emit: "event", level: "query" },
        { emit: "event", level: "info" },
        { emit: "event", level: "warn" },
        { emit: "event", level: "error" },
      ],
    });

    // Logging query SQL lengkap dengan durasi eksekusi dan parameter
    client.$on("query" as never, (e: any) => {
      const durationMs = `${e.duration}ms`;
      console.log(
        `\x1b[36m[PRISMA:QUERY]\x1b[0m \x1b[33m(${durationMs})\x1b[0m ${e.query}`
      );
      if (e.params && e.params !== "[]") {
        console.log(`  \x1b[90m↳ params:\x1b[0m \x1b[32m${e.params}\x1b[0m`);
      }
    });

    client.$on("info" as never, (e: any) => {
      console.log(`\x1b[34m[PRISMA:INFO]\x1b[0m ${e.message}`);
    });

    client.$on("warn" as never, (e: any) => {
      console.warn(`\x1b[33m[PRISMA:WARN]\x1b[0m ${e.message}`);
    });

    client.$on("error" as never, (e: any) => {
      console.error(`\x1b[31m[PRISMA:ERROR]\x1b[0m ${e.message}`);
    });

    return client;
  }

  return new PrismaClient({
    log: ["warn", "error"],
  });
};

declare global {
  // eslint-disable-next-line no-var
  var prisma: ReturnType<typeof createPrismaClient> | undefined;
}

export const prisma = global.prisma || createPrismaClient();

if (config.nodeEnv !== "production") {
  global.prisma = prisma;
}

export default prisma;
