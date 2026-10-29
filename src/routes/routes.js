import { Router } from "express";
import { userLogin, userRegister } from "../controllers/auth-controller.js";

const routes = Router();
routes.post("/register", userRegister);
routes.post("/login", userLogin);

export default routes;
