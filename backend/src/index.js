import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/database.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser"
import messageRoutes from "./routes/message.route.js"
dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});
app.listen(PORT, () => {
  console.log(`app is running and listening on port ${PORT}`);
  connectDB();
});
