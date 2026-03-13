import type { AlertVariant } from "@/types/AlertTypes";
import { createContext, useContext } from "react";

interface ContextProps {
  pushAlert: (message: string, variant?: AlertVariant) => void;
}

export const AlertsContext = createContext<ContextProps | null>(null);

export function useAlert() {
  const ctx = useContext(AlertsContext);

  if (!ctx) {
    throw new Error("useAlert must be used inside AlertsProvider");
  }

  return ctx;
}