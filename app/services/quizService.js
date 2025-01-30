import { sql } from "../database.js";

export const getRandomQuestionByTopic = async (topicId) => {
  const result = await sql`
      SELECT * FROM questions
      WHERE topic_id = ${topicId}
      ORDER BY RANDOM()
      LIMIT 1
    `;

  return result.length > 0 ? result[0] : null;
};

export const getQuestionById = async (questionId) => {
  const result = await sql`
      SELECT * FROM questions WHERE id = ${questionId}
    `;

  return result.length > 0 ? result[0] : null;
};

export const getAnswerOptionsByQuestion = async (questionId) => {
  const result = await sql`
      SELECT * FROM question_answer_options WHERE question_id = ${questionId}
    `;

  return result;
};

export const checkAnswer = async (qId, oId) => {
  const result = await sql`
    SELECT is_correct FROM question_answer_options 
    WHERE question_id = ${qId} AND id = ${oId}
  `;

  if (result.length === 0) {
    throw new Error("Option not found");
  }

  return result[0].is_correct;
};

export const saveUserAnswer = async (userId, questionId, optionId) => {
  await sql`
      INSERT INTO question_answers (user_id, question_id, question_answer_option_id)
      VALUES (${userId}, ${questionId}, ${optionId})
    `;
};

export const getCorrectAnswer = async (questionId) => {
  const result = await sql`
      SELECT option_text FROM question_answer_options
      WHERE question_id = ${questionId} AND is_correct = true
    `;

  return result.length > 0 ? result[0].option_text : null;
};

export const getUserAnswer = async (userId, questionId) => {
  const result = await sql`
    SELECT question_answer_option_id
    FROM question_answers
    WHERE user_id = ${userId} AND question_id = ${questionId}
  `;

  return result.length > 0 ? result[0] : null;
};
