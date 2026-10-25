export const ICON_PATHS = {
  phone: '<rect x="6" y="2.5" width="12" height="19" rx="3"/><path d="M10.5 18h3"/>',
  wifi:
    '<path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.8 16a5 5 0 0 1 6.4 0"/><circle cx="12" cy="19.3" r=".9"/>',
  wallet:
    '<path d="M3.5 7.5A2.5 2.5 0 0 1 6 5h12v3.5"/><rect x="3.5" y="8" width="17" height="11.5" rx="2.5"/><path d="M16 13.8h1.5"/>',
  bolt: '<path d="M13 2.5 4.5 13.5H12l-1 8 8.5-11H12z"/>',
  drop: '<path d="M12 3s6.5 7 6.5 11.5a6.5 6.5 0 0 1-13 0C5.5 10 12 3 12 3z"/>',
  tv:
    '<rect x="3" y="5.5" width="18" height="12" rx="2.5"/><path d="M8 21h8M9 2.5l3 3 3-3"/>',
  game:
    '<rect x="2.5" y="7" width="19" height="11" rx="5"/><path d="M7.5 11v3M6 12.5h3"/><circle cx="15.5" cy="11.5" r=".8"/><circle cx="17.5" cy="13.8" r=".8"/>',
  shield:
    '<path d="M12 2.8 4.5 5.8v5.7c0 4.7 3.2 8.4 7.5 9.7 4.3-1.3 7.5-5 7.5-9.7z"/><path d="M9 12h6M12 9v6"/>',
  car:
    '<path d="M5 16.5V12l2-5h10l2 5v4.5"/><path d="M3.5 12h17v4.5h-17z"/><circle cx="7.5" cy="16.5" r="1.8"/><circle cx="16.5" cy="16.5" r="1.8"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
  receipt:
    '<path d="M6 2.5h12v19l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
  chat: '<path d="M4 5.5h16v11H9l-5 4z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  refund: '<path d="M4 12a8 8 0 1 0 2.3-5.6L4 8.7"/><path d="M4 4v4.7h4.7"/>',
  qr:
    '<rect x="3.5" y="3.5" width="6.5" height="6.5" rx="1"/><rect x="14" y="3.5" width="6.5" height="6.5" rx="1"/><rect x="3.5" y="14" width="6.5" height="6.5" rx="1"/><path d="M14 14h2.5v2.5M20.5 14v6.5H14"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  copy:
    '<rect x="8" y="8" width="12" height="12" rx="2.5"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
} as const;

export type IconName = keyof typeof ICON_PATHS;
