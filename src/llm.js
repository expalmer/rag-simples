import OpenAI from "openai";
import { zodFunction } from "openai/helpers/zod";

const openai = new OpenAI();

export const runLLMCompletions = async (messages, tools = []) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.1,
    messages,
    tools: tools.map(zodFunction),
  });

  return response.choices[0].message;
};

export const runLLMEmbedding = async (text) => {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });

  return response.data[0].embedding;
};
