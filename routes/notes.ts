import { Router, Request } from "express";
import { authenticated } from "../middlewares/notes";
import { getUser } from "../utils/notes";
import db from "../db/db";

const router = Router();

interface CustomRequest extends Request {
  email?: string; // Define your custom property here
}

// route to get all notes created by a user
router.get("/", authenticated, async (req: CustomRequest, res) => {
  try {
    // getting the user via email from the decoded token
    const email = req.email;
    if (!email) {
      res.status(400).send("Token is missing or invalid!");
      return;
    }
    const user = await getUser(email);
    if (!user) {
      res.status(400).send("Token is missing or invalid!");
      return;
    }

    const sharedNotesPromises = user.sharedNotes.map(async (snote) => {
      const note = await db.note.findUnique({
        where: {
          id: snote.noteId,
        },
      });
      return note;
    });

    // Wait for all shared notes promises to resolve
    const sharedNotes = await Promise.all(sharedNotesPromises);

    // returning notes
    res.json({
      createdNotes: user.notes,
      sharedNotes: sharedNotes.filter(Boolean), // Filtering out any potential null values
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// route to get the single note by id created by user
router.get("/:id", authenticated, async (req: CustomRequest, res) => {
  try {
    const email = req.email;
    if (!email) {
      res.send("Token is missing or invalid!").status(400);
      return;
    }

    const user = await getUser(email);
    if (!user) {
      res.send("Token is missing or invalid!").status(400);
      return;
    }

    const id = req.params.id;

    // Fetching the note created by the user
    const userNote = await db.note.findFirst({
      where: {
        id: Number(id),
        authorId: user.id,
      },
    });

    // Fetching the shared note
    const sharedNote = await db.sharedNote.findFirst({
      where: {
        noteId: Number(id),
        userId: user.id,
      },
      include: {
        note: true,
      },
    });

    // Checking if the note exists either as user's own note or as a shared note
    const note = userNote || (sharedNote ? sharedNote.note : null);

    if (!note) {
      res.send("Note not found!").status(404);
      return;
    }

    res.json({ note });
  } catch (error) {
    res.sendStatus(500);
  }
});

// route to create note
router.post("/create", authenticated, async (req: CustomRequest, res) => {
  try {
    // getting the user via email from the decoded token
    const email = req.email;
    if (!email) {
      res.send("Token is missing or invalid!").status(400);
      return;
    }
    const user = await getUser(email);
    if (!user) {
      res.send("Token is missing or invalid!").status(400);
      return;
    }
    const { title, content } = req.body;

    const note = await db.note.create({
      data: {
        title: title,
        content: content,
        authorId: user.id,
      },
    });

    res.json({ msg: "Note created sucessfully!", note: note });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// route to edit note
router.put("/:id", authenticated, async (req: CustomRequest, res) => {
  try {
    // getting the user via email from the decoded token
    const email = req.email;
    if (!email) {
      res.send("Token is missing or invalid!").status(400);
      return;
    }
    const user = await getUser(email);
    if (!user) {
      res.send("Token is missing or invalid!").status(400);
      return;
    }
    const id = req.params.id;

    // finding the existing note
    const existingNote = await db.note.findUnique({
      where: {
        id: Number(id),
        authorId: user.id,
      },
    });
    if (!existingNote) {
      res.send("Invalid id").status(400);
      return;
    }
    // updating only that content which is supplied
    const title = req.body.title ? req.body.title : existingNote.title;
    const content = req.body.content ? req.body.content : existingNote.content;

    const updatedNote = await db.note.update({
      where: {
        id: Number(id),
        authorId: user.id,
      },
      data: {
        title: title,
        content: content,
      },
    });
    res.json({ msg: "Note updated sucessfully!", updatedNote: updatedNote });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// route to delete the note
router.delete("/:id", authenticated, async (req: CustomRequest, res) => {
  try {
    // getting the user via email from the decoded token
    const email = req.email;
    if (!email) {
      res.send("Token is missing or invalid!").status(400);
      return;
    }
    const user = await getUser(email);
    if (!user) {
      res.send("Token is missing or invalid!").status(400);
      return;
    }
    const id = req.params.id;
    if (!id) {
      res.send("Id is missing!").status(400);
    }
    // deleting note
    await db.note.delete({
      where: {
        id: Number(id),
        authorId: user.id,
      },
    });

    res.send("Note deleted sucessfully!");
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// route to share the notes
router.get(
  "/:noteId/share/:userId",
  authenticated,
  async (req: CustomRequest, res) => {
    try {
      const email = req.email;
      if (!email) {
        res.send("Token is missing or invalid!").status(400);
        return;
      }
      const user = await getUser(email);
      if (!user) {
        res.send("Token is missing or invalid!").status(400);
        return;
      }
      const { noteId, userId } = req.params;
      if (!noteId || !userId) {
        res.send("Id is missing!").status(400);
        return;
      }
      // checking if the user requesting is the author of the note
      const note = await db.note.findUnique({
        where: {
          id: Number(noteId),
          authorId: user.id,
        },
      });

      if (!note) {
        res.send("Invalid note id").status(400);
        return;
      }
      // checking if the userId is valid
      const sharedUser = await db.user.findUnique({
        where: {
          id: Number(userId),
        },
      });
      if (!sharedUser) {
        res.send("Id is missing!").status(400);
        return;
      }

      await db.sharedNote.create({
        data: {
          noteId: note.id,
          userId: sharedUser.id,
        },
      });
      res.send("Note shared with the user");
    } catch (error) {}
  }
);

export default router;
