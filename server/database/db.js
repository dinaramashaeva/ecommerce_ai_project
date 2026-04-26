import pkg from "pg";
const { Client } = pkg;

const isProduction = process.env.NODE_ENV === "production";

const database = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

export const connectDatabase = async () => {
  try {
    await database.connect();
    await database.query("SET search_path TO public");
    console.log("Connected to the database successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

await connectDatabase();

export default database;