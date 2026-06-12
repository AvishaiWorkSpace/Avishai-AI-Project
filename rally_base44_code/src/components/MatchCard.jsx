import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Banknote } from 'lucide-react';
import LevelTag from '@/components/LevelTag';
import { formatMatchTime } from '@/lib/format';

// Reusable match card used across Home and Find.
// Surfaces the "missing a player" state prominently — the #1 survey pain.
//
// joinStatus (optional) overrides the spots badge for approval-gated joining:
//   'pending'             — request sent, waiting for the host
//   'approved' | 'member' — you're in the game
export default function MatchCard({ match, onClick, joinStatus }) {
  const navigate = useNavigate();
  const players = match.players || [];
  const max = match.max_players || 4;
  const spotsLeft = Math.max(0, max - players.length);
  const almostFull = spotsLeft === 1;

  const go = () => (onClick ? onClick(match) : navigate(`/match/${match.id}`));

  return (
    <button
      onClick={go}
      className="w-full text-right bg-card rounded-3xl overflow-hidden border border-border shadow-sm active:scale-[0.98] transition-transform"
    >
      <div className="flex">
        {/* Club thumbnail */}
        <div className="relative w-24 flex-shrink-0">
          <img
            src={match.club_image}
            alt={match.club_name}
            className="w-full h-full object-cover absolute inset-0"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black/20 to-transparent" />
        </div>

        {/* Body */}
        <div className="flex-1 p-3.5 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div className="min-w-0">
              <div className="font-bold text-[15px] leading-tight truncate">{match.club_name}</div>
              <div className="flex items-center gap-1 text-[12px] text-muted-foreground mt-0.5">
                <MapPin size={11} strokeWidth={2} />
                <span className="truncate">
                  {match.city} · {match.drive_minutes} דק׳
                </span>
              </div>
            </div>
            <LevelTag level={match.level} size="sm" />
          </div>

          <div className="flex items-center gap-3 text-[12px] text-muted-foreground mb-2.5">
            <span className="flex items-center gap-1">
              <Clock size={12} strokeWidth={2} />
              {formatMatchTime(match.start_time)}
            </span>
            {match.price_per_player != null && (
              <span className="flex items-center gap-1">
                <Banknote size={12} strokeWidth={2} />
                ₪{match.price_per_player}
              </span>
            )}
          </div>

          {/* Players + spots */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex -space-x-2 space-x-reverse">
                {players.slice(0, 4).map((p) => (
                  <img
                    key={p.id}
                    src={p.avatar_url}
                    alt={p.full_name}
                    className="w-7 h-7 rounded-full border-2 border-white object-cover"
                  />
                ))}
                {Array.from({ length: spotsLeft }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="w-7 h-7 rounded-full border-2 border-dashed border-brand/40 bg-brand-softer flex items-center justify-center text-brand text-[13px] font-bold"
                  >
                    +
                  </div>
                ))}
              </div>
            </div>

            {joinStatus === 'member' || joinStatus === 'approved' ? (
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-brand text-white">
                אתה במשחק ✓
              </span>
            ) : joinStatus === 'pending' ? (
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-gold-soft text-[#8a6d3b] animate-pulse">
                ממתין לאישור המנהל
              </span>
            ) : spotsLeft > 0 ? (
              <span
                className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                  almostFull
                    ? 'bg-gold/20 text-[#8a6d3b] animate-pulse'
                    : 'bg-brand-softer text-brand'
                }`}
              >
                {almostFull ? 'חסר שחקן אחד!' : `${spotsLeft} מקומות פנויים`}
              </span>
            ) : (
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                מלא
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
