// URL истории воспроизведений Radio.co
const stationId = 's4360dbc20'; // Ваш ID станции
const radioHistoryUrl = `https://public.radio.co/stations/${stationId}/history`;

// Spotify Client ID и Client Secret
const SPOTIFY_CLIENT_ID = 'c129e640644a4b00aea9f879d5dd54f1';
const SPOTIFY_CLIENT_SECRET = 'ed3cf875c7a0492bb93a0aed5a5eaefd';

// Функция для получения Spotify токена
async function getSpotifyToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`,
        },
        body: 'grant_type=client_credentials',
    });
    const data = await response.json();
    return data.access_token;
}

// Функция для получения ссылки на Spotify
async function getSpotifyLink(token, artist, track) {
    const query = `track:${encodeURIComponent(track)} artist:${encodeURIComponent(artist)}`;
    const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=1`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await response.json();
    return data.tracks.items[0]?.external_urls.spotify || '#';
}

// Получение истории из Radio.co
async function fetchRadioHistory() {
    const response = await fetch(radioHistoryUrl);
    const data = await response.json();
    return data.data; // Возвращает массив треков
}

// Создание списка истории воспроизведений
async function updateHistory() {
    const historyContent = document.getElementById('history-content');
    historyContent.innerHTML = '<p>Loading...</p>';

    try {
        const token = await getSpotifyToken();
        const tracks = await fetchRadioHistory();

        const trackList = tracks.map(async track => {
            const spotifyLink = await getSpotifyLink(token, track.artist, track.title);
            return `<li>${track.artist} - ${track.title} <a href="${spotifyLink}" target="_blank">Spotify</a></li>`;
        });

        const resolvedTracks = await Promise.all(trackList);
        historyContent.innerHTML = `<ul>${resolvedTracks.join('')}</ul>`;
    } catch (error) {
        historyContent.innerHTML = '<p>Error loading history. Please try again later.</p>';
        console.error('Error fetching history:', error);
    }
}

// Управление всплывающим окном
document.getElementById('history-button').addEventListener('click', () => {
    document.getElementById('history-popup').classList.remove('hidden');
    updateHistory();
});

document.getElementById('close-button').addEventListener('click', () => {
    document.getElementById('history-popup').classList.add('hidden');
});
