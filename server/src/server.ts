import dotenv from "dotenv";
import app from "./app.js";
import { connectDatabase } from "./config/database.js";

dotenv.config();

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`🚀 SyncBoard server running on port ${PORT}`);
  });
};

startServer();