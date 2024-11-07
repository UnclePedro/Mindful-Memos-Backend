import crypto from "crypto";
import { User } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const newUser = async () => {
  const apiKey = crypto.randomBytes(5).toString("hex");

  const newUser: User = await prisma.user.create({
    data: {
      apiKey,
    },
  });

  return newUser;
};
