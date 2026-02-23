import { useParams } from "react-router-dom";
import Play from "./Play";
import { GameProvider } from "@/context/GameContext";
import type { BoardSize } from "@/types/GameTypes";

const defaultSize: BoardSize = 4;

function nameToNumber(name: string | undefined) {
	if (!name) {
		return defaultSize;
	}

	switch (name) {
		case "easy":
			return defaultSize;
		case "medium":
			return 6;
		case "hard":
			return 9;
		default:
			return defaultSize;
	}
}

export default function PlayWrapper() {
	const { size } = useParams();

	const convertedSize: BoardSize = nameToNumber(size);

	return (
		<GameProvider>
			<Play size={convertedSize} />
		</GameProvider>
	)
}