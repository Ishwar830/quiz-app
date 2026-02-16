import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary-600 via-secondary-500 to-accent-500 p-6 sm:p-8 text-center shadow-xl">
      <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      <div className="absolute border-2 border-white/10 top-10 right-40  w-30 h-30 rounded-full" />

      <div className="relative z-10 space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
          Ready to Start Quizzing?
        </h2>
        <p className="text-sm text-white/70 max-w-md mx-auto">
          Create your first quiz in under a minute.
        </p>
        <div className="pt-1">
          <Link to="/signup">
            <Button
              size="sm"
              className="bg-white text-primary-700 hover:bg-gray-50 px-8 py-5 text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
            >
              Sign Up
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
