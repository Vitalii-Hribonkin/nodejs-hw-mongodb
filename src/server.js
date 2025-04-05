import express from "express";
import cors from "cors";
import pino from "pino-http";
import dotenv from "dotenv";
import contactRouter from "./routers/contacts.js";
import { errorHandler } from "./midllewares/errorHandler.js";
import { notFoundHandler } from "./midllewares/notFoundHandler.js"; 
dotenv.config();




export const setupServer = () => {
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(pino({
        transport: {
            target: "pino-pretty"
        }
    }));

    app.use(contactRouter);


    app.use('*', notFoundHandler);

    app.use(errorHandler);


    const port = Number(process.env.PORT) || 3000;

    app.listen(port, () => console.log(`Server running on ${port} port`));
};
