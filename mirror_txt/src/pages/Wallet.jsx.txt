import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Plus, ArrowUpFromLine, Send, Clock4, CreditCard,
  CalendarCheck, Tag, Trophy, RotateCcw,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  WALLET_PENDING, groupTransactionsByMonth, walletDayLabel, readWalletBalance,
} from '@/data/accountWallet';

const spring = { type: 'spring', stiffness: 280, damping: 26 };
const enter = (i = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { ...spring, delay: i * 0.06 },
});

const TX_META = {
  booking: { icon: CalendarCheck, label: 'הזמנה' },
  sale: { icon: Tag, label: 'מכירה' },
  tournament: { icon: Trophy, label: 'טורניר' },
  refund: { icon: RotateCcw, label: 'החזר' },
};

const QUICK_ACTIONS = [
  { id: 'topup', label: 'הטען', icon: Plus, msg: 'טעינת יתרה תהיה זמינה בקרוב' },
  { id: 'withdraw', label: 'משוך', icon: ArrowUpFromLine, msg: 'משיכה לחשבון הבנק תהיה זמינה בקרוב' },
  { id: 'transfer', label: 'העבר', icon: Send, msg: 'העברה לחבר תהיה זמינה בקרוב' },
];

export default function WalletPage() {
  const navigate = useNavigate();
  const [balance] = useState(readWalletBalance);
  const groups = groupTransactionsByMonth();

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
        <h1 className="font-display text-[22px] font-black flex-1">הארנק שלי</h1>
      </div>

      <div className="px-5 space-y-4">
        {/* Balance hero */}
        <motion.div {...enter(0)} className="bg-brand-gradient ring-gold rounded-3xl shadow-luxe p-5 relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(80% 60% at 15% 0%, hsl(41 55% 70% / 0.14) 0%, transparent 60%)' }}
          />
          <div className="relative z-10">
            <div className="text-[12px] text-white/60 mb-1">יתרה זמינה</div>
            <div className="flex items-end gap-1.5">
              <span className="font-display text-[46px] font-black leading-none text-white tabular-nums">
                ₪{balance.toLocaleString('he-IL')}
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 mt-3 rounded-full border border-[hsl(var(--gold))]/30 bg-white/5 px-3 py-1 text-[11px] font-semibold text-[hsl(var(--gold-light))]">
              <Clock4 size={11} />
              ₪{WALLET_PENDING} בדרך אליך — ממכירת מגרש
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-3 gap-2.5 mt-5">
              {QUICK_ACTIONS.map(({ id, label, icon: Icon, msg }) => (
                <button
                  key={id}
                  onClick={() => toast(msg)}
                  className="rounded-2xl bg-white/[0.08] border border-white/15 py-3 flex flex-col items-center gap-1.5 text-white active:scale-95 transition-transform"
                >
                  <Icon size={18} className="text-[hsl(var(--gold-light))]" />
                  <span className="text-[12px] font-bold">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Payment methods */}
        <motion.div {...enter(1)} className="bg-card rounded-3xl border border-border shadow-luxe p-5">
          <div className="font-display text-[18px] font-black mb-3">אמצעי תשלום</div>
          <div className="flex items-center gap-3.5 rounded-2xl bg-bgWarm border border-border px-4 py-3.5">
            <span className="w-11 h-8 rounded-lg bg-brand text-white flex items-center justify-center flex-shrink-0">
              <CreditCard size={17} />
            </span>
            <div className="flex-1">
              <div className="text-[14px] font-bold">ויזה <span dir="ltr">•••• 4242</span></div>
              <div className="text-[11.5px] text-muted-foreground">ברירת מחדל · תוקף 08/28</div>
            </div>
            <span className="text-[11px] font-bold text-brand bg-brand-softer rounded-full px-2.5 py-1">פעיל</span>
          </div>
          <button
            onClick={() => toast('הוספת אמצעי תשלום תהיה זמינה בקרוב')}
            className="w-full mt-2.5 inline-flex items-center justify-center gap-2 rounded-2xl border border-dashed border-border text-muted-foreground h-12 font-bold text-[13px] active:scale-[0.98] transition-transform"
          >
            <Plus size={15} />
            הוסף אמצעי תשלום
          </button>
        </motion.div>

        {/* Transactions */}
        <motion.div {...enter(2)}>
          <div className="font-display text-[18px] font-black mb-2.5 px-1">תנועות אחרונות</div>
          <div className="space-y-4">
            {groups.map((group, gi) => (
              <div key={group.label}>
                <div className="text-[12px] font-bold text-muted-foreground mb-2 px-1">{group.label}</div>
                <div className="bg-card rounded-3xl border border-border shadow-sm divide-y divide-border overflow-hidden">
                  {group.items.map((tx, i) => {
                    const meta = TX_META[tx.type];
                    const Icon = meta.icon;
                    const positive = tx.amount > 0;
                    return (
                      <motion.div
                        key={tx.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...spring, delay: 0.15 + (gi * 2 + i) * 0.04 }}
                        className="flex items-center gap-3 px-4 py-3.5"
                      >
                        <span className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                          positive ? 'bg-brand-softer text-brand' : 'bg-bgWarm text-muted-foreground border border-border'
                        }`}>
                          <Icon size={17} />
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="text-[13.5px] font-bold leading-tight">{tx.title}</div>
                          <div className="text-[11.5px] text-muted-foreground truncate mt-0.5">{tx.context}</div>
                        </div>
                        <div className="text-left flex-shrink-0">
                          <div className={`font-display text-[15px] font-black tabular-nums ${
                            positive ? 'text-brand' : 'text-foreground'
                          }`} dir="ltr">
                            {positive ? '+' : '-'}₪{Math.abs(tx.amount)}
                          </div>
                          <div className="text-[10.5px] text-muted-foreground mt-0.5">{walletDayLabel(tx.date)}</div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
