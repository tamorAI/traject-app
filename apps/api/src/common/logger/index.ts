import { API_ENV } from "@traject/env/server";
import pino from "pino";

const isTest = API_ENV.NODE_ENV === "test";

export const logger = pino({
  level: isTest ? "silent" : (API_ENV.LOG_LEVEL ?? "info"),
  transport:
    API_ENV.NODE_ENV === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "HH:MM:ss",
            ignore: "pid,hostname",
          },
        }
      : undefined,
});
