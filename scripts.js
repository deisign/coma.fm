// URL истории воспроизведений Radio.co
const stationId = 's4360dbc20'; // Ваш ID станции
const radioHistoryUrl = `https://public.radio.co/stations/${stationId}/history`;

// Spotify Client ID и Client Secret
const SPOTIFY_CLIENT_ID = 'c129e640644a4b00aea9f879d5dd54f1';
const SPOTIFY_CLIENT_SECRET = 'ed3cf875c7a0492bb93a0aed5a5eaefd';

// Функция для получения Spotify токена
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
        console.log('Spotify Token:', data.access_token); // Лог токена
        return data.access_token;
    } catch (error) {
        console.error('Error fetching Spotify token:', error);
    }
}

// Функция для получения ссылки на Spotify
async function getSpotifyLink(token, artist, track) {
    try {
        const query = `track:${encodeURIComponent(track)} artist:${encodeURIComponent(artist)}`;
        console.log('Spotify Query:', query); // Лог запроса
        const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=1`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
            throw new Error(`Spotify Search Error: ${response.status}`);
        }
        const data = await response.json();
        console.log('Spotify Response:', data); // Лог ответа
        return data.tracks.items[0]?.external_urls.spotify || '#';
    } catch (error) {
        console.error(`Error fetching Spotify link for ${artist} - ${track}:`, error);
        return '#';
    }
}

// Получение истории из Radio.co
async function fetchRadioHistory() {
    try {
        const response = await fetch(radioHistoryUrl);
        if (!response.ok) {
            throw new Error(`Radio.co API Error: ${response.status}`);
        }
        const data = await response.json();
        console.log('Radio.co History:', data.data); // Лог данных Radio.co
        return data.data; // Возвращает массив треков
    } catch (error) {
        console.error('Error fetching Radio.co history:', error);
        return [];
    }
}

// Создание списка истории воспроизведений
async function updateHistory() {
    const historyContent = document.getElementById('history-content');
    historyContent.innerHTML = '<p>Loading...</p>';

    try {
        const token = await getSpotifyToken();
        const tracks = await fetchRadioHistory();

        console.log('Tracks from Radio.co:', tracks); // Лог треков

        const trackList = await Promise.all(
            tracks.map(async track => {
                const spotifyLink = await getSpotifyLink(token, track.artist, track.title);
                console.log(`Track: ${track.artist} - ${track.title}, Spotify Link: ${spotifyLink}`); // Лог ссылки на Spotify
                return `<li>${track.artist} - ${track.title} <a href="${spotifyLink}" target="_blank">Spotify</a></li>`;
            })
        );

        // Обновляем содержимое истории
        historyContent.innerHTML = `<ul>${trackList.join('')}</ul>`;
    } catch (error) {
        historyContent.innerHTML = '<p>Error loading history. Please try again later.</p>';
        console.error('Error updating history:', error);
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
