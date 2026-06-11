import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, Users, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { FEED_POSTS, POST_TYPE_META } from '@/data/socialFeed';
import { SOCIAL_GROUPS } from '@/data/socialGroups';
import { DEFAULT_USER } from '@/data/mockData';
import LevelTag from '@/components/LevelTag';
import { BallIcon, TrophyIcon } from '@/components/icons';

const spring = { type: 'spring', stiffness: 280, damping: 26 };
const LIKES_KEY = 'rally_likes';

const readLikes = () => {
  try { return JSON.parse(localStorage.getItem(LIKES_KEY) || '{}'); } catch { return {}; }
};

function initials(name = '') {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('');
}

function Avatar({ player, size = 'w-10 h-10' }) {
  if (player?.avatar_url) {
    return <img src={player.avatar_url} alt={player.full_name} className={`${size} rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0`} />;
  }
  return (
    <div className={`${size} rounded-full bg-brand-soft text-brand font-bold text-[13px] flex items-center justify-center flex-shrink-0`}>
      {initials(player?.full_name)}
    </div>
  );
}

const HIGHLIGHTS = [
  { label: 'קבוצות', sub: `${SOCIAL_GROUPS.length} פעילות`, to: '/groups', Icon: Users },
  { label: 'מועדונים', sub: 'מצא ליד הבית', to: '/clubs', Icon: BallIcon },
  { label: 'טורנירים', sub: 'ההרשמה פתוחה', to: '/tournaments', Icon: TrophyIcon },
];

export default function Community() {
  const navigate = useNavigate();
  const user = { ...DEFAULT_USER, ...JSON.parse(localStorage.getItem('rally_user') || '{}') };
  const [likes, setLikes] = useState(readLikes);
  const [draft, setDraft] = useState('');
  const [localPosts, setLocalPosts] = useState([]);

  const posts = useMemo(() => [...localPosts, ...FEED_POSTS], [localPosts]);

  const toggleLike = (id) => {
    setLikes((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try { localStorage.setItem(LIKES_KEY, JSON.stringify(next)); } catch { /* demo */ }
      return next;
    });
  };

  const publish = () => {
    const text = draft.trim();
    if (!text) return;
    setLocalPosts((prev) => [{
      id: `local_${Date.now()}`,
      type: 'tip',
      author: { full_name: user.full_name || 'שחקן Rally', avatar_url: user.avatar_url, level: user.level },
      time: 'עכשיו',
      text,
      likes: 0,
      comments: 0,
      mine: true,
    }, ...prev]);
    setDraft('');
    toast.success('הפוסט פורסם לקהילה');
  };

  return (
    <div className="pb-28">
      {/* Header */}
      <div className="px-5 pt-5 pb-1">
        <h1 className="font-display text-[24px] font-black">קהילה</h1>
        <p className="text-[13px] text-muted-foreground mt-0.5">מה קורה בסצנת הפאדל הישראלית</p>
      </div>

      {/* Highlights */}
      <div className="flex gap-2.5 px-5 mt-3.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {HIGHLIGHTS.map(({ label, sub, to, Icon }) => (
          <Link key={to} to={to}
            className="flex-shrink-0 flex items-center gap-2.5 bg-card border border-border rounded-2xl px-3.5 py-2.5 shadow-sm active:scale-95 transition-transform">
            <span className="w-9 h-9 rounded-xl bg-brand-softer text-brand flex items-center justify-center">
              <Icon size={17} strokeWidth={1.8} />
            </span>
            <span>
              <span className="block text-[13px] font-bold leading-tight">{label}</span>
              <span className="block text-[11px] text-muted-foreground">{sub}</span>
            </span>
          </Link>
        ))}
      </div>

      {/* Composer */}
      <div className="mx-5 mt-4 bg-card border border-border rounded-3xl p-3.5 shadow-sm">
        <div className="flex items-center gap-3">
          <Avatar player={user} />
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && publish()}
            placeholder="מה קורה במגרש?"
            className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-muted-foreground"
          />
          <button
            onClick={publish}
            disabled={!draft.trim()}
            className={`px-3.5 py-1.5 rounded-full text-[13px] font-bold transition-all active:scale-95 ${
              draft.trim() ? 'bg-brand text-white' : 'bg-muted text-muted-foreground'
            }`}
          >
            פרסם
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="px-5 mt-4 space-y-3">
        {posts.map((post, i) => {
          const liked = !!likes[post.id];
          const meta = POST_TYPE_META[post.type];
          return (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: Math.min(i, 6) * 0.05 }}
              className="bg-card border border-border rounded-3xl p-4 shadow-sm"
            >
              {/* Author row */}
              <div className="flex items-center gap-3 mb-2.5">
                <Avatar player={post.author} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[14px] truncate">{post.author.full_name}</span>
                    {post.author.level && <LevelTag level={post.author.level} size="xs" />}
                  </div>
                  <span className="text-[11px] text-muted-foreground">{post.time}</span>
                </div>
                {meta && (
                  <span className={`text-[10.5px] font-bold px-2.5 py-1 rounded-full ${
                    post.type === 'looking' ? 'bg-gold-soft text-[#8a6d3b]' : 'bg-brand-softer text-brand'
                  }`}>
                    {meta.label}
                  </span>
                )}
              </div>

              {/* Body */}
              <p className="text-[13.5px] leading-relaxed">{post.text}</p>

              {/* Score chips */}
              {post.score && (
                <div className="flex gap-1.5 mt-2.5">
                  {post.score.map((s) => (
                    <span key={s} className="font-display text-[12px] font-black bg-bgWarm rounded-lg px-2.5 py-1">{s}</span>
                  ))}
                </div>
              )}

              {/* Image */}
              {post.image && (
                <div className="mt-3 rounded-2xl overflow-hidden border border-border">
                  <img src={post.image} alt="" className="w-full h-44 object-cover" />
                </div>
              )}

              {/* Looking CTA */}
              {post.type === 'looking' && (
                <button
                  onClick={() => navigate('/find')}
                  className="mt-3 w-full py-2.5 rounded-full bg-brand text-white text-[13px] font-bold active:scale-[0.98] transition-transform"
                >
                  אני בפנים — תפוס מקום
                </button>
              )}

              {/* Actions */}
              <div className="flex items-center gap-5 mt-3 pt-3 border-t border-border">
                <button onClick={() => toggleLike(post.id)} className="flex items-center gap-1.5 active:scale-90 transition-transform">
                  <Heart
                    size={17}
                    strokeWidth={2}
                    className={liked ? 'text-[hsl(var(--gold-deep))]' : 'text-muted-foreground'}
                    fill={liked ? 'hsl(var(--gold))' : 'none'}
                  />
                  <span className={`text-[12.5px] font-bold ${liked ? 'text-[hsl(var(--gold-deep))]' : 'text-muted-foreground'}`}>
                    {(post.likes || 0) + (liked ? 1 : 0)}
                  </span>
                </button>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <MessageCircle size={16} strokeWidth={2} />
                  <span className="text-[12.5px] font-bold">{post.comments}</span>
                </span>
                <button
                  onClick={() => toast('הקישור הועתק', { description: 'שתף את הפוסט עם חברים' })}
                  className="mr-auto text-muted-foreground active:scale-90 transition-transform"
                >
                  <Share2 size={16} strokeWidth={2} />
                </button>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
