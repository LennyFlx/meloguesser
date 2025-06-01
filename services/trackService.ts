import {getToken} from "@/auth/tokenService";
import {ITrack} from "@/types/spotify";

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
        return trackData.items || [];
    } catch (error) {
        console.error("Error fetching track playlists:", error);
        return [];
    }
}

export async function getTracksFromPlaylist(href: string) {
    try {
        const fetchedTracks = await fetchTracksFromPlaylist(href);
        if (fetchedTracks && fetchedTracks.length > 0) {
            const formattedTracks: ITrack[] = fetchedTracks.map((item: any) => ({
                id: item.track.id,
                name: item.track.name,
                artists: item.track.artists.map((artist: any) => ({
                    id: artist.id,
                    name: artist.name
                })),
                releaseDate: item.track.album.release_date.substring(0, 4),
                image: item.track.album.images[0]?.url || ""
            }));
            return formattedTracks;
        } else {
            console.warn("Aucune piste trouvée dans cette playlist.");
        }
    } catch (error) {
        console.error("Erreur lors du chargement des pistes:", error);
    }
}