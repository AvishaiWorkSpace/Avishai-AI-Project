import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Phone, Loader2 } from 'lucide-react';

// Provider logos inline — no network dependency, crisp at any size.
function GoogleLogo({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

function AppleLogo({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 384 512" aria-hidden>
      <path
        fill="currentColor"
        d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"
      />
    </svg>
  );
}

const PHONE_RE = /^05\d{8}$/;
const DEMO_OTP = '123456';

export default function Login() {
  const navigate = useNavigate();
  const [step, setStep] = useState('options'); // options | phone | otp
  const [loadingProvider, setLoadingProvider] = useState(null);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState(false);
  const otpRef = useRef(null);

  useEffect(() => {
    if (step === 'otp') otpRef.current?.focus();
  }, [step]);

  const completeAuth = (method, extra = {}) => {
    localStorage.setItem('rally_auth', JSON.stringify({ method, at: Date.now(), ...extra }));
    navigate('/onboarding');
  };

  const socialLogin = method => {
    if (loadingProvider) return;
    setLoadingProvider(method);
    // Demo mode: simulate the OAuth round-trip.
    setTimeout(() => completeAuth(method), 900);
  };

  const submitOtp = value => {
    setOtp(value);
    setOtpError(false);
    if (value.length === 6) {
      if (value === DEMO_OTP) {
        completeAuth('phone', { phone });
      } else {
        setOtpError(true);
        setTimeout(() => setOtp(''), 350);
      }
    }
  };

  const phoneValid = PHONE_RE.test(phone.replace(/-/g, ''));

  return (
    <div dir="rtl" className="min-h-screen flex flex-col bg-gradient-to-b from-[hsl(var(--brand-deep))] via-[hsl(162_50%_10%)] to-[hsl(var(--brand-deep))] text-[hsl(var(--brand-foreground))]">
      {/* Court-line motif */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.07]">
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[480px] h-[760px] border-2 border-white rounded-sm" />
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[2px] h-[760px] bg-white" />
        <div className="absolute top-[400px] left-1/2 -translate-x-1/2 w-[480px] h-[2px] bg-white" />
      </div>

      <div className="relative flex-1 flex flex-col px-6 pt-20 pb-10 max-w-md w-full mx-auto">
        {/* Brand */}
        <div className="text-center mb-2">
          <div className="inline-flex items-center gap-2 text-[11px] tracking-wide bg-white/10 border border-white/15 rounded-full px-3 py-1 mb-6">
            🎾 קהילת הפאדל הישראלית
          </div>
          <h1 className="font-display text-[64px] font-black leading-none mb-3">Rally</h1>
          <p className="font-display text-[22px] font-bold text-[hsl(var(--gold-light))]">שחק. תתחבר. תשתפר.</p>
        </div>

        <AnimatePresence mode="wait">
          {step === 'options' && (
            <motion.div
              key="options"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              className="mt-auto space-y-3"
            >
              <p className="text-center text-[13px] text-white/60 mb-5">בחר איך להצטרף</p>

              <button
                onClick={() => socialLogin('google')}
                disabled={!!loadingProvider}
                className="w-full h-[54px] rounded-2xl bg-white text-[#1f1f1f] font-bold text-[15px] flex items-center justify-center gap-3 shadow-lg active:scale-[0.98] transition-transform disabled:opacity-70"
              >
                {loadingProvider === 'google' ? <Loader2 size={20} className="animate-spin" /> : <GoogleLogo />}
                המשך עם Google
              </button>

              <button
                onClick={() => socialLogin('apple')}
                disabled={!!loadingProvider}
                className="w-full h-[54px] rounded-2xl bg-black text-white font-bold text-[15px] flex items-center justify-center gap-3 border border-white/20 shadow-lg active:scale-[0.98] transition-transform disabled:opacity-70"
              >
                {loadingProvider === 'apple' ? <Loader2 size={20} className="animate-spin" /> : <AppleLogo />}
                המשך עם Apple
              </button>

              <button
                onClick={() => setStep('phone')}
                disabled={!!loadingProvider}
                className="w-full h-[54px] rounded-2xl bg-[hsl(var(--gold))] text-[hsl(var(--brand-deep))] font-bold text-[15px] flex items-center justify-center gap-3 shadow-lg active:scale-[0.98] transition-transform disabled:opacity-70"
              >
                <Phone size={19} strokeWidth={2.25} />
                המשך עם מספר טלפון
              </button>

              <p className="text-center text-[11px] text-white/40 pt-4 leading-relaxed">
                בהמשך אתה מאשר את תנאי השימוש ומדיניות הפרטיות של Rally
              </p>
            </motion.div>
          )}

          {step === 'phone' && (
            <motion.div
              key="phone"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              className="mt-auto"
            >
              <button onClick={() => setStep('options')} className="flex items-center gap-1 text-white/60 text-[13px] mb-6">
                <ArrowRight size={15} /> חזרה
              </button>
              <h2 className="font-display text-[24px] font-bold mb-1">מה המספר שלך?</h2>
              <p className="text-[13px] text-white/60 mb-6">נשלח לך קוד אימות בן 6 ספרות</p>

              <input
                type="tel"
                inputMode="numeric"
                dir="ltr"
                placeholder="050-0000000"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/[^\d-]/g, ''))}
                className="w-full h-[54px] rounded-2xl bg-white/10 border border-white/20 text-center text-[20px] font-bold tracking-widest text-white placeholder:text-white/30 focus:outline-none focus:border-[hsl(var(--gold))] mb-4"
              />

              <button
                onClick={() => setStep('otp')}
                disabled={!phoneValid}
                className="w-full h-[54px] rounded-2xl bg-[hsl(var(--gold))] text-[hsl(var(--brand-deep))] font-bold text-[15px] shadow-lg active:scale-[0.98] transition-all disabled:opacity-40"
              >
                שלח קוד
              </button>
            </motion.div>
          )}

          {step === 'otp' && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              className="mt-auto"
            >
              <button onClick={() => { setStep('phone'); setOtp(''); setOtpError(false); }} className="flex items-center gap-1 text-white/60 text-[13px] mb-6">
                <ArrowRight size={15} /> חזרה
              </button>
              <h2 className="font-display text-[24px] font-bold mb-1">הקוד בדרך אליך</h2>
              <p className="text-[13px] text-white/60 mb-6">
                שלחנו קוד ל-<span dir="ltr" className="font-bold text-white/90">{phone}</span>
                <span className="block mt-1 text-[hsl(var(--gold-light))]">(דמו: הקוד הוא {DEMO_OTP})</span>
              </p>

              {/* Hidden input drives 6 visible boxes */}
              <div className="relative mb-4" onClick={() => otpRef.current?.focus()}>
                <input
                  ref={otpRef}
                  type="tel"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={e => submitOtp(e.target.value.replace(/\D/g, ''))}
                  className="absolute inset-0 opacity-0"
                  autoComplete="one-time-code"
                />
                <motion.div
                  dir="ltr"
                  className="flex justify-center gap-2.5"
                  animate={otpError ? { x: [0, -8, 8, -6, 6, 0] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-12 h-14 rounded-xl border-2 flex items-center justify-center text-[22px] font-black transition-colors ${
                        otpError
                          ? 'border-destructive bg-destructive/10'
                          : otp.length === i
                            ? 'border-[hsl(var(--gold))] bg-white/10'
                            : 'border-white/20 bg-white/5'
                      }`}
                    >
                      {otp[i] || ''}
                    </div>
                  ))}
                </motion.div>
              </div>
              {otpError && <p className="text-center text-[13px] text-red-300">קוד שגוי — נסה שוב</p>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
