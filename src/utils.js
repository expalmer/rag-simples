import { readFile, writeFile } from "fs/promises";
import { runLLMEmbedding } from "./llm.js";

async function getJsonFaq() {
  const file = await readFile(new URL("./faq.json", import.meta.url), "utf-8");
  return JSON.parse(file.toString());
}

function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, ai) => sum + ai ** 2, 0));
  const normB = Math.sqrt(b.reduce((sum, bi) => sum + bi ** 2, 0));
  return dot / (normA * normB);
}

export async function findFaqs(query, topK = 3) {
  const queryEmbedding = await runLLMEmbedding(query);
  const faqJson = await getJsonFaq();

  const relevantAnswers = faqJson
    .map(({ question, answer, embedding }) => {
      const similarity = cosineSimilarity(queryEmbedding, embedding);
      return {
        question,
        answer,
        similarity,
      };
    })
    .filter((entry) => entry.similarity > 0.1)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);

  return relevantAnswers;
}

export async function updateFaqEmbeddings() {
  const file = await readFile(new URL("./faq.txt", import.meta.url));

  const faq = file
    .toString()
    .split("\n\n")
    .map((entry) => {
      const [question, answer] = entry.split("\n");
      return {
        question: question.replace("Q: ", ""),
        answer: answer.replace("A: ", ""),
      };
    });

  const promises = faq.map(async (entry) => {
    const fullText = `${entry.question}\n${entry.answer}`;
    const embedding = await runLLMEmbedding(fullText);
    return {
      ...entry,
      embedding,
    };
  });

  const embeddedFaq = await Promise.all(promises);

  await writeFile(
    new URL("./faq.json", import.meta.url),
    JSON.stringify(embeddedFaq, null, 2)
  );
}
