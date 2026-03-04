import express from "express";
import {
  createUserAccount,
  getUserAccountController,
  getUserAccountBalanceController,
} from "../controllers/account.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createUserAccount);
router.get("/", authMiddleware, getUserAccountController);
router.get(
  "/balance/:accountId",
  authMiddleware,
  getUserAccountBalanceController,
);

export default router;
