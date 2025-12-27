import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { Express } from "express";
import { ENV } from "./env";

export const setupSwagger = (app: Express) => {
  const options: swaggerJsdoc.Options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Ticketing Service API",
        version: "1.0.0",
        description: "Backend for Milan Ticketing System",
      },
      servers: [
        {
          url: `http://localhost:${ENV.PORT}`,
          description: "Local development",
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
    apis: ["./src/routes/**/*.ts"],
  };

  const specs = swaggerJsdoc(options);

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));
};
