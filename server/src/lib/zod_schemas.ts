import z from "zod";

const AnswerChoiceSchema = z.object({
  id: z.string().trim().min(1, "Choice ID is required"),
  text: z.string().trim().min(1, "Choice text cannot be empty"),
});

const QuestionSchema = z
  .object({
    id: z.string().trim().min(1).max(30),
    text: z.string().min(1, "Question text is required"),
    choices: z
      .array(AnswerChoiceSchema)
      .length(4, "A question must have 4 choices"),
    correctChoiceId: z.string().min(1, "Correct choice ID is required"),
    order: z.number().int().nonnegative(),
    timeLimitSeconds: z
      .number()
      .int()
      .min(10, "Minimum time limit is 10 seconds")
      .max(60, "Maximum time limit is 60 seconds"),
  })
  .refine(
    (data) => {
      return data.choices.some((c) => c.id === data.correctChoiceId);
    },
    {
      message: "The correctChoiceId must match one of the provided choices",
      path: ["correctChoiceId"],
    },
  );

export const QuizPayloadSchema = z.object({
  id: z.string().trim().min(1).max(30),
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
  description: z.string().trim().optional().nullable(),
  topics: z
    .array(z.string().trim().min(1))
    .optional()
    .default([])
    .transform((tags) => [...new Set(tags)]),
  questions: z.array(QuestionSchema).min(5).max(20),
});

export type QuizPayload = z.infer<typeof QuizPayloadSchema>;
