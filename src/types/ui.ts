import type { BoardSize } from "./game";

export const InputFieldType = {
	TEXT: "text",
	PASSWORD: "password",
};

export type InputFieldType = typeof InputFieldType[keyof typeof InputFieldType];

export interface InputFieldProps {
	id: string;
	label?: string;
	type: InputFieldType;
	value?: string;
	placeholder?: string;
	disabled?: boolean;
	required?: boolean;
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
	ref?: React.RefObject<HTMLInputElement | null>;
}

export interface BoardAttributes {
	size: BoardSize
}

export interface TileAttributes {
	value?: number
	fixed?: boolean
	x?: number
	y?: number
	onClick?: () => void
	selected?: boolean
	conflict?: boolean
}

export interface ButtonAttributes {
	text?: string
	children?: React.ReactNode
	className?: string
	onClick?: (value: string) => void
	disabled?: boolean
}

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

export interface PlayAttributes {
	size: BoardSize
}
