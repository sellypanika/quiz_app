import * as quizService from "../../services/quizService.js";

export const showRandomQuestionForTopic = async ({
  params,
  response,
  render,
}) => {
  const { tId } = params;
  const question = await quizService.getRandomQuestionByTopic(tId);
  //console.log("Random Question:", question);

  if (!question) {
    await render("quiz.eta", {
      tId,
      question: null,
      options: [],
      selectedAnswer: null,
      message: "No questions available for this topic.",
    });
    return;
  }

  response.redirect(`/quiz/${tId}/questions/${question.id}`);
};

export const showQuestionDetails = async ({ params, user, render }) => {
  const { tId, qId } = params;
  const question = await quizService.getQuestionById(qId);
  const options = await quizService.getAnswerOptionsByQuestion(qId);

  //console.log("Question:", question);
  //console.log("Options:", options);

  const selectedAnswer = user
    ? await quizService.getUserAnswer(user.id, qId)
    : null;

  await render("quiz.eta", {
    tId,
    question,
    options,
    selectedAnswer,
    message: "Please select an answer.",
  });
  // console.log(
  //  "Rendering question page with tId:",
  //  tId,
  // "and question id:",
  //  question.id
  // );
};

export const handleAnswerSubmission = async ({
  params,
  request,
  response,
  user,
}) => {
  const { tId, qId } = params;
  const body = await request.body();
  const formData = await body.value;

  const oId = formData.get("optionId");

  // console.log("Submitted optionId:", oId);

  if (!oId) {
    response.status = 400;
    response.body = { error: "No option selected" };
    return;
  }

  const isCorrect = await quizService.checkAnswer(qId, oId);

  if (user) {
    await quizService.saveUserAnswer(user.id, qId, oId);
  } else {
    //console.warn("User not authenticated; answer not saved.");
  }

  if (isCorrect) {
    //console.log("Redirecting to correct page");
    response.redirect(`/quiz/${tId}/questions/${qId}/correct`);
  } else {
    const correctOption = await quizService.getCorrectAnswer(qId);
    //console.log("Redirecting to incorrect page with correct option");
    response.redirect(
      `/quiz/${tId}/questions/${qId}/incorrect?correctOption=${correctOption}`
    );
  }
};

export const showCorrectPage = async ({ render }) => {
  await render("quiz.eta", {
    tId: null,
    question: null,
    options: [],
    selectedAnswer: null,
    message: "Correct! Well done.",
  });
};

export const showIncorrectPage = async ({ request, render }) => {
  const url = new URL(request.url);
  const correctOption = url.searchParams.get("correctOption");

  await render("quiz.eta", {
    tId: null,
    question: null,
    options: [],
    selectedAnswer: null,
    message: `Incorrect! The correct option was: ${correctOption}`,
  });
};
