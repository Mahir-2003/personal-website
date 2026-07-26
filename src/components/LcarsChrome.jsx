// Shared LCARS "console" chrome — pills, elbows, filler bars, corner ticks —
// used across Home.jsx sections (Current Status, Technology Sphere, Career History)
// to keep a consistent panel language site-wide.

export const FONT = "'Antonio', 'Orbitron', sans-serif";
export const MONO = "'JetBrains Mono', 'Courier New', monospace";

// playful stardate readout
export function stardate() {
    const days = (Date.now() - Date.UTC(2024, 0, 1)) / 86400000;
    return (56218 + days * 2.73).toFixed(1);
}

/* ---------- LCARS pill chip (decorative label, not a control) ----------
   letter-spacing pads *after* every character, including the last one, so
   text with letter-spacing inside a centered/padded box always looks shifted
   left of true-center. The inner span carries the letter-spacing and cancels
   its own trailing gap with an equal negative margin-right. */
export function Pill({ color, children, h = 34, side = 'none', mono = false, style, className }) {
    const r = h / 2;
    const radius = side === 'left' ? `${r}px 6px 6px ${r}px`
        : side === 'right' ? `6px ${r}px ${r}px 6px`
            : side === 'both' ? `${r}px` : '6px';
    return (
        <div className={className} style={{
            height: h, borderRadius: radius, background: color,
            color: '#0a0604', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: `0 ${r * 0.7}px`,
            whiteSpace: 'nowrap', flexShrink: 0, ...style,
        }}>
            <span style={{
                fontFamily: mono ? MONO : FONT, textTransform: 'uppercase', letterSpacing: '0.08em', marginRight: '-0.08em',
                lineHeight: 1, transform: 'translateY(-0.06em)',
            }}>
                {children}
            </span>
        </div>
    );
}

/* ---------- the signature LCARS elbow sweep (two-div carve) ---------- */
export function Elbow({ corner = 'tl', color, w = 220, h = 110, arm = 64, bar = 38, label, code }) {
    const R = Math.min(h, w) * 0.62;
    const isR = corner.includes('r'), isB = corner.includes('b');
    const radProp = corner === 'tl' ? 'borderTopLeftRadius' : corner === 'tr' ? 'borderTopRightRadius'
        : corner === 'bl' ? 'borderBottomLeftRadius' : 'borderBottomRightRadius';
    return (
        <div style={{ position: 'relative', width: w, height: h, background: color, [radProp]: R, overflow: 'hidden' }}>
            <div style={{
                position: 'absolute', width: w - arm, height: h - bar, background: '#000',
                [isR ? 'left' : 'right']: 0, [isB ? 'top' : 'bottom']: 0, [radProp]: R,
            }} />
            <div style={{
                position: 'absolute', [isB ? 'bottom' : 'top']: 8, [isR ? 'left' : 'right']: 14,
                color: '#0a0604', fontFamily: FONT, fontWeight: 700,
                fontSize: 12, letterSpacing: '0.08em', lineHeight: 1.05, textAlign: isR ? 'left' : 'right',
            }}>{label && <div style={{ fontSize: 13 }}>{label}</div>}{code}</div>
        </div>
    );
}

/* ---------- decorative filler block ---------- */
export function Filler({ color, h = 26, label, flex }) {
    return (
        <div style={{
            height: h, flex: flex ? 1 : 'none', background: color, borderRadius: 4,
            display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end',
            padding: '0 10px 3px', color: '#0a0604', fontFamily: FONT,
            fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', overflow: 'hidden',
        }}>{label}</div>
    );
}

/* ---------- plain horizontal bar filler, used between two pills ---------- */
export function Bar({ color = 'rgba(192,132,252,0.35)', height = 14, style, className }) {
    return <div className={className} style={{ flex: 1, height, background: color, borderRadius: height / 2, minWidth: 20, ...style }} />;
}

/* ---------- four corner-tick brackets, overlaid on a framed panel ---------- */
export function CornerTicks({ color = 'var(--lcars-orange)', size = 22, inset = 8 }) {
    const c = { position: 'absolute', width: size, height: size, borderColor: color, opacity: 0.6, pointerEvents: 'none' };
    return (
        <>
            <div style={{ ...c, top: inset, left: inset, borderTop: '2px solid', borderLeft: '2px solid' }} />
            <div style={{ ...c, top: inset, right: inset, borderTop: '2px solid', borderRight: '2px solid' }} />
            <div style={{ ...c, bottom: inset, left: inset, borderBottom: '2px solid', borderLeft: '2px solid' }} />
            <div style={{ ...c, bottom: inset, right: inset, borderBottom: '2px solid', borderRight: '2px solid' }} />
        </>
    );
}

/* ---------- composite: Pill(title) + Bar + small mono meta readout ----------
   Only the title is a pill — a second full-size pill next to it read as two
   competing shapes fighting for attention, especially on narrow screens. The
   stardate is flavor text, not a control, so it's rendered as plain small
   monospace instead, which also sidesteps needing to hide it below a breakpoint. */
export function SectionHeader({ title, meta, accent = 'var(--lcars-orange)', barColor = 'rgba(192,132,252,0.35)' }) {
    return (
        <div className="flex items-center gap-2 sm:gap-3">
            <Pill color={accent} side="both" h={30} style={{ fontSize: 'clamp(12px, 3.6vw, 15px)' }}>{title}</Pill>
            <Bar color={barColor} height={10} />
            {meta && (
                <span style={{
                    fontFamily: MONO, fontSize: 11, letterSpacing: '0.15em',
                    color: 'var(--lcars-text-dim)', whiteSpace: 'nowrap', flexShrink: 0,
                }}>{meta}</span>
            )}
        </div>
    );
}
