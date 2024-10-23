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
  authorId: number,
  isUserQuote: boolean = true
) {
  await prisma.quote.create({
    data: {
      quote,
      author,
      isUserQuote,
      user: {
        connect: { id: authorId }, // Connect the quote to the user using their ID
      },
    },
  });
}

app.post("/addQuote", async (req, res) => {
  const { quote, author, apiKey } = req.body;

  try {
    // Fetch the user based on the provided apiKey
    const user = await prisma.user.findUnique({
      where: { apiKey },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const newQuote = await addQuote(quote, author, user.id);
    res.status(200).json({ newQuote });
  } catch (error) {
    res.status(500).json({ error: "Failed to add quote" });
  }
});
async function deleteQuote(quoteId: number, apiKey: string) {
  // Retrieve the quote to check the associated authorId
  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
    select: { authorId: true }, // Select the authorId based on the quoteId
  });

  // If the quote doesn't exist, throw an error
  if (!quote) {
    throw new Error("Quote not found");
  }

  // Retrieve the user to check the apiKey
  const user = await prisma.user.findUnique({
    where: { id: quote.authorId },
    select: { apiKey: true },
  });

  // If the user doesn't exist or the apiKey does not match, throw an error
  if (!user) {
    throw new Error("User not found");
  }
  if (user.apiKey !== apiKey) {
    throw new Error("Unauthorized: API key does not match");
  }

  // Proceed with deletion if the apiKey matches
  await prisma.quote.delete({
    where: {
      id: quoteId,
    },
  });
}

app.delete("/deleteQuote", async (req: Request, res: Response) => {
  await deleteQuote(req.body.id, req.body.apiKey);
  const updatedUserQuotes = await getUserQuotes();

  res.status(200).json({
    message: "Quote deleted successfully",
    quotes: updatedUserQuotes,
  });
});

interface User {
  id: number;
  apiKey: string;
}

// Function to create a new user with random username and API key
const newUser = async () => {
  const apiKey = crypto.randomBytes(32).toString("hex");

  // Store the user with the username and API key in the database
  const newUser: User = await prisma.user.create({
    data: {
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
      newUser: newUserData,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create user: backend" });
  }
});

app.listen(8080, () => {
  console.log("Server is running.");
  console.log("Database URL:", process.env.POSTGRES_PRISMA_URL);
});
