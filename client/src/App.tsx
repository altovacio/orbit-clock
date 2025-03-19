import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import { AudioProvider } from "./hooks/useAudioContext";
import { MuteButton } from "@/components/MuteButton";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AudioProvider>
        <Router />
        <MuteButton />
        <Toaster />
      </AudioProvider>
    </QueryClientProvider>
  );
}

export default App;