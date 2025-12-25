import { Express } from "express";
import fs from "fs";
import path from "path";

export const registerRoutes = (app: Express) => {
  const routesDir = path.join(__dirname, "..", "routes");

  fs.readdirSync(routesDir).forEach((folder) => {
    const routeFile = path.join(routesDir, folder, "route");

    try {
      const route = require(routeFile);
      app.use(`/${folder}`, route.default);
      console.log(`📌 Route registered: /${folder}`);
    } catch {
      // ignore folders without route.ts
    }
  });
};
