import { Router, Request, Response } from "express";

import {
  getRandomQuote,
  getUserQuotes,
  addQuote,
  deleteQuote,
} from "../helpers/quotesHelper";
import { prisma } from "../helpers/prismaClient";

export const quotesRouter = Router();

quotesRouter.get("/randomQuote", async (req: Request, res: Response) => {
  res.json(await getRandomQuote());
});

quotesRouter.get("/getUserQuotes", async (req: Request, res: Response) => {
  res.json(await getUserQuotes());
});

quotesRouter.post("/addQuote", async (req, res) => {
  const { quote, author, authorId, apiKey } = req.body;

  try {
    // Fetch the user based on the provided apiKey
    const user = await prisma.user.findUnique({
      where: { apiKey },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user.id !== authorId) {
      return res.status(404).json({ error: "User not found" });
    }

    const newQuote = await addQuote(quote, author, user.id);
    res.status(200).json({ newQuote });
  } catch (error) {
    res.status(500).json({ error: "Failed to add quote" });
  }
});

quotesRouter.delete("/deleteQuote", async (req: Request, res: Response) => {
  await deleteQuote(req.body.id, req.body.apiKey);
  const updatedUserQuotes = await getUserQuotes();

  res.status(200).json({
    message: "Quote deleted successfully",
    quotes: updatedUserQuotes,
  });
});
