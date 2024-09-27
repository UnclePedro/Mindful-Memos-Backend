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

const draculaQuotes = [
  {
    quote: "We really out here.",
  },
  {
    quote:
      "Smoking on Congolese dickwick. Looking for a signal. I went dark a long time ago.",
  },
  {
    quote: "Real premium French scatatouille. Money longer than KD's feet.",
  },
  {
    quote:
      "This shit ain't nothing to me man. I fuck like it's for survival. As if it's the last sip of water I'll ever get.",
  },
  {
    quote:
      "I'm so violent and sick in the head. I can't tell if I want to kill my opps or fuck em.",
  },
  {
    quote:
      "Zazah got me feeling like everything gonna be alright. Got the registered god particle on my hip.",
  },
];

// Prisma
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function getDatabaseQuotes() {
  const allQuotes = await prisma.quote.findMany();
  return allQuotes;
}

async function addDatabaseQuote(quote: string) {
  await prisma.quote.create({
    data: {
      quote,
    },
  });
}

async function deleteDatabaseQuote(quoteId: number) {
  // Delete the quote where the id matches the provided quoteId
  await prisma.quote.delete({
    where: {
      id: quoteId,
    },
  });
}

// Select random quote from array
const getRandomQuote = () => {
  const randomIndex = Math.floor(Math.random() * draculaQuotes.length);
  return draculaQuotes[randomIndex].quote;
};

// Define a route handler for GET requests made to the /randomquote endpoint
app.get("/randomquote", (req: Request, res: Response) => {
  res.json(getRandomQuote());
});

// Route 2: Get a quote by index
app.get("/quote/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  // Validate that the index is within range
  if (id >= 0 && id < draculaQuotes.length) {
    res.json(draculaQuotes[id].quote);
  } else {
    res.status(404).json({ error: "Quote not found" });
  }
});

// Route 3: Get the total number of quotes
app.get("/total", (req: Request, res: Response) => {
  res.json(draculaQuotes.length);
});

// Post request to add new data to the server memory
app.post("/quotes", (req: Request, res: Response) => {
  addDatabaseQuote(req.body.quote);
  res
    .status(201)
    .json({ message: "Quote added successfully", quote: req.body.quote });
});

// Post request to add new data to the server memory
app.delete("/deleteQuote", async (req: Request, res: Response) => {
  // Perform deletion of the quote
  await deleteDatabaseQuote(req.body.id);

  // Fetch the updated list of quotes after deletion
  const updatedQuotes = await getDatabaseQuotes();

  // Return the updated list of quotes to the client
  res.status(200).json({
    message: "Quote deleted successfully",
    quotes: updatedQuotes, // Send the updated quotes back to the client
  });
});

// Route 4: Get new quotes user has added
app.get("/quotes", async (req: Request, res: Response) => {
  const allDatabaseQuotes = await getDatabaseQuotes();
  res.json(allDatabaseQuotes);
});

// Start the server and listen for incoming HTTP requests on port 8080
app.listen(8080, () => {
  console.log("Server is running on http://localhost:8080");
});

// This is a crucial part of any Express application, as it actually puts the server in a state where it can start handling incoming requests.
