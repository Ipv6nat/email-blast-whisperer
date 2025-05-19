
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
      <div className="fixed bottom-2 left-2 text-[12px] font-mono bg-black/5 p-1 rounded">
        <div>
          <span className="text-green-600 font-semibold">Ara</span>
          <span className="text-gray-700"> nkan </span>
          <span className="text-red-600 font-semibold">Gaza</span>
        </div>
        <div className="text-gray-500">01001001 00100000 01110011 01100101 01100101 00100000 01111001 01101111 01110101</div>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
