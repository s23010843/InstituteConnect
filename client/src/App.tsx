import { Router, Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ErrorBoundary } from "@/components/error-boundary";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Dashboard from "@/pages/dashboard";
import About from "@/pages/about";
import Contact from "@/pages/Contact";
import Programs from "@/pages/programs";
import Faculty from "@/pages/faculty";
import Research from "@/pages/research";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import Signup from "@/pages/signup";
import Error404 from "@/pages/error-404";
import Error403 from "@/pages/error-403";
import Error500 from "@/pages/error-500";
import NotFound from "@/pages/not-found";
import ProtectedRoute from "@/components/protected-route";

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <Router>
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/signup" component={Signup} />
                <Route path="/about" component={About} />
                <Route path="/contact" component={Contact} />
                <Route path="/programs" component={Programs} />
                <Route path="/faculty" component={Faculty} />
                <Route path="/research" component={Research} />
                <Route path="/privacy" component={Privacy} />
                <Route path="/terms" component={Terms} />
                <Route path="/error/404" component={Error404} />
                <Route path="/error/403" component={Error403} />
                <Route path="/error/500" component={Error500} />
                <Route path="/dashboard">
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                </Route>
                <Route component={NotFound} />
              </Switch>
            </Router>
            <Toaster />
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;