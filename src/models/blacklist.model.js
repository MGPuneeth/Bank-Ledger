import mongoose, { now } from "mongoose";

const tokenBlackListSchema = mongoose.Schema(
  {
    token: {
      type: String,
      required: [true, "Token is necessary to make it blacklist"],
      unique: [true, "Token is already blacklisted"],
    },
  },
  {
    timeStamps: true,
  },
);

tokenBlackListSchema.index(
  {
    createdAt: 1,
  },
  {
    expireAfterSeconds: 60 * 60 * 24 * 3,
  },
);

const tokenBlackListModel = new mongoose.model(
  "blacklistToken",
  tokenBlackListSchema,
);
export { tokenBlackListModel };
