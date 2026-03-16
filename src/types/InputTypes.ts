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