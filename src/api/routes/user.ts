import { app } from "../..";
import { Request, Response } from "express";
import { newUser } from "../helpers/userHelper";

app.post("/generateUser", async (req: Request, res: Response) => {
  try {
    const newUserData: User = await newUser(); // Create a new user with an API key
    res.status(201).json({
      message: "User created successfully",
      newUser: newUserData,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create user: backend" });
  }
});