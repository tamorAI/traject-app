import { API_ENV } from "@traject/env/server";
import { closeDatabase } from "@traject/database";
import { createApplication } from "./app";
import { logger } from "./common/logger";

// App entrypoint
const app = createApplication();

const server = app.listen({
  hostname: API_ENV.HOST,
  port: API_ENV.PORT,
});

// Startup logs
logger.info(`[SERVER] Running at ${API_ENV.HOST}:${API_ENV.PORT}`);
logger.info(
  `[API] Documentation available at ${API_ENV.HOST}:${API_ENV.PORT}/docs`,
);
logger.info(
  `[HEALTH] Health check endpoint: ${API_ENV.HOST}:${API_ENV.PORT}/health`,
);

// Graceful shutdown
let isShuttingDown = false;

const shutdown = async (signal: string) => {
  if (isShuttingDown) return;
  isShuttingDown = true;

  logger.info(`${signal} received, shutting down gracefully...`);

  try {
    await Promise.resolve(server.stop());
    await closeDatabase();
    logger.info("Server closed successfully");
    process.exit(0);
  } catch (error) {
    logger.error({ error }, "Error during shutdown");
    process.exit(1);
  }
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
