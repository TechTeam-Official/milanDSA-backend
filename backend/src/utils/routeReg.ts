import { Express } from "express";
import fs from "fs";
import path from "path";

export const registerRoutes = (app: Express) => {
  const routesDir = path.join(__dirname, "..", "routes");

  fs.readdirSync(routesDir).forEach((folder) => {
    const routePath = path.join(routesDir, folder);

    // Only process directories
    if (!fs.statSync(routePath).isDirectory()) return;

    // Resolve correct file name AFTER build
    const routeFile = path.join(routePath, "route.js");

    if (!fs.existsSync(routeFile)) {
      console.warn(`⚠️ No route.js found in /${folder}`);
      return;
    }

    const route = require(routeFile);

    if (!route.default) {
      throw new Error(`❌ route.js in /${folder} has no default export`);
    }

    app.use(`/${folder}`, route.default);
    console.log(`📌 Route registered: /${folder}`);
  });
};
