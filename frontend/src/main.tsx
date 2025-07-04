import React from "react";
import ReactDOM from "react-dom/client";

import "./global.css";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "sonner";
import { FullscreenProvider } from "@/context/FullScreenContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router> 
      <QueryClientProvider client={queryClient}>
        <FullscreenProvider>
          <AppRoutes />
        </FullscreenProvider>
        <Toaster visibleToasts={1} position="top-right" richColors />
      </QueryClientProvider>
    </Router>
  </React.StrictMode>
);
