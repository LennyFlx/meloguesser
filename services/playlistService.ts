import {ENDPOINTS} from "@/constants/endpoints";
import {getToken} from "@/auth/tokenService";
import {IPlaylist, IPlaylistResponse, PlaylistType} from "@/types/spotify";
import {PLAYLIST_LIMIT} from "@/constants/limits";

export const fetchPlaylists = async (type: PlaylistType): Promise<IPlaylistResponse | null> => {
    try {
        const token = await getToken();
        if (!token) return null;

        let endpoint: string;

        switch (type) {
            case PlaylistType.LIKED:
                endpoint = ENDPOINTS.USER_PLAYLISTS + PLAYLIST_LIMIT;
                break;
            case PlaylistType.MY:
                endpoint = ENDPOINTS.USER_PLAYLISTS + PLAYLIST_LIMIT;
                break;
            case PlaylistType.MG:
                endpoint = ENDPOINTS.PLAYLIST_BY_USER_ID("warnoxxx") + PLAYLIST_LIMIT;
                break;
            default:
                throw new Error("Invalid playlist type");
        }

        const response = await fetch(endpoint, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const playlistsData: IPlaylist[] = data.items.map((playlist: any) => ({
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

        if (PlaylistType.LIKED === type) {
            return {
                items: playlistsData.filter(playlist => playlist.owner.id !== "warnoxxx"), // Replace by current user ID
                next: data.next || null
            };
        } else if (PlaylistType.MY === type) {
            return {
                items: playlistsData.filter(playlist => playlist.owner.id === "warnoxxx"), // Replace by current user ID
                next: data.next || null
            };
        } else {
            return {
                items: playlistsData.filter(playlist => playlist.name.includes('MG')),
                next: data.next || null
            };
        }
    } catch (error) {
        console.error("Error fetching playlists:", error);
        return null;
    }
}

export const fetchNextPlaylists = async (url: string, type: PlaylistType): Promise<IPlaylistResponse | null> => {
    try {
        const token = await getToken();
        if (!token) return null;

        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const playlistsData: IPlaylist[] = data.items.map((playlist: any) => ({
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

        if (PlaylistType.LIKED === type) {
            return {
                items: playlistsData.filter(playlist => playlist.owner.id !== "warnoxxx"), // Replace by current user ID
                next: data.next || null
            };
        } else if (PlaylistType.MY === type) {
            return {
                items: playlistsData.filter(playlist => playlist.owner.id === "warnoxxx"), // Replace by current user ID
                next: data.next || null
            };
        } else {
            return {
                items: playlistsData.filter(playlist => playlist.name.includes('MG')),
                next: data.next || null
            };
        }
    } catch (error) {
        console.error("Error fetching next playlists:", error);
        return null;
    }
}
