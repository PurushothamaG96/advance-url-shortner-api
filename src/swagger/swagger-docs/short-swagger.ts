import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Short URL API",
      description: "API to create and manage short URLs.",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "Authorization",
        },
      },
    },
    security: [{ ApiKeyAuth: [] }],
  },
  apis: ["src/swagger/swagger-model/*.ts", "dist/swagger/swagger-model/*.ts"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export const setupUrlSwagger = (app: Application) => {
  app.use("/url/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
