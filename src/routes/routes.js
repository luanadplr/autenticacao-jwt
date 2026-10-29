import { Router } from "express";
import { userRegister } from "../controllers/auth-controller.js";

const routes = Router();
routes.post("/", userRegister);

export default routes;
