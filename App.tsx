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
  ClipboardPaste
} from 'lucide-react';

// --- Types ---

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

// Initial state constant
const INITIAL_STATE: FormData = {
  username: '',
  purchaseDate: new Date().toISOString().split('T')[0],
  durationIdx: 0, // Default to 1 Month
  dataPlan: '',
  outlineKey: '',
};

// --- Helper Functions ---

const formatDateForDisplay = (dateString: string): string => {
  if (!dateString) return 'DD/MM/YYYY';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

const calculateExpireDate = (startDate: string, monthsToAdd: number): string => {
  if (!startDate) return '';
  const date = new Date(startDate);
  // Add months
  date.setMonth(date.getMonth() + monthsToAdd);
  
  // Format back to YYYY-MM-DD for consistency in logic
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function App() {
  // Theme State
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem('theme');
      return (stored === 'light' ? 'light' : 'dark');
    }
    return 'dark';
  });

  const [formData, setFormData] = useState<FormData>(INITIAL_STATE);
  const [copied, setCopied] = useState(false);

  // Apply Theme Effect
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Derived state for display
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

💸 **ငွေလွှဲရန် (KPay):**
09964520268 (Htet Aung Lin)

-----------------------------
⏰ **ဆိုင်ဖွင့်ချိန်:** ည ၆ နာရီ မှ ၁၀ နာရီ အထိ
🆘 အကူအညီလိုပါက **@nolan112002** သို့ ဆက်သွယ်နိုင်ပါသည်။
⚡ ၁၀ မိနစ်အတွင်း စာမပြန်ပါက **09964520268** သို့ ဖုန်းခေါ်ဆိုနိုင်ပါသည်။

နောက်လည်း လာရောက်အားပေးဖို့ ဖိတ်ခေါ်ပါတယ်ခင်ဗျာ။ ❤️`;
  }, [formData, formattedPurchaseDate, formattedExpireDate]);

  // --- Handlers ---

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    if (window.confirm('Customer အသစ်အတွက် Data များကို ရှင်းမလား?')) {
      setFormData(prev => ({
        ...prev,
        username: '',       // Clear Username
        dataPlan: '',       // Clear Data Plan
        outlineKey: '',     // Clear Key
        durationIdx: 0,     // Reset Duration to 1 Month
        // purchaseDate: prev.purchaseDate // (Option A: Keep selected date)
        purchaseDate: new Date().toISOString().split('T')[0] // (Option B: Reset to Today - As requested)
      }));
      setCopied(false);
    }
  };

  const handleCopy = async () => {
    if (!formData.username.trim() || !formData.outlineKey.trim()) {
      alert("Please fill in Username and Key first!");
      return;
    }

    try {
      await navigator.clipboard.writeText(generatedMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handlePasteKey = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setFormData(prev => ({ ...prev, outlineKey: text }));
      }
    } catch (err) {
      const textArea = document.querySelector('textarea[name="outlineKey"]') as HTMLTextAreaElement;
      if (textArea) textArea.focus();
      alert('Browser prevented automatic pasting. Please press Ctrl+V manually.');
    }
  };

  return (
    <div className="min-h-screen py-6 px-4 md:py-12 md:px-8 font-sans transition-colors duration-300 bg-gray-100 dark:bg-slate-900 text-gray-900 dark:text-white flex items-center justify-center">
      
      <div className="w-full max-w-6xl bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-colors duration-300 border border-gray-200 dark:border-slate-700/50">
        
        {/* Header Bar */}
        <div className="bg-indigo-600 px-6 py-5 md:px-8 flex items-center justify-between shadow-md z-10 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          
          <div className="flex items-center gap-3 relative z-10">
            <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm shadow-inner">
              <Send className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">VPN Invoice</h1>
              <p className="text-indigo-100 text-xs md:text-sm font-medium opacity-90">Generator 6.0</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 relative z-10">
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-indigo-700/50 text-white/90 hover:bg-white/20 hover:text-white transition-all active:scale-95 border border-indigo-500/30"
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

        <div className="flex flex-col lg:flex-row flex-1">
          
          {/* Left Panel: Form */}
          <div className="flex-1 p-6 md:p-8 space-y-6">
            <div className="space-y-1 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Order Details</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Fill in the customer information below.</p>
            </div>

            <div className="space-y-6">
              {/* Username Input - Added autoComplete="off" */}
              <div className="group">
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 ml-1">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    name="username"
                    autoComplete="off" 
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter customer name"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date Picker */}
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
                      onChange={(e) => setFormData({...formData, durationIdx: parseInt(e.target.value)})}
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

              {/* Data Plan - Added autoComplete="off" */}
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

              {/* Outline Key - Added autoComplete="off" */}
              <div className="group">
                <div className="flex justify-between items-center mb-2">
                   <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">
                    Outline Key
                  </label>
                  <button
                    onClick={handlePasteKey}
                    className="text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center gap-1 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                    title="Paste from clipboard"
                  >
                    <ClipboardPaste size={14} /> Paste
                  </button>
                </div>
                
                <div className="relative">
                  <div className="absolute top-3.5 left-4 pointer-events-none text-gray-400">
                    <Key size={18} />
                  </div>
                  <textarea
                    name="outlineKey"
                    autoComplete="off"
                    value={formData.outlineKey}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Paste ss:// key here..."
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-gray-900 dark:text-white font-mono text-sm placeholder-gray-400 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Preview & Actions */}
          <div className="lg:w-5/12 bg-gray-50 dark:bg-slate-900/50 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-slate-700 flex flex-col">
            
            <div className="p-6 md:p-8 flex-1 flex flex-col min-h-[400px]">

              {/* Full Message Preview */}
              <div className="flex-1 flex flex-col mb-6">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Full Message Preview
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    TELEGRAM
                  </span>
                </div>

                <div className="flex-1 relative rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm overflow-hidden group">
                  <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-4">
                    <div className="text-sm leading-relaxed whitespace-pre-wrap text-gray-800 dark:text-gray-200 break-words font-sans">
                      {generatedMessage.split('\n').map((line, i) => {
                        if (line.includes('**')) {
                            const parts = line.split('**');
                            return (
                              <div key={i} className="min-h-[1.4em]">
                                  {parts.map((part, pIdx) => (
                                      pIdx % 2 === 1 ? <strong key={pIdx} className="font-bold text-gray-900 dark:text-white">{part}</strong> : <span key={pIdx}>{part}</span>
                                  ))}
                              </div>
                            );
                          }
                          if (line.trim().startsWith('`') && line.trim().endsWith('`')) {
                             return (
                                 <div key={i} className="my-3 p-3 rounded-lg bg-gray-100 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 font-mono text-xs break-all text-indigo-600 dark:text-indigo-300 select-all">
                                     {line.replace(/`/g, '')}
                                 </div>
                             )
                          }
                          if (line.includes('---')) {
                              return <div key={i} className="h-px bg-gray-200 dark:bg-slate-700 my-3"></div>
                          }
                          return <div key={i} className="min-h-[1.4em]">{line}</div>;
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Primary Action Button */}
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
                    <span>Copied! ✅</span>
                  </>
                ) : (
                  <>
                    <Clipboard size={20} className="stroke-[3]" />
                    <span>Copy for Telegram</span>
                  </>
                )}
              </button>
            </div>
            
            {/* Hardcoded Footer Info Display */}
            <div className="px-8 pb-8 pt-0">
               <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
                 <h4 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">Support Info</h4>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                        <div className="p-2 rounded-lg bg-indigo-50 dark:bg-slate-800/80 text-indigo-600 dark:text-indigo-400">
                            <MessageCircle size={16} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 uppercase font-bold">Telegram</span>
                            <span className="text-xs font-medium">@nolan112002</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                        <div className="p-2 rounded-lg bg-indigo-50 dark:bg-slate-800/80 text-indigo-600 dark:text-indigo-400">
                            <Phone size={16} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 uppercase font-bold">Phone</span>
                            <span className="text-xs font-medium">09964520268</span>
                        </div>
                    </div>
                     <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 col-span-2">
                        <div className="p-2 rounded-lg bg-indigo-50 dark:bg-slate-800/80 text-indigo-600 dark:text-indigo-400">
                            <Store size={16} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 uppercase font-bold">Shop Hours</span>
                            <span className="text-xs font-medium">6:00 PM - 10:00 PM</span>
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