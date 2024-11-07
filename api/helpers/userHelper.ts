import crypto from "crypto";
import { User } from "@prisma/client";
import { prisma } from "./prismaClient";

export const newUser = async () => {
  const apiKey = crypto.randomBytes(5).toString("hex");

  const newUser: User = await prisma.user.create({
    data: {
      apiKey,
    },
  });

  return newUser;
};
