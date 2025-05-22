import express from "express";
import UserController from "../controllers/UserController";
import { jwtCheck, jwtParse } from "../middleware/auth";

const router = express.Router();

router.post("/register", UserController.createUser);
router.post("/login", UserController.loginUser);

export default router;
