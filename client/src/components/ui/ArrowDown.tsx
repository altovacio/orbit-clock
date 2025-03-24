import { ChevronDown } from "lucide-react";

export function ArrowDown({ targetSectionId }: { targetSectionId?: string }) {
  const scrollToNext = () => {
    if (!targetSectionId) return;
    
    const element = document.getElementById(targetSectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <button
      onClick={scrollToNext}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer rounded-full p-3 transition-all hover:scale-125 hover:bg-accent/20 z-[60] touch-pan-y flex items-center justify-center"
    >
      <ChevronDown className="h-8 w-8 text-blue-400 md:h-10 md:w-10" />
      <span className="sr-only">Scroll to next section</span>
    </button>
  );
} 