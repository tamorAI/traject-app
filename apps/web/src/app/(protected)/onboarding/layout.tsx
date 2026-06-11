import OnboardingHeader from "@/components/onboarding-header";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <OnboardingHeader />
      <div
        className="hidden z-100 lg:block absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div className="relative mx-auto max-w-7xl h-full px-4 sm:px-6 lg:px-8">
            <div className="absolute left-0 inset-y-0 w-px bg-border" />
            <div className="absolute right-0 inset-y-0 w-px bg-border" />
        </div>
      </div>
      {children}
    </>
  );
}
