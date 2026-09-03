import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/hooks/auth.hooks';
import { useDashboard } from '../../dashboard/Hooks/dashboard.hooks';
import { PharmaChainLogo } from '../../../components/common/PharmaChainLogo';
import slide1Img from '../../../assets/images/slide1_production.jpg';
import slide2Img from '../../../assets/images/slide2_blockchain.jpg';
import slide3Img from '../../../assets/images/slide3_verification.jpg';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  MessageSquare,
  QrCode,
  Building2,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Sun,
  Moon,
  Zap,
  Radio,
  Clock,
  ArrowRight,
  PhoneCall,
  Lock,
  LogIn,
  UserPlus,
  Layers,
  Database,
  Award,
  AlertOctagon,
  Sparkles,
  Info,
  Check,
  X,
} from 'lucide-react';

interface SampleDrug {
  id: string;
  name: string;
  generic: string;
  mfg: string;
  license: string;
  mfgDate: string;
  expDate: string;
  blockHash: string;
  status: 'AUTHENTIC' | 'RECALLED' | 'SUSPECT';
  verificationCount: number;
}

const SAMPLE_DRUGS: Record<string, SampleDrug> = {
  'BATCH-AZ772': {
    id: 'BATCH-AZ772',
    name: 'Azithromycin 500mg IP',
    generic: 'Azithromycin Dihydrate',
    mfg: 'Sun Pharma Industries Ltd (Plant HP-04)',
    license: 'CDSCO/MFG/2024/7821',
    mfgDate: '2025-01-15',
    expDate: '2027-01-14',
    blockHash: '0x8f2d91bc3a9e10294f83bca92837192837461928374a',
    status: 'AUTHENTIC',
    verificationCount: 14820,
  },
  'BATCH-PARA650': {
    id: 'BATCH-PARA650',
    name: 'Paracetamol Tablets IP 650mg',
    generic: 'Paracetamol IP',
    mfg: 'Cipla Laboratories Unit II (Sikkim)',
    license: 'CDSCO/MFG/2023/1109',
    mfgDate: '2025-02-01',
    expDate: '2028-01-31',
    blockHash: '0x7c4e201ab49c991823746101928374619283741123',
    status: 'AUTHENTIC',
    verificationCount: 52100,
  },
  'BATCH-AUG625': {
    id: 'BATCH-AUG625',
    name: 'Amoxicillin & Potassium Clavulanate 625mg',
    generic: 'Amoxicillin + Clavulanic Acid',
    mfg: 'Dr. Reddy’s Laboratories (Baddi)',
    license: 'CDSCO/MFG/2024/4912',
    mfgDate: '2024-11-10',
    expDate: '2026-10-31',
    blockHash: '0x99a8b7c6d5e4f3a2b109876543210fedcba9876543',
    status: 'AUTHENTIC',
    verificationCount: 8930,
  },
  'BATCH-RC991': {
    id: 'BATCH-RC991',
    name: 'Cough Relieve Oral Syrup 100ml',
    generic: 'Dextromethorphan HBr',
    mfg: 'Apex Formulations (Suspended)',
    license: 'CDSCO/MFG/2022/9012-SUSP',
    mfgDate: '2024-08-01',
    expDate: '2026-07-31',
    blockHash: '0x33445566778899aabbccddeeff0011223344556677',
    status: 'RECALLED',
    verificationCount: 310,
  },
};

export const LandingPage: React.FC = () => {
  const { setAuthView } = useAuth();
  const { theme, toggleThemeMode } = useDashboard();

  // Accessibility States
  const [fontSizeLevel, setFontSizeLevel] = useState<0 | 1 | 2>(0);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [isScreenReaderModalOpen, setIsScreenReaderModalOpen] = useState(false);

  // Hero Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);

  // Interactive QR Lookup Tool
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupResult, setLookupResult] = useState<SampleDrug | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Active Tab for Engagement Pillars
  const [activePillarTab, setActivePillarTab] = useState<'verify' | 'recalls' | 'regulations' | 'consultations' | 'report'>('verify');

  // Grievance / Defect Report Form State
  const [reportDrugName, setReportDrugName] = useState('');
  const [reportBatch, setReportBatch] = useState('');
  const [reportReason, setReportReason] = useState('Counterfeit Suspected');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  // Accessibility Font Resizing Handlers
  const handleFontSizeChange = (direction: 'increase' | 'decrease' | 'reset') => {
    let nextLevel: 0 | 1 | 2 = 0;
    if (direction === 'increase') {
      nextLevel = fontSizeLevel === 0 ? 1 : 2;
    } else if (direction === 'decrease') {
      nextLevel = fontSizeLevel === 2 ? 1 : 0;
    } else {
      nextLevel = 0;
    }
    setFontSizeLevel(nextLevel);
    document.documentElement.classList.remove('font-size-large', 'font-size-xlarge');
    if (nextLevel === 1) document.documentElement.classList.add('font-size-large');
    if (nextLevel === 2) document.documentElement.classList.add('font-size-xlarge');
  };

  const toggleHighContrast = () => {
    const next = !isHighContrast;
    setIsHighContrast(next);
    if (next) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  };

  // Carousel timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const handleVerifyLookup = (batchIdToVerify?: string) => {
    const id = (batchIdToVerify || lookupQuery).trim().toUpperCase();
    setIsVerifying(true);
    setTimeout(() => {
      const found = SAMPLE_DRUGS[id] || {
        id,
        name: `Custom Searched Medicine (${id})`,
        generic: 'Active Pharmaceutical Ingredient (API)',
        mfg: 'Registered CDSCO Manufacturer',
        license: 'CDSCO/MFG/2024/GEN',
        mfgDate: '2025-01-10',
        expDate: '2027-12-31',
        blockHash: '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        status: id.includes('RC') || id.includes('RECALL') ? 'RECALLED' : 'AUTHENTIC',
        verificationCount: Math.floor(Math.random() * 5000) + 120,
      };
      setLookupResult(found);
      setIsVerifying(false);
    }, 450);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReportSubmitted(true);
    setTimeout(() => {
      setReportSubmitted(false);
      setReportDrugName('');
      setReportBatch('');
    }, 5000);
  };

  const carouselSlides = [
    {
      badge: 'National Mandate GSR 1337(E) & Schedule M',
      title: 'Universal GS1 QR Serialization for Top 300 Formulation Brands',
      description:
        'In strict adherence to Drugs & Cosmetics Rules, pharmaceutical manufacturers generate verifiable cryptographic 2D DataMatrix packaging barcodes backed by zero-trust distributed ledger anchoring.',
      image: slide1Img,
      imageAlt: 'Automated high-speed pharmaceutical packaging line with glowing GS1 QR codes',
      tag: 'Smart Manufacturing & QR Minting',
      ctaPrimary: 'Manufacturer Login',
      ctaAction: () => setAuthView('login'),
      ctaSecondary: 'Register Unit (KYC)',
      ctaSecAction: () => setAuthView('register'),
      bgGradient: 'from-slate-950 via-slate-900 to-teal-950/80',
    },
    {
      badge: 'Zero-Trust Blockchain Architecture',
      title: 'Hyperledger Fabric 2.5 Ledger with ECDSA Cryptographic Proofs',
      description:
        'End-to-end transparent supply chain network safeguarding public health. Real-time recall execution, anti-counterfeit verification, and CDSCO regulatory oversight across all 28 States and 8 Union Territories.',
      image: slide2Img,
      imageAlt: 'Holographic decentralized blockchain network connecting pharma nodes and dispensaries',
      tag: 'Decentralized Immutable Ledger',
      ctaPrimary: 'Verify Medicine QR',
      ctaAction: () => setActivePillarTab('verify'),
      ctaSecondary: 'View Recall Bulletins',
      ctaSecAction: () => setActivePillarTab('recalls'),
      bgGradient: 'from-slate-950 via-blue-950/70 to-slate-900',
    },
    {
      badge: 'Citizen & Pharmacist Assurance',
      title: 'Instant Smartphone Digital Verification Before Medicine Dispensation',
      description:
        'Citizens, hospital pharmacies, and retail chemists can instantly scan the GS1 DataMatrix code on any medicine carton to view verified manufacturer credentials, lab tests, and CDSCO authenticity proof.',
      image: slide3Img,
      imageAlt: 'Pharmacist scanning medicine box QR code with smartphone verified certificate',
      tag: 'Citizen & Inspector Verification',
      ctaPrimary: 'Try Interactive Verifier',
      ctaAction: () => setActivePillarTab('verify'),
      ctaSecondary: 'Report Suspect Pack',
      ctaSecAction: () => setActivePillarTab('report'),
      bgGradient: 'from-slate-950 via-emerald-950/60 to-slate-900',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] font-sans antialiased selection:bg-teal-600 selection:text-white flex flex-col">
      {/* ─────────────────────────────────────────────────────────────
          1. TOP UTILITY STRIP (Government of India / CDSCO Standard)
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-[#0A192F] text-slate-200 text-xs border-b border-slate-800 py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left: Official Indian Emblem / GOI Tagline */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-semibold text-slate-100">
              <span className="w-4 h-2.5 bg-gradient-to-b from-[#FF9933] via-white to-[#138808] rounded-xs inline-block shadow-xs border border-white/20" />
              <span>भारत सरकार | GOVERNMENT OF INDIA</span>
            </div>
            <span className="text-slate-500 hidden md:inline">|</span>
            <span className="text-slate-300 text-[11px] hidden md:inline">
              Ministry of Health & Family Welfare — CDSCO
            </span>
          </div>

          {/* Right: Accessibility Controls & Theme Switch */}
          <div className="flex items-center gap-3 text-[11px]">
            {/* Skip to Main Content */}
            <a
              href="#main-content"
              className="text-slate-400 hover:text-white underline underline-offset-2 hidden sm:inline"
            >
              Skip to Main Content
            </a>

            {/* Accessibility Suite Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsAccessibilityOpen(!isAccessibilityOpen)}
                className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
                title="Accessibility Tools (GIGW & WCAG AA Compliant)"
              >
                <span>♿ Accessibility</span>
              </button>

              {isAccessibilityOpen && (
                <div className="absolute right-0 mt-1.5 w-64 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-3 z-50 text-xs space-y-2.5">
                  <div className="font-bold text-slate-100 border-b border-slate-800 pb-1.5 flex items-center justify-between">
                    <span>Accessibility Options</span>
                    <button
                      onClick={() => setIsAccessibilityOpen(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Text Resizing */}
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold mb-1">
                      Text Size (A- / A / A+)
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleFontSizeChange('decrease')}
                        className={`flex-1 py-1 rounded border text-center font-bold ${
                          fontSizeLevel === 0 ? 'bg-teal-700 border-teal-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300'
                        }`}
                      >
                        A-
                      </button>
                      <button
                        onClick={() => handleFontSizeChange('reset')}
                        className={`flex-1 py-1 rounded border text-center font-bold ${
                          fontSizeLevel === 1 ? 'bg-teal-700 border-teal-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300'
                        }`}
                      >
                        A
                      </button>
                      <button
                        onClick={() => handleFontSizeChange('increase')}
                        className={`flex-1 py-1 rounded border text-center font-bold ${
                          fontSizeLevel === 2 ? 'bg-teal-700 border-teal-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300'
                        }`}
                      >
                        A+
                      </button>
                    </div>
                  </div>

                  {/* High Contrast Toggle */}
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold mb-1">
                      Contrast Adjustment
                    </div>
                    <button
                      onClick={toggleHighContrast}
                      className={`w-full py-1 px-2 rounded border text-left text-xs font-semibold flex items-center justify-between ${
                        isHighContrast
                          ? 'bg-yellow-400 text-black border-yellow-300'
                          : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      <span>{isHighContrast ? 'Standard Contrast' : 'High Contrast (Yellow/Black)'}</span>
                      {isHighContrast && <Check className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Screen Reader Helper */}
                  <div>
                    <button
                      onClick={() => setIsScreenReaderModalOpen(true)}
                      className="w-full py-1 px-2 rounded border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-left text-xs"
                    >
                      Screen Reader Access Guide
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Theme Switch */}
            <button
              onClick={() => toggleThemeMode()}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. CLEAN BRANDED HEADER (Logo + PharmaChain + Action Buttons)
      ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-[var(--bg-surface)]/95 backdrop-blur-md border-b border-[var(--border)] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
          {/* Official Logo & Clean Title: PharmaChain */}
          <div className="flex items-center gap-3">
            <PharmaChainLogo size={42} withGlow={true} />
            <div>
              <span className="font-black text-xl sm:text-2xl tracking-tight text-[var(--text-primary)]">
                PharmaChain
              </span>
            </div>
          </div>

          {/* Action CTAs with Lucide Icons (Login & Register) */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAuthView('register')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-[var(--text-primary)] hover:bg-[var(--bg-element)] border border-[var(--border)] transition-all cursor-pointer shadow-xs hover:border-amber-500/50"
            >
              <UserPlus className="w-4 h-4 text-amber-500" />
              <span>Register Unit</span>
            </button>

            <button
              onClick={() => setAuthView('login')}
              className="btn-primary text-xs sm:text-sm py-2 px-4.5 flex items-center gap-2 shadow-md cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Manufacturer Login</span>
            </button>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          3. HERO SECTION & CAMPAIGN CAROUSEL WITH DEDICATED IMAGES
      ───────────────────────────────────────────────────────────── */}
      <main id="main-content" className="flex-1">
        <section className="relative overflow-hidden border-b border-[var(--border)]">
          <div className="relative min-h-[460px] sm:min-h-[500px] lg:min-h-[520px] flex items-center">
            {carouselSlides.map((slide, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out bg-gradient-to-r ${
                  slide.bgGradient
                } flex items-center px-4 sm:px-8 py-8 ${
                  currentSlide === idx ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Left Text & Call-to-Actions */}
                  <div className="lg:col-span-6 space-y-4 text-white">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-amber-300">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>{slide.badge}</span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
                      {slide.title}
                    </h1>

                    <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                      {slide.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        onClick={slide.ctaAction}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-rose-600 hover:from-amber-300 hover:to-rose-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition-all flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
                      >
                        <span>{slide.ctaPrimary}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <button
                        onClick={slide.ctaSecAction}
                        className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <span>{slide.ctaSecondary}</span>
                      </button>
                    </div>
                  </div>

                  {/* Right: Rich Project Image Presentation */}
                  <div className="lg:col-span-6 flex justify-center">
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-500/30 group max-w-lg w-full bg-slate-900">
                      <img
                        src={slide.image}
                        alt={slide.imageAlt}
                        className="w-full h-64 sm:h-72 lg:h-80 object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />

                      {/* Image Caption Pill */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/15 text-xs text-white">
                        <div className="flex items-center gap-2 font-bold truncate">
                          <Radio className="w-3 h-3 text-amber-400 animate-pulse shrink-0" />
                          <span className="truncate">{slide.tag}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                          CDSCO LIVE
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Dot Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {carouselSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentSlide === idx ? 'w-8 bg-amber-400' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            4. LIVE NATIONAL TELEMETRY & METRIC STATS
        ───────────────────────────────────────────────────────────── */}
        <section className="bg-[var(--bg-surface)] border-b border-[var(--border)] py-6 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-[var(--border)]">
              <div className="px-3 py-2 text-center">
                <div className="text-2xl sm:text-3xl font-black text-teal-700 dark:text-teal-400 font-mono">
                  1,248,500+
                </div>
                <div className="text-xs text-[var(--text-muted)] font-semibold mt-0.5">
                  Batches Minted
                </div>
              </div>

              <div className="px-3 py-2 text-center">
                <div className="text-2xl sm:text-3xl font-black text-sky-700 dark:text-sky-400 font-mono">
                  452.8M
                </div>
                <div className="text-xs text-[var(--text-muted)] font-semibold mt-0.5">
                  GS1 QR Packs Serialized
                </div>
              </div>

              <div className="px-3 py-2 text-center">
                <div className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-400 font-mono">
                  99.98%
                </div>
                <div className="text-xs text-[var(--text-muted)] font-semibold mt-0.5">
                  Authenticity Verification
                </div>
              </div>

              <div className="px-3 py-2 text-center">
                <div className="text-2xl sm:text-3xl font-black text-amber-700 dark:text-amber-400 font-mono">
                  28 States
                </div>
                <div className="text-xs text-[var(--text-muted)] font-semibold mt-0.5">
                  Supply Chain Coverage
                </div>
              </div>

              <div className="px-3 py-2 text-center col-span-2 sm:col-span-1">
                <div className="text-2xl sm:text-3xl font-black text-rose-700 dark:text-rose-400 font-mono">
                  14 Recalls
                </div>
                <div className="text-xs text-[var(--text-muted)] font-semibold mt-0.5">
                  Swiftly Quarantined (2025-26)
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            5. CLEAN PUBLIC VERIFICATION & SAFETY SECTION
        ───────────────────────────────────────────────────────────── */}
        <section className="py-12 px-4 sm:px-8 max-w-5xl mx-auto">
          {/* Clean Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)]">
              Medicine Verification & Safety
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              Instant blockchain verification, active recall advisories, and CDSCO compliance standards.
            </p>
          </div>

          {/* Minimalist Segmented Tabs */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex p-1 rounded-2xl bg-[var(--bg-element)] border border-[var(--border)] gap-1">
              {[
                { id: 'verify', label: 'Verify Medicine', icon: <QrCode className="w-3.5 h-3.5" /> },
                { id: 'recalls', label: 'Safety Recalls', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
                { id: 'regulations', label: 'Regulations', icon: <FileText className="w-3.5 h-3.5" /> },
                { id: 'report', label: 'Report Defect', icon: <PhoneCall className="w-3.5 h-3.5" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActivePillarTab(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    activePillarTab === tab.id
                      ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-xs'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ─── TAB 1: CLEAN MEDICINE VERIFIER ─── */}
          {activePillarTab === 'verify' && (
            <div className="space-y-6">
              {/* Unified Search Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={lookupQuery}
                      onChange={(e) => setLookupQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleVerifyLookup()}
                      placeholder="Enter Batch ID or GS1 DataMatrix code..."
                      className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-[var(--bg-element)] border border-[var(--border)] text-[var(--text-primary)] font-mono focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                  <button
                    onClick={() => handleVerifyLookup()}
                    disabled={isVerifying || !lookupQuery.trim()}
                    className="btn-primary text-xs py-2.5 px-6 shrink-0 cursor-pointer"
                  >
                    {isVerifying ? 'Verifying...' : 'Verify Authenticity'}
                  </button>
                </div>
              </div>

              {/* Clean Result Card */}
              {lookupResult ? (
                <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] shadow-xs space-y-5">
                  {/* Result Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
                    <div>
                      <h3 className="text-lg font-black text-[var(--text-primary)]">
                        {lookupResult.name}
                      </h3>
                      <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold mt-0.5">
                        {lookupResult.generic}
                      </p>
                    </div>

                    <div
                      className={`px-3 py-1.5 rounded-full font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto border ${
                        lookupResult.status === 'AUTHENTIC'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                      }`}
                    >
                      {lookupResult.status === 'AUTHENTIC' ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span>Verified Authentic</span>
                        </>
                      ) : (
                        <>
                          <AlertOctagon className="w-4 h-4 text-rose-500" />
                          <span>CDSCO Recalled</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* 4-Item Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-[var(--bg-element)] border border-[var(--border)]">
                      <div className="text-[10px] text-[var(--text-muted)] font-medium">Manufacturer</div>
                      <div className="font-bold text-[var(--text-primary)] mt-0.5 truncate" title={lookupResult.mfg}>
                        {lookupResult.mfg}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-[var(--bg-element)] border border-[var(--border)]">
                      <div className="text-[10px] text-[var(--text-muted)] font-medium">CDSCO License</div>
                      <div className="font-bold text-[var(--text-primary)] font-mono mt-0.5 truncate">
                        {lookupResult.license}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-[var(--bg-element)] border border-[var(--border)]">
                      <div className="text-[10px] text-[var(--text-muted)] font-medium">Mfg Date</div>
                      <div className="font-bold text-[var(--text-primary)] mt-0.5">
                        {lookupResult.mfgDate}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-[var(--bg-element)] border border-[var(--border)]">
                      <div className="text-[10px] text-[var(--text-muted)] font-medium">Expiry Date</div>
                      <div className="font-bold text-[var(--text-primary)] mt-0.5">
                        {lookupResult.expDate}
                      </div>
                    </div>
                  </div>

                  {/* Blockchain Audit Trail Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-[var(--bg-element)] border border-[var(--border)] text-[11px] font-mono">
                    <div className="flex items-center gap-2 text-[var(--text-muted)] truncate">
                      <Database className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                      <span>Ledger Hash: <strong className="text-[var(--text-primary)]">{lookupResult.blockHash.slice(0, 24)}...</strong></span>
                    </div>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5" /> Block #149,820 Verified
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-[var(--text-muted)] rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)]">
                  Enter a batch ID or GS1 DataMatrix code above to view its live cryptographic audit trail.
                </div>
              )}
            </div>
          )}

          {/* ─── TAB 2: CLEAN SAFETY RECALLS ─── */}
          {activePillarTab === 'recalls' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    id: 'RC-2025-081',
                    batchId: 'BATCH-RC991',
                    drug: 'Cough Relieve Oral Syrup 100ml',
                    manufacturer: 'Apex Formulations Ltd',
                    reason: 'Diethylene glycol (DEG) trace impurity detected above permissible threshold.',
                    date: '2025-02-18',
                    status: 'Recall Level 1',
                  },
                  {
                    id: 'RC-2025-042',
                    batchId: 'BATCH-OM401',
                    drug: 'Omeprazole Capsules IP 20mg',
                    manufacturer: 'Zenith Life Sciences Unit III',
                    reason: 'Dissolution failure observed in stability chamber test at 6-month interval.',
                    date: '2025-01-28',
                    status: 'Batch Quarantine',
                  },
                ].map((recall) => (
                  <div key={recall.id} className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-rose-500/30 shadow-xs space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                          {recall.status}
                        </span>
                        <h4 className="font-bold text-sm text-[var(--text-primary)] mt-1.5">{recall.drug}</h4>
                        <p className="text-[11px] text-[var(--text-muted)]">{recall.manufacturer}</p>
                      </div>
                      <span className="text-[10px] font-mono text-[var(--text-muted)]">{recall.date}</span>
                    </div>

                    <p className="text-xs text-[var(--text-secondary)] bg-[var(--bg-element)] p-3 rounded-xl border border-[var(--border)] leading-relaxed">
                      {recall.reason}
                    </p>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="font-mono text-teal-600 dark:text-teal-400 font-bold text-[11px]">Batch: {recall.batchId}</span>
                      <button
                        onClick={() => {
                          setLookupQuery(recall.batchId);
                          handleVerifyLookup(recall.batchId);
                          setActivePillarTab('verify');
                        }}
                        className="text-teal-600 dark:text-teal-400 hover:underline font-semibold cursor-pointer text-[11px]"
                      >
                        Inspect Record →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── TAB 3: CLEAN REGULATIONS ─── */}
          {activePillarTab === 'regulations' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  title: 'Gazette GSR 1337(E)',
                  desc: 'Mandates 100% GS1 DataMatrix 2D barcodes containing GTIN, Batch, Mfg Date, Expiry Date, and Unique Serial Number for all top formulation packs.',
                },
                {
                  title: 'Revised Schedule M',
                  desc: 'Standards for Good Manufacturing Practices (GMP), digital batch logs, environmental controls, and pharmacovigilance.',
                },
                {
                  title: 'CDSCO Onboarding SOP',
                  desc: 'Step-by-step guidance for manufacturer registration, GSTIN verification, and ECDSA ES256 hardware keypair issuance.',
                },
              ].map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] shadow-xs space-y-2.5 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-[var(--text-primary)]">{item.title}</h4>
                    <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setAuthView('register')}
                    className="text-xs text-teal-600 dark:text-teal-400 font-bold hover:underline flex items-center gap-1 cursor-pointer pt-2"
                  >
                    <span>Read Guidelines</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ─── TAB 4: CLEAN REPORT DEFECT ─── */}
          {activePillarTab === 'report' && (
            <div className="max-w-xl mx-auto p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] shadow-xs space-y-4">
              <div className="text-center space-y-1">
                <h3 className="text-base font-bold text-[var(--text-primary)]">
                  Report Suspect Medicine or Adverse Reaction
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Submit confidential reports regarding suspected counterfeit medication or quality defects directly to CDSCO inspectors.
                </p>
              </div>

              {reportSubmitted ? (
                <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-1 text-emerald-800 dark:text-emerald-200">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto" />
                  <div className="font-bold text-xs">Report Submitted Successfully</div>
                  <p className="text-[11px]">
                    Complaint ID: <strong>CDSCO-GRV-{Math.floor(100000 + Math.random() * 900000)}</strong>
                  </p>
                </div>
              ) : (
                <form onSubmit={handleReportSubmit} className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-[var(--text-primary)] text-[11px]">Medicine Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Paracetamol 650mg"
                        value={reportDrugName}
                        onChange={(e) => setReportDrugName(e.target.value)}
                        className="w-full mt-1 px-3 py-2 rounded-xl bg-[var(--bg-element)] border border-[var(--border)] text-[var(--text-primary)]"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-[var(--text-primary)] text-[11px]">Batch Number</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. BATCH-9921"
                        value={reportBatch}
                        onChange={(e) => setReportBatch(e.target.value)}
                        className="w-full mt-1 px-3 py-2 rounded-xl bg-[var(--bg-element)] border border-[var(--border)] text-[var(--text-primary)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-[var(--text-primary)] text-[11px]">Defect Type</label>
                    <select
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-xl bg-[var(--bg-element)] border border-[var(--border)] text-[var(--text-primary)]"
                    >
                      <option value="Counterfeit Suspected">Suspicious Packaging / Suspected Counterfeit</option>
                      <option value="Adverse Reaction">Severe Adverse Drug Reaction</option>
                      <option value="Defective Formulation">Discoloration or Foreign Particulates</option>
                      <option value="Missing QR Code">Missing Mandatory QR Code Barcode</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                  >
                    Submit Report to CDSCO
                  </button>
                </form>
              )}
            </div>
          )}
        </section>

        {/* ─────────────────────────────────────────────────────────────
            6. ACCREDITED TECHNOLOGY & GOV-PHARMA ARCHITECTURE
        ───────────────────────────────────────────────────────────── */}
        <section className="bg-[var(--bg-surface)] border-t border-[var(--border)] py-12 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-teal-600 dark:text-teal-400">
                National Digital Infrastructure
              </span>
              <h2 className="text-2xl font-black text-[var(--text-primary)]">
                Enterprise Blockchain & Cryptographic Security
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
              <div className="p-5 rounded-2xl bg-[var(--bg-element)] border border-[var(--border)] space-y-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                  <Database className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-[var(--text-primary)]">Hyperledger Fabric 2.5</h4>
                <p className="text-[var(--text-muted)] leading-relaxed">
                  Permissioned decentralized ledger with state-level validator nodes ensuring 100% immutability.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[var(--bg-element)] border border-[var(--border)] space-y-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
                  <Lock className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-[var(--text-primary)]">ECDSA ES256 Signatures</h4>
                <p className="text-[var(--text-muted)] leading-relaxed">
                  Hardware-backed manufacturer private key vault signing every batch serialization unit.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[var(--bg-element)] border border-[var(--border)] space-y-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                  <Award className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-[var(--text-primary)]">GS1 Standards Compliant</h4>
                <p className="text-[var(--text-muted)] leading-relaxed">
                  Global Trade Item Numbers (GTIN) and GS1 DataMatrix 2D serialization standard across India.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[var(--bg-element)] border border-[var(--border)] space-y-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-[var(--text-primary)]">GIGW & STQC Certified</h4>
                <p className="text-[var(--text-muted)] leading-relaxed">
                  Full adherence to Guidelines for Indian Government Websites with WCAG 2.1 AA accessibility.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ─────────────────────────────────────────────────────────────
          7. OFFICIAL GOVERNMENT FOOTER (GIGW / MyGov Standard)
      ───────────────────────────────────────────────────────────── */}
      <footer className="bg-[#060D1A] text-slate-300 border-t border-slate-800 text-xs py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Column 1: Organization */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-black text-white text-base">
                <PharmaChainLogo size={28} />
                <span>PharmaChain</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                National Pharmaceutical Supply Chain Integrity Platform under the aegis of Central Drugs Standard Control Organisation (CDSCO), Ministry of Health & Family Welfare.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div className="space-y-2">
              <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Citizen & Industry</h4>
              <ul className="space-y-1.5 text-slate-400 text-[11px]">
                <li><button onClick={() => setActivePillarTab('verify')} className="hover:text-white cursor-pointer">Verify Medicine QR</button></li>
                <li><button onClick={() => setActivePillarTab('recalls')} className="hover:text-white cursor-pointer">CDSCO Drug Safety Bulletins</button></li>
                <li><button onClick={() => setAuthView('register')} className="hover:text-white cursor-pointer">Manufacturer KYC Clearance</button></li>
                <li><button onClick={() => setActivePillarTab('consultations')} className="hover:text-white cursor-pointer">Pharmacopeia Consultations</button></li>
              </ul>
            </div>

            {/* Column 3: Regulations */}
            <div className="space-y-2">
              <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Regulatory Directives</h4>
              <ul className="space-y-1.5 text-slate-400 text-[11px]">
                <li><a href="https://cdsco.gov.in" target="_blank" rel="noreferrer" className="hover:text-white">CDSCO Official Portal</a></li>
                <li><a href="https://mohfw.gov.in" target="_blank" rel="noreferrer" className="hover:text-white">Ministry of Health & Family Welfare</a></li>
                <li><a href="https://www.india.gov.in" target="_blank" rel="noreferrer" className="hover:text-white">National Portal of India (india.gov.in)</a></li>
                <li><a href="https://mygov.in" target="_blank" rel="noreferrer" className="hover:text-white">MyGov Citizen Engagement</a></li>
              </ul>
            </div>

            {/* Column 4: National Helpline */}
            <div className="space-y-3">
              <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">CDSCO Technical Helpdesk</h4>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-[11px]">
                <div className="text-slate-400">National Toll-Free Support:</div>
                <div className="font-bold text-teal-400 font-mono">1800-11-4477 (Toll Free)</div>
                <div className="text-slate-400 text-[10px]">support-pharmachain@cdsco.nic.in</div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <div>
              © 2026 PharmaChain. Designed and Hosted by National Informatics Centre (NIC) & CDSCO.
            </div>
            <div className="flex items-center gap-3">
              <span>GIGW Compliant</span>
              <span>•</span>
              <span>WCAG 2.1 AA</span>
              <span>•</span>
              <span>Security Audited</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Screen Reader Modal */}
      {isScreenReaderModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 text-slate-200 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-sm text-white">Screen Reader Access Information</h3>
              <button onClick={() => setIsScreenReaderModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              PharmaChain website complies with World Wide Web Consortium (W3C) Web Content Accessibility Guidelines (WCAG) 2.1 level AA. Users with visual impairments can access this website using assistive technologies, such as screen readers (NVDA, JAWS, VoiceOver).
            </p>
            <div className="text-xs space-y-1 font-mono text-teal-300 bg-slate-950 p-3 rounded-lg">
              <div>NVDA: Download from nvaccess.org (Free)</div>
              <div>VoiceOver: Built-in on macOS / iOS</div>
              <div>TalkBack: Built-in on Android devices</div>
            </div>
            <button
              onClick={() => setIsScreenReaderModalOpen(false)}
              className="w-full py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs"
            >
              Close Guide
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
