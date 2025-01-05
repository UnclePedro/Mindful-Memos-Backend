import { Router, Request, Response } from "express";
import {
  getRandomQuote,
  getUserQuotes,
  addQuote,
  // deleteQuote,
} from "../helpers/quotesHelper";
import { prisma } from "../helpers/prismaClient";
import { WorkOS } from "@workos-inc/node";
import cookieParser from "cookie-parser";

const workos = new WorkOS(process.env.WORKOS_API_KEY, {
  clientId: process.env.WORKOS_CLIENT_ID as string,
});

export const quotesRouter = Router();
quotesRouter.use(cookieParser());

quotesRouter.get("/randomQuote", async (req: Request, res: Response) => {
  res.json(await getRandomQuote());
});

quotesRouter.get("/getUserQuotes", async (req: Request, res: Response) => {
  res.json(await getUserQuotes());
});

quotesRouter.post("/addQuote", async (req, res) => {
  try {
    // Session and user auth needs to be abstracted into helper function
    const session = workos.userManagement.loadSealedSession({
      sessionData: req.cookies["wos-session"],
      cookiePassword: process.env.WORKOS_COOKIE_PASSWORD as string,
    });

    const authResponse = await session.authenticate();

    // Check if the response indicates successful authentication
    if (!authResponse.authenticated) {
      console.log("authresponse.authenticated failed");
      return res.status(401).json({ error: "Unauthorized" });
    }
    const user = await prisma.user.findUnique({
      where: {
        authKey: authResponse.user.id,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { quote, author } = req.body;
    const newQuote = await addQuote(quote, author, user.id);
    res.status(200).json({ newQuote });
  } catch (error) {
    console.error("Failed to authenticate or process request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// quotesRouter.delete("/deleteQuote", async (req: Request, res: Response) => {
//   await deleteQuote(req.body.id, req.body.apiKey);
//   const updatedUserQuotes = await getUserQuotes();

//   res.status(200).json({
//     message: "Quote deleted successfully",
//     quotes: updatedUserQuotes,
//   });
// });
