import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import { AudioProvider } from "./hooks/useAudioContext";
import { MuteButton } from "@/components/MuteButton";
import { SettingsProvider } from '@/contexts/SettingsContext';
import { TimeProvider } from '@/contexts/TimeContext';
import { useToast } from "@/hooks/use-toast";
import { useEffect } from 'react';
import UIComponents from "@/pages/UIComponents";
import CosmicConfigs from "@/pages/CosmicConfigs";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/ui-components" component={UIComponents} />
      <Route path="/cosmic-configs" component={CosmicConfigs} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { toast } = useToast();

  useEffect(() => {
    const hasShown = localStorage.getItem('hasShownAudioToast');
    if (!hasShown) {
      toast({
        title: "🎧 For the best experience",
        description: "We recommend enabling audio. Use the mute button in the top right to control sound.", // Updated position
        duration: 5000, // 5 seconds
      });
      localStorage.setItem('hasShownAudioToast', 'true');
    }
  }, [toast]);

  return (
    <QueryClientProvider client={queryClient}>
      <TimeProvider>
        <SettingsProvider>
          <AudioProvider>
            <Router />
            <MuteButton />
            <Toaster />
          </AudioProvider>
        </SettingsProvider>
      </TimeProvider>
    </QueryClientProvider>
  );
}

export default App;