import { sql } from "../database.js";

export const getStatistics = async () => {
  const topicsCountResult = await sql`SELECT COUNT(*) FROM topics`;

  const questionsCountResult = await sql`SELECT COUNT(*) FROM questions`;

  const answersCountResult = await sql`SELECT COUNT(*) FROM question_answers`;

  return {
    topicsCount: topicsCountResult[0].count,
    questionsCount: questionsCountResult[0].count,
    answersCount: answersCountResult[0].count,
  };
};
