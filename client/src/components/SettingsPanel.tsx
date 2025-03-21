import { useSettings } from "@/contexts/SettingsContext";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";

export function SettingsPanel() {
  const { starSize, setStarSize, colorScheme, toggleColorScheme, colorMode, toggleColorMode } = useSettings();

  return (
    <div className="space-y-6">
      <DialogTitle className="text-center">Visual Settings</DialogTitle>
      <DialogDescription className="text-center">
        Customize the orbital display appearance
      </DialogDescription>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="star-size">Star Size</Label>
            <span className="text-sm text-muted-foreground">{starSize}x</span>
          </div>
          <Slider
            id="star-size"
            value={[starSize]}
            onValueChange={([value]) => setStarSize(value)}
            min={0.5}
            max={2}
            step={0.1}
          />
        </div>

        <div className="flex items-center justify-between space-x-4">
          <Label htmlFor="color-scheme">High Quality Colors</Label>
          <Switch
            id="color-scheme"
            checked={colorScheme === 'highQuality'}
            onCheckedChange={toggleColorScheme}
          />
        </div>

        <div className="flex items-center justify-between space-x-4">
          <Label htmlFor="color-mode">Colorful Mode</Label>
          <Switch
            id="color-mode"
            checked={colorMode === 'multicolor'}
            onCheckedChange={toggleColorMode}
          />
        </div>
      </div>
    </div>
  );
} 