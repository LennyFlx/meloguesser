import {getToken} from "@/auth/tokenService";
import {ENDPOINTS} from "@/constants/endpoints";
import {IUserResponse} from "@/types/spotify";


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

        const data = await response.json();
        const userData: IUserResponse = {
            id: data.id,
            name: data.display_name,
            product: data.product
        };
        return userData;

    } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
    }
}