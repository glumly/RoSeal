import { httpClient } from "src/ts/helpers/requests/main";
import { getRobloxUrl } from "src/ts/utils/baseUrls";
import useAuthenticatedUser from "../../hooks/useAuthenticatedUser";
import usePromise from "../../hooks/usePromise";

// The React avatar editor no longer supplies the legacy user-data meta tag.
let identity: Promise<{ userId: number }> | undefined;
function getAvatarUser() {
	if (identity) return identity;
	identity = httpClient.httpRequest<{ id: number }>({
		url: getRobloxUrl("users", "/v1/users/authenticated"),
		credentials: { type: "cookies", value: true },
	}).then(({ body }) => ({ userId: body.id })).catch((error) => {
		identity = undefined;
		throw error;
	});
	return identity;
}

export default function useAvatarUser() {
	const [user, fetched] = useAuthenticatedUser();
	const [fallback] = usePromise(() => fetched && !user ? getAvatarUser() : undefined, [fetched, user]);
	return [user ?? fallback] as const;
}
