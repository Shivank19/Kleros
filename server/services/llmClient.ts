import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.BRAIN_API_KEY;
const baseURL = process.env.BRAIN_BASE_URL;

if (!apiKey) {
  throw new Error("Missing BRAIN_API_KEY in environment variables.");
}

export const brainClient = new OpenAI({
  apiKey,
  baseURL,
});

export const brainModel = process.env.BRAIN_MODEL || "llama-3.3-70b-versatile";