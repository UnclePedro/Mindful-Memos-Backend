import { WorkOS } from "@workos-inc/node";
import { Router, Request, Response } from "express";
import cookieParser from "cookie-parser";
import { saveUser } from "../helpers/userHelper";
import { prisma } from "../helpers/prismaClient";

const workos = new WorkOS(process.env.WORKOS_API_KEY, {
  clientId: process.env.WORKOS_CLIENT_ID,
});

export const userRouter = Router();
userRouter.use(cookieParser());

userRouter.get("/login", (req, res) => {
  const authorizationUrl = workos.userManagement.getAuthorizationUrl({
    // Specify that we'd like AuthKit to handle the authentication flow
    provider: "authkit",

    // The callback endpoint that WorkOS will redirect to after a user authenticates
    redirectUri: "http://localhost:8080/callback",
    clientId: process.env.WORKOS_CLIENT_ID as string,
  });

  // Redirect the user to the AuthKit sign-in page
  res.redirect(authorizationUrl);
});

// Triggered after /login redirects
userRouter.get("/callback", async (req, res) => {
  // The authorization code returned by AuthKit
  const code = req.query.code as string;

  if (!code) {
    return res.status(400).send("No code provided");
  }

  try {
    const authenticateResponse =
      await workos.userManagement.authenticateWithCode({
        clientId: process.env.WORKOS_CLIENT_ID as string,
        code,
        session: {
          sealSession: true,
          cookiePassword: process.env.WORKOS_COOKIE_PASSWORD,
        },
      });

    const { sealedSession } = authenticateResponse;
    await saveUser(
      `${authenticateResponse.user.firstName} ${authenticateResponse.user.lastName}`,
      authenticateResponse.user.id
    ); // Saves new user to database

    // Store the session in a cookie
    res.cookie("wos-session", sealedSession, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.redirect("http://localhost:5173");
  } catch (error) {
    return res.redirect("http://localhost:8080/login");
  }
});

userRouter.get("/logout", async (req: Request, res: Response) => {
  const session = workos.userManagement.loadSealedSession({
    sessionData: req.cookies["wos-session"],
    cookiePassword: process.env.WORKOS_COOKIE_PASSWORD as string,
  });

  const url = await session.getLogoutUrl();

  res.clearCookie("wos-session");
  res.redirect(url);
});

userRouter.get("/validate-session", async (req, res) => {
  try {
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

    return res.status(200).json(user.id);
  } catch (error) {
    console.error("Session validation failed:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
