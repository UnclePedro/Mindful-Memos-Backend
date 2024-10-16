import express, { Request, Response } from "express"; // Import express and the Request and Response types
const app = express(); // Create an Express application instance
import cors from "cors"; // Import the CORS middleware, which allows your server to handle cross-origin requests. Server updates changes without reboot
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://random-quote-generator-api.vercel.app",
    "https://mindful-memos.peterforsyth.dev",
  ],
}; // Define CORS options, restricting access to your server from only this specific origin
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors(corsOptions)); // Apply CORS middleware with the specified options to the Express app
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import crypto from "crypto";

// async function loadInspirationalQuotes() {
//   for (const { quote, author } of inspirationalQuotes) {
//     await addQuote(quote, author, "", false); // Set isUserQuote to false for predefined quotes
//   }
//   console.log("Inspirational quotes loaded successfully!");
// }

const getRandomQuote = async () => {
  const allQuotes = await prisma.quote.findMany();
  const randomIndex = Math.floor(Math.random() * allQuotes.length);
  return allQuotes[randomIndex];
};

// Define a route handler for GET requests made to the /randomquote endpoint
app.get("/randomQuote", async (req: Request, res: Response) => {
  res.json(await getRandomQuote());
});

async function getUserQuotes() {
  return await prisma.quote.findMany({
    where: {
      isUserQuote: true,
    },
  });
}

// Get new quotes user has added
app.get("/getUserQuotes", async (req: Request, res: Response) => {
  res.json(await getUserQuotes());
});

async function addQuote(
  quote: string,
  author: string,
  userId: string,
  isUserQuote: boolean = true
) {
  await prisma.quote.create({
    data: {
      quote,
      author,
      userId,
      isUserQuote,
    },
  });
}

// Add new quote to database
app.post("/addQuote", async (req: Request, res: Response) => {
  addQuote(req.body.quote, req.body.author, req.body.userId);

  const updatedUserQuotes = await getUserQuotes();

  res
    .status(201)
    .json({ message: "Quote added successfully", quotes: updatedUserQuotes });
});

async function deleteQuote(quoteId: number) {
  await prisma.quote.delete({
    where: {
      quoteId: quoteId,
    },
  });
}

// Delete quote from database
app.delete("/deleteQuote", async (req: Request, res: Response) => {
  // Perform deletion of the quote
  await deleteQuote(req.body.quoteId);

  // Fetch the updated list of quotes after deletion
  const updatedUserQuotes = await getUserQuotes();

  // Return the updated list of quotes to the client
  res.status(200).json({
    message: "Quote deleted successfully",
    quotes: updatedUserQuotes, // Send the updated quotes back to the client
  });
});

interface User {
  username: string;
  apiKey: string;
}

// Function to create a new user with random username and API key
const newUser = async () => {
  const username = crypto.randomBytes(8).toString("hex");
  const apiKey = crypto.randomBytes(32).toString("hex");

  // Store the user with the username and API key in the database
  const newUser: User = await prisma.user.create({
    data: {
      username,
      apiKey,
    },
  });

  // Return the API key (and username, if needed) to the caller
  return newUser;
};

app.post("/generateUser", async (req: Request, res: Response) => {
  try {
    const newUserData: User = await newUser(); // Create a new user with an API key
    res.status(201).json({
      message: "User created successfully",
      newUserData: newUserData,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
});

app.listen(8080, () => {
  console.log("Server is running.");
});
