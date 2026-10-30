import { Router } from "express";
import {
  userList,
  userLogin,
  userRegister,
} from "../controllers/auth-controller.js";
import { auth } from "../middlewares/auth-middleware.js";

const routes = Router();
routes.post("/register", userRegister);
routes.post("/login", userLogin);
routes.get("/all", auth, userList);

export default routes;
