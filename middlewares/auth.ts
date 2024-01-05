import { NextFunction, Request, Response } from "express";
import db from "../db/db";

// function to check if user exists
async function userExists(email: string) {
  try {
    const user = await db.user.findUnique({
      where: {
        email: email,
      },
    });
    return user ? true : false;
  } catch (error) {
    console.log(error);
  }
}

// sign up middleware - if users exists then can't create new user
export async function signupMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const email = req.body.email;
    if (await userExists(email)) {
      res.status(403).json({ error: "User with this email already exists!" });
      return;
    }
    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function loginMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const email = req.body.email;
    if (!(await userExists(email))) {
      res.status(401).json({ error: "Invalid Email Address!" });
      return;
    }
    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
