import pkg from "pg";
const { Client } = pkg;

const isProduction = process.env.NODE_ENV === "production";

const database = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

try {
  await database.connect();
  console.log("Connected to the database successfully");
} catch (error) {
  console.error("Database connection failed:", error);
  process.exit(1);
}

export default database;