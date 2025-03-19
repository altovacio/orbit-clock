import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAudioContext } from "@/hooks/useAudioContext";

export function MuteButton() {
  const { isMuted, toggleMute } = useAudioContext();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="fixed top-4 right-4 z-50 bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-all duration-200"
      onClick={toggleMute}
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
