// ============================================================================
// Wallet demo data — deterministic transaction feed for the wallet screen.
// Balance itself lives in localStorage under `rally_wallet` (default below);
// the feed is static so the screen renders identically on every load.
// ============================================================================

export const WALLET_BALANCE_KEY = 'rally_wallet';
export const WALLET_DEFAULT_BALANCE = 285;

// Money on its way in — a court sold on the market, pending clearance.
export const WALLET_PENDING = 120;

// type: booking (court reservation) | sale (sold a slot on the market)
//     | tournament (entry fee)      | refund (cancellation credited back)
export const WALLET_TRANSACTIONS = [
  {
    id: 'tx12', type: 'sale', title: 'מכירת מגרש',
    context: 'פאדל פוינט תל אביב · מגרש 3', date: '2026-06-09', amount: 120,
  },
  {
    id: 'tx11', type: 'booking', title: 'הזמנת מגרש',
    context: 'Padel Up הרצליה · מגרש 1', date: '2026-06-05', amount: -45,
  },
  {
    id: 'tx10', type: 'tournament', title: 'דמי טורניר',
    context: 'ליגת קיץ · מועדון פאדל רעננה', date: '2026-06-02', amount: -80,
  },
  {
    id: 'tx9', type: 'refund', title: 'החזר ביטול',
    context: 'Smash פאדל ראשון · מגרש 5', date: '2026-05-28', amount: 45,
  },
  {
    id: 'tx8', type: 'booking', title: 'הזמנת מגרש',
    context: 'פאדל פוינט תל אביב · מגרש 2', date: '2026-05-22', amount: -45,
  },
  {
    id: 'tx7', type: 'sale', title: 'מכירת מגרש',
    context: 'פאדל ביץ׳ נתניה · מגרש 1', date: '2026-05-15', amount: 120,
  },
  {
    id: 'tx6', type: 'booking', title: 'הזמנת מגרש',
    context: 'מועדון פאדל רעננה · מגרש 2', date: '2026-05-08', amount: -45,
  },
  {
    id: 'tx5', type: 'tournament', title: 'דמי טורניר',
    context: 'טורניר אביב · Padel Up הרצליה', date: '2026-04-26', amount: -80,
  },
  {
    id: 'tx4', type: 'booking', title: 'הזמנת מגרש',
    context: 'Smash פאדל ראשון · מגרש 4', date: '2026-04-19', amount: -45,
  },
  {
    id: 'tx3', type: 'refund', title: 'החזר ביטול',
    context: 'פאדל פוינט תל אביב · מגרש 1', date: '2026-04-14', amount: 45,
  },
  {
    id: 'tx2', type: 'sale', title: 'מכירת מגרש',
    context: 'Padel Up הרצליה · מגרש 3', date: '2026-04-07', amount: 120,
  },
  {
    id: 'tx1', type: 'booking', title: 'הזמנת מגרש',
    context: 'פאדל ביץ׳ נתניה · מגרש 2', date: '2026-04-03', amount: -45,
  },
];

const MONTHS_HE = [
  'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר',
];

export function walletMonthLabel(isoDate) {
  const d = new Date(isoDate + 'T00:00:00');
  return `${MONTHS_HE[d.getMonth()]} ${d.getFullYear()}`;
}

export function walletDayLabel(isoDate) {
  const d = new Date(isoDate + 'T00:00:00');
  return d.toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric' });
}

// Transactions grouped by Hebrew month label, newest month first
// (input list is already sorted newest → oldest).
export function groupTransactionsByMonth(transactions = WALLET_TRANSACTIONS) {
  const groups = [];
  for (const tx of transactions) {
    const label = walletMonthLabel(tx.date);
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.items.push(tx);
    else groups.push({ label, items: [tx] });
  }
  return groups;
}

export function readWalletBalance() {
  try {
    const raw = localStorage.getItem(WALLET_BALANCE_KEY);
    const n = Number(raw);
    if (raw !== null && Number.isFinite(n)) return n;
  } catch { /* demo mode — never block on storage */ }
  try {
    localStorage.setItem(WALLET_BALANCE_KEY, String(WALLET_DEFAULT_BALANCE));
  } catch { /* ignore */ }
  return WALLET_DEFAULT_BALANCE;
}
