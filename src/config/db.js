import mongoose from "mongoose";
import { configDotenv } from "dotenv";

configDotenv();
const connectDB = async () => {
  await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("DB connected succesfully");
    })
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });
};

export default connectDB;
