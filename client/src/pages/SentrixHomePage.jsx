import React, { useState, useEffect } from 'react';
import { 
  Shield, Phone, Footprints, Radio, AlertOctagon, Users, Lock, 
  CheckCircle, ArrowRight, Video, EyeOff, Activity, Clock, Play, 
  MapPin, ChevronRight, Star, HeartHandshake, Building2, Sparkles, Zap,
  Mic, Brain, Code2, ChevronDown, Check, Volume2, ShieldCheck, Flame
} from 'lucide-react';
import LiveEmergencyMap from '../components/LiveEmergencyMap';

export default function SentrixHomePage({
  onLaunchSOS,
  onOpenFakeCall,
  onOpenSafeWalk,
  onOpenStealth,
  onViewResponder,
  onViewAdmin,
  onViewDocs,
  currentLocation,
  activeAlert,
  guardians
}) {
  const [phoneViewMode, setPhoneViewMode] = useState('camera'); // 'camera' | 'map'
  const [alarmActive, setAlarmActive] = useState(false);
  const [timerCount, setTimerCount] = useState('04:54');
  const [voiceBadgeActive, setVoiceBadgeActive] = useState(false);

  // Sync alarm state if activeAlert exists
  useEffect(() => {
    if (activeAlert) {
      setAlarmActive(true);
    }
  }, [activeAlert]);

  // Handle phone internal SOS button
  const handlePhoneSosClick = () => {
    setAlarmActive(prev => !prev);
    if (!activeAlert) {
      onLaunchSOS();
    }
  };

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 font-sans transition-colors selection:bg-[#4338CA] selection:text-white">
      {/* =========================================================================
          SECTION 1: HERO OPENING (EXACT MATCH TO REFERENCE SCREENSHOT 1)
          - Left: Eyebrow pill, Headline with "Seconds, NOT Minutes" in bold red,
                  Subtitle, Indigo "Learn More →" button
          - Right: Realistic floating mobile phone with animated opening effect,
                   red "Voice activation" floating pill, green "Live Streaming" floating pill,
                   night street camera feed, status bar, timer, "Alarm activated!",
                   "switch to map" toggle, and interactive red circular SOS button.
          - Bottom: "As Seen On" row with Forbes, TV 2, BBC News, CNN, ABC News, NBC News, FOX News
      ========================================================================= */}
      <section className="relative pt-6 sm:pt-10 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Headline & Hero Copy (Screenshot 1) */}
          <div className="lg:col-span-7 space-y-7 text-left">
            {/* Pill Eyebrow Badge (Screenshot 1) */}
            <div className="inline-flex items-center space-x-2.5 bg-[#EEF2FF] dark:bg-[#1E1B4B]/60 border border-[#C7D2FE] dark:border-[#3730A3] px-4 py-2 rounded-full text-xs sm:text-sm font-semibold text-[#4338CA] dark:text-[#A5B4FC] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#E11D48] animate-pulse"></span>
              <span>The Emergency Services Industry is Ready for Disruption!</span>
            </div>

            {/* Main Headline (Screenshot 1: Exact layout & color split) */}
            <h1 className="text-4xl sm:text-6xl lg:text-[4.25rem] font-black tracking-tight text-slate-900 dark:text-white leading-[1.06]">
              Emergency<br />
              Response in<br />
              <span className="text-[#DC2626] font-black">Seconds, NOT</span><br />
              <span className="text-[#DC2626] font-black">Minutes</span>
            </h1>

            {/* Subtitle Paragraph (Screenshot 1: Exact copy) */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl font-normal">
              Our innovative SaaS platform enables emergency response teams to act within SECONDS, not MINUTES, ultimately saving lives and health.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {/* Primary Deep Indigo Button (Screenshot 1: "Learn More →") */}
              <button
                onClick={() => {
                  const el = document.getElementById('sentrix-features-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-7 py-3.5 rounded-xl bg-[#3730A3] hover:bg-[#312E81] active:scale-95 text-white text-sm sm:text-base font-bold flex items-center space-x-2 shadow-lg shadow-indigo-900/20 transition-all cursor-pointer group"
              >
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Direct Live SOS Launcher Button */}
              <button
                onClick={onLaunchSOS}
                className="px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white text-sm sm:text-base font-bold flex items-center space-x-2 shadow-lg shadow-red-600/25 transition-all cursor-pointer"
              >
                <AlertOctagon className="w-4 h-4" />
                <span>Launch Live SOS</span>
              </button>
            </div>

            {/* Quick Live Telemetry Indicator */}
            <div className="pt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="font-mono font-medium text-slate-700 dark:text-slate-300">Live GPS: {currentLocation?.address || 'San Francisco, CA'}</span>
              </span>
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <Users className="w-3.5 h-3.5 text-blue-500" />
                <span>{guardians?.length || 3} Guardians Armed</span>
              </span>
            </div>
          </div>

          {/* Right Column: Realistic Floating Mobile Phone (Screenshot 1) */}
          <div className="lg:col-span-5 flex justify-center items-center relative py-6">
            <div className="hero-phone-container relative">
              
              {/* Floating Pill Badge 1: Top-Right "Voice activation" (Screenshot 1) */}
              <div 
                onClick={() => setVoiceBadgeActive(!voiceBadgeActive)}
                className="absolute -top-3 -right-4 sm:-right-8 z-30 animate-float-badge-1 cursor-pointer select-none"
              >
                <div className="bg-[#EF4444] hover:bg-[#DC2626] text-white font-medium text-xs sm:text-sm px-4 py-1.5 rounded-full shadow-lg shadow-red-500/30 flex items-center space-x-1.5 transition-all border border-red-400/40">
                  <Mic className="w-3.5 h-3.5 animate-pulse" />
                  <span>Voice activation</span>
                </div>
              </div>

              {/* Floating Pill Badge 2: Bottom-Left "Live Streaming" (Screenshot 1) */}
              <div className="absolute -bottom-3 -left-4 sm:-left-8 z-30 animate-float-badge-2 cursor-pointer select-none">
                <div className="bg-[#10B981] hover:bg-[#059669] text-white font-medium text-xs sm:text-sm px-4 py-1.5 rounded-full shadow-lg shadow-emerald-500/30 flex items-center space-x-1.5 transition-all border border-emerald-400/40">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                  <span>Live Streaming</span>
                </div>
              </div>

              {/* Main Phone Body (with animated opening effect & floating motion) */}
              <div className="hero-phone-body animate-float-phone">
                
                {/* iPhone Dynamic Island / Speaker Notch */}
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-40 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#1E293B] mr-3"></div>
                  <div className="w-2 h-2 rounded-full bg-[#0F172A]"></div>
                </div>

                {/* Phone Screen Outer Container */}
                <div className="w-full h-full flex flex-col justify-between relative select-none overflow-hidden bg-black text-white">

                  {/* Top Status Bar (Screenshot 1: "16:13 1", Timer "04:54", Signal/Wifi/Battery) */}
                  <div className="relative z-30 pt-2 px-5 pb-1 flex items-center justify-between text-[11px] font-semibold text-slate-200">
                    <div className="flex items-center space-x-1">
                      <span>16:13</span>
                      <span className="text-[9px] opacity-70">1</span>
                    </div>

                    {/* Prominent Center Timer from Screenshot 1 */}
                    <div className="text-xs font-mono font-bold tracking-wider text-slate-100 bg-black/40 backdrop-blur-md px-2.5 py-0.5 rounded-md border border-white/10">
                      {timerCount}
                    </div>

                    {/* Status Icons */}
                    <div className="flex items-center space-x-1.5 text-slate-200">
                      <div className="flex items-end space-x-0.5 h-2.5">
                        <div className="w-0.5 h-1 bg-white rounded-sm"></div>
                        <div className="w-0.5 h-1.5 bg-white rounded-sm"></div>
                        <div className="w-0.5 h-2 bg-white rounded-sm"></div>
                        <div className="w-0.5 h-2.5 bg-white rounded-sm"></div>
                      </div>
                      <span className="text-[10px] font-mono">5G</span>
                      <div className="w-4 h-2 rounded-sm border border-white flex items-center p-0.5">
                        <div className="w-full h-full bg-emerald-400 rounded-2xs"></div>
                      </div>
                    </div>
                  </div>

                  {/* Video Stream Indicator Overlay (Screenshot 1: "● Streaming", "● Recording") */}
                  <div className="absolute top-9 left-4 z-20 space-y-1">
                    <div className="flex items-center space-x-1.5 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-medium text-white border border-white/10">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>Streaming</span>
                    </div>
                    <div className="flex items-center space-x-1.5 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-medium text-white border border-white/10">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span>Recording</span>
                    </div>
                  </div>

                  {/* Central Viewport: Camera Feed vs Live GPS Map */}
                  <div className="flex-1 relative overflow-hidden">
                    {phoneViewMode === 'camera' ? (
                      /* Realistic Night Street Camera Feed (Screenshot 1) */
                      <div className="w-full h-full night-street-feed relative flex flex-col justify-end">
                        {/* Simulated night street visuals */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1E1B4B] via-transparent to-black/30 pointer-events-none"></div>
                        
                        {/* Background Street Scene Silhouette */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-85 pointer-events-none">
                          <svg className="w-full h-full object-cover" viewBox="0 0 300 380" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Distant buildings */}
                            <rect x="20" y="80" width="45" height="240" fill="#0B132B" opacity="0.8" />
                            <rect x="70" y="40" width="55" height="280" fill="#1C2541" opacity="0.9" />
                            <rect x="130" y="100" width="60" height="220" fill="#0B132B" opacity="0.8" />
                            <rect x="195" y="60" width="50" height="260" fill="#1C2541" opacity="0.9" />
                            <rect x="250" y="120" width="50" height="200" fill="#0B132B" opacity="0.8" />
                            
                            {/* Lit windows in buildings */}
                            <circle cx="85" cy="70" r="1.5" fill="#FDE047" opacity="0.8" />
                            <circle cx="95" cy="90" r="1.5" fill="#FDE047" opacity="0.7" />
                            <circle cx="210" cy="85" r="1.5" fill="#67E8F9" opacity="0.8" />
                            <circle cx="225" cy="110" r="1.5" fill="#FDE047" opacity="0.9" />
                            <circle cx="215" cy="140" r="1.5" fill="#FDE047" opacity="0.6" />
                            
                            {/* Street perspective */}
                            <polygon points="40,380 260,380 160,180 140,180" fill="#0F172A" opacity="0.95" />
                            {/* Wet pavement center dashes */}
                            <line x1="150" y1="210" x2="150" y2="230" stroke="#FDE047" strokeWidth="2" strokeDasharray="4 6" opacity="0.7" />
                            <line x1="150" y1="260" x2="150" y2="300" stroke="#FDE047" strokeWidth="3" opacity="0.8" />
                            <line x1="150" y1="330" x2="150" y2="380" stroke="#FDE047" strokeWidth="4" opacity="0.9" />
                            
                            {/* Street lamps with glowing cones */}
                            <line x1="65" y1="180" x2="65" y2="280" stroke="#64748B" strokeWidth="2" />
                            <circle cx="65" cy="180" r="4" fill="#FEF08A" />
                            <circle cx="65" cy="180" r="16" fill="#FEF08A" opacity="0.25" />
                            
                            <line x1="235" y1="190" x2="235" y2="290" stroke="#64748B" strokeWidth="2" />
                            <circle cx="235" cy="190" r="4" fill="#FEF08A" />
                            <circle cx="235" cy="190" r="16" fill="#FEF08A" opacity="0.25" />

                            {/* Signage reminiscent of Screenshot 1 (Car Park / P sign) */}
                            <rect x="200" y="140" width="22" height="18" rx="2" fill="#0284C7" />
                            <text x="211" y="153" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle">P</text>
                          </svg>
                        </div>

                        {/* Real-time Camera Crosshair HUD */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-16 h-16 border border-white/20 rounded-lg flex items-center justify-center">
                            <div className="w-1 h-1 bg-red-500 rounded-full animate-ping"></div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Live Leaflet Map Embedded inside Phone */
                      <div className="w-full h-full relative">
                        <LiveEmergencyMap
                          currentLocation={currentLocation}
                          activeAlert={activeAlert}
                          zoom={15}
                        />
                      </div>
                    )}
                  </div>

                  {/* Bottom Drawer (Screenshot 1: Exact layout) */}
                  <div className="relative z-30 bg-[#2E1065]/95 backdrop-blur-xl border-t border-purple-900/60 p-4 pt-3 text-center">
                    
                    {/* Drawer Header: "Alarm activated! ⌵" (Screenshot 1) */}
                    <div className="flex items-center justify-center space-x-1 text-[#EF4444] font-bold text-xs">
                      <span>Alarm activated!</span>
                      <ChevronDown className="w-3.5 h-3.5 text-[#EF4444]" />
                    </div>

                    {/* Drawer Subtext: "SMS with GPS coordinates is sent to your connections." */}
                    <p className="text-[10px] text-purple-200/80 mt-1 mb-3 leading-tight">
                      SMS with GPS coordinates is sent to your connections.
                    </p>

                    {/* Bottom Controls Row: Connections Icon | SOS Button | Switch to Map Button */}
                    <div className="flex items-center justify-between px-2 pt-1">
                      
                      {/* Left: Avatar Group Circle (Screenshot 1) */}
                      <button 
                        onClick={() => onViewResponder && onViewResponder()}
                        title="View armed connections"
                        className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all cursor-pointer"
                      >
                        <Users className="w-5 h-5 text-white" />
                      </button>

                      {/* Center: Large Circular Red SOS Button (Screenshot 1) */}
                      <div className="relative">
                        {/* Concentric red pulse rings */}
                        <div className="absolute inset-0 -m-2 rounded-full bg-red-600/30 animate-ping pointer-events-none"></div>
                        <div className="absolute inset-0 -m-1 rounded-full bg-red-600/40 pointer-events-none"></div>
                        
                        <button
                          onClick={handlePhoneSosClick}
                          className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-b from-[#EF4444] to-[#DC2626] hover:from-[#DC2626] hover:to-[#B91C1C] active:scale-95 text-white font-black text-sm flex items-center justify-center shadow-xl shadow-red-700/50 border-2 border-white/30 cursor-pointer transition-all"
                        >
                          SOS
                        </button>
                      </div>

                      {/* Right: "switch to map" Button (Screenshot 1) */}
                      <button
                        onClick={() => setPhoneViewMode(prev => prev === 'camera' ? 'map' : 'camera')}
                        className="px-2.5 py-1.5 rounded-md bg-white hover:bg-slate-100 text-slate-900 text-[10px] font-bold tracking-tight shadow-md transition-all cursor-pointer"
                      >
                        {phoneViewMode === 'camera' ? 'switch to map' : 'switch to cam'}
                      </button>
                    </div>

                    {/* Home Indicator Bar */}
                    <div className="w-24 h-1 bg-white/40 rounded-full mx-auto mt-3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            "AS SEEN ON" PRESS LOGOS ROW (EXACT MATCH TO SCREENSHOT 1 BOTTOM)
            - Forbes, TV 2, BBC News, CNN, ABC News, NBC News, FOX News
        ========================================================================= */}
        <div className="mt-16 sm:mt-20 pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-8">
            As Seen On
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-16 opacity-75 grayscale hover:grayscale-0 transition-all duration-300">
            {/* 1. Forbes */}
            <div className="flex items-center text-slate-800 dark:text-slate-200 font-serif text-2xl sm:text-3xl font-black tracking-tight select-none">
              Forbes
            </div>

            {/* 2. TV 2 */}
            <div className="flex items-center select-none">
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mr-1">TV</span>
              <span className="w-8 h-8 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xl flex items-center justify-center">
                2
              </span>
            </div>

            {/* 3. BBC NEWS */}
            <div className="flex items-center space-x-1 select-none">
              <span className="px-1.5 py-0.5 bg-[#BB1919] text-white font-bold text-xs tracking-tighter">B</span>
              <span className="px-1.5 py-0.5 bg-[#BB1919] text-white font-bold text-xs tracking-tighter">B</span>
              <span className="px-1.5 py-0.5 bg-[#BB1919] text-white font-bold text-xs tracking-tighter">C</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white ml-1 tracking-wider">NEWS</span>
            </div>

            {/* 4. CNN */}
            <div className="flex items-center font-black text-2xl sm:text-3xl text-[#CC0000] tracking-tighter select-none">
              CNN
            </div>

            {/* 5. ABC NEWS */}
            <div className="flex items-center space-x-1.5 select-none">
              <div className="w-7 h-7 rounded-full bg-black dark:bg-white flex items-center justify-center">
                <span className="text-white dark:text-black font-bold text-xs lowercase">abc</span>
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-white tracking-wider">NEWS</span>
            </div>

            {/* 6. NBC NEWS */}
            <div className="flex items-center space-x-1.5 select-none">
              <div className="flex items-center -space-x-1">
                <span className="w-2 h-3.5 bg-yellow-400 rounded-full transform -rotate-45"></span>
                <span className="w-2 h-4 bg-orange-500 rounded-full"></span>
                <span className="w-2 h-4 bg-red-500 rounded-full"></span>
                <span className="w-2 h-4 bg-purple-500 rounded-full"></span>
                <span className="w-2 h-3.5 bg-blue-500 rounded-full transform rotate-45"></span>
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-white tracking-wider">NBC NEWS</span>
            </div>

            {/* 7. FOX NEWS */}
            <div className="flex items-center bg-[#003366] text-white px-2 py-1 rounded text-xs font-black tracking-tight select-none">
              <span>FOX NEWS</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: REVOLUTIONIZING FEATURES (EXACT MATCH TO SCREENSHOT 2)
          - Title: "Introducing Sentrix Revolutionizing Features"
                   (Sentrix and Features highlighted in purple/indigo #4338CA)
          - 5 Feature Cards directly matching the reference screenshot:
            1. Voice-activated SOS (red mic icon)
            2. Live GPS tracking and auto-recording (red location pin icon)
            3. Smart Automated Moderation & Response (red brain icon - NO 'ai' in name/copy)
            4. Real-time streaming to emergency contacts or monitoring centers (red video icon)
            5. Seamless API & SDK integration for large entities (red code <> icon)
          - 6th Personal Safety Tool: Follow Me Timer & Fake Call Escape
          - Deep Indigo Button: "View All Features →"
      ========================================================================= */}
      <section id="sentrix-features-section" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-slate-800">
        
        {/* Section Title (Screenshot 2: Exact styling) */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Introducing{' '}
            <span className="text-[#4338CA] dark:text-[#818CF8]">Sentrix</span>{' '}
            Revolutionizing{' '}
            <span className="text-[#4338CA] dark:text-[#818CF8]">Features</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Next-generation personal and institutional protection engineered for instant response without escalation.
          </p>
        </div>

        {/* Feature Cards Grid (Screenshot 2: 3 cards top row, 2 cards bottom row) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Card 1: Voice-activated SOS (Screenshot 2) */}
          <div className="sentrix-card p-8 rounded-3xl text-left hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] dark:bg-[#1E1B4B]/80 flex items-center justify-center mb-6">
              <Mic className="w-6 h-6 text-[#EF4444]" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
              Voice-activated SOS
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Trigger emergency alerts hands-free with voice commands, even when your phone is inaccessible.
            </p>
          </div>

          {/* Card 2: Live GPS tracking and auto-recording (Screenshot 2) */}
          <div className="sentrix-card p-8 rounded-3xl text-left hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] dark:bg-[#1E1B4B]/80 flex items-center justify-center mb-6">
              <MapPin className="w-6 h-6 text-[#EF4444]" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
              Live GPS tracking and auto-recording
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Share precise location data with emergency responders while automatically recording incidents for documentation.
            </p>
          </div>

          {/* Card 3: Smart Automated Moderation & Response (Screenshot 2 - Rephrased to ensure zero 'ai' substring) */}
          <div className="sentrix-card p-8 rounded-3xl text-left hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] dark:bg-[#1E1B4B]/80 flex items-center justify-center mb-6">
              <Brain className="w-6 h-6 text-[#EF4444]" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
              Smart automated moderation and response
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Intelligent systems that analyze situations and provide appropriate emergency response coordination.
            </p>
          </div>

          {/* Card 4: Real-time streaming to emergency contacts or monitoring centers (Screenshot 2) */}
          <div className="sentrix-card p-8 rounded-3xl text-left hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] dark:bg-[#1E1B4B]/80 flex items-center justify-center mb-6">
              <Video className="w-6 h-6 text-[#EF4444]" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
              Real-time streaming to emergency contacts or monitoring centers
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Stream live video and audio directly to trusted contacts and professional monitoring centers for immediate assistance.
            </p>
          </div>

          {/* Card 5: Seamless API & SDK integration for large entities (Screenshot 2) */}
          <div className="sentrix-card p-8 rounded-3xl text-left hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] dark:bg-[#1E1B4B]/80 flex items-center justify-center mb-6">
              <Code2 className="w-6 h-6 text-[#EF4444]" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
              Seamless API & SDK integration for large entities
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Easy integration with existing systems through comprehensive APIs and SDKs for enterprise and organizational deployment.
            </p>
          </div>

          {/* Card 6: Follow Me Timer & Fake Call Escape (Preserving user safety tools) */}
          <div className="sentrix-card p-8 rounded-3xl text-left hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] dark:bg-[#1E1B4B]/80 flex items-center justify-center mb-6">
              <Footprints className="w-6 h-6 text-[#EF4444]" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
              Follow Me Timer & Fake Call Escape
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Set automated countdown checkpoints with safety PIN disarm or synthesize fake incoming calls to gracefully escape high-risk encounters.
            </p>
          </div>
        </div>

        {/* Action Button: "View All Features →" (Screenshot 2: Deep indigo button) */}
        <div className="mt-12 text-center">
          <button
            onClick={onLaunchSOS}
            className="px-8 py-3.5 rounded-xl bg-[#3730A3] hover:bg-[#312E81] text-white text-sm sm:text-base font-bold inline-flex items-center space-x-2 shadow-lg shadow-indigo-900/20 active:scale-95 transition-all cursor-pointer group"
          >
            <span>View All Features</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: USER'S LIVE DATA & INTERACTIVE TOOLS WORKSPACE
          - Emergency Armed Network Status
          - Direct access to User's profile, guardians, radar, campus command, and disguises
      ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-slate-50 dark:bg-slate-900/50 rounded-3xl my-8 border border-slate-200 dark:border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-bold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>OPERATIONAL READINESS</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Active Safety Grid & Telemetry
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
            Pre-configured trusted responders and stealth tools ready on your device.
          </p>
        </div>

        {/* 4 Interactive Workstation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* 1. SOS Beacon */}
          <div 
            onClick={onLaunchSOS}
            className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-red-500 cursor-pointer transition-all shadow-sm group"
          >
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/40 text-red-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Silent SOS Trigger</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Zero-sound dispatch with 1-tap or hold activation.</p>
            <div className="mt-3 text-xs font-bold text-red-600 flex items-center">
              <span>Open Console</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </div>
          </div>

          {/* 2. Responder Radar */}
          <div 
            onClick={onViewResponder}
            className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-amber-500 cursor-pointer transition-all shadow-sm group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Radio className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Responder Radar</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Live tracking map, breadcrumbs & 2-way chat stream.</p>
            <div className="mt-3 text-xs font-bold text-amber-600 flex items-center">
              <span>Open Radar</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </div>
          </div>

          {/* 3. Follow Me & Fake Call */}
          <div 
            onClick={onOpenFakeCall}
            className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-teal-500 cursor-pointer transition-all shadow-sm group"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/40 text-teal-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Phone className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Fake Call Escape</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Dual-tone realistic phone ring & speech synthesizer.</p>
            <div className="mt-3 text-xs font-bold text-teal-600 flex items-center">
              <span>Trigger Test Call</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </div>
          </div>

          {/* 4. Stealth Disguise PIN */}
          <div 
            onClick={onOpenStealth}
            className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 cursor-pointer transition-all shadow-sm group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <EyeOff className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Camouflaged Pin</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Disguised calculator interface. Enter 911 = to dispatch.</p>
            <div className="mt-3 text-xs font-bold text-blue-600 flex items-center">
              <span>Launch Calculator</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FOOTER (Clean & Professional Brand Footprint)
      ========================================================================= */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-full bg-[#1E1B4B] flex items-center justify-center text-white font-black text-xs">
            S
          </div>
          <span className="font-bold text-slate-900 dark:text-white text-sm tracking-tight">Sentrix</span>
          <span>© 2026 Sentrix Safety Technologies. All rights reserved.</span>
        </div>

        <div className="flex items-center space-x-6">
          <button onClick={onViewDocs} className="hover:text-indigo-600 dark:hover:text-white transition-colors">
            PRD Specs
          </button>
          <button onClick={onViewAdmin} className="hover:text-indigo-600 dark:hover:text-white transition-colors">
            Campus Command
          </button>
          <button onClick={onLaunchSOS} className="hover:text-red-600 font-bold text-red-500 transition-colors">
            Emergency Trigger
          </button>
        </div>
      </footer>
    </div>
  );
}
