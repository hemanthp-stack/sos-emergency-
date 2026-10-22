import React, { useState } from 'react';
import { 
  Shield, EyeOff, Radio, Battery, Users, LayoutDashboard, 
  FileText, Smartphone, ChevronDown, BookOpen, Calculator,
  AlertOctagon, Sun, Moon, Laptop, Home, MoreHorizontal, Footprints, Phone,
  Mail, ExternalLink
} from 'lucide-react';

export default function Navbar({
  currentView,
  onViewChange,
  onOpenCalculator,
  onOpenNotes,
  onOpenFakeCall,
  onOpenSafeWalk,
  theme,
  onThemeChange,
  isMockupMode,
  onToggleMockupMode,
  activeAlert,
  guardianCount = 3,
  batteryLevel = 86,
  gpsStatus = 'locked'
}) {
  const [showStealthMenu, setShowStealthMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showAboutMenu, setShowAboutMenu] = useState(false);

  return (
    <>
      {/* 1. TOP HEADER (Directly matching getbsafe.com reference Screenshots 1 & 2) */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 lg:px-8 py-3 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Sentrix Logo (Monogram S badge + Sentrix wordmark) */}
          <div 
            className="flex items-center space-x-2.5 cursor-pointer group select-none" 
            onClick={() => onViewChange('home')}
          >
            <div className="w-8 h-8 rounded-full bg-[#1E1B4B] dark:bg-[#312E81] flex items-center justify-center shadow-md shadow-indigo-950/20 text-white font-black text-sm">
              S
            </div>
            <div className="flex items-center">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white font-sans">
                Sentrix
              </span>
              <span className="ml-2 text-[10px] font-bold bg-[#EEF2FF] dark:bg-[#1E1B4B]/80 text-[#4338CA] dark:text-[#A5B4FC] border border-[#C7D2FE] dark:border-[#3730A3] px-2 py-0.5 rounded-full font-mono uppercase tracking-wider hidden md:inline">
                EMERGENCY OS
              </span>
            </div>
          </div>

          {/* Center Navigation Links (Exact from Screenshot 1 & 2) */}
          <nav className="hidden lg:flex items-center space-x-6 text-[13px] font-semibold text-slate-700 dark:text-slate-200">
            <button
              onClick={() => onViewChange('home')}
              className={`hover:text-[#4338CA] dark:hover:text-[#818CF8] transition-colors cursor-pointer ${
                currentView === 'home' ? 'text-[#4338CA] dark:text-[#818CF8] font-bold' : ''
              }`}
            >
              Product
            </button>

            <button
              onClick={() => onViewChange('docs')}
              className={`hover:text-[#4338CA] dark:hover:text-[#818CF8] transition-colors cursor-pointer ${
                currentView === 'docs' ? 'text-[#4338CA] dark:text-[#818CF8] font-bold' : ''
              }`}
            >
              How It Works
            </button>

            <button
              onClick={() => onViewChange('guardians')}
              className={`hover:text-[#4338CA] dark:hover:text-[#818CF8] transition-colors cursor-pointer ${
                currentView === 'guardians' ? 'text-[#4338CA] dark:text-[#818CF8] font-bold' : ''
              }`}
            >
              Guardians
            </button>

            <button
              onClick={() => onViewChange('admin')}
              className={`hover:text-[#4338CA] dark:hover:text-[#818CF8] transition-colors cursor-pointer ${
                currentView === 'admin' ? 'text-[#4338CA] dark:text-[#818CF8] font-bold' : ''
              }`}
            >
              B2B / Campus
            </button>

            <button
              onClick={() => onViewChange('responder')}
              className={`hover:text-[#4338CA] dark:hover:text-[#818CF8] transition-colors cursor-pointer flex items-center space-x-1 ${
                currentView === 'responder' ? 'text-[#4338CA] dark:text-[#818CF8] font-bold' : ''
              }`}
            >
              <span>Partner Portal</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </button>

            {/* About Us Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowAboutMenu(!showAboutMenu)}
                className="flex items-center space-x-1 hover:text-[#4338CA] dark:hover:text-[#818CF8] transition-colors cursor-pointer"
              >
                <span>About Us</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {showAboutMenu && (
                <div 
                  className="absolute top-8 left-0 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in select-none"
                  onClick={() => setShowAboutMenu(false)}
                >
                  <button
                    onClick={() => onViewChange('docs')}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-2"
                  >
                    <FileText className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Company Mission</span>
                  </button>
                  <button
                    onClick={() => onViewChange('admin')}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-2"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-blue-500" />
                    <span>Campus Network</span>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Icons: Theme Switcher + Camouflage Dropdown + Red "Contact Us / Live SOS" Button */}
          <div className="flex items-center space-x-2.5">
            {/* System / Light / Dark Theme Selector (Requested by user) */}
            <div className="relative">
              <button
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center space-x-1 cursor-pointer"
                title={`Theme: ${theme}`}
              >
                {theme === 'light' ? (
                  <Sun className="w-4 h-4 text-amber-500" />
                ) : theme === 'dark' ? (
                  <Moon className="w-4 h-4 text-indigo-400" />
                ) : (
                  <Laptop className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                )}
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {showThemeMenu && (
                <div 
                  className="absolute right-0 mt-2 w-36 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-1.5 z-50 animate-in fade-in"
                  onClick={() => setShowThemeMenu(false)}
                >
                  <button
                    onClick={() => onThemeChange('system')}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs flex items-center space-x-2 ${
                      theme === 'system' ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Laptop className="w-3.5 h-3.5" />
                    <span>System Auto</span>
                  </button>
                  <button
                    onClick={() => onThemeChange('light')}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs flex items-center space-x-2 ${
                      theme === 'light' ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>Light Theme</span>
                  </button>
                  <button
                    onClick={() => onThemeChange('dark')}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs flex items-center space-x-2 ${
                      theme === 'dark' ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Dark Theme</span>
                  </button>
                </div>
              )}
            </div>

            {/* Camouflage Disguises Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowStealthMenu(!showStealthMenu)}
                className="hidden sm:flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold transition-all cursor-pointer"
              >
                <EyeOff className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Stealth</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {showStealthMenu && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-1.5 z-50 animate-in fade-in"
                  onClick={() => setShowStealthMenu(false)}
                >
                  <button
                    onClick={onOpenCalculator}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-2"
                  >
                    <Calculator className="w-4 h-4 text-amber-500" />
                    <div>
                      <span className="font-bold block">Calculator Disguise</span>
                      <span className="text-[10px] text-slate-500">PIN 911 = Silent Trigger</span>
                    </div>
                  </button>

                  <button
                    onClick={onOpenNotes}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-2"
                  >
                    <BookOpen className="w-4 h-4 text-emerald-500" />
                    <div>
                      <span className="font-bold block">Grocery Notes</span>
                      <span className="text-[10px] text-slate-500">Checklist Cover Screen</span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Red Button: "Contact Us" (Screenshot 1 & 2: Exact red rounded pill button!) */}
            <button
              onClick={() => onViewChange('trigger')}
              className={`px-5 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center space-x-1.5 shadow-md active:scale-95 cursor-pointer ${
                activeAlert 
                  ? 'bg-amber-600 hover:bg-amber-500 text-white animate-pulse'
                  : 'bg-[#DC2626] hover:bg-[#B91C1C] text-white shadow-red-600/30'
              }`}
            >
              <AlertOctagon className="w-4 h-4 text-white" />
              <span>{activeAlert ? 'DISARM SOS' : 'Contact Us'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. MOBILE BOTTOM NAVIGATION DOCK (Appears on Mobile screens) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 py-1.5 px-3 flex items-center justify-around shadow-2xl transition-colors">
        {/* Tab 1: Product / Home */}
        <button
          onClick={() => onViewChange('home')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl text-[10px] font-semibold transition-all cursor-pointer ${
            currentView === 'home'
              ? 'text-[#4338CA] dark:text-[#818CF8] font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>Product</span>
        </button>

        {/* Tab 2: Guardians */}
        <button
          onClick={() => onViewChange('guardians')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl text-[10px] font-semibold transition-all cursor-pointer ${
            currentView === 'guardians'
              ? 'text-[#4338CA] dark:text-[#818CF8] font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span>Guardians</span>
        </button>

        {/* Tab 3: Raised Center Red SOS Button */}
        <button
          onClick={() => onViewChange('trigger')}
          className="relative -top-3.5 flex flex-col items-center group focus:outline-none cursor-pointer"
        >
          <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl border-2 border-white dark:border-slate-900 transition-all ${
            activeAlert
              ? 'bg-amber-600 text-white animate-pulse'
              : 'bg-[#DC2626] hover:bg-[#B91C1C] text-white scale-105 shadow-red-600/50'
          }`}>
            <AlertOctagon className="w-7 h-7" />
          </div>
          <span className="text-[10px] font-extrabold text-red-600 dark:text-red-400 mt-0.5 font-mono">
            {activeAlert ? 'DISARM' : 'SOS'}
          </span>
        </button>

        {/* Tab 4: Partner / Radar */}
        <button
          onClick={() => onViewChange('responder')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl text-[10px] font-semibold transition-all cursor-pointer ${
            currentView === 'responder'
              ? 'text-[#4338CA] dark:text-[#818CF8] font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Radio className="w-5 h-5 mb-0.5" />
          <span>Radar</span>
        </button>

        {/* Tab 5: More Tools Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className={`flex flex-col items-center py-1 px-2.5 rounded-xl text-[10px] font-semibold transition-all cursor-pointer ${
              showMoreMenu
                ? 'text-[#4338CA] dark:text-[#818CF8] font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <MoreHorizontal className="w-5 h-5 mb-0.5" />
            <span>More</span>
          </button>

          {showMoreMenu && (
            <div 
              className="absolute bottom-14 right-0 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in"
              onClick={() => setShowMoreMenu(false)}
            >
              <button
                onClick={onOpenFakeCall}
                className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-2"
              >
                <Phone className="w-4 h-4 text-amber-500" />
                <span>Fake Call Escape</span>
              </button>

              <button
                onClick={onOpenSafeWalk}
                className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-2"
              >
                <Footprints className="w-4 h-4 text-teal-500" />
                <span>Follow Me Timer</span>
              </button>

              <button
                onClick={onOpenCalculator}
                className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-2"
              >
                <Calculator className="w-4 h-4 text-blue-500" />
                <span>Calculator Disguise</span>
              </button>

              <button
                onClick={() => onViewChange('admin')}
                className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-2"
              >
                <LayoutDashboard className="w-4 h-4 text-purple-500" />
                <span>Campus Command</span>
              </button>

              <button
                onClick={() => onViewChange('docs')}
                className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-2"
              >
                <FileText className="w-4 h-4 text-slate-400" />
                <span>PRD Specs</span>
              </button>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
