import * as topicService from "../../services/topicService.js";
import * as questionService from "../../services/questionService.js";

const showAddQuestionForm = async ({ params, render }) => {
  const topicId = params.id;
  const topic = await topicService.getTopicById(topicId);

  if (!topic) {
    render("error.eta", { error: "Topic not found." });
    return;
  }

  // Default values to prevent issues in the template
  const defaultData = {
    topic,
    questionText: "",
    answers: ["", "", "", ""], // Empty default values for the answers
    correctAnswer: 1, // Default correct answer
    errors: [], // No validation errors by default
  };

  render("addQuestion.eta", defaultData);
};

const addQuestion = async ({ request, params, response, render, state }) => {
  const topicId = params.id;
  const user = await state.session.get("user");

  if (!user) {
    response.redirect("/login");
    return;
  }

  const body = request.body({ type: "form" });
  const paramsBody = await body.value;

  const questionText = paramsBody.get("question_text")?.trim();
  const answers = paramsBody.getAll("answers[]");
  const correctAnswer = parseInt(paramsBody.get("correct_answer"), 10);

  // Validate the inputs
  if (!questionText || questionText.length === 0) {
    const topic = await topicService.getTopicById(topicId);
    const errors = ["Question text is required."];
    render("addQuestion.eta", { topic, errors, questionText });
    return;
  }

  if (!answers || answers.length < 2) {
    const topic = await topicService.getTopicById(topicId);
    const errors = ["You need at least two answer options."];
    render("addQuestion.eta", { topic, errors, questionText });
    return;
  }

  // Add the question and its answer options
  await questionService.addQuestionWithAnswers(
    user.id,
    topicId,
    questionText,
    answers,
    correctAnswer
  );

  response.redirect(`/topics/${topicId}`);
};

const showQuestionDetails = async ({ params, render }) => {
  const topicId = params.id;
  const questionId = params.qId;
  const question = await questionService.getQuestionById(questionId);

  if (!question) {
    render("error.eta", { error: "Question not found." });
    return;
  }

  const options = await questionService.listAnswerOptions(questionId);
  render("questionDetails.eta", {
    topicId,
    question,
    options,
    errors: [],
    optionText: "",
    isCorrect: false,
  });
};

const addAnswerOption = async ({ request, params, response, render }) => {
  const topicId = params.id;
  const questionId = params.qId;
  const body = request.body({ type: "form" });
  const paramsBody = await body.value;
  const optionText = paramsBody.get("option_text")?.trim();
  const isCorrect = paramsBody.has("is_correct");

  if (!optionText || optionText.length === 0) {
    const question = await questionService.getQuestionById(questionId);
    const options = await questionService.listAnswerOptions(questionId);
    const errors = ["Option text is required."];
    render("questionDetails.eta", {
      topicId,
      question,
      options,
      errors,
      optionText,
    });
    return;
  }

  await questionService.addAnswerOption(questionId, optionText, isCorrect);
  response.redirect(`/topics/${topicId}/questions/${questionId}`);
};

const deleteAnswerOption = async ({ params, response, render }) => {
  const topicId = params.tId;
  const questionId = params.qId;
  const optionId = params.oId;

  try {
    // Log the IDs for debugging
    //console.log(`Deleting answer option with ID: ${optionId}`);

    // Call the service to delete the answer option
    await questionService.deleteAnswerOption(optionId);

    // Redirect to the question detail page if successful
    response.redirect(`/topics/${topicId}/questions/${questionId}`);
  } catch (error) {
    //console.error("Error occurred while deleting answer option:", error);

    // Render an error page if deletion fails
    render("error.eta", {
      error: `Failed to delete answer option: ${error.message}`,
    });
  }
};
const deleteQuestion = async ({ params, response }) => {
  const topicId = params.tId;
  const questionId = params.qId;

  await questionService.deleteQuestion(questionId);
  response.redirect(`/topics/${topicId}`);
};

export {
  addAnswerOption,
  addQuestion,
  deleteAnswerOption,
  deleteQuestion,
  showAddQuestionForm,
  showQuestionDetails,
};
