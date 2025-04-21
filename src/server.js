import express from "express";
import cors from "cors";
import pino from "pino-http";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"; // Подключаем cookie-parser
import { errorHandler } from "./midllewares/errorHandler.js";
import { notFoundHandler } from "./midllewares/notFoundHandler.js"; 
import router from "./routers/index.js";

dotenv.config();

export const setupServer = () => {
  const app = express();

  // Настройки CORS, разрешаем куки
  app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000", // адреса твоего фронтенда
    credentials: true, // разрешаем передавать куки
  }));

  app.use(express.json());
  app.use(cookieParser()); // Подключаем cookie-parser

  app.use(pino({
    transport: {
      target: "pino-pretty"
    }
  }));

  // Маршруты
  app.use(router);

  // Обработка не найденных маршрутов
  app.use('*', notFoundHandler);

  // Обработка ошибок
  app.use(errorHandler);

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, () => console.log(`Server running on port ${port}`));
};
