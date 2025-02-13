import * as quizService from "../../services/quizService.js";

const getRandomQuestionApi = async ({ params, response }) => {
  const { topicId } = params;
  if (isNaN(topicId)) {
    response.status = 400;
    response.body = { error: "Invalid topic ID" };
    return;
  }

  const question = await quizService.getRandomQuestionByTopic(topicId);

  if (question) {
    const answerOptions = await quizService.getAnswerOptionsByQuestion(
      question.id
    );
    response.body = {
      questionId: question.id,
      questionText: question.question_text,
      answerOptions: answerOptions.map((option) => ({
        optionId: option.id,
        optionText: option.option_text,
      })),
    };
  } else {
    response.status = 404;
    response.body = { error: "No questions found for this topic" };
  }
};

const getQuestionByIdApi = async ({ params, response }) => {
  const { questionId } = params;
  if (isNaN(questionId)) {
    response.status = 400;
    response.body = { error: "Invalid question ID" };
    return;
  }

  const question = await quizService.getQuestionById(questionId);

  if (question) {
    const answerOptions = await quizService.getAnswerOptionsByQuestion(
      questionId
    );
    response.body = {
      questionId: question.id,
      questionText: question.question_text,
      answerOptions: answerOptions.map((option) => ({
        optionId: option.id,
        optionText: option.option_text,
      })),
    };
  } else {
    response.status = 404;
    response.body = { error: "Question not found" };
  }
};

const checkAnswerApi = async ({ request, response }) => {
  const { questionId, optionId } = await request.body().value;

  try {
    const correct = await quizService.checkAnswer(questionId, optionId);
    response.body = { correct };
  } catch (error) {
    response.status = 400;
    response.body = { error: error.message };
  }
};

const saveUserAnswerApi = async ({ request, response }) => {
  const { userId, questionId, optionId } = await request.body().value;

  try {
    await quizService.saveUserAnswer(userId, questionId, optionId);
    response.body = { message: "Answer saved successfully" };
  } catch (_error) {
    response.status = 400;
    response.body = { error: "Error saving user answer" };
  }
};

const getCorrectAnswerApi = async ({ params, response }) => {
  const { questionId } = params;
  if (isNaN(questionId)) {
    response.status = 400;
    response.body = { error: "Invalid question ID" };
    return;
  }

  const correctAnswer = await quizService.getCorrectAnswer(questionId);

  if (correctAnswer) {
    response.body = { correctAnswer };
  } else {
    response.status = 404;
    response.body = { error: "Correct answer not found" };
  }
};

const getUserAnswerApi = async ({ request, response }) => {
  const { questionId, optionId } = await request.body().value;

 const questionIdNum = Number(questionId);
  const optionIdNum = Number(optionId);

  if (isNaN(questionIdNum) || isNaN(optionIdNum)) {
    response.status = 400;
    response.body = { error: "Invalid question ID or option ID" };
    return;
  }

  const correct = await quizService.checkAnswer(questionIdNum, optionIdNum);
  response.body = { correct };
};



export {
  checkAnswerApi,
  getCorrectAnswerApi,
  getQuestionByIdApi,
  getRandomQuestionApi,
  getUserAnswerApi,
  saveUserAnswerApi,
};
