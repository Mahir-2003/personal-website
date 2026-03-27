import { Link, useLocation } from "react-router";
import { useState, useMemo, useCallback, memo } from "react";
import tngBadge from "../assets/TNG_badge.svg";

const NAVIGATION_ITEMS = [
    { path: '/', label: 'HOME', id: '001' },
    { path: '/personal-log', label: 'PERSONAL LOG', id: '002' },
    { path: '/projects', label: 'PROJECTS', id: '003' },
    // below are removed til further notice
    // { path: '/tech-stack', label: 'TECH STACK', id: '004' },
    // { path: '/blog', label: 'LOGS', id: '005' }
];

const NavigationItem = memo(({ item, index, isExpanded, isActive, getTransitionDelay }) => {

    // memoized classnames below for better performance
    const linkClassName = useMemo(() => `
        lcars-nav-button group
        transition-all duration-1500 ease-out
        ${isExpanded ? 'lcars-nav-expanded transform translate-x-0 scale-100' : 'lcars-nav-collapsed transform translate-x-0 scale-100'}
        ${isActive(item.path) ? 'lcars-nav-active' : ''}
    `, [isExpanded, isActive, item.path]);

    const labelClassName = useMemo(() => `
        flex-1 text-left ml-4 font-bold tracking-wider
        transition-all duration-1500 ease-out overflow-hidden whitespace-nowrap
        ${isExpanded ? 'max-w-full transform scale-100' : 'max-w-0 transform scale-0'}
    `, [isExpanded]);

    const indicatorClassName = useMemo(() => `
        lcars-active-indicator
        transition-all duration-1500 ease-out
        ${isExpanded ? 'transform scale-100' : 'transform scale-0'}
    `, [isExpanded]);

    return (
        <Link
            key={item.path}
            to={item.path}
            className={linkClassName}
            style={getTransitionDelay(index)}
        >
            <div className="relative z-10 flex items-center">
                <span className="lcars-nav-id">
                    {item.id}
                </span>
                <div className={labelClassName}>
                    {item.label}
                </div>
                {isActive(item.path) && isExpanded && (
                    <div className={indicatorClassName}></div>
                )}
            </div>

            <div className="lcars-button-glow"></div>
        </Link>
    );
});

const Navigation = memo(() => {
    const [isExpanded, setIsExpanded] = useState(false);
    const location = useLocation();

    const toggleExpanded = useCallback(() => {
        setIsExpanded(prev => !prev);
    }, []);

    const isActive = useCallback((path) => location.pathname === path, [location.pathname]);

    // memoized all classnames for better performance.

    const navClassName = useMemo(() => `
        fixed top-0 left-0 h-full z-50 w-80
        transition-transform duration-1500 ease-out
        ${isExpanded ? 'translate-x-0' : '-translate-x-full'}
        p-6
    `, [isExpanded]);

    const lcarsContainerClassName = useMemo(() => `
        lcars-glass-panel rounded-3xl relative overflow-hidden
        transition-all duration-1500 ease-out
        ${isExpanded ? 'transform scale-100' : 'transform scale-0'}
        p-6 mb-4
    `, [isExpanded]);

    const lcarsTextClassName = useMemo(() => `
        text-orange-400 font-black tracking-wider text-5xl ml-4
        transition-all duration-1500 ease-out
        ${isExpanded ? 'transform scale-100' : 'transform scale-0'}
    `, [isExpanded]);

    const subtitleClassName = useMemo(() => `
        text-blue-300 text-sm opacity-90 tracking-widest font-semibold
        transition-all duration-1500 ease-out
        ${isExpanded ? 'transform scale-100' : 'transform scale-0'}
    `, [isExpanded]);

    const statusBarClassName = useMemo(() => `
        lcars-glass-panel rounded-2xl relative overflow-hidden
        transition-all duration-1500 ease-out
        ${isExpanded ? 'transform scale-100 px-6 py-3' : 'transform scale-0 px-0 py-0 pointer-events-none'}
    `, [isExpanded]);

    const navItemsClassName = useMemo(() => `
        space-y-3
        transition-all duration-1500 ease-out
        ${isExpanded ? 'transform translate-x-0 scale-100' : 'transform translate-x-0 scale-0 pointer-events-none'}
    `, [isExpanded]);

    const systemStatusClassName = useMemo(() => `
        absolute bottom-6 left-6 right-6
        transition-all duration-1500 ease-out
        ${isExpanded ? 'transform translate-y-0 scale-100' : 'transform translate-y-8 scale-0 pointer-events-none'}
    `, [isExpanded]);

    const getTransitionDelay = useCallback((index) => ({
        transitionDelay: isExpanded ? `${index * 0.1}s` : '0s'
    }), [isExpanded]);

    const statusHeaderClassName = useMemo(() => `
        text-center mb-3
        transition-all duration-1500 ease-out
        ${isExpanded ? 'transform scale-100' : 'transform scale-0'}
    `, [isExpanded]);

    const statusGridClassName = useMemo(() => `
        grid grid-cols-3 gap-2
        transition-all duration-1500 ease-out
        ${isExpanded ? 'transform scale-100' : 'transform scale-0'}
    `, [isExpanded]);

    return (
        <>
            {/* Fixed communicator badge — lives outside <nav> so it's never clipped by the translate */}
            <div
                className="fixed top-12 left-12 z-[60] cursor-pointer select-none
                           hover:scale-110 hover:rotate-3 hover:drop-shadow-[0_0_20px_rgba(251,146,60,0.6)]
                           w-12 h-12 flex items-center justify-center
                           transition-transform duration-300 ease-out"
                onClick={toggleExpanded}
            >
                {/* Ping ring — only when collapsed */}
                {!isExpanded && (
                    <div className="border-2 border-orange-400/40 rounded-full absolute inset-0 animate-ping" style={{ animationDuration: '2s' }}></div>
                )}
                {/* Background ring */}
                <div className="absolute inset-0 rounded-full lcars-nav-active backdrop-blur-sm border-2 border-orange-400/70"></div>

                <img
                    src={tngBadge}
                    alt="TNG Badge"
                    className="w-full h-full object-contain relative z-10"
                />
            </div>

            {/* floating nav sidebar */}
            <nav className={navClassName}>
                {/* Header section */}
                <div className="mb-8 relative">
                    {/* LCARS container - always present but invisible when collapsed */}
                    <div className={lcarsContainerClassName}>
                        <div className="relative z-10">
                            {/* container for badge space and text */}
                            <div className="flex items-center mb-4">
                                {/* space reserved for the external badge */}
                                <div className="w-12 h-12 flex-shrink-0"></div>

                                {/* LCARS text - fades in next to badge */}
                                <div className={lcarsTextClassName} style={{ fontFamily: "TNG, Orbitron, sans-serif" }}>
                                    <span className="whitespace-nowrap">LCARS</span>
                                </div>
                            </div>

                            {/* Subtitle - fades in below */}
                            <div className={subtitleClassName}>
                                <span className="whitespace-nowrap block">STARFLEET DATABASE</span>
                            </div>
                        </div>

                        {/* animated gradient overlay */}
                        <div className="absolute inset-0 opacity-30 lcars-gradient-animate"></div>
                    </div>

                    {/* status bar - fades in when expanded */}
                    <div className={statusBarClassName}>
                        <div className="text-orange-400 text-xs font-bold tracking-widest text-center lcars-glow-orange">
                            <span className="whitespace-nowrap block">AUTHORIZED ACCESS ONLY</span>
                        </div>
                    </div>
                </div>

                {/* nav items - floating buttons with staggered animation */}
                <div className={navItemsClassName}>
                    {NAVIGATION_ITEMS.map((item, index) => (
                        <NavigationItem
                            key={item.path}
                            item={item}
                            index={index}
                            isExpanded={isExpanded}
                            isActive={isActive}
                            getTransitionDelay={getTransitionDelay}
                        />
                    ))}
                </div>

                {/* system status panel - floating at bottom with smooth transition */}
                <div className={systemStatusClassName}>

                    <div className="lcars-glass-panel rounded-2xl p-4 mb-4">
                        <div className={statusHeaderClassName}>
                            <h3 className="text-purple-400 font-bold text-sm tracking-widest lcars-glow-purple whitespace-nowrap">
                                SYSTEM STATUS
                            </h3>
                        </div>

                        <div className={statusGridClassName}>
                            {/* POWER */}
                            <div className="lcars-status-indicator">
                                <span className="text-xs font-semibold text-gray-400 whitespace-nowrap">POWER</span>
                                <span className="text-xs font-bold text-green-400 lcars-glow-green whitespace-nowrap">ONLINE</span>
                            </div>

                            {/* SECTOR */}
                            <div className="lcars-status-indicator">
                                <span className="text-xs font-semibold text-gray-400 whitespace-nowrap">SECTOR</span>
                                <span className="text-xs font-bold text-blue-400 lcars-glow-blue whitespace-nowrap">SOL-3</span>
                            </div>

                            {/* ACCESS */}
                            <div className="lcars-status-indicator">
                                <span className="text-xs font-semibold text-gray-400 whitespace-nowrap">ACCESS</span>
                                <span className="text-xs font-bold text-purple-400 lcars-glow-purple whitespace-nowrap">GUEST</span>
                            </div>
                        </div>
                    </div>

                    {/* LCARS diagnostic strip */}
                    <div className="flex space-x-2">
                        <div className="flex-1 h-1 rounded-full lcars-diagnostic-orange"></div>
                        <div className="flex-1 h-1 rounded-full lcars-diagnostic-blue"></div>
                        <div className="flex-1 h-1 rounded-full lcars-diagnostic-purple"></div>
                        <div className="flex-1 h-1 rounded-full lcars-diagnostic-green"></div>
                    </div>
                </div>
            </nav>
        </>
    )
});

export default Navigation
