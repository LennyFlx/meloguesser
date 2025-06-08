export interface IUserResponse {
    id: string;
    name: string;
    product: string;
}

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

export interface IPlaylistResponse {
    items: IPlaylist[];
    next?: string;
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

export interface ITrackResponse {
    items: ITrack[];
    next?: string;
}

export enum PlaylistType {
    LIKED = 'liked',
    MY = 'my',
    MG = 'mg'
}