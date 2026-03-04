import express from "express";
import {
  authMiddleware,
  authSystemUserMiddleware,
} from "../middleware/auth.middleware.js";
import {
  transactionController,
  createInitialFundsTransaction,
} from "../controllers/transaction.controller.js";

const router = express.Router();

router.post("/", authMiddleware, transactionController);

router.post(
  "/system/initial-funds",
  authSystemUserMiddleware,
  createInitialFundsTransaction,
);

export default router;
