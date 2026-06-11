import { Elysia } from "elysia";
import { cors } from "@elysia/cors";
import { openapi } from "@elysia/openapi";
import { opentelemetry } from "@elysia/opentelemetry";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { logger } from "./common/logger";
import { API_ENV } from "@traject/env/server";
import { authModule } from "./modules/auth";
import { authRateLimit, globalRateLimit } from "@/middleware/rate-limiter";
import { healthModule } from "@modules/health";
import { enforcementModule } from "@modules/enforcement";
import { approvalsModule } from "@modules/approvals";
import { requestDemoModule } from "@modules/request-demo";
import { onboardingModule } from "@modules/onboarding";
import { organizationsModule } from "@modules/organizations";

export const createApplication = () => {
  const app = new Elysia()
    .use(globalRateLimit)
    .use(
      cors({
        origin: API_ENV.CORS_ORIGIN,
        credentials: true,
      }),
    )
    .use(
      openapi({
        path: "/docs",
        provider: "scalar",
        documentation: {
          info: {
            title: "Traject Production API",
            version: "1.0.0",
            description: "Production-ready Traject App backend.",
          },
          tags: [],
        },
      }),
    )
    .use(
      opentelemetry({
        spanProcessors: [new BatchSpanProcessor(new OTLPTraceExporter())],
      }),
    )
    .onError(({ code, error, set }) => {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      logger.error({
        code,
        error: errorMessage,
        stack:
          API_ENV.NODE_ENV === "development" && error instanceof Error
            ? error.stack
            : undefined,
      });

      if (code === "NOT_FOUND") {
        set.status = 404;
        return { error: "Route not found" };
      }

      if (code === "VALIDATION") {
        set.status = 400;

        let parsedMessage = errorMessage;
        try {
          if (
            typeof errorMessage === "string" &&
            errorMessage.startsWith("{")
          ) {
            parsedMessage = JSON.parse(errorMessage);
          }
        } catch {}

        return {
          error: "Validation error",
          message: parsedMessage,
        };
      }

      set.status = 500;
      return {
        error: "Internal server error",
        message: API_ENV.NODE_ENV === "development" ? errorMessage : undefined,
      };
    })
    .get("/", () => ({
      name: "Elysia Production API",
      version: "1.0.0",
      docs: "/docs",
      health: "/health",
    }))
    .use(healthModule)
    .use(enforcementModule)
    .use(approvalsModule)
    .use(requestDemoModule)
    .use(onboardingModule)
    .use(organizationsModule);

  if (API_ENV.ENABLE_AUTH) {
    app.use(authRateLimit);
    app.use(authModule);
    logger.info("[AUTH] Authentication module enabled");
  } else {
    logger.info("[AUTH] Authentication disabled (ENABLE_AUTH=false)");
  }

  return app;
};
