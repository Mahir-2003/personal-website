import { useState, useEffect, useCallback } from 'react';
import { MdRefresh } from 'react-icons/md';

const LetterboxdFeed = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchLetterboxdFeed = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/letterboxd.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setMovies(data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching Letterboxd feed:', err);
            setError('Failed to load recent movies');
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLetterboxdFeed();
    }, [fetchLetterboxdFeed]);

    const SectionHeader = () => (
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-orange-400">RECENT VIEWINGS</h2>
            <button
                onClick={fetchLetterboxdFeed}
                disabled={loading}
                className="lcars-refresh-btn"
                title="Refresh feed"
            >
                <MdRefresh className={loading ? 'animate-spin' : ''} />
                REFRESH
            </button>
        </div>
    );

    if (loading && movies.length === 0) {
        return (
            <section className="mb-12">
                <SectionHeader />
                <div className="lcars-text-block flex items-center justify-center" style={{ minHeight: '200px' }}>
                    <div className="flex items-center gap-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-400" />
                        <span className="text-sm tracking-wider" style={{ color: 'var(--lcars-text-dim)' }}>
                            LOADING RECENT MOVIES...
                        </span>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="mb-12">
                <SectionHeader />
                <div className="lcars-note-block" style={{ borderLeftColor: '#f87171' }}>
                    <p style={{ color: '#f87171', fontWeight: 700, marginBottom: '4px' }}>SYSTEM ERROR</p>
                    <p style={{ color: 'var(--lcars-text-dim)' }}>{error}</p>
                </div>
            </section>
        );
    }

    return (
        <section className="mb-12">
            <SectionHeader />

            <div className="lcars-text-block relative" style={{ minHeight: '300px' }}>
                {/* Loading overlay when refreshing with existing data */}
                {loading && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-sm"
                         style={{ background: 'rgba(4, 11, 35, 0.75)', backdropFilter: 'blur(4px)' }}>
                        <div className="rounded-full h-8 w-8 border-b-2 border-orange-400" />
                    </div>
                )}

                {/* Stream status */}
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--lcars-orange)', flexShrink: 0 }} />
                    <p className="text-sm font-bold tracking-wider" style={{ color: 'var(--lcars-orange)' }}>
                        LETTERBOXD DATA STREAM ACTIVE
                    </p>
                </div>

                {/* Movie grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {movies.map((movie, index) => (
                        <a
                            key={index}
                            href={movie.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="lcars-media-card group"
                        >
                            {movie.posterUrl && (
                                <div className="aspect-[2/3] overflow-hidden"
                                     style={{ background: 'rgba(255,255,255,0.03)' }}>
                                    <img
                                        src={movie.posterUrl}
                                        alt={`${movie.title} poster`}
                                        className="w-full h-full object-cover group-hover:opacity-85 transition-opacity duration-300"
                                        loading="lazy"
                                    />
                                </div>
                            )}
                            <div className="lcars-media-card-info">
                                <h3 className="font-semibold text-sm leading-tight mb-1"
                                    style={{ color: 'var(--lcars-text)' }}>
                                    {movie.title}
                                </h3>
                                <p className="text-xs mb-1" style={{ color: 'var(--lcars-text-dim)' }}>
                                    {movie.year}
                                </p>
                                {movie.rating && (
                                    <div className="text-sm mb-1" style={{ color: 'var(--lcars-orange)' }}>
                                        {movie.rating}
                                    </div>
                                )}
                                <p className="text-xs" style={{ color: 'rgba(148,163,184,0.45)' }}>
                                    {movie.watchedDate}
                                </p>
                            </div>
                        </a>
                    ))}
                </div>

                {/* Footer link */}
                <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,153,0,0.15)' }}>
                    <a
                        href="https://letterboxd.com/MeatyMahir/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="lcars-inline-link text-sm font-semibold tracking-wider"
                    >
                        VIEW FULL PROFILE →
                    </a>
                </div>
            </div>
        </section>
    );
};

export default LetterboxdFeed;
