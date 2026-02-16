import { BookOpen, Lightbulb, Trophy, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Step {
  number: number;
  title: string;
  description: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  numberBg: string;
}

const steps: Array<Step> = [
  {
    number: 1,
    title: 'Create',
    description: 'Build a quiz with AI or from scratch using our quiz builder.',
    icon: BookOpen,
    iconBg: 'bg-primary-100',
    iconColor: 'text-primary-600',
    numberBg: 'bg-primary-500',
  },
  {
    number: 2,
    title: 'Invite',
    description: 'Share the room code — friends join instantly',
    icon: Users,
    iconBg: 'bg-secondary-100',
    iconColor: 'text-secondary-600',
    numberBg: 'bg-secondary-500',
  },
  {
    number: 3,
    title: 'Compete',
    description: 'Answer questions live or spectate the game',
    icon: Trophy,
    iconBg: 'bg-accent-100',
    iconColor: 'text-accent-700',
    numberBg: 'bg-accent-500',
  },
];

export function HowItWorksSection() {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 grid place-items-center">
          <Lightbulb size={20} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-text-900">How It Works</h2>
          <p className="text-xs text-text-400">
            Start playing in 3 simple steps
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        {steps.map((step) => (
          <StepCard step={step} key={step.number} />
        ))}
      </div>
    </section>
  );
}

function StepCard({ step }: { step: Step }) {
  return (
    <div
      key={step.number}
      className="flex flex-col items-center text-center p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
    >
      <div
        className={`w-8 h-8 rounded-lg ${step.numberBg} text-white text-sm font-bold grid place-items-center mb-3`}
      >
        {step.number}
      </div>

      <div
        className={`w-10 h-10 rounded-xl ${step.iconBg} ${step.iconColor} grid place-items-center mb-3`}
      >
        <step.icon size={20} />
      </div>
      <h3 className="font-semibold text-sm text-text-900 mb-1">{step.title}</h3>
      <p className="text-xs text-text-400 leading-relaxed text-pretty">
        {step.description}
      </p>
    </div>
  );
}
