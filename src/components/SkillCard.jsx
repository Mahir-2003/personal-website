import React, { useState, useEffect } from 'react';
import { skills } from './SkillsGlobe';

const SkillCard = ({ side }) => {
    // Group skills by category
    const groupedSkills = skills.reduce((acc, skill) => {
        if (!acc[skill.category]) {
            acc[skill.category] = [];
        }
        acc[skill.category].push(skill);
        return acc;
    }, {});

    const categories = Object.keys(groupedSkills);
    
    // Distribute categories: first 2 on left, last 2 on right
    const leftCategories = categories.slice(0, 2);
    const rightCategories = categories.slice(2, 4);
    
    const categoriesToShow = side === 'left' ? leftCategories : rightCategories;

    return (
        <>
            {categoriesToShow.map((category) => (
                <CategoryCard 
                    key={category}
                    category={category}
                    skills={groupedSkills[category]}
                />
            ))}
        </>
    );
};

const CategoryCard = ({ category, skills }) => {
    // Sort skills by proficiency (highest first)
    const sortedSkills = [...skills].sort((a, b) => b.proficiency - a.proficiency);
    
    // Default: open on desktop, closed on mobile
    const [isMobile, setIsMobile] = useState(false);
    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
        // Check if mobile on mount
        const checkMobile = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            setIsOpen(!mobile); // Open on desktop, closed on mobile
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div className="lcars-glass-panel rounded-lg p-3 border border-blue-400/30 hover:border-blue-400/50 transition-all duration-300">
            {/* Category Header */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center mb-3 cursor-pointer group"
            >
                <div className="flex-1 h-0.5 bg-gradient-to-r from-orange-400/50 to-transparent"></div>
                <h3 className="text-orange-400 font-bold text-xs tracking-wider px-2 uppercase group-hover:text-orange-300 transition-colors">
                    [ {category} ]
                </h3>
                <div className="flex-1 h-0.5 bg-gradient-to-l from-orange-400/50 to-transparent"></div>
                
                {/* Dropdown indicator */}
                <div className="ml-2 text-orange-400 group-hover:text-orange-300 transition-transform duration-300 flex-shrink-0" 
                     style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>

            {/* Skills Grid - collapsible*/}
            <div className={`space-y-2 overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                {sortedSkills.map((skill) => {
                    const IconComponent = skill.icon;
                    return (
                        <div
                            key={skill.name}
                            className="group relative p-2 rounded-sm border border-orange-400/15 hover:border-orange-400/45 transition-all duration-300"
                            style={{ background: 'var(--lcars-bg-card)' }}
                        >
                            <div className="flex items-center gap-2">
                                {/* Icon */}
                                <div 
                                    className="text-lg transition-transform duration-300 group-hover:scale-110"
                                    style={{ color: skill.iconColor }}
                                >
                                    <IconComponent />
                                </div>

                                {/* Skill Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="text-white font-semibold text-xs truncate group-hover:text-blue-300 transition-colors">
                                        {skill.name}
                                    </div>
                                </div>
                            </div>

                            {/* LCARS corner accent */}
                            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-orange-400/20 rounded-tr opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SkillCard;