// Spotify Client ID и Client Secret
const SPOTIFY_CLIENT_ID = 'c129e640644a4b00aea9f879d5dd54f1';
const SPOTIFY_CLIENT_SECRET = 'ed3cf875c7a0492bb93a0aed5a5eaefd';

// Функция для получения токена Spotify
async function getSpotifyToken() {
    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`,
            },
            body: 'grant_type=client_credentials',
        });
        if (!response.ok) {
            throw new Error(`Spotify Token Error: ${response.status}`);
        }
        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error('Error fetching Spotify token:', error);
    }
}

// Функция для поиска трека в Spotify
async function getSpotifyTrackInfo(token, artist, trackName) {
    try {
        const url = `https://api.spotify.com/v1/search?q=track:${encodeURIComponent(trackName)}%20artist:${encodeURIComponent(artist)}&type=track&limit=1`;
        const response = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
            throw new Error(`Spotify Search Error: ${response.status}`);
        }
        const data = await response.json();
        return data.tracks.items[0]; // Первый найденный трек
    } catch (error) {
        console.error('Error fetching Spotify track info:', error);
    }
}

// Функция для обновления паспорта трека
async function updateTrackPassport(artist, trackName) {
    try {
        const token = await getSpotifyToken();
        const trackData = await getSpotifyTrackInfo(token, artist, trackName);

        if (trackData) {
            document.getElementById('passport-artist').textContent = trackData.artists[0].name || 'N/A';
            document.getElementById('passport-track').textContent = trackData.name || 'N/A';
            document.getElementById('passport-album').textContent = trackData.album.name || 'N/A';
            document.getElementById('passport-year').textContent = trackData.album.release_date.split('-')[0] || 'N/A';
            document.getElementById('passport-cover').src = trackData.album.images[0]?.url || 'https://via.placeholder.com/120';
        }
    } catch (error) {
        console.error('Error updating track passport:', error);
    }
}

// Функция для получения текущего трека от радио API
async function getCurrentTrack() {
    const stationId = 's213997'; // Ваш ID станции
    const apiUrl = `https://public.radio.co/stations/${stationId}/current`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Radio.co API Error: ${response.status}`);
        }
        const data = await response.json();
        console.log('Radio.co Data:', data);

        const artist = data.artist || 'Unknown Artist';
        const trackName = data.title || 'Unknown Track';

        // Обновляем паспорт трека через Spotify
        await updateTrackPassport(artist, trackName);
    } catch (error) {
        console.error('Error fetching current track:', error);
    }
}

// Загружаем данные при старте страницы
document.addEventListener('DOMContentLoaded', getCurrentTrack);
