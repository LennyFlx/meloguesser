import {getToken} from "@/auth/tokenService";
import {ITrack, ITrackResponse} from "@/types/spotify";

export async function fetchTracksFromPlaylist(href: string) {
    try {
        const token = await getToken();
        if (!token) return null;

        const response = await fetch(href, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const trackData = await response.json();
        return trackData;
    } catch (error) {
        console.error("Error fetching track playlists:", error);
        return [];
    }
}

export async function getTracksFromPlaylist(href: string) {
    try {
        const data: ITrackResponse = await fetchTracksFromPlaylist(href);

        if (data.items && data.items.length > 0) {
            const formattedTracks: ITrack[] = data.items.map((item: any) => ({
                id: item.track.id,
                name: item.track.name,
                artists: item.track.artists.map((artist: any) => ({
                    id: artist.id,
                    name: artist.name
                })),
                releaseDate: item.track.album.release_date.substring(0, 4),
                image: item.track.album.images[0]?.url || ""
            }));
            return {
                items: formattedTracks,
                next: data.next || null
            };
        } else {
            console.warn("Aucune piste trouvée dans cette playlist.");
        }
    } catch (error) {
        console.error("Erreur lors du chargement des pistes:", error);
    }
}