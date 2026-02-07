import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import z from "zod";
import { nanoid } from "nanoid";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const aiModel = "gemini-2.5-flash";

const AIQuestionSchema = z.object({
  text: z.string().describe("Question text"),
  choices: z.array(z.string()).length(4).describe("Choice Array for Question"),
  correctChoiceIndex: z
    .number()
    .int()
    .min(0)
    .max(3)
    .describe("0-based index of correct answer from choices array"),
});

const AIQuizSchema = z.object({
  title: z.string().describe("Quiz title"),
  description: z.string().describe("Short description about the quiz"),
  topics: z.array(z.string()).describe("Quiz topics"),
  questions: z.array(AIQuestionSchema).describe("Array of questions in quiz"),
});

const AIResponseSchema = z.object({
  error: z
    .string()
    .nullable()
    .default(null)
    .describe("Error Message if unable to generate quiz"),
  data: AIQuizSchema.nullable()
    .default(null).describe("Generated Quiz")
});

export default async function getAIGeneratedQuiz(
  topics: Array<string>,
  questionCount: number,
  timeLimitSeconds: number,
) {
  const rawQuiz = await generateQuiz(topics, questionCount);
  const quizId = nanoid();
  const questions = rawQuiz.questions.map((q, idx) => {
    const questionId = nanoid();
    const choices = q.choices.map((choiceText) => ({
      id: nanoid(),
      text: choiceText,
    }));
    return {
      id: questionId,
      quizId,
      text: q.text,
      order: idx + 1,
      timeLimitSeconds,
      choices,
      correctChoiceId: choices[q.correctChoiceIndex].id,
    };
  });

  const quiz = {
    ...rawQuiz,
    id: quizId,
    questions,
    totalQuestions: questions.length,
  };

  return quiz;
}

async function generateQuiz(topics: Array<string>, questionCount: number) {
  const response = await ai.models.generateContent({
    model: aiModel,
    contents: getPrompt(topics, questionCount),
    config: {
      systemInstruction: `You are a Quiz Wizard who generates engaging quizzes.
        Before generating the quiz, ensure the topics provided are valid and not some random keystrokes, gibberish, or nonsense (e.g., "dfsdfs", "asdf").
        If they are invalid do not generate the quiz and response with error message only`,
      thinkingConfig: {
        thinkingBudget: 0,
      },
      responseMimeType: "application/json",
      responseSchema: z.toJSONSchema(AIResponseSchema),
    },
  });

  const { error, data } = AIResponseSchema.parse(
    JSON.parse(response.text as string),
  );

  console.log(error, data);

  if (error !== null) throw new Error(error);

  return data!;
}

function getPrompt(topics: Array<string>, questionCount: number) {
  const joinWithAnd = () => {
    if (topics.length <= 1) {
      return topics.join("");
    }
    const firstPart = topics.slice(0, -1).join(", ");
    const lastPart = topics[topics.length - 1];
    return `${firstPart}, and ${lastPart}`;
  };

  console.log(joinWithAnd());

  const prompt = `
    Generate an engaging quiz based on ${joinWithAnd()} topics.
    It should have ${questionCount} number of questions.
    The difficulty distribution should be 30% Easy, 40% Medium, and 30% Hard.
    The questions should be sorted in increasing difficulty order.
    Ensure choices are distinct and plausible. `;
  return prompt;
}
