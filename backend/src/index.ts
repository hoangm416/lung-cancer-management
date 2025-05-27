import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoute from "./routes/UserRoute";
import recordRoute from "./routes/RecordRoute";
import researchRoute from "./routes/ResearchRoute";
import path from 'path';
import analyticsRoute from "./routes/AnalyticsRoute";
import userRoute from "./routes/UserRoute";

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log("Connected to database!"));

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", async (req: Request, res: Response)=>{
  res.send({message: "health OK!"});
});

app.use("/api/my/user", myUserRoute);
app.use("/api/record", recordRoute);
app.use("/api/research", researchRoute);
app.use("/api/analytics", analyticsRoute);
app.use("/api/auth", userRoute);

app.use('/static', express.static(path.join(__dirname, '..', 'public')));

app.listen(5000, () => {
  console.log("Server is starting on port 5000");
});
