import { Toaster } from "@/components/ui/sonner";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { ExpertProvider } from "@/contexts/ExpertContext";
import Index from "./pages/Index";
import ScheduleCall from "./pages/ScheduleCall";
import Experts from "./pages/Experts";
import Campaigns from "./pages/Campaigns";
import Transcripts from "./pages/Transcripts";
import Assistants from "./pages/Assistants";
import InterviewConfig from "./pages/InterviewConfig";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ExpertProvider>
          <SidebarProvider>
            <div className="min-h-screen flex w-full">
              <AppSidebar />
              <div className="flex-1 flex flex-col min-w-0">
                {/* Header with Sidebar Toggle */}
                <header className="h-14 border-b border-border bg-card px-4 flex items-center shrink-0">
                  <SidebarTrigger />
                  <div className="flex-1" />
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto">
                  <div className="p-6">
                    <Routes>
                      <Route index element={<Index />} />
                      <Route path="schedule-call" element={<ScheduleCall />} />
                      <Route path="experts" element={<Experts />} />
                      <Route path="campaigns" element={<Campaigns />} />
                      <Route path="transcripts" element={<Transcripts />} />
                      <Route path="assistants" element={<Assistants />} />
                      <Route
                        path="interview-config"
                        element={<InterviewConfig />}
                      />
                      <Route path="settings" element={<Settings />} />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </div>
                </main>
              </div>
            </div>
          </SidebarProvider>
        </ExpertProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
