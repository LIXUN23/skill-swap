import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Search, PhoneIncoming, Video, CheckCircle, 
  LogOut, Loader2, ArrowRight, Shield, Star, ExternalLink, 
  Leaf, Upload, User, ArrowLeft, BookOpen, Users, Clock, 
  MessageSquare, PlusCircle, Layout, Activity, ChevronRight, X,
  RefreshCw, Award, Coins, Bell, Check, XCircle
} from 'lucide-react';

import { SkillSwapLogo } from './components/SkillSwapLogo';

// REPLACE THIS with the URL you just copied from Render
const API_BASE = "https://skill-swap-backend.onrender.com";

const COLORS = {
  bg: "#F4F7F5",
  textMain: "#2A3B32",
  textMuted: "#5F6E66",
  accent: "#5D7A68",
  white: "#FFFFFF",
  successBg: "#E6F4EA",
  successText: "#10B981"
};

const POPULAR_SKILLS = ["Product Design", "Digital Marketing", "Photography", "Public Speaking", "React", "Python"];
const GUIDE_TIPS = [
  "Be specific about skills and learning goals",
  "Match availability before sending requests",
  "Prepare questions before each session",
  "Interact actively and ask doubts",
  "Teach others to earn time credits",
  "Give feedback to build trust",
  "Respond to requests and notifications on time",
  "Start with small sessions and scale gradually",
  "Respect community guidelines and mutual effort"
];

export default function SkillSwapApp() {
  const [view, setView] = useState('login'); 
  const [user, setUser] = useState<any>(null);
  
  // --- STATE ---
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [query, setQuery] = useState('');
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeCall, setActiveCall] = useState<any>(null);
  const [showReview, setShowReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [showGuide, setShowGuide] = useState(false);
  const [navTab, setNavTab] = useState('create'); 
  
  // REAL DATA STATE
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  // --- API CALLS ---
  const doLogin = async () => {
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email, password: pass })
      });
      const data = await res.json();
      if (res.ok) { setUser(data.user); setView('dash'); }
      else alert("Login Failed: " + data.detail);
    } catch (e) { alert("Backend Offline. Run 'python -m uvicorn main:app --reload --host 0.0.0.0'"); }
  };

  const doScan = async (searchQuery = query) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/search?q=${searchQuery || "Python"}`);
      const data = await res.json();
      setMatches(data.matches.filter((m:any) => m.email !== user?.email));
      setLoading(false);
    } catch (e) { setLoading(false); }
  };

  const startCall = async (receiverEmail: string) => {
    if (receiverEmail === user.email) return alert("Cannot request yourself.");
    if (user.credits < 5) return alert("Insufficient credits (Need 5 CR).");

    try {
        const res = await fetch(`${API_BASE}/book`, {
            method: 'POST', headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ caller_email: user.email, receiver_email: receiverEmail })
        });
        if(res.ok) {
           alert("Request Sent! Wait for them to accept.");
           fetchMyRequests(); // Refresh list
           setNavTab('requests'); // Auto-switch tab
        } else {
           alert("Request Failed.");
        }
    } catch(e) { alert("Network Error"); }
  };

  // --- DATA FETCHING ---
  const fetchMyRequests = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API_BASE}/my_requests?email=${user.email}`);
      const data = await res.json();
      setMyRequests(data.requests);
    } catch (e) {}
  };

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API_BASE}/notifications?email=${user.email}`);
      const data = await res.json();
      setNotifications(data.notifications);
    } catch (e) {}
  };

  const handleAccept = async (roomId: string) => {
    await fetch(`${API_BASE}/accept`, {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ room_id: roomId })
    });
    // The poll loop will detect status='ACCEPTED' and start the call
    fetchNotifications();
  };

  const handleReject = async (roomId: string) => {
    await fetch(`${API_BASE}/reject`, {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ room_id: roomId })
    });
    fetchNotifications();
  };

  const submitReview = async () => {
    if (rating === 0) return alert("Please select a rating");
    await fetch(`${API_BASE}/review`, {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ room_id: activeCall.room_id, rating: rating })
    });
    setShowReview(false);
    setActiveCall(null);
    setRating(0);
  };

  // --- POLLING & EFFECTS ---
  useEffect(() => {
    if (!user) return;
    fetchMyRequests();
    fetchNotifications();
    
    const interval = setInterval(async () => {
      // 1. Refresh Data
      fetchMyRequests();
      fetchNotifications();

      // 2. Check for Calls
      try {
        const res = await fetch(`${API_BASE}/poll?email=${user.email}`);
        const data = await res.json();
        
        if (data.incoming && data.data.type === 'call') {
            // FOUND ACCEPTED CALL -> JOIN IMMEDIATELY
            if (!activeCall) {
                setActiveCall({ room_id: data.data.room_id });
            }
        }
      } catch (e) {}
    }, 3000); // Check every 3 seconds

    return () => clearInterval(interval);
  }, [user, activeCall]);

  return (
    <div className={`min-h-screen font-sans selection:bg-[#5D7A68] selection:text-white`} style={{backgroundColor: COLORS.bg, color: COLORS.textMain}}>
      <AnimatePresence mode="wait">
        
        {/* === GUIDE MODAL === */}
        {showGuide && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div initial={{scale:0.95, opacity:0}} animate={{scale:1, opacity:1}} className="bg-white max-w-lg w-full rounded-3xl shadow-2xl overflow-hidden">
               <div className="p-8 bg-[#2A3B32] text-white relative">
                 <button onClick={()=>setShowGuide(false)} className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><X size={20}/></button>
                 <h2 className="font-serif text-3xl font-bold mb-2">Guide to Growth</h2>
                 <p className="opacity-80">Follow these principles for meaningful exchange.</p>
               </div>
               <div className="p-8 space-y-4 max-h-[60vh] overflow-y-auto">
                 <ul className="space-y-4">
                   {GUIDE_TIPS.map((item, i) => (
                     <li key={i} className="flex gap-3 text-[#2A3B32]">
                       <CheckCircle size={20} className="text-[#5D7A68] shrink-0 mt-0.5"/>
                       <span className="leading-relaxed font-medium">{item}</span>
                     </li>
                   ))}
                 </ul>
                 <button onClick={()=>setShowGuide(false)} className="w-full mt-6 py-3 bg-[#5D7A68] text-white rounded-xl font-bold hover:bg-[#2A3B32] transition-colors">Got it, I'm ready</button>
               </div>
            </motion.div>
          </div>
        )}

        {/* === REVIEW MODAL === */}
        {showReview && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-3xl shadow-2xl w-96 text-center">
              <h2 className="text-2xl font-serif font-bold text-[#2A3B32] mb-2">Session Complete</h2>
              <p className="text-[#5F6E66] mb-6">Rate your experience to release credits.</p>
              <div className="flex justify-center gap-2 mb-8">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={32} className={`cursor-pointer transition-colors ${star <= rating ? 'fill-[#EAB308] text-[#EAB308]' : 'text-[#E0E8E3]'}`} onClick={() => setRating(star)}/>
                ))}
              </div>
              <button onClick={submitReview} className="w-full py-3 bg-[#2A3B32] text-white rounded-xl font-bold hover:bg-[#5D7A68]">SUBMIT REVIEW (+{rating * 2} CR)</button>
            </div>
          </div>
        )}

        {/* === VIEW: REGISTER RITUAL === */}
        {view === 'register' && (
           <RegisterRitual onBack={() => setView('login')} onComplete={() => setView('login')} LogoComponent={SkillSwapLogo} />
        )}

        {/* === VIEW: LOGIN === */}
        {view === 'login' && (
          <motion.div key="login" exit={{opacity: 0}} className="flex min-h-screen flex-col lg:flex-row">
            <div className="flex w-full flex-col justify-center bg-gradient-to-br from-[#1A2F25] to-[#0D1812] p-12 lg:w-1/2 lg:p-24 relative overflow-hidden text-white">
               <div className="mb-16"><SkillSwapLogo lightMode={true} size="text-5xl" showTagline={true} /></div>
               <div className="space-y-10 max-w-md">
                 <div className="flex gap-5 items-start"><div className="p-3 rounded-xl bg-white/10 text-[#A3C9B0]"><RefreshCw size={24}/></div><div><h3 className="text-xl font-bold text-white mb-1">Peer-to-Peer Learning</h3><p className="text-white/60 text-sm leading-relaxed">Direct knowledge exchange.</p></div></div>
                 <div className="flex gap-5 items-start"><div className="p-3 rounded-xl bg-white/10 text-[#A3C9B0]"><Award size={24}/></div><div><h3 className="text-xl font-bold text-white mb-1">Skill Verification</h3><p className="text-white/60 text-sm leading-relaxed">Trust built on proof.</p></div></div>
                 <div className="flex gap-5 items-start"><div className="p-3 rounded-xl bg-white/10 text-[#A3C9B0]"><Coins size={24}/></div><div><h3 className="text-xl font-bold text-white mb-1">Earn Credits</h3><p className="text-white/60 text-sm leading-relaxed">Share expertise to earn.</p></div></div>
               </div>
            </div>
            <div className="flex w-full items-center justify-center p-8 lg:w-1/2 bg-[#F4F7F5]">
              <div className="w-full max-w-md bg-white p-12 rounded-3xl shadow-xl border border-[#BCCDBD]/20">
                <div className="mb-10"><h2 className="font-serif text-4xl font-bold text-[#2A3B32]">Welcome Back</h2></div>
                <div className="space-y-6">
                  <div><label className="text-xs font-bold text-[#5F6E66] uppercase ml-1 tracking-wider">Email Identity</label><input className="w-full mt-2 p-4 bg-[#F9FBF9] rounded-xl border border-[#E0E8E3] outline-none focus:border-[#5D7A68] text-[#2A3B32]" placeholder="name@skillswap.io" value={email} onChange={e=>setEmail(e.target.value)} /></div>
                  <div><label className="text-xs font-bold text-[#5F6E66] uppercase ml-1 tracking-wider">Access Code</label><input type="password" className="w-full mt-2 p-4 bg-[#F9FBF9] rounded-xl border border-[#E0E8E3] outline-none focus:border-[#5D7A68] text-[#2A3B32]" placeholder="••••••••" value={pass} onChange={e=>setPass(e.target.value)} /></div>
                  <button onClick={doLogin} className="w-full p-4 bg-[#2A3B32] text-white rounded-xl font-bold shadow-lg hover:bg-[#5D7A68] transition-colors flex justify-center items-center gap-3 text-lg mt-4">Log In <ArrowRight size={20}/></button>
                  <div className="text-center pt-6 border-t border-[#F4F7F5] mt-6"><button onClick={() => setView('register')} className="text-[#5D7A68] font-bold text-base hover:underline">Create Skill Identity</button></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* === VIEW: DASHBOARD === */}
        {view === 'dash' && user && (
          <div className="flex min-h-screen bg-[#2A3B32]">
            {/* SIDEBAR */}
            <div className="w-72 bg-[#2A3B32] p-6 hidden lg:flex flex-col fixed h-full z-10">
              <div className="mb-12 pl-2"><SkillSwapLogo lightMode={true} size="text-2xl" showTagline={false} /></div>
              <div className="bg-white/5 border border-white/10 p-5 rounded-2xl mb-8 text-white relative overflow-hidden group backdrop-blur-sm">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Zap size={48}/></div>
                <div className="text-xs font-bold text-[#A3C9B0] tracking-widest mb-1">TIME CREDITS</div>
                <div className="text-4xl font-serif font-medium">{user.credits} <span className="text-sm font-sans opacity-60">CR</span></div>
              </div>
              <nav className="space-y-2 mb-8">
                <button onClick={() => setNavTab('requests')} className={`w-full text-left p-3.5 rounded-xl font-medium text-sm flex items-center gap-3 transition-colors ${navTab === 'requests' ? 'bg-[#5D7A68] text-white shadow-lg' : 'text-[#BCCDBD] hover:bg-white/5 hover:text-white'}`}><MessageSquare size={18}/> My Requests</button>
                <button onClick={() => setNavTab('notifications')} className={`w-full text-left p-3.5 rounded-xl font-medium text-sm flex items-center gap-3 transition-colors ${navTab === 'notifications' ? 'bg-[#5D7A68] text-white shadow-lg' : 'text-[#BCCDBD] hover:bg-white/5 hover:text-white'}`}>
                   <Bell size={18}/> Notifications
                   {notifications.length > 0 && <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{notifications.length}</span>}
                </button>
                <button onClick={() => setNavTab('teaches')} className={`w-full text-left p-3.5 rounded-xl font-medium text-sm flex items-center gap-3 transition-colors ${navTab === 'teaches' ? 'bg-[#5D7A68] text-white shadow-lg' : 'text-[#BCCDBD] hover:bg-white/5 hover:text-white'}`}><BookOpen size={18}/> My Teaches</button>
                <button onClick={() => setNavTab('create')} className={`w-full text-left p-3.5 rounded-xl font-medium text-sm flex items-center gap-3 transition-colors ${navTab === 'create' ? 'bg-[#E6F4EA] text-[#10B981] shadow-sm' : 'text-[#BCCDBD] hover:bg-white/5 hover:text-white'}`}><PlusCircle size={18}/> Create Request</button>
              </nav>
              <div className="mt-auto pt-6 border-t border-white/10">
                 <div className="flex items-center gap-3 mb-4"><div className="h-10 w-10 rounded-full bg-[#5D7A68] text-white flex items-center justify-center font-serif font-bold text-lg border-2 border-[#2A3B32]">{user.name[0]}</div><div className="overflow-hidden"><div className="font-bold text-sm text-white truncate">{user.name}</div><div className="text-xs text-[#BCCDBD] truncate">{user.email}</div></div></div>
                 <button onClick={()=>setView('login')} className="w-full py-2.5 bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded-lg text-xs font-bold text-[#BCCDBD] transition-colors flex items-center justify-center gap-2"><LogOut size={14}/> Sign Out</button>
              </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1 lg:pl-72 flex flex-col lg:flex-row h-screen overflow-hidden bg-[#F4F7F5]">
              <div className="flex-1 p-8 lg:p-12 overflow-y-auto border-l border-r border-[#2A3B32] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/50 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
                {activeCall ? (
                   <div className="h-full flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-serif font-bold text-[#2A3B32] flex items-center gap-3"><span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"/> Live Session</h2>
                      <button onClick={() => setShowReview(true)} className="px-6 py-2 bg-red-100 text-red-600 rounded-xl font-bold hover:bg-red-200">END SESSION</button>
                    </div>
                    <div className="flex-1 bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-[#2A3B32] relative">
                      <iframe src={`https://meet.jit.si/${activeCall.room_id}#config.startWithAudioMuted=true&config.prejoinPageEnabled=false`} allow="camera; microphone; fullscreen; display-capture" className="w-full h-full border-0"/>
                    </div>
                  </div>
                ) : (
                  <div className="max-w-3xl mx-auto space-y-10">
                    
                    {/* CREATE REQUEST */}
                    {navTab === 'create' && (
                      <>
                        <header>
                          <h1 className="text-4xl lg:text-5xl font-serif font-bold text-[#2A3B32] mb-3">What Do You Want to Learn?</h1>
                          <p className="text-[#5F6E66] text-lg">Tell the community what you’re curious about.</p>
                        </header>
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#E0E8E3]">
                          <label className="text-xs font-bold text-[#5F6E66] tracking-widest uppercase ml-1">I Want To Learn</label>
                          <div className="flex flex-col md:flex-row gap-4 mt-3">
                            <div className="relative flex-1">
                              <Search className="absolute left-4 top-4 text-[#5D7A68]"/>
                              <input className="w-full p-4 pl-12 bg-[#F9FBF9] rounded-xl border border-[#BCCDBD] outline-none focus:border-[#5D7A68] text-[#2A3B32] font-medium" placeholder="e.g. Photography, UI Design" value={query} onChange={e=>setQuery(e.target.value)} />
                            </div>
                            <button onClick={() => doScan()} disabled={loading} className="px-6 py-4 bg-[#2A3B32] text-white rounded-xl font-bold hover:bg-[#5D7A68] transition-colors">{loading ? <Loader2 className="animate-spin"/> : "Scan Community"}</button>
                          </div>
                        </div>
                        <div className="bg-[#E6F4EA] p-8 rounded-3xl border border-[#10B981]/20 relative overflow-hidden">
                           <Leaf className="absolute top-0 right-0 text-[#10B981] opacity-10 rotate-12" size={120}/>
                           <div className="relative z-10">
                             <h3 className="font-serif text-2xl font-bold text-[#2A3B32] mb-4">Tips for Effective Learning</h3>
                             <ul className="space-y-3 mb-6">{GUIDE_TIPS.slice(0, 3).map((tip, i) => (<li key={i} className="flex gap-3 text-[#2A3B32]/80 font-medium"><CheckCircle size={18} className="text-[#10B981] shrink-0"/> {tip}</li>))}</ul>
                             <button onClick={()=>setShowGuide(true)} className="flex items-center gap-2 text-[#2A3B32] font-bold border-b-2 border-[#2A3B32] pb-0.5 hover:text-[#10B981] hover:border-[#10B981] transition-colors w-fit">Read Guide <ArrowRight size={16}/></button>
                           </div>
                        </div>
                      </>
                    )}

                    {/* MY REQUESTS */}
                    {navTab === 'requests' && (
                        <>
                          <header>
                            <h1 className="text-4xl font-serif font-bold text-[#2A3B32] mb-3">My Requests</h1>
                            <p className="text-[#5F6E66] text-lg">Requests you have sent to others.</p>
                          </header>
                          <div className="space-y-4">
                            {myRequests.length > 0 ? myRequests.map((req, i) => (
                              <div key={i} className="bg-white p-6 rounded-3xl border border-[#E0E8E3] flex justify-between items-center shadow-sm">
                                <div className="flex items-center gap-4">
                                  <div className="h-12 w-12 rounded-full bg-[#E6F4EA] flex items-center justify-center text-[#10B981]"><Search size={20}/></div>
                                  <div>
                                    <h3 className="font-bold text-[#2A3B32] text-lg">{req.receiver}</h3>
                                    <p className="text-xs text-[#5F6E66]">Status: <span className={`font-bold ${req.status === 'ACCEPTED' ? 'text-[#10B981]' : req.status === 'REJECTED' ? 'text-red-500' : 'text-orange-500'}`}>{req.status}</span></p>
                                  </div>
                                </div>
                              </div>
                            )) : <div className="text-center py-10 border-2 border-dashed border-[#E0E8E3] rounded-3xl text-[#5F6E66]">No requests sent.</div>}
                          </div>
                        </>
                      )}

                      {/* NOTIFICATIONS */}
                      {navTab === 'notifications' && (
                        <>
                           <header>
                            <h1 className="text-4xl font-serif font-bold text-[#2A3B32] mb-3">Notifications</h1>
                            <p className="text-[#5F6E66] text-lg">People who want to learn from you.</p>
                          </header>
                          <div className="space-y-4">
                            {notifications.length > 0 ? notifications.map((notif) => (
                              <div key={notif.id} className="bg-white p-6 rounded-3xl border border-[#E0E8E3] shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                                <div className="flex items-center gap-4 w-full">
                                  <div className="h-12 w-12 rounded-full flex items-center justify-center text-white font-bold shrink-0 bg-[#5D7A68]">{notif.learner[0]}</div>
                                  <div>
                                    <h3 className="font-bold text-[#2A3B32] text-lg">{notif.learner}</h3>
                                    <p className="text-sm text-[#5F6E66]">Status: {notif.status}</p>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleAccept(notif.id)} className="px-4 py-2 bg-[#2A3B32] text-white rounded-xl font-bold text-sm hover:bg-[#10B981] flex items-center gap-2"><Check size={16}/> Accept</button>
                                    <button onClick={() => handleReject(notif.id)} className="px-4 py-2 border border-[#E0E8E3] text-[#5F6E66] rounded-xl font-bold text-sm hover:bg-red-50 flex items-center gap-2"><XCircle size={16}/> Reject</button>
                                </div>
                              </div>
                            )) : <div className="text-center py-10 border-2 border-dashed border-[#E0E8E3] rounded-3xl text-[#5F6E66]">No new notifications.</div>}
                          </div>
                        </>
                      )}

                      {/* TEACHES */}
                      {navTab === 'teaches' && (
                        <>
                          <header><h1 className="text-4xl font-serif font-bold text-[#2A3B32] mb-3">My Teaches</h1><p className="text-[#5F6E66] text-lg">Skills you are sharing.</p></header>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {user.have ? user.have.split(',').map((skill: string, i: number) => (
                              <div key={i} className="bg-white p-6 rounded-3xl border border-[#E0E8E3] shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10"><Leaf size={64} className="text-[#5D7A68]"/></div>
                                <div className="relative z-10"><h3 className="font-bold text-[#2A3B32] text-xl mb-1">{skill.split('(')[0]}</h3><div className="inline-block px-3 py-1 bg-[#F4F7F5] rounded-full text-xs font-bold text-[#5F6E66]">{skill.includes('(') ? skill.split('(')[1].replace(')', '') : 'Expert'}</div></div>
                              </div>
                            )) : <div className="col-span-2 text-center py-10 border-2 border-dashed border-[#E0E8E3] rounded-3xl text-[#5F6E66]">No skills listed.</div>}
                          </div>
                        </>
                      )}
                  </div>
                )}
              </div>

              {/* RIGHT PANEL */}
              <div className="w-full lg:w-96 bg-[#2A3B32] h-full overflow-y-auto p-8 border-l border-[#2A3B32]">
                 <div className="mb-10">
                   <div className="flex justify-between items-end mb-6"><h3 className="font-serif text-xl font-bold text-white">People You Can Learn From</h3></div>
                   <div className="space-y-4">
                     {matches.length > 0 ? matches.map((m, i) => (
                        <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                          <div className="flex items-start gap-4">
                             <div className="h-12 w-12 rounded-full bg-[#5D7A68] overflow-hidden shrink-0 border border-white/10"><img src={`https://ui-avatars.com/api/?name=${m.name}&background=random&color=fff`} alt={m.name} className="h-full w-full object-cover"/></div>
                             <div className="flex-1 min-w-0"><h4 className="font-bold text-white truncate">{m.name}</h4><p className="text-xs text-[#BCCDBD] mt-0.5 truncate">Teaches: {m.skills_have}</p></div>
                          </div>
                          <div className="mt-4 pt-4 border-t border-white/10 flex gap-2">
                             <a href={m.portfolio_link} target="_blank" rel="noreferrer" className="flex-1 py-2 text-center text-xs font-bold text-[#BCCDBD] border border-white/20 rounded-lg hover:bg-white/5">Portfolio</a>
                             <button onClick={() => startCall(m.email)} className="flex-1 py-2 text-center text-xs font-bold text-[#2A3B32] bg-[#A3C9B0] rounded-lg hover:bg-white">Request</button>
                          </div>
                        </div>
                     )) : <div className="text-center py-10 border-2 border-dashed border-white/20 rounded-2xl text-[#BCCDBD]"><Users className="mx-auto mb-2 opacity-50"/><p className="text-sm">Scan to find mentors</p></div>}
                   </div>
                 </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// REGISTER COMPONENT REMAINS UNCHANGED
function RegisterRitual({ onBack, onComplete, LogoComponent }: { onBack: () => void, onComplete: () => void, LogoComponent: any }) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', proofLink: '' });
  const [offerSkills, setOfferSkills] = useState<string[]>([]);
  const [learnSkills, setLearnSkills] = useState<string[]>([]);
  const [offerInput, setOfferInput] = useState('');
  const [learnInput, setLearnInput] = useState('');

  const addSkill = (type: 'offer' | 'learn', value: string) => {
    if (!value.trim()) return;
    if (type === 'offer' && !offerSkills.includes(value)) setOfferSkills([...offerSkills, value]);
    if (type === 'learn' && !learnSkills.includes(value)) setLearnSkills([...learnSkills, value]);
  };
  const removeSkill = (type: 'offer' | 'learn', skill: string) => {
    if (type === 'offer') setOfferSkills(offerSkills.filter(s => s !== skill));
    if (type === 'learn') setLearnSkills(learnSkills.filter(s => s !== skill));
  };
  const handleKeyDown = (e: React.KeyboardEvent, type: 'offer' | 'learn', value: string, setFn: any) => {
    if (e.key === 'Enter') { e.preventDefault(); addSkill(type, value); setFn(''); }
  };
  const doRegister = async () => {
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password, have: offerSkills.join(', '), want: learnSkills.join(', '), link: formData.proofLink })
      });
      if (res.ok) { alert("Identity Created. 30 Credits Deposited."); onComplete(); } else { alert("Error creating identity."); }
    } catch (e) { alert("Backend Offline"); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 lg:p-6" style={{backgroundColor: COLORS.bg}}>
      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="bg-white w-full max-w-4xl rounded-3xl shadow-xl border border-[#E0E8E3] overflow-hidden flex flex-col">
        <div className="px-8 pt-8 pb-4 border-b border-[#F4F7F5] flex justify-between items-center bg-[#2A3B32] rounded-t-3xl"><LogoComponent lightMode={true} size="text-2xl" /><div className="flex bg-white/10 rounded-lg p-1 backdrop-blur-md"><button onClick={onBack} className="px-6 py-2 rounded-md text-sm font-bold text-white/70 hover:text-white transition-colors">ACCESS</button><button className="px-6 py-2 rounded-md text-sm font-bold bg-white text-[#2A3B32] shadow-sm">JOIN</button></div></div>
        <div className="p-8 lg:p-12 overflow-y-auto max-h-[80vh]"><div className="grid grid-cols-1 lg:grid-cols-2 gap-12"><div className="space-y-6"><div><h3 className="font-serif text-2xl font-bold text-[#2A3B32] mb-4">The Basics</h3><div className="space-y-4"><input className="w-full mt-1 p-3 bg-[#F9FBF9] rounded-xl border border-[#E0E8E3]" placeholder="Full Name" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} /><input className="w-full mt-1 p-3 bg-[#F9FBF9] rounded-xl border border-[#E0E8E3]" placeholder="Email" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} /><input type="password" className="w-full mt-1 p-3 bg-[#F9FBF9] rounded-xl border border-[#E0E8E3]" placeholder="Password" value={formData.password} onChange={e=>setFormData({...formData, password: e.target.value})} /></div></div></div><div><h3 className="font-serif text-2xl font-bold text-[#2A3B32] mb-1">Skill Exchange</h3><p className="text-sm text-[#5F6E66] mb-6">Hit Enter to add.</p><div className="space-y-6"><div className="bg-[#F4F7F5] p-5 rounded-2xl border border-[#E0E8E3]"><label className="flex items-center gap-2 text-sm font-bold text-[#2A3B32] mb-2"><div className="h-2 w-2 rounded-full bg-[#10B981]"/> 💡 I Can Teach</label><input className="w-full p-3 bg-white rounded-xl border border-[#E0E8E3] outline-none mb-3" placeholder="Add skills..." value={offerInput} onChange={e=>setOfferInput(e.target.value)} onKeyDown={e=>handleKeyDown(e, 'offer', offerInput, setOfferInput)}/><div className="flex flex-wrap gap-2">{offerSkills.map(s => (<span key={s} className="px-3 py-1 bg-[#2A3B32] text-white text-xs rounded-full flex items-center gap-1">{s} <button onClick={()=>removeSkill('offer', s)}><X size={12}/></button></span>))}</div></div><div className="bg-[#F4F7F5] p-5 rounded-2xl border border-[#E0E8E3]"><label className="flex items-center gap-2 text-sm font-bold text-[#2A3B32] mb-2"><div className="h-2 w-2 rounded-full bg-[#3B82F6]"/> 📘 I Want to Learn</label><input className="w-full p-3 bg-white rounded-xl border border-[#E0E8E3] outline-none mb-3" placeholder="Add interests..." value={learnInput} onChange={e=>setLearnInput(e.target.value)} onKeyDown={e=>handleKeyDown(e, 'learn', learnInput, setLearnInput)}/><div className="flex flex-wrap gap-2">{learnSkills.map(s => (<span key={s} className="px-3 py-1 bg-white border border-[#E0E8E3] text-[#5F6E66] text-xs rounded-full flex items-center gap-1">{s} <button onClick={()=>removeSkill('learn', s)}><X size={12}/></button></span>))}</div></div></div></div></div></div>
        <div className="p-8 border-t border-[#F4F7F5] bg-white flex justify-end"><button onClick={doRegister} disabled={!formData.name || !formData.email || offerSkills.length === 0} className="px-8 py-4 bg-[#2A3B32] text-white rounded-xl font-bold text-lg hover:bg-[#5D7A68] transition-colors disabled:opacity-50 flex items-center gap-2 shadow-xl">Create Identity <ArrowRight size={20}/></button></div>
      </motion.div>
    </div>
  );
}