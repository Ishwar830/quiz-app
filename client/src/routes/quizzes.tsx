import { createFileRoute } from '@tanstack/react-router';
import { Search } from 'lucide-react';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { QuizCard } from '@/components/QuizCard';

export const Route = createFileRoute('/quizzes')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      My Quizzes
      <SearchBar />
      <QuizContainer />
    </div>
  );
}

function SearchBar() {
  return (
    <div>
      <InputGroup>
        <InputGroupInput type="search" placeholder="Search..." />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

function QuizContainer() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {dummyQuizInfos.map((quiz) => (
        <QuizCard key={quiz.id} quizInfo={quiz} />
      ))}
    </div>
  );
}

const dummyQuizInfos = [
  {
    id: 'quiz-js-101',
    title: 'Modern JavaScript Mastery',
    topics: ['Programming', 'Frontend', 'JavaScript'],
    description:
      'Test your knowledge of ES6+ features, async/await, and closures.',
    createdAt: 1768654400000, // Future timestamp example
    totalQuestions: 15,
  },
  {
    id: 'quiz-sci-205',
    title: 'Wonders of the Solar System',
    topics: ['Science', 'Astronomy', 'Physics'],
    description:
      'A journey through the planets, moons, and stars of our neighborhood.',
    createdAt: 1768568000000,
    totalQuestions: 10,
  },
  {
    id: 'quiz-hist-330',
    title: 'Ancient Civilizations',
    topics: ['History', 'Archaeology', 'Culture'],
    description:
      'Explore the rise and fall of the Roman Empire and Ancient Egypt.',
    createdAt: 1768481600000,
    totalQuestions: 20,
  },
  {
    id: 'quiz-geo-410',
    title: 'World Capitals Challenge',
    topics: ['Geography', 'Travel', 'General Knowledge'],
    description: 'Can you name the capital cities of these 25 countries?',
    createdAt: 1768395200000,
    totalQuestions: 25,
  },
];
