import express from "express";
import rateLimit from "express-rate-limit";
// importing diffrent routes
import authRouter from "./routes/auth";
import notesRouter from "./routes/notes";
import searchRouter from "./routes/search";

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// middlewaret to limit and read the body json
app.use(limiter);
app.use(express.json());

// attaching all routes to the app
app.use("/api/auth", authRouter);
app.use("/api/notes", notesRouter);
app.use("/api/search", searchRouter);

const PORT = 5173;
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
