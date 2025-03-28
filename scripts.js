// Загружаем данные о текущем треке при загрузке страницы
document.addEventListener('DOMContentLoaded', getRadioTrackInfo);

// Функция для получения данных о треке через Radio.co API
async function getRadioTrackInfo() {
    const stationId = 's213997'; // ID вашей станции
    const apiUrl = `https://public.radio.co/stations/${stationId}/current`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Radio.co API Error: ${response.status}`);
        }
        const data = await response.json();
        console.log('Radio.co Data:', data);

        // Обновление паспорта трека
        document.getElementById('passport-artist').textContent = data.artist || 'N/A';
        document.getElementById('passport-track').textContent = data.title || 'N/A'; // Название трека
        document.getElementById('passport-album').textContent = 'N/A'; // Если альбом недоступен
        document.getElementById('passport-cover').src = data.artwork || 'https://via.placeholder.com/120'; // Обложка трека
    } catch (error) {
        console.error('Error fetching Radio.co track info:', error);
    }
}
