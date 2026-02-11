
import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, Lock, Mail, Sparkles, Wallet, Eye, EyeOff, 
  ChevronLeft, X, Fingerprint, LogOut, ShoppingCart, Radio,
  Send, Flame, Package, Video, Heart, MessageSquare, Camera,
  RefreshCcw, Star, CheckCircle2, TrendingUp, Search
} from 'lucide-react';
import { View, Order, ChatMessage, Product } from './types';
import { getFashionAdvice, analyzeBodyScan } from './services/geminiService';

const MOCK_ORDERS: Order[] = [
  { id: 'ORD-5501', item: 'Neo-Tokyo Tech-Tee', status: 'shipping', price: '22,000', date: 'Today', image: 'https://picsum.photos/seed/tee1/200/200' },
  { id: 'ORD-4402', item: 'Cyber-Cargo Pants', status: 'completed', price: '45,000', date: 'Yesterday', image: 'https://picsum.photos/seed/pants/200/200' },
  { id: 'ORD-3312', item: 'Hologram Bomber', status: 'pending', price: '85,000', date: 'Oct 12', image: 'https://picsum.photos/seed/bomber/200/200' }
];

const MOCK_FEED: Product[] = [
  {
    id: 1,
    user: "MNFP_Official",
    desc: "Cyberpunk Tech-Tee is here! Use our AI Scan to find your perfect fit in seconds. Limited drop available now.",
    video: "https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-light-t-shirt-34351-large.mp4",
    likes: "2.4K",
    price: "22,000",
    thumbnail: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800"
  },
  {
    id: 2,
    user: "TechStyle_Labs",
    desc: "The future of cargo is here. Breathable, water-resistant, and motion-optimized.",
    video: "https://assets.mixkit.co/videos/preview/mixkit-man-dancing-under-neon-lights-1044-large.mp4",
    likes: "1.8K",
    price: "45,000",
    thumbnail: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800"
  }
];

export default function App() {
  const [view, setView] = useState<View>('auth');
  const [pin, setPin] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [activeOrderTab, setActiveOrderTab] = useState('all');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'ai', text: 'Hello! I am your MNFP AI Stylist. How can I help you today?', timestamp: new Date() }
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanResult, setScanResult] = useState<{size: string, shape: string, tips: string[]} | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handlePinInput = (num: number) => {
    if (pin.length < 6) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 6) {
        setTimeout(() => setView('home'), 500);
      }
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  const captureAndAnalyze = async () => {
    if (videoRef.current && canvasRef.current) {
      setIsAnalyzing(true);
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0);
        const base64 = canvasRef.current.toDataURL('image/jpeg').split(',')[1];
        try {
          const result = await analyzeBodyScan(base64);
          setScanResult(result);
        } catch (error) {
          console.error("AI Analysis Error", error);
        } finally {
          setIsAnalyzing(false);
        }
      }
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text, timestamp: new Date() };
    setChatMessages(prev => [...prev, userMsg]);
    
    try {
      const aiResponse = await getFashionAdvice(text, []);
      const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), sender: 'ai', text: aiResponse || "Sorry, I couldn't process that.", timestamp: new Date() };
      setChatMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("Chat error:", error);
    }
  };

  // --- Views ---

  const AuthView = () => (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-8 space-y-12">
      <div className="text-center space-y-4">
        <div className="w-24 h-24 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-indigo-600/40 border border-white/10 animate-float">
          <Sparkles size={48} className="text-white" />
        </div>
        <h1 className="text-4xl font-black italic text-white tracking-tighter">MNFP <span className="text-indigo-500">AI</span></h1>
        <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.4em]">The Ultimate Fashion Ecosystem</p>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input type="email" placeholder="Email Address" className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white outline-none focus:border-indigo-500 font-bold text-sm transition-all" />
          </div>
          <div className="relative">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input type={showPassword ? "text" : "password"} placeholder="Password" className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-14 text-white outline-none focus:border-indigo-500 font-bold text-sm transition-all" />
            <button onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <button onClick={() => setView('pin')} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95">Sign In</button>
        <p className="text-center text-[10px] font-black text-slate-500 uppercase tracking-widest cursor-pointer hover:text-indigo-400 transition-colors">Create New Account</p>
      </div>
    </div>
  );

  const PinView = () => (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-8 animate-in zoom-in-95">
      <ShieldCheck size={48} className="text-indigo-500 mb-8" />
      <h2 className="text-xl font-black text-white mb-2 uppercase tracking-tight">Security Access</h2>
      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-12">Enter your 6-digit PIN</p>
      <div className="flex gap-4 mb-16">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 ${pin.length > i ? 'bg-indigo-500 border-indigo-500 scale-125 shadow-[0_0_15px_rgba(79,70,229,0.5)]' : 'border-slate-800'}`}></div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-8 max-w-xs w-full">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button key={num} onClick={() => handlePinInput(num)} className="h-16 w-16 rounded-3xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-xl text-white font-black transition-all active:scale-90">{num}</button>
        ))}
        <div className="flex items-center justify-center text-indigo-500"><Fingerprint size={28}/></div>
        <button onClick={() => handlePinInput(0)} className="h-16 w-16 rounded-3xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-xl text-white font-black transition-all active:scale-90">0</button>
        <button onClick={() => setPin("")} className="h-16 w-16 rounded-3xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-xl text-white font-black transition-all active:scale-90 text-rose-500"><X size={24}/></button>
      </div>
    </div>
  );

  const HomeView = () => (
    <div className="space-y-8 animate-in fade-in duration-500 pb-24">
      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
        <input type="text" placeholder="Search tech-wear, drops, styles..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white text-sm outline-none focus:border-indigo-500/50 transition-all" />
      </div>

      {/* Live Highlight Card */}
      <div onClick={() => setView('live')} className="relative aspect-video rounded-[2.5rem] overflow-hidden group cursor-pointer border border-white/5">
        <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800" className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
        <div className="absolute top-4 left-4 bg-rose-600 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase text-white flex items-center gap-1.5 animate-pulse">
          <Radio size={12} /> Live Drop
        </div>
        <div className="absolute bottom-6 left-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full border-2 border-indigo-500 p-1 bg-black/40 backdrop-blur-md">
             <div className="w-full h-full bg-indigo-600 rounded-full flex items-center justify-center text-[10px] font-black">MN</div>
          </div>
          <div>
            <p className="text-sm font-black text-white">MNFP Genesis Collection</p>
            <p className="text-[10px] text-slate-400 font-bold">1,248 Pioneers Watching</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
         <button onClick={() => { setView('scan'); startCamera(); }} className="bg-indigo-600/10 p-6 rounded-[2.5rem] border border-indigo-500/20 text-left group transition-all hover:bg-indigo-600">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-white group-hover:text-indigo-600 transition-colors shadow-lg">
              <Sparkles size={24} />
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-white">AI Body Scan</p>
            <p className="text-[10px] text-slate-500 font-bold group-hover:text-white/80 transition-colors uppercase">Find Perfect Size</p>
         </button>
         <button className="bg-white/5 p-6 rounded-[2.5rem] border border-white/5 text-left group hover:bg-white/10 transition-all">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <TrendingUp size={24} className="text-indigo-500" />
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-white">Trending</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase">Viral Styles</p>
         </button>
      </div>

      {/* Product Feed */}
      {MOCK_FEED.map(post => (
        <div key={post.id} className="bg-[#0a0f1e] rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl transition-all hover:-translate-y-1">
          <div className="aspect-[4/5] relative">
            <video src={post.video} className="w-full h-full object-cover" autoPlay loop muted playsInline />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent"></div>
            <button className="absolute bottom-6 right-6 w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-indigo-600/40 hover:bg-indigo-500 transition-all active:scale-90">
              <ShoppingCart size={28}/>
            </button>
            <div className="absolute top-6 right-6 flex flex-col gap-3">
              <button className="p-3 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"><Heart size={20}/></button>
              <button className="p-3 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 text-white hover:bg-indigo-600 transition-all"><MessageSquare size={20}/></button>
            </div>
          </div>
          <div className="p-8 space-y-4">
             <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border-2 border-white/10"></div>
                   <div className="flex flex-col">
                      <span className="text-sm font-black text-white">@{post.user}</span>
                      <span className="text-[10px] text-slate-500 font-bold">Verified Designer</span>
                   </div>
                </div>
                <span className="text-xl font-black text-indigo-400 tracking-tighter">{post.price} K</span>
             </div>
             <p className="text-sm font-medium text-slate-300 leading-relaxed line-clamp-2">{post.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );

  const LiveView = () => (
    <div className="fixed inset-0 z-[200] bg-black">
       <video src="https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-light-t-shirt-34351-large.mp4" className="w-full h-full object-cover opacity-80" autoPlay loop muted playsInline />
       <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90"></div>
       
       <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-10">
          <div className="flex items-center gap-3 bg-black/60 backdrop-blur-2xl p-2 pr-5 rounded-full border border-white/20">
             <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/40">M</div>
             <div className="leading-tight">
                <p className="text-xs font-black text-white">MNFP Live Studio</p>
                <p className="text-[9px] font-bold text-emerald-400 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse"></span> 1.2K Watching</p>
             </div>
          </div>
          <button onClick={() => setView('home')} className="p-4 bg-black/60 backdrop-blur-2xl rounded-full border border-white/20 text-white hover:bg-white/10 transition-all"><X /></button>
       </div>

       <div className="absolute bottom-12 left-6 right-6 space-y-6">
          <div className="h-48 overflow-y-auto space-y-3 mask-fade custom-scrollbar pr-2">
             <div className="bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/10 w-fit">
                <p className="text-xs font-bold text-indigo-400">Kyaw Kyaw: <span className="text-slate-200">Are there more colors available?</span></p>
             </div>
             <div className="bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/10 w-fit">
                <p className="text-xs font-bold text-indigo-400">Su Su: <span className="text-slate-200">Adding Medium to cart! Love the glow.</span></p>
             </div>
             <div className="bg-indigo-600/40 backdrop-blur-md p-3 rounded-2xl border border-white/20 w-fit">
                <p className="text-xs font-black text-white">SYSTEM: <span className="text-white/90">Only 5 items left in stock.</span></p>
             </div>
          </div>
          
          <div className="flex items-center gap-4 bg-white p-4 rounded-3xl shadow-2xl">
            <img src="https://picsum.photos/seed/drop/100/100" className="w-12 h-12 rounded-xl object-cover border border-slate-100" />
            <div className="flex-1">
              <p className="text-[10px] font-black text-slate-400 uppercase">Flash Deal</p>
              <p className="text-sm font-black text-slate-900">Neo-Tokyo Tee</p>
            </div>
            <button className="bg-indigo-600 px-6 py-2.5 rounded-2xl text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20 active:scale-95 transition-all">Buy Now</button>
          </div>

          <div className="flex gap-3">
             <div className="flex-1 bg-white/10 backdrop-blur-2xl rounded-3xl p-1.5 flex items-center border border-white/20">
                <input type="text" placeholder="Chat with viewers..." className="flex-1 bg-transparent px-5 py-3 text-sm text-white outline-none placeholder:text-white/40" />
                <button className="p-3.5 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-500 transition-all active:scale-90"><Send size={18}/></button>
             </div>
             <button className="w-14 h-14 bg-white/10 backdrop-blur-2xl rounded-3xl flex items-center justify-center text-rose-500 border border-white/20 hover:bg-rose-500 hover:text-white transition-all"><Heart size={24} fill="currentColor"/></button>
          </div>
       </div>
    </div>
  );

  const ScanView = () => (
    <div className="min-h-screen flex flex-col items-center bg-[#020617] animate-in slide-in-from-bottom-4">
      <div className="w-full p-6 flex items-center justify-between">
         <button onClick={() => setView('home')} className="p-3 bg-white/5 rounded-2xl text-white"><ChevronLeft/></button>
         <h2 className="text-xl font-black text-white uppercase tracking-widest">AI Body Scan</h2>
         <div className="w-10"></div>
      </div>

      <div className="flex-1 w-full flex flex-col items-center justify-center p-8 space-y-8">
        {!scanResult ? (
          <>
            <div className="relative w-full aspect-[3/4] rounded-[3rem] overflow-hidden border-2 border-indigo-500 shadow-2xl shadow-indigo-600/20 group">
               <video ref={videoRef} className="w-full h-full object-cover grayscale brightness-110" autoPlay playsInline />
               <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none"></div>
               <div className="absolute inset-12 border border-indigo-500/50 rounded-[2rem] flex items-center justify-center pointer-events-none">
                  <div className="w-full h-0.5 bg-indigo-500/50 absolute top-1/2 -translate-y-1/2 animate-[scan_2s_ease-in-out_infinite]"></div>
               </div>
               {isAnalyzing && (
                 <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center space-y-4">
                    <RefreshCcw className="text-indigo-500 animate-spin" size={48} />
                    <p className="text-xs font-black text-white uppercase tracking-[0.3em]">Analyzing Dimensions...</p>
                 </div>
               )}
            </div>
            <p className="text-center text-slate-500 text-xs font-bold leading-relaxed max-w-[250px]">
              Stand 5 feet away from the camera for an accurate body-frame analysis.
            </p>
            <button 
              onClick={captureAndAnalyze}
              disabled={isAnalyzing}
              className="w-full max-w-sm bg-indigo-600 text-white py-6 rounded-[2.5rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-2xl shadow-indigo-600/40 hover:bg-indigo-500 active:scale-95 transition-all disabled:opacity-50"
            >
               <Camera size={20} /> Start AI Scan
            </button>
          </>
        ) : (
          <div className="w-full space-y-6 animate-in zoom-in-95">
             <div className="bg-indigo-600/10 border border-indigo-500/20 p-8 rounded-[3rem] text-center space-y-4">
                <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
                   <CheckCircle2 size={32} className="text-white" />
                </div>
                <div>
                   <h3 className="text-2xl font-black text-white">Scan Complete</h3>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Profile: {scanResult.shape}</p>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 p-6 rounded-[2.5rem]">
                   <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Recommended Size</p>
                   <p className="text-3xl font-black text-indigo-500">{scanResult.size}</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-[2.5rem] flex items-center justify-center">
                   <Star size={32} className="text-amber-500 fill-amber-500" />
                </div>
             </div>

             <div className="bg-white/5 border border-white/10 p-8 rounded-[3rem] space-y-4">
                <p className="text-xs font-black text-white uppercase tracking-widest">Style Tips</p>
                <div className="space-y-3">
                   {scanResult.tips.map((tip, i) => (
                      <div key={i} className="flex gap-3">
                         <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></div>
                         <p className="text-sm text-slate-400 font-medium leading-tight">{tip}</p>
                      </div>
                   ))}
                </div>
             </div>

             <button onClick={() => { setScanResult(null); startCamera(); }} className="w-full py-5 rounded-[2rem] border border-white/10 text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-all">Retake Scan</button>
             <button onClick={() => setView('home')} className="w-full bg-indigo-600 text-white py-6 rounded-[2.5rem] font-black uppercase tracking-widest text-xs shadow-2xl shadow-indigo-600/20">Back to Shop</button>
          </div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
      <style>{`
        @keyframes scan {
          0%, 100% { top: 0%; }
          50% { top: 100%; }
        }
      `}</style>
    </div>
  );

  const ChatView = () => {
    const [input, setInput] = useState("");
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    return (
      <div className="fixed inset-0 z-[300] bg-[#020617] flex flex-col">
         <div className="h-24 px-6 border-b border-white/5 flex items-center gap-4 bg-[#0a0f1e]/80 backdrop-blur-xl">
            <button onClick={() => setView('home')} className="p-3 bg-white/5 rounded-2xl text-white"><ChevronLeft/></button>
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg">M</div>
               <div className="leading-tight">
                  <p className="text-sm font-black text-white">AI Fashion Concierge</p>
                  <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Online
                  </p>
               </div>
            </div>
         </div>
         <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">
            {chatMessages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                 <div className={`max-w-[85%] p-5 rounded-[2rem] shadow-xl ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white/5 border border-white/10 text-slate-300 rounded-tl-none'}`}>
                    <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                    <p className="text-[8px] mt-2 opacity-40 uppercase font-black text-right">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                 </div>
              </div>
            ))}
            <div ref={bottomRef} />
         </div>
         <div className="p-6 bg-[#020617] border-t border-white/5">
            <div className="bg-white/5 rounded-[2rem] p-2 flex items-center border border-white/10 shadow-2xl">
               <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (sendMessage(input), setInput(""))}
                placeholder="Ask about trends, sizes, or orders..." 
                className="flex-1 bg-transparent px-6 py-3 text-sm text-white outline-none placeholder:text-slate-500" 
               />
               <button 
                onClick={() => { sendMessage(input); setInput(""); }}
                className="p-4 bg-indigo-600 text-white rounded-3xl hover:bg-indigo-500 transition-all active:scale-95 shadow-xl shadow-indigo-600/20"
               >
                 <Send size={20}/>
               </button>
            </div>
         </div>
      </div>
    );
  };

  const OrdersView = () => (
    <div className="animate-in slide-in-from-right-4 space-y-8 pb-32">
       <div className="flex items-center gap-4">
          <button onClick={() => setView('home')} className="p-3 bg-white/5 rounded-2xl text-white"><ChevronLeft/></button>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">My Wardrobe Orders</h2>
       </div>
       
       <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
          {['all', 'pending', 'shipping', 'completed'].map(tab => (
             <button 
              key={tab} 
              onClick={() => setActiveOrderTab(tab)}
              className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${activeOrderTab === tab ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white/5 border-white/10 text-slate-500 hover:border-white/30'}`}>
               {tab}
             </button>
          ))}
       </div>

       <div className="space-y-6">
          {MOCK_ORDERS.filter(o => activeOrderTab === 'all' || o.status === activeOrderTab).map(order => (
            <div key={order.id} className="bg-[#0a0f1e] p-6 rounded-[3rem] border border-white/5 group transition-all hover:bg-white/5">
               <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-4">
                    <img src={order.image} className="w-16 h-16 rounded-2xl object-cover border border-white/5 shadow-lg" />
                    <div className="flex flex-col justify-center">
                       <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">{order.id}</p>
                       <h4 className="text-base font-black text-white">{order.item}</h4>
                    </div>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-sm ${order.status === 'shipping' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : order.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
                     {order.status}
                  </div>
               </div>
               <div className="space-y-4">
                 <div className="flex items-center gap-4">
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                       <div className={`h-full bg-indigo-500 rounded-full transition-all duration-1000 ${order.status === 'shipping' ? 'w-2/3' : order.status === 'completed' ? 'w-full' : 'w-1/4'}`}></div>
                    </div>
                    <span className="text-sm font-black text-white">{order.price} K</span>
                 </div>
                 <div className="flex gap-3">
                   <button className="flex-1 bg-white/5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 text-slate-300 hover:bg-indigo-600 hover:text-white transition-all">Track</button>
                   <button className="flex-1 bg-white/5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 text-slate-300">Invoice</button>
                 </div>
               </div>
            </div>
          ))}
       </div>
    </div>
  );

  const WalletView = () => (
    <div className="animate-in slide-in-from-right-4 space-y-8 pb-32">
      <div className="flex items-center gap-4">
          <button onClick={() => setView('home')} className="p-3 bg-white/5 rounded-2xl text-white"><ChevronLeft/></button>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">MNFP Wallet</h2>
      </div>

      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
         <div className="relative z-10 space-y-10">
            <div className="flex justify-between items-start">
               <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                  <Flame size={28} className="text-white" />
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Available Credit</p>
                  <p className="text-3xl font-black text-white tracking-tighter">1,450,000 K</p>
               </div>
            </div>
            <div className="flex justify-between items-end">
               <div>
                  <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">Account ID</p>
                  <p className="text-xs font-bold text-white tracking-widest">MNFP-8822-4411</p>
               </div>
               <button className="bg-white text-indigo-600 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">Top Up</button>
            </div>
         </div>
      </div>

      <div className="space-y-6">
         <h3 className="text-sm font-black text-white uppercase tracking-widest px-2">Recent Transactions</h3>
         <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white/5 p-6 rounded-[2.5rem] flex justify-between items-center border border-white/5">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-indigo-400">
                       <Package size={24} />
                    </div>
                    <div>
                       <p className="text-sm font-black text-white">Purchase #ORD-550{i}</p>
                       <p className="text-[10px] text-slate-500 font-bold uppercase">Fashion Category</p>
                    </div>
                 </div>
                 <p className="text-sm font-black text-rose-500">- 22,000 K</p>
              </div>
            ))}
         </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-indigo-500/30">
      {/* Dynamic Header */}
      {view !== 'auth' && view !== 'pin' && view !== 'live' && view !== 'scan' && (
        <header className="h-24 px-6 bg-[#020617]/90 backdrop-blur-2xl border-b border-white/5 flex justify-between items-center sticky top-0 z-50 max-w-xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black italic text-sm text-white shadow-lg shadow-indigo-600/20">M</div>
            <h1 className="font-black tracking-tighter text-xl uppercase">MNFP <span className="text-indigo-500">ECO</span></h1>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setView('chat')} className="p-3.5 bg-white/5 hover:bg-white/10 rounded-2xl relative transition-colors text-white border border-white/10">
              <MessageSquare size={20} />
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-[#020617] animate-pulse"></span>
            </button>
            <button className="p-3.5 bg-white/5 hover:bg-white/10 rounded-2xl text-white transition-colors border border-white/10">
              <Search size={20} />
            </button>
          </div>
        </header>
      )}

      {/* Main Content Router */}
      <main className={`max-w-xl mx-auto w-full min-h-screen ${view === 'live' || view === 'scan' ? 'p-0' : 'p-6'}`}>
        {view === 'auth' && <AuthView />}
        {view === 'pin' && <PinView />}
        {view === 'home' && <HomeView />}
        {view === 'live' && <LiveView />}
        {view === 'scan' && <ScanView />}
        {view === 'chat' && <ChatView />}
        {view === 'orders' && <OrdersView />}
        {view === 'wallet' && <WalletView />}
      </main>

      {/* Floating Bottom Navigation */}
      {view !== 'auth' && view !== 'pin' && view !== 'live' && view !== 'scan' && view !== 'chat' && (
        <nav className="fixed bottom-8 left-6 right-6 max-w-lg mx-auto bg-[#0a0f1e]/80 backdrop-blur-3xl border border-white/10 rounded-[3rem] flex justify-around p-5 shadow-2xl z-40 transition-all">
          <button 
            onClick={() => setView('home')} 
            className={`p-4 rounded-2xl transition-all ${view === 'home' ? 'text-indigo-500 bg-white/10 shadow-inner' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Flame size={24} />
          </button>
          <button 
            onClick={() => setView('orders')} 
            className={`p-4 rounded-2xl transition-all ${view === 'orders' ? 'text-indigo-500 bg-white/10 shadow-inner' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Package size={24} />
          </button>
          <div className="relative -mt-12 group">
            <div className="absolute inset-0 bg-indigo-600 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <button 
              onClick={() => setView('live')} 
              className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-indigo-600/50 border-[6px] border-[#020617] active:scale-95 transition-all"
            >
              <Radio size={32} className="animate-pulse" />
            </button>
          </div>
          <button 
            onClick={() => setView('wallet')} 
            className={`p-4 rounded-2xl transition-all ${view === 'wallet' ? 'text-indigo-500 bg-white/10 shadow-inner' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Wallet size={24} />
          </button>
          <button 
            onClick={() => setView('auth')} 
            className="p-4 text-slate-500 hover:text-rose-500 transition-colors"
          >
            <LogOut size={24} />
          </button>
        </nav>
      )}
    </div>
  );
}
