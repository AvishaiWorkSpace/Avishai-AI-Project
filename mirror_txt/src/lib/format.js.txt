// Hebrew date/time helpers for match display.

const DAYS = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

export function formatMatchTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const time = d.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });

  const startOfDay = (x) => new Date(x.getFullYear(), x.getMonth(), x.getDate());
  const diffDays = Math.round((startOfDay(d) - startOfDay(now)) / 86400000);

  let day;
  if (diffDays === 0) day = 'היום';
  else if (diffDays === 1) day = 'מחר';
  else if (diffDays < 7) day = `יום ${DAYS[d.getDay()]}`;
  else day = d.toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric' });

  return `${day} · ${time}`;
}

export function timeUntil(iso) {
  if (!iso) return '';
  const diffMs = new Date(iso) - new Date();
  const hours = Math.round(diffMs / 3600000);
  if (hours < 1) return 'מתחיל בקרוב';
  if (hours < 24) return `בעוד ${hours} שע׳`;
  const days = Math.round(hours / 24);
  return `בעוד ${days} ימים`;
}
