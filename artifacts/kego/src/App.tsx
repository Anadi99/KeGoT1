import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home";
import DashboardPage from "@/pages/dashboard";
import ProjectsPage from "@/pages/projects";
import SearchPage from "@/pages/search";
import IntegrationsPage from "@/pages/integrations";
import SettingsPage from "@/pages/settings";
import ProjectRecoveryPage from "@/pages/projects/project-recovery";
import ProjectVaultPage from "@/pages/projects/project-vault";
import ProjectTimelinePage from "@/pages/projects/project-timeline";
import ProjectHubPage from "@/pages/projects/project-hub";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/projects" component={ProjectsPage} />
      <Route path="/projects/:id/recovery" component={ProjectRecoveryPage} />
      <Route path="/projects/:id/vault" component={ProjectVaultPage} />
      <Route path="/projects/:id/timeline" component={ProjectTimelinePage} />
      <Route path="/projects/:id/hub" component={ProjectHubPage} />
      <Route path="/search" component={SearchPage} />
      <Route path="/integrations" component={IntegrationsPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
