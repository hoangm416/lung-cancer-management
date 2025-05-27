import React, { createContext, useContext, useState } from "react";

interface FullscreenContextType {
  activeId: string | null;
  setActiveId: (id: string | null) => void;
}

const FullscreenContext = createContext<FullscreenContextType | undefined>(undefined);

export const FullscreenProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  return (
    <FullscreenContext.Provider value={{ activeId, setActiveId }}>
      {children}
    </FullscreenContext.Provider>
  );
};

export const useFullscreenContext = () => {
  const context = useContext(FullscreenContext);
  if (!context) {
    throw new Error("useFullscreenContext must be used within FullscreenProvider");
  }
  return context;
};
