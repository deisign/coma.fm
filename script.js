
const LASTFM_KEY = 'c7a0f0ef6e54d0bc9c877ef6cdaf3949';
const stationID = 's213997';

async function fetchNowPlaying() {
  const statusURL = `https://public.radio.co/stations/${stationID}/status`;
  const res = await fetch(statusURL);
  const data = await res.json();
  const track = data.current_track?.title;
  const artist = data.current_track?.artist;

  document.getElementById('title').textContent = track || 'No track';

  if (data.current_track?.artwork_url) {
    document.getElementById('artwork').src = data.current_track.artwork_url;
  }

  if (data.current_track?.spotify_url) {
    const spotifyLink = document.getElementById('spotify');
    spotifyLink.href = data.current_track.spotify_url;
    spotifyLink.style.display = 'inline-block';
  } else {
    document.getElementById('spotify').style.display = 'none';
  }

  if (artist && track) fetchFromLastFM(artist, track);
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
