import crypto from "crypto";
import { User } from "@prisma/client";
import { prisma } from "./prismaClient";

// export const newUser = async () => {
//   const apiKey = crypto.randomBytes(5).toString("hex");

//   const newUser: User = await prisma.user.create({
//     data: {
//       id: apiKey,
//     },
//   });

//   return newUser;
// };

export const handleUserLogin = async (name: string, id: string) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (existingUser) {
      return existingUser;
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        id,
      },
    });

    return newUser;
  } catch (error) {
    throw error;
  }
};
