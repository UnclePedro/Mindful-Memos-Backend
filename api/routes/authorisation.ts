import { WorkOS } from "@workos-inc/node";
import { Router, Request, Response } from "express";

export const authRouter = Router();

const workos = new WorkOS(process.env.WORKOS_API_KEY, {
  clientId: process.env.WORKOS_CLIENT_ID,
});

authRouter.get("/login", (req, res) => {
  console.log(process.env.WORKOS_CLIENT_ID);
  const authorizationUrl = workos.userManagement.getAuthorizationUrl({
    // Specify that we'd like AuthKit to handle the authentication flow
    provider: "authkit",

    // The callback endpoint that WorkOS will redirect to after a user authenticates
    redirectUri: "http://localhost:8080/callback",
    clientId: process.env.WORKOS_CLIENT_ID as string,
  });

  console.log(authorizationUrl);

  // Redirect the user to the AuthKit sign-in page
  res.redirect(authorizationUrl);
});

// authRouter.get("/callback", async (req, res) => {
//   // The authorization code returned by AuthKit
//   const code = req.query.code;

//   if (!code) {
//     return res.status(400).send("No code provided");
//   }

//   const { user } = await workos.userManagement.authenticateWithCode({
//     code,
//     clientId: process.env.WORKOS_CLIENT_ID as string,
//   });

//   // Use the information in `user` for further business logic.

//   // Redirect the user to the homepage
//   res.redirect("/");
//   return user;
// });
