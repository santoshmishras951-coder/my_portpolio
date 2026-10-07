import React, { useId } from 'react';

interface SignatureProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showTail?: boolean;
  animated?: boolean;
}

export const Signature: React.FC<SignatureProps> = ({
  className = '',
  size = 'md',
  showTail = true,
}) => {
  const uniqueId = useId().replace(/:/g, '');

  const sizeClasses = {
    xs: 'h-6 sm:h-7',
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-12',
    lg: 'h-12 sm:h-14 lg:h-16',
    xl: 'h-16 sm:h-20 lg:h-24',
  }[size];

  return (
    <div
      className={`inline-flex items-center justify-center select-none text-neutral-900 dark:text-neutral-100 ${className}`}
      title="Santosh Mishra Signature"
      aria-label="Santosh Mishra Signature"
    >
      <svg
        viewBox="0 0 340 100"
        className={`w-auto ${sizeClasses} transition-transform duration-300 hover:scale-105 drop-shadow-xs`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`sigGrad-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.9" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="1" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.85" />
          </linearGradient>
        </defs>

        <g stroke={`url(#sigGrad-${uniqueId})`}>
          {/* Capital 'S' calligraphic flourish and stroke */}
          <path
            d="M 32 68 C 24 46 32 24 52 20 C 72 16 78 30 64 44 C 44 58 18 68 38 80 C 58 88 80 80 94 62"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Letter 'a' */}
          <path
            d="M 94 62 C 98 54 108 50 116 54 C 124 58 122 72 112 72 C 102 72 98 60 108 52 C 114 46 122 46 124 56 L 124 72"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Letter 'n' */}
          <path
            d="M 124 72 C 128 62 134 52 142 52 C 150 52 150 64 152 72 C 156 62 162 52 170 52 C 178 52 178 66 180 72"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Letter 't' with stem and cross */}
          <path
            d="M 180 72 C 186 52 192 32 194 26 C 195 24 193 48 194 72"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 184 40 C 192 38 202 37 210 36"
            strokeWidth="2.4"
            strokeLinecap="round"
          />

          {/* Letter 'o' */}
          <path
            d="M 194 72 C 200 60 208 52 218 52 C 228 52 228 66 220 72 C 212 78 204 68 210 56 C 214 50 222 50 228 54"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Letter 's' */}
          <path
            d="M 228 54 C 234 62 240 68 246 64 C 250 60 248 54 242 56 C 238 58 242 72 252 70"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Letter 'h' */}
          <path
            d="M 252 70 C 258 50 266 26 268 24 C 269 22 266 48 268 72 C 272 60 280 52 288 52 C 296 52 296 66 298 72"
            strokeWidth="2.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Executive Underline Flourish */}
          {showTail && (
            <path
              d="M 36 86 C 96 94 186 90 268 78 C 294 74 316 68 330 60"
              strokeWidth="3"
              strokeLinecap="round"
            />
          )}

          {/* Pen end point dot */}
          <circle cx="324" cy="50" r="2.4" fill="currentColor" />
        </g>
      </svg>
    </div>
  );
};
export default Signature;
