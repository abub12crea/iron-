/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, X, ChevronRight, Play, Star, MapPin, Phone, Mail, 
  Instagram, Facebook, Youtube, Dumbbell, Zap, Target, 
  Clock, ShieldCheck, UserCheck, MessageSquare, ArrowUpRight,
  TrendingUp, Activity, Flame, Heart, Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

// --- Types ---
interface Program {
  id: number;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface PriceCard {
  id: number;
  name: string;
  price: string;
  features: string[];
  popular?: boolean;
}

// --- Data ---
const PROGRAMS: Program[] = [
  { id: 1, name: 'Weight Training', description: 'Elite strength & muscle building.', icon: <Dumbbell className="w-6 h-6" /> },
  { id: 2, name: 'Cardio & HIIT', description: 'High intensity fat burning.', icon: <Flame className="w-6 h-6" /> },
  { id: 3, name: 'Yoga & Zen', description: 'Flexibility and mind balance.', icon: <Heart className="w-6 h-6" /> },
  { id: 4, name: 'Personal Training', description: '1-on-1 expert coaching.', icon: <UserCheck className="w-6 h-6" /> },
  { id: 5, name: 'Group Classes', description: 'Community driven workouts.', icon: <Activity className="w-6 h-6" /> },
  { id: 6, name: 'Nutrition Coach', description: 'Personalized meal plans.', icon: <Target className="w-6 h-6" /> },
];

const PRICING: PriceCard[] = [
  { id: 1, name: 'Basic', price: '$49', features: ['Gym Access 6AM-10PM', 'All Basic Equipment', '1 Free Evaluation', 'Locker Access'] },
  { id: 2, name: 'Pro', price: '$89', features: ['24/7 Access', 'Group Classes', 'Personalized Program', 'Sauna & Steam'], popular: true },
  { id: 3, name: 'Elite', price: '$149', features: ['Unlimited PT Sessions', 'Nutrition Plans', 'Recovery Zone', 'Privileged Entry'] },
];

const TESTIMONIALS = [
  { id: 1, name: 'Alex Rivera', role: 'Elite Member', text: 'Ironclad changed my life. The trainers are on another level.', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=200&auto=format&fit=crop' },
  { id: 2, name: 'Sarah Chen', role: 'Pro Member', text: 'The atmosphere is so motivating. Cleanest gym I\'ve ever seen.', img: 'https://images.unsplash.com/photo-1548690312-e3b507d17a12?q=80&w=200&auto=format&fit=crop' },
];

// --- Components ---

const BookingModal = ({ isOpen, onClose, plan }: { isOpen: boolean, onClose: () => void, plan?: string }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending to +919380434397
    setStep(2);
    const whatsappMsg = `New Booking for ${plan || 'Free Trial'}%0A%0A*Name:* ${formData.name}%0A*Phone:* ${formData.phone}%0A*Goal:* ${formData.message}`;
    window.open(`https://wa.me/919380434397?text=${whatsappMsg}`, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-md bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden glass-morphism p-8 shadow-2xl"
          >
            <button onClick={onClose} className="absolute top-6 right-6 text-zinc-500 hover:text-white"><X size={24} /></button>
            
            {step === 1 ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="mb-8">
                  <h3 className="text-3xl font-display font-black uppercase mb-1">Book Your Spot</h3>
                  <p className="text-zinc-500 text-sm">Joining: <span className="text-accent font-bold">{plan || 'Free Trial'}</span></p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Full Name</label>
                    <input required className="w-full bg-zinc-800/50 border border-white/5 rounded-lg p-4 text-sm focus:border-accent outline-none transition-colors" 
                      placeholder="John Doe" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Phone Number</label>
                    <input required type="tel" className="w-full bg-zinc-800/50 border border-white/5 rounded-lg p-4 text-sm focus:border-accent outline-none transition-colors" 
                      placeholder="+91 91234 56789" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Primary Goal</label>
                    <textarea rows={3} className="w-full bg-zinc-800/50 border border-white/5 rounded-lg p-4 text-sm focus:border-accent outline-none transition-colors resize-none" 
                      placeholder="Weight loss, Muscle gain..." value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
                  </div>
                </div>
                <button type="submit" className="w-full bg-accent py-4 rounded-lg text-zinc-950 font-black tracking-widest text-sm shadow-xl accent-glow active:scale-95 transition-all">
                  SECURE BOOKING
                </button>
              </form>
            ) : (
              <div className="text-center py-10 space-y-6">
                <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserCheck size={40} className="text-accent" />
                </div>
                <h4 className="text-2xl font-black uppercase">Booking Captured!</h4>
                <p className="text-zinc-500 text-sm">We've redirected you to WhatsApp to finalize your slot. Our team will reach out within 15 minutes.</p>
                <button onClick={onClose} className="w-full border border-white/10 py-4 rounded-lg font-bold text-sm">Back to Site</button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const ProgramModal = ({ isOpen, onClose, program }: { isOpen: boolean, onClose: () => void, program?: Program }) => {
  return (
    <AnimatePresence>
      {isOpen && program && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="absolute inset-0 bg-zinc-950/90 backdrop-blur-md"
          />
          <motion.div 
            initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
            className="relative w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden glass-morphism shadow-2xl p-8 md:p-12 text-center md:text-left"
          >
            <button onClick={onClose} className="absolute top-6 right-6 text-zinc-500 hover:text-white"><X size={28} /></button>
            <div className="flex flex-col md:flex-row gap-10 items-center">
              <div className="w-32 h-32 bg-accent/20 rounded-3xl flex items-center justify-center text-accent flex-shrink-0 animate-pulse">
                {program.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-4xl md:text-5xl font-display font-black uppercase mb-4 leading-none">{program.name}</h3>
                <p className="text-zinc-300 text-lg leading-relaxed mb-8">{program.description} Experience state-of-the-art techniques designed by world-renowned athletes.</p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <div className="text-accent font-black text-xl mb-1 italic">45m</div>
                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Duration</div>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <div className="text-accent font-black text-xl mb-1 italic">High</div>
                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Intensity</div>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="w-full md:w-auto bg-white text-zinc-950 px-10 py-5 rounded-lg font-black text-xs tracking-widest active:scale-95 transition-all shadow-xl"
                >
                  SCHEDULE CLASS
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const BMICalculator = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);

  const calculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    if (w && h) {
      setBmi(Math.round((w / (h * h)) * 10) / 10);
    }
  };

  return (
    <section className="py-24 bg-zinc-950">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto glass-morphism rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl border-accent/20 border-2">
          <div className="w-full md:w-1/2 p-10 bg-accent text-zinc-950">
            <h3 className="text-4xl font-display font-black uppercase mb-4 italic leading-none">Calculate <br/>Your BMI</h3>
            <p className="text-sm font-bold opacity-70 mb-8 max-w-xs">Track your fitness progress accurately with our instant BMI tool. Elite members get 24/7 AI-guided tracking.</p>
            <div className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase">Weight (kg)</label>
                <input value={weight} onChange={e => setWeight(e.target.value)} type="number" className="w-full bg-zinc-950/10 border-b-2 border-zinc-950/20 focus:border-zinc-950 p-2 text-xl font-bold outline-none placeholder:text-zinc-950/30" placeholder="00" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase">Height (cm)</label>
                <input value={height} onChange={e => setHeight(e.target.value)} type="number" className="w-full bg-zinc-950/10 border-b-2 border-zinc-950/20 focus:border-zinc-950 p-2 text-xl font-bold outline-none placeholder:text-zinc-950/30" placeholder="00" />
              </div>
              <button onClick={calculate} className="w-full bg-zinc-950 text-white py-4 rounded-sm font-black text-sm tracking-widest shadow-2xl active:scale-95 transition-all">CALCULATE NOW</button>
            </div>
          </div>
          <div className="w-full md:w-1/2 p-10 flex flex-col items-center justify-center text-center bg-zinc-900">
            {bmi ? (
              <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="space-y-4">
                <div className="text-8xl font-display font-black text-accent italic -rotate-6">{bmi}</div>
                <div className="text-xl font-black uppercase text-white">Your BMI Score</div>
                <p className="text-zinc-400 text-sm">
                  {bmi < 18.5 ? "Underweight. Time to bulk up! 💪" : 
                   bmi < 25 ? "Normal weight. Keep it up! ⚡" : 
                   bmi < 30 ? "Overweight. Let's burn it off! 🔥" : 
                   "Obese. We're here to help you transform! 🛡️"}
                </p>
                <div className="pt-6">
                  <button className="text-accent font-black text-xs tracking-widest border-b border-accent pb-1">GET DIET PLAN</button>
                </div>
              </motion.div>
            ) : (
              <div className="text-zinc-700 text-6xl font-display font-black italic">--.-</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const Navbar = ({ onJoinClick }: { onJoinClick: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = ['Home', 'About', 'Programs', 'Pricing', 'Trainers', 'Contact'];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-zinc-950/90 backdrop-blur-md py-3 border-b border-white/5' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-accent rounded-sm flex items-center justify-center font-display font-black italic text-xl">I</div>
          <span className="font-display font-black text-xl tracking-tighter hidden sm:block">IRONCLAD</span>
        </div>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 font-medium text-sm text-zinc-400">
          {navLinks.map(link => (
            <a key={link} href={`#${link.toLowerCase()}`} className="hover:text-accent transition-colors">{link}</a>
          ))}
          <button onClick={onJoinClick} className="bg-accent px-6 py-2 rounded-sm text-zinc-950 font-bold hover:brightness-110 transition-all">JOIN NOW</button>
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white p-2">
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-zinc-950 border-b border-white/10 flex flex-col items-center py-10 gap-6 md:hidden glass-morphism"
          >
            {navLinks.map(link => (
              <a key={link} href={`#${link.toLowerCase()}`} className="text-xl font-display font-bold uppercase tracking-widest" onClick={() => setIsOpen(false)}>{link}</a>
            ))}
            <button onClick={() => { setIsOpen(false); onJoinClick(); }} className="bg-accent w-64 py-4 rounded-sm text-zinc-950 font-black tracking-widest mt-4">FREE TRIAL</button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const AITrainerColumn = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'model', parts: { text: string }[] }[]>([
    { role: 'model', parts: [{ text: "LISTEN UP! If you're here, you're ready to bleed excellence. I am your Ironclad Architect. What's your mission today? Weight loss? Muscle gain? DON'T WASTE MY TIME—GIVE ME YOUR STATS!" }] }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user' as const, parts: [{ text: input }] };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const systemPrompt = `You are "IRONCLAD COMMANDER", the most motivating, intense, and scientifically accurate gym trainer AI.
      YOU ARE AGGRESSIVE BUT CARING. Think Drill Sergeant.
      
      CORE MISSIONS:
      1. DIET PLANS: Create precise caloric & macro breakdowns (Red meat, clean carbs, no junk).
      2. WEIGHT LOSS: Design metabolic firestorms (HIIT + Strength).
      3. DAILY REMINDERS: Tell the user "IT'S 6:00 AM SOMEWHERE, GET TO THE IRON."
      4. DISCIPLINE: If they sound lazy, call them out.
      
      Style: Use CAPS for emphasis. Be short, punchy, and professional. 
      Ask for: Age, Weight, Height, Activity level if not known.`;

      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [
          ...messages.map(m => ({
            role: m.role === 'model' ? 'model' : 'user',
            parts: [{ text: m.parts[0].text }]
          })),
          { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser: ${input}` }] }
        ]
      });

      const text = response.text || "I'm recalibrating. Try again, soldier!";
      setMessages(prev => [...prev, { role: 'model', parts: [{ text }] }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: "SYSTEM ERROR. REGROUP." }] }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-zinc-950 border-2 border-red-600 rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(255,0,0,0.15)]">
      <div className="p-6 bg-red-600 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-6 h-6" />
          <h3 className="font-display font-black uppercase text-xl italic tracking-tighter">AI COMMANDER</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black uppercase opacity-80">Online</span>
        </div>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.05)_0%,transparent_100%)]">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] p-4 rounded-xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-zinc-800 text-white border border-white/5' : 'bg-red-600/10 text-red-100 border border-red-600/20 font-medium'}`}>
              {m.role === 'model' && <span className="block text-[8px] font-black uppercase text-red-500 mb-1 tracking-widest">Commander</span>}
              {m.parts[0].text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-red-600/20 px-4 py-2 rounded-full animate-pulse text-[10px] font-black uppercase text-red-500">Calculating macros...</div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-white/5 bg-zinc-950/50">
        <div className="flex gap-3">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="TELL ME YOUR STATS, SOLDIER..." 
            className="flex-1 bg-zinc-900 border border-white/10 rounded-xl p-4 text-xs font-medium focus:border-red-600 outline-none placeholder:text-zinc-600 transition-all"
          />
          <button onClick={handleSend} className="bg-red-600 p-4 rounded-xl text-white hover:bg-red-700 transition-colors shadow-lg active:scale-95">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model', parts: { text: string }[] }[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = { role: 'user' as const, parts: [{ text: input }] };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const systemPrompt = `You are "Ironclad Elite AI", a high-performance fitness coach.
      Intense, scientific, and highly motivating. Use RED for blood and effort (conceptually).
      
      YOU MUST MOTIVATE THE USER TO HIT THE GYM DAILY.
      
      Capabilities:
      1. DIET PLANS: Specific, high-protein, clean.
      2. WEIGHT LOSS: Precision HIIT and strength circuits.
      3. HEALTHY LIFESTYLE: Sleep, hydration, mental toughness.
      
      Always push them to the "Free Trial" or "Elite Membership".`;

      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [
          ...messages.map(m => ({
            role: m.role === 'model' ? 'model' : 'user',
            parts: [{ text: m.parts[0].text }]
          })),
          { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser: ${input}` }] }
        ]
      });

      const text = response.text || "I'm busy lifting. Try again.";
      setMessages(prev => [...prev, { role: 'model', parts: [{ text }] }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: "Error. Regroup later." }] }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-[60]">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-16 right-0 w-[320px] h-[450px] sm:w-[380px] bg-zinc-900 border border-red-600/30 rounded-2xl flex flex-col shadow-2xl overflow-hidden"
          >
            <div className="p-4 bg-red-600 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 fill-current" />
                <span className="font-bold uppercase tracking-tighter italic">Ironclad AI Coach</span>
              </div>
              <button onClick={() => setIsOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 text-sm no-scrollbar">
              {messages.length === 0 && (
                <div className="text-zinc-500 text-center py-10 italic">
                  GIVE ME YOUR GOALS, SOLDIER!
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl ${m.role === 'user' ? 'bg-zinc-800 text-white' : 'bg-red-600/20 text-red-100 border border-red-600/20'}`}>
                    {m.parts[0].text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-red-600/10 p-3 rounded-2xl animate-pulse text-[10px] text-red-500 font-bold uppercase">Coach is thinking...</div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-white/5 flex gap-2">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="What's your goal?" 
                className="flex-1 bg-zinc-800 border-none rounded-lg p-3 text-sm focus:ring-1 focus:ring-red-600 outline-none"
              />
              <button onClick={handleSend} className="bg-red-600 p-3 rounded-lg text-white"><Send className="w-5 h-5" /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg accent-glow-strong transition-transform active:scale-95"
      >
        {isOpen ? <X className="text-white" /> : <Flame className="text-white" />}
      </button>
    </div>
  );
};

export default function App() {
  const [day, setDay] = useState('MON');
  const [bookingModal, setBookingModal] = useState({ isOpen: false, plan: '' });
  const [programModal, setProgramModal] = useState({ isOpen: false, prog: undefined as Program | undefined });

  const openBooking = (plan: string = 'Free Trial') => setBookingModal({ isOpen: true, plan });
  const closeBooking = () => setBookingModal({ isOpen: false, plan: '' });

  const openProgram = (prog: Program) => setProgramModal({ isOpen: true, prog });
  const closeProgram = () => setProgramModal({ isOpen: false, prog: undefined });

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <Navbar onJoinClick={() => openBooking('Free Trial')} />

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070&auto=format&fit=crop" 
            className="w-full h-full object-cover brightness-50"
            alt="Gym background" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/10 to-transparent"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <h1 className="text-5xl md:text-8xl font-display font-black leading-none tracking-tighter mb-6 uppercase">
              Transform <span className="text-accent underline decoration-4 underline-offset-8 italic">Body</span> <br/>
              Transform <span className="text-accent italic">Life</span>
            </h1>
            <p className="text-zinc-300 md:text-xl max-w-2xl mx-auto mb-10 font-medium">
              Join the most elite fitness community. Professional coaching, high-end equipment, and results that matter.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-sm sm:max-w-none">
              <button 
                onClick={() => openBooking('Free Trial')}
                className="bg-accent px-10 py-5 rounded-sm text-zinc-950 font-black text-lg shadow-xl accent-glow flex items-center justify-center gap-2 group transition-all"
              >
                START FREE TRIAL
                <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <a href="#programs" className="border border-white/20 bg-white/5 backdrop-blur-md px-10 py-5 rounded-sm font-bold text-lg hover:bg-white/10 transition-all">
                VIEW PROGRAMS
              </a>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-white/10 pt-10 w-full"
          >
            {[
              { val: '500+', label: 'MEMBERS' },
              { val: '10+', label: 'TRAINERS' },
              { val: '24/7', label: 'ACCESS' },
              { val: '5.0', label: 'RATING' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl font-display font-black text-accent">{stat.val}</div>
                <div className="text-xs text-zinc-500 font-bold tracking-widest">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-zinc-950">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="w-full lg:w-1/2 relative">
              <div className="absolute -top-4 -left-4 w-32 h-32 bg-accent/20 -z-10 rounded-sm"></div>
              <img 
                src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop" 
                className="w-full h-[500px] object-cover rounded-sm border border-white/5 shadow-2xl"
                alt="Trainer"
              />
              <div className="absolute -bottom-8 -right-8 glass-morphism p-6 rounded-sm max-w-xs">
                <div className="flex items-center gap-3 mb-2">
                  <Star className="text-accent fill-current w-5 h-5" />
                  <span className="font-bold">ELITE EXPERIENCE</span>
                </div>
                <p className="text-xs text-zinc-400">Our facility is ranked among the top 1% in the country for equipment quality and hygiene.</p>
              </div>
            </div>
            
            <div className="w-full lg:w-1/2">
              <h2 className="text-4xl md:text-5xl font-display font-black mb-8 leading-tight">
                MORE THAN JUST A <span className="text-accent italic">GYM</span>. <br/>
                IT'S A LIFESTYLE.
              </h2>
              <p className="text-lg text-zinc-400 mb-10 leading-relaxed">
                Ironclad Fitness was built on the foundation of discipline and excellence. We provide an environment that pushes you beyond your limits, surrounded by a community that supports your every move.
              </p>
              
              <div className="space-y-6">
                {[
                  { icon: <Dumbbell className="text-accent" />, title: 'Pro Equipment', desc: 'Industry-leading Hammer Strength & Life Fitness tech.' },
                  { icon: <UserCheck className="text-accent" />, title: 'Certified Coaches', desc: 'Every trainer has at least 5 years of professional experience.' },
                  { icon: <Clock className="text-accent" />, title: 'Flexible Timing', desc: 'From 6:00 AM to 10:00 PM, we fit your schedule.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{item.title}</h4>
                      <p className="text-sm text-zinc-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => openBooking('Tour')}
                className="mt-12 bg-white text-zinc-950 px-8 py-4 font-black uppercase text-sm tracking-widest hover:bg-accent transition-colors"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-24 bg-zinc-900/50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-accent font-display font-black text-lg tracking-widest mb-4">OUR SPECIALTIES</h2>
            <h3 className="text-5xl font-display font-black mb-6">FUEL YOUR PASSION</h3>
            <p className="text-zinc-500">Choose a program that fits your goals. From powerlifting to recovery, we cover every aspect of modern fitness.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROGRAMS.map((prog) => (
              <motion.div 
                whileHover={{ y: -5 }}
                key={prog.id} 
                className="glass-morphism p-8 group hover:border-accent/40 transition-all cursor-pointer relative overflow-hidden"
                onClick={() => openProgram(prog)}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 -mr-12 -mt-12 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                <div className="w-14 h-14 bg-accent/20 text-accent rounded-lg flex items-center justify-center mb-6">{prog.icon}</div>
                <h4 className="text-2xl font-display font-bold mb-3 uppercase">{prog.name}</h4>
                <p className="text-zinc-500 mb-6">{prog.description}</p>
                <button className="flex items-center gap-2 text-accent font-bold group-hover:gap-4 transition-all">
                  EXPLORE <ArrowUpRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Trainer Section */}
      <section className="py-24 bg-zinc-950 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600 rounded-full blur-[120px]"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="w-full lg:w-1/2 order-2 lg:order-1">
              <AITrainerColumn />
            </div>
            
            <div className="w-full lg:w-1/2 order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 border border-red-600/20 rounded-full mb-6">
                <Zap className="w-4 h-4 text-red-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-red-500">System V.2.0 Active</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-display font-black uppercase mb-8 leading-none">
                THE IRON <br/>
                <span className="text-red-600 italic">ARCHITECT</span>
              </h2>
              <p className="text-xl text-zinc-400 mb-10 leading-relaxed max-w-lg">
                Stop guessing. Start growing. Our proprietary <span className="text-white font-bold underline decoration-red-600 underline-offset-4">AI COMMANDER</span> analyzes your biometrics to build perfect diet plans and weight loss journeys. 
              </p>
              
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-3xl font-display font-black text-white mb-2 italic underline decoration-red-600 underline-offset-4">100%</div>
                  <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Personalized Plans</p>
                </div>
                <div>
                  <div className="text-3xl font-display font-black text-white mb-2 italic underline decoration-red-600 underline-offset-4">24/7</div>
                  <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Motivation Access</p>
                </div>
              </div>

              <div className="mt-12 flex items-center gap-6 p-6 border-l-2 border-red-600 bg-red-600/5 rounded-r-xl">
                <Flame className="w-12 h-12 text-red-600 opacity-20" />
                <p className="text-sm font-medium italic text-zinc-300 italic">"I don't care about your excuses. I care about your progress. Talk to me now."</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BMICalculator />

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-zinc-950">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-display font-black mb-6">MEMBER PLANS</h2>
            <p className="text-zinc-400">Start your journey today with flexible billing.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {PRICING.map((plan) => (
              <div 
                key={plan.id} 
                className={`relative p-10 rounded-2xl border-2 transition-all flex flex-col ${plan.popular ? 'bg-zinc-900 border-accent scale-105 z-10' : 'bg-zinc-900/40 border-white/5'}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent text-zinc-950 text-xs font-black px-4 py-1 rounded-full uppercase">
                    Most Popular
                  </div>
                )}
                <h4 className="text-xl font-bold uppercase text-zinc-400 mb-4">{plan.name}</h4>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-5xl font-display font-black">{plan.price}</span>
                  <span className="text-zinc-500">/mo</span>
                </div>
                <ul className="space-y-4 mb-10 flex-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                      <ShieldCheck className="w-5 h-5 text-accent" /> {f}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => openBooking(plan.name)}
                  className={`w-full py-4 rounded-lg font-black text-sm tracking-widest ${plan.popular ? 'bg-accent text-zinc-950' : 'bg-white/10 hover:bg-white/20 transition-all'}`}
                >
                  GET STARTED
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section className="py-24 bg-zinc-900">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-4xl font-display font-black mb-4">TRAINING SCHEDULE</h2>
              <p className="text-zinc-500">Never miss a drop of sweat.</p>
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
              {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
                <button 
                  key={d}
                  onClick={() => setDay(d)}
                  className={`px-6 py-2 rounded-full font-bold text-sm transition-all whitespace-nowrap ${day === d ? 'bg-accent text-zinc-950' : 'bg-white/5 text-zinc-500 hover:text-white'}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { time: '07:00 AM', name: 'Power Yoga', coach: 'Sarah Chen', spots: '5 Left' },
              { time: '10:00 AM', name: 'Body Pump', coach: 'Alex Rivera', spots: 'Full' },
              { time: '04:00 PM', name: 'HIIT Burn', coach: 'Marcus Bolt', spots: '12 Left' },
              { time: '06:30 PM', name: 'Zumba Elite', coach: 'Elena Gomez', spots: '3 Left' },
            ].map((cls, i) => (
              <div key={i} className="bg-zinc-950 border border-white/5 p-6 flex flex-col justify-between h-48 hover:border-accent group transition-all">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-accent tracking-widest">{cls.time}</span>
                  <span className={`text-[10px] px-2 py-1 rounded-sm uppercase font-black ${cls.spots === 'Full' ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
                    {cls.spots}
                  </span>
                </div>
                <div>
                  <h5 className="text-xl font-display font-bold mb-1">{cls.name}</h5>
                  <p className="text-xs text-zinc-500">with {cls.coach}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-zinc-950 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-black">MEMBER VOICES</h2>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 overflow-x-auto no-scrollbar pb-10">
            {TESTIMONIALS.map(t => (
              <div key={t.id} className="min-w-full md:min-w-[400px] glass-morphism p-10 relative">
                <div className="flex gap-1 mb-6 text-accent">
                  <Star fill="currentColor" size={16} /> <Star fill="currentColor" size={16} /> <Star fill="currentColor" size={16} /> <Star fill="currentColor" size={16} /> <Star fill="currentColor" size={16} />
                </div>
                <p className="text-lg italic text-zinc-300 mb-8 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <img src={t.img} className="w-14 h-14 rounded-full object-cover border-2 border-accent" alt={t.name} />
                  <div>
                    <h5 className="font-bold">{t.name}</h5>
                    <span className="text-xs text-zinc-500">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-zinc-950 pt-24 pb-40 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-accent rounded-sm flex items-center justify-center font-display font-black italic text-xl text-zinc-950">I</div>
                <span className="font-display font-black text-2xl tracking-tighter">IRONCLAD</span>
              </div>
              <p className="text-zinc-500 max-w-sm mb-8">The house of steel and discipline. Join the premium fitness movement that turns sweat into results.</p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-white/5 flex items-center justify-center rounded-full hover:bg-accent hover:text-zinc-950 transition-all"><Instagram size={20} /></a>
                <a href="#" className="w-10 h-10 bg-white/5 flex items-center justify-center rounded-full hover:bg-accent hover:text-zinc-950 transition-all"><Facebook size={20} /></a>
                <a href="#" className="w-10 h-10 bg-white/5 flex items-center justify-center rounded-full hover:bg-accent hover:text-zinc-950 transition-all"><Youtube size={20} /></a>
              </div>
            </div>

            <div>
              <h6 className="font-bold uppercase tracking-widest text-xs mb-8">Location</h6>
              <div className="space-y-4 text-zinc-400">
                <div className="flex gap-3 items-start"><MapPin size={18} className="text-accent" /> 123 Elite Plaza, Downtown City</div>
                <div className="flex gap-3 items-center"><Phone size={18} className="text-accent" /> +1 (555) 300-8000</div>
                <div className="flex gap-3 items-center"><Mail size={18} className="text-accent" /> hello@ironclad.com</div>
              </div>
            </div>

            <div>
              <h6 className="font-bold uppercase tracking-widest text-xs mb-8">Hours</h6>
              <div className="space-y-2 text-zinc-400">
                <div className="flex justify-between"><span>Mon-Fri</span> <span className="font-bold text-white">06:00 - 22:00</span></div>
                <div className="flex justify-between"><span>Saturday</span> <span className="font-bold text-white">08:00 - 20:00</span></div>
                <div className="flex justify-between"><span>Sunday</span> <span className="font-bold text-white">09:00 - 18:00</span></div>
              </div>
            </div>
          </div>
          
          <div className="text-center pt-10 border-t border-white/5">
            <p className="text-xs text-zinc-600">© 2026 IRONCLAD FITNESS. ALL RIGHTS RESERVED. DESIGNED FOR ELITE ATHLETES.</p>
          </div>
        </div>
      </footer>

      {/* Floating Elements (Mobile Specific) */}
      <div className="fixed bottom-0 left-0 w-full z-[70] md:hidden">
        <div className="p-4 glass-morphism border-t border-white/10 flex gap-4">
          <button 
            onClick={() => openBooking('Free Trial')}
            className="flex-1 bg-accent py-4 rounded-sm font-black text-zinc-950 tracking-widest shadow-xl accent-glow"
          >
            JOIN THE ELITE
          </button>
        </div>
      </div>

      <a 
        href="https://wa.me/919380434397" 
        target="_blank" 
        className="fixed bottom-40 right-6 z-[60] w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 accent-glow"
      >
        <Phone className="text-white fill-current" />
      </a>

      <BookingModal isOpen={bookingModal.isOpen} onClose={closeBooking} plan={bookingModal.plan} />
      <ProgramModal isOpen={programModal.isOpen} onClose={closeProgram} program={programModal.prog} />
      <AIChatWidget />
    </div>
  );
}
