import express from "express";
import cors from "cors";
import {prisma} from "./config/prisma.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({message: "Welcome to GH MAnagement System"});
});

export default app;
