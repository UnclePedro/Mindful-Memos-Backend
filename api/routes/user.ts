import { WorkOS } from "@workos-inc/node";
import { Router, Request, Response } from "express";
import cookieParser from "cookie-parser";
import { refreshSession, saveUser, validateUser } from "../helpers/userHelper";

// https://api.mindful-memos.peterforsyth.dev
// http://localhost:8080
const backendUrl = "http://localhost:8080";

// https://mindful-memos.peterforsyth.dev
// http://localhost:5173
const frontendUrl = "http://localhost:5173";

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
    redirectUri: `${backendUrl}/callback`,
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
      authenticateResponse.user.id,
      authenticateResponse.user.profilePictureUrl
    ); // Saves new user to database

    // Store the session in a cookie
    res.cookie("wos-session", sealedSession, {
      path: "/",
      httpOnly: false,
      secure: true,
      sameSite: "none",
    });

    res.redirect(frontendUrl);
  } catch (error) {
    return res.redirect(`${backendUrl}/login`);
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

userRouter.get("/validateSession", refreshSession, async (req, res) => {
  const session = workos.userManagement.loadSealedSession({
    sessionData: req.cookies["wos-session"],
    cookiePassword: process.env.WORKOS_COOKIE_PASSWORD as string,
  });

  const authResponse = await session.authenticate();

  if (!authResponse.authenticated) {
    console.log("authresponse.authenticated failed");
    return res.status(401).json({ error: "Unauthorized" });
  }
  return res.status(200).json(authResponse.user);
});
