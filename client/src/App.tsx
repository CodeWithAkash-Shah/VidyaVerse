import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/theme/ThemeProvider";
import MainLayout from "./components/layout/MainLayout";
import { AuthProvider } from "./hooks/auth";
import { LanguageProvider } from "./hooks/use-language";
import AppRoutes from "./routes/AppRoutes";

const queryClient = new QueryClient();

function App() {
  return (
    <>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="scholar-sync-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthProvider>
            <LanguageProvider>
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </LanguageProvider>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
    </>
  )
}

export default App
