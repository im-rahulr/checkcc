import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient} data-oid="qtfxdrr">
    <TooltipProvider data-oid="e5db87s">
      <Toaster data-oid="dfi0rxn" />
      <Sonner data-oid="kxo9jhf" />
      <BrowserRouter data-oid="m48al1y">
        <Routes data-oid="l1ko5xg">
          <Route
            path="/"
            element={<Index data-oid="xgiav3p" />}
            data-oid=".:amkvj"
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route
            path="*"
            element={<NotFound data-oid="dc77kz:" />}
            data-oid="mgev0h_"
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
