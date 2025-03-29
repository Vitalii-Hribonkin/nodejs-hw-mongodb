import express from "express";
import cors from "cors";
// import pino from "pino-http";
import dotenv from "dotenv";

import { getContact, getContactById } from "./services/contact.js";

dotenv.config();




export const setupServer = () => {
    const app = express();

    app.use(cors());
    app.use(express.json());
    // app.use(pino({
    //     transport: {
    //         target: "pino-pretty"
    //     }
    // }));

    app.get("/contacts", async (req, res) => {
        const data = await getContact();

        res.json({
            status: 200,
            message: "Successfully find contacts",
            data,
        });
    });


    app.get('/contacts/:contactId', async (req, res) => {
    const { contactId } = req.params; 

    const data = await getContactById(contactId);

    if (!data) {
        return res.status(404).json({
            status: 404,
            message: `Contact don't found by id=${contactId}`,
        });
    }

    res.json({
        status: 200,
        message: `Successfully find contact by id=${contactId}`,
        data,
    });
});


    app.use((req, res) => {
        res.status(404).json({
            message: `${req.url} not found`
        });
    });


    app.use((error, req, res, next) => {
        res.status(500).json({
            message: error.message,
        });
    });


    const port = Number(process.env.PORT) || 3000;

    app.listen(port, () => console.log(`Server running on ${port} port`));
};
