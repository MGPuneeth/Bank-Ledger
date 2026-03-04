import { userModel } from "../models/user.model.js";
import { tokenBlackListModel } from "../models/blacklist.model.js";
import jwt from "jsonwebtoken";
import { sendRegistrationEmail } from "../services/email.services.js";

async function userRegistrationController(req, res) {
  const { email, password, name } = req.body;

  const isExists = await userModel.findOne({
    email: email,
  });

  if (isExists) {
    return res
      .status(422)
      .json({ message: "User already exists", status: "failed" });
  }

  const user = await userModel.create({
    email: email,
    password: password,
    name: name,
  });

  const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });

  res.cookie("token", jwtToken);

  // send welcome email for new userss
  await sendRegistrationEmail(user.email, user.name);

  res.status(201).json({
    user: { _id: user._id, email: user.email, name: user.name },
    jwtToken,
  });
}

async function userLoginController(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return res.json({ message: "User not found" }).status(401);
  }

  const isValidPassword = await user.comparePassword(password);

  if (!isValidPassword) {
    return res.status(401).json({ message: "Invalid Password" });
  }

  const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });

  res.cookie("token", jwtToken);

  return res.status(200).json({
    user: { _id: user._id, email: user.email, name: user.name },
    jwtToken,
  });
}

async function userLogoutController(req, res) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token not found" });
  }

  res.clearCookie("token");
  await tokenBlackListModel.create({
    token: token,
  });

  return res.status(200).json({ message: "User logged out successfully" });
}
export {
  userRegistrationController,
  userLoginController,
  userLogoutController,
};
