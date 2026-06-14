import { Link, useLocation } from "react-router";
import { useState, useEffect, useCallback } from "react";
import tngBadge from "../assets/TNG_badge.svg";

/* ── Nav items ─────────────────────────────────────────────────────────────── */
const NAV_ITEMS = [
    { path: '/', label: 'HOME', id: '001', color: '#FF9C00' },
    { path: '/personal-log', label: 'PERSONAL LOG', id: '002', color: '#CC99CC' },
    { path: '/projects', label: 'PROJECTS', id: '003', color: '#6A8CD6' },
];

/* ── Ticker segment data (matches prototype's footer colorstrip) ─────────── */
const TICKER_SEGS = [
    { flex: 3,   color: '#FF9C00' },
    { flex: 1.4, color: '#CC99CC' },
    { flex: 2.2, color: '#6A8CD6' },
    { flex: 1,   color: '#FF9C66' },
    { flex: 2.8, color: '#FFCC99' },
    { flex: 1.1, color: '#CC4A5A' },
    { flex: 1.8, color: '#7FD1A6' },
    { flex: 1.3, color: '#9D7AD0' },
];

/* ── TNG-style stardate ─────────────────────────────────────────────────── */
function computeStardate() {
    const now = new Date();
    const yStart = new Date(now.getFullYear(), 0, 0);
    const doy = Math.floor((now - yStart) / 86400000);
    const frac = (now - new Date(now.getFullYear(), now.getMonth(), now.getDate())) / 86400000;
    const base = 80000 + (now.getFullYear() - 2026) * 1000;
    return 'SD ' + (base + doy * 2.74 + frac * 2).toFixed(1);
}

/* ── Navigation ─────────────────────────────────────────────────────────── */
export default function Navigation() {
    // Default to open on first visit; persist state across sessions
    const [isOpen, setIsOpen] = useState(() => {
        try {
            const saved = localStorage.getItem('lcars.nav.open');
            return saved !== null ? saved === '1' : true;
        } catch { return true; }
    });

    const [stardate, setStardate] = useState(computeStardate);
    const location = useLocation();

    // Persist open state
    useEffect(() => {
        try { localStorage.setItem('lcars.nav.open', isOpen ? '1' : '0'); } catch {}
    }, [isOpen]);

    // Escape to close
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') setIsOpen(false); };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, []);

    // Live stardate — refreshes every 4 s
    useEffect(() => {
        const id = setInterval(() => setStardate(computeStardate()), 4000);
        return () => clearInterval(id);
    }, []);

    // Close nav after navigating so page is visible
    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname]);

    const toggle = useCallback(() => setIsOpen(o => !o), []);

    return (
        <>
            {/*
              Backdrop — sits below the frame (z-index 49).
              pointer-events are disabled when closed (CSS handles this via [data-open]).
            */}
            <div
                className="lcars-backdrop"
                aria-hidden="true"
                onClick={() => setIsOpen(false)}
                {...(isOpen ? { 'data-open': '' } : {})}
            />

            {/*
              Frame root — position:fixed, inset:0, pointer-events:none.
              Children re-enable pointer events via CSS (.lcars-frame > *).
              The [data-open] attribute drives all CSS transitions.
            */}
            <nav
                className="lcars-frame"
                aria-label="Primary navigation"
                id="lcars-frame"
                {...(isOpen ? { 'data-open': '' } : {})}
            >
                {/* ── Corner elbow block ──────────────────────────────────────── */}
                <div className="lcars-corner" aria-hidden="true">
                    <span className="lcars-wordmark">LCARS</span>
                </div>

                {/* ── Top arm ─────────────────────────────────────────────────── */}
                <header className="lcars-topbar" id="lcars-panel">
                    <div className="lcars-seg lcars-seg-title" style={{ '--i': 0 }} aria-hidden="true" />
                    <div className="lcars-seg lcars-seg-deco"   style={{ '--i': 1 }} aria-hidden="true" />
                    <div className="lcars-seg lcars-seg-deco-b" style={{ '--i': 2 }} aria-hidden="true" />
                    <div className="lcars-seg lcars-seg-readout" style={{ '--i': 3 }} aria-hidden="true">
                        <span className="lcars-seg-sd">{stardate}</span>
                        <span className="lcars-seg-online">&#9679;&nbsp;ONLINE</span>
                    </div>
                </header>

                {/* ── Left rail ───────────────────────────────────────────────── */}
                <div className="lcars-rail">
                    <div className="lcars-rail-tag">AUTHORIZED ACCESS</div>

                    <ul className="lcars-nav-list" role="list">
                        {NAV_ITEMS.map((item, i) => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className="lcars-nav-item"
                                    aria-current={location.pathname === item.path ? 'page' : undefined}
                                    onClick={() => setIsOpen(false)}
                                    style={{ '--c': item.color, '--i': i }}
                                >
                                    <span className="lcars-nav-tag">{item.id}</span>
                                    <span className="lcars-nav-label">{item.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Decorative spacer blocks */}
                    <div className="lcars-rail-deco" aria-hidden="true">
                        <span className="lcars-rail-deco-block" />
                        <span className="lcars-rail-deco-block" />
                        <span className="lcars-rail-deco-block" />
                        <span className="lcars-rail-deco-block" />
                    </div>

                    {/* System status */}
                    <div className="lcars-sysstatus" aria-label="System status">
                        <p className="lcars-sysstatus-heading">SYSTEM STATUS</p>
                        <div className="lcars-sysstatus-row">
                            <span className="lcars-sysstatus-key">POWER</span>
                            <span className="lcars-sysstatus-val lcars-sysstatus-val--on">ONLINE</span>
                        </div>
                        <div className="lcars-sysstatus-row">
                            <span className="lcars-sysstatus-key">SECTOR</span>
                            <span className="lcars-sysstatus-val lcars-sysstatus-val--sec">SOL-3</span>
                        </div>
                        <div className="lcars-sysstatus-row">
                            <span className="lcars-sysstatus-key">ACCESS</span>
                            <span className="lcars-sysstatus-val lcars-sysstatus-val--acc">GUEST</span>
                        </div>
                    </div>

                    {/* Footer cap */}
                    <div className="lcars-rail-foot" aria-hidden="true">
                        <div className="lcars-ticker">
                            {TICKER_SEGS.map((seg, i) => (
                                <span
                                    key={i}
                                    className="lcars-ticker-seg"
                                    style={{ flex: seg.flex, background: seg.color }}
                                />
                            ))}
                        </div>
                        <span className="lcars-rail-lbl">LCARS 47-B</span>
                    </div>
                </div>

                {/* ── Combadge trigger (persistent, never moves) ──────────────── */}
                <button
                    className="lcars-combadge"
                    id="lcars-combadge"
                    aria-expanded={isOpen}
                    aria-controls="lcars-panel"
                    aria-label={isOpen ? 'Close LCARS navigation' : 'Open LCARS navigation'}
                    onClick={toggle}
                >
                    <span className="lcars-combadge-ring" aria-hidden="true" />
                    <img
                        src={tngBadge}
                        alt=""
                        aria-hidden="true"
                        className="lcars-combadge-img"
                    />
                </button>

                {/* "◂ ACCESS" hint — visible only when closed */}
                <span className="lcars-hint" aria-hidden="true">&#9666;&nbsp;ACCESS</span>
            </nav>
        </>
    );
}
