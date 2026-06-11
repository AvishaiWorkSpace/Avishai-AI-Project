import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Eye, EyeOff, Lock } from 'lucide-react';
import { toast } from 'sonner';
import RallyLogo from '@/components/RallyLogo';

// 0-3: empty/weak/medium/strong — length plus character variety.
function passwordStrength(pass) {
  if (!pass) return 0;
  let score = 0;
  if (pass.length >= 6) score++;
  if (pass.length >= 10) score++;
  if (/\d/.test(pass) && /[a-zA-Z]/.test(pass)) score++;
  return Math.min(3, score);
}

const STRENGTH_META = [
  { label: '', color: 'bg-white/15' },
  { label: 'חלשה', color: 'bg-destructive' },
  { label: 'בינונית', color: 'bg-[hsl(var(--gold))]' },
  { label: 'חזקה', color: 'bg-green-500' },
];

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);

  const strength = useMemo(() => passwordStrength(password), [password]);
  const mismatch = confirm.length > 0 && confirm !== password;
  const valid = strength >= 2 && password === confirm;

  const submit = () => {
    if (!valid) return;
    toast.success('הסיסמה עודכנה בהצלחה', { description: 'אפשר להתחבר עם הסיסמה החדשה' });
    navigate('/login');
  };

  return (
    <div dir="rtl" className="min-h-screen flex flex-col bg-gradient-to-b from-[hsl(var(--brand-deep))] via-[hsl(162_50%_10%)] to-[hsl(var(--brand-deep))] text-[hsl(var(--brand-foreground))]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.07]">
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[480px] h-[760px] border-2 border-white rounded-sm" />
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[2px] h-[760px] bg-white" />
      </div>

      <div className="relative flex-1 flex flex-col px-6 pt-12 pb-10 max-w-md w-full mx-auto">
        <Link to="/login" className="flex items-center gap-1 text-white/60 text-[13px] mb-8 w-fit">
          <ArrowRight size={15} /> חזרה להתחברות
        </Link>

        <div className="text-center mb-10">
          <RallyLogo mark={56} text={20} underline={false} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        >
          <h1 className="font-display text-[24px] font-bold mb-1">סיסמה חדשה</h1>
          <p className="text-[13px] text-white/60 mb-6">בחר סיסמה חזקה שתזכור — לפחות 6 תווים</p>

          {/* New password */}
          <div className="flex items-center gap-3 h-[54px] rounded-2xl bg-white/10 border border-white/20 px-4 focus-within:border-[hsl(var(--gold))] transition-colors mb-3">
            <Lock size={18} className="text-white/40 flex-shrink-0" strokeWidth={2} />
            <input
              type={show ? 'text' : 'password'}
              dir="ltr"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="סיסמה חדשה"
              className="flex-1 bg-transparent outline-none text-[15px] font-bold text-white placeholder:text-white/30 text-left"
            />
            <button onClick={() => setShow((v) => !v)} className="text-white/40 active:scale-90">
              {show ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>

          {/* Strength meter */}
          <div className="mb-4">
            <div className="flex gap-1.5 mb-1.5">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    strength >= i ? STRENGTH_META[strength].color : 'bg-white/15'
                  }`}
                />
              ))}
            </div>
            {strength > 0 && (
              <span className="text-[11.5px] text-white/60">עוצמת סיסמה: {STRENGTH_META[strength].label}</span>
            )}
          </div>

          {/* Confirm */}
          <div className={`flex items-center gap-3 h-[54px] rounded-2xl bg-white/10 border px-4 transition-colors mb-2 ${
            mismatch ? 'border-destructive' : 'border-white/20 focus-within:border-[hsl(var(--gold))]'
          }`}>
            <Lock size={18} className="text-white/40 flex-shrink-0" strokeWidth={2} />
            <input
              type={show ? 'text' : 'password'}
              dir="ltr"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="אימות סיסמה"
              className="flex-1 bg-transparent outline-none text-[15px] font-bold text-white placeholder:text-white/30 text-left"
            />
          </div>
          {mismatch && <p className="text-[12px] text-red-300 mb-2">הסיסמאות לא תואמות</p>}

          <button
            onClick={submit}
            disabled={!valid}
            className="w-full h-[54px] rounded-2xl bg-[hsl(var(--gold))] text-[hsl(var(--brand-deep))] font-bold text-[15px] shadow-lg active:scale-[0.98] transition-all disabled:opacity-40 mt-4"
          >
            עדכן סיסמה
          </button>
        </motion.div>
      </div>
    </div>
  );
}
