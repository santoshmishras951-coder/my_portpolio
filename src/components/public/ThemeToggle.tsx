import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Palette, Check } from 'lucide-react';
import { useTheme, ACCENT_PRESETS } from '../../context/ThemeContext.js';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme, accentColor, setAccentColor, currentAccent } = useTheme();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close color popover on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setShowColorPicker(false);
      }
    };
    if (showColorPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showColorPicker]);

  return (
    <div className="relative flex items-center gap-1.5" ref={popoverRef}>
      {/* Light / Dark Mode Controls */}
      <div className="flex items-center p-1 rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 shadow-xs backdrop-blur-md">
        
        {/* Light Mode Button */}
        <button
          onClick={() => setTheme('light')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
            theme === 'light'
              ? 'bg-neutral-100 text-neutral-900 shadow-xs ring-1 ring-neutral-300'
              : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
          }`}
          title="Switch to Light Theme (High Contrast & Clean)"
          aria-label="Light Theme"
        >
          <Sun className="w-3.5 h-3.5 text-amber-500" />
          <span className="hidden sm:inline">Light</span>
        </button>

        {/* Dark Mode Button */}
        <button
          onClick={() => setTheme('dark')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
            theme === 'dark'
              ? 'bg-neutral-800 text-neutral-100 shadow-xs ring-1 ring-neutral-700'
              : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
          }`}
          title="Switch to Dark Theme (Industrial Dark)"
          aria-label="Dark Theme"
        >
          <Moon className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">Dark</span>
        </button>

        {/* Customize Color Trigger Button */}
        <button
          onClick={() => setShowColorPicker(prev => !prev)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
            showColorPicker
              ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white ring-1 ring-neutral-400 dark:ring-neutral-600'
              : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white'
          }`}
          title="Customize Theme Accent Color"
          aria-label="Customize Accent Color"
        >
          <span
            className="w-3 h-3 rounded-full border border-black/20 dark:border-white/30 shadow-xs"
            style={{ backgroundColor: currentAccent.hex }}
          />
          <span className="hidden sm:inline">Color</span>
        </button>

      </div>

      {/* Customize Color Dropdown Popover */}
      {showColorPicker && (
        <div className="absolute right-0 top-full mt-2 w-64 p-3.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-2.5 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-bold text-neutral-900 dark:text-white">Theme Accent</span>
            </div>
            <span className="text-[10px] font-mono uppercase text-neutral-500">{currentAccent.name}</span>
          </div>

          {/* Color Presets Grid */}
          <div className="grid grid-cols-3 gap-2 py-3">
            {ACCENT_PRESETS.map(preset => {
              const isSelected = accentColor === preset.id || accentColor.toLowerCase() === preset.hex.toLowerCase();
              return (
                <button
                  key={preset.id}
                  onClick={() => {
                    setAccentColor(preset.id);
                  }}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'border-neutral-900 dark:border-white bg-neutral-100 dark:bg-neutral-800/80 shadow-xs scale-102'
                      : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-950/40'
                  }`}
                >
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center shadow-xs"
                    style={{ backgroundColor: preset.hex }}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                  </div>
                  <span className="text-[10px] font-medium text-neutral-700 dark:text-neutral-300 truncate max-w-full">
                    {preset.name.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Custom Hex Color Picker Input */}
          <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-2">
            <span className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">Custom Hex:</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={currentAccent.hex}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-7 h-7 rounded-lg border border-neutral-300 dark:border-neutral-700 cursor-pointer bg-transparent"
                title="Choose custom color"
              />
              <span className="text-[11px] font-mono text-neutral-700 dark:text-neutral-300 font-semibold uppercase">
                {currentAccent.hex}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
