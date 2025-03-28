// Функция для загрузки данных о треке
async function fetchTrackData() {
    try {
        const response = await fetch('track-info.json'); // Загружаем JSON
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        // Отображаем данные в паспорте трека
        document.getElementById('passport-artist').textContent = data.artist || 'N/A';
        document.getElementById('passport-track').textContent = data.track || 'N/A';
        document.getElementById('passport-album').textContent = data.album || 'N/A';
        document.getElementById('passport-year').textContent = data.year || 'N/A';
        document.getElementById('passport-genre').textContent = data.genre || 'N/A';

        // Обновляем обложку альбома
        const coverElement = document.getElementById('passport-cover');
        if (coverElement) {
            coverElement.src = data.cover_url || 'https://via.placeholder.com/120';
        }
    } catch (error) {
        console.error('Error fetching track data:', error);
    }
}

// Загружаем данные при старте страницы
document.addEventListener('DOMContentLoaded', fetchTrackData);
