import express from "express";
import cors from "cors";
import pino from "pino-http";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"; // Підключаємо cookie-parser
import { errorHandler } from "./midllewares/errorHandler.js";
import { notFoundHandler } from "./midllewares/notFoundHandler.js"; 
import router from "./routers/index.js";

dotenv.config();

export const setupServer = () => {
  const app = express();

  // Налаштування CORS, дозволяємо куки
  app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000", // адреса твого фронтенду
    credentials: true, // дозволяємо передавати куки
  }));
  
  app.use(express.json());
  app.use(cookieParser()); // Підключаємо cookie-parser
  
  app.use(pino({
    transport: {
      target: "pino-pretty"
    }
  }));

  // Маршрути
  app.use(router);

  // Обробка не знайдених маршрутів
  app.use('*', notFoundHandler);

  // Обробка помилок
  app.use(errorHandler);

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, () => console.log(`Server running on port ${port}`));
};
