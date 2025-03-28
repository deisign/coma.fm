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
            throw new Error(`Ошибка токена Spotify: ${response.status}`);
        }
        const data = await response.json();
        console.log('Spotify токен:', data.access_token);
        return data.access_token;
    } catch (error) {
        console.error('Ошибка получения токена Spotify:', error);
        return null;
    }
}

// Функция для получения ссылки на Spotify
async function getSpotifyLink(token, artist, track) {
    if (!token) {
        console.error('Токен Spotify отсутствует!');
        return '#';
    }
    try {
        const query = `track:${encodeURIComponent(track)} artist:${encodeURIComponent(artist)}`;
        console.log('Spotify запрос:', query);
        const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=1`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
            throw new Error(`Ошибка запроса Spotify: ${response.status}`);
        }
        const data = await response.json();
        console.log('Ответ Spotify:', data);
        return data.tracks.items[0]?.external_urls.spotify || '#';
    } catch (error) {
        console.error(`Ошибка получения ссылки на Spotify для ${artist} - ${track}:`, error);
        return '#';
    }
}

// Получение истории из Radio.co
async function fetchRadioHistory() {
    try {
        const response = await fetch(radioHistoryUrl);
        if (!response.ok) {
            throw new Error(`Ошибка API Radio.co: ${response.status}`);
        }
        const data = await response.json();
        console.log('История Radio.co:', data.data);
        return data.data;
    } catch (error) {
        console.error('Ошибка получения истории Radio.co:', error);
        return [];
    }
}

// Создание списка истории воспроизведений
async function updateHistory() {
    const historyContent = document.getElementById('history-content');
    historyContent.innerHTML = '<p>Загрузка...</p>';

    try {
        const token = await getSpotifyToken();
        const tracks = await fetchRadioHistory();

        console.log('Треки из Radio.co:', tracks);

        const trackList = await Promise.all(
            tracks.map(async (track) => {
                const spotifyLink = await getSpotifyLink(token, track.artist, track.title);
                console.log(`Трек: ${track.artist} - ${track.title}, Ссылка Spotify: ${spotifyLink}`);
                return `<li>${track.artist} - ${track.title} <a href="${spotifyLink}" target="_blank">Spotify</a></li>`;
            })
        );

        historyContent.innerHTML = `<ul>${trackList.join('')}</ul>`;
    } catch (error) {
        historyContent.innerHTML = '<p>Ошибка загрузки истории. Попробуйте позже.</p>';
        console.error('Ошибка обновления истории:', error);
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
