import { postgres } from "./deps.js";

// Initialize the database connection with the environment variables
const sql = postgres({
    host: Deno.env.get("PGHOST") || "localhost", // or "database-server" if inside Docker
    port: Deno.env.get("PGPORT") || 5432, // Default PostgreSQL port
    username: Deno.env.get("PGUSER") || "username", // Replace with your DB username
    password: Deno.env.get("PGPASSWORD") || "password", // Replace with your DB password
    db: Deno.env.get("PGDATABASE") || "database", // Replace with your DB name
    idle_timeout: 30, // Optional: Set idle timeout (optional)
});

// Add error handling when performing queries
async function testConnection() {
    try {
        // Attempt to run a simple query to check if the database is reachable
        await sql`SELECT 1`;
        console.log("Database connected successfully.");
    } catch (err) {
        console.error("Database connection error: ", err);
    }
}

testConnection();

export { sql };
