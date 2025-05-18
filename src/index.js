import "dotenv/config";
import { findFaqs } from "./utils.js";
import { runLLMCompletions } from "./llm.js";

async function runAgent(userInput) {
  const candidates = await findFaqs(userInput, 3);
  // Não é tão preciso, mas é mais rápido
  console.log({ candidates });

  const systemMessage = {
    role: "system",
    content: `Você é um assistente atencioso que responde dúvidas com base em uma lista de FAQs.
      Use o conteúdo mais relevante da lista e responda de forma clara, objetiva e em Markdown.
      Se não souber a resposta, diga que não sabe.`,
  };

  // Aqui a LLM vai pegar as FAQs mais relevantes e gerar uma resposta
  const userMessage = {
    role: "user",
    content: `
      ## Pergunta do usuário:
      "${userInput}"

      ## FAQ disponíveis:
      ${candidates
        .map((option, index) => {
          return `
          ${index + 1}. Q: ${option.question} A: ${option.answer}
        `;
        })
        .join("\n")}
      `.trim(),
  };

  const response = await runLLMCompletions([systemMessage, userMessage]);

  console.log({
    systemMessage,
    userMessage,
  });

  console.log({ response });
}

const userInput = process.argv[2] || "";
runAgent(userInput);
