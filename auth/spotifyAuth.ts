import { ENDPOINTS } from "@/constants/endpoints";
import { ResponseType, useAuthRequest } from "expo-auth-session";
import { SCOPES } from "@/constants/spotify";

const discovery = {
    authorizationEndpoint: ENDPOINTS.AUTHORIZE,
    tokenEndpoint: ENDPOINTS.TOKEN,
};

export function useSpotifyAuth() {
    const CLIENT_ID = process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID ?? "";
    const REDIRECT_URI = process.env.EXPO_PUBLIC_REDIRECT_URI ?? "";

    const [request, response, promptAsync] = useAuthRequest(
        {
            responseType: ResponseType.Code,
            clientId: CLIENT_ID,
            scopes: SCOPES,
            redirectUri: REDIRECT_URI,
            usePKCE: true,
        },
        discovery
    );

    return {
        request,
        response,
        promptAsync,
    };
}