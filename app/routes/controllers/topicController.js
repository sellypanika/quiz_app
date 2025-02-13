import * as topicService from "../../services/topicService.js";

const addTopic = async ({ request, response, render, state }) => {
  const body = request.body({ type: "form" });
  const params = await body.value;
  const topicName = params.get("name");

  if (!topicName || topicName.trim().length === 0) {
    const topics = await topicService.listTopics();
    const errors = ["Topic name is required"];
    render("topics.eta", {
      topics,
      errors,
      topicName,
    });
    return;
  }

  const user = await state.session.get("user");
  if (!user) {
    response.redirect("/login");
    return;
  }

  const userId = user.id;

  try {
    await topicService.addTopic(userId, topicName);
    response.redirect("/topics");
  } catch (error) {
    const topics = await topicService.listTopics();
    const errors = [
      error.message || "An error occurred while adding the topic",
    ];
    render("topics.eta", {
      topics,
      errors,
      topicName,
    });
  }
};

const listTopics = async ({ render, state }) => {
  const topics = await topicService.listTopics();
  const _user = await state.session.get("user");

  render("topics.eta", {
    topics,
    errors: [],
    topic: null,
    questions: [],
  });
};

const deleteTopic = async ({ params, response, state }) => {
  const user = state.session ? await state.session.get("user") : null;

  if (!user) {
    response.redirect("/login");
    return;
  }
 const userId = user.id; 
  const topicId = params.id;
  try {
    await topicService.deleteTopic(userId,topicId);
    response.redirect("/topics");
  } catch (error) {
    response.status = 500;
    response.body = `Error deleting topic: ${error.message}`;
    response.redirect("/topics");
  }
};

const showTopic = async (context) => {
  const topicId = context.params.id;

  try {
    const topic = await topicService.getTopicById(topicId);
    const questions = await topicService.getQuestionsByTopicId(topicId);

    if (!topic) {
      context.response.status = 404;
      context.response.body = "Topic not found";
      return;
    }

    context.render("topicDetails.eta", { topic, questions });
  } catch (error) {
    context.response.status = 500;
    context.response.body = `Error fetching topic details: ${error.message}`;
  }
};

const listTopicsForQuiz = async ({ render }) => {
  const topics = (await topicService.getAllTopics()) || [];
  render("quizTopics.eta", { topics });
};

export { addTopic, deleteTopic, listTopics, listTopicsForQuiz, showTopic };
