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
  Clock,
  ClipboardPaste,
  ShieldCheck,
  CreditCard,
  Waves,
  Smartphone,
  AlertCircle,
  MessageCircle
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

const STORAGE_KEY = 'vpn_invoice_draft_v8_4';

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
  smartKey: string;
}

const INITIAL_STATE: FormData = {
  username: '',
  purchaseDate: new Date().toISOString().split('T')[0],
  durationIdx: 0,
  dataPlan: '',
  outlineKey: '',
  smartKey: '',
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
  
  // Notification State
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  // --- EFFECTS ---

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

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
    // v8.4 Update:
    // Main Key = Block Code (Triple Backticks) for clear separation
    // Smart Key = Inline Code (Single Backticks) for easy "Tap to Copy" on Mobile
    
    const mainKeyPart = formData.outlineKey 
      ? `\`\`\`\n${formData.outlineKey.trim()}\n\`\`\`` 
      : '```\n[MAIN KEY]\n```';
    
    let smartKeySection = '';
    if (formData.smartKey && formData.smartKey.trim() !== '') {
      smartKeySection = `
👇 **Smart Key (Data ကြည့်ရန် ဤ Key ကိုသုံးပါ)** 👇
\`${formData.smartKey.trim()}\``;
    }

    const formattedHours = SHOP_CONFIG.shopHours
      .replace(/PM/g, "နာရီ")
      .replace(/AM/g, "နာရီ")
      .replace(/:00/g, "");

    return `🎉 **ဝယ်ယူအားပေးမှုအတွက် ကျေးဇူးအထူးတင်ပါတယ်ခင်ဗျာ** 🙏

👤 **Username:** ${formData.username || '[Username]'}
📅 **Start Date:** ${formattedPurchaseDate}
🛑 **Expire Date:** ${formattedExpireDate}
📦 **Data Plan:** ${formData.dataPlan || '0'} GB

👇 **Outline Key ကို ယူရန် Copy နှိပ်ပါ** 👇
${mainKeyPart}
${smartKeySection}

💸 **ငွေလွှဲရန် (KPay):**
${SHOP_CONFIG.kpayNumber} (${SHOP_CONFIG.kpayName})

-----------------------------
⏰ **ဆိုင်ဖွင့်ချိန်:** ${formattedHours} အထိ
🆘 အကူအညီလိုပါက **${SHOP_CONFIG.telegramUser}** သို့ ဆက်သွယ်နိုင်ပါသည်။
⚡ ၁၀ မိနစ်အတွင်း စာမပြန်ပါက **${SHOP_CONFIG.phoneNumber}** သို့ ဖုန်းခေါ်ဆိုနိုင်ပါသည်။

နောက်လည်း လာရောက်အားပေးဖို့ ဖိတ်ခေါ်ပါတယ်ခင်ဗျာ။ ❤️`;
  }, [formData, formattedPurchaseDate, formattedExpireDate]);

  // --- HANDLERS ---

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'username' || name === 'outlineKey') {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleReset = () => {
    if (window.confirm('Clear all fields and reset form?')) {
      const newState = {
        ...INITIAL_STATE,
        purchaseDate: new Date().toISOString().split('T')[0]
      };
      setFormData(newState);
      setErrors({ username: false, outlineKey: false });
      setCopied(false);
      localStorage.removeItem(STORAGE_KEY);
      setNotification({ type: 'success', message: 'Form reset successfully' });
    }
  };

  const handlePaste = async (field: 'outlineKey' | 'smartKey') => {
    const targetElement = document.querySelector(`textarea[name="${field}"]`) as HTMLTextAreaElement;

    if (!window.isSecureContext) {
      setNotification({ 
        type: 'error', 
        message: 'Clipboard requires HTTPS (Secure Context). Please paste manually.' 
      });
      if (targetElement) targetElement.focus();
      return;
    }

    if (!navigator.clipboard?.readText) {
       setNotification({ 
        type: 'error', 
        message: 'Clipboard API not supported. Please paste manually.' 
      });
      if (targetElement) targetElement.focus();
      return;
    }

    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setFormData(prev => ({ ...prev, [field]: text }));
        if (field === 'outlineKey') setErrors(prev => ({ ...prev, outlineKey: false }));
        setNotification({ type: 'success', message: 'Pasted successfully!' });
      } else {
        setNotification({ type: 'error', message: 'Clipboard is empty.' });
      }
    } catch (err: any) {
      console.error("Clipboard paste error:", err);
      let errorMessage = 'Failed to read clipboard.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMessage = 'Permission denied. Click the lock icon in your URL bar to allow clipboard access.';
      } else if (err.name === 'SecurityError') {
        errorMessage = 'Security settings blocked access.';
      }
      setNotification({ type: 'error', message: errorMessage });
      if (targetElement) targetElement.focus();
    }
  };

  const handleCopy = async () => {
    const newErrors = {
      username: !formData.username.trim(),
      outlineKey: !formData.outlineKey.trim()
    };

    if (newErrors.username || newErrors.outlineKey) {
      setErrors(newErrors);
      setNotification({ type: 'error', message: 'Please fill in required fields.' });
      return;
    }

    try {
      await navigator.clipboard.writeText(generatedMessage);
      setCopied(true);
      setNotification({ type: 'success', message: 'Invoice copied to clipboard!' });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setNotification({ type: 'error', message: 'Failed to copy. Please select text manually.' });
    }
  };

  return (
    <div className="min-h-screen py-6 px-4 md:py-12 md:px-8 font-sans transition-colors duration-300 bg-gray-100 dark:bg-slate-900 text-gray-900 dark:text-white flex items-center justify-center relative">
      
      {/* Notification */}
      {notification && (
        <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 px-6 py-4 rounded-xl shadow-2xl z-50 flex items-start md:items-center gap-3 animate-[fade-in-down_0.3s_ease-out] border max-w-sm md:max-w-md w-full ${
          notification.type === 'error' 
            ? 'bg-red-50 dark:bg-red-900/90 border-red-200 dark:border-red-800 text-red-800 dark:text-red-100' 
            : 'bg-emerald-50 dark:bg-emerald-900/90 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-100'
        }`}>
          {notification.type === 'error' 
            ? <AlertCircle size={20} className="shrink-0 mt-0.5 md:mt-0" /> 
            : <CheckCircle2 size={20} className="shrink-0 mt-0.5 md:mt-0" />
          }
          <span className="text-sm font-semibold leading-tight">{notification.message}</span>
        </div>
      )}

      <div className="w-full max-w-6xl bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-gray-200 dark:border-slate-700/50 transition-all duration-300">
        
        {/* Header */}
        <div className="bg-indigo-600 px-6 py-5 md:px-8 flex items-center justify-between shadow-md relative overflow-hidden shrink-0">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="flex items-center gap-3 relative z-10">
            <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm shadow-inner text-white">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-tight">{SHOP_CONFIG.shopName}</h1>
              <p className="text-indigo-100 text-xs md:text-sm font-medium opacity-90">Invoice Generator v8.4</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 relative z-10">
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-indigo-700/50 text-white/90 hover:bg-white/20 hover:text-white transition-all hover:scale-105 active:scale-95 border border-indigo-500/30"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              onClick={handleReset}
              className="p-2.5 rounded-xl bg-indigo-700/50 text-white/90 hover:bg-white/20 hover:text-white transition-all hover:scale-105 active:scale-95 border border-indigo-500/30"
              title="Reset Form"
            >
              <RotateCcw size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row flex-1">
          
          {/* LEFT: Form */}
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
              
              {/* Username */}
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
              </div>

              {/* Date & Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    onClick={() => handlePaste('outlineKey')}
                    className="text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center gap-1.5 hover:text-indigo-800 dark:hover:text-indigo-300 transition-all hover:scale-105 active:scale-95 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-md"
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
              </div>

              {/* Smart Key */}
              <div className="group">
                <div className="flex justify-between items-center mb-2 px-1">
                   <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Smart Key <span className="text-gray-400 font-normal lowercase">(optional)</span>
                  </label>
                  <button
                    onClick={() => handlePaste('smartKey')}
                    className="text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center gap-1.5 hover:text-indigo-800 dark:hover:text-indigo-300 transition-all hover:scale-105 active:scale-95 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-md"
                  >
                    <ClipboardPaste size={14} /> 
                    <span>Paste</span>
                  </button>
                </div>
                
                <div className="relative">
                  <div className="absolute top-3.5 left-4 pointer-events-none text-gray-400">
                    <Smartphone size={18} />
                  </div>
                  <textarea
                    name="smartKey"
                    autoComplete="off"
                    value={formData.smartKey}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="Paste smart key here (Optional)"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-gray-900 dark:text-white font-mono text-xs md:text-sm placeholder-gray-400 resize-none custom-scrollbar"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT: Preview */}
          <div className="lg:w-5/12 bg-gray-50 dark:bg-slate-900/50 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-slate-700 flex flex-col">
            
            <div className="p-6 md:p-8 flex-1 flex flex-col min-h-[450px]">

              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <Send size={14} /> Telegram Preview
                </h3>
                <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 tracking-wide">
                  LIVE
                </span>
              </div>

              <div className="flex-1 relative rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm overflow-hidden group mb-6">
                <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-5">
                  <div className="text-sm leading-relaxed whitespace-pre-wrap text-gray-800 dark:text-gray-200 break-words font-sans selection:bg-indigo-500/30">
                    {generatedMessage.split('\n').map((line, i) => {
                      // 1. Block Code (Triple Backticks) - For Main Key
                      if (line.trim().startsWith('```')) {
                           const content = line.replace(/```/g, '').trim();
                           return (
                               <div key={i} className="my-2 p-3 rounded-lg bg-gray-100 dark:bg-slate-900/80 border border-gray-200 dark:border-slate-700 font-mono text-xs break-all text-indigo-600 dark:text-indigo-400 select-all shadow-sm">
                                   {content}
                               </div>
                           )
                      }
                      
                      // 2. Inline Code (Single Backticks) - For Smart Key
                      if (line.includes('`')) {
                        const parts = line.split('`');
                        return (
                          <div key={i} className="min-h-[1.5em] my-1 leading-loose">
                            {parts.map((part, pIdx) => (
                                pIdx % 2 === 1 ? (
                                  <span key={pIdx} className="px-1.5 py-0.5 mx-0.5 rounded-md bg-indigo-100 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 font-mono text-xs text-indigo-700 dark:text-indigo-300 select-all cursor-pointer font-medium hover:bg-indigo-200 dark:hover:bg-indigo-500/30 transition-colors">
                                    {part}
                                  </span>
                                ) : (
                                  <span key={pIdx}>{part}</span>
                                )
                            ))}
                          </div>
                        )
                      }

                      // 3. Bold Text
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

                      // 4. Separator
                      if (line.includes('-----------------------------')) {
                          return <div key={i} className="h-px bg-gray-200 dark:bg-slate-700 my-4"></div>
                      }
                      
                      return <div key={i} className="min-h-[1.5em]">{line}</div>;
                    })}
                  </div>
                </div>
              </div>

              <button
                onClick={handleCopy}
                className={`w-full py-4 px-6 rounded-xl font-bold text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2.5 ${
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
            
            {/* Footer */}
            <div className="px-8 pb-8 pt-0">
               <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
                 <h4 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">Shop Configuration</h4>
                 <div className="grid grid-cols-2 gap-4">
                    
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                        <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
                            <MessageCircle size={16} />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-[10px] text-gray-400 uppercase font-bold">Telegram</span>
                            <span className="text-xs font-medium truncate">{SHOP_CONFIG.telegramUser}</span>
                        </div>
                    </div>

                     <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                        <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
                            <Clock size={16} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 uppercase font-bold">Open Hours</span>
                            <span className="text-xs font-medium truncate">{SHOP_CONFIG.shopHours}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                            <CreditCard size={16} />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-[10px] text-gray-400 uppercase font-bold">KBZ Pay</span>
                            <span className="text-xs font-medium truncate">{SHOP_CONFIG.kpayNumber}</span>
                        </div>
                    </div>

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