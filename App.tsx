import React, { useState, useEffect, useRef } from 'react';
import { Battery, Signal, ChevronLeft, Square, Camera, Image, Mic, MessageSquare, StickyNote, Globe, Search, Phone as PhoneIcon, MapPin, Music2, BrainCircuit, Sparkles, Send, PenTool, GripHorizontal, X, ScanFace, Settings, Calculator, Clock, Folder, Music, Wifi, Bluetooth, Moon, Sun, Flashlight, GripVertical, Fingerprint, ShieldCheck, Smile, Baby, PanelRight, Clipboard, Compass, Palette, LayoutTemplate, Zap, Share, Library } from 'lucide-react';
import { AppScreen, SimulationState, LogMessage, ThemeType, ModeType } from './types';
import { NotesApp, DrawingApp, CallApp, AudioEraserApp, GalleryApp, CameraApp, BrowserApp, MessagesApp, SettingsApp, CalculatorApp, ClockApp, MusicPlayerApp, MyFilesApp, DeviceCareApp, CircleToSearchOverlay, ARZoneApp, KidsModeApp, ThemeStoreApp, ModesRoutinesApp, QuickShareView, AppLibraryScreen } from './components/Apps';
import { getNowBriefData, generateGalaxyResponse } from './services/geminiService';

// --- Components ---

const StatusBar: React.FC<SimulationState & { onOpenQuickPanel: () => void }> = ({ battery, time, energyScore, onOpenQuickPanel }) => (
  <div onClick={onOpenQuickPanel} className="w-full h-8 px-6 flex justify-between items-center text-xs font-medium text-white z-50 absolute top-2 select-none mix-blend-difference cursor-pointer">
    <div className="flex items-center gap-2">
      <span>{time}</span>
      <span className="opacity-60">|</span>
      <span className="flex items-center gap-1 text-pink-400">💓 {energyScore}</span>
    </div>
    <div className="flex items-center gap-3">
        <span>5G</span>
        <Signal className="w-3 h-3" />
        <span>{battery}%</span>
        <Battery className="w-4 h-4" />
    </div>
  </div>
);

// Quick Panel Component
const QuickPanel: React.FC<{ isOpen: boolean, onClose: () => void }> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-2xl z-[60] flex flex-col p-6 animate-slide-down text-white">
            <div className="flex justify-between items-center mb-8">
                 <span className="text-xl font-bold">Quick Settings</span>
                 <button onClick={onClose}><X className="w-6 h-6" /></button>
            </div>
            
            <div className="grid grid-cols-4 gap-4 mb-6">
                 {[
                    { icon: Wifi, label: 'Wi-Fi', active: true },
                    { icon: Bluetooth, label: 'Bluetooth', active: true },
                    { icon: Moon, label: 'Dark Mode', active: true },
                    { icon: Sparkles, label: 'AI Core', active: true },
                    { icon: Flashlight, label: 'Torch', active: false },
                    { icon: Globe, label: 'Data', active: true },
                 ].map((item, i) => (
                     <div key={i} className="flex flex-col items-center gap-2">
                         <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${item.active ? 'bg-blue-600' : 'bg-gray-700'}`}>
                             <item.icon className="w-6 h-6" />
                         </div>
                         <span className="text-xs">{item.label}</span>
                     </div>
                 ))}
            </div>

            <div className="bg-gray-800 rounded-2xl p-4 mb-4 flex items-center gap-3">
                 <Sun className="w-5 h-5 text-gray-400" />
                 <input type="range" className="flex-1 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer" />
            </div>

            <div className="mt-auto flex justify-center">
                 <div onClick={onClose} className="w-12 h-1 bg-gray-600 rounded-full cursor-pointer"></div>
            </div>
        </div>
    );
}

// Edge Panel Component
const EdgePanel: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Handle */}
            <div 
                className={`absolute right-0 top-1/4 w-1.5 h-20 bg-gray-400/50 rounded-l-md cursor-pointer z-50 hover:w-2 transition-all ${isOpen ? 'opacity-0' : 'opacity-100'}`}
                onClick={() => setIsOpen(true)}
            ></div>

            {/* Panel */}
            <div className={`absolute top-0 right-0 h-full w-20 bg-black/40 backdrop-blur-xl border-l border-white/10 z-[55] transition-transform duration-300 flex flex-col items-center py-20 gap-6 shadow-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div onClick={() => setIsOpen(false)} className="absolute inset-0 -z-10 cursor-pointer"></div>
                
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-white/20">
                     <Calculator className="w-6 h-6 text-white" />
                </div>
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-white/20">
                     <Compass className="w-6 h-6 text-white" />
                </div>
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-white/20">
                     <Clipboard className="w-6 h-6 text-white" />
                </div>
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-white/20">
                     <Settings className="w-6 h-6 text-white" />
                </div>

                <button onClick={() => setIsOpen(false)} className="mt-auto mb-20 text-white/50"><X /></button>
            </div>
            
            {/* Backdrop for panel */}
            {isOpen && <div className="absolute inset-0 z-40" onClick={() => setIsOpen(false)}></div>}
        </>
    );
};

// Updated Navigation Bar with 3 Buttons
const NavigationBar: React.FC<{ onHome: () => void, onBack: () => void, onRecents: () => void }> = ({ onHome, onBack, onRecents }) => (
  <div className="absolute bottom-0 w-full h-16 bg-black/90 backdrop-blur-xl flex justify-around items-center z-50 pb-2 border-t border-white/10 px-4">
    {/* Recents Button (III) */}
    <button onClick={onRecents} className="p-4 active:scale-90 active:bg-white/10 rounded-full transition-all group">
       <GripVertical className="w-6 h-6 text-white/70 group-hover:text-white rotate-90" />
    </button>
    
    {/* Home / Minimize Button (Square) */}
    <button onClick={onHome} className="p-4 active:scale-90 active:bg-white/10 rounded-full transition-all group">
       <Square className="w-5 h-5 fill-transparent stroke-[3px] rounded-[4px] text-white/70 group-hover:text-white" />
    </button>
    
    {/* Back Button (<) */}
    <button onClick={onBack} className="p-4 active:scale-90 active:bg-white/10 rounded-full transition-all group">
       <ChevronLeft className="w-8 h-8 text-white/70 group-hover:text-white" />
    </button>
  </div>
);

const AppIcon: React.FC<{ icon: React.ElementType, label: string, color: string, onClick: () => void }> = ({ icon: Icon, label, color, onClick }) => (
  <div onClick={onClick} className="flex flex-col items-center gap-2 cursor-pointer active:scale-95 transition-transform group">
    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-[1.2rem] sm:rounded-[1.5rem] ${color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all border border-white/10`}>
      <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-md" />
    </div>
    <span className="text-[10px] sm:text-xs font-medium text-white/90 tracking-wide shadow-black drop-shadow-sm truncate w-16 text-center">{label}</span>
  </div>
);

// New Recents Screen Component with Split Screen Trigger
const RecentsScreen: React.FC<{ onSelect: (screen: AppScreen) => void, onCloseApp: (screen: AppScreen) => void, onSplitScreen: (app: AppScreen) => void }> = ({ onSelect, onCloseApp, onSplitScreen }) => {
    const recentApps = [
        { id: AppScreen.MESSAGES, name: 'Messages', icon: MessageSquare, color: 'bg-blue-500' },
        { id: AppScreen.BROWSER, name: 'Internet', icon: Globe, color: 'bg-purple-500' },
        { id: AppScreen.GALLERY, name: 'Gallery', icon: Image, color: 'bg-pink-500' },
        { id: AppScreen.NOTES, name: 'Notes', icon: StickyNote, color: 'bg-orange-400' },
    ];

    return (
        <div className="h-full w-full bg-black/80 backdrop-blur-sm p-6 flex flex-col items-center justify-center gap-6 animate-fade-in">
            <h2 className="text-white/50 text-sm font-bold uppercase tracking-widest mb-4">Recent Apps</h2>
            <div className="flex flex-col gap-4 w-full h-[70%] overflow-y-auto no-scrollbar pb-20">
                {recentApps.map((app) => (
                    <div key={app.id} className="relative w-full bg-gray-800 rounded-2xl p-4 border border-white/10 shadow-xl flex flex-col gap-2 shrink-0 group">
                        <div className="flex justify-between items-center text-white">
                            <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-lg ${app.color} flex items-center justify-center`}>
                                    <app.icon className="w-3 h-3 text-white" />
                                </div>
                                <span className="font-bold text-sm">{app.name}</span>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={(e) => { e.stopPropagation(); onSplitScreen(app.id); }} className="p-1 hover:bg-white/10 rounded-full text-blue-300" title="Split Screen">
                                    <LayoutTemplate className="w-4 h-4" />
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); onCloseApp(app.id); }} className="p-1 hover:bg-white/10 rounded-full">
                                    <X className="w-4 h-4 text-gray-400" />
                                </button>
                            </div>
                        </div>
                        <div 
                            onClick={() => onSelect(app.id)}
                            className="w-full h-32 bg-gray-700/50 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors"
                        >
                           <app.icon className="w-12 h-12 text-white/20" />
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={() => onCloseApp(AppScreen.HOME)} className="text-white/80 text-sm font-medium hover:text-white bg-white/10 px-4 py-2 rounded-full">Close All</button>
        </div>
    );
};

const NowBriefWidget: React.FC = () => {
  const [data, setData] = useState("Loading Now Brief...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getNowBriefData();
        setData(result);
      } catch (e) {
        setData("Good Morning! ☀️\n• Meeting at 10AM\n• 25°C Sunny");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="w-full bg-gradient-to-br from-gray-800/40 to-black/40 backdrop-blur-2xl rounded-[2rem] p-5 text-white shadow-2xl border border-white/10 mb-6 transform transition-all hover:scale-[1.01] animate-fade-in-up">
       <div className="flex justify-between items-start mb-2">
         <div>
            <h3 className="text-xl font-light tracking-wide">Now Brief</h3>
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Daily Summary</p>
         </div>
         <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-[10px] font-bold border border-green-500/30 flex items-center gap-1">
            {loading ? <span className="animate-spin">✨</span> : <Sparkles className="w-3 h-3" />} AI Generated
         </div>
       </div>
       <div className="text-sm font-medium leading-relaxed whitespace-pre-line text-gray-100 min-h-[4rem]">
         {data}
       </div>
    </div>
  );
};

const NowBar: React.FC = () => (
    <div className="absolute bottom-20 w-[90%] left-[5%] h-14 bg-black/40 backdrop-blur-2xl rounded-full border border-white/10 flex items-center justify-between px-2 shadow-2xl z-40 animate-slide-up">
        <div className="flex items-center gap-2 px-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center"><Music2 className="w-5 h-5 text-white" /></div>
            <div className="text-xs text-white leading-tight">
                <p className="font-bold">Over The Horizon</p>
                <p className="text-gray-400">Samsung Orchestra</p>
            </div>
        </div>
        <div className="w-[1px] h-8 bg-white/10"></div>
        <div className="flex items-center gap-2 px-2">
           <MapPin className="w-4 h-4 text-orange-400" />
           <span className="text-xs text-gray-300">Dhaka, BD</span>
        </div>
    </div>
  );

// --- Main App Logic ---

export default function App() {
  const [screen, setScreen] = useState<AppScreen>(AppScreen.BOOT);
  const [lastScreen, setLastScreen] = useState<AppScreen>(AppScreen.HOME);
  
  // New State for Split Screen, Theme, and Modes
  const [splitScreen, setSplitScreen] = useState<{ active: boolean, topApp: AppScreen, bottomApp: AppScreen | null }>({ active: false, topApp: AppScreen.HOME, bottomApp: null });
  const [theme, setTheme] = useState<ThemeType>('DEFAULT');
  const [activeMode, setActiveMode] = useState<ModeType>('NONE');

  const [logs, setLogs] = useState<LogMessage[]>([]);
  const [simState, setSimState] = useState<SimulationState>({
    battery: 100,
    time: "8:30 AM",
    energyScore: 85
  });
  const [inputValue, setInputValue] = useState("");
  const [isQuickPanelOpen, setQuickPanelOpen] = useState(false);
  const [showCircleToSearch, setShowCircleToSearch] = useState(false);
  const [lockClockStyle, setLockClockStyle] = useState<'DIGITAL' | 'ANALOG'>('DIGITAL');
  const logEndRef = useRef<HTMLDivElement>(null);

  // Dynamic Island State
  const [islandState, setIslandState] = useState<'IDLE' | 'MUSIC' | 'TIMER'>('IDLE');

  // Monitor App Screen to update Island
  useEffect(() => {
    if (screen === AppScreen.MUSIC) {
        setIslandState('MUSIC');
    } else if (screen === AppScreen.CLOCK) {
        setIslandState('TIMER');
    } else {
        // Keep activity in island if we leave the app, unless explicitly cleared
        // For simulation, lets keep music active
        if (islandState === 'TIMER' && screen !== AppScreen.CLOCK) setIslandState('IDLE');
    }
  }, [screen]);

  // Auto-scroll logs
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Boot Sequence
  useEffect(() => {
    if (screen === AppScreen.BOOT) {
      addLog("system", "📱 **Try Galaxy AI Simulator – Powered by One UI 7!** ✨");
      addLog("system", "🌌 *Booting up your virtual Galaxy S25 Ultra... Fluid animation loading...* 🌟");
      
      setTimeout(() => {
        setScreen(AppScreen.LOCK);
        addLog("system", "**Current Screen: Lock Screen → Home Screen Unlocked!**\n- Wallpaper: Dynamic starry galaxy transitioning to morning glow 🌅\n- Status Bar: 🔋 100% | 📶 5G Ultra | 🕐 8:30 AM | 🌤️ 25°C Sunny | 💓 Energy Score: 85/100");
      }, 2500);
    }
  }, [screen]);

  // Track navigation history roughly
  useEffect(() => {
    if (screen !== AppScreen.BOOT && screen !== AppScreen.LOCK && screen !== AppScreen.RECENTS && screen !== AppScreen.KIDS_MODE) {
        setLastScreen(screen);
    }
  }, [screen]);

  const addLog = (sender: 'system' | 'user' | 'ai', text: string) => {
    setLogs(prev => [...prev, { id: Date.now().toString() + Math.random(), sender, text }]);
  };

  const handleCommand = async () => {
    if (!inputValue.trim()) return;
    const cmd = inputValue;
    setInputValue("");
    addLog("user", cmd);

    // Simple Command Parser
    const lowerCmd = cmd.toLowerCase();
    if (lowerCmd.includes("camera")) { setScreen(AppScreen.CAMERA); addLog("ai", "Opening Camera... 📸"); }
    else if (lowerCmd.includes("notes")) { setScreen(AppScreen.NOTES); addLog("ai", "Opening Samsung Notes... 📝"); }
    else if (lowerCmd.includes("home")) { setScreen(AppScreen.HOME); addLog("ai", "Going Home... 🏠"); }
    else if (lowerCmd.includes("kids")) { setScreen(AppScreen.KIDS_MODE); addLog("system", "Entering Kids Mode..."); }
    else {
        addLog("ai", "*Processing request with Galaxy AI...* ✨");
        const reply = await generateGalaxyResponse(cmd);
        addLog("ai", reply);
    }
  };

  // --- Dynamic Wallpaper & Effects ---
  const getWallpaper = () => {
    if (screen === AppScreen.BOOT) return "bg-black";
    if (activeMode === 'SLEEP') return "bg-zinc-900 grayscale"; // Sleep Mode Effect
    
    switch(theme) {
        case 'NEON': return "bg-gradient-to-br from-black via-gray-900 to-green-900";
        case 'PASTEL': return "bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200";
        case 'DARK_MATTER': return "bg-black";
        default: return "bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-blue-900 via-purple-900 to-orange-800";
    }
  };

  const initiateSplitScreen = (app: AppScreen) => {
      setSplitScreen({ active: true, topApp: app, bottomApp: null });
      setScreen(AppScreen.HOME); // Go to home to pick second app
      addLog("system", "Select a second app for Split Screen");
  };

  const selectApp = (app: AppScreen) => {
      if (splitScreen.active && !splitScreen.bottomApp) {
          setSplitScreen(prev => ({ ...prev, bottomApp: app }));
          setScreen(app); // Just to trigger render update effectively, though screen var is less relevant in split mode
      } else {
          setScreen(app);
      }
  };

  const renderSingleApp = (app: AppScreen, isSplit: boolean = false) => {
    const commonProps = { onClose: () => { if(isSplit) { setSplitScreen({active:false, topApp:AppScreen.HOME, bottomApp:null}); setScreen(AppScreen.HOME); } else { setScreen(AppScreen.HOME); } } };
    
    switch(app) {
      case AppScreen.NOTES: return <NotesApp {...commonProps} />;
      case AppScreen.DRAWING: return <DrawingApp {...commonProps} />;
      case AppScreen.CALL: return <CallApp {...commonProps} />;
      case AppScreen.AUDIO_ERASER: return <AudioEraserApp {...commonProps} />;
      case AppScreen.GALLERY: return <GalleryApp {...commonProps} />;
      case AppScreen.CAMERA: return <CameraApp {...commonProps} />;
      case AppScreen.BROWSER: return <BrowserApp {...commonProps} />;
      case AppScreen.MESSAGES: return <MessagesApp {...commonProps} />;
      case AppScreen.SETTINGS: return <SettingsApp {...commonProps} />;
      case AppScreen.CALCULATOR: return <CalculatorApp {...commonProps} />;
      case AppScreen.CLOCK: return <ClockApp {...commonProps} />;
      case AppScreen.MUSIC: return <MusicPlayerApp {...commonProps} />;
      case AppScreen.MY_FILES: return <MyFilesApp {...commonProps} />;
      case AppScreen.DEVICE_CARE: return <DeviceCareApp {...commonProps} />;
      case AppScreen.AR_ZONE: return <ARZoneApp {...commonProps} />;
      case AppScreen.KIDS_MODE: return <KidsModeApp {...commonProps} />;
      case AppScreen.THEME_STORE: return <ThemeStoreApp {...commonProps} setTheme={setTheme} />;
      case AppScreen.MODES_ROUTINES: return <ModesRoutinesApp {...commonProps} activeMode={activeMode} setMode={setActiveMode} />;
      case AppScreen.QUICK_SHARE: return <QuickShareView {...commonProps} />;
      case AppScreen.APP_LIBRARY: return <AppLibraryScreen {...commonProps} />;
      default: return <div className="flex items-center justify-center h-full text-white font-bold">App Content</div>;
    }
  };

  const renderContent = () => {
      if (splitScreen.active && splitScreen.bottomApp) {
          return (
              <div className="flex flex-col h-full">
                  <div className="h-1/2 overflow-hidden border-b-4 border-black relative">
                      {renderSingleApp(splitScreen.topApp, true)}
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-black/50 px-2 rounded-full text-[10px] text-white z-50">Top</div>
                  </div>
                  <div className="h-1/2 overflow-hidden relative">
                      {renderSingleApp(splitScreen.bottomApp, true)}
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-black/50 px-2 rounded-full text-[10px] text-white z-50">Bottom</div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-1 bg-gray-500 rounded-full z-[60]"></div>
              </div>
          );
      }

      // If in Split Screen selection mode (Top selected, picking Bottom)
      if (splitScreen.active && !splitScreen.bottomApp) {
          if (screen === AppScreen.HOME) {
              return (
                  <div className="h-full relative">
                       {renderScreen()}
                       <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg z-50 animate-bounce">
                           Select second app
                       </div>
                  </div>
              )
          }
      }

      return renderScreen();
  }

  const renderScreen = () => {
    switch(screen) {
      case AppScreen.BOOT:
        return (
          <div className="h-full flex flex-col items-center justify-center animate-pulse">
            <h1 className="text-4xl font-bold tracking-widest text-white">SAMSUNG</h1>
            <p className="text-blue-400 mt-2 tracking-widest text-xs">Galaxy AI</p>
          </div>
        );
      case AppScreen.LOCK:
        return (
            <div 
                className="h-full flex flex-col items-center pt-32 text-white animate-fade-in relative cursor-pointer" 
                onClick={() => {
                   addLog("system", "Unlocked via Tap/Face ID 🔓");
                   setScreen(AppScreen.HOME);
                }}
            >
                {/* Top Status */}
                <div className="absolute top-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-70">
                    <ScanFace className="w-5 h-5 text-white" />
                </div>

                {lockClockStyle === 'DIGITAL' ? (
                    <div 
                        onClick={(e) => { e.stopPropagation(); setLockClockStyle('ANALOG'); }}
                        className="text-8xl font-light tracking-tighter hover:scale-105 transition-transform"
                    >
                        {simState.time.split(' ')[0]}
                    </div>
                ) : (
                    <div 
                        onClick={(e) => { e.stopPropagation(); setLockClockStyle('DIGITAL'); }}
                        className="w-40 h-40 rounded-full border-4 border-white/80 flex items-center justify-center relative mb-8 hover:scale-105 transition-transform"
                    >
                        <div className="w-1 h-16 bg-white absolute top-4"></div>
                        <div className="w-1 h-10 bg-white/70 absolute top-1/2 left-1/2 origin-bottom -translate-x-1/2 -translate-y-full rotate-45"></div>
                    </div>
                )}
                
                <div className="text-xl font-medium mt-2">Tue, January 24</div>
                
                {/* Lock Screen Widgets */}
                <div className="flex gap-4 mt-8 bg-black/20 p-4 rounded-3xl backdrop-blur-sm">
                    <div className="text-center">
                        <Battery className="w-6 h-6 mx-auto mb-1 text-green-400" />
                        <span className="text-xs">100%</span>
                    </div>
                     <div className="text-center">
                        <span className="text-lg">🌤️</span>
                        <span className="block text-xs">25°C</span>
                    </div>
                </div>

                {/* Fingerprint / Tap Unlock Area */}
                <div className="mt-auto mb-16 flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full border border-white/30 flex items-center justify-center bg-black/20 backdrop-blur-md animate-pulse">
                        <Fingerprint className="w-8 h-8 text-white/90" />
                    </div>
                    <div className="text-sm font-medium tracking-wide opacity-80">Tap anywhere to unlock</div>
                </div>
            </div>
        );
      case AppScreen.HOME:
        return (
          <div className="h-full flex flex-col px-4 sm:px-6 pt-16 pb-32 overflow-y-auto no-scrollbar animate-fade-in relative">
             <NowBriefWidget />
             
             {/* Edge Panel Overlay */}
             <EdgePanel />

             {/* App Grid */}
             <div className="grid grid-cols-4 gap-y-6 sm:gap-y-8 gap-x-2 sm:gap-x-4 mt-4">
                <AppIcon icon={PhoneIcon} label="Phone" color="bg-green-500" onClick={() => { selectApp(AppScreen.CALL); addLog("system", "Opening Phone app..."); }} />
                <AppIcon icon={MessageSquare} label="Messages" color="bg-blue-500" onClick={() => { selectApp(AppScreen.MESSAGES); addLog("ai", "Opening Messages..."); }} />
                <AppIcon icon={Globe} label="Internet" color="bg-purple-500" onClick={() => { selectApp(AppScreen.BROWSER); addLog("ai", "Browser opening..."); }} />
                <AppIcon icon={StickyNote} label="Notes" color="bg-orange-400" onClick={() => { selectApp(AppScreen.NOTES); addLog("system", "Opening Notes..."); }} />
                <AppIcon icon={Camera} label="Camera" color="bg-red-500" onClick={() => { selectApp(AppScreen.CAMERA); addLog("ai", "Opening Camera Simulator... 📸"); }} />
                <AppIcon icon={Image} label="Gallery" color="bg-pink-500" onClick={() => { selectApp(AppScreen.GALLERY); addLog("system", "Opening Gallery..."); }} />
                <AppIcon icon={Calculator} label="Calc" color="bg-green-400" onClick={() => { selectApp(AppScreen.CALCULATOR); addLog("system", "Opening Calculator..."); }} />
                <AppIcon icon={Settings} label="Settings" color="bg-gray-500" onClick={() => { selectApp(AppScreen.SETTINGS); addLog("system", "Opening Settings..."); }} />
                <AppIcon icon={Clock} label="Clock" color="bg-blue-400" onClick={() => { selectApp(AppScreen.CLOCK); addLog("system", "Opening Clock..."); }} />
                <AppIcon icon={Music} label="Music" color="bg-indigo-500" onClick={() => { selectApp(AppScreen.MUSIC); addLog("system", "Opening Music..."); }} />
                <AppIcon icon={Folder} label="Files" color="bg-yellow-500" onClick={() => { selectApp(AppScreen.MY_FILES); addLog("system", "Opening My Files..."); }} />
                <AppIcon icon={Palette} label="Themes" color="bg-purple-600" onClick={() => { selectApp(AppScreen.THEME_STORE); addLog("system", "Opening Theme Store..."); }} />
                <AppIcon icon={ShieldCheck} label="Care" color="bg-teal-600" onClick={() => { selectApp(AppScreen.DEVICE_CARE); addLog("system", "Opening Device Care..."); }} />
                <AppIcon icon={Share} label="Quick Share" color="bg-blue-600" onClick={() => { selectApp(AppScreen.QUICK_SHARE); addLog("system", "Searching for devices..."); }} />
                <AppIcon icon={Zap} label="Modes" color="bg-blue-600" onClick={() => { selectApp(AppScreen.MODES_ROUTINES); addLog("system", "Opening Modes & Routines..."); }} />
                <AppIcon icon={Baby} label="Kids" color="bg-yellow-400" onClick={() => { setScreen(AppScreen.KIDS_MODE); addLog("system", "Entering Kids Mode..."); }} />
                <AppIcon icon={BrainCircuit} label="Eraser" color="bg-indigo-600" onClick={() => { selectApp(AppScreen.AUDIO_ERASER); addLog("system", "Opening Audio Eraser..."); }} />
                <AppIcon icon={PenTool} label="Sketch" color="bg-teal-500" onClick={() => { selectApp(AppScreen.DRAWING); addLog("system", "Opening Sketch to Image..."); }} />
                <AppIcon icon={Search} label="Search" color="bg-gray-600" onClick={() => setShowCircleToSearch(true)} />
                <AppIcon icon={Mic} label="Gemini" color="bg-blue-600" onClick={() => addLog("ai", "Gemini Live: I'm listening. How can I help you today?")} />
             </div>

             {/* App Library Button */}
             <div className="flex justify-center mt-6">
                <div onClick={() => selectApp(AppScreen.APP_LIBRARY)} className="flex items-center gap-2 bg-gray-800/60 backdrop-blur-md px-4 py-2 rounded-full cursor-pointer hover:bg-gray-700/60 transition-colors border border-white/10">
                    <Library className="w-4 h-4 text-white" />
                    <span className="text-xs font-bold text-white">App Library</span>
                </div>
             </div>

             <NowBar />
          </div>
        );
      case AppScreen.RECENTS:
        return <RecentsScreen onSelect={setScreen} onCloseApp={() => setScreen(AppScreen.HOME)} onSplitScreen={initiateSplitScreen} />;
      default:
        return renderSingleApp(screen);
    }
  };

  return (
    <div className={`w-screen h-screen bg-[#111] flex items-center justify-center p-2 sm:p-4 lg:p-8 font-sans text-slate-900 ${activeMode === 'SLEEP' ? 'grayscale' : ''}`}>
      
      {/* Phone Frame - STRICT Mobile Ratio (9:19.5) and responsive scaling */}
      <div className={`relative h-full max-h-[900px] w-auto aspect-[9/19.5] max-w-full shadow-2xl border-[8px] border-neutral-900 rounded-[2.5rem] overflow-hidden transition-all duration-1000 ${getWallpaper()}`}>
        
        {/* Dynamic Island / Camera Cutout */}
        <div 
          className={`absolute top-4 left-1/2 -translate-x-1/2 bg-black rounded-3xl z-[60] flex items-center justify-center space-x-2 transition-all duration-500 ease-spring ${
             islandState === 'MUSIC' ? 'w-56 h-20' : 
             islandState === 'TIMER' ? 'w-48 h-12' : 
             'w-32 h-8'
          }`}
        >
            {/* Camera */}
            <div className={`w-2 h-2 rounded-full bg-neutral-800 absolute top-3 ${islandState !== 'IDLE' ? 'opacity-0' : 'opacity-100'}`}></div>
            
            {/* Dynamic Content */}
            {islandState === 'MUSIC' && (
                <div className="w-full h-full flex items-center justify-between px-4 text-white animate-fade-in">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <Music className="w-5 h-5" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center px-2">
                         <span className="text-[10px] font-bold leading-tight">Over The Horizon</span>
                         <span className="text-[8px] opacity-70">Samsung Orchestra</span>
                    </div>
                    <div className="flex gap-1 items-end h-4">
                         <div className="w-1 bg-green-400 rounded-full animate-music-bar h-full"></div>
                         <div className="w-1 bg-green-400 rounded-full animate-music-bar h-2/3" style={{animationDelay:'0.1s'}}></div>
                         <div className="w-1 bg-green-400 rounded-full animate-music-bar h-full" style={{animationDelay:'0.2s'}}></div>
                    </div>
                </div>
            )}

            {islandState === 'TIMER' && (
                <div className="w-full h-full flex items-center justify-between px-4 text-white animate-fade-in">
                    <Clock className="w-4 h-4 text-orange-400" />
                    <span className="text-sm font-mono font-bold text-orange-400">00:14:59</span>
                </div>
            )}
        </div>

        {/* Status Bar */}
        {screen !== AppScreen.BOOT && screen !== AppScreen.KIDS_MODE && <StatusBar {...simState} onOpenQuickPanel={() => setQuickPanelOpen(true)} />}

        {/* Quick Panel Overlay */}
        <QuickPanel isOpen={isQuickPanelOpen} onClose={() => setQuickPanelOpen(false)} />

        {/* Screen Content */}
        <div className="h-full w-full pt-2 relative">
            {renderContent()}
            {/* Circle To Search Overlay */}
            {showCircleToSearch && <CircleToSearchOverlay onClose={() => setShowCircleToSearch(false)} />}
        </div>

        {/* Navigation Bar (Persistent) */}
        {screen !== AppScreen.BOOT && screen !== AppScreen.LOCK && screen !== AppScreen.KIDS_MODE && (
           <NavigationBar 
             onHome={() => { setSplitScreen({active: false, topApp: AppScreen.HOME, bottomApp: null}); setScreen(AppScreen.HOME); addLog("system", "Home Button Pressed"); }} 
             onBack={() => { 
                if (showCircleToSearch) { setShowCircleToSearch(false); return; }
                if (splitScreen.active) { setSplitScreen({active: false, topApp: AppScreen.HOME, bottomApp: null}); setScreen(AppScreen.HOME); return; }
                if (screen === AppScreen.HOME) return;
                setScreen(AppScreen.HOME); 
                addLog("system", "Back Button Pressed"); 
             }}
             onRecents={() => { setScreen(AppScreen.RECENTS); addLog("system", "Recent Apps Opened"); }}
           />
        )}
      </div>

      {/* Simulator Control Panel (Side Overlay) */}
      <div className="hidden lg:flex flex-col w-96 h-[780px] ml-10 bg-gray-900/90 backdrop-blur-md rounded-3xl border border-white/10 p-6 shadow-2xl">
         <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <h2 className="text-white font-bold">Galaxy AI Simulator Log</h2>
         </div>
         
         {/* Logs Area */}
         <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 mb-4">
            {logs.map((log) => (
               <div key={log.id} className={`flex ${log.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[90%] p-3 rounded-2xl text-sm leading-relaxed ${
                      log.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 
                      log.sender === 'system' ? 'bg-gray-800/50 text-gray-400 border border-white/5 font-mono text-xs' :
                      'bg-gradient-to-br from-purple-900/50 to-indigo-900/50 text-indigo-100 border border-indigo-500/30'
                  }`}>
                    {log.sender === 'ai' && <div className="flex items-center gap-1 text-xs text-indigo-300 mb-1 font-bold"><Sparkles className="w-3 h-3"/> Galaxy AI</div>}
                    <div className="whitespace-pre-wrap">{log.text}</div>
                  </div>
               </div>
            ))}
            <div ref={logEndRef}></div>
         </div>

         {/* Input Area */}
         <div className="relative">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCommand()}
              placeholder="Ask Galaxy AI... (e.g., 'Open Camera')"
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button 
              onClick={handleCommand}
              className="absolute right-2 top-2 p-1 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors"
            >
               <Send className="w-4 h-4 text-white" />
            </button>
         </div>
      </div>
    </div>
  );
}