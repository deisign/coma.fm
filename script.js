
const LASTFM_KEY = 'c7a0f0ef6e54d0bc9c877ef6cdaf3949';
const stationID = 's213997';

async function fetchNowPlaying() {
  const statusURL = `https://public.radio.co/stations/${stationID}/status`;
  const res = await fetch(statusURL);
  const data = await res.json();
  const track = data.current_track?.title;
  const artist = data.current_track?.artist;

  if (!track || track.toLowerCase().includes("no track")) {
    showFallback();
    return;
  }

  document.getElementById('fallback').classList.add('hidden');
  document.getElementById('info').classList.remove('hidden');

  document.getElementById('title').textContent = track;

  if (data.current_track?.artwork_url) {
    const img = document.getElementById('artwork');
    img.src = data.current_track.artwork_url;
    img.classList.remove('hidden');
  }

  const spotify = data.current_track?.spotify_url;
  const btn = document.getElementById('spotify');
  if (spotify) {
    btn.href = spotify;
    btn.classList.remove('hidden');
  } else {
    btn.classList.add('hidden');
  }

  if (artist && track) fetchFromLastFM(artist, track);
}

function showFallback() {
  document.getElementById('fallback').classList.remove('hidden');
  document.getElementById('info').classList.add('hidden');
  document.getElementById('artwork').classList.add('hidden');
}

async function fetchFromLastFM(artist, track) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${LASTFM_KEY}&artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(track)}&format=json`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.track) {
    const album = data.track.album?.title || '';
    const tags = data.track.toptags?.tag?.map(t => t.name).slice(0, 5).join(', ') || '';
    document.getElementById('album').textContent = album;
    document.getElementById('tags').textContent = tags;
  }
}

fetchNowPlaying();
setInterval(fetchNowPlaying, 15000);
