import {ENDPOINTS} from "@/constants/endpoints";
import {getToken} from "@/auth/tokenService";
import {IPlaylist} from "@/types/spotify";

export async function getPlaylists() {
    try {
        const token = await getToken();
        if (!token) return null;

        const response = await fetch(ENDPOINTS.PLAYLISTS, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const playlistsData = await response.json();
        return playlistsData.items || [];
    } catch (error) {
        console.error("Error fetching playlists:", error);
        return [];
    }
}

export async function getPlaylistsLiked(userId: string) {
    try {
        const playlists = await getPlaylists();
        if (playlists && playlists.length > 0) {
            const likedPlaylistsData: IPlaylist[] = playlists.map((playlist: any) => ({
                id: playlist.id,
                name: playlist.name,
                owner: {
                    id: playlist.owner.id,
                    name: playlist.owner.display_name
                },
                image: playlist.images[0]?.url || "",
                tracks: {
                    href: playlist.tracks.href,
                    total: playlist.tracks.total
                }
            }));
            return likedPlaylistsData.filter(playlist => playlist.owner.id !== userId);
        } else {
            console.log("No liked playlists found or playlists data is empty.");
        }
    } catch (error) {
        console.error("Error fetching liked playlist:", error);
        return null;
    }
}