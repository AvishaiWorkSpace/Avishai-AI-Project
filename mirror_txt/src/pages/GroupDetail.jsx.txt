import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Users, CalendarDays, BadgeCheck } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import { SOCIAL_GROUPS, GROUP_MESSAGES, getGroupMembers } from '@/data/socialGroups';
import LevelTag from '@/components/LevelTag';
import MatchCard from '@/components/MatchCard';

const spring = { type: 'spring', stiffness: 280, damping: 26 };
const JOINED_KEY = 'rally_groups_joined';

const readJoined = () => {
  try {
    const v = JSON.parse(localStorage.getItem(JOINED_KEY) || '[]');
    return Array.isArray(v) ? v : [];
  } catch { return []; }
};

function initials(name = '') {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('');
}

export default function GroupDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const group = SOCIAL_GROUPS.find((g) => g.id === id) || SOCIAL_GROUPS[0];
  const [joined, setJoined] = useState(readJoined);
  const isJoined = joined.includes(group.id);

  const members = useMemo(() => getGroupMembers(group), [group]);
  const messages = GROUP_MESSAGES[group.id] || [];

  const { data: matches = [] } = useQuery({
    queryKey: ['matches', 'open'],
    queryFn: () => base44.entities.Match.filter({ status: 'open' }, 'start_time'),
  });
  const groupMatches = matches.filter((m) => m.city === group.city).slice(0, 2);

  const toggleJoin = () => {
    setJoined((prev) => {
      const next = isJoined ? prev.filter((x) => x !== group.id) : [...prev, group.id];
      try { localStorage.setItem(JOINED_KEY, JSON.stringify(next)); } catch { /* demo */ }
      if (!isJoined) toast.success(`הצטרפת ל${group.name}`);
      return next;
    });
  };

  return (
    <div dir="rtl" className="min-h-screen bg-background max-w-md mx-auto pb-12">
      {/* Cover hero */}
      <div className="relative h-52">
        <img src={group.cover} alt={group.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/30" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-5 right-5 w-9 h-9 rounded-full glass-dark text-white flex items-center justify-center active:scale-90"
        >
          <ArrowRight size={17} />
        </button>
        <div className="absolute bottom-4 right-5 left-5 text-white">
          <span className="text-[11px] font-bold bg-white/15 backdrop-blur-sm px-2.5 py-1 rounded-full">{group.level_range}</span>
          <h1 className="font-display text-[24px] font-black leading-tight mt-2">{group.name}</h1>
          <div className="flex items-center gap-3 text-[12px] text-white/85 mt-1">
            <span>{group.city}</span>
            <span className="flex items-center gap-1"><CalendarDays size={12} /> {group.schedule}</span>
          </div>
        </div>
      </div>

      <div className="px-5">
        {/* Stats + join */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={spring}
          className="bg-card border border-border rounded-3xl p-4 shadow-luxe -mt-6 relative z-10">
          <div className="grid grid-cols-3 text-center mb-3.5">
            <div>
              <div className="font-display text-[20px] font-black">{group.members_count + (isJoined ? 1 : 0)}</div>
              <div className="text-[11px] text-muted-foreground">חברים</div>
            </div>
            <div className="border-x border-border">
              <div className="font-display text-[20px] font-black">{group.games_per_week}</div>
              <div className="text-[11px] text-muted-foreground">משחקים בשבוע</div>
            </div>
            <div>
              <div className="font-display text-[20px] font-black">{group.avg_level}</div>
              <div className="text-[11px] text-muted-foreground">רמה ממוצעת</div>
            </div>
          </div>
          <button
            onClick={toggleJoin}
            className={`w-full py-3 rounded-full font-bold text-[14.5px] transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
              isJoined ? 'bg-brand-softer text-brand' : 'bg-brand text-white shadow-sm'
            }`}
          >
            {isJoined ? (<><Check size={16} strokeWidth={3} /> אתה חבר בקבוצה</>) : 'הצטרף לקבוצה'}
          </button>
        </motion.div>

        {/* Description */}
        <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.05 }}
          className="text-[13.5px] text-muted-foreground leading-relaxed mt-4">
          {group.description}
        </motion.p>

        {/* Upcoming group matches */}
        {groupMatches.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.1 }} className="mt-5">
            <div className="font-display text-[17px] font-black mb-2.5">המשחקים הקרובים של הקבוצה</div>
            <div className="space-y-3">
              {groupMatches.map((m) => <MatchCard key={m.id} match={m} />)}
            </div>
          </motion.div>
        )}

        {/* Members */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.15 }} className="mt-5">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="font-display text-[17px] font-black">חברי הקבוצה</span>
            <span className="text-[12px] text-muted-foreground flex items-center gap-1">
              <Users size={12} /> {members.length} מוצגים
            </span>
          </div>
          <div className="bg-card border border-border rounded-3xl shadow-sm divide-y divide-border">
            {members.map((p) => (
              <div key={p.id} className="flex items-center gap-3 px-4 py-3">
                {p.avatar_url
                  ? <img src={p.avatar_url} alt={p.full_name} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
                  : <div className="w-10 h-10 rounded-full bg-brand-soft text-brand font-bold text-[12px] flex items-center justify-center">{initials(p.full_name)}</div>}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[13.5px] truncate">{p.full_name}</span>
                    {p.verified && <BadgeCheck size={14} className="text-[hsl(var(--gold-deep))]" />}
                  </div>
                </div>
                <LevelTag level={p.level} size="xs" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Group chat preview */}
        {messages.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.2 }} className="mt-5">
            <div className="font-display text-[17px] font-black mb-2.5">מהצ׳אט של הקבוצה</div>
            <div className="space-y-2">
              {messages.map((msg) => (
                <div key={msg.id} className="bg-card border border-border rounded-2xl rounded-tr-md px-3.5 py-2.5 shadow-sm">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[12px] font-bold text-brand">{msg.author}</span>
                    <span className="text-[10.5px] text-muted-foreground font-display">{msg.time}</span>
                  </div>
                  <p className="text-[13px] leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => toast('הצ׳אט המלא ייפתח בקרוב', { description: 'בינתיים אפשר לתאם דרך משחק פתוח' })}
              className="w-full mt-3 py-2.5 rounded-full bg-card border border-border text-[13px] font-bold active:scale-[0.98] transition-transform"
            >
              פתח את הצ׳אט המלא
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
