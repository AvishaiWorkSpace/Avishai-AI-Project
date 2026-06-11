import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, MessageCircle, Mail, Phone, ChevronDown, Check, Send } from 'lucide-react';
import { toast } from 'sonner';

const spring = { type: 'spring', stiffness: 280, damping: 26 };
const enter = (i = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { ...spring, delay: i * 0.06 },
});

const CHANNELS = [
  { id: 'whatsapp', icon: MessageCircle, label: 'WhatsApp', detail: 'מענה תוך דקות', msg: 'פותחים שיחת WhatsApp עם הצוות' },
  { id: 'mail', icon: Mail, label: 'מייל', detail: 'hello@rally.co.il', msg: 'פותחים מייל חדש לצוות Rally' },
  { id: 'phone', icon: Phone, label: 'טלפון', detail: 'א׳–ה׳ · 9:00–18:00', msg: 'מחייגים לתמיכת Rally' },
];

const SUBJECTS = ['שאלה על דירוג', 'בעיה טכנית', 'מועדונים', 'אחר'];

const FAQ = [
  {
    q: 'איך נקבעת הרמה שלי?',
    a: 'בהרשמה תענה על שאלון קצר שממקם אותך ברמה התחלתית (A1 עד מתחיל). מאותו רגע הרמה מתעדכנת אוטומטית לפי תוצאות אמיתיות במגרש ולפי משוב מהשחקנים ששיחקו איתך.',
  },
  {
    q: 'מה זה דירוג Rally?',
    a: 'מספר בין כ-1,100 ל-2,100 שמייצג את הכוח האמיתי שלך, מבוסס על מודל Glicko-2 — אותה משפחת מתמטיקה שמדרגת שחמטאים. ניצחון על חזקים מקפיץ יותר, והאמינות עולה ככל שתשחק נגד יותר יריבים שונים.',
  },
  {
    q: 'איך מוכרים מגרש?',
    a: 'נכנסים לשוק המגרשים, לוחצים "מכור מגרש שלי", בוחרים את ההזמנה ומחיר מבוקש — והמגרש מתפרסם לכל השחקנים באזור. ברגע שמישהו תופס אותו, הכסף נכנס לארנק שלך.',
  },
  {
    q: 'האם התשלום מאובטח?',
    a: 'כן. כל התשלומים עוברים סליקה מאובטחת בתקן PCI-DSS, ופרטי האשראי לעולם לא נשמרים אצלנו. הכסף ממכירת מגרש מוחזק בנאמנות עד שהמשחק מתקיים.',
  },
  {
    q: 'איך מצטרפים למשחק?',
    a: 'במסך "מצא משחק" רואים את כל המשחקים הפתוחים ברמה שלך וסביבך. בוחרים משחק, מחליקים להצטרפות — והמקום שלך. תקבל תזכורת ועדכונים בצ׳אט המשחק.',
  },
  {
    q: 'מה אם שחקן לא הגיע?',
    a: 'מדווחים על אי-הגעה בסיום המשחק. שחקן שלא מגיע בלי ביטול מראש סופג פגיעה בציון האמינות שלו, שמוצג לכל מארגן משחק. אמינות גבוהה היא נכס בקהילה.',
  },
];

export default function Contact() {
  const navigate = useNavigate();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const canSend = subject && message.trim().length >= 3;

  const submit = () => {
    if (!canSend) return;
    setSent(true);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-background max-w-md mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center active:scale-90"
        >
          <ArrowRight size={17} />
        </button>
        <h1 className="font-display text-[22px] font-black flex-1">צור קשר</h1>
      </div>

      <div className="px-5 space-y-4">
        {/* Contact channels */}
        <motion.div {...enter(0)} className="grid grid-cols-3 gap-2.5">
          {CHANNELS.map(({ id, icon: Icon, label, detail, msg }) => (
            <button
              key={id}
              onClick={() => toast(msg)}
              className="bg-card rounded-3xl border border-border shadow-sm px-3 py-4 text-center active:scale-95 transition-transform"
            >
              <span className={`w-10 h-10 rounded-2xl inline-flex items-center justify-center mb-2 ${
                id === 'whatsapp' ? 'bg-brand-soft text-brand' : 'bg-brand-softer text-brand'
              }`}>
                <Icon size={18} />
              </span>
              <div className="font-bold text-[13px]">{label}</div>
              <div className="text-[10px] text-muted-foreground leading-tight mt-1" dir={id === 'mail' ? 'ltr' : 'rtl'}>
                {detail}
              </div>
            </button>
          ))}
        </motion.div>

        {/* Message form */}
        <motion.div {...enter(1)} className="bg-card rounded-3xl border border-border shadow-luxe p-5">
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={spring}
                className="py-6 text-center"
              >
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ ...spring, delay: 0.1 }}
                  className="w-16 h-16 rounded-full bg-brand text-white inline-flex items-center justify-center mb-4 shadow-luxe"
                >
                  <Check size={30} strokeWidth={3} />
                </motion.span>
                <div className="font-display text-[20px] font-black">ההודעה נשלחה</div>
                <p className="text-[13px] text-muted-foreground mt-1.5 leading-relaxed">
                  הצוות שלנו יחזור אליך תוך יום עסקים אחד.
                </p>
                <button
                  onClick={() => { setSent(false); setSubject(''); setMessage(''); }}
                  className="mt-4 text-[13px] font-bold text-brand active:scale-95 transition-transform"
                >
                  שליחת הודעה נוספת
                </button>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }}>
                <div className="font-display text-[18px] font-black mb-1">שלח לנו הודעה</div>
                <p className="text-[12.5px] text-muted-foreground mb-4">נחזור אליך תוך יום עסקים</p>

                <label className="block text-[13px] font-bold mb-1.5">נושא הפנייה</label>
                <div className="relative mb-4">
                  <select
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className={`w-full appearance-none rounded-2xl border border-border bg-bgWarm px-4 h-12 text-[14px] outline-none focus:border-brand ${
                      subject ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    <option value="" disabled>בחר נושא</option>
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>

                <label className="block text-[13px] font-bold mb-1.5">ההודעה שלך</label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={4}
                  placeholder="ספר לנו במה נוכל לעזור..."
                  className="w-full rounded-2xl border border-border bg-bgWarm px-4 py-3 text-[14px] outline-none focus:border-brand resize-none placeholder:text-muted-foreground mb-4"
                />

                <button
                  onClick={submit}
                  disabled={!canSend}
                  className="w-full inline-flex items-center justify-center gap-2 bg-brand text-white h-12 rounded-full font-bold text-[14px] active:scale-[0.98] transition-transform disabled:opacity-40"
                >
                  <Send size={15} />
                  שלח הודעה
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* FAQ */}
        <motion.div {...enter(2)}>
          <div className="font-display text-[18px] font-black mb-2.5 px-1">שאלות נפוצות</div>
          <div className="space-y-2">
            {FAQ.map((item, i) => {
              const open = openFaq === i;
              return (
                <motion.div
                  key={item.q}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...spring, delay: 0.18 + i * 0.05 }}
                  className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="w-full flex items-center gap-3 px-4 py-3.5 text-right active:scale-[0.99] transition-transform"
                  >
                    <span className="flex-1 font-bold text-[13.5px]">{item.q}</span>
                    <motion.span animate={{ rotate: open ? 180 : 0 }} transition={spring} className="text-muted-foreground flex-shrink-0">
                      <ChevronDown size={17} />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <p className="px-4 pb-4 text-[12.5px] text-muted-foreground leading-relaxed">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
