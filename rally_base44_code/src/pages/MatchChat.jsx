import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Phone, Send, MapPin, Clock, Star, Users } from 'lucide-react';
import { MATCHES, FINISHED_MATCH, CHAT_MESSAGES, PLAYERS } from '@/data/mockData';
import LevelTag from '@/components/LevelTag';

const fmtTime = iso => new Date(iso).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
const fmtDate = iso => new Date(iso).toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'numeric' });

export default function MatchChat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('rally_user') || '{}');

  const match = useMemo(
    () => (id === 'm0' ? FINISHED_MATCH : MATCHES.find(m => m.id === id)) || FINISHED_MATCH,
    [id],
  );
  const ended = match.status === 'completed' || new Date(match.start_time).getTime() + match.duration_min * 60000 < Date.now();
  const alreadyRated = !!JSON.parse(localStorage.getItem('rally_ratings_done') || '{}')[match.id];

  const me = { id: 'me', full_name: user.full_name || 'אבישי', avatar_url: user.avatar_url, level: user.level || 'B2', phone: user.phone || '050-1234567' };
  const roster = [...match.players, me];
  const byId = Object.fromEntries([...PLAYERS, me].map(p => [p.id, p]));

  const [messages, setMessages] = useState(
    CHAT_MESSAGES.map(m => ({ ...m, at: Date.now() - m.minutes_ago * 60000 })),
  );
  const [draft, setDraft] = useState('');

  const send = () => {
    if (!draft.trim()) return;
    setMessages(ms => [...ms, { id: `local${ms.length}`, sender_id: 'me', text: draft.trim(), at: Date.now() }]);
    setDraft('');
  };

  return (
    <div dir="rtl" className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 pt-5 pb-3 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center active:scale-90">
            <ArrowRight size={17} />
          </button>
          <div className="flex-1 min-w-0">
            <div className="font-display font-black text-[17px] truncate">{match.club_name}</div>
            <div className="text-[12px] text-muted-foreground flex items-center gap-2">
              <span className="flex items-center gap-0.5"><Clock size={11} />{fmtDate(match.start_time)} · {fmtTime(match.start_time)}</span>
              <span className="flex items-center gap-0.5"><MapPin size={11} />{match.city}</span>
            </div>
          </div>
          <LevelTag level={match.level} size="sm" />
        </div>

        {/* Roster + phones — unlocked because the host approved you */}
        <div className="bg-muted/50 rounded-2xl p-3">
          <div className="flex items-center gap-1.5 text-[11.5px] font-bold text-muted-foreground mb-2">
            <Users size={12} /> השחקנים · מספרי טלפון גלויים לחברי המשחק
          </div>
          <div className="grid grid-cols-2 gap-2">
            {roster.map(p => (
              <a
                key={p.id}
                href={`tel:${p.phone?.replace(/-/g, '')}`}
                className="flex items-center gap-2 bg-card border border-border rounded-xl px-2.5 py-2 active:scale-[0.97] transition-transform"
              >
                {p.avatar_url
                  ? <img src={p.avatar_url} className="w-8 h-8 rounded-full object-cover" alt={p.full_name} />
                  : <div className="w-8 h-8 rounded-full bg-brand-softer text-brand text-[11px] font-bold flex items-center justify-center">{p.full_name[0]}</div>}
                <div className="min-w-0 flex-1">
                  <div className="text-[12px] font-bold truncate">
                    {p.id === 'me' ? `${p.full_name} (אתה)` : p.full_name}
                    {p.id === match.host_id && <span className="text-[hsl(var(--gold-deep))]"> · מארח</span>}
                  </div>
                  <div className="text-[11px] text-muted-foreground flex items-center gap-1" dir="ltr">
                    <Phone size={10} />{p.phone}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Post-match rating gate */}
      {ended && !alreadyRated && (
        <motion.button
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          onClick={() => navigate(`/rate-players?match=${match.id}`)}
          className="mx-4 mt-3 bg-gradient-to-l from-[hsl(var(--gold-deep))] to-[hsl(var(--gold))] text-white rounded-2xl px-4 py-3.5 flex items-center gap-3 shadow-lg active:scale-[0.98] transition-transform"
        >
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <Star size={19} fill="currentColor" />
          </div>
          <div className="flex-1 text-right">
            <div className="font-bold text-[14.5px]">המשחק הסתיים — דרג את החברים</div>
            <div className="text-[12px] opacity-85">4 שאלות, חצי דקה. הדירוג שלך בונה את הרמות של כולם</div>
          </div>
        </motion.button>
      )}
      {ended && alreadyRated && (
        <div className="mx-4 mt-3 bg-brand-softer text-brand rounded-2xl px-4 py-3 text-[13px] font-bold text-center">
          ✓ דירגת את המשחק הזה — תודה! הנתונים כבר עובדים בשבילך
        </div>
      )}

      {/* Chat */}
      <div className="flex-1 px-4 py-4 space-y-2.5 overflow-y-auto">
        {messages.map(m => {
          const sender = byId[m.sender_id] || me;
          const mine = m.sender_id === 'me';
          return (
            <div key={m.id} className={`flex gap-2 ${mine ? 'flex-row-reverse' : ''}`}>
              {!mine && (
                sender.avatar_url
                  ? <img src={sender.avatar_url} className="w-7 h-7 rounded-full object-cover mt-1" alt={sender.full_name} />
                  : <div className="w-7 h-7 rounded-full bg-brand-softer text-brand text-[10px] font-bold flex items-center justify-center mt-1">{sender.full_name[0]}</div>
              )}
              <div className={`max-w-[75%] rounded-2xl px-3.5 py-2 ${mine ? 'bg-brand text-white rounded-tl-md' : 'bg-card border border-border rounded-tr-md'}`}>
                {!mine && <div className="text-[10.5px] font-bold text-[hsl(var(--gold-deep))] mb-0.5">{sender.full_name}</div>}
                <div className="text-[13.5px] leading-snug">{m.text}</div>
                <div className={`text-[10px] mt-0.5 ${mine ? 'text-white/60' : 'text-muted-foreground'}`}>{fmtTime(new Date(m.at).toISOString())}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Composer */}
      <div className="sticky bottom-0 bg-card border-t border-border px-4 py-3 flex items-center gap-2">
        <input
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="כתוב הודעה לקבוצה..."
          className="flex-1 h-11 rounded-full bg-muted px-4 text-[14px] focus:outline-none focus:ring-1 focus:ring-brand"
        />
        <button
          onClick={send}
          disabled={!draft.trim()}
          className="w-11 h-11 rounded-full bg-brand text-white flex items-center justify-center active:scale-90 transition-transform disabled:opacity-40"
        >
          <Send size={17} className="-scale-x-100" />
        </button>
      </div>
    </div>
  );
}
