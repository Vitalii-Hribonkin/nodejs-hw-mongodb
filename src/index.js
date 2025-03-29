import { setupServer } from "./server.js";
import { initMongoConection } from "./db/initMongoConnection.js";


const bootstrap = async () => {
    await initMongoConection();
    setupServer();
};

bootstrap();