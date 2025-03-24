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
      className="fixed bottom-8 left-0 right-0 mx-auto animate-bounce cursor-pointer rounded-full p-3 transition-all hover:scale-125 hover:bg-accent/20 z-[60] touch-pan-y flex items-center justify-center w-12 h-12"
    >
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="text-blue-400 h-8 w-8"
      >
        <path d="M12 5v14M19 12l-7 7-7-7" />
      </svg>
      <span className="sr-only">Scroll to next section</span>
    </button>
  );
} 