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

const quotesArray = [
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

const userQuotes: [] = [];

// Select random quote from array
const getRandomQuote = () => {
  const randomIndex = Math.floor(Math.random() * quotesArray.length);
  return quotesArray[randomIndex].quote;
};

// Define a route handler for GET requests made to the /randomquote endpoint
app.get("/randomquote", (req: Request, res: Response) => {
  res.json(getRandomQuote());
});

// Route 2: Get a quote by index
app.get("/quote/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  // Validate that the index is within range
  if (id >= 0 && id < quotesArray.length) {
    res.json(quotesArray[id].quote);
  } else {
    res.status(404).json({ error: "Quote not found" });
  }
});

// Route 3: Get the total number of quotes
app.get("/total", (req: Request, res: Response) => {
  res.json(quotesArray.length);
});

// Post request to add new data to the server memory
app.post("/quotes", (req: Request, res: Response) => {
  console.log(req.body.quote);
  const newQuote = req.body.quote;
  // userQuotes.push(newQuote);

  // Send a success response back to the frontend
  res
    .status(201)
    .json({ message: "Quote added successfully", quote: newQuote });
});

// Route 4: Get new quotes user has added
app.get("/quotes", (req: Request, res: Response) => {
  console.log("Get quotes triggered");
  res.json(userQuotes);
  console.log(`User quotes: ${userQuotes}`);
});

// Start the server and listen for incoming HTTP requests on port 8080
app.listen(8080, () => {
  console.log("Server is running on http://localhost:8080");
});

// This is a crucial part of any Express application, as it actually puts the server in a state where it can start handling incoming requests.
