import express, { Request, Response } from "express"; // Import express and the Request and Response types
const app = express(); // Create an Express application instance
import cors from "cors"; // Import the CORS middleware, which allows your server to handle cross-origin requests. Server updates changes without reboot
const corsOptions = {
  origin: [
    "https://daily-dracula-flow.vercel.app",
    "http://localhost:5173",
    "https://random-quote-generator-api.vercel.app",
  ],
}; // Define CORS options, restricting access to your server from only this specific origin
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors(corsOptions)); // Apply CORS middleware with the specified options to the Express app
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function addQuote(
  quote: string,
  author: string,
  isUserQuote: boolean = true
) {
  await prisma.quote.create({
    data: {
      quote,
      author,
      isUserQuote, // Explicitly set whether the quote is a user quote or not
    },
  });
}

// async function loadInspirationalQuotes() {
//   for (const { quote, author } of inspirationalQuotes) {
//     await addQuote(quote, author, false); // Set isUserQuote to false for predefined quotes
//   }
//   console.log("Inspirational quotes loaded successfully!");
// }

async function deleteQuote(quoteId: number) {
  await prisma.quote.delete({
    where: {
      id: quoteId,
    },
  });
}

async function getUserQuotes() {
  return await prisma.quote.findMany({
    where: {
      isUserQuote: true,
    },
  });
}

const getRandomQuote = async () => {
  const allQuotes = await prisma.quote.findMany();
  const randomIndex = Math.floor(Math.random() * allQuotes.length);
  return allQuotes[randomIndex];
};

// Define a route handler for GET requests made to the /randomquote endpoint
app.get("/randomquote", async (req: Request, res: Response) => {
  res.json(await getRandomQuote());
});

// Add new quote to database
app.post("/quotes", (req: Request, res: Response) => {
  addQuote(req.body.quote, req.body.author);
  res
    .status(201)
    .json({ message: "Quote added successfully", quote: req.body.quote });
});

// Delete quote from database
app.delete("/deleteQuote", async (req: Request, res: Response) => {
  // Perform deletion of the quote
  await deleteQuote(req.body.id);

  // Fetch the updated list of quotes after deletion
  const updatedUserQuotes = await getUserQuotes();

  // Return the updated list of quotes to the client
  res.status(200).json({
    message: "Quote deleted successfully",
    quotes: updatedUserQuotes, // Send the updated quotes back to the client
  });
});

// Get new quotes user has added
app.get("/quotes", async (req: Request, res: Response) => {
  res.json(await getUserQuotes());
});

app.listen(8080, () => {
  console.log("Server is running on http://localhost:8080");
});
