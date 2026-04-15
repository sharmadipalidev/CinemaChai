//  CREATE TABLE seats (
//      id SERIAL PRIMARY KEY,
//      name VARCHAR(255),
//      isbooked INT DEFAULT 0
//  );
// INSERT INTO seats (isbooked)
// SELECT 0 FROM generate_series(1, 20);

import "dotenv/config";

import {
  checkDatabaseConnection,
  closeDatabaseConnection,
} from "./src/common/config/db.js";
import { app, initializeApplication } from "./src/app.js";

const port = Number(process.env.PORT || 8080);

const startServer = async () => {
  try {
    await checkDatabaseConnection();
    await initializeApplication();

    const server = app.listen(port, () => {
      console.log(`Server starting on port: ${port}`);
    });

    const shutdown = async () => {
      server.close(async () => {
        await closeDatabaseConnection();
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    console.error("Failed to start application:", error);
    process.exit(1);
  }
};

startServer();
