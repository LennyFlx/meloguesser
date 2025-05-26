import {getToken} from "@/auth/tokenService";
import {ENDPOINTS} from "@/constants/endpoints";


export async function fetchUserData() {
    try {

        const token = await getToken();
        if (!token) return null;


        const response = await fetch(ENDPOINTS.USER, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const userData = await response.json();
        if (userData.product === "premium") {
            return userData;
        }

        return userData;

    } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
    }
}