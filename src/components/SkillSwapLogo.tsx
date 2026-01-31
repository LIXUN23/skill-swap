import React from 'react';
// @ts-ignore
import logoImg from '../assets/logo.jpeg';

interface LogoProps {
  lightMode?: boolean;
  size?: string;
  showTagline?: boolean;
}

export const SkillSwapLogo: React.FC<LogoProps> = ({ 
  lightMode = false, 
  size = "text-3xl", 
  showTagline = false 
}) => {
  return (
    <div className="flex flex-col select-none">
      <div className={`flex items-center gap-3 ${size} leading-none`}>
        {/* IMAGE LOGO */}
        <img 
          src={logoImg} 
          alt="SkillSwap Logo" 
          className="h-12 w-12 object-contain rounded-full shadow-lg" 
        />
        
        {/* TEXT */}
        <div className="flex items-baseline">
          {/* "Skill" - Clean, Sans-serif */}
          <span className={`font-sans font-medium tracking-wide ${lightMode ? 'text-white' : 'text-[#2A3B32]'}`}>
            Skill
          </span>
          
          {/* "Swap" - GLOWING/SHADOWED EFFECT */}
          <span 
            className={`font-serif font-bold ml-1 ${lightMode ? 'text-[#A3C9B0]' : 'text-[#5D7A68]'}`}
            style={{
              textShadow: lightMode 
                ? "0 0 20px rgba(163, 201, 176, 0.6)" // Green Glow for Dark Background
                : "2px 2px 4px rgba(0,0,0,0.15)"      // Soft Shadow for Light Background
            }}
          >
            Swap
          </span>
        </div>
      </div>

      {/* TAGLINE */}
      {showTagline && (
        <div className="flex items-baseline mt-1 ml-14 text-xl">
          <span className="font-sans font-normal text-white/90">Grow</span>
          <span 
            className="font-serif font-bold text-[#A3C9B0] ml-1.5"
            style={{ textShadow: "0 0 10px rgba(163, 201, 176, 0.4)" }}
          >
            Together
          </span>
        </div>
      )}
    </div>
  );
};