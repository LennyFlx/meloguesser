export interface IPlaylist {
    id: string;
    name: string;
    owner: {
        id: string;
        name: string;
    }
    image: string;
    tracks?: {
        href: string;
        total: number;
    }
}

export interface ITrack {
    id: string;
    name: string;
    artists: {
        id: string;
        name: string;
    }[];
    releaseDate: string;
    image: string;
}