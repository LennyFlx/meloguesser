import * as SecureStore from 'expo-secure-store';
import {ENDPOINTS} from "@/constants/endpoints";

const TOKEN_KEY = 'spotify_token';

export async function saveToken(token: string) {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(TOKEN_KEY);
}

export async function deleteToken() {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export const fetchAccessToken = async (code: string, codeVerifier: string) => {
    try {
        console.log("Utilisation du code verifier :", codeVerifier);
        const tokenResponse = await fetch(ENDPOINTS.TOKEN, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                grant_type: "authorization_code",
                code: code,
                redirect_uri: process.env.EXPO_PUBLIC_REDIRECT_URI ?? "",
                client_id: process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID ?? "",
                code_verifier: codeVerifier,
            }).toString(),
        });
        const tokenData = await tokenResponse.json();
        if (!tokenData.access_token) {
            console.error("Access token non reçu !");
            return null;
        }
        await saveToken(tokenData.access_token);
        return tokenData;
    } catch (error) {
        console.error("Erreur lors de la récupération du token :", error);
        return null;
    }
}
