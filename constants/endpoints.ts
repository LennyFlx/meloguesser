export const ENDPOINTS = {
    AUTHORIZE: 'https://accounts.spotify.com/authorize',
    TOKEN: 'https://accounts.spotify.com/api/token',
    USER: 'https://api.spotify.com/v1/me',
    USER_PLAYLISTS: 'https://api.spotify.com/v1/me/playlists',
    PLAYLIST_BY_USER_ID: (userId: string) => `https://api.spotify.com/v1/users/${userId}/playlists`,
}