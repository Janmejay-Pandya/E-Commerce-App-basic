import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import authRoute from "./src/routes/authRoutes.js";
import prodRoute from "./src/routes/productRoutes.js";
import orderRoute from "./src/routes/orderRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoute);
app.use("/api/prod", prodRoute);
app.use("/api/order", orderRoute);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
