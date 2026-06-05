import Header from "@/components/landing/header";
import Hero from "@/components/landing/hero";
import KillFrame from "@/components/landing/kill-frame";
import FeaturesSection from "@/components/landing/features-section";
import TrajectoryIntelligence from "@/components/landing/trajectory-intelligence";
import CTASection from "@/components/landing/cta-section";
import Footer from "@/components/landing/footer";
import GridDivider from "@/components/landing/grid-divider";

export default function LandingPage() {
  return (
    <main className="relative isolate overflow-hidden">
      <div
        className="hidden z-100 lg:block absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div className="relative mx-auto max-w-7xl h-full px-4 sm:px-6 lg:px-8">
          <div className="absolute left-0 inset-y-0 w-px bg-border" />
          <div className="absolute right-0 inset-y-0 w-px bg-border" />
          {/* <div className="absolute left-0 right-0 top-2/4 h-px bg-border" />
          <div className="absolute left-0 right-0 top-3/4 h-px bg-border" /> */}
        </div>
      </div>

      <Header />
      <Hero />
      <GridDivider />
      <KillFrame />
      <GridDivider />
      <FeaturesSection />
      <GridDivider />
      <TrajectoryIntelligence />
      <GridDivider />
      <CTASection />
      <Footer />
    </main>
  );
}
