// Last.fm API ключ
const LAST_FM_API_KEY = 'c7a0f0ef6e54d0bc9c877ef6cdaf3949';

// Spotify Client ID и Client Secret
const SPOTIFY_CLIENT_ID = 'c129e640644a4b00aea9f879d5dd54f1';
const SPOTIFY_CLIENT_SECRET = 'ed3cf875c7a0492bb93a0aed5a5eaefd';

// Функция для получения данных о треке с Last.fm
async function getLastFmTrackInfo(artist, track) {
    const url = `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${LAST_FM_API_KEY}&artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(track)}&format=json`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Last.fm API Error: ${response.status}`);
    return await response.json();
}

// Функция для получения токена Spotify
async function getSpotifyToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`,
        },
        body: 'grant_type=client_credentials',
    });
    if (!response.ok) throw new Error(`Spotify Token Error: ${response.status}`);
    const data = await response.json();
    return data.access_token;
}

// Функция для поиска трека в Spotify
async function getSpotifyTrackUrl(token, trackName) {
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(trackName)}&type=track&limit=1`;
    const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error(`Spotify Search Error: ${response.status}`);
    const data = await response.json();
    return data.tracks.items.length > 0 ? data.tracks.items[0].external_urls.spotify : '#';
}

// Основная функция для обновления паспорта трека
async function updateTrackPassport() {
    try {
        const artist = 'Daft Punk'; // Замените на динамическую информацию о текущем исполнителе
        const track = 'Get Lucky'; // Замените на динамическую информацию о текущем треке

        // Получаем данные с Last.fm
        const lastFmData = await getLastFmTrackInfo(artist, track);
        const trackInfo = lastFmData.track;

        // Обновляем информацию о треке
        document.getElementById('passport-artist').textContent = trackInfo.artist.name;
        document.getElementById('passport-track').textContent = trackInfo.name;
        document.getElementById('passport-album').textContent = trackInfo.album ? trackInfo.album.title : 'N/A';
        document.getElementById('passport-year').textContent = trackInfo.wiki ? trackInfo.wiki.published.split(',')[1] : 'N/A';
        document.getElementById('passport-genre').textContent = trackInfo.toptags.tag.length > 0 ? trackInfo.toptags.tag[0].name : 'N/A';
        document.getElementById('passport-cover').src = trackInfo.album ? trackInfo.album.image[2]['#text'] : 'https://via.placeholder.com/120';

        // Получаем ссылку на трек с Spotify
        const spotifyToken = await getSpotifyToken();
        const spotifyUrl = await getSpotifyTrackUrl(spotifyToken, trackInfo.name);
        document.getElementById('spotify-link').href = spotifyUrl;
    } catch (error) {
        console.error('Ошибка обновления паспорта трека:', error);
    }
}

// Загружаем данные при старте страницы
document.addEventListener('DOMContentLoaded', updateTrackPassport);
