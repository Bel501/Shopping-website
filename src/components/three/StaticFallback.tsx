import React, { useState } from 'react';

interface StaticFallbackProps {
  label?: string;
  imageUrl?: string;
  accentHex?: string;
  colorHex?: string;
}

export const StaticFallback: React.FC<StaticFallbackProps> = ({
  label = 'VÉLOX Aero 01',
  imageUrl,
  accentHex = '#D4FF00',
  colorHex = '#27272a',
}) => {
  const [imgFailed, setImgFailed] = useState(false);

  if (imageUrl && !imgFailed) {
    return (
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-carbon">
        <img
          src={imageUrl}
          alt={label}
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
          className="h-full w-full object-cover object-center"
        />
      </div>
    );
  }

  return (
    <div className="relative flex h-full w-full items-center justify-center bg-carbon p-8">
      <div
        className="pointer-events-none absolute h-64 w-64 rounded-full opacity-20 blur-3xl"
        style={{ backgroundColor: accentHex }}
      />
      <svg
        viewBox="0 0 500 260"
        className="relative z-10 w-full max-w-lg drop-shadow-[0_25px_35px_rgba(0,0,0,0.85)]"
        aria-label={label}
      >
        <defs>
          <linearGradient id="shoeBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colorHex} />
            <stop offset="100%" stopColor="#09090b" />
          </linearGradient>
        </defs>
        <path
          d="M55,195 Q160,215 290,205 Q390,198 445,175 Q455,192 435,205 Q320,228 175,225 Q65,222 45,205 Z"
          fill="#e4e4e7"
        />
        <path d="M85,186 Q220,202 420,174 L410,183 Q220,210 80,194 Z" fill={accentHex} />
        <path
          d="M65,185 C50,145 75,85 110,70 C145,95 190,115 245,95 C295,120 375,140 438,162 C445,172 438,178 420,178 C295,198 165,198 65,185 Z"
          fill="url(#shoeBody)"
          stroke="#3f3f46"
          strokeWidth="2"
        />
        <path d="M145,138 L315,158" stroke={accentHex} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M165,152 L290,168" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
};
