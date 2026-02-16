import { BookOpen, Brain, StarIcon, Swords, Trophy } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const features = [
  {
    icon: Swords,
    title: 'Real-Time Battles',
    description:
      'Go head-to-head in live quiz rooms with instant score updates',
    iconBg: 'bg-primary-100',
    iconColor: 'text-primary-600',
  },
  {
    icon: Brain,
    title: 'AI-Powered Quizzes',
    description: 'Type a topic and get a full quiz in seconds',
    iconBg: 'bg-secondary-100',
    iconColor: 'text-secondary-600',
  },
  {
    icon: BookOpen,
    title: 'Custom Quiz Builder',
    description:
      'Craft your custom quiz with ease',
    iconBg: 'bg-accent-100',
    iconColor: 'text-accent-700',
  },
  {
    icon: Trophy,
    title: 'Game History',
    description: 'Track every game you have played',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
  },
];

export function FeaturesSection() {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent-100 text-accent-600 grid place-items-center">
          <StarIcon size={20} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-text-900">Features</h2>
          <p className="text-xs text-text-400">
            Everything you need to quiz
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {features.map((f) => (
          <FeatureCard key={f.title} {...f} />
        ))}
      </div>
    </section>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  iconBg,
  iconColor,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="group flex items-start gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
      <div
        className={`shrink-0 w-10 h-10 rounded-xl ${iconBg} ${iconColor} grid place-items-center`}
      >
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-sm text-text-900">{title}</p>
        <p className="text-xs text-text-400 mt-0.5 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
