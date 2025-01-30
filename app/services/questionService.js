import { sql } from "../database.js";

const addQuestion = async (userId, topicId, questionText) => {
  try {
    await sql`INSERT INTO questions (user_id, topic_id, question_text) 
                  VALUES (${userId}, ${topicId}, ${questionText})`;
    return { success: true, message: "Question added successfully" };
  } catch (_error) {
    //console.error("Error adding question:", error);
    throw new Error("Failed to add question");
  }
};

const addQuestionWithAnswers = async (
  userId,
  topicId,
  questionText,
  answers,
  correctAnswer
) => {
  try {
    const questionResult =
      await sql`INSERT INTO questions (user_id, topic_id, question_text) 
                                          VALUES (${userId}, ${topicId}, ${questionText}) 
                                          RETURNING id`;
    const questionId = questionResult[0].id;

    for (let i = 0; i < answers.length; i++) {
      await sql`INSERT INTO question_answer_options (question_id, option_text, is_correct) 
                      VALUES (${questionId}, ${answers[i]}, ${
        i === parseInt(correctAnswer)
      })`;
    }

    return {
      success: true,
      message: "Question and answer options added successfully",
    };
  } catch (_error) {
    // console.error("Error adding question with answers:", error);
    throw new Error("Failed to add question with answers");
  }
};

const listQuestionsByTopic = async (topicId) => {
  try {
    return await sql`SELECT * FROM questions WHERE topic_id = ${topicId}`;
  } catch (_error) {
    // console.error("Error listing questions:", error);
    throw new Error("Failed to list questions for the topic");
  }
};

const getQuestionById = async (questionId) => {
  try {
    const result = await sql`SELECT * FROM questions WHERE id = ${questionId}`;
    if (result.length === 0) {
      throw new Error("Question not found");
    }
    return result[0];
  } catch (_error) {
    // console.error("Error getting question by ID:", error);
    throw new Error("Failed to retrieve question");
  }
};

const addAnswerOption = async (questionId, optionText, isCorrect) => {
  try {
    return await sql`INSERT INTO question_answer_options (question_id, option_text, is_correct) 
                         VALUES (${questionId}, ${optionText}, ${isCorrect}) 
                         RETURNING *`;
  } catch (_error) {
    //console.error("Error adding answer option:", error);
    throw new Error("Failed to add answer option");
  }
};

const listAnswerOptions = async (questionId) => {
  try {
    return await sql`SELECT * FROM question_answer_options WHERE question_id = ${questionId}`;
  } catch (_error) {
    // console.error("Error listing answer options:", error);
    throw new Error("Failed to list answer options for the question");
  }
};

const deleteAnswerOption = async (optionId) => {
  try {
    // console.log(`Attempting to delete answer option with ID: ${optionId}`);

    // First, delete all question_answers associated with the optionId
    await sql`DELETE FROM question_answers WHERE question_answer_option_id = ${optionId}`;

    // Then delete the answer option
    const result = await sql`
            DELETE FROM question_answer_options 
            WHERE id = ${optionId}
        `;

    if (result.rowCount === 0) {
      throw new Error("Answer option not found.");
    }

    //console.log(`Successfully deleted answer option with ID: ${optionId}`);
    return { success: true, message: "Answer option deleted successfully" };
  } catch (error) {
    //console.error("Error deleting answer option:", error);
    throw new Error(`Failed to delete answer option: ${error.message}`);
  }
};

const deleteQuestion = async (questionId) => {
  try {
    //console.log(`Attempting to delete question with ID: ${questionId}`);

    // Delete all question_answers tied to options of this question
    await sql`
            DELETE FROM question_answers
            WHERE question_answer_option_id IN (
                SELECT id FROM question_answer_options WHERE question_id = ${questionId}
            )
        `;

    // Delete all answer options tied to the question
    await sql`
            DELETE FROM question_answer_options
            WHERE question_id = ${questionId}
        `;

    // Delete the question itself
    const result = await sql`
            DELETE FROM questions
            WHERE id = ${questionId}
        `;

    if (result.rowCount === 0) {
      throw new Error("Question not found.");
    }

    //console.log(`Successfully deleted question with ID: ${questionId}`);
    return { success: true, message: "Question deleted successfully" };
  } catch (error) {
    //console.error("Error deleting question:", error);
    throw new Error(`Failed to delete question: ${error.message}`);
  }
};

export {
  addAnswerOption,
  addQuestion,
  addQuestionWithAnswers,
  deleteAnswerOption,
  deleteQuestion,
  getQuestionById,
  listAnswerOptions,
  listQuestionsByTopic,
};
