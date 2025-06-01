import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/database.js";
import authRoutes from "./routes/auth.route.js";

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

dotenv.config();
const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Hello World");
});
app.listen(PORT, () => {
  console.log(`app is running and listening on port ${PORT}`);
  connectDB();
});
