import { Router } from "../deps.js";
import * as registrationController from "./controllers/registrationController.js";
import * as loginController from "./controllers/loginController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import * as mainController from "./controllers/mainController.js";
import * as topicController from "./controllers/topicController.js";
import * as questionController from "./controllers/questionController.js";
import * as quizController from "./controllers/quizController.js";
import * as questionApi from "./apis/questionApi.js";

const router = new Router();

// Public routes
router.get("/", mainController.showMain);
router.get("/auth/register", registrationController.showRegistrationForm);
router.post("/auth/register", registrationController.registerUser);
router.get("/auth/login", loginController.showLoginForm);
router.post("/auth/login", loginController.processLogin);

router.use(authMiddleware);

// Topic routes
router.get("/topics", topicController.listTopics);
router.post("/topics", topicController.addTopic);
router.post("/topics/:id/delete", topicController.deleteTopic);
router.get("/topics/:id", topicController.showTopic);

// Question-related routes
router.get("/topics/:id/questions/add", questionController.showAddQuestionForm);
router.post("/topics/:id/questions", questionController.addQuestion);
router.get(
  "/topics/:id/questions/:qId",
  questionController.showQuestionDetails
);
router.post(
  "/topics/:id/questions/:qId/options",
  questionController.addAnswerOption
);
router.post(
  "/topics/:id/questions/:qId/options/:oId/delete",
  questionController.deleteAnswerOption
);
router.post(
  "/topics/:id/questions/:qId/delete",
  questionController.deleteQuestion
);

// Quiz routes
router.get("/quiz", topicController.listTopicsForQuiz);
router.get("/quiz/:tId", quizController.showRandomQuestionForTopic);
router.get("/quiz/:tId/questions/:qId", quizController.showQuestionDetails);
router.post(
  "/quiz/:tId/questions/:qId/options",
  quizController.handleAnswerSubmission
);
router.get("/quiz/:tId/questions/:qId/correct", quizController.showCorrectPage);
router.get(
  "/quiz/:tId/questions/:qId/incorrect",
  quizController.showIncorrectPage
);
// Route to get a random question by topic
router.get("/api/questions/random/:topicId", questionApi.getRandomQuestionApi);

// Route to get question details by question ID
router.get("/api/questions/:questionId", questionApi.getQuestionByIdApi);

// Route to check if the user's selected answer is correct
router.post("/api/questions/check-answer", questionApi.checkAnswerApi);

// Route to save the user's answer
router.post("/api/questions/save-answer", questionApi.saveUserAnswerApi);

// Route to get the correct answer for a specific question
router.get(
  "/api/questions/:questionId/correct-answer",
  questionApi.getCorrectAnswerApi
);

// Route to get the user's answer for a question
router.get(
  "/api/users/:userId/questions/:questionId/answer",
  questionApi.getUserAnswerApi
);

export { router };
