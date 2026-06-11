// Market store — purchases + my-for-sale listings, persisted to localStorage.
// Market.jsx writes here; MyGames.jsx reads, so a court bought or listed in the
// market shows up under "ההזמנות שלי" without a backend round-trip.

const PURCHASES_KEY = 'rally_purchases';
const MY_LISTINGS_KEY = 'rally_my_listings';

const read = (key) => {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
};
const write = (key, rows) => {
  try { localStorage.setItem(key, JSON.stringify(rows)); } catch { /* storage blocked — keep in memory */ }
};

// ---- purchases -------------------------------------------------------------

export function getPurchases() {
  return read(PURCHASES_KEY);
}

export function addPurchase(listing) {
  const purchases = read(PURCHASES_KEY);
  const order = {
    id: `buy_${Date.now()}`,
    order_number: `RL-${String(Date.now()).slice(-6)}`,
    listing_id: listing.id,
    type: listing.type,
    club_name: listing.club_name,
    city: listing.city,
    court_label: listing.court_label,
    start_time: listing.start_time,
    duration_min: listing.duration_min,
    price: listing.price,
    original_price: listing.original_price,
    image_url: listing.image_url,
    seller: listing.seller || null,
    invited: [], // phone numbers invited to this game
    created_at: new Date().toISOString(),
  };
  write(PURCHASES_KEY, [order, ...purchases]);
  return order;
}

export function addInviteToPurchase(purchaseId, phone) {
  const purchases = read(PURCHASES_KEY);
  const i = purchases.findIndex((p) => p.id === purchaseId);
  if (i >= 0 && !purchases[i].invited.includes(phone)) {
    purchases[i] = { ...purchases[i], invited: [...purchases[i].invited, phone] };
    write(PURCHASES_KEY, purchases);
  }
  return purchases[i];
}

// Only purchases whose slot hasn't passed yet hide their listing — once the
// booked time is over, the (re-seeded) listing may return to the market.
export function getPurchasedListingIds() {
  return read(PURCHASES_KEY)
    .filter((p) => new Date(p.start_time).getTime() > Date.now() - 30 * 60000)
    .map((p) => p.listing_id);
}

// ---- my listings (selling) -------------------------------------------------

export function getMyListings() {
  return read(MY_LISTINGS_KEY);
}

export function addMyListing({ club_name, court_label, start_time, duration_min, original_price, price }) {
  const listings = read(MY_LISTINGS_KEY);
  const listing = {
    id: `sell_${Date.now()}`,
    status: 'listed', // listed | sold | removed
    club_name,
    court_label,
    start_time,
    duration_min,
    original_price,
    price,
    views: 0,
    created_at: new Date().toISOString(),
  };
  write(MY_LISTINGS_KEY, [listing, ...listings]);
  return listing;
}

export function removeMyListing(id) {
  write(MY_LISTINGS_KEY, read(MY_LISTINGS_KEY).filter((l) => l.id !== id));
}

// Deterministic "views" so the listing feels alive without a backend:
// grows with time since publish (~1 view/40s, capped).
export function listingViews(listing) {
  const ageSec = (Date.now() - new Date(listing.created_at).getTime()) / 1000;
  return Math.min(94, 3 + Math.floor(ageSec / 40));
}

// ---- share / invite helpers --------------------------------------------------

// 05X-XXXXXXX / 05XXXXXXXX → 9725XXXXXXXX for wa.me deep links.
export function ilPhoneToWa(phone) {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('972')) return digits;
  if (digits.startsWith('0')) return `972${digits.slice(1)}`;
  return digits;
}

export function isValidIlMobile(phone) {
  const digits = phone.replace(/\D/g, '');
  return /^05\d{8}$/.test(digits) || /^9725\d{8}$/.test(digits);
}
