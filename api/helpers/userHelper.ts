import crypto from "crypto";
import { User } from "@prisma/client";
import { prisma } from "./prismaClient";
import { WorkOS } from "@workos-inc/node";
import { Request, Response } from "express";

const workos = new WorkOS(process.env.WORKOS_API_KEY, {
  clientId: process.env.WORKOS_CLIENT_ID,
});

// export const newUser = async () => {
//   const apiKey = crypto.randomBytes(5).toString("hex");

//   const newUser: User = await prisma.user.create({
//     data: {
//       id: apiKey,
//     },
//   });

//   return newUser;
// };

export const saveUser = async (name: string, authKey: string) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { authKey },
    });

    if (existingUser) {
      return existingUser;
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        authKey,
      },
    });

    return newUser;
  } catch (error) {
    throw error;
  }
};

export const validateSession = async (req: Request, res: Response) => {
  const session = workos.userManagement.loadSealedSession({
    sessionData: req.cookies["wos-session"],
    cookiePassword: process.env.WORKOS_COOKIE_PASSWORD as string,
  });

  const authResponse = await session.authenticate();

  if (!authResponse.authenticated) {
    console.log("authresponse.authenticated failed");
    return res.status(401).json({ error: "Unauthorized" });
  }
  return authResponse.user;
};
