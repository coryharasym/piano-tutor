// Small inline icons (24×24, stroke-based).
const wrap = (d, extra = '') => `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${d}</svg>`;

export const icons = {
  back: wrap('<path d="M15 18l-6-6 6-6"/>'),
  next: wrap('<path d="M9 18l6-6-6-6"/>'),
  home: wrap('<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/>'),
  mic: wrap('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/>'),
  micOff: wrap('<path d="M9 9v2a3 3 0 0 0 5.1 2.1M15 10V6a3 3 0 0 0-5.7-1.3"/><path d="M5 11a7 7 0 0 0 11.5 5.4M19 11a7 7 0 0 1-.6 2.8"/><path d="M12 18v3"/><path d="M3 3l18 18"/>'),
  play: wrap('<path d="M7 5l12 7-12 7z" fill="currentColor"/>'),
  stop: wrap('<rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/>'),
  ear: wrap('<path d="M6 9a6 6 0 1 1 12 0c0 3-2 4-3 5.5S14 18 12 19.5 8 20 8 17"/><path d="M10 9a2 2 0 1 1 4 0c0 1.5-2 2-2 3.5"/>'),
  bulb: wrap('<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>'),
  restart: wrap('<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/>'),
  gear: wrap('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),
  check: wrap('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
  piano: wrap('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M8 5v8M12 5v8M16 5v8M8 13v6M12 13v6M16 13v6"/>'),
  metronome: wrap('<path d="M8 3h8l3 18H5z"/><path d="M12 15l5-8"/>'),
  ribbon: wrap('<circle cx="12" cy="9" r="6"/><path d="M8.5 13.5L7 22l5-3 5 3-1.5-8.5"/>'),
  note: wrap('<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>'),
  print: wrap('<path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/>'),
  book: wrap('<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5"/><path d="M9 7h6"/>'),
  x: wrap('<path d="M6 6l12 12M18 6L6 18"/>'),
  rotate: wrap('<rect x="4" y="7" width="16" height="10" rx="2"/><path d="M12 3a9 9 0 0 1 7 3.5M19 3v3.5h-3.5"/>'),
};
