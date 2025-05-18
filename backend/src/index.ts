import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoute from "./routes/MyUserRoute";
import { v2 as cloudinary } from "cloudinary";
import recordRoute from "./routes/RecordRoute";
import researchRoute from "./routes/ResearchRoute";
import path from 'path';
import analyticsRoute from "./routes/AnalyticsRoute";

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log("Connected to database!"));

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

const app = express();

app.use(cors());

app.use("/api/order/checkout/webhook", express.raw({ type: "*/*" })); 

app.use(express.json());

app.get("/health", async (req: Request, res: Response)=>{
  res.send({message: "health OK!"});
});

app.use("/api/my/user", myUserRoute);
app.use("/api/record", recordRoute);
app.use("/api/research", researchRoute);
app.use("/api/analytics", analyticsRoute);

app.use('/static', express.static(path.join(__dirname, '..', 'public')));

app.listen(5000, () => {
  console.log("Server is starting on port 5000");
});
