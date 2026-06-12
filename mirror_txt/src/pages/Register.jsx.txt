import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Eye, EyeOff, User, Phone, Mail, Lock } from 'lucide-react';
import RallyLogo from '@/components/RallyLogo';

const PHONE_RE = /^05\d{8}$/;

function Field({ Icon, children }) {
  return (
    <div className="flex items-center gap-3 h-[54px] rounded-2xl bg-white/10 border border-white/20 px-4 focus-within:border-[hsl(var(--gold))] transition-colors">
      <Icon size={18} className="text-white/40 flex-shrink-0" strokeWidth={2} />
      {children}
    </div>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [terms, setTerms] = useState(false);

  const valid =
    name.trim().split(' ').length >= 1 &&
    name.trim().length >= 2 &&
    PHONE_RE.test(phone.replace(/-/g, '')) &&
    password.length >= 6 &&
    terms;

  const submit = () => {
    if (!valid) return;
    localStorage.setItem('rally_auth', JSON.stringify({ method: 'register', phone, at: Date.now() }));
    const existing = JSON.parse(localStorage.getItem('rally_user') || '{}');
    localStorage.setItem('rally_user', JSON.stringify({ ...existing, full_name: name.trim() }));
    navigate('/onboarding');
  };

  return (
    <div dir="rtl" className="min-h-screen flex flex-col bg-gradient-to-b from-[hsl(var(--brand-deep))] via-[hsl(162_50%_10%)] to-[hsl(var(--brand-deep))] text-[hsl(var(--brand-foreground))]">
      {/* Court-line motif */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.07]">
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[480px] h-[760px] border-2 border-white rounded-sm" />
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[2px] h-[760px] bg-white" />
      </div>

      <div className="relative flex-1 flex flex-col px-6 pt-12 pb-10 max-w-md w-full mx-auto">
        <Link to="/login" className="flex items-center gap-1 text-white/60 text-[13px] mb-8 w-fit">
          <ArrowRight size={15} /> חזרה להתחברות
        </Link>

        <div className="text-center mb-8">
          <RallyLogo mark={56} text={20} underline={false} />
          <h1 className="font-display text-[24px] font-bold mt-4">יצירת חשבון</h1>
          <p className="text-[13px] text-white/60 mt-1">שתי דקות — ואתה על המגרש</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          className="space-y-3"
        >
          <Field Icon={User}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="שם מלא"
              className="flex-1 bg-transparent outline-none text-[15px] font-bold text-white placeholder:text-white/30"
            />
          </Field>

          <Field Icon={Phone}>
            <input
              type="tel"
              inputMode="numeric"
              dir="ltr"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^\d-]/g, ''))}
              placeholder="050-0000000"
              className="flex-1 bg-transparent outline-none text-[15px] font-bold text-white placeholder:text-white/30 text-left"
            />
          </Field>

          <Field Icon={Mail}>
            <input
              type="email"
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="אימייל (לא חובה)"
              className="flex-1 bg-transparent outline-none text-[15px] font-bold text-white placeholder:text-white/30 text-left"
            />
          </Field>

          <Field Icon={Lock}>
            <input
              type={showPass ? 'text' : 'password'}
              dir="ltr"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="סיסמה (6 תווים לפחות)"
              className="flex-1 bg-transparent outline-none text-[15px] font-bold text-white placeholder:text-white/30 text-left"
            />
            <button onClick={() => setShowPass((v) => !v)} className="text-white/40 active:scale-90">
              {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </Field>

          <button
            onClick={() => setTerms((v) => !v)}
            className="flex items-center gap-2.5 text-right py-1"
          >
            <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
              terms ? 'bg-[hsl(var(--gold))] border-[hsl(var(--gold))]' : 'border-white/30'
            }`}>
              {terms && <span className="text-[hsl(var(--brand-deep))] text-[12px] font-black leading-none">✓</span>}
            </span>
            <span className="text-[12px] text-white/60 leading-relaxed">
              אני מאשר את <span className="underline text-white/80">תנאי השימוש</span> ו<span className="underline text-white/80">מדיניות הפרטיות</span> של Rally
            </span>
          </button>

          <button
            onClick={submit}
            disabled={!valid}
            className="w-full h-[54px] rounded-2xl bg-[hsl(var(--gold))] text-[hsl(var(--brand-deep))] font-bold text-[15px] shadow-lg active:scale-[0.98] transition-all disabled:opacity-40"
          >
            צור חשבון והמשך
          </button>
        </motion.div>

        <p className="text-center text-[13px] text-white/50 mt-auto pt-8">
          כבר יש לך חשבון?{' '}
          <Link to="/login" className="text-[hsl(var(--gold-light))] font-bold">התחבר</Link>
        </p>
      </div>
    </div>
  );
}
