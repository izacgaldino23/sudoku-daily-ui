import type { AlertItem } from "@/types/AlertTypes";
import { Alert } from "./Alert";

interface Props {
  alerts: AlertItem[];
  removeAlert: (id: string) => void;
}

export function AlertStack({ alerts, removeAlert }: Props) {
  return (
    <div className="alert-stack">
      {alerts.map((alert) => (
        <Alert
          key={alert.id}
          alert={alert}
          onClose={removeAlert}
        />
      ))}
    </div>
  );
}