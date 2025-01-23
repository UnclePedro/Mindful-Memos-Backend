import { WorkOS } from "@workos-inc/node";
import { Router, Request, Response } from "express";
import cookieParser from "cookie-parser";
import { refreshSession, saveUser, getUser } from "../helpers/userHelper";
import {
  frontendUrl,
  backendUrl,
  cookiesDomian,
} from "../config/endpointConfig";

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
      domain: cookiesDomian,
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

  res.clearCookie("wos-session", {
    domain: ".mindful-memos.peterforsyth.dev",
    path: "/",
  });
  res.redirect(url);
});

userRouter.get("/getUser", refreshSession, async (req, res) => {
  try {
    const user = await getUser(req);
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error getting user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
