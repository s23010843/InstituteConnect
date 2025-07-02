import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import Home from "@/pages/home";
import DashboardWrapper from "@/components/dashboard-wrapper";
import LoginPage from "@/pages/login";
import SignupPage from "@/pages/signup";
import AboutPage from "@/pages/about";
import ContactPage from "@/pages/contact";
import TermsPage from "@/pages/terms";
import PrivacyPage from "@/pages/privacy";
import Error404 from "@/pages/error-404";
import Error500 from "@/pages/error-500";
import Error403 from "@/pages/error-403";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/signup" component={SignupPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/dashboard" component={DashboardWrapper} />
      <Route path="/error/404" component={Error404} />
      <Route path="/error/500" component={Error500} />
      <Route path="/error/403" component={Error403} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
