import { sql } from "../database.js";

const addTopic = async (userId, name) => {
  if (!name || !userId) {
    throw new Error("Both user ID and topic name are required");
  }

  const userExists = await sql`SELECT 1 FROM users WHERE id = ${userId} AND admin= true`;
  if (userExists.length === 0) {
    throw new Error(`Only admin can add/ delete topic`);
  }

  await sql`INSERT INTO topics (user_id, name) VALUES (${userId}, ${name})`;
};

const listTopics = async () => {
  return await sql`
        SELECT topics.id, topics.name, users.email
        FROM topics
        JOIN users ON topics.user_id = users.id
        ORDER BY topics.name ASC
    `;
};

const deleteTopic = async (userId, topicId) => {
  if (!userId || !topicId) {
    throw new Error("User ID and topic ID are required");
  }

  // Check if user exists and is an admin
  const userResult = await sql`SELECT 1 FROM users WHERE id = ${userId} AND admin = true`;

  if (userResult.length === 0) {
    throw new Error("Only admin can add/delete topics");
  }

  // Proceed with deleting the topic
  await sql`DELETE FROM topics WHERE id = ${topicId}`;
};

const getTopicById = async (id) => {
  try {
    const result = await sql`SELECT * FROM topics WHERE id = ${id}`;
    return Array.isArray(result) && result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error(`Error fetching topic with ID ${id}:`, error);
    throw new Error(`Could not fetch topic with ID ${id}`);
  }
};

const getQuestionsByTopicId = async (id) => {
  try {
    const result = await sql`SELECT * FROM questions WHERE topic_id = ${id}`;
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error(`Error fetching questions for topic with ID ${id}:`, error);
    throw new Error(`Could not fetch questions for topic ID ${id}`);
  }
};

const getAllTopics = async () => {
  const result = await sql`
        SELECT * FROM topics ORDER BY name ASC
    `;
  return result;
};

export {
  addTopic,
  deleteTopic,
  getAllTopics,
  getQuestionsByTopicId,
  getTopicById,
  listTopics,
};
