require("dotenv").config();

if (!process.env.JWT_SECRET) {
  throw new Error("Enivroment variables missing");
}

const jwtSecret: string = process.env.JWT_SECRET;

export default jwtSecret;
