import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../db/db";
import jwtSecret from "../config/config";
import { signupMiddleware, loginMiddleware } from "../middlewares/auth";

const router = Router();

//Sign Up route which creates account and store in db
router.post("/signup", signupMiddleware, async (req, res) => {
  try {
    const email: string = req.body.email;
    // encrypting the password using bcrypt
    const password = await bcrypt.hash(req.body.password, 10);

    // storing the user in the database
    const user = await db.user.create({
      data: {
        email: email,
        password: password,
      },
    });
    res.json({ msg: "User signed up successfully", user: user });
  } catch (error) {
    res.sendStatus(500);
  }
});

// Login route which returns jwt to authenticated user
router.post("/login", loginMiddleware, async (req, res) => {
  try {
    const user = await db.user.findUnique({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      res.status(401).json({ error: "Invalid email" });
      return;
    }
    const result = await bcrypt.compare(req.body.password, user.password);
    if (!result) {
      res.status(401).json({ error: "Invalid password or email" });
      return;
    }
    const token = jwt.sign({ email: user.email }, jwtSecret);
    res.json({ token: token });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

export default router;
