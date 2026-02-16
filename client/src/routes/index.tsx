import { createFileRoute } from '@tanstack/react-router';
import { HeroSection } from '@/components/Homepage/HeroSection';
import { FeaturesSection } from '@/components/Homepage/FeaturesSection';
import { HowItWorksSection } from '@/components/Homepage/HowItWorksSection';
import { CTASection } from '@/components/Homepage/CTASection';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="relative overflow-hidden p-4 md:px-12 grid gap-8">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
    </div>
  );
}
