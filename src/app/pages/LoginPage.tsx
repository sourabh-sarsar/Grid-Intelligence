import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Eye, EyeOff, Mail, Lock, User, Phone, MapPin, Briefcase,
  ArrowRight, ArrowLeft, Shield, Zap, Activity, BarChart2, TrendingUp,
  CheckCircle, AlertTriangle, ChevronDown, Search, Copy, Check,
} from 'lucide-react';
import { toast } from 'sonner';
import { useTheme, getPrimaryBg, getSecondaryBg } from '../context/ThemeContext';
import Subtract from '../../imports/Subtract';
import { UXResearchPortal } from './uxresearch/UXResearchPortal';

const VALID_EMAIL    = 'sourabhsarsar@discom.com';
const VALID_PASSWORD = '123456';

const AOR_ZONES = [
  'Zone A – Sector 10–18, Noida',
  'Zone B – Sector 37–62, Noida',
  'Zone C – Sector 100–137, Noida',
  'Zone D – Greater Noida West',
  'Zone E – Greater Noida East (Dadri)',
  'All Zones – DISCOM HQ',
];

const DESIGNATIONS = [
  'Executive Engineer',
  'Assistant Executive Engineer',
  'Junior Engineer',
  'Sub-Divisional Officer',
  'Divisional Engineer',
  'Superintending Engineer',
  'Chief Engineer',
  'DISCOM Administrator',
  'Energy Analyst',
  'Field Technician',
  'IT / Data Team',
];

const FEATURES = [
  { Icon: Activity,   text: 'Real-time SCADA & load monitoring' },
  { Icon: Zap,        text: 'Smart grid asset management' },
  { Icon: BarChart2,  text: 'Revenue, billing & AT&C analytics' },
  { Icon: TrendingUp, text: 'AI-powered demand forecasting' },
];

type ErrorType = null | 'wrong_password' | 'no_access';

interface LoginPageProps { onLogin: () => void; }

export function LoginPage({ onLogin }: LoginPageProps) {
  const { settings } = useTheme();
  const ff     = `var(--md-font-family, ${settings.fontFamily})`;
  const isDark = settings.darkMode;
  const pri    = settings.primaryColor;

  // Login form state
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [logging,  setLogging]  = useState(false);
  const [error,    setError]    = useState<ErrorType>(null);
  const [shake,    setShake]    = useState(false);
  const [showCredHint, setShowCredHint] = useState(false);
  const [copiedField, setCopiedField] = useState<'email' | 'password' | null>(null);
  const credHintRef = useRef<HTMLSpanElement>(null);

  function copyToClipboard(text: string, field: 'email' | 'password') {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          setCopiedField(field);
          setTimeout(() => setCopiedField(null), 2000);
        }).catch(() => fallbackCopy(text, field));
      } else {
        fallbackCopy(text, field);
      }
    } catch {
      fallbackCopy(text, field);
    }
  }

  function fallbackCopy(text: string, field: 'email' | 'password') {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand('copy');
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // silent fail
    } finally {
      document.body.removeChild(ta);
    }
  }

  // Register form state
  const [showRegister, setShowRegister] = useState(false);
  const [regEmail,     setRegEmail]     = useState('');
  const [regName,      setRegName]      = useState('');
  const [regMobile,    setRegMobile]    = useState('');
  const [regZone,      setRegZone]      = useState('');
  const [regDesg,      setRegDesg]      = useState('');
  const [submitting,   setSubmitting]   = useState(false);

  // Research portal state
  const [researchOpen, setResearchOpen] = useState(false);

  // Custom dropdown state
  const [zoneOpen, setZoneOpen] = useState(false);
  const [desgOpen, setDesgOpen] = useState(false);
  const zoneRef = useRef<HTMLDivElement>(null);
  const desgRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (zoneRef.current && !zoneRef.current.contains(e.target as Node)) setZoneOpen(false);
      if (desgRef.current && !desgRef.current.contains(e.target as Node)) setDesgOpen(false);
      if (credHintRef.current && !credHintRef.current.contains(e.target as Node)) setShowCredHint(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Colors
  const formBg   = isDark ? '#141414' : '#f0f4fc';
  const cardBg   = isDark ? '#1e1e1e' : '#ffffff';
  const border   = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(21,101,192,0.12)';
  const textMain = isDark ? '#e0e0e0' : '#1a1a2e';
  const textMuted= isDark ? '#78909c' : '#546e7a';
  const inputBg  = isDark ? 'rgba(255,255,255,0.05)' : '#f8faff';
  const leftBg   = getPrimaryBg(settings, '145deg');

  function triggerShake() {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLogging(true);
    setTimeout(() => {
      setLogging(false);
      const emailMatch = email.trim().toLowerCase() === VALID_EMAIL;
      if (!emailMatch) { setError('no_access'); triggerShake(); return; }
      if (password !== VALID_PASSWORD) { setError('wrong_password'); triggerShake(); return; }
      toast.success('Welcome back, Sourabh!', { description: 'Signed in to Grid Intelligence Platform' });
      onLogin();
    }, 1200);
  }

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!regEmail || !regName || !regMobile || !regZone || !regDesg) {
      toast.error('Please fill all fields'); return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setShowRegister(false);
      setRegEmail(''); setRegName(''); setRegMobile(''); setRegZone(''); setRegDesg('');
      toast.success('Registration request sent', {
        description: `Your access request has been submitted. Our team will respond to ${regEmail} within 24 hours.`,
        duration: 8000,
      });
    }, 1400);
  }

  const errorMessages: Record<NonNullable<ErrorType>, string> = {
    wrong_password: 'Incorrect password. Please try again.',
    no_access:      "Email not recognized or you don't have system access. Please request to register.",
  };

  // Slide direction: login exits left, register enters from right (and vice-versa)
  const loginVariants = {
    initial: { x: -60, opacity: 0 },
    animate: { x: 0,   opacity: 1 },
    exit:    { x: -80, opacity: 0 },
  };
  const registerVariants = {
    initial: { x: 80,  opacity: 0 },
    animate: { x: 0,   opacity: 1 },
    exit:    { x: 80,  opacity: 0 },
  };
  const slideTransition = { type: 'spring' as const, stiffness: 340, damping: 32 };

  return (
    <div className="w-screen h-screen flex overflow-hidden" style={{ fontFamily: ff }}>

      {/* ── Left hero panel ─────────────────────────────────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between shrink-0"
        style={{ width: '42%', background: leftBg, padding: '48px 44px', position: 'relative', overflow: 'hidden' }}
      >
        {/* Background grid */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.07,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '32px 32px' }} />

        {/* Blobs */}
        <div style={{ position: 'absolute', width: 360, height: 360, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', top: -100, right: -120 }} />
        <div style={{ position: 'absolute', width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', bottom: 80, left: -80 }} />

        {/* Logo + brand */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ position: 'relative', zIndex: 1 }}>
          <div className="flex items-center gap-3 mb-8">
            <div style={{ width: 42, height: 48, flexShrink: 0, filter: 'drop-shadow(0 2px 12px rgba(0,0,0,0.3))' }}>
              <Subtract />
            </div>
            <div>
              <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.01em', lineHeight: 1 }}>SOURABH</div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 2 }}>Grid Intelligence Platform</div>
            </div>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.2, marginBottom: 12 }}>
            Power your grid<br />
            <span style={{ color: 'rgba(255,255,255,0.75)' }}>with intelligence.</span>
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, maxWidth: 340 }}>
            Noida DISCOM's unified platform for real-time grid operations, revenue management, and smart analytics.
          </p>
        </motion.div>

        {/* Features */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col gap-3" style={{ position: 'relative', zIndex: 1 }}>
          {FEATURES.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.08 }}
              className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
                <f.Icon size={15} style={{ color: '#ffffff' }} />
              </div>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>{f.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="flex items-center gap-6" style={{ position: 'relative', zIndex: 1 }}>
          {[
            { val: '1,36,000+', label: 'Consumers' },
            { val: '487 MW',    label: 'Live Load' },
            { val: '5 Zones',   label: 'Coverage' },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>{s.val}</div>
              <div style={{ fontSize: '0.63rem', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
            </div>
          ))}
        </motion.div>

        <div style={{ fontSize: '0.625rem', color: 'rgba(255,255,255,0.35)', position: 'relative', zIndex: 1 }}>
          © 2026 Sourabh · Noida DISCOM · All rights reserved
        </div>
      </div>

      {/* ── Right form panel ────────────────────────────────────────────── */}
      {/* overflow: hidden clips the horizontal slide animations */}
      <div
        className="flex-1 flex flex-col items-center justify-center"
        style={{ background: formBg, overflow: 'hidden', position: 'relative' }}
      >
        {/* Mobile logo — static, outside the sliding area */}
        <div className="flex lg:hidden items-center gap-2.5 mb-8">
          <div style={{ width: 32, height: 36 }}>
            <Subtract />
          </div>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: textMain, lineHeight: 1 }}>SOURABH</div>
            <div style={{ fontSize: '0.625rem', color: textMuted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Grid Intelligence Platform</div>
          </div>
        </div>

        {/* Sliding form container */}
        <div style={{ width: '100%', maxWidth: 420, padding: '0 24px', overflowY: 'auto', maxHeight: '100vh' }}>
          <AnimatePresence mode="wait" initial={false}>

            {/* ── LOGIN VIEW ── */}
            {!showRegister && (
              <motion.div
                key="login"
                variants={loginVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={slideTransition}
              >
                {/* Heading */}
                <div className="mb-8">
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: textMain, lineHeight: 1.2, marginBottom: 6 }}>Welcome back</h2>
                  <p style={{ fontSize: '0.78rem', color: textMuted }}>Sign in to your Grid Intelligence Platform account</p>
                </div>

                {/* Error banner */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -8, height: 0 }} transition={{ duration: 0.2 }}
                      className="flex items-start gap-2.5 rounded-2xl p-3.5 mb-4"
                      style={{ background: '#FFEBEE', border: '1px solid #EF535030' }}
                    >
                      <AlertTriangle size={15} style={{ color: '#C62828', flexShrink: 0, marginTop: 1 }} />
                      <div>
                        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#C62828', marginBottom: 2 }}>
                          {error === 'wrong_password' ? 'Incorrect password' : 'Access denied'}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#B71C1C', lineHeight: 1.5 }}>{errorMessages[error]}</div>
                        {error === 'no_access' && (
                          <button onClick={() => { setError(null); setShowRegister(true); }}
                            className="mt-1.5 flex items-center gap-1"
                            style={{ fontSize: '0.68rem', fontWeight: 700, color: pri }}>
                            Request to Register <ArrowRight size={11} />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Login form */}
                <motion.form
                  onSubmit={handleLogin}
                  animate={shake ? { x: [-8, 8, -6, 6, -3, 3, 0] } : { x: 0 }}
                  transition={{ duration: 0.45 }}
                  className="flex flex-col gap-4"
                >
                  {/* Email */}
                  <div>
                    <div className="flex items-center gap-1.5" style={{ marginBottom: 6 }}>
                      <label style={{ fontSize: '0.68rem', fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Email Address
                      </label>
                      <span
                        ref={credHintRef}
                        className="relative inline-flex items-center justify-center w-4 h-4 rounded-full cursor-pointer select-none"
                        style={{ background: `${pri}18`, border: `1px solid ${pri}30`, fontSize: '0.625rem', fontWeight: 800, color: pri, lineHeight: 1 }}
                        onMouseDown={e => e.stopPropagation()}
                        onClick={() => setShowCredHint(v => !v)}
                        title="Show demo credentials"
                      >i
                        {showCredHint && (
                          <div
                            className="absolute left-6 top-0 z-50 rounded-2xl shadow-xl p-3 flex flex-col gap-1.5"
                            style={{ width: 230, background: isDark ? '#1e1e1e' : '#fff', border: `1.5px solid ${pri}30`, fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}
                            onMouseDown={e => e.stopPropagation()}
                            onClick={e => e.stopPropagation()}
                          >
                            <div className="flex items-center gap-1.5 mb-1">
                              <div className="w-4 h-4 rounded-lg flex items-center justify-center" style={{ background: `${pri}18` }}>
                                <Mail size={10} style={{ color: pri }} />
                              </div>
                              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: pri }}>Demo Credentials</span>
                            </div>
                            <div className="rounded-xl p-2 flex flex-col gap-2" style={{ background: isDark ? 'rgba(255,255,255,0.04)' : `${pri}08` }}>
                              {/* Email row */}
                              <div className="flex items-center justify-between gap-2">
                                <div className="min-w-0">
                                  <span style={{ fontSize: '0.625rem', color: textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email address</span>
                                  <div style={{ fontSize: '0.68rem', fontWeight: 600, color: textMain, marginTop: 1, wordBreak: 'break-all' }}>sourabhsarsar@discom.com</div>
                                </div>
                                <button
                                  type="button"
                                  onMouseDown={e => { e.preventDefault(); e.stopPropagation(); }}
                                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); copyToClipboard('sourabhsarsar@discom.com', 'email'); }}
                                  className="shrink-0 flex items-center justify-center w-6 h-6 rounded-lg transition-colors"
                                  style={{ background: copiedField === 'email' ? `${pri}20` : `${pri}10`, border: `1px solid ${pri}20`, color: copiedField === 'email' ? pri : textMuted, cursor: 'pointer' }}
                                  title="Copy email"
                                >
                                  {copiedField === 'email' ? <Check size={10} /> : <Copy size={10} />}
                                </button>
                              </div>
                              <div style={{ height: 1, background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }} />
                              {/* Password row */}
                              <div className="flex items-center justify-between gap-2">
                                <div className="min-w-0">
                                  <span style={{ fontSize: '0.625rem', color: textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</span>
                                  <div style={{ fontSize: '0.68rem', fontWeight: 600, color: textMain, marginTop: 1 }}>123456</div>
                                </div>
                                <button
                                  type="button"
                                  onMouseDown={e => { e.preventDefault(); e.stopPropagation(); }}
                                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); copyToClipboard('123456', 'password'); }}
                                  className="shrink-0 flex items-center justify-center w-6 h-6 rounded-lg transition-colors"
                                  style={{ background: copiedField === 'password' ? `${pri}20` : `${pri}10`, border: `1px solid ${pri}20`, color: copiedField === 'password' ? pri : textMuted, cursor: 'pointer' }}
                                  title="Copy password"
                                >
                                  {copiedField === 'password' ? <Check size={10} /> : <Copy size={10} />}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-2xl"
                      style={{ background: inputBg, border: `1.5px solid ${email ? pri + '40' : border}`, transition: 'border-color 0.2s' }}>
                      <Mail size={15} style={{ color: email ? pri : textMuted, flexShrink: 0, transition: 'color 0.2s' }} />
                      <input
                        type="email" value={email} onChange={e => { setEmail(e.target.value); setError(null); }}
                        placeholder="your.name@discom.com"
                        className="flex-1 bg-transparent outline-none"
                        style={{ fontSize: '0.82rem', color: textMain, fontFamily: ff }}
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label style={{ fontSize: '0.68rem', fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>
                      Password
                    </label>
                    <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-2xl"
                      style={{ background: inputBg, border: `1.5px solid ${password ? pri + '40' : border}`, transition: 'border-color 0.2s' }}>
                      <Lock size={15} style={{ color: password ? pri : textMuted, flexShrink: 0, transition: 'color 0.2s' }} />
                      <input
                        type={showPw ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); setError(null); }}
                        placeholder="Enter your password"
                        className="flex-1 bg-transparent outline-none"
                        style={{ fontSize: '0.82rem', color: textMain, fontFamily: ff }}
                        autoComplete="current-password"
                      />
                      <button type="button" onClick={() => setShowPw(p => !p)} style={{ color: textMuted, display: 'flex' }}>
                        {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  {/* Sign in button */}
                  <motion.button
                    type="submit" disabled={logging || !email || !password}
                    whileHover={!logging ? { scale: 1.02 } : {}} whileTap={!logging ? { scale: 0.98 } : {}}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl"
                    style={{
                      background: (!email || !password) ? (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)') : getPrimaryBg(settings),
                      color: (!email || !password) ? textMuted : '#ffffff',
                      fontSize: '0.85rem', fontWeight: 700, fontFamily: ff,
                      cursor: logging || !email || !password ? 'not-allowed' : 'pointer',
                      transition: 'background 0.2s',
                    }}
                  >
                    {logging ? (
                      <>
                        <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} style={{ display: 'flex' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                        </motion.span>
                        Signing in…
                      </>
                    ) : (
                      <> Sign In <ArrowRight size={16} /> </>
                    )}
                  </motion.button>
                </motion.form>

                {/* Divider */}
                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px" style={{ background: border }} />
                  <span style={{ fontSize: '0.65rem', color: textMuted }}>or</span>
                  <div className="flex-1 h-px" style={{ background: border }} />
                </div>

                {/* Register CTA */}
                <motion.button
                  onClick={() => setShowRegister(true)}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl"
                  style={{ background: isDark ? 'rgba(255,255,255,0.04)' : `${pri}08`,
                    border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.08)' : `${pri}20`}`,
                    color: pri, fontSize: '0.78rem', fontWeight: 600, fontFamily: ff }}
                >
                  Not registered? <span style={{ fontWeight: 700 }}>Request to Register</span>
                </motion.button>

                {/* Hint */}
                <div className="flex items-center gap-1.5 justify-center mt-5">
                  <Shield size={11} style={{ color: textMuted }} />
                  <span style={{ fontSize: '0.63rem', color: textMuted }}>Secured · Access restricted to authorised DISCOM personnel</span>
                </div>

                {/* ── UX Research entry ── */}
                <div className="flex items-center gap-3 mt-6">
                  <div className="flex-1 h-px" style={{ background: border }} />
                  <span style={{ fontSize: '0.625rem', color: textMuted, whiteSpace: 'nowrap' }}>Research Workspace</span>
                  <div className="flex-1 h-px" style={{ background: border }} />
                </div>
                <motion.button
                  onClick={() => setResearchOpen(true)}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl mt-2"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.03)' : `${settings.secondaryColor}08`,
                    border: `1.5px solid ${settings.secondaryColor}25`,
                    color: settings.secondaryColor,
                    fontSize: '0.78rem', fontWeight: 600, fontFamily: ff,
                    cursor: 'pointer',
                  }}
                >
                  <Search size={14} />
                  Open UX Research Workspace
                </motion.button>
              </motion.div>
            )}

            {/* ── REGISTER VIEW ── */}
            {showRegister && (
              <motion.div
                key="register"
                variants={registerVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={slideTransition}
              >
                {/* Header with back button */}
                <div className="mb-7">
                  <button
                    onClick={() => setShowRegister(false)}
                    className="flex items-center gap-1.5 mb-5 transition-opacity hover:opacity-70"
                    style={{ fontSize: '0.72rem', fontWeight: 600, color: textMuted }}
                  >
                    <ArrowLeft size={14} />
                    Back to Login
                  </button>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: textMain, lineHeight: 1.2, marginBottom: 6 }}>
                    Request System Access
                  </h2>
                  <p style={{ fontSize: '0.78rem', color: textMuted }}>
                    Submit your details — our admin team will review within 24 hours
                  </p>
                </div>

                {/* Register form */}
                <form onSubmit={handleRegister} className="flex flex-col gap-4">

                  {/* Email */}
                  <div>
                    <label style={{ fontSize: '0.65rem', fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>
                      Official Email Address *
                    </label>
                    <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl"
                      style={{ background: inputBg, border: `1.5px solid ${regEmail ? pri + '40' : border}` }}>
                      <Mail size={14} style={{ color: regEmail ? pri : textMuted, flexShrink: 0 }} />
                      <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)}
                        placeholder="yourname@discom.gov.in"
                        className="flex-1 bg-transparent outline-none"
                        style={{ fontSize: '0.78rem', color: textMain, fontFamily: ff }} />
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label style={{ fontSize: '0.65rem', fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>
                      Full Name *
                    </label>
                    <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl"
                      style={{ background: inputBg, border: `1.5px solid ${regName ? pri + '40' : border}` }}>
                      <User size={14} style={{ color: regName ? pri : textMuted, flexShrink: 0 }} />
                      <input type="text" value={regName} onChange={e => setRegName(e.target.value)}
                        placeholder="e.g. Rajesh Kumar Sharma"
                        className="flex-1 bg-transparent outline-none"
                        style={{ fontSize: '0.78rem', color: textMain, fontFamily: ff }} />
                    </div>
                  </div>

                  {/* Mobile */}
                  <div>
                    <label style={{ fontSize: '0.65rem', fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>
                      Mobile Number *
                    </label>
                    <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl"
                      style={{ background: inputBg, border: `1.5px solid ${regMobile ? pri + '40' : border}` }}>
                      <Phone size={14} style={{ color: regMobile ? pri : textMuted, flexShrink: 0 }} />
                      <span style={{ fontSize: '0.78rem', color: textMuted, borderRight: `1px solid ${border}`, paddingRight: 8, marginRight: 4 }}>+91</span>
                      <input type="tel" value={regMobile} onChange={e => setRegMobile(e.target.value.replace(/\D/, '').slice(0, 10))}
                        placeholder="98765 43210"
                        className="flex-1 bg-transparent outline-none"
                        style={{ fontSize: '0.78rem', color: textMain, fontFamily: ff }} />
                    </div>
                  </div>

                  {/* AOR Zone */}
                  <div>
                    <label style={{ fontSize: '0.65rem', fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>
                      Area of Responsibility (AOR Zone) *
                    </label>
                    <div ref={zoneRef} style={{ position: 'relative' }}>
                      {/* Trigger */}
                      <button
                        type="button"
                        onClick={() => { setZoneOpen(o => !o); setDesgOpen(false); }}
                        className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl w-full text-left"
                        style={{ background: inputBg, border: `1.5px solid ${zoneOpen ? pri + '80' : regZone ? pri + '40' : border}`, transition: 'border-color 0.2s', cursor: 'pointer' }}
                      >
                        <MapPin size={14} style={{ color: regZone || zoneOpen ? pri : textMuted, flexShrink: 0, transition: 'color 0.2s' }} />
                        <span className="flex-1 truncate" style={{ fontSize: '0.78rem', color: regZone ? textMain : textMuted, fontFamily: ff }}>
                          {regZone || 'Select your zone'}
                        </span>
                        <motion.span animate={{ rotate: zoneOpen ? 180 : 0 }} transition={{ duration: 0.2 }} style={{ display: 'flex', flexShrink: 0 }}>
                          <ChevronDown size={14} style={{ color: regZone || zoneOpen ? pri : textMuted }} />
                        </motion.span>
                      </button>
                      {/* Dropdown list */}
                      <AnimatePresence>
                        {zoneOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -6, scaleY: 0.92 }}
                            animate={{ opacity: 1, y: 0, scaleY: 1 }}
                            exit={{ opacity: 0, y: -6, scaleY: 0.92 }}
                            transition={{ duration: 0.15, ease: 'easeOut' }}
                            style={{
                              position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 999,
                              background: isDark ? '#1e1e1e' : '#ffffff',
                              border: `1.5px solid ${pri}30`,
                              borderRadius: 12,
                              boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 32px rgba(21,101,192,0.12)',
                              overflow: 'hidden',
                              transformOrigin: 'top',
                            }}
                          >
                            {AOR_ZONES.map(z => (
                              <button
                                key={z}
                                type="button"
                                onClick={() => { setRegZone(z); setZoneOpen(false); }}
                                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left transition-colors"
                                style={{
                                  fontSize: '0.78rem', fontFamily: ff,
                                  color: regZone === z ? pri : textMain,
                                  background: regZone === z ? `${pri}12` : 'transparent',
                                  fontWeight: regZone === z ? 600 : 400,
                                  borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(21,101,192,0.06)'}`,
                                }}
                                onMouseEnter={e => (e.currentTarget.style.background = `${pri}18`)}
                                onMouseLeave={e => (e.currentTarget.style.background = regZone === z ? `${pri}12` : 'transparent')}
                              >
                                <MapPin size={12} style={{ color: regZone === z ? pri : textMuted, flexShrink: 0 }} />
                                <span className="flex-1">{z}</span>
                                {regZone === z && <CheckCircle size={12} style={{ color: pri, flexShrink: 0 }} />}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Designation */}
                  <div>
                    <label style={{ fontSize: '0.65rem', fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>
                      Designation *
                    </label>
                    <div ref={desgRef} style={{ position: 'relative' }}>
                      {/* Trigger */}
                      <button
                        type="button"
                        onClick={() => { setDesgOpen(o => !o); setZoneOpen(false); }}
                        className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl w-full text-left"
                        style={{ background: inputBg, border: `1.5px solid ${desgOpen ? pri + '80' : regDesg ? pri + '40' : border}`, transition: 'border-color 0.2s', cursor: 'pointer' }}
                      >
                        <Briefcase size={14} style={{ color: regDesg || desgOpen ? pri : textMuted, flexShrink: 0, transition: 'color 0.2s' }} />
                        <span className="flex-1 truncate" style={{ fontSize: '0.78rem', color: regDesg ? textMain : textMuted, fontFamily: ff }}>
                          {regDesg || 'Select your designation'}
                        </span>
                        <motion.span animate={{ rotate: desgOpen ? 180 : 0 }} transition={{ duration: 0.2 }} style={{ display: 'flex', flexShrink: 0 }}>
                          <ChevronDown size={14} style={{ color: regDesg || desgOpen ? pri : textMuted }} />
                        </motion.span>
                      </button>
                      {/* Dropdown list */}
                      <AnimatePresence>
                        {desgOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -6, scaleY: 0.92 }}
                            animate={{ opacity: 1, y: 0, scaleY: 1 }}
                            exit={{ opacity: 0, y: -6, scaleY: 0.92 }}
                            transition={{ duration: 0.15, ease: 'easeOut' }}
                            style={{
                              position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 999,
                              background: isDark ? '#1e1e1e' : '#ffffff',
                              border: `1.5px solid ${pri}30`,
                              borderRadius: 12,
                              boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 32px rgba(21,101,192,0.12)',
                              overflow: 'hidden',
                              transformOrigin: 'top',
                            }}
                          >
                            {DESIGNATIONS.map(d => (
                              <button
                                key={d}
                                type="button"
                                onClick={() => { setRegDesg(d); setDesgOpen(false); }}
                                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left transition-colors"
                                style={{
                                  fontSize: '0.78rem', fontFamily: ff,
                                  color: regDesg === d ? pri : textMain,
                                  background: regDesg === d ? `${pri}12` : 'transparent',
                                  fontWeight: regDesg === d ? 600 : 400,
                                  borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(21,101,192,0.06)'}`,
                                }}
                                onMouseEnter={e => (e.currentTarget.style.background = `${pri}18`)}
                                onMouseLeave={e => (e.currentTarget.style.background = regDesg === d ? `${pri}12` : 'transparent')}
                              >
                                <Briefcase size={12} style={{ color: regDesg === d ? pri : textMuted, flexShrink: 0 }} />
                                <span className="flex-1">{d}</span>
                                {regDesg === d && <CheckCircle size={12} style={{ color: pri, flexShrink: 0 }} />}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Disclaimer */}
                  <div className="rounded-xl px-3.5 py-3 flex items-start gap-2"
                    style={{ background: `${pri}08`, border: `1px solid ${pri}20` }}>
                    <CheckCircle size={13} style={{ color: pri, flexShrink: 0, marginTop: 1 }} />
                    <p style={{ fontSize: '0.65rem', color: textMuted, lineHeight: 1.55 }}>
                      Your request will be reviewed by the DISCOM system administrator. Access will be granted based on your designation and area of responsibility. By submitting you confirm you are authorised DISCOM personnel.
                    </p>
                  </div>

                  {/* Submit */}
                  <motion.button
                    type="submit" disabled={submitting}
                    whileHover={!submitting ? { scale: 1.02 } : {}} whileTap={!submitting ? { scale: 0.98 } : {}}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl"
                    style={{ background: getSecondaryBg(settings), color: '#ffffff',
                      fontSize: '0.82rem', fontWeight: 700, fontFamily: ff,
                      opacity: submitting ? 0.75 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}
                  >
                    {submitting ? (
                      <>
                        <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} style={{ display: 'flex' }}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                        </motion.span>
                        Submitting request…
                      </>
                    ) : (
                      <> <ArrowRight size={15} /> Request to Register </>
                    )}
                  </motion.button>

                  {/* Already have access */}
                  <p style={{ fontSize: '0.72rem', color: textMuted, textAlign: 'center', lineHeight: 1.5, paddingBottom: 16 }}>
                    Already have access?{' '}
                    <button
                      type="button"
                      onClick={() => setShowRegister(false)}
                      style={{ color: pri, fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: 3, fontSize: '0.72rem' }}
                    >
                      Login
                    </button>
                  </p>
                </form>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* ── UX Research Portal overlay ── */}
      <AnimatePresence>
        {researchOpen && (
          <UXResearchPortal onClose={() => setResearchOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}