import db from "../db/db";

// function to get the user from database
export async function getUser(email: string) {
  const user = await db.user.findUnique({
    where: {
      email: email,
    },
    include: { notes: true, sharedNotes: true },
  });
  return user;
}

const tsquerySpecialChars = /[()|&:*!]/g;

export const getQueryFromSearchPhrase = (searchPhrase: string) =>
  searchPhrase
    .replace(tsquerySpecialChars, " ")
    .trim()
    .split(/\s+/)
    .join(" | ");
