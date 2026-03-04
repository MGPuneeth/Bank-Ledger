import { accountModel } from "../models/account.model.js";

async function createUserAccount(req, res) {
  const user = req.user;

  const account = await accountModel.create({
    user: user._id,
  });

  res.status(201).json({
    account,
  });
}

async function getUserAccountController(req, res) {
  const account = await accountModel.find({
    user: req.user._id,
  });
  if (!account) {
    return res.status(402).json({ message: "Account not found" });
  }

  return res.status(200).json({
    account,
  });
}

async function getUserAccountBalanceController(req, res) {
  const { accountId } = req.params;
  const account = await accountModel.findOne({
    _id: accountId,
    user: req.user._id,
  });

  if (!account) {
    return res.status(402).json({
      message: "Account not found or unauthorized access",
    });
  }

  const balance = await account.getBalance();
  return res.status(200).json({ accountId: account._id, balance: balance });
}
export {
  createUserAccount,
  getUserAccountController,
  getUserAccountBalanceController,
};
