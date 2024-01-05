import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import jwtSecret from "../config/config";

interface CustomRequest extends Request {
  email?: string; // Define your custom property here
}

export async function authenticated(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const auth = req.get("Authorization");
  if (!auth) {
    res.sendStatus(401);
    return;
  }
  const words = auth.split(" "); // ["Bearer", "token"]
  const token = words[1];
  // now we need to verify this token
  try {
    jwt.verify(token, jwtSecret);
    const decoded = jwt.decode(token);
    if (!decoded || typeof decoded === "string") {
      res.sendStatus(401);
      return;
    }
    req.email = decoded.email;
    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(401);
  }
}
