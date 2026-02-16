import { Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const topics = [
  'World History',
  'Movies',
  'Pop Culture',
  'Javascript',
  'Geography',
  'Classic Literature',
  'Space Exploration',
];

function useTypingEffect(
  words: Array<string>,
  typingSpeed = 80,
  pauseMs = 1800,
) {
  const [display, setDisplay] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setDisplay(current.slice(0, charIdx + 1));
          if (charIdx + 1 === current.length) {
            setTimeout(() => setIsDeleting(true), pauseMs);
          } else {
            setCharIdx((c) => c + 1);
          }
        } else {
          setDisplay(current.slice(0, charIdx));
          if (charIdx === 0) {
            setIsDeleting(false);
            setWordIdx((w) => (w + 1) % words.length);
          } else {
            setCharIdx((c) => c - 1);
          }
        }
      },
      isDeleting ? typingSpeed / 2 : typingSpeed,
    );

    return () => clearTimeout(timeout);
  }, [charIdx, isDeleting, wordIdx, words, typingSpeed, pauseMs]);

  return display;
}

export function HeroSection() {
  return (
    <section className="relative flex items-center overflow-hidden isolate py-4">
      <div className="space-y-8 relative z-10">
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Quiz on
            <br />
            <span className="relative">
              <TypingTopic />
              <span className="inline-block w-0.75 h-[0.9em] bg-primary-500 ml-0.5 animate-blink align-middle" />
            </span>
          </h1>
          <p className="text-lg text-text-500 max-w-lg leading-relaxed">
            Create quizzes from scratch or with AI, challenge friends in
            real-time rooms, and see who comes out on top.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link to="/signup">
            <Button
              size="lg"
              className="bg-linear-to-r from-primary-400 to-primary-500 hover:from-primary-500 hover:to-primary-600 text-white px-8 py-6 text-base rounded-xl shadow-sm hover:shadow-md  duration-300 hover:-translate-y-0.5 cursor-pointer group"
            >
              Start Playing
              <ArrowRight
                size={18}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </Button>
          </Link>
          <Link to="/login">
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-6 text-base rounded-xl border-2 border-text-200 bg-white/60 hover:border-primary-300 hover:bg-primary-50/80 duration-300 hover:-translate-y-0.5 cursor-pointer"
            >
              Login
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function TypingTopic() {
  const typedTopic = useTypingEffect(topics);

  return (
    <span className="bg-linear-to-r from-primary-500 via-secondary-500 to-accent-500 bg-clip-text text-transparent tracking-wide">
      {typedTopic}
    </span>
  );
}
