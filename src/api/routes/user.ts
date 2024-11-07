import { Router, Request, Response } from "express";
import { newUser } from "../helpers/userHelper";
import { User } from "@prisma/client";

const userRouter = Router();

userRouter.post("/generateUser", async (req: Request, res: Response) => {
  try {
    const newUserData: User = await newUser();
    res.status(201).json({
      message: "User created successfully",
      newUser: newUserData,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create user: backend" });
  }
});

export default userRouter;
