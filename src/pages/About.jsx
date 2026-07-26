import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import Starfield from '../components/Starfield';
import LetterboxdFeed from '../components/LetterboxdFeed';
import SpotifyStats from '../components/SpotifyStats';
import { SectionHeader, CornerTicks, stardate } from '../components/LcarsChrome';

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
                <div className="max-w-6xl mx-auto px-4">
                    <div className="mb-8">
                        <SectionHeader
                            title="Personal Log"
                            meta={`SD ${stardate()}`}
                            h={46}
                            fontSize="clamp(18px, 5.5vw, 26px)"
                            barHeight={14}
                        />
                    </div>

                    {/* bio */}
                    <section className="mb-12">
                        <SectionHeader
                            title="Recent Activity"
                            meta={lastSynced ? `SYNCED ${timeAgo(lastSynced).toUpperCase()}` : undefined}
                        />
                        <div className="lcars-text-block relative mt-4">
                            <CornerTicks color="var(--lcars-orange)" size={16} inset={4} />
                            <div className="max-w-3xl">
                                <p className="leading-relaxed" style={{ color: 'var(--lcars-text)' }}>
                                    I'm drawn to stories - whether they're told through film, music, books, or anything else. I also like keeping track of the things I watch and listen to.
                                </p>
                                <br />
                                <p className="leading-relaxed" style={{ color: 'var(--lcars-text)' }}>
                                    Below you can find what I've been up to recently!
                                </p>
                            </div>
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