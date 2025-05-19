
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
      <Sonner />
      <div className="fixed bottom-2 left-2 text-[10px] text-gray-400 opacity-40 font-mono">
        <div>Ara Nkan gara</div>
        <div>01001001 00100000 01110011 01100101 01100101 00100000 01111001 01101111 01110101</div>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
