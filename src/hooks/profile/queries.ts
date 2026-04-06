import { useQuery } from "@tanstack/react-query";
import { profileResume } from "@/services/authApi";
import type { ProfileResume } from "@/types/api/auth";
import { useErrorHandler } from "../useErrorHandler";

async function safeProfileResume(handleError: (error: Error) => void): Promise<ProfileResume> {
	try {
		return await profileResume();
	} catch (error) {
		handleError(error as Error);
		throw error;
	}
}

export function useGetProfileResume() {
	const handleError = useErrorHandler();

	return useQuery<ProfileResume>({
		queryKey: ["get", "profile", "resume"],
		queryFn: () => safeProfileResume(handleError),
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		retry: false,
		throwOnError: true,
	});
}
