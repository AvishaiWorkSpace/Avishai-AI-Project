import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import RallyLogo from '@/components/RallyLogo';

const PHONE_RE = /^05\d{8}$/;
const DEMO_OTP = '123456';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState('phone'); // phone | code
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState(false);
  const codeRef = useRef(null);

  useEffect(() => {
    if (step === 'code') codeRef.current?.focus();
  }, [step]);

  const phoneValid = PHONE_RE.test(phone.replace(/-/g, ''));

  const submitCode = (value) => {
    setCode(value);
    setCodeError(false);
    if (value.length === 6) {
      if (value === DEMO_OTP) {
        navigate('/reset-password');
      } else {
        setCodeError(true);
        setTimeout(() => setCode(''), 350);
      }
    }
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

        <AnimatePresence mode="wait">
          {step === 'phone' && (
            <motion.div
              key="phone"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            >
              <h1 className="font-display text-[24px] font-bold mb-1">שכחת סיסמה?</h1>
              <p className="text-[13px] text-white/60 mb-6">
                הזן את מספר הטלפון שלך ונשלח קוד לאיפוס הסיסמה
              </p>

              <input
                type="tel"
                inputMode="numeric"
                dir="ltr"
                placeholder="050-0000000"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^\d-]/g, ''))}
                className="w-full h-[54px] rounded-2xl bg-white/10 border border-white/20 text-center text-[20px] font-bold tracking-widest text-white placeholder:text-white/30 focus:outline-none focus:border-[hsl(var(--gold))] mb-4"
              />

              <button
                onClick={() => setStep('code')}
                disabled={!phoneValid}
                className="w-full h-[54px] rounded-2xl bg-[hsl(var(--gold))] text-[hsl(var(--brand-deep))] font-bold text-[15px] shadow-lg active:scale-[0.98] transition-all disabled:opacity-40"
              >
                שלח קוד איפוס
              </button>
            </motion.div>
          )}

          {step === 'code' && (
            <motion.div
              key="code"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            >
              <button onClick={() => { setStep('phone'); setCode(''); setCodeError(false); }} className="flex items-center gap-1 text-white/60 text-[13px] mb-6">
                <ArrowRight size={15} /> חזרה
              </button>
              <h1 className="font-display text-[24px] font-bold mb-1">שלחנו לך קוד</h1>
              <p className="text-[13px] text-white/60 mb-6">
                הקוד נשלח ל-<span dir="ltr" className="font-bold text-white/90">{phone}</span>
                <span className="block mt-1 text-[hsl(var(--gold-light))]">(דמו: הקוד הוא {DEMO_OTP})</span>
              </p>

              <div className="relative mb-4" onClick={() => codeRef.current?.focus()}>
                <input
                  ref={codeRef}
                  type="tel"
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  onChange={(e) => submitCode(e.target.value.replace(/\D/g, ''))}
                  className="absolute inset-0 opacity-0"
                  autoComplete="one-time-code"
                />
                <motion.div
                  dir="ltr"
                  className="flex justify-center gap-2.5"
                  animate={codeError ? { x: [0, -8, 8, -6, 6, 0] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-12 h-14 rounded-xl border-2 flex items-center justify-center text-[22px] font-black transition-colors ${
                        codeError
                          ? 'border-destructive bg-destructive/10'
                          : code.length === i
                            ? 'border-[hsl(var(--gold))] bg-white/10'
                            : 'border-white/20 bg-white/5'
                      }`}
                    >
                      {code[i] || ''}
                    </div>
                  ))}
                </motion.div>
              </div>
              {codeError && <p className="text-center text-[13px] text-red-300">קוד שגוי — נסה שוב</p>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
