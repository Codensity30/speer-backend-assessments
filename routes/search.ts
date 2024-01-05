import { Router, Request } from "express";
import { authenticated } from "../middlewares/notes";
import { getUser, getQueryFromSearchPhrase } from "../utils/notes";
import db from "../db/db";

const router = Router();

interface CustomRequest extends Request {
  email?: string; // Define your custom property here
}

router.get("/", authenticated, async (req: CustomRequest, res) => {
  try {
    const email = req.email;
    if (!email) {
      res.status(400).send("Token is missing or invalid!");
      return;
    }
    const q = String(req.query.q);
    const query = getQueryFromSearchPhrase(q);
    const user = await getUser(email);
    if (!user) {
      res.status(400).send("Token is missing or invalid!");
      return;
    }

    const result = await db.note.findMany({
      where: {
        authorId: user.id,
        content: {
          search: query,
        },
        title: {
          search: query,
        },
      },
    });

    res.send(result);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

export default router;
