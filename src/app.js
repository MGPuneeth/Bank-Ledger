import express from "express";

import cookieParser from "cookie-parser";

const app = express();

// Importing routes
import authRouter from "./routes/auth.routes.js";
import accountRouter from "./routes/account.route.js";
import transactionRouter from "./routes/transacrion.route.js";
app.use(express.json()); //middleware to read req body
app.use(cookieParser());

// routes usage
app.get("/", (req, res) => {
  res.send("Bank Ledger server is up and running");
});
app.use("/api/auth", authRouter);
app.use("/api/account", accountRouter);
app.use("/api/transactions", transactionRouter);
export default app;
