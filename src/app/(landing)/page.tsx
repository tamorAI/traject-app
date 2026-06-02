import Header from "@/components/landing/header";
import Hero from "@/components/landing/hero";
import FeaturesSection from "@/components/landing/features-section";
import TrajectoryIntelligence from "@/components/landing/trajectory-intelligence";
import CTASection from "@/components/landing/cta-section";
import Footer from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <>
      <Header />
      <Hero />
      <FeaturesSection />
      <TrajectoryIntelligence />
      <CTASection />
      <Footer />
    </>
  );
}
