import { useState, useRef, useEffect } from "react";

interface SuggestionInputProps {
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  placeholder: string;
  className?: string;
  label?: string;
}

export function SuggestionInput({ value, onChange, suggestions, placeholder, className = "", label }: SuggestionInputProps) {
  const [open, setOpen] = useState(false);
  const [filtered, setFiltered] = useState<string[]>(suggestions);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!value.trim()) {
      setFiltered(suggestions);
    } else {
      const q = value.toLowerCase();
      setFiltered(suggestions.filter(s => s.toLowerCase().includes(q)));
    }
  }, [value, suggestions]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className={className}
      />
      {open && filtered.length > 0 && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-zinc-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {!value.trim() && (
            <div className="px-4 py-2 text-xs font-semibold text-zinc-400 uppercase tracking-wide">
              {label || "Suggestions"}
            </div>
          )}
          {filtered.map((item) => (
            <button
              key={item}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => { onChange(item); setOpen(false); }}
              className="w-full text-left px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors flex items-center gap-2.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-300 shrink-0"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
