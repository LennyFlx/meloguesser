import {fetchAccessToken} from "@/auth/tokenService";

export const handleAuthResponse = async (response: any, request: any) => {
    if (response?.type === "success" && response.params.code) {
        const tokenData = await fetchAccessToken(response.params.code, request?.codeVerifier || '');
        if (tokenData) {
            const accessToken = tokenData.access_token;
            console.log("Access token récupéré :", accessToken);

        } else {
            console.error("Échec de la récupération du token d'accès.");
        }
    } else {
        console.error("Erreur d'authentification ou code manquant dans la réponse :", response);
    }
    return null;
}