import { AlertStack } from "@/components/alert/AlertStack";
import type { AlertItem, AlertVariant } from "@/types/AlertTypes";
import {
  useState,
  type ReactNode,
} from "react";
import { AlertsContext } from "./AlertContext";

export function AlertsProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  function removeAlert(id: string) {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }

  function pushAlert(message: string, variant: AlertVariant = "info") {
    const id = crypto.randomUUID();

    const newAlert: AlertItem = {
      id,
      message,
      variant
    };

    setAlerts((prev) => [...prev, newAlert]);

    setTimeout(() => removeAlert(id), 5000);
  }

  return (
    <AlertsContext.Provider value={{ pushAlert }}>
      {children}

      <AlertStack
        alerts={alerts}
        removeAlert={removeAlert}
      />
    </AlertsContext.Provider>
  );
}