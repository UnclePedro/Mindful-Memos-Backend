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

const inspirationalQuotes = [
  {
    quote: "A comfort zone is a beautiful place, but nothing ever grows there.",
    author: "John Assaraf",
  },
  {
    quote:
      "It's only after you've stepped out of your comfort zone that you begin to change, grow, and transform.",
    author: "Roy T. Bennett",
  },
  {
    quote: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
  },
  {
    quote: "Act as if what you do makes a difference. It does.",
    author: "William James",
  },
  {
    quote: "Do what you can, with what you have, where you are.",
    author: "Theodore Roosevelt",
  },
  {
    quote:
      "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    author: "Winston Churchill",
  },
  {
    quote:
      "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
    author: "Ralph Waldo Emerson",
  },
  {
    quote: "Don’t watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
  },
  {
    quote: "Your time is limited, don’t waste it living someone else’s life.",
    author: "Steve Jobs",
  },
  {
    quote: "Start where you are. Use what you have. Do what you can.",
    author: "Arthur Ashe",
  },
  {
    quote: "The only impossible journey is the one you never begin.",
    author: "Tony Robbins",
  },
  { quote: "What we think, we become.", author: "Buddha" },
  {
    quote: "If opportunity doesn’t knock, build a door.",
    author: "Milton Berle",
  },
  {
    quote: "Strive not to be a success, but rather to be of value.",
    author: "Albert Einstein",
  },
  {
    quote: "You are never too old to set another goal or to dream a new dream.",
    author: "C.S. Lewis",
  },
  {
    quote: "The journey of a thousand miles begins with one step.",
    author: "Lao Tzu",
  },
  {
    quote: "Don't wait. The time will never be just right.",
    author: "Napoleon Hill",
  },
  {
    quote: "Believe and act as if it were impossible to fail.",
    author: "Charles Kettering",
  },
  {
    quote:
      "Failure will never overtake me if my determination to succeed is strong enough.",
    author: "Og Mandino",
  },
  { quote: "We become what we think about.", author: "Earl Nightingale" },
  {
    quote: "It always seems impossible until it’s done.",
    author: "Nelson Mandela",
  },
  {
    quote: "Life is 10% what happens to us and 90% how we react to it.",
    author: "Charles R. Swindoll",
  },
  {
    quote: "With the new day comes new strength and new thoughts.",
    author: "Eleanor Roosevelt",
  },
  {
    quote: "The power of imagination makes us infinite.",
    author: "John Muir",
  },
  {
    quote: "Action is the foundational key to all success.",
    author: "Pablo Picasso",
  },
  {
    quote:
      "The only way to achieve the impossible is to believe it is possible.",
    author: "Charles Kingsleigh",
  },
  { quote: "The best way out is always through.", author: "Robert Frost" },
  {
    quote: "Success is not in what you have, but who you are.",
    author: "Bo Bennett",
  },
  {
    quote: "Your life does not get better by chance, it gets better by change.",
    author: "Jim Rohn",
  },
  {
    quote: "Small deeds done are better than great deeds planned.",
    author: "Peter Marshall",
  },
  {
    quote: "Great things never came from comfort zones.",
    author: "Ben Francia",
  },
  {
    quote: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius",
  },
  {
    quote: "Take it to send-town.",
    author: "Harry Armitage Bath",
    source: "Harry",
  },
  {
    quote: "It's a hundred million degrees right now!",
    author: "Adam Ondra",
    source: "unknown YouTube video",
  },
  {
    quote: "You can't look at a problem, you've gotta look through a problem.",
    author: "Bugzy Malone",
    source: "Movin'",
  },
  {
    quote:
      "I'm tellin' my bro don't quit. Put in the work and your time will come.",
    author: "Central Cee",
    source: "Tension",
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
  const randomIndex = Math.floor(Math.random() * inspirationalQuotes.length);
  return inspirationalQuotes[randomIndex];
};

// Define a route handler for GET requests made to the /randomquote endpoint
app.get("/randomquote", (req: Request, res: Response) => {
  res.json(getRandomQuote());
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
