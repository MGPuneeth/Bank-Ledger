import { transactionModel } from "../models/transaction.model.js";
import { accountModel } from "../models/account.model.js";
import { ledgerModel } from "../models/ledger.model.js";
import {
  sendTransactionEmail,
  sendTransactionFailureEmail,
} from "../services/email.services.js";
import mongoose from "mongoose";

async function transactionController(req, res) {
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message: "fromAccount, toAccount, amount, idempotencyKey are required",
    });
  }

  const fromUserAccount = await accountModel.findOne({
    _id: fromAccount,
  });

  const toUserAccount = await accountModel.findOne({
    _id: toAccount,
  });

  if (!fromUserAccount || !toUserAccount) {
    return res.status(400).json({
      message: "fromAccount or toAccount does not exist",
    });
  }

  //   validate idempotency key

  const isTransactionAlreadyExists = await transactionModel.findOne({
    idempotencyKey: idempotencyKey,
  });
  if (isTransactionAlreadyExists) {
    if (isTransactionAlreadyExists.status == "COMPLETED") {
      return res.status(200).json({
        message: "Transaction already processed",
        transaction: isTransactionAlreadyExists,
      });
    }
    if (isTransactionAlreadyExists.status == "PENDING") {
      return res.status(200).json({
        message: "Transaction is pending",
      });
    }
    if (isTransactionAlreadyExists.status == "FAILED") {
      return res.status(409).json({
        message: "Transaction has failed",
      });
    } else {
      return res.status(500).json({
        message: "Transaction has rolled back. Try again",
      });
    }
  }

  if (
    fromUserAccount.status !== "ACTIVE" ||
    toUserAccount.status !== "ACTIVE"
  ) {
    return res.status(400).json({
      message: "fromAccount or toAccount is not active",
    });
  }
  // console.log(fromAccount);

  //   derive sender balance
  const balance = await fromUserAccount.getBalance();
  if (balance < amount) {
    return res.status(400).json({
      message: `Insufficient balance. \nCurrent balance: ${balance} \nTransfer amount: ${amount}`,
    });
  }

  console.log(balance);

  // create transaction
  const session = await mongoose.startSession();
  let transaction;
  try {
    session.startTransaction(); //Helps in maintaining atomicity

    console.log("transaction initiated");
    transaction = (
      await transactionModel.create(
        [
          {
            fromAccount,
            toAccount,
            amount,
            status: "PENDING",
            idempotencyKey,
          },
        ],
        { session },
      )
    )[0];

    const debitLedgerEntry = await ledgerModel.create(
      [
        {
          account: fromAccount,
          amount: amount,
          transaction: transaction._id,
          type: "DEBIT",
        },
      ],
      { session },
    );
    console.log("Debit complete");

    await (() => {
      return new Promise((resolve) => setTimeout(resolve, 15 * 1000));
    });
    const creditLedgerEntry = await ledgerModel.create(
      [
        {
          account: toAccount,
          amount: amount,
          transaction: transaction._id,
          type: "CREDIT",
        },
      ],
      { session },
    );
    console.log("Credits complete");

    await transactionModel.findOneAndUpdate(
      { _id: transaction._id },
      { status: "COMPLETED" },
      { session },
    );

    transaction.status = "COMPLETED";
    await transaction.save({ session });

    await session.commitTransaction();
  } catch (err) {
    console.error("Transaction failed:", err);
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    return res.status(400).json({
      message: "Transaction failed and was rolled back. Please retry",
    });
  } finally {
    await session.endSession();
  }

  // Send Email
  await sendTransactionEmail(req.user.email, req.user.name, amount, toAccount);

  return res.status(201).json({
    message: "Transaction completed succesfully",
    transaction: transaction,
  });
}

async function createInitialFundsTransaction(req, res) {
  const { toAccount, amount, idempotencyKey } = req.body;

  if (!toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message: "fromAccount, toAccount, amount, idempotencyKey are required",
    });
  }

  const toUserAccount = await accountModel.findOne({
    _id: toAccount,
  });

  if (!toUserAccount) {
    return res.status(400).json({
      message: "fromAccount or toAccount does not exist",
    });
  }

  const fromUserAccount = await accountModel.findOne({
    user: req.user._id,
  });

  if (!fromUserAccount) {
    return res.status(400).json({
      message: " System User account not found",
    });
  }

  const session = await mongoose.startSession();
  let transaction;
  try {
    session.startTransaction();

    transaction = new transactionModel({
      fromAccount: fromUserAccount._id,
      toAccount,
      amount,
      idempotencyKey,
      status: "PENDING",
    });

    const debitLedgerEntry = await ledgerModel.create(
      [
        {
          account: fromUserAccount._id,
          amount,
          transaction: transaction._id,
          type: "DEBIT",
        },
      ],
      { session },
    );
    const creditLedgerEntry = await ledgerModel.create(
      [
        {
          account: toAccount,
          amount,
          transaction: transaction._id,
          type: "CREDIT",
        },
      ],
      { session },
    );

    transaction.status = "COMPLETED";
    await transaction.save({ session });

    await session.commitTransaction();
  } catch (err) {
    console.error("Initial funds transaction failed:", err);
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    return res.status(400).json({
      message: "Transaction failed and was rolled back. Please retry",
    });
  } finally {
    await session.endSession();
  }

  // Send Email
  await sendTransactionEmail(req.user.email, req.user.name, amount, toAccount);

  return res.status(201).json({
    message: "Ttransaction completed succesfully",
    transaction: transaction,
  });
}
export { transactionController, createInitialFundsTransaction };
