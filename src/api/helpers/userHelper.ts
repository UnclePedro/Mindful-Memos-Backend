import crypto from "crypto";
import { prisma } from "../..";

export const newUser = async () => {
  const apiKey = crypto.randomBytes(5).toString("hex");

  const newUser: User = await prisma.user.create({
    data: {
      apiKey,
    },
  });

  return newUser;
};
