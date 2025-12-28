import { Express } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { ENV } from "./env";

export function setupSwagger(app: Express) {
  const swaggerSpec = swaggerJSDoc({
    definition: {
      openapi: "3.0.0",
      info: {
        title: `${ENV.SERVICE_NAME} API`,
        version: "1.0.0",
        description: "API documentation for Milan backend",
      },
      servers: [
        {
          url: `http://localhost:${ENV.PORT}`,
          description: "Local server",
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
    apis: ["src/routes/**/*.ts", "src/controllers/**/*.ts"],
  });

  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      swaggerOptions: {
        persistAuthorization: true, // 🔑 CRITICAL FIX
      },
    })
  );
}
