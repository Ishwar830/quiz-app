import { createFileRoute } from '@tanstack/react-router';
import type { Quiz } from '@/stores/quiz.store';
import { QuizBuilder } from '@/components/QuizBuilder';

export const Route = createFileRoute('/quizzes')({
  component: RouteComponent,
  loader: () => mockQuiz,
});

function RouteComponent() {
  const quiz = Route.useLoaderData();

  return (
    <div>
      <QuizBuilder quiz={quiz} />
    </div>
  );
}

const mockQuiz: Quiz = {
  id: 'quiz-001',
  title: 'General Knowledge Basics',
  topic: 'General Knowledge',
  createdAt: Date.now(),
  updatedAt: Date.now(),
  questions: [
    {
      id: 'q-001',
      text: 'What is the capital city of France?',
      choices: [
        { id: 'c-001-a', text: 'London' },
        { id: 'c-001-b', text: 'Berlin' },
        { id: 'c-001-c', text: 'Paris' },
        { id: 'c-001-d', text: 'Madrid' },
      ],
      correctChoiceId: 'c-001-c',
    },
    {
      id: 'q-002',
      text: "Which planet is known as the 'Red Planet'?",
      choices: [
        { id: 'c-002-a', text: 'Venus' },
        { id: 'c-002-b', text: 'Mars' },
        { id: 'c-002-c', text: 'Jupiter' },
        { id: 'c-002-d', text: 'Saturn' },
      ],
      correctChoiceId: 'c-002-b',
    },
    {
      id: 'q-003',
      text: 'What is the chemical symbol for water?',
      choices: [
        { id: 'c-003-a', text: 'O2' },
        { id: 'c-003-b', text: 'CO2' },
        { id: 'c-003-c', text: 'H2O' },
        { id: 'c-003-d', text: 'NaCl' },
      ],
      correctChoiceId: 'c-003-c',
    },
    {
      id: 'q-004',
      text: "Who wrote 'Romeo and Juliet'?",
      choices: [
        { id: 'c-004-a', text: 'Charles Dickens' },
        { id: 'c-004-b', text: 'William Shakespeare' },
        { id: 'c-004-c', text: 'Mark Twain' },
        { id: 'c-004-d', text: 'Jane Austen' },
      ],
      correctChoiceId: 'c-004-b',
    },
    {
      id: 'q-005',
      text: 'How many continents are there on Earth?',
      choices: [
        { id: 'c-005-a', text: '5' },
        { id: 'c-005-b', text: '6' },
        { id: 'c-005-c', text: '7' },
        { id: 'c-005-d', text: '8' },
      ],
      correctChoiceId: 'c-005-c',
    },
    {
      id: 'q-006',
      text: 'What is the largest mammal in the world?',
      choices: [
        { id: 'c-006-a', text: 'African Elephant' },
        { id: 'c-006-b', text: 'Blue Whale' },
        { id: 'c-006-c', text: 'Giraffe' },
        { id: 'c-006-d', text: 'Great White Shark' },
      ],
      correctChoiceId: 'c-006-b',
    },
    {
      id: 'q-007',
      text: 'Which gas do plants absorb from the atmosphere for photosynthesis?',
      choices: [
        { id: 'c-007-a', text: 'Oxygen' },
        { id: 'c-007-b', text: 'Carbon Dioxide' },
        { id: 'c-007-c', text: 'Nitrogen' },
        { id: 'c-007-d', text: 'Hydrogen' },
      ],
      correctChoiceId: 'c-007-b',
    },
    {
      id: 'q-008',
      text: 'What is the hardest natural substance on Earth?',
      choices: [
        { id: 'c-008-a', text: 'Gold' },
        { id: 'c-008-b', text: 'Iron' },
        { id: 'c-008-c', text: 'Diamond' },
        { id: 'c-008-d', text: 'Platinum' },
      ],
      correctChoiceId: 'c-008-c',
    },
    {
      id: 'q-009',
      text: 'What is the square root of 64?',
      choices: [
        { id: 'c-009-a', text: '6' },
        { id: 'c-009-b', text: '7' },
        { id: 'c-009-c', text: '8' },
        { id: 'c-009-d', text: '9' },
      ],
      correctChoiceId: 'c-009-c',
    },
    {
      id: 'q-010',
      text: 'In which year did the Titanic sink?',
      choices: [
        { id: 'c-010-a', text: '1905' },
        { id: 'c-010-b', text: '1912' },
        { id: 'c-010-c', text: '1920' },
        { id: 'c-010-d', text: '1898' },
      ],
      correctChoiceId: 'c-010-b',
    },
  ],
};
