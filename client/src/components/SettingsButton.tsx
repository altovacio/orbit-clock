import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { SettingsPanel } from "@/components/SettingsPanel";

export function SettingsButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-16 right-4 z-50 bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-all duration-200"
          title="Settings"
        >
          <SlidersHorizontal className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <SettingsPanel />
      </DialogContent>
    </Dialog>
  );
} 