import { useState, useEffect, useLayoutEffect, useMemo } from 'react';
import enterpriseTop from "../assets/ncc1701-top-transparent.webp"
import enterpriseIso from "../assets/ncc1701-iso-transparent.webp"
import enterpriseFront from "../assets/ncc1701-front-transparent.webp"


const STATUS_CYCLE = [
    "INITIALIZING SUBSPACE LINK",
    "AUTHENTICATING STARFLEET NODE",
    "SYNCING LCARS SUBROUTINES",
    "SCANNING ISOLINEAR CHIPS",
    "ALIGNING HEISENBERG COMPENSATORS",
    "ROUTING THROUGH RELAY STATION EPSILON",
    "VERIFYING BIOMETRIC SIGNATURE",
    "UPLINK TO STARFLEET COMMAND ESTABLISHED"
]

const pageInfo = {
    '/': {
        msg: "ACCESSING STARFLEET DATABASE",
        img: enterpriseTop
    },
    '/personal-log': {
        msg: "LOADING PERSONNEL RECORDS",
        img: enterpriseIso
    },
    '/projects': {
        msg: "SCANNING PROJECT ARCHIVE",
        img: enterpriseFront
    },
}

const LoadingScreen = ({ isLoading, currentPage }) => {
    // visible starts true if we're already loading on mount (initial page load)
    const [visible, setVisible] = useState(isLoading);
    const [tick, setTick] = useState(0);
    const [scramble, setScramble] = useState(["47634.44", "001", "ALPHA-1"]);

    const page = pageInfo[currentPage] ?? pageInfo["/"];
    const message = useMemo(() => page.msg, [page]);

    // Show synchronously before the browser paints — prevents the new route
    // from ever being visible on mobile where useEffect fires too late.
    useLayoutEffect(() => {
        if (isLoading) setVisible(true);
    }, [isLoading]);

    // rotate status line while visible
    useEffect(() => {
        if (!visible) return;
        const id = setInterval(() => setTick((t) => (t + 1) % STATUS_CYCLE.length), 1600);
        return () => clearInterval(id);
    }, [visible]);

    // scramble readout values while visible
    useEffect(() => {
        if (!visible) return;
        const id = setInterval(() => {
            setScramble([
                (40000 + Math.random() * 9999).toFixed(2),
                String(Math.floor(Math.random() * 999)).padStart(3, '0'),
                `ALPHA-${Math.floor(Math.random() * 9) + 1}`
            ]);
        }, 200);
        return () => clearInterval(id);
    }, [visible]);

    // After the fade-out CSS transition ends, unmount completely
    const handleTransitionEnd = () => {
        if (!isLoading) setVisible(false);
    };

    if (!visible) return null;

    return (
        <div
            className={`lcars-loading-overlay fixed inset-0 z-[9999] transition-opacity duration-500 ${isLoading ? "opacity-100" : "opacity-0"}`}
            onTransitionEnd={handleTransitionEnd}
            aria-live="polite"
            role="status"
        >
            {/* Top HUD bar — corner brackets via ::before / ::after */}
            <div className="lcars-hud-top" aria-hidden="true">
                <span className="lcars-hud-logo" style={{ fontFamily: "TNG, Orbitron, sans-serif" }}>LCARS</span>
                <span className="lcars-hud-ident">NCC-1701 // UX OPS</span>
            </div>

            {/* Bottom HUD bar — corner brackets via ::before / ::after */}
            <div className="lcars-hud-bottom" aria-hidden="true" />

            {/* center panel */}
            <div className="lcars-panel">
                <figure className="lcars-ship-wrap" aria-hidden="true">
                    <img
                        src={page.img}
                        alt={`An image of the Constitution Class USS Enterprise`}
                        className="lcars-ship"
                        draggable="false"
                    />
                </figure>

                <div
                    className="lcars-logo lcars-glow-orange"
                    style={{ fontFamily: "TNG, Orbitron, sans-serif" }}
                >
                    LCARS
                </div>

                <div className="lcars-subtitle">{message}</div>

                {/* segmented progress bar — 16 segments, 3-color cycling */}
                <div className="lcars-segbar" aria-label="Loading progress">
                    {Array.from({ length: 16 }).map((_, i) => (
                        <span
                            key={i}
                            style={{ animationDelay: `${i * 90}ms` }}
                            className="lcars-seg"
                        />
                    ))}
                </div>

                {/* LCARS data readout panel */}
                <div className="lcars-readout" aria-hidden="true">
                    <div className="lcars-readout-labels">
                        <span>STARDATE 47634.44</span>
                        <span>SECTOR 001</span>
                        <span>CLEARANCE: ALPHA-1</span>
                    </div>
                    <div className="lcars-readout-values">
                        <span>{scramble[0]}</span>
                        <span>{scramble[1]}</span>
                        <span>{scramble[2]}</span>
                    </div>
                </div>

                {/* status ticker */}
                <div className="lcars-ticker">
                    <span className="lcars-chevron" aria-hidden="true">▶</span>
                    <span className="lcars-ticker-text">
                        {STATUS_CYCLE[tick]}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;
