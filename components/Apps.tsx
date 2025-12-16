import React, { useState, useEffect, useRef } from 'react';
import { generateGalaxyResponse } from '../services/geminiService';
import { PenTool, Check, Wand2, Mic, Phone, X, Share2, MoreVertical, Send, Volume2, Sparkles, ChevronLeft, Search, RefreshCw, Trash2, Globe, Smartphone, MessageCircle, Edit3, Wifi, Bluetooth, Moon, Bell, Play, Pause, SkipForward, SkipBack, Music, Clock, Calculator, Folder, Image, FileText, Video, Equal, Plus, Minus, Divide, Search as SearchIcon, ShieldCheck, Battery, HardDrive, Cpu, Smile, Gamepad2, Palette, Lock, History, User, MoonStar, Briefcase, Coffee, Zap, LayoutTemplate, Library, Share, Laptop, Tablet, StickyNote, Settings } from 'lucide-react';
import { Note, Photo, ThemeType, ModeType } from '../types';

// --- Helper Components ---
const LoadingSparkles = () => (
  <div className="flex items-center gap-2 text-indigo-400 animate-pulse">
    <Sparkles className="w-5 h-5 animate-spin-slow" />
    <span className="text-sm font-medium">Galaxy AI processing...</span>
  </div>
);

// --- Quick Share (AirDrop Animation) ---
export const QuickShareView: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [foundDevices, setFoundDevices] = useState<any[]>([]);

    useEffect(() => {
        const timer1 = setTimeout(() => {
            setFoundDevices(prev => [...prev, { name: "Galaxy S24", icon: Smartphone, x: -60, y: -80 }]);
        }, 2000);
        const timer2 = setTimeout(() => {
            setFoundDevices(prev => [...prev, { name: "MacBook Pro", icon: Laptop, x: 60, y: 50 }]);
        }, 3500);
        const timer3 = setTimeout(() => {
            setFoundDevices(prev => [...prev, { name: "Tab S9", icon: Tablet, x: -50, y: 70 }]);
        }, 5000);

        return () => { clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3); };
    }, []);

    return (
        <div className="h-full w-full bg-black/90 backdrop-blur-2xl text-white flex flex-col relative overflow-hidden animate-fade-in">
            <button onClick={onClose} className="absolute top-6 right-6 z-50 p-2 bg-white/10 rounded-full"><X /></button>
            
            <div className="flex-1 flex flex-col items-center justify-center relative">
                <h2 className="text-2xl font-bold mb-10 z-20">Quick Share</h2>
                
                {/* Radar Animation */}
                <div className="relative flex items-center justify-center w-80 h-80">
                    {/* Central User */}
                    <div className="w-20 h-20 bg-blue-600 rounded-full z-20 flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.6)]">
                         <Share2 className="w-10 h-10 text-white" />
                    </div>
                    
                    {/* Ripples */}
                    <div className="absolute w-full h-full border border-blue-500/30 rounded-full animate-ping-slow opacity-0 delay-0"></div>
                    <div className="absolute w-[80%] h-[80%] border border-blue-500/40 rounded-full animate-ping-slow opacity-0 delay-[1s]"></div>
                    <div className="absolute w-[60%] h-[60%] border border-blue-500/50 rounded-full animate-ping-slow opacity-0 delay-[2s]"></div>

                    {/* Found Devices */}
                    {foundDevices.map((dev, i) => (
                        <div 
                            key={i} 
                            className="absolute flex flex-col items-center animate-scale-in cursor-pointer"
                            style={{ transform: `translate(${dev.x}px, ${dev.y}px)` }}
                        >
                            <div className="w-14 h-14 bg-gray-700/80 backdrop-blur-md rounded-full flex items-center justify-center mb-2 hover:bg-blue-600 transition-colors border border-white/10">
                                <dev.icon className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xs font-medium text-gray-300 bg-black/50 px-2 py-0.5 rounded-md">{dev.name}</span>
                        </div>
                    ))}
                </div>

                <p className="mt-12 text-sm text-gray-400 animate-pulse">Searching for devices nearby...</p>
            </div>
            
            <div className="p-8 text-center bg-gradient-to-t from-black to-transparent">
                <p className="text-xs text-gray-500">Make sure Bluetooth and Wi-Fi are turned on.</p>
            </div>
        </div>
    );
};

// --- App Library ---
export const AppLibraryScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const categories = [
        { name: 'Suggestions', apps: [MessageCircle, Phone, Globe, Image] },
        { name: 'Productivity', apps: [StickyNote, Calculator, Clock, Folder] },
        { name: 'Entertainment', apps: [Music, Video, Gamepad2, Smile] },
        { name: 'Utilities', apps: [Settings, ShieldCheck, Wifi, Battery] },
    ];

    return (
        <div className="h-full w-full bg-gray-900/95 backdrop-blur-xl text-white p-6 flex flex-col animate-slide-left">
            <div className="flex items-center bg-gray-800 rounded-xl px-4 py-2 mb-6">
                <Search className="w-5 h-5 text-gray-400" />
                <input type="text" placeholder="App Library" className="bg-transparent border-none outline-none ml-2 text-sm w-full placeholder-gray-500" />
            </div>

            <div className="grid grid-cols-2 gap-4 overflow-y-auto pb-20 no-scrollbar">
                {categories.map((cat, i) => (
                    <div key={i} className="bg-gray-800/50 rounded-2xl p-4 flex flex-col gap-3">
                        <span className="text-xs font-bold text-gray-400 pl-1">{cat.name}</span>
                        <div className="grid grid-cols-2 gap-2">
                             {cat.apps.map((Icon, j) => (
                                 <div key={j} className="bg-gray-700/50 p-2 rounded-lg flex items-center justify-center">
                                     <Icon className="w-5 h-5 text-white" />
                                 </div>
                             ))}
                        </div>
                    </div>
                ))}
            </div>

            <button onClick={onClose} className="mt-auto mx-auto p-4"><ChevronLeft className="w-8 h-8 text-gray-500" /></button>
        </div>
    );
};

// --- Modes and Routines App ---
export const ModesRoutinesApp: React.FC<{ onClose: () => void, activeMode: ModeType, setMode: (m: ModeType) => void }> = ({ onClose, activeMode, setMode }) => {
    const modes = [
        { id: 'SLEEP', label: 'Sleep', icon: MoonStar, color: 'bg-indigo-600', desc: 'Grayscale screen, DND on' },
        { id: 'WORK', label: 'Work', icon: Briefcase, color: 'bg-blue-600', desc: 'Focus tools, Silence calls' },
        { id: 'RELAX', label: 'Relax', icon: Coffee, color: 'bg-green-500', desc: 'Calm colors, Music auto-play' },
    ];

    return (
        <div className="h-full w-full bg-[#f2f2f2] text-black flex flex-col animate-fade-in">
            <div className="p-4 flex items-center justify-between bg-white border-b">
                <div className="flex items-center gap-2">
                    <button onClick={onClose}><ChevronLeft /></button>
                    <span className="font-bold text-lg">Modes and Routines</span>
                </div>
                <Plus className="w-6 h-6" />
            </div>
            
            <div className="p-4 space-y-4">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">My Modes</h3>
                <div className="grid grid-cols-2 gap-3">
                    {modes.map((mode) => (
                        <div 
                            key={mode.id} 
                            onClick={() => setMode(activeMode === mode.id ? 'NONE' : mode.id as ModeType)}
                            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer shadow-sm flex flex-col gap-3 ${activeMode === mode.id ? 'bg-white border-blue-500 ring-4 ring-blue-500/20' : 'bg-white border-transparent'}`}
                        >
                            <div className={`w-10 h-10 rounded-full ${mode.color} flex items-center justify-center text-white`}>
                                <mode.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold">{mode.label}</h4>
                                <p className="text-xs text-gray-400 leading-tight mt-1">{mode.desc}</p>
                            </div>
                            {activeMode === mode.id && (
                                <div className="mt-auto bg-blue-50 text-blue-600 text-xs font-bold py-1 px-2 rounded-lg self-start">
                                    ON
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- Theme Store App ---
export const ThemeStoreApp: React.FC<{ onClose: () => void, setTheme: (t: ThemeType) => void }> = ({ onClose, setTheme }) => {
    return (
        <div className="h-full w-full bg-white flex flex-col animate-fade-in">
             <div className="h-16 flex items-center px-4 justify-between border-b">
                 <button onClick={onClose}><ChevronLeft /></button>
                 <span className="font-bold text-lg text-purple-600">Galaxy Themes</span>
                 <Search className="w-5 h-5" />
             </div>
             
             <div className="flex-1 overflow-y-auto p-4">
                 <div className="w-full h-48 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-6 flex items-center justify-center text-white relative overflow-hidden">
                     <div className="text-center z-10">
                         <h2 className="text-2xl font-bold mb-1">Featured</h2>
                         <p className="opacity-90">New collection</p>
                     </div>
                     <Sparkles className="absolute top-4 right-4 text-white/50 w-12 h-12" />
                 </div>

                 <h3 className="font-bold mb-3">Top Picks</h3>
                 <div className="grid grid-cols-2 gap-4">
                     <div onClick={() => setTheme('DEFAULT')} className="cursor-pointer group">
                         <div className="aspect-[9/16] bg-gradient-to-br from-blue-900 via-purple-900 to-orange-800 rounded-xl mb-2 group-hover:shadow-lg transition-all border border-gray-200"></div>
                         <span className="text-sm font-medium">Default Dynamic</span>
                     </div>
                     <div onClick={() => setTheme('NEON')} className="cursor-pointer group">
                         <div className="aspect-[9/16] bg-gradient-to-br from-black via-gray-900 to-green-400 rounded-xl mb-2 group-hover:shadow-lg transition-all border border-gray-200 ring-2 ring-transparent group-hover:ring-green-400"></div>
                         <span className="text-sm font-medium">Cyber Neon</span>
                     </div>
                     <div onClick={() => setTheme('PASTEL')} className="cursor-pointer group">
                         <div className="aspect-[9/16] bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 rounded-xl mb-2 group-hover:shadow-lg transition-all border border-gray-200"></div>
                         <span className="text-sm font-medium">Cotton Candy</span>
                     </div>
                     <div onClick={() => setTheme('DARK_MATTER')} className="cursor-pointer group">
                         <div className="aspect-[9/16] bg-black rounded-xl mb-2 group-hover:shadow-lg transition-all border border-gray-200 border-white/20"></div>
                         <span className="text-sm font-medium">Dark Matter</span>
                     </div>
                 </div>
             </div>
        </div>
    );
};

// --- Settings App ---
export const SettingsApp: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [subScreen, setSubScreen] = useState<'MAIN' | 'NOTIFICATIONS' | 'BATTERY'>('MAIN');
  const [chargeLimit, setChargeLimit] = useState(true);

  const NotificationHistory = () => (
      <div className="flex-1 flex flex-col bg-gray-50 animate-slide-left">
          <div className="p-4 border-b flex items-center gap-2 bg-white">
              <button onClick={() => setSubScreen('MAIN')}><ChevronLeft /></button>
              <span className="font-bold">Notification History</span>
          </div>
          <div className="p-4 space-y-4 overflow-y-auto">
              <div className="flex items-center justify-between text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">
                  <span>Recently Dismissed</span>
                  <span className="text-blue-500">Clear all</span>
              </div>
              {[
                  { app: 'WhatsApp', time: '10:45 AM', text: 'Mom: Where are you?', icon: MessageCircle, color: 'bg-green-500' },
                  { app: 'System', time: '09:00 AM', text: 'Software update postponed', icon: ShieldCheck, color: 'bg-gray-500' },
                  { app: 'Instagram', time: 'Yesterday', text: 'zuck liked your story', icon: Image, color: 'bg-pink-500' },
                  { app: 'Missed Call', time: 'Yesterday', text: '+88017...', icon: Phone, color: 'bg-red-500' },
                  { app: 'Device Care', time: '2 days ago', text: 'High battery usage detected', icon: Battery, color: 'bg-blue-500' },
              ].map((notif, i) => (
                  <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-3">
                      <div className={`w-10 h-10 rounded-full ${notif.color} flex items-center justify-center text-white shrink-0`}>
                          <notif.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                          <div className="flex justify-between items-start">
                              <span className="font-bold text-sm text-gray-800">{notif.app}</span>
                              <span className="text-xs text-gray-400">{notif.time}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{notif.text}</p>
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );

  const BatterySettings = () => (
      <div className="flex-1 flex flex-col bg-gray-50 animate-slide-left">
          <div className="p-4 border-b flex items-center gap-2 bg-white">
              <button onClick={() => setSubScreen('MAIN')}><ChevronLeft /></button>
              <span className="font-bold">Battery</span>
          </div>
          <div className="p-4 space-y-4">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
                   <div className="flex justify-between items-center border-b pb-4">
                       <span className="font-medium">Battery Health</span>
                       <span className="text-green-600 font-bold">Good (100%)</span>
                   </div>
                   <div className="flex justify-between items-center">
                       <div className="flex flex-col">
                           <span className="font-medium">Charging Limit</span>
                           <span className="text-xs text-gray-500">Limit charge to 80% to extend lifespan</span>
                       </div>
                       <div 
                         onClick={() => setChargeLimit(!chargeLimit)}
                         className={`w-12 h-7 rounded-full flex items-center p-1 cursor-pointer transition-colors ${chargeLimit ? 'bg-blue-600 justify-end' : 'bg-gray-300 justify-start'}`}
                       >
                           <div className="w-5 h-5 bg-white rounded-full shadow-md"></div>
                       </div>
                   </div>
              </div>
          </div>
      </div>
  );

  return (
    <div className="h-full w-full bg-gray-50 text-black flex flex-col animate-fade-in">
      {subScreen === 'MAIN' ? (
          <>
            <div className="h-14 flex items-center px-4 gap-4 border-b bg-white">
                <button onClick={onClose}><ChevronLeft className="w-6 h-6" /></button>
                <span className="font-bold text-lg">Settings</span>
                <div className="flex-1"></div>
                <Search className="w-5 h-5" />
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white"><Wifi className="w-5 h-5" /></div>
                        <span className="font-medium">Connections</span>
                        </div>
                        <span className="text-xs text-gray-400">Wi-Fi, Bluetooth</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white"><Volume2 className="w-5 h-5" /></div>
                        <span className="font-medium">Sounds and vibration</span>
                        </div>
                        <span className="text-xs text-gray-400">Sound, Ringtone</span>
                    </div>
                    <div 
                        className="flex items-center justify-between cursor-pointer active:bg-gray-50 transition-colors"
                        onClick={() => setSubScreen('NOTIFICATIONS')}
                    >
                        <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white"><Bell className="w-5 h-5" /></div>
                        <span className="font-medium">Notifications</span>
                        </div>
                        <span className="text-xs text-gray-400">Status bar, Do not disturb</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white"><Sparkles className="w-5 h-5" /></div>
                        <span className="font-medium">Galaxy AI</span>
                        </div>
                        <span className="text-xs text-blue-500 font-bold">New features</span>
                    </div>
                    <div 
                        className="flex items-center justify-between cursor-pointer active:bg-gray-50 transition-colors"
                        onClick={() => setSubScreen('BATTERY')}
                    >
                        <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white"><Battery className="w-5 h-5" /></div>
                        <span className="font-medium">Battery</span>
                        </div>
                        <span className="text-xs text-gray-400">Power saving, Charging</span>
                    </div>
                </div>
            </div>
          </>
      ) : subScreen === 'NOTIFICATIONS' ? (
          <NotificationHistory />
      ) : (
          <BatterySettings />
      )}
    </div>
  );
};

// --- Calculator App ---
export const CalculatorApp: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [display, setDisplay] = useState("0");
  const [aiNote, setAiNote] = useState(false);

  const handlePress = (val: string) => {
      setDisplay(prev => prev === "0" ? val : prev + val);
  };

  return (
      <div className="h-full w-full bg-white text-black flex flex-col relative">
          <button onClick={onClose} className="absolute top-4 left-4 z-10"><X className="w-6 h-6" /></button>
          
          <div className="flex-1 flex flex-col items-end justify-end p-8 pb-4 space-y-2">
              {aiNote && (
                  <div className="w-full bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-sm text-gray-600 mb-4 animate-fade-in">
                      <div className="flex items-center gap-1 text-yellow-600 font-bold mb-1"><Sparkles className="w-3 h-3" /> Math Notes</div>
                      <p>Handwriting detected: "Integrate x^2". Result: x^3/3 + C</p>
                  </div>
              )}
              <span className="text-6xl font-light tracking-tight">{display}</span>
          </div>

          <div className="h-[60%] bg-gray-50 rounded-t-3xl p-4 grid grid-cols-4 gap-2">
              {['C', '()', '%', '/'].map(b => <button key={b} onClick={() => setDisplay("0")} className="bg-gray-200 rounded-full text-green-600 font-bold text-xl">{b}</button>)}
              {['7','8','9','*','4','5','6','-','1','2','3','+'].map(b => (
                  <button key={b} onClick={() => handlePress(b)} className={`rounded-full text-2xl font-medium ${['*','-','+'].includes(b) ? 'bg-gray-200 text-green-600' : 'bg-white'}`}>{b}</button>
              ))}
              <button onClick={() => setAiNote(!aiNote)} className="bg-green-100 text-green-700 rounded-full flex items-center justify-center"><PenTool className="w-6 h-6" /></button>
              <button onClick={() => handlePress('0')} className="bg-white rounded-full text-2xl font-medium">0</button>
              <button className="bg-white rounded-full text-2xl font-medium">.</button>
              <button className="bg-green-500 text-white rounded-full text-2xl font-medium"><Equal /></button>
          </div>
      </div>
  );
};

// --- Device Care App ---
export const DeviceCareApp: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [optimizing, setOptimizing] = useState(false);
    const [score, setScore] = useState(95);

    const handleOptimize = () => {
        setOptimizing(true);
        setTimeout(() => {
            setScore(100);
            setOptimizing(false);
        }, 1500);
    };

    return (
        <div className="h-full w-full bg-[#f8f9fa] text-black flex flex-col">
            <div className="p-4 flex items-center gap-4 bg-white border-b sticky top-0">
                <button onClick={onClose}><ChevronLeft /></button>
                <span className="font-bold">Device Care</span>
            </div>
            
            <div className="flex-1 p-6 flex flex-col items-center pt-10 space-y-8">
                 <div className="flex flex-col items-center gap-2">
                     <div className={`w-48 h-48 rounded-full border-[12px] flex items-center justify-center flex-col transition-all duration-500 ${score === 100 ? 'border-blue-500 text-blue-600' : 'border-blue-300 text-blue-400'}`}>
                         <span className="text-5xl font-bold">{optimizing ? '...' : score}</span>
                         <span className="text-sm text-gray-500 font-medium">{score === 100 ? 'Great!' : 'Good'}</span>
                     </div>
                 </div>

                 <div className="w-full space-y-3">
                     <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                         <div className="flex items-center gap-3">
                            <Battery className="w-5 h-5 text-gray-500" />
                            <span className="font-medium">Battery</span>
                         </div>
                         <span className="text-sm text-gray-500">14h 20m left</span>
                     </div>
                     <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                         <div className="flex items-center gap-3">
                            <HardDrive className="w-5 h-5 text-gray-500" />
                            <span className="font-medium">Storage</span>
                         </div>
                         <span className="text-sm text-gray-500">45.2 GB / 256 GB</span>
                     </div>
                     <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                         <div className="flex items-center gap-3">
                            <Cpu className="w-5 h-5 text-gray-500" />
                            <span className="font-medium">Memory</span>
                         </div>
                         <span className="text-sm text-gray-500">3.2 GB / 12 GB</span>
                     </div>
                 </div>

                 <div className="mt-auto w-full pb-8">
                     <button 
                        onClick={handleOptimize}
                        disabled={score === 100 || optimizing}
                        className={`w-full py-4 rounded-full font-bold shadow-lg active:scale-95 transition-all text-white ${score === 100 ? 'bg-gray-300' : 'bg-blue-600 hover:bg-blue-700'}`}
                     >
                         {optimizing ? 'Optimizing...' : score === 100 ? 'Optimized' : 'Optimize Now'}
                     </button>
                 </div>
            </div>
        </div>
    );
};

// --- AR Zone App ---
export const ARZoneApp: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [effect, setEffect] = useState<'NONE' | 'CAT' | 'DOG' | 'GLASSES'>('NONE');

    return (
        <div className="h-full w-full bg-black relative flex flex-col">
            {/* Camera Feed Simulator */}
            <div className="absolute inset-0 bg-gray-900 overflow-hidden">
                <img 
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600" 
                    alt="Face" 
                    className="w-full h-full object-cover opacity-80"
                />
                
                {/* AR Overlays */}
                {effect === 'CAT' && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-3/4 w-32 h-32 pointer-events-none">
                         <span className="text-6xl absolute -top-10 -left-4 rotate-[-10deg]">👂</span>
                         <span className="text-6xl absolute -top-10 -right-4 rotate-[10deg]">👂</span>
                         <span className="text-4xl absolute top-1/2 left-1/2 -translate-x-1/2">🐱</span>
                    </div>
                )}
                {effect === 'DOG' && (
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 pointer-events-none text-6xl flex justify-center items-center">
                        🐶
                     </div>
                )}
                {effect === 'GLASSES' && (
                    <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-40 text-6xl text-center pointer-events-none">
                        🕶️
                    </div>
                )}
            </div>

            {/* UI */}
            <div className="z-10 flex flex-col justify-between h-full p-6">
                <div className="flex justify-between items-start">
                     <div className="bg-black/50 px-3 py-1 rounded-full text-white text-xs font-bold backdrop-blur-md">
                        AR Emoji Camera
                     </div>
                     <button onClick={onClose}><X className="text-white drop-shadow-md" /></button>
                </div>

                <div className="mb-8">
                     <div className="flex justify-center gap-4 overflow-x-auto pb-4 no-scrollbar">
                         <button onClick={() => setEffect('NONE')} className={`w-14 h-14 rounded-full border-2 ${effect === 'NONE' ? 'border-yellow-400 bg-white/20' : 'border-white/30 bg-black/50'} flex items-center justify-center text-xl`}>🚫</button>
                         <button onClick={() => setEffect('CAT')} className={`w-14 h-14 rounded-full border-2 ${effect === 'CAT' ? 'border-yellow-400 bg-white/20' : 'border-white/30 bg-black/50'} flex items-center justify-center text-xl`}>🐱</button>
                         <button onClick={() => setEffect('DOG')} className={`w-14 h-14 rounded-full border-2 ${effect === 'DOG' ? 'border-yellow-400 bg-white/20' : 'border-white/30 bg-black/50'} flex items-center justify-center text-xl`}>🐶</button>
                         <button onClick={() => setEffect('GLASSES')} className={`w-14 h-14 rounded-full border-2 ${effect === 'GLASSES' ? 'border-yellow-400 bg-white/20' : 'border-white/30 bg-black/50'} flex items-center justify-center text-xl`}>🕶️</button>
                     </div>
                     <p className="text-center text-white text-sm font-medium drop-shadow-md">Select an AR effect</p>
                </div>
            </div>
        </div>
    );
};

// --- Kids Mode App ---
export const KidsModeApp: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [pinPrompt, setPinPrompt] = useState(false);
    const [pin, setPin] = useState("");

    const handleClose = () => {
        setPinPrompt(true);
    };

    const handlePin = (n: string) => {
        const newPin = pin + n;
        setPin(newPin);
        if (newPin === "1234") {
            onClose();
        } else if (newPin.length >= 4) {
            setPin("");
        }
    };

    if (pinPrompt) {
        return (
            <div className="h-full w-full bg-blue-500 flex flex-col items-center justify-center text-white p-8 animate-fade-in">
                 <Lock className="w-16 h-16 mb-4" />
                 <h2 className="text-2xl font-bold mb-8">Enter PIN to Exit</h2>
                 <div className="flex gap-2 mb-8">
                     {[...Array(4)].map((_, i) => (
                         <div key={i} className={`w-4 h-4 rounded-full ${i < pin.length ? 'bg-white' : 'bg-white/30'}`}></div>
                     ))}
                 </div>
                 <div className="grid grid-cols-3 gap-6">
                     {[1,2,3,4,5,6,7,8,9].map(n => (
                         <button key={n} onClick={() => handlePin(n.toString())} className="w-16 h-16 bg-white/20 rounded-full text-2xl font-bold active:bg-white/40">{n}</button>
                     ))}
                     <div className="col-start-2">
                        <button onClick={() => handlePin("0")} className="w-16 h-16 bg-white/20 rounded-full text-2xl font-bold active:bg-white/40">0</button>
                     </div>
                     <div className="col-start-3 flex items-center justify-center">
                        <button onClick={() => setPinPrompt(false)} className="text-sm font-bold opacity-80">Cancel</button>
                     </div>
                 </div>
                 <p className="mt-8 text-xs opacity-60">Try 1234</p>
            </div>
        );
    }

    return (
        <div className="h-full w-full bg-[#87CEEB] relative overflow-hidden flex flex-col">
            {/* Clouds */}
            <div className="absolute top-10 left-10 text-white/60"><Sparkles className="w-12 h-12" /></div>
            <div className="absolute top-20 right-20 text-white/40"><Sparkles className="w-8 h-8" /></div>
            
            <div className="flex justify-between items-center p-6 z-10">
                <span className="text-white font-black text-xl tracking-wider drop-shadow-md">Samsung Kids</span>
                <button onClick={handleClose} className="p-2 bg-white/20 rounded-full"><X className="text-white" /></button>
            </div>

            <div className="flex-1 p-6 grid grid-cols-2 gap-4 content-center">
                 <div className="aspect-square bg-[#FFD700] rounded-3xl shadow-xl flex flex-col items-center justify-center gap-2 transform hover:scale-105 transition-transform border-4 border-white/20">
                     <div className="text-5xl">🐊</div>
                     <span className="font-bold text-yellow-900">Crocro</span>
                 </div>
                 <div className="aspect-square bg-[#FF69B4] rounded-3xl shadow-xl flex flex-col items-center justify-center gap-2 transform hover:scale-105 transition-transform border-4 border-white/20">
                     <Palette className="w-12 h-12 text-white" />
                     <span className="font-bold text-pink-900">Canvas</span>
                 </div>
                 <div className="aspect-square bg-[#98FB98] rounded-3xl shadow-xl flex flex-col items-center justify-center gap-2 transform hover:scale-105 transition-transform border-4 border-white/20">
                     <Mic className="w-12 h-12 text-green-800" />
                     <span className="font-bold text-green-900">Voice</span>
                 </div>
                 <div className="aspect-square bg-[#8A2BE2] rounded-3xl shadow-xl flex flex-col items-center justify-center gap-2 transform hover:scale-105 transition-transform border-4 border-white/20">
                     <Gamepad2 className="w-12 h-12 text-white" />
                     <span className="font-bold text-purple-200">Games</span>
                 </div>
            </div>

            <div className="p-4 relative h-32">
                <div className="absolute bottom-0 w-full h-24 bg-[#90EE90] rounded-t-[50%] scale-150 border-t-8 border-[#32CD32]"></div>
            </div>
        </div>
    );
};

// --- Clock App ---
export const ClockApp: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    return (
        <div className="h-full w-full bg-[#0a0a0a] text-white flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-64 h-64 rounded-full border-4 border-gray-800 flex items-center justify-center relative">
                     <div className="absolute top-0 w-1 h-4 bg-orange-500"></div>
                     <span className="text-6xl font-thin tracking-wider">08:30</span>
                     <span className="absolute bottom-10 text-gray-500 text-sm">AM</span>
                </div>
            </div>
            <div className="h-20 border-t border-gray-800 flex justify-around items-center text-xs text-gray-500">
                <div className="flex flex-col items-center text-white gap-1"><Clock className="w-6 h-6" /><span>Alarm</span></div>
                <div className="flex flex-col items-center gap-1"><Globe className="w-6 h-6" /><span>World</span></div>
                <div className="flex flex-col items-center gap-1"><Smartphone className="w-6 h-6" /><span>Stopwatch</span></div>
                <div className="flex flex-col items-center gap-1"><Clock className="w-6 h-6" /><span>Timer</span></div>
            </div>
            <button onClick={onClose} className="absolute top-4 right-4"><X className="w-6 h-6 text-gray-500" /></button>
        </div>
    );
};

// --- Music Player App ---
export const MusicPlayerApp: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [playing, setPlaying] = useState(false);
    
    return (
        <div className="h-full w-full bg-gradient-to-b from-indigo-900 to-black text-white flex flex-col p-6">
            <div className="flex justify-between items-center mb-8">
                <button onClick={onClose}><ChevronLeft /></button>
                <span className="text-xs tracking-widest uppercase opacity-70">Now Playing</span>
                <MoreVertical className="w-5 h-5" />
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center mb-10">
                <div className={`w-64 h-64 bg-gray-800 rounded-3xl shadow-2xl overflow-hidden mb-8 border border-white/10 ${playing ? 'scale-105' : 'scale-100'} transition-transform duration-700`}>
                   <div className="w-full h-full bg-gradient-to-tr from-purple-500 to-orange-500 flex items-center justify-center">
                       <Music className="w-24 h-24 text-white/20" />
                   </div>
                </div>
                <h2 className="text-2xl font-bold mb-1">Over The Horizon</h2>
                <p className="text-gray-400">Samsung Orchestra</p>
            </div>

            <div className="space-y-6 mb-8">
                <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div className="w-1/3 h-full bg-white"></div>
                </div>
                <div className="flex justify-between items-center">
                    <SkipBack className="w-8 h-8" />
                    <button onClick={() => setPlaying(!playing)} className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-black shadow-lg active:scale-95 transition-transform">
                        {playing ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                    </button>
                    <SkipForward className="w-8 h-8" />
                </div>
            </div>
        </div>
    );
};

// --- My Files App ---
export const MyFilesApp: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    return (
        <div className="h-full w-full bg-[#f8f9fa] text-black flex flex-col">
            <div className="p-4 flex items-center gap-4 bg-white border-b sticky top-0">
                <button onClick={onClose}><ChevronLeft /></button>
                <span className="font-bold">My Files</span>
            </div>
            
            <div className="p-4 space-y-6 overflow-y-auto">
                <div>
                    <h3 className="text-sm font-bold text-gray-500 mb-3 ml-1">Categories</h3>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-white p-4 rounded-2xl flex flex-col items-center gap-2 shadow-sm border border-gray-100">
                             <Image className="w-8 h-8 text-orange-500" />
                             <span className="text-xs font-medium">Images</span>
                        </div>
                        <div className="bg-white p-4 rounded-2xl flex flex-col items-center gap-2 shadow-sm border border-gray-100">
                             <Video className="w-8 h-8 text-purple-500" />
                             <span className="text-xs font-medium">Videos</span>
                        </div>
                        <div className="bg-white p-4 rounded-2xl flex flex-col items-center gap-2 shadow-sm border border-gray-100">
                             <FileText className="w-8 h-8 text-blue-500" />
                             <span className="text-xs font-medium">Docs</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-bold text-gray-500 mb-3 ml-1">Recent Files</h3>
                    <div className="space-y-2">
                        {[1,2,3].map(i => (
                            <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <Image className="w-5 h-5 text-gray-500" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">IMG_20250124_{i}.jpg</p>
                                    <p className="text-xs text-gray-400">2.4 MB • Just now</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Circle To Search Overlay ---
export const CircleToSearchOverlay: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [phase, setPhase] = useState<'INITIAL' | 'SELECTING' | 'SEARCHING'>('INITIAL');
    const [selection, setSelection] = useState<{x:number, y:number} | null>(null);

    useEffect(() => {
        // Simulate "Screen Capture" effect
        setTimeout(() => setPhase('SELECTING'), 500);
    }, []);

    const handleSearch = (e: React.MouseEvent) => {
        if (phase !== 'SELECTING') return;
        const rect = e.currentTarget.getBoundingClientRect();
        setSelection({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        setPhase('SEARCHING');
        setTimeout(() => {
             // Mock result
        }, 1500);
    };

    return (
        <div className="absolute inset-0 z-[100] cursor-crosshair overflow-hidden" onClick={handleSearch}>
            {/* Dimmed Background mimicking screen freeze */}
            <div className="absolute inset-0 bg-blue-900/30 backdrop-blur-[2px] animate-fade-in"></div>
            
            {/* Hint */}
            {phase === 'SELECTING' && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse pointer-events-none">
                    Circle anything to search
                </div>
            )}

            {/* Selection Effect */}
            {phase === 'SEARCHING' && selection && (
                <>
                    <div 
                        className="absolute w-24 h-24 rounded-full border-4 border-white shadow-[0_0_20px_rgba(255,255,255,0.8)] animate-ping-slow"
                        style={{ top: selection.y - 48, left: selection.x - 48 }}
                    ></div>
                    
                    {/* Search Results Sheet */}
                    <div className="absolute bottom-0 w-full h-1/2 bg-white rounded-t-3xl animate-slide-up p-6 flex flex-col items-center">
                        <div className="w-12 h-1 bg-gray-300 rounded-full mb-6"></div>
                        <div className="flex items-center gap-2 mb-4">
                            <img src="https://www.google.com/favicon.ico" className="w-6 h-6" alt="G" />
                            <span className="font-bold text-lg text-gray-700">Google Search</span>
                        </div>
                        <div className="w-full space-y-4">
                             <div className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                 <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                                 <div className="flex-1">
                                     <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                     <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                 </div>
                             </div>
                             <div className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                 <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                                 <div className="flex-1">
                                     <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                     <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                 </div>
                             </div>
                        </div>
                        <button onClick={(e) => {e.stopPropagation(); onClose();}} className="mt-auto mb-4 p-2 bg-gray-100 rounded-full"><X className="w-6 h-6" /></button>
                    </div>
                </>
            )}
            
            {/* Visual Flare at bottom */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-20 bg-gradient-to-t from-white/20 to-transparent pointer-events-none"></div>
        </div>
    );
};

// --- Camera App (Existing) ---
export const CameraApp: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [zoom, setZoom] = useState(1);
  
  return (
    <div className="h-full w-full bg-black text-white flex flex-col relative animate-fade-in">
      {/* Simulated Viewfinder */}
      <div className="flex-1 relative bg-gray-900 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1542259681-d262d968503e?q=80&w=1000&auto=format&fit=crop" 
          alt="Viewfinder" 
          className="absolute inset-0 w-full h-full object-cover opacity-80"
          style={{ transform: `scale(${Math.max(1, zoom)})`, transition: 'transform 0.3s ease-out' }}
        />
        
        {/* Overlays */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          <div className="bg-black/50 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 backdrop-blur-md">
            <Sparkles className="w-3 h-3 text-yellow-400" /> Scene Optimizer: Nature
          </div>
          <button onClick={onClose}><X className="w-6 h-6 drop-shadow-md" /></button>
        </div>

        {/* Focus Box Animation */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-yellow-400/80 rounded-sm animate-pulse pointer-events-none"></div>
      </div>

      {/* Controls */}
      <div className="h-48 bg-black/80 backdrop-blur-lg flex flex-col justify-between pb-6 pt-2 px-4 z-10">
        {/* Zoom Toggles */}
        <div className="flex justify-center gap-4 mb-2">
          {[0.6, 1, 3, 5, 10].map(z => (
            <button 
              key={z} 
              onClick={() => setZoom(z)}
              className={`text-xs font-bold w-8 h-8 rounded-full flex items-center justify-center transition-all ${zoom === z ? 'bg-white text-black scale-110' : 'bg-gray-800 text-white'}`}
            >
              {z}x
            </button>
          ))}
        </div>

        {/* Shutter Area */}
        <div className="flex justify-between items-center px-6">
           <div className="w-12 h-12 bg-gray-800 rounded-lg overflow-hidden border border-white/20">
             <img src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=100" alt="Gallery Preview" className="w-full h-full object-cover opacity-60" />
           </div>
           <button className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center active:scale-95 transition-transform">
             <div className="w-16 h-16 bg-white rounded-full"></div>
           </button>
           <button className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-800/50">
             <RefreshCw className="w-6 h-6 text-white" />
           </button>
        </div>
      </div>
    </div>
  );
};

// --- Gallery App (Enhanced with Generative Edit) ---
export const GalleryApp: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [view, setView] = useState<'GRID' | 'SINGLE' | 'EDIT'>('GRID');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [genEditActive, setGenEditActive] = useState(false);
  const [editPrompt, setEditPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [editResult, setEditResult] = useState<string | null>(null);
  
  // Selection State
  const [selectionPath, setSelectionPath] = useState<{x: number, y: number}[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  const photos: Photo[] = [
    { id: '1', url: 'https://images.unsplash.com/photo-1542259681-d262d968503e?q=80&w=600', description: 'Mountain View' },
    { id: '2', url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=600', description: 'Sunset' },
    { id: '3', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600', description: 'Beach' },
    { id: '4', url: 'https://images.unsplash.com/photo-1517816161823-467647c23f82?q=80&w=600', description: 'Night Sky' },
  ];

  const handleGenerativeEdit = async () => {
    if (!editPrompt.trim() && selectionPath.length === 0) return;
    setIsProcessing(true);
    const result = await generateGalaxyResponse(
      `Edit this photo. User Selection: ${selectionPath.length > 0 ? "User drew a lasso selection" : "No selection"}. Prompt: ${editPrompt}`, 
      'photo_edit'
    );
    setEditResult(result);
    setIsProcessing(false);
    setSelectionPath([]); // Clear selection after generate
  };

  // Drawing Handlers
  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    if (!imageRef.current) return null;
    const rect = imageRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    
    // Calculate relative coordinates (0-100%)
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    return { x, y };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!genEditActive) return;
    setIsDrawing(true);
    setSelectionPath([]);
    const coords = getCoordinates(e);
    if (coords) setSelectionPath([coords]);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !genEditActive) return;
    const coords = getCoordinates(e);
    if (coords) setSelectionPath(prev => [...prev, coords]);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    // Close the loop visually
    if (selectionPath.length > 2) {
        setSelectionPath(prev => [...prev, prev[0]]);
    }
  };

  // Render SVG Path string
  const getPathString = () => {
    if (selectionPath.length === 0) return "";
    return selectionPath.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(" ");
  };

  return (
    <div className="h-full w-full bg-black text-white flex flex-col animate-fade-in relative">
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-4 z-20 bg-gradient-to-b from-black/80 to-transparent">
        {view === 'GRID' ? (
          <>
            <span className="font-bold text-lg">Gallery</span>
            <div className="flex gap-4">
              <Search className="w-5 h-5" />
              <MoreVertical className="w-5 h-5" />
              <button onClick={onClose}><X className="w-6 h-6" /></button>
            </div>
          </>
        ) : (
          <>
            <button onClick={() => {
                if(genEditActive) {
                    setGenEditActive(false);
                    setEditResult(null);
                    setSelectionPath([]);
                    setEditPrompt("");
                } else if (view === 'EDIT') {
                    setView('SINGLE');
                } else {
                    setView('GRID');
                }
            }} className="p-2 bg-black/40 rounded-full backdrop-blur-md">
                <ChevronLeft className="w-6 h-6" />
            </button>
            {genEditActive && (
                 <div className="bg-black/50 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 backdrop-blur-md border border-white/10">
                 <Sparkles className="w-3 h-3 text-indigo-400" /> Generative Edit
               </div>
            )}
            <div className="w-10"></div> {/* Spacer */}
          </>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden relative">
        {view === 'GRID' && (
          <div className="grid grid-cols-3 gap-1 p-1">
            {photos.map(photo => (
              <div 
                key={photo.id} 
                onClick={() => { setSelectedPhoto(photo); setView('SINGLE'); }}
                className="aspect-square overflow-hidden bg-gray-800"
              >
                <img src={photo.url} alt={photo.description} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}

        {(view === 'SINGLE' || view === 'EDIT') && selectedPhoto && (
          <div className="w-full h-full flex flex-col items-center justify-center bg-black relative touch-none">
             
             {/* Image Container */}
             <div className="relative max-w-full max-h-[70vh] flex items-center justify-center">
                <img 
                    ref={imageRef}
                    src={selectedPhoto.url} 
                    className={`max-w-full max-h-[70vh] object-contain transition-all duration-500 ${genEditActive ? 'scale-95 opacity-90' : ''}`} 
                    alt="Current" 
                />

                {/* Generative Edit Overlay Layer */}
                {genEditActive && (
                    <svg 
                        className="absolute inset-0 w-full h-full z-10 cursor-crosshair"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                    >
                        {selectionPath.length > 0 && (
                            <path 
                                d={getPathString()} 
                                fill="rgba(100, 100, 255, 0.2)" 
                                stroke="white" 
                                strokeWidth="0.5" 
                                strokeDasharray="2,2"
                                className="drop-shadow-[0_0_2px_rgba(0,100,255,0.8)]"
                            />
                        )}
                        {/* Animated Selection Dots/Ants */}
                        {selectionPath.length > 2 && (
                             <circle cx={selectionPath[0].x} cy={selectionPath[0].y} r="1.5" fill="white" className="animate-pulse" />
                        )}
                    </svg>
                )}
             </div>

             {/* Generative Edit Result Overlay */}
             {editResult && (
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-xl p-6 rounded-2xl border border-indigo-500/30 max-w-[80%] text-center animate-scale-in z-30">
                     <Sparkles className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                     <p className="text-sm font-medium">{editResult}</p>
                     <button onClick={() => setEditResult(null)} className="mt-4 px-4 py-2 bg-white text-black text-xs font-bold rounded-full">Done</button>
                 </div>
             )}

             {/* Single View Toolbar */}
             {!genEditActive && (
                <div className="absolute bottom-0 w-full h-20 bg-black/80 backdrop-blur-md flex justify-around items-center px-6 border-t border-white/10">
                   <button onClick={() => { setView('EDIT'); setGenEditActive(true); }} className="flex flex-col items-center gap-1">
                      <div className="w-10 h-10 rounded-full bg-indigo-600/20 flex items-center justify-center border border-indigo-500/50">
                          <Sparkles className="w-5 h-5 text-indigo-400" />
                      </div>
                      <span className="text-[10px] text-indigo-300">AI Edit</span>
                   </button>
                   <button className="p-2"><Share2 className="w-6 h-6" /></button>
                   <button className="p-2"><Trash2 className="w-6 h-6" /></button>
                </div>
             )}

             {/* Generative Edit Toolbar */}
             {genEditActive && (
                 <div className="absolute bottom-4 left-4 right-4 bg-gray-900/90 backdrop-blur-xl p-4 rounded-3xl border border-white/10 shadow-2xl flex flex-col gap-3 animate-slide-up z-20">
                     {!isProcessing ? (
                         <>
                            <div className="flex items-center gap-3">
                                {selectionPath.length === 0 ? (
                                    <div className="flex-1 text-center text-xs text-gray-400 animate-pulse">
                                        Draw around an object to select it
                                    </div>
                                ) : (
                                    <div className="flex-1 flex gap-2 overflow-x-auto no-scrollbar">
                                        <button className="px-3 py-1.5 bg-gray-800 rounded-lg text-xs border border-white/10 whitespace-nowrap">Remove</button>
                                        <button className="px-3 py-1.5 bg-gray-800 rounded-lg text-xs border border-white/10 whitespace-nowrap">Move</button>
                                        <button className="px-3 py-1.5 bg-gray-800 rounded-lg text-xs border border-white/10 whitespace-nowrap">Resize</button>
                                    </div>
                                )}
                            </div>
                            <div className="relative flex items-center">
                                <Sparkles className="absolute left-3 w-4 h-4 text-indigo-400" />
                                <input 
                                    type="text" 
                                    value={editPrompt}
                                    onChange={(e) => setEditPrompt(e.target.value)}
                                    placeholder="Describe changes..." 
                                    className="w-full bg-black border border-indigo-500/30 rounded-full pl-9 pr-12 py-3 text-sm focus:outline-none focus:border-indigo-400 transition-colors"
                                />
                                <button 
                                    onClick={handleGenerativeEdit}
                                    className="absolute right-1 p-2 bg-indigo-600 rounded-full text-white disabled:opacity-50"
                                    disabled={!editPrompt && selectionPath.length === 0}
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                         </>
                     ) : (
                         <div className="flex flex-col items-center py-2">
                             <LoadingSparkles />
                             <div className="w-full h-1 bg-gray-800 rounded-full mt-3 overflow-hidden">
                                 <div className="h-full bg-indigo-500 animate-progress w-1/2"></div>
                             </div>
                         </div>
                     )}
                 </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Notes App ---
export const NotesApp: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [notes, setNotes] = useState<Note[]>([
    { id: '1', title: 'Meeting Notes', content: 'Discuss Q1 Roadmap. Action items: Review design specs.' },
    { id: '2', title: 'Groceries', content: '- Milk\n- Eggs\n- Coffee beans' }
  ]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const handleAiAction = async (action: string) => {
    if (!activeNote) return;
    setAiResponse("Note Assist is working...");
    const result = await generateGalaxyResponse(`${action} this text: ${activeNote.content}`, 'notes');
    setAiResponse(result);
  };

  return (
    <div className="h-full w-full bg-[#fcfcfc] text-black flex flex-col animate-fade-in">
      <div className="h-14 flex items-center justify-between px-4 border-b">
         {activeNote ? (
            <button onClick={() => {setActiveNote(null); setAiResponse(null);}}><ChevronLeft /></button>
         ) : (
            <span className="font-bold text-xl text-orange-600">Samsung Notes</span>
         )}
         <button onClick={onClose}><X /></button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {activeNote ? (
          <div className="h-full flex flex-col">
            <input 
              value={activeNote.title} 
              onChange={(e) => setActiveNote({...activeNote, title: e.target.value})}
              className="text-2xl font-bold mb-4 bg-transparent outline-none"
            />
            <textarea 
              value={activeNote.content}
              onChange={(e) => setActiveNote({...activeNote, content: e.target.value})} 
              className="flex-1 bg-transparent resize-none outline-none text-lg leading-relaxed text-gray-700"
            />
            
            {/* AI Result Card */}
            {aiResponse && (
               <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl mb-4 text-sm text-gray-800 shadow-sm">
                 <div className="flex items-center gap-2 mb-2 text-orange-600 font-bold">
                    <Sparkles className="w-4 h-4" /> Note Assist
                 </div>
                 {aiResponse}
               </div>
            )}

            {/* AI Toolbar */}
            <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                <button onClick={() => handleAiAction("Summarize")} className="flex items-center gap-1 px-3 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium whitespace-nowrap"><Sparkles className="w-3 h-3" /> Summarize</button>
                <button onClick={() => handleAiAction("Format")} className="flex items-center gap-1 px-3 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium whitespace-nowrap"><Sparkles className="w-3 h-3" /> Auto Format</button>
                <button onClick={() => handleAiAction("Translate")} className="flex items-center gap-1 px-3 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium whitespace-nowrap"><Globe className="w-3 h-3" /> Translate</button>
            </div>
          </div>
        ) : (
          <div className="grid gap-3">
            {notes.map(note => (
              <div key={note.id} onClick={() => setActiveNote(note)} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 active:scale-[0.98] transition-transform">
                <h3 className="font-bold text-lg mb-1">{note.title}</h3>
                <p className="text-gray-500 text-sm truncate">{note.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {!activeNote && (
          <button className="absolute bottom-6 right-6 w-14 h-14 bg-orange-600 text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform">
              <Edit3 className="w-6 h-6" />
          </button>
      )}
    </div>
  );
};

// --- Drawing App ---
export const DrawingApp: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate generation delay
    setTimeout(async () => {
        const desc = await generateGalaxyResponse(`Describe a generated image for prompt: ${prompt}`, 'drawing');
        // Using a placeholder image for demo purposes
        setGeneratedImage(`https://source.unsplash.com/random/400x400/?${encodeURIComponent(prompt)}`); 
        setPrompt(desc); 
        setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="h-full w-full bg-slate-50 text-slate-900 flex flex-col relative">
       <div className="absolute top-0 w-full p-4 flex justify-between z-10">
          <h2 className="font-bold text-lg flex items-center gap-2"><PenTool className="w-5 h-5" /> Sketch to Image</h2>
          <button onClick={onClose}><X className="w-6 h-6" /></button>
       </div>

       <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6">
          <div className="w-full aspect-square bg-white rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center relative overflow-hidden shadow-sm">
             {isGenerating ? (
                 <LoadingSparkles />
             ) : generatedImage ? (
                 <img src={generatedImage} alt="Generated" className="w-full h-full object-cover" />
             ) : (
                 <div className="text-center text-slate-400">
                    <Edit3 className="w-12 h-12 mx-auto mb-2 opacity-20" />
                    <p>Draw something here...</p>
                 </div>
             )}
          </div>

          <div className="w-full bg-white p-4 rounded-2xl shadow-lg border border-slate-100">
             <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-teal-500" />
                <span className="text-xs font-bold text-teal-600 uppercase">Galaxy AI</span>
             </div>
             <div className="flex gap-2">
                <input 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your sketch (e.g. 'A futuristic car')"
                  className="flex-1 bg-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button 
                  onClick={handleGenerate} 
                  disabled={isGenerating || !prompt}
                  className="bg-teal-600 text-white px-4 py-2 rounded-lg font-bold text-sm disabled:opacity-50"
                >
                  Generate
                </button>
             </div>
          </div>
       </div>
    </div>
  );
};

// --- Call App (Live Translate) ---
export const CallApp: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [status, setStatus] = useState("Incoming Call...");
  const [transcript, setTranscript] = useState<string[]>([]);
  const [isLiveTranslateOn, setIsLiveTranslateOn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
        setStatus("00:15");
        setTranscript(prev => [...prev, "Unknown: Hello? Is this support?"]);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const toggleLiveTranslate = async () => {
      setIsLiveTranslateOn(!isLiveTranslateOn);
      if (!isLiveTranslateOn) {
          const trans = await generateGalaxyResponse("Translate 'Hello? Is this support?' to Spanish.", "call");
          setTranscript(prev => [...prev, `AI (Live Translate): ${trans}`]);
      }
  };

  return (
    <div className="h-full w-full bg-gradient-to-b from-gray-800 to-black text-white flex flex-col p-8 items-center justify-between">
       <div className="flex flex-col items-center mt-10">
          <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mb-4 text-3xl font-bold">
            JS
          </div>
          <h2 className="text-2xl font-bold">John Smith</h2>
          <p className="text-gray-400">{status}</p>
       </div>

       {/* Live Translate UI */}
       {isLiveTranslateOn && (
           <div className="w-full bg-black/40 backdrop-blur-lg p-4 rounded-2xl border border-white/10 mb-4 h-48 overflow-y-auto no-scrollbar">
              <div className="flex items-center gap-2 mb-3 text-green-400">
                  <Globe className="w-4 h-4" /> <span className="text-xs font-bold uppercase">Live Translate Active</span>
              </div>
              <div className="space-y-2 text-sm">
                  {transcript.map((t, i) => (
                      <div key={i} className="bg-white/5 p-2 rounded-lg">{t}</div>
                  ))}
              </div>
           </div>
       )}

       <div className="grid grid-cols-3 gap-6 w-full mb-8">
           <button onClick={toggleLiveTranslate} className={`flex flex-col items-center gap-2 ${isLiveTranslateOn ? 'text-green-400' : 'text-white'}`}>
              <div className={`w-14 h-14 rounded-full flex items-center justify-center border ${isLiveTranslateOn ? 'border-green-400 bg-green-400/20' : 'border-white/20 bg-white/5'}`}>
                 <Sparkles className="w-6 h-6" />
              </div>
              <span className="text-xs">Call Assist</span>
           </button>
           <button className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full bg-white/5 border border-white/20 flex items-center justify-center">
                 <Mic className="w-6 h-6" />
              </div>
              <span className="text-xs">Mute</span>
           </button>
           <button className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full bg-white/5 border border-white/20 flex items-center justify-center">
                 <Volume2 className="w-6 h-6" />
              </div>
              <span className="text-xs">Speaker</span>
           </button>
       </div>

       <button onClick={onClose} className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform">
          <Phone className="w-8 h-8 fill-current rotate-[135deg]" />
       </button>
    </div>
  );
};

// --- Audio Eraser App ---
export const AudioEraserApp: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState("");
  
    const handleEraser = async () => {
      setAnalyzing(true);
      setResult("");
      setTimeout(async () => {
          const res = await generateGalaxyResponse("Remove wind noise from audio.", "audio_eraser");
          setResult(res);
          setAnalyzing(false);
      }, 2000);
    };
  
    return (
      <div className="h-full w-full bg-neutral-900 text-white p-6 flex flex-col relative">
         <button onClick={onClose} className="absolute top-4 right-4"><X /></button>
         <h2 className="text-2xl font-bold mb-8 flex items-center gap-2 text-indigo-400"><Volume2 /> Audio Eraser</h2>
         
         <div className="flex-1 flex flex-col items-center justify-center">
             <div className="w-full h-32 bg-gray-800 rounded-xl mb-8 flex items-center justify-center relative overflow-hidden border border-white/10">
                 {/* Fake Waveform */}
                 <div className="flex items-center gap-1 h-12">
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="w-1 bg-indigo-500 rounded-full animate-music-bar" style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }}></div>
                    ))}
                 </div>
             </div>
  
             {result && (
                 <div className="bg-green-500/20 text-green-300 p-4 rounded-xl border border-green-500/30 mb-6 text-sm">
                     <Check className="inline w-4 h-4 mr-2" />
                     {result}
                 </div>
             )}
  
             <button 
                onClick={handleEraser} 
                disabled={analyzing}
                className="w-full py-4 bg-indigo-600 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50"
             >
                {analyzing ? <LoadingSparkles /> : <><Wand2 className="w-5 h-5" /> Remove Noise</>}
             </button>
         </div>
      </div>
    );
};

// --- Browser App ---
export const BrowserApp: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    return (
        <div className="h-full w-full bg-white flex flex-col">
            <div className="h-16 bg-gray-100 flex items-center px-4 gap-2 border-b">
                 <button onClick={onClose}><X className="w-5 h-5 text-gray-500" /></button>
                 <div className="flex-1 h-10 bg-gray-200 rounded-full flex items-center px-4 text-sm text-gray-500">
                    <Globe className="w-4 h-4 mr-2" /> samsung.com/galaxy-s25
                 </div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center bg-gray-50">
                <Smartphone className="w-16 h-16 mb-4 text-gray-300" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">Samsung Internet</h3>
                <p>Browsing Assistant can summarize articles for you.</p>
                <div className="mt-6 flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                    <Sparkles className="w-3 h-3" /> Summarize this page
                </div>
            </div>
        </div>
    );
};

// --- Messages App ---
export const MessagesApp: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    return (
        <div className="h-full w-full bg-white flex flex-col">
             <div className="p-4 flex items-center justify-between border-b">
                 <h2 className="text-xl font-bold text-blue-600">Messages</h2>
                 <button onClick={onClose}><X className="w-6 h-6 text-gray-400" /></button>
             </div>
             <div className="flex-1 p-4 space-y-4">
                 <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center text-pink-700 font-bold">A</div>
                     <div className="flex-1">
                         <div className="flex justify-between">
                             <span className="font-bold">Alice</span>
                             <span className="text-xs text-gray-400">10:30 AM</span>
                         </div>
                         <p className="text-sm text-gray-500 truncate">Hey! Are we still on for lunch?</p>
                     </div>
                 </div>
                 <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold">M</div>
                     <div className="flex-1">
                         <div className="flex justify-between">
                             <span className="font-bold">Mark</span>
                             <span className="text-xs text-gray-400">Yesterday</span>
                         </div>
                         <p className="text-sm text-gray-500 truncate">I sent the documents.</p>
                     </div>
                 </div>
             </div>
             <div className="p-4 border-t relative">
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Chat Assist
                  </div>
                  <button className="w-12 h-12 bg-blue-600 rounded-full text-white flex items-center justify-center absolute bottom-6 right-6 shadow-lg">
                      <MessageCircle className="w-6 h-6" />
                  </button>
             </div>
        </div>
    );
};