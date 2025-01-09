import express from "express";
import cors from "cors"; // Import the CORS middleware, which allows your server to handle cross-origin requests & server updates changes without reboot
import { quotesRouter } from "./routes/quotes";
import { userRouter } from "./routes/user";

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://api.mindful-memos.peterforsyth.dev",
    "https://mindful-memos.peterforsyth.dev",
  ],
  credentials: true,
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
