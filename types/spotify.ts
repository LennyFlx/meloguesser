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