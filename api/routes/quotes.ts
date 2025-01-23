import { Router, Request, Response } from "express";
import {
  getRandomQuote,
  getUserQuotes,
  addQuote,
  deleteQuote,
} from "../helpers/quotesHelper";
import cookieParser from "cookie-parser";
import { getUser, refreshSession } from "../helpers/userHelper";

export const quotesRouter = Router();
quotesRouter.use(cookieParser());

quotesRouter.get("/randomQuote", async (req: Request, res: Response) => {
  res.json(await getRandomQuote());
});

quotesRouter.get("/getUserQuotes", async (req: Request, res: Response) => {
  res.json(await getUserQuotes());
});

quotesRouter.post("/addQuote", refreshSession, async (req, res) => {
  try {
    const user = await getUser(req);

    const { quote, author } = req.body;
    const updatedUserQuotes = await addQuote(quote, author, user.id);

    res.status(200).json({
      updatedUserQuotes,
    });
  } catch (error) {
    console.error("Failed to authenticate or process request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

quotesRouter.delete(
  "/deleteQuote/:quoteId",
  refreshSession,
  async (req: Request, res: Response) => {
    try {
      await getUser(req);

      const { quoteId } = req.params;
      await deleteQuote(parseInt(quoteId, 10));
      const updatedUserQuotes = await getUserQuotes();
      res.status(200).json({
        message: "Quote deleted successfully",
        quotes: updatedUserQuotes,
      });
    } catch (error) {
      console.error("Failed to delete quote:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);
