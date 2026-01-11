import React, { useState, useEffect, useMemo } from 'react';
import { 
  Clipboard, 
  RotateCcw, 
  User, 
  Calendar, 
  Database, 
  Key, 
  CheckCircle2, 
  Send,
  Moon,
  Sun,
  Store,
  Phone,
  MessageCircle,
  Clock,
  ClipboardPaste,
  Wallet,
  ShieldCheck,
  CreditCard,
  Waves
} from 'lucide-react';

// --- 1. CONFIGURATION ---

const SHOP_CONFIG = {
  shopName: "VPN Invoice",
  kpayName: "Htet Aung Lin",
  kpayNumber: "09964520268",
  waveName: "Htet Aung Lin",
  waveNumber: "09964520268",
  phoneNumber: "09964520268",
  telegramUser: "@nolan112002",
  shopHours: "6:00 PM - 10:00 PM"
};

const STORAGE_KEY = 'vpn_invoice_draft_v7';

// --- TYPES ---

type DurationOption = {
  label: string;
  months: number;
};

const DURATIONS: DurationOption[] = [
  { label: '1 Month', months: 1 },
  { label: '2 Months', months: 2 },
  { label: '3 Months', months: 3 },
  { label: '6 Months', months: 6 },
  { label: '1 Year', months: 12 },
];

interface FormData {
  username: string;
  purchaseDate: string; // YYYY-MM-DD
  durationIdx: number;
  dataPlan: string;
  outlineKey: string;
}

const INITIAL_STATE: FormData = {
  username: '',
  purchaseDate: new Date().toISOString().split('T')[0],
  durationIdx: 0,
  dataPlan: '',
  outlineKey: '',
};

// --- HELPER FUNCTIONS ---

const formatDateForDisplay = (dateString: string): string => {
  if (!dateString) return 'DD/MM/YYYY';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

const calculateExpireDate = (startDate: string, monthsToAdd: number): string => {
  if (!startDate) return '';
  const date = new Date(startDate);
  date.setMonth(date.getMonth() + monthsToAdd);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function App() {
  // --- STATE ---

  // Theme State (Persisted)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem('theme');
      // Default to dark if not set, or if set to dark
      return stored === 'light' ? 'light' : 'dark';
    }
    return 'dark';
  });

  // Form Data (Persisted)
  const [formData, setFormData] = useState<FormData>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Merge with initial state to ensure all fields exist (in case of version updates)
          return { ...INITIAL_STATE, ...parsed };
        } catch (e) {
          console.error("Failed to parse draft", e);
        }
      }
    }
    return INITIAL_STATE;
  });

  const [errors, setErrors] = useState({ username: false, outlineKey: false });
  const [copied, setCopied] = useState(false);

  // --- EFFECTS ---

  // Apply Theme
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Save Draft to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  // --- COMPUTED VALUES ---

  const expireDateRaw = useMemo(() => {
    return calculateExpireDate(
      formData.purchaseDate, 
      DURATIONS[formData.durationIdx].months
    );
  }, [formData.purchaseDate, formData.durationIdx]);

  const formattedPurchaseDate = formatDateForDisplay(formData.purchaseDate);
  const formattedExpireDate = formatDateForDisplay(expireDateRaw);

  const generatedMessage = useMemo(() => {
    const keyPart = formData.outlineKey ? `\`\`\`${formData.outlineKey.trim()}\`\`\`` : '```[KEY_WILL_APPEAR_HERE]```';
    
    return `🎉 **ဝယ်ယူအားပေးမှုအတွက် ကျေးဇူးအထူးတင်ပါတယ်ခင်ဗျာ** 🙏

👤 **Username:** ${formData.username || '[Username]'}
📅 **Start Date:** ${formattedPurchaseDate}
🛑 **Expire Date:** ${formattedExpireDate}
📦 **Data Plan:** ${formData.dataPlan || '0'} GB

👇 **Outline Key ကို ယူရန် Copy နှိပ်ပါ** 👇
${keyPart}

💸 **ငွေလွှဲရန် (KPay / Wave):**
KBZ Pay: ${SHOP_CONFIG.kpayNumber} (${SHOP_CONFIG.kpayName})
Wave Pay: ${SHOP_CONFIG.waveNumber} (${SHOP_CONFIG.waveName})

-----------------------------
⏰ **ဆိုင်ဖွင့်ချိန်:** ${SHOP_CONFIG.shopHours} အထိ
🆘 အကူအညီလိုပါက **${SHOP_CONFIG.telegramUser}** သို့ ဆက်သွယ်နိုင်ပါသည်။
⚡ ၁၀ မိနစ်အတွင်း စာမပြန်ပါက **${SHOP_CONFIG.phoneNumber}** သို့ ဖုန်းခေါ်ဆိုနိုင်ပါသည်။

နောက်လည်း လာရောက်အားပေးဖို့ ဖိတ်ခေါ်ပါတယ်ခင်ဗျာ။ ❤️`;
  }, [formData, formattedPurchaseDate, formattedExpireDate]);

  // --- HANDLERS ---

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if it exists
    if (name === 'username' || name === 'outlineKey') {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleReset = () => {
    if (window.confirm('Clear all fields and reset form?')) {
      const newState = {
        ...INITIAL_STATE,
        purchaseDate: new Date().toISOString().split('T')[0] // Reset date to Today
      };
      setFormData(newState);
      setErrors({ username: false, outlineKey: false });
      setCopied(false);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handlePasteKey = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setFormData(prev => ({ ...prev, outlineKey: text }));
        setErrors(prev => ({ ...prev, outlineKey: false }));
      }
    } catch (err) {
      console.error("Clipboard read failed", err);
      // Fallback: Focus the textarea so user can paste manually
      const el = document.querySelector('textarea[name="outlineKey"]') as HTMLTextAreaElement;
      if (el) el.focus();
    }
  };

  const handleCopy = async () => {
    // 1. Validation
    const newErrors = {
      username: !formData.username.trim(),
      outlineKey: !formData.outlineKey.trim()
    };

    if (newErrors.username || newErrors.outlineKey) {
      setErrors(newErrors);
      return;
    }

    // 2. Copy to Clipboard
    try {
      await navigator.clipboard.writeText(generatedMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="min-h-screen py-6 px-4 md:py-12 md:px-8 font-sans transition-colors duration-300 bg-gray-100 dark:bg-slate-900 text-gray-900 dark:text-white flex items-center justify-center">
      
      <div className="w-full max-w-6xl bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-gray-200 dark:border-slate-700/50 transition-all duration-300">
        
        {/* --- Header --- */}
        <div className="bg-indigo-600 px-6 py-5 md:px-8 flex items-center justify-between shadow-md relative overflow-hidden shrink-0">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="flex items-center gap-3 relative z-10">
            <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm shadow-inner text-white">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-tight">{SHOP_CONFIG.shopName}</h1>
              <p className="text-indigo-100 text-xs md:text-sm font-medium opacity-90">Invoice Generator v7.0 Pro</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 relative z-10">
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-indigo-700/50 text-white/90 hover:bg-white/20 hover:text-white transition-all active:scale-95 border border-indigo-500/30"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              onClick={handleReset}
              className="p-2.5 rounded-xl bg-indigo-700/50 text-white/90 hover:bg-white/20 hover:text-white transition-all active:scale-95 border border-indigo-500/30"
              title="Reset Form"
            >
              <RotateCcw size={20} />
            </button>
          </div>
        </div>

        {/* --- Main Content --- */}
        <div className="flex flex-col lg:flex-row flex-1">
          
          {/* LEFT COLUMN: Input Form */}
          <div className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
            <div className="space-y-1 mb-2">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                Order Details
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Enter customer information below. Drafts are auto-saved.
              </p>
            </div>

            <div className="space-y-6">
              
              {/* Username Input */}
              <div className="group">
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 ml-1">
                  Username <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ${errors.username ? 'text-red-500' : 'text-gray-400'}`}>
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    name="username"
                    autoComplete="off" 
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter customer username"
                    className={`w-full pl-11 pr-4 py-3.5 rounded-xl bg-gray-50 dark:bg-slate-900 border outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400 ${
                      errors.username 
                        ? 'border-red-500 focus:border-red-500 ring-2 ring-red-500/10' 
                        : 'border-gray-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'
                    }`}
                  />
                </div>
                {errors.username && <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">Username is required</p>}
              </div>

              {/* Date & Duration Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Purchase Date */}
                <div className="group">
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 ml-1">
                    Purchase Date
                  </label>
                  <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Calendar size={18} />
                    </div>
                    <input
                      type="date"
                      name="purchaseDate"
                      value={formData.purchaseDate}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-gray-900 dark:text-white"
                      style={{ colorScheme: theme }}
                    />
                  </div>
                </div>

                {/* Duration Select */}
                <div className="group">
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 ml-1">
                    Duration
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Clock size={18} />
                    </div>
                    <select
                      name="durationIdx"
                      value={formData.durationIdx}
                      onChange={(e) => setFormData(prev => ({...prev, durationIdx: parseInt(e.target.value)}))}
                      className="w-full pl-11 pr-10 py-3.5 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-gray-900 dark:text-white appearance-none cursor-pointer"
                    >
                      {DURATIONS.map((opt, idx) => (
                        <option key={idx} value={idx}>{opt.label}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Plan */}
              <div className="group">
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 ml-1">
                  Data Plan
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Database size={18} />
                  </div>
                  <input
                    type="text"
                    name="dataPlan"
                    autoComplete="off"
                    value={formData.dataPlan}
                    onChange={handleInputChange}
                    placeholder="e.g. 100"
                    className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <span className="text-sm font-semibold text-gray-400 dark:text-gray-500">GB</span>
                  </div>
                </div>
              </div>

              {/* Outline Key */}
              <div className="group">
                <div className="flex justify-between items-center mb-2 px-1">
                   <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Outline Key <span className="text-red-500">*</span>
                  </label>
                  <button
                    onClick={handlePasteKey}
                    className="text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center gap-1.5 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-md"
                    title="Paste from clipboard"
                  >
                    <ClipboardPaste size={14} /> 
                    <span>Paste</span>
                  </button>
                </div>
                
                <div className="relative">
                  <div className={`absolute top-3.5 left-4 pointer-events-none ${errors.outlineKey ? 'text-red-500' : 'text-gray-400'}`}>
                    <Key size={18} />
                  </div>
                  <textarea
                    name="outlineKey"
                    autoComplete="off"
                    value={formData.outlineKey}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Paste ss:// key string here..."
                    className={`w-full pl-11 pr-4 py-3.5 rounded-xl bg-gray-50 dark:bg-slate-900 border outline-none transition-all text-gray-900 dark:text-white font-mono text-xs md:text-sm placeholder-gray-400 resize-none custom-scrollbar ${
                      errors.outlineKey 
                        ? 'border-red-500 focus:border-red-500 ring-2 ring-red-500/10' 
                        : 'border-gray-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'
                    }`}
                  />
                </div>
                {errors.outlineKey && <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">Outline Key is required</p>}
              </div>

            </div>
          </div>

          {/* RIGHT COLUMN: Preview & Actions */}
          <div className="lg:w-5/12 bg-gray-50 dark:bg-slate-900/50 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-slate-700 flex flex-col">
            
            <div className="p-6 md:p-8 flex-1 flex flex-col min-h-[450px]">

              {/* Preview Header */}
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <Send size={14} /> Telegram Preview
                </h3>
                <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 tracking-wide">
                  LIVE
                </span>
              </div>

              {/* Preview Box */}
              <div className="flex-1 relative rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm overflow-hidden group mb-6">
                <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-5">
                  <div className="text-sm leading-relaxed whitespace-pre-wrap text-gray-800 dark:text-gray-200 break-words font-sans selection:bg-indigo-500/30">
                    {/* Render message with basic formatting simulation */}
                    {generatedMessage.split('\n').map((line, i) => {
                      // Bold formatting simulation
                      if (line.includes('**')) {
                          const parts = line.split('**');
                          return (
                            <div key={i} className="min-h-[1.5em]">
                                {parts.map((part, pIdx) => (
                                    pIdx % 2 === 1 ? <strong key={pIdx} className="font-bold text-gray-900 dark:text-white">{part}</strong> : <span key={pIdx}>{part}</span>
                                ))}
                            </div>
                          );
                        }
                        // Code block simulation
                        if (line.trim().startsWith('```')) {
                           const content = line.replace(/```/g, '');
                           return (
                               <div key={i} className="my-3 p-3 rounded-lg bg-gray-100 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 font-mono text-xs break-all text-indigo-600 dark:text-indigo-400 select-all">
                                   {content}
                               </div>
                           )
                        }
                        // Separator simulation
                        if (line.includes('-----------------------------')) {
                            return <div key={i} className="h-px bg-gray-200 dark:bg-slate-700 my-4"></div>
                        }
                        return <div key={i} className="min-h-[1.5em]">{line}</div>;
                    })}
                  </div>
                </div>
              </div>

              {/* Copy Button */}
              <button
                onClick={handleCopy}
                className={`w-full py-4 px-6 rounded-xl font-bold text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2.5 ${
                  copied 
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30' 
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/30'
                }`}
              >
                {copied ? (
                  <>
                    <CheckCircle2 size={20} className="stroke-[3]" />
                    <span>Copied Successfully!</span>
                  </>
                ) : (
                  <>
                    <Clipboard size={20} className="stroke-[3]" />
                    <span>Copy for Telegram</span>
                  </>
                )}
              </button>
            </div>
            
            {/* Shop Footer */}
            <div className="px-8 pb-8 pt-0">
               <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
                 <h4 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">Shop Configuration</h4>
                 <div className="grid grid-cols-2 gap-4">
                    
                    {/* Telegram */}
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                        <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
                            <MessageCircle size={16} />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-[10px] text-gray-400 uppercase font-bold">Telegram</span>
                            <span className="text-xs font-medium truncate">{SHOP_CONFIG.telegramUser}</span>
                        </div>
                    </div>

                    {/* Hours */}
                     <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                        <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
                            <Clock size={16} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 uppercase font-bold">Open Hours</span>
                            <span className="text-xs font-medium truncate">{SHOP_CONFIG.shopHours}</span>
                        </div>
                    </div>

                    {/* KPay */}
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                            <CreditCard size={16} />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-[10px] text-gray-400 uppercase font-bold">KBZ Pay</span>
                            <span className="text-xs font-medium truncate">{SHOP_CONFIG.kpayNumber}</span>
                        </div>
                    </div>

                    {/* Wave */}
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                        <div className="p-2 rounded-lg bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 shrink-0">
                            <Waves size={16} />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-[10px] text-gray-400 uppercase font-bold">Wave Pay</span>
                            <span className="text-xs font-medium truncate">{SHOP_CONFIG.waveNumber}</span>
                        </div>
                    </div>

                 </div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}