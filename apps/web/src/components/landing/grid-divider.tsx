export default function GridDivider() {
  return (
    <div className="relative w-full">
      <div className="w-full h-px bg-border" />
      <div className="hidden lg:flex absolute top-0 inset-x-0 justify-center h-0 overflow-visible pointer-events-none select-none">
        <div className="relative w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="absolute left-[0.5px] top-0 -translate-x-1/2 -translate-y-1/2 text-muted-foreground/50 font-bold text-2xl leading-none">
            +
          </div>
          <div className="absolute right-0 top-0 translate-x-1/2 -translate-y-1/2 text-muted-foreground/50 font-bold text-2xl leading-none">
            +
          </div>
        </div>
      </div>
    </div>
  );
}
