import express from "express";
import UserController from "../controllers/UserController";
import { jwtParse } from "../middleware/auth";

const router = express.Router();

router.post("/register", UserController.createUser);
router.post("/login", UserController.loginUser);
router.get("/me", jwtParse, UserController.getUser);
router.put("/me", jwtParse, UserController.updateUser);

export default router;
