import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Auth pages
import SignIn from "@/pages/auth/SignIn";
import SignUp from "@/pages/auth/SignUp";
import ForgotPassword from "@/pages/auth/ForgotPassword";

// App pages
import AppLayout from "@/components/layout/AppLayout";
import Dashboard from "@/pages/app/Dashboard";
import TrainingMaterials from "@/pages/app/TrainingMaterials";
import Appearance from "@/pages/app/Appearance";
import Conversations from "@/pages/app/Conversations";
import EmbedCode from "@/pages/app/EmbedCode";
import TryMyAgent from "@/pages/app/TryMyAgent";
import Settings from "@/pages/app/Settings";
import DemoPage from "@/pages/app/DemoPage";

import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/signin" replace />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <BrowserRouter>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Auth routes */}
              <Route path="/signin" element={<PublicRoute><SignIn /></PublicRoute>} />
              <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />
              <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
              
              {/* App routes */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/demo" element={<DemoPage />} />
              
              <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/training" element={<TrainingMaterials />} />
                <Route path="/appearance" element={<Appearance />} />
                <Route path="/conversations" element={<Conversations />} />
                <Route path="/embed" element={<EmbedCode />} />
                <Route path="/try" element={<TryMyAgent />} />
                <Route path="/settings" element={<Settings />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;