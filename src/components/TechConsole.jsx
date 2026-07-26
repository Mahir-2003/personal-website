import { Canvas } from '@react-three/fiber';
import { Suspense, useState } from 'react';
import SkillsGlobe, { skills, CATEGORIES, CATEGORY_COLORS, CATEGORY_META } from './SkillsGlobe';

const FONT = "'Antonio', 'Orbitron', sans-serif";
const MONO = "'JetBrains Mono', 'Courier New', monospace";

// playful stardate readout, same formula as the design prototype
function stardate() {
    const days = (Date.now() - Date.UTC(2024, 0, 1)) / 86400000;
    return (56218 + days * 2.73).toFixed(1);
}

/* ---------- LCARS pill chip (decorative label, not a control) ---------- */
function Pill({ color, children, h = 34, side = 'none', mono = false, style }) {
    const r = h / 2;
    const radius = side === 'left' ? `${r}px 6px 6px ${r}px`
        : side === 'right' ? `6px ${r}px ${r}px 6px`
            : side === 'both' ? `${r}px` : '6px';
    return (
        <div style={{
            height: h, borderRadius: radius, background: color,
            color: '#0a0604', fontFamily: mono ? MONO : FONT, fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', padding: `0 ${r * 0.7}px`,
            whiteSpace: 'nowrap', flexShrink: 0, ...style,
        }}>{children}</div>
    );
}

/* ---------- the signature LCARS elbow sweep (two-div carve) ---------- */
function Elbow({ corner = 'tl', color, w = 220, h = 110, arm = 64, bar = 38, label, code }) {
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
function Filler({ color, h = 26, label, flex }) {
    return (
        <div style={{
            height: h, flex: flex ? 1 : 'none', background: color, borderRadius: 4,
            display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end',
            padding: '0 10px 3px', color: '#0a0604', fontFamily: FONT,
            fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', overflow: 'hidden',
        }}>{label}</div>
    );
}

/* ---------- four corner-tick brackets over the sphere viewport ---------- */
function CornerTicks({ color }) {
    const c = { position: 'absolute', width: 22, height: 22, borderColor: color, opacity: 0.6 };
    return (
        <>
            <div style={{ ...c, top: 8, left: 8, borderTop: '2px solid', borderLeft: '2px solid' }} />
            <div style={{ ...c, top: 8, right: 8, borderTop: '2px solid', borderRight: '2px solid' }} />
            <div style={{ ...c, bottom: 8, left: 8, borderBottom: '2px solid', borderLeft: '2px solid' }} />
            <div style={{ ...c, bottom: 8, right: 8, borderBottom: '2px solid', borderRight: '2px solid' }} />
        </>
    );
}

const TechConsole = () => {
    const [activeCat, setActiveCat] = useState(null);
    const [selected, setSelected] = useState(null);

    const toggleCat = (cat) => setActiveCat((prev) => (prev === cat ? null : cat));

    const selectedSkill = skills.find((s) => s.name === selected) || null;
    const readoutCat = activeCat || selectedSkill?.category || null;
    const readoutSkills = readoutCat ? skills.filter((s) => s.category === readoutCat) : [];
    const readoutColor = readoutCat ? CATEGORY_COLORS[readoutCat] : 'var(--lcars-purple)';

    return (
        <div className="max-w-6xl mx-auto px-4">
            <div style={{ display: 'flex', gap: 14, alignItems: 'stretch', flexWrap: 'wrap' }}>
                {/* LEFT RAIL */}
                <div style={{ width: 244, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <Elbow corner="tl" color="var(--lcars-orange)" w={244} h={104} arm={64} bar={42} label="SCAN" code="1701" />
                    <Pill color="var(--lcars-amber)" side="left" h={30} style={{ justifyContent: 'flex-end', fontSize: 11 }}>Omni-Scan</Pill>
                    {CATEGORIES.map((cat) => {
                        const meta = CATEGORY_META[cat];
                        const on = activeCat === cat;
                        const dimmed = !!activeCat && !on;
                        return (
                            <button key={cat} onClick={() => toggleCat(cat)} style={{
                                height: 52, background: CATEGORY_COLORS[cat], border: 'none', cursor: 'pointer',
                                borderRadius: 6, display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
                                justifyContent: 'center', padding: '0 16px', color: '#0a0604',
                                fontFamily: FONT, fontWeight: 700, letterSpacing: '0.02em', whiteSpace: 'nowrap',
                                filter: dimmed ? 'saturate(0.4) brightness(0.62)' : 'none',
                                transition: 'filter .2s', outline: on ? '2px solid #fff' : 'none', outlineOffset: -4,
                            }}>
                                <span style={{ fontSize: 14, lineHeight: 1 }}>{meta.short}</span>
                                <span style={{ fontSize: 10, opacity: 0.65, fontFamily: MONO }}>{meta.code}</span>
                            </button>
                        );
                    })}
                    <Filler color="rgba(251,146,60,0.35)" h={22} label="SYS-7741" />
                    <div style={{ flex: 1, minHeight: 14 }} />
                    <Elbow corner="bl" color="var(--lcars-orange)" w={244} h={70} arm={64} bar={34} code="REF 47" />
                </div>

                {/* MAIN COLUMN */}
                <div style={{ flex: '1 1 520px', minWidth: 320, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {/* header row */}
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <Pill color="var(--lcars-orange)" side="both" h={34}>Technology Sphere</Pill>
                        <div style={{ flex: 1, height: 14, background: 'rgba(192,132,252,0.35)', borderRadius: 7, minWidth: 20 }} />
                        <Pill color="var(--lcars-blue)" side="both" h={34} mono>SD {stardate()}</Pill>
                    </div>

                    {/* viewport + readout row */}
                    <div style={{ display: 'flex', gap: 12, flex: 1, flexWrap: 'wrap' }}>
                        {/* VIEWPORT */}
                        <div className="h-[420px] md:h-[540px] lg:h-[620px]" style={{
                            flex: '2 1 380px', minWidth: 300, position: 'relative',
                            border: '2px solid rgba(148,163,184,0.35)', borderRadius: 14,
                            background: 'radial-gradient(circle at 50% 45%, rgba(255,255,255,0.03), transparent 70%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                        }}>
                            <CornerTicks color="var(--lcars-orange)" />
                            <div style={{
                                position: 'absolute', top: 10, left: 14, fontFamily: MONO, fontSize: 10,
                                color: 'var(--lcars-text-dim)', letterSpacing: '0.2em', zIndex: 1, pointerEvents: 'none',
                            }}>
                                Omnidirectional Scan &middot; Live
                            </div>
                            <Canvas camera={{ position: [0, 0, 25], fov: 60, near: 0.1, far: 1000 }}>
                                <Suspense fallback={null}>
                                    <SkillsGlobe activeCat={activeCat} selected={selected} onSelect={setSelected} />
                                    <ambientLight intensity={0.5} />
                                    <pointLight position={[10, 10, 10]} intensity={1} />
                                </Suspense>
                            </Canvas>
                        </div>

                        {/* READOUT */}
                        <div style={{ flex: '1 1 220px', minWidth: 210, display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <Pill color={readoutColor} side="both" h={30} style={{ fontSize: 13, justifyContent: 'center' }}>
                                {readoutCat ? `${CATEGORY_META[readoutCat].short} Readout` : 'Awaiting Input'}
                            </Pill>
                            <div style={{
                                flex: 1, border: '1px solid rgba(148,163,184,0.27)', borderRadius: 10, padding: 12,
                                display: 'flex', flexDirection: 'column', gap: 9, overflowY: 'auto',
                                maxHeight: 260, background: 'var(--lcars-bg-card)',
                            }}>
                                {readoutSkills.length === 0 && (
                                    <div style={{ color: 'var(--lcars-text-dim)', fontFamily: MONO, fontSize: 11, lineHeight: 1.7 }}>
                                        SELECT A SYSTEM CLASS<br />OR TAP A NODE TO<br />QUERY THE INDEX.
                                    </div>
                                )}
                                {readoutSkills.map((skill) => {
                                    const Icon = skill.icon;
                                    const isSel = selected === skill.name;
                                    const color = CATEGORY_COLORS[skill.category];
                                    return (
                                        <button key={skill.name} onClick={() => setSelected(skill.name)} style={{
                                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                                            padding: '4px 6px', borderRadius: 6, border: 'none',
                                            background: isSel ? `${color}22` : 'transparent',
                                        }}>
                                            <span style={{ color: skill.iconColor, fontSize: 18, display: 'flex', flexShrink: 0 }}>
                                                <Icon />
                                            </span>
                                            <span style={{ flex: 1, fontFamily: FONT, fontSize: 15, color: '#fff', textAlign: 'left' }}>
                                                {skill.name}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* footer status row */}
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <Pill color="var(--lcars-purple)" side="both" h={26} style={{ fontSize: 11 }}>Status &middot; Nominal</Pill>
                        <div style={{ flex: 1, height: 10, background: 'rgba(148,163,184,0.3)', borderRadius: 5 }} />
                        <span style={{ fontFamily: MONO, fontSize: 10, color: 'var(--lcars-text-dim)', letterSpacing: '0.2em', whiteSpace: 'nowrap' }}>
                            {skills.length} NODES &middot; {activeCat ? CATEGORY_META[activeCat].short : 'ALL CLASSES'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TechConsole;
