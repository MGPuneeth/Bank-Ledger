import { accountModel } from "../models/account.model.js";
import jwt from "jsonwebtoken";
import { userModel } from "../models/user.model.js";
import { tokenBlackListModel } from "../models/blacklist.model.js";
import "dotenv/config";

async function authMiddleware(req, res, next) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  // console.log(token);

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized access, token is missing",
    });
  }

  const isBlackListed = await tokenBlackListModel.findOne({
    token: token,
  });

  if (isBlackListed) {
    return res.status(401).json({
      message: "Unauthorized access, token is invalid",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);

    const user = await userModel.findOne({
      _id: decoded.userId,
    });
    // console.log(user);

    req.user = user;
    next();
  } catch (error) {
    console.log(error);

    return res
      .status(401)
      .json({ message: "Unauthorized access, Token invalid " });
  }
}

async function authSystemUserMiddleware(req, res, next) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Unquthorized access, token is missing",
    });
  }

  const isBlackListed = await tokenBlackListModel.findOne({
    token: token,
  });

  if (isBlackListed) {
    return res.status(401).json({
      message: "Unauthorized access, token is invalid",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.userId).select("+systemUser");

    if (!user.systemUser) {
      return res.status(403).json({
        message: "Forbidden access, not a system user",
      });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized access, token is invalid",
    });
  }
}

export { authMiddleware, authSystemUserMiddleware };
