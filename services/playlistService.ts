import {ENDPOINTS} from "@/constants/endpoints";
import {getToken} from "@/auth/tokenService";
import {IPlaylist} from "@/types/spotify";

export async function fetchUserPlaylists() {
    try {
        const token = await getToken();
        if (!token) return null;

        const response = await fetch(ENDPOINTS.USER_PLAYLISTS, {
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

export async function getMGPlaylists() {
    try {
        const token = await getToken();
        if (!token) return null;

        const response = await fetch(ENDPOINTS.PLAYLIST_BY_USER_ID("warnoxxx"), {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const playlistsData = await response.json();
        const mgPlaylists: IPlaylist[] = playlistsData.items.map((playlist: any) => ({
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
        return mgPlaylists.filter(playlist => playlist.name.includes('MG'));
    } catch (error) {
        console.error("Error fetching playlists:", error);
        return [];
    }
}

export async function getPlaylistsLiked(userId: string) {
    try {
        const playlists = await fetchUserPlaylists();
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

export async function getUserPlaylists(userId: string) {
    try {
        const playlists = await fetchUserPlaylists();
        if (playlists && playlists.length > 0) {
            const userPlaylistsData: IPlaylist[] = playlists.map((playlist: any) => ({
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
            return userPlaylistsData.filter(playlist => playlist.owner.id === userId);
        } else {
            console.log("No user playlists found or playlists data is empty.");
        }
    } catch (error) {
        console.error("Error fetching user playlists:", error);
        return null;
    }
}