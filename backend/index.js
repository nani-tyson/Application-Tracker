import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

//configs
import connectDB from "./config/db.js";
//routes

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
