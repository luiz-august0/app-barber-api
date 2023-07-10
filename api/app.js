import express from "express";
import cors from "cors";
import routes from "./routes";
import morgan from "morgan";

class App {
    constructor() {
        this.server = express();
        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.server.use(express.json({ limit: '50mb' }));
        this.server.use(express.urlencoded({ limit: '50mb', extended: true }))
        this.server.use(cors());
        this.server.use(morgan("dev"));
    }

    routes() {
        this.server.use(routes);
    }
}

export default new App().server;