import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { Express } from "express";

export const setupSwagger = (app: Express) => {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Ticketing Service API",
        version: "1.0.0",
        description: "Backend for ticketing system",
      },
    },
    apis: ["./src/routes/**/*.ts"],
  };

  const specs = swaggerJsdoc(options);
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));
};
