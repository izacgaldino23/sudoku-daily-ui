import type { ButtonAttributes } from "@/types/ui";
import "./Button.scss"

export default function Button({ text, children, className, onClick, disabled }: ButtonAttributes) {
	return (
		<button 
			className={`button ${className || ""}`} 
			onClick={() => onClick?.(text || "")}
			disabled={disabled} >
			{text}
			{children}
		</button>
	)
}