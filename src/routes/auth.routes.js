import express from "express";
import {
  userRegistrationController,
  userLoginController,
  userLogoutController,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", userRegistrationController);
router.post("/login", userLoginController);
router.post("/logout", userLogoutController);

export default router;
