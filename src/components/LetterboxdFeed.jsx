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
                // Use a safe, reputable CORS-anywhere service (Cloudflare Workers based)
                // Alternative: Use allorigins.win which is open-source and reputable
                const proxyUrl = 'https://api.allorigins.win/raw?url=';
                const rssUrl = 'https://letterboxd.com/MeatyMahir/rss/';
                
                // Add timeout and proper error handling
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000);
                
                const response = await fetch(proxyUrl + encodeURIComponent(rssUrl), {
                    signal: controller.signal,
                    headers: {
                        'Accept': 'application/rss+xml, application/xml, text/xml'
                    }
                });
                
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const xmlText = await response.text();
                
                // Parse XML
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
                const items = xmlDoc.querySelectorAll('item');
                
                const movieData = Array.from(items).slice(0, 5).map(item => {
                    const title = item.querySelector('title')?.textContent || '';
                    const link = item.querySelector('link')?.textContent || '';
                    const pubDate = item.querySelector('pubDate')?.textContent || '';
                    const watchedDate = item.querySelector('letterboxd\\:watchedDate, watchedDate')?.textContent || '';
                    const filmTitle = item.querySelector('letterboxd\\:filmTitle, filmTitle')?.textContent || '';
                    const filmYear = item.querySelector('letterboxd\\:filmYear, filmYear')?.textContent || '';
                    const rating = item.querySelector('letterboxd\\:memberRating, memberRating')?.textContent || '';
                    const description = item.querySelector('description')?.textContent || '';
                    
                    // Extract poster URL from description
                    const imgMatch = description.match(/src="([^"]+)"/);
                    const posterUrl = imgMatch ? imgMatch[1] : null;
                    
                    // Convert rating to stars
                    const starRating = rating ? '★'.repeat(Math.floor(parseFloat(rating))) + (parseFloat(rating) % 1 >= 0.5 ? '½' : '') : '';
                    
                    // Format date
                    const formattedDate = watchedDate ? new Date(watchedDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                    }) : '';

                    return {
                        title: filmTitle,
                        year: filmYear,
                        rating: starRating,
                        posterUrl,
                        watchedDate: formattedDate,
                        link,
                        fullTitle: title
                    };
                });
                
                setMovies(movieData);
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

    if (loading && movies.length === 0) {
        return (
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-blue-400 mb-6">RECENT VIEWINGS</h2>
                <div className="bg-gray-900 p-6 rounded-lg min-h-[300px] flex items-center justify-center">
                    <div className="flex items-center justify-center text-gray-400">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400"></div>
                        <span className="ml-3">Loading recent movies...</span>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="mb-12">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-blue-400">RECENT VIEWINGS</h2>
                    <button 
                        onClick={fetchLetterboxdFeed}
                        className="flex items-center gap-2 px-3 py-1 bg-gray-800 hover:bg-gray-700 text-blue-400 rounded transition-colors text-sm border border-gray-700"
                    >
                        <MdRefresh className="text-lg" />
                        RETRY
                    </button>
                </div>
                <div className="bg-gray-900 p-6 rounded-lg border-l-4 border-red-400">
                    <p className="text-red-400 font-semibold">SYSTEM ERROR</p>
                    <p className="text-gray-300">{error}</p>
                </div>
            </section>
        );
    }

    return (
        <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-blue-400">RECENT VIEWINGS</h2>
                <button 
                    onClick={fetchLetterboxdFeed}
                    disabled={loading}
                    className={`text-gray-500 hover:text-blue-400 transition-colors p-2 rounded-full hover:bg-gray-800 ${loading ? 'text-blue-400' : ''}`}
                    title="Refresh Feed"
                >
                    REFRESH
                </button>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg relative min-h-[300px]">
                {loading && (
                    <div className="absolute inset-0 bg-gray-900/50 z-10 flex items-center justify-center rounded-lg backdrop-blur-sm">
                        <div className="rounded-full h-8 w-8 border-b-2 border-orange-400"></div>
                    </div>
                )}
                <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-orange-400 rounded-full mr-3 animate-pulse"></div>
                    <p className="text-orange-400 font-semibold text-sm tracking-wider">
                        LETTERBOXD DATA STREAM ACTIVE
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    {movies.map((movie, index) => (
                        <a 
                            key={index}
                            href={movie.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group block bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-blue-400 transition-all duration-300 transform hover:scale-105"
                        >
                            {movie.posterUrl && (
                                <div className="aspect-[2/3] bg-gray-700 overflow-hidden">
                                    <img 
                                        src={movie.posterUrl}
                                        alt={`${movie.title} poster`}
                                        className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-300"
                                        loading="lazy"
                                    />
                                </div>
                            )}
                            
                            <div className="p-3">
                                <h3 className="text-white font-semibold text-sm leading-tight mb-1 group-hover:text-blue-400 transition-colors">
                                    {movie.title}
                                </h3>
                                
                                <p className="text-gray-400 text-xs mb-2">
                                    {movie.year}
                                </p>
                                
                                {movie.rating && (
                                    <div className="text-orange-400 text-sm mb-2">
                                        {movie.rating}
                                    </div>
                                )}
                                
                                <p className="text-gray-500 text-xs">
                                    {movie.watchedDate}
                                </p>
                            </div>
                        </a>
                    ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-700">
                    <a 
                        href="https://letterboxd.com/MeatyMahir/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-sm font-semibold tracking-wider transition-colors inline-flex items-center"
                    >
                        VIEW FULL PROFILE →
                    </a>
                </div>
            </div>
        </section>
    );
};

export default LetterboxdFeed;