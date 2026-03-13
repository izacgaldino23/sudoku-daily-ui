export type AlertVariant =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "error";

export interface AlertItem {
  id: string;
  message: string;
  variant: AlertVariant;
}