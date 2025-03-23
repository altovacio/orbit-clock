import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAudioContext } from "@/hooks/useAudioContext";

export function MuteButton() {
  const { isMuted, toggleMute, playSound } = useAudioContext();

  const handleClick = () => {
    // Play a barely audible click at 1Hz to initialize audio context
    playSound(0); // Use lowest frequency
    toggleMute();
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="fixed top-4 right-4 z-50 bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-all duration-200"
      onClick={handleClick}
      title={isMuted ? "Unmute" : "Mute"}
    >
      {isMuted ? (
        <VolumeX className="h-5 w-5" />
      ) : (
        <Volume2 className="h-5 w-5" />
      )}
      <span className="sr-only">{isMuted ? "Unmute" : "Mute"}</span>
    </Button>
  );
}
