export interface BoardAttributes {
	size: number
}

export interface TileAttributes {
	value?: number
	filled?: boolean
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
}