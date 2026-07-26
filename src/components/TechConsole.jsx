import { Canvas } from '@react-three/fiber';
import { Suspense, useState } from 'react';
import SkillsGlobe, { skills, CATEGORIES, CATEGORY_COLORS, CATEGORY_META } from './SkillsGlobe';
import { FONT, MONO, stardate, Pill, Elbow, Filler, CornerTicks, SectionHeader } from './LcarsChrome';

/* A single category filter button, shared by the mobile grid and the desktop rail. */
function CategoryButton({ cat, activeCat, onToggle, compact = false }) {
    const meta = CATEGORY_META[cat];
    const on = activeCat === cat;
    const dimmed = !!activeCat && !on;
    return (
        <button onClick={() => onToggle(cat)} style={{
            height: compact ? 44 : 52, width: '100%', background: CATEGORY_COLORS[cat], border: 'none', cursor: 'pointer',
            borderRadius: 6, display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
            justifyContent: 'center', padding: '0 14px', color: '#0a0604',
            fontFamily: FONT, fontWeight: 700, letterSpacing: '0.02em', whiteSpace: 'nowrap',
            filter: dimmed ? 'saturate(0.4) brightness(0.62)' : 'none',
            transition: 'filter .2s', outline: on ? '2px solid #fff' : 'none', outlineOffset: -4,
        }}>
            <span style={{ fontSize: compact ? 12 : 14, lineHeight: 1 }}>{meta.short}</span>
            <span style={{ fontSize: 9, opacity: 0.65, fontFamily: MONO }}>{meta.code}</span>
        </button>
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
            <div className="flex flex-col md:flex-row gap-3 md:gap-3.5 md:items-stretch">
                {/* DESKTOP LEFT RAIL */}
                <div className="hidden md:flex md:flex-col gap-2" style={{ width: 244, flexShrink: 0 }}>
                    <Elbow corner="tl" color="var(--lcars-orange)" w={244} h={104} arm={64} bar={42} label="SCAN" code="1701" />
                    <Pill color="var(--lcars-amber)" side="left" h={30} style={{ justifyContent: 'flex-end', fontSize: 11 }}>Omni-Scan</Pill>
                    {CATEGORIES.map((cat) => (
                        <CategoryButton key={cat} cat={cat} activeCat={activeCat} onToggle={toggleCat} />
                    ))}
                    <Filler color="rgba(251,146,60,0.35)" h={22} label="SYS-7741" />
                    <div style={{ flex: 1, minHeight: 14 }} />
                    <Elbow corner="bl" color="var(--lcars-orange)" w={244} h={70} arm={64} bar={34} code="REF 47" />
                </div>

                {/* MAIN COLUMN */}
                <div className="flex-1 flex flex-col gap-2.5 md:min-w-0">
                    {/* header row — always first, above the category picker */}
                    <SectionHeader title="Technology Sphere" meta={`SD ${stardate()}`} />

                    {/* MOBILE CATEGORY GRID — desktop rail (elbows/filler) covers this at md+ */}
                    <div className="grid grid-cols-2 gap-2 md:hidden">
                        {CATEGORIES.map((cat) => (
                            <CategoryButton key={cat} cat={cat} activeCat={activeCat} onToggle={toggleCat} compact />
                        ))}
                    </div>

                    {/* viewport + readout row */}
                    <div className="flex flex-col lg:flex-row gap-3 flex-1">
                        {/* VIEWPORT */}
                        <div className="relative w-full lg:flex-[2_1_380px] lg:min-w-[300px] h-[340px] sm:h-[420px] md:h-[480px] lg:h-[560px] xl:h-[620px] rounded-2xl overflow-hidden flex items-center justify-center" style={{
                            border: '2px solid rgba(148,163,184,0.35)',
                            background: 'radial-gradient(circle at 50% 45%, rgba(255,255,255,0.03), transparent 70%)',
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
                        <div className="w-full lg:flex-[1_1_220px] lg:min-w-[210px] flex flex-col gap-2">
                            <Pill color={readoutColor} side="both" h={30} style={{ fontSize: 13, justifyContent: 'center' }}>
                                {readoutCat ? `${CATEGORY_META[readoutCat].short} Readout` : 'Awaiting Input'}
                            </Pill>
                            <div className="max-h-[240px] lg:max-h-none lg:flex-1" style={{
                                border: '1px solid rgba(148,163,184,0.27)', borderRadius: 10, padding: 12,
                                display: 'flex', flexDirection: 'column', gap: 9, overflowY: 'auto',
                                background: 'var(--lcars-bg-card)',
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
                    <div className="flex flex-wrap items-center gap-2">
                        <Pill color="var(--lcars-purple)" side="both" h={26} style={{ fontSize: 11 }}>Status &middot; Nominal</Pill>
                        <div className="hidden sm:block" style={{ flex: 1, height: 10, background: 'rgba(148,163,184,0.3)', borderRadius: 5, minWidth: 20 }} />
                        <span style={{ fontFamily: MONO, fontSize: 10, color: 'var(--lcars-text-dim)', letterSpacing: '0.2em' }}>
                            {skills.length} NODES &middot; {activeCat ? CATEGORY_META[activeCat].short : 'ALL CLASSES'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TechConsole;
