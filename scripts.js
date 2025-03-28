// Last.fm API ключ
const LAST_FM_API_KEY = 'c7a0f0ef6e54d0bc9c877ef6cdaf3949';

// Функция для получения данных о текущем треке с Last.fm
async function getLastFmTrackInfo(artist, track) {
    try {
        const url = `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${LAST_FM_API_KEY}&artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(track)}&format=json`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Last.fm API Error: ${response.status}`);
        }
        const data = await response.json();

        // Обновляем паспорт трека
        document.getElementById('passport-artist').textContent = data.track.artist.name || 'N/A';
        document.getElementById('passport-track').textContent = data.track.name || 'N/A';
        document.getElementById('passport-album').textContent = data.track.album?.title || 'N/A';
        document.getElementById('passport-year').textContent = data.track.wiki?.published?.split(', ')[1] || 'N/A';
        document.getElementById('passport-genre').textContent = data.track.toptags?.tag?.[0]?.name || 'N/A';
        document.getElementById('passport-cover').src = data.track.album?.image?.[2]?.['#text'] || 'https://via.placeholder.com/120';
    } catch (error) {
        console.error('Error fetching Last.fm data:', error);
    }
}

// Функция для получения текущего трека из радио-плеера (если доступно API радио)
async function getCurrentTrack() {
    try {
        // Пример запроса к вашему радио API (замените на рабочий URL)
        const response = await fetch('https://your-radio-api-url/now-playing');
        if (!response.ok) {
            throw new Error(`Radio API Error: ${response.status}`);
        }
        const data = await response.json();

        // Получаем исполнителя и трек
        const artist = data.artist || 'Unknown Artist';
        const track = data.track || 'Unknown Track';

        // Обновляем паспорт трека через Last.fm
        await getLastFmTrackInfo(artist, track);
    } catch (error) {
        console.error('Error fetching current track:', error);
    }
}

// Загружаем данные при старте страницы
document.addEventListener('DOMContentLoaded', getCurrentTrack);
