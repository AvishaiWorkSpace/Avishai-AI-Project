import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Repeat2, BarChart2, Users, TrendingUp, BadgeCheck, Send } from 'lucide-react';
import { toast } from 'sonner';
import { FEED_POSTS, POST_TYPE_META, POST_REPLIES, TRENDS } from '@/data/socialFeed';
import { SOCIAL_GROUPS } from '@/data/socialGroups';
import { PLAYERS, DEFAULT_USER } from '@/data/mockData';
import LevelTag from '@/components/LevelTag';
import { BallIcon, TrophyIcon } from '@/components/icons';

const spring = { type: 'spring', stiffness: 280, damping: 26 };

// Local persistence — the feed remembers your activity between visits.
const LIKES_KEY = 'rally_likes';
const REPOSTS_KEY = 'rally_reposts';
const FOLLOWS_KEY = 'rally_follows';
const MY_POSTS_KEY = 'rally_my_posts';
const MY_REPLIES_KEY = 'rally_my_replies';

const readJson = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
};
const writeJson = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* demo */ }
};

// Deterministic view count per post — feels alive without a backend.
const viewsOf = (id) => {
  let h = 0;
  for (const c of String(id)) h = Math.imul(h ^ c.charCodeAt(0), 0x9e3779b1);
  return 400 + (Math.abs(h) % 4200);
};
const compact = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1).replace('.0', '')}K` : n);

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

const TABS = [
  { id: 'forYou', label: 'בשבילך' },
  { id: 'following', label: 'עוקב' },
];

export default function Community() {
  const user = { ...DEFAULT_USER, ...JSON.parse(localStorage.getItem('rally_user') || '{}') };
  const [tab, setTab] = useState('forYou');
  const [likes, setLikes] = useState(() => readJson(LIKES_KEY, {}));
  const [reposts, setReposts] = useState(() => readJson(REPOSTS_KEY, {}));
  const [follows, setFollows] = useState(() => readJson(FOLLOWS_KEY, {}));
  const [draft, setDraft] = useState('');
  const [myPosts, setMyPosts] = useState(() => readJson(MY_POSTS_KEY, []));

  const allPosts = useMemo(() => [...myPosts, ...FEED_POSTS], [myPosts]);
  const posts = useMemo(() => {
    if (tab === 'following') {
      return allPosts.filter((p) => p.mine || follows[p.author.id]);
    }
    return allPosts;
  }, [allPosts, tab, follows]);

  const toggleLike = (id) => {
    setLikes((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      writeJson(LIKES_KEY, next);
      return next;
    });
  };

  const toggleRepost = (id) => {
    setReposts((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      writeJson(REPOSTS_KEY, next);
      if (next[id]) toast.success('פורסם מחדש לעוקבים שלך');
      return next;
    });
  };

  const toggleFollow = (playerId) => {
    setFollows((prev) => {
      const next = { ...prev, [playerId]: !prev[playerId] };
      writeJson(FOLLOWS_KEY, next);
      return next;
    });
  };

  const publish = () => {
    const text = draft.trim();
    if (!text) return;
    const post = {
      id: `local_${Date.now()}`,
      type: 'tip',
      author: { id: 'me', full_name: user.full_name || 'שחקן Rally', avatar_url: user.avatar_url, level: user.level },
      time: 'עכשיו',
      text,
      likes: 0,
      comments: 0,
      mine: true,
    };
    setMyPosts((prev) => {
      const next = [post, ...prev];
      writeJson(MY_POSTS_KEY, next);
      return next;
    });
    setDraft('');
    toast.success('הפוסט פורסם לקהילה');
  };

  // Players you don't follow yet, strongest first — "who to follow".
  const suggestions = useMemo(
    () => PLAYERS.filter((p) => !follows[p.id]).sort((a, b) => b.rally_rating - a.rally_rating).slice(0, 3),
    [follows],
  );

  return (
    <div className="pb-28">
      {/* Header + X-style tabs */}
      <div className="sticky top-0 z-20 bg-bgWarm/90 backdrop-blur-md">
        <div className="px-5 pt-5 pb-1">
          <h1 className="font-display text-[24px] font-black">קהילה</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">מה קורה בסצנת הפאדל הישראלית</p>
        </div>
        <div className="grid grid-cols-2 border-b border-border mt-2">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className="relative h-11">
              <span className={`text-[14px] font-bold transition-colors ${tab === t.id ? 'text-foreground' : 'text-muted-foreground'}`}>
                {t.label}
              </span>
              {tab === t.id && (
                <motion.span
                  layoutId="communityTabLine"
                  transition={spring}
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-[3.5px] rounded-full bg-brand"
                />
              )}
            </button>
          ))}
        </div>
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
        {tab === 'following' && posts.length === 0 && (
          <div className="py-12 text-center">
            <p className="font-display text-[17px] font-black mb-1">אתה עדיין לא עוקב אחרי אף אחד</p>
            <p className="text-[13px] text-muted-foreground">עקוב אחרי שחקנים בטאב "בשבילך" — הפוסטים שלהם יופיעו כאן</p>
          </div>
        )}

        {posts.map((post, i) => (
          <div key={post.id}>
            <PostCard
              post={post}
              index={i}
              liked={!!likes[post.id]}
              reposted={!!reposts[post.id]}
              followed={!!follows[post.author.id]}
              onLike={() => toggleLike(post.id)}
              onRepost={() => toggleRepost(post.id)}
              onFollow={() => toggleFollow(post.author.id)}
            />
            {/* X-style interleaved blocks */}
            {tab === 'forYou' && i === 1 && <TrendsCard />}
            {tab === 'forYou' && i === 4 && suggestions.length > 0 && (
              <WhoToFollowCard suggestions={suggestions} follows={follows} onFollow={toggleFollow} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Post card — actions: reply (thread), repost, like, views, share
// ---------------------------------------------------------------------------
function PostCard({ post, index, liked, reposted, followed, onLike, onRepost, onFollow }) {
  const navigate = useNavigate();
  const [threadOpen, setThreadOpen] = useState(false);
  const [reply, setReply] = useState('');
  const [myReplies, setMyReplies] = useState(() => readReplies(post.id));
  const meta = POST_TYPE_META[post.type];
  const baseReplies = POST_REPLIES[post.id] || [];
  const replyCount = (post.comments || 0) + myReplies.length;

  const sendReply = () => {
    const text = reply.trim();
    if (!text) return;
    const user = { ...DEFAULT_USER, ...JSON.parse(localStorage.getItem('rally_user') || '{}') };
    const r = { id: `myr_${Date.now()}`, author: { full_name: user.full_name, avatar_url: user.avatar_url }, time: 'עכשיו', text };
    setMyReplies((prev) => {
      const next = [...prev, r];
      persistReplies(post.id, next);
      return next;
    });
    setReply('');
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...spring, delay: Math.min(index, 6) * 0.05 }}
      className="bg-card border border-border rounded-3xl p-4 shadow-sm"
    >
      {/* Author row */}
      <div className="flex items-center gap-3 mb-2.5">
        <Avatar player={post.author} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[14px] truncate">{post.author.full_name}</span>
            {post.author.verified && <BadgeCheck size={14} className="text-brand flex-shrink-0" fill="hsl(var(--brand-soft))" />}
            {post.author.level && <LevelTag level={post.author.level} size="xs" />}
          </div>
          <span className="text-[11px] text-muted-foreground">
            {post.time}
            {meta && <span className="font-bold text-brand"> · {meta.label}</span>}
          </span>
        </div>
        {!post.mine && post.author.id && (
          <button
            onClick={onFollow}
            className={`text-[11.5px] font-bold px-3 py-1.5 rounded-full border transition-colors active:scale-95 ${
              followed ? 'bg-card text-muted-foreground border-border' : 'bg-foreground text-background border-foreground'
            }`}
          >
            {followed ? 'עוקב' : 'עקוב'}
          </button>
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

      {/* Actions — X order, RTL */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border max-w-[300px]">
        <ActionButton
          Icon={MessageCircle}
          count={replyCount}
          active={threadOpen}
          activeClass="text-brand"
          onClick={() => setThreadOpen((v) => !v)}
        />
        <ActionButton
          Icon={Repeat2}
          count={(post.reposts || Math.floor((post.likes || 0) / 3)) + (reposted ? 1 : 0)}
          active={reposted}
          activeClass="text-brand"
          onClick={onRepost}
        />
        <ActionButton
          Icon={Heart}
          count={(post.likes || 0) + (liked ? 1 : 0)}
          active={liked}
          activeClass="text-[hsl(var(--gold-deep))]"
          fill={liked ? 'hsl(var(--gold))' : 'none'}
          onClick={onLike}
        />
        <span className="flex items-center gap-1 text-muted-foreground">
          <BarChart2 size={16} strokeWidth={2} />
          <span className="text-[12px] font-bold">{compact(viewsOf(post.id))}</span>
        </span>
        <button
          onClick={() => toast('הקישור הועתק', { description: 'שתף את הפוסט עם חברים' })}
          className="text-muted-foreground active:scale-90 transition-transform"
        >
          <Share2 size={16} strokeWidth={2} />
        </button>
      </div>

      {/* Thread */}
      <AnimatePresence>
        {threadOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t border-border space-y-3">
              {[...baseReplies, ...myReplies].map((r) => (
                <div key={r.id} className="flex items-start gap-2.5">
                  <Avatar player={r.author} size="w-8 h-8" />
                  <div className="flex-1 bg-bgWarm rounded-2xl rounded-tr-md px-3.5 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[12.5px] font-bold">{r.author.full_name}</span>
                      <span className="text-[10.5px] text-muted-foreground">{r.time}</span>
                    </div>
                    <p className="text-[13px] leading-relaxed mt-0.5">{r.text}</p>
                  </div>
                </div>
              ))}
              {baseReplies.length + myReplies.length === 0 && (
                <p className="text-[12.5px] text-muted-foreground text-center py-1">עדיין אין תגובות — היה הראשון</p>
              )}
              <div className="flex items-center gap-2">
                <input
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendReply()}
                  placeholder="כתוב תגובה…"
                  className="flex-1 bg-bgWarm border border-border rounded-full px-4 h-10 text-[13px] outline-none focus:border-brand"
                />
                <button
                  onClick={sendReply}
                  disabled={!reply.trim()}
                  className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center active:scale-90 transition-transform disabled:opacity-40"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

function ActionButton({ Icon, count, active, activeClass, fill = 'none', onClick }) {
  return (
    <button onClick={onClick} className="flex items-center gap-1 active:scale-90 transition-transform">
      <Icon size={16} strokeWidth={2} className={active ? activeClass : 'text-muted-foreground'} fill={fill} />
      <span className={`text-[12px] font-bold ${active ? activeClass : 'text-muted-foreground'}`}>{count}</span>
    </button>
  );
}

function readReplies(postId) {
  return readJson(MY_REPLIES_KEY, {})[postId] || [];
}
function persistReplies(postId, replies) {
  const all = readJson(MY_REPLIES_KEY, {});
  writeJson(MY_REPLIES_KEY, { ...all, [postId]: replies });
}

// ---------------------------------------------------------------------------
// "מה קורה בפאדל" — trending block
// ---------------------------------------------------------------------------
function TrendsCard() {
  const navigate = useNavigate();
  return (
    <div className="mt-3 bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
      <div className="flex items-center gap-2 px-4 pt-4 pb-1">
        <TrendingUp size={16} className="text-brand" />
        <h3 className="font-display text-[16px] font-black">מה קורה בפאדל</h3>
      </div>
      {TRENDS.map((t, i) => (
        <button
          key={t.id}
          onClick={() => navigate(t.to)}
          className={`w-full text-right px-4 py-3 active:bg-bgWarm transition-colors ${i > 0 ? 'border-t border-border/60' : ''}`}
        >
          <span className="block text-[10.5px] text-muted-foreground">{t.category}</span>
          <span className="block text-[14px] font-bold mt-0.5">{t.tag}</span>
          <span className="block text-[11px] text-muted-foreground mt-0.5">{compact(t.posts)} פוסטים</span>
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// "מי לעקוב" — follow suggestions
// ---------------------------------------------------------------------------
function WhoToFollowCard({ suggestions, follows, onFollow }) {
  return (
    <div className="mt-3 bg-card border border-border rounded-3xl p-4 shadow-sm">
      <h3 className="font-display text-[16px] font-black mb-3">מי לעקוב</h3>
      <div className="space-y-3">
        {suggestions.map((p) => (
          <div key={p.id} className="flex items-center gap-3">
            <Avatar player={p} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[13.5px] truncate">{p.full_name}</span>
                {p.verified && <BadgeCheck size={13} className="text-brand flex-shrink-0" fill="hsl(var(--brand-soft))" />}
              </div>
              <span className="text-[11px] text-muted-foreground">{p.level} · {p.city} · {p.games_played} משחקים</span>
            </div>
            <button
              onClick={() => onFollow(p.id)}
              className={`text-[11.5px] font-bold px-3.5 py-1.5 rounded-full border transition-colors active:scale-95 ${
                follows[p.id] ? 'bg-card text-muted-foreground border-border' : 'bg-foreground text-background border-foreground'
              }`}
            >
              {follows[p.id] ? 'עוקב' : 'עקוב'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
