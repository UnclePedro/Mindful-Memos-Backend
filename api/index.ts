import express from "express";
import cors from "cors"; // Import the CORS middleware, which allows your server to handle cross-origin requests & server updates changes without reboot
import { userRouter } from "./routes/user";
import { quotesRouter } from "./routes/quotes";

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://random-quote-generator-api.vercel.app",
    "https://mindful-memos.peterforsyth.dev",
  ],
};

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors(corsOptions)); // Apply CORS middleware with the specified options to the Express app

app.use("/", quotesRouter);
app.use("/", userRouter);

app.listen(8080, () => {
  console.log("Server is running.");
  console.log("Database URL:", process.env.POSTGRES_PRISMA_URL);
});
