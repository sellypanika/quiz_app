import { sql } from "../database.js";

const isValidPassword = (password) => {
    return password.length >= 4;
};
const addUser = async (email, password) => {
    if (!isValidPassword(password)) {
        throw new Error("Password must be at least 4 characters long.");
    }
    
    await sql`INSERT INTO users (email, password) VALUES (${email}, ${password})`;
};

const findUserByEmail = async (email) => {
    const rows = await sql`SELECT * FROM users WHERE email = ${email}`;
    return rows;
};

export { addUser, findUserByEmail };
