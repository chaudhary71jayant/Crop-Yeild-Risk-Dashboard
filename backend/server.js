
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { env } from "./src/config/env.js";
import { logger } from "./src/config/logger.js";
import districtRoutes from "./src/routes/districts.routes.js";
import { errorHandler } from "./src/middleware/errorHandler.middleware.js";

const app = express();
const PORT = env.PORT;

app.use(cors(
    {
        origin: ["http://localhost:5173", "http://localhost:3000"]
    }
));

app.use(morgan("dev", {
    stream : { write : (message) => logger.http(message.trim())}
}));

app.get('/', (req,res) => {
    res.send("The server is running bro.");
});

app.use('/api/v1',districtRoutes);


app.use(errorHandler);

app.listen(PORT , () => {
    logger.info(`The server is Listening at http://localhost:${PORT}`)
});