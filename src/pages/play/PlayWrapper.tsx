import { useParams } from "react-router-dom";
import Play from "./Play";

const defaultSize = 4;

function nameToNumber(name: string|undefined) {
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
    return <Play size={nameToNumber(size)} />;
}