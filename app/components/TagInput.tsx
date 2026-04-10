"use client";
import { useState, useRef, useEffect, KeyboardEvent } from "react";

interface Props {
  value: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
  dark?: boolean; // for use on dark backgrounds (media modal)
}

export function TagInput({ value, onChange, suggestions = [], placeholder = "Add a tag…", dark = false }: Props) {
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = input.trim()
    ? suggestions.filter(
        (s) => s.includes(input.toLowerCase()) && !value.includes(s)
      )
    : [];

  function addTag(raw: string) {
    const tag = raw.trim().toLowerCase().replace(/\s+/g, "-");
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
    }
    setInput("");
    setOpen(false);
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (input.trim()) addTag(input);
    } else if (e.key === "Backspace" && !input && value.length > 0) {
      removeTag(value[value.length - 1]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const baseWrap = dark
    ? "flex flex-wrap gap-1.5 items-center bg-white/20 rounded-lg px-2 py-1.5 min-h-[38px] cursor-text focus-within:ring-1 focus-within:ring-white/50"
    : "flex flex-wrap gap-1.5 items-center bg-cream-50 border-2 border-brand-100 rounded-xl px-2 py-1.5 min-h-[42px] cursor-text focus-within:border-brand-300";

  const chipBase = dark
    ? "flex items-center gap-1 bg-white/25 text-white text-xs font-medium px-2 py-0.5 rounded-full"
    : "flex items-center gap-1 bg-brand-100 text-brand-700 text-xs font-medium px-2 py-0.5 rounded-full";

  const inputClass = dark
    ? "flex-1 min-w-[80px] bg-transparent text-white placeholder-white/40 text-sm focus:outline-none"
    : "flex-1 min-w-[80px] bg-transparent text-brand-800 placeholder-brand-300 text-sm focus:outline-none";

  const dropdownClass = dark
    ? "absolute z-50 top-full left-0 right-0 mt-1 bg-gray-800 border border-white/20 rounded-lg shadow-lg overflow-hidden"
    : "absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-brand-200 rounded-xl shadow-lg overflow-hidden";

  const dropItemBase = dark
    ? "w-full text-left px-3 py-2 text-sm text-white hover:bg-white/20 transition"
    : "w-full text-left px-3 py-2 text-sm text-brand-700 hover:bg-brand-50 transition";

  return (
    <div ref={containerRef} className="relative">
      <div className={baseWrap} onClick={() => inputRef.current?.focus()}>
        {value.map((tag) => (
          <span key={tag} className={chipBase}>
            {tag}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
              className={dark ? "text-white/60 hover:text-white leading-none" : "text-brand-400 hover:text-brand-700 leading-none"}
            >
              ×
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => { setInput(e.target.value); setOpen(true); }}
          onKeyDown={handleKeyDown}
          onFocus={() => setOpen(true)}
          placeholder={value.length === 0 ? placeholder : ""}
          className={inputClass}
        />
      </div>

      {open && filtered.length > 0 && (
        <div className={dropdownClass}>
          {filtered.slice(0, 8).map((s) => (
            <button
              key={s}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); addTag(s); }}
              className={dropItemBase}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
