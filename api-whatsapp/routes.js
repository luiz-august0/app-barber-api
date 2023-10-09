import { Router } from "express";
import WPController from "./routes/WPController";

const routes = new Router();

routes.post('/barberwp/mensagem', WPController.sendMessage);

export default routes;