import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import Starfield from '../components/Starfield';
import LetterboxdFeed from '../components/LetterboxdFeed';
import SpotifyStats from '../components/SpotifyStats';

function timeAgo(isoString) {
    const seconds = Math.floor((Date.now() - new Date(isoString)) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

const About = () => {
    const [lastSynced, setLastSynced] = useState(null);

    useEffect(() => {
        fetch('/spotify-data.json')
            .then(r => r.json())
            .then(d => setLastSynced(d.lastUpdated))
            .catch(() => {});
    }, []);

    return (
        <>
            {/* Fixed infinite starfield background */}
            <div className="fixed inset-0 w-screen h-screen -z-20 overflow-hidden">
                <Canvas
                    camera={{
                        position: [0, 0, 50],
                        fov: 60,
                        near: 0.1,
                        far: 1000
                    }}
                    className="bg-black"
                >
                    <Starfield />
                </Canvas>
            </div>

            {/* Content Section */}
            <div className="relative z-10 p-8 min-h-screen">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-orange-400 mb-8">
                        [ PERSONAL LOG ]
                    </h1>

                    {/* bio */}
                    <section className="mb-12">
                        <div className="flex items-baseline justify-between mb-4">
                            <h2 className="text-2xl font-bold text-orange-400">RECENT ACTIVITY</h2>
                            {lastSynced && (
                                <span className="career-timeline-meta" style={{ fontSize: '10px', marginBottom: 0 }}>
                                    SYNCED {timeAgo(lastSynced).toUpperCase()}
                                </span>
                            )}
                        </div>
                        <div className="lcars-text-block">
                            <p className="leading-relaxed" style={{ color: 'var(--lcars-text)' }}>
                                I'm drawn to stories - whether they're told through film, music, books, or anything else. I also like keeping track of the things I watch and listen to.
                            </p>
                            <br />
                            <p className="leading-relaxed" style={{ color: 'var(--lcars-text)' }}>
                                Below you can find what I've been up to recently!
                            </p>
                        </div>
                    </section>

                    <section className="mb-12">
                        <LetterboxdFeed/>
                    </section>

                    <section className="mb-12">
                        <SpotifyStats/>
                    </section>
                </div>
            </div>
        </>
    )
}

export default About