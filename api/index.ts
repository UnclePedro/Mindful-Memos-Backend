import express, { Request, Response } from "express"; // Import express and the Request and Response types
import cors from "cors"; // Import the CORS middleware, which allows your server to handle cross-origin requests. Server updates changes without reboot
import { PrismaClient } from "@prisma/client";
import quotesRouter from "./routes/quotes";
import userRouter from "./routes/user";

export const app = express();
export const prisma = new PrismaClient();

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors);

// Define your routes
app.use("/", quotesRouter);
app.use("/", userRouter);

app.listen(8080, () => {
  console.log("Server is running.");
  console.log("Database URL:", process.env.POSTGRES_PRISMA_URL);
});
