import type { ButtonAttributes } from "@/types/BoardTypes";

export default function Button({ text, children, className, onClick }: ButtonAttributes) {
	return (
		<button className={`button ${className || ""}`} onClick={() => onClick?.(text || "")}>
			{text}
			{children}
		</button>
	)
}