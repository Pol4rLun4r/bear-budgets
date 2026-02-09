import "dotenv/config";

export const PORT = process.env.PORT || 4000;
export const DB_PATH = process.env.NODE_ENV === "test" ? ":memory:" : "bear_quotes.db";