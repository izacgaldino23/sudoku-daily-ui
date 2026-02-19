interface ButtonAttributes {
	text?: string
	children?: React.ReactNode
	className?: string
	onClick?: (value: string) => void
}

export default function Button({ text, children, className, onClick }: ButtonAttributes) {
	return (
		<button className={`button ${className || ""}`} onClick={() => onClick?.(text || "")}>
			{text}
			{children}
		</button>
	)
}