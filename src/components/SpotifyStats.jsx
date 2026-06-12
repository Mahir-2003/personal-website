import { useState, useEffect } from 'react';

const SpotifyStats = () => {
  const [spotifyData, setSpotifyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSpotifyData = async () => {
      try {
        const url = `/spotify-data.json?ts=${Date.now()}`;
        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setSpotifyData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading Spotify data:', err);
        setError('Failed to load music stats');
        setLoading(false);
      }
    };
    loadSpotifyData();
  }, []);

  if (loading) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-orange-400 mb-4">MUSIC ANALYTICS</h2>
        <div className="lcars-text-block flex items-center justify-center" style={{ minHeight: '150px' }}>
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-400" />
            <span className="text-sm tracking-wider" style={{ color: 'var(--lcars-text-dim)' }}>
              LOADING MUSIC DATA...
            </span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-orange-400 mb-4">MUSIC ANALYTICS</h2>
        <div className="lcars-note-block" style={{ borderLeftColor: '#f87171' }}>
          <p style={{ color: '#f87171', fontWeight: 700, marginBottom: '4px' }}>SYSTEM ERROR</p>
          <p style={{ color: 'var(--lcars-text-dim)' }}>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-orange-400 mb-4">MUSIC ANALYTICS</h2>

      <div className="lcars-text-block">
        {/* Stream status + last updated */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full animate-pulse flex-shrink-0"
                 style={{ background: '#4ade80' }} />
            <p className="text-sm font-bold tracking-wider" style={{ color: '#4ade80' }}>
              SPOTIFY DATA STREAM ACTIVE
            </p>
          </div>
          <p className="text-xs tracking-wider" style={{ color: 'var(--lcars-text-dim)' }}>
            LAST UPDATED: {new Date(spotifyData.lastUpdated).toLocaleDateString()}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Tracks */}
          <div>
            <h3 className="font-bold tracking-wider mb-3" style={{ color: 'var(--lcars-orange)', fontSize: '14px' }}>
              TOP TRACKS — 4 WEEKS
            </h3>
            <div className="space-y-2">
              {spotifyData.topTracks.slice(0, 5).map((track, index) => (
                <a
                  key={index}
                  href={track.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lcars-list-row group"
                >
                  <div className="font-bold text-sm mr-3 w-6 flex-shrink-0"
                       style={{ color: 'var(--lcars-blue)' }}>
                    #{index + 1}
                  </div>
                  {track.image && (
                    <img
                      src={track.image}
                      alt={`${track.name} cover`}
                      className="w-10 h-10 rounded mr-3 flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate" style={{ color: 'var(--lcars-text)' }}>
                      {track.name}
                    </p>
                    <p className="text-sm truncate" style={{ color: 'var(--lcars-text-dim)' }}>
                      {track.artist} · {track.album}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Top Artists */}
          <div>
            <h3 className="font-bold tracking-wider mb-3" style={{ color: 'var(--lcars-orange)', fontSize: '14px' }}>
              TOP ARTISTS — 4 WEEKS
            </h3>
            <div className="space-y-2">
              {spotifyData.topArtists.slice(0, 5).map((artist, index) => (
                <a
                  key={index}
                  href={artist.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lcars-list-row group"
                >
                  <div className="font-bold text-sm mr-3 w-6 flex-shrink-0"
                       style={{ color: 'var(--lcars-blue)' }}>
                    #{index + 1}
                  </div>
                  {artist.image && (
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-10 h-10 rounded-full mr-3 flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate" style={{ color: 'var(--lcars-text)' }}>
                      {artist.name}
                    </p>
                    <p className="text-sm truncate" style={{ color: 'var(--lcars-text-dim)' }}>
                      {artist.genres.slice(0, 2).join(', ')}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpotifyStats;
