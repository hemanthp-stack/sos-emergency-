import React, { useState } from 'react';
import { 
  Shield, Phone, Footprints, Radio, AlertOctagon, Users, Lock, 
  CheckCircle, ArrowRight, Video, EyeOff, Activity, Clock, Play, 
  MapPin, ChevronRight, Star, HeartHandshake, Building2, Sparkles, Zap
} from 'lucide-react';
import LiveEmergencyMap from '../components/LiveEmergencyMap';

export default function BSafeHomePage({
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
  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 font-sans transition-colors">
      {/* 1. HERO SECTION (Directly matching getbsafe.com) */}
      <section className="relative pt-10 pb-16 px-4 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Headline & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-blue-600 dark:text-blue-400">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span>WORLD LEADING SAFETY TECHNOLOGY PLATFORM</span>
            </div>

            {/* Official getbsafe.com headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              bSafe is a world leading safety technology company dedicated to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500">
                protecting lives
              </span>{' '}
              through smart, proactive solutions.
            </h1>

            {/* Official getbsafe.com subtitle */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              Our innovative platform enables emergency response teams, universities, and trusted guardians to act within <span className="font-bold underline decoration-blue-500 text-blue-600 dark:text-white">SECONDS</span>, not <span className="text-slate-400 line-through">MINUTES</span>, ultimately saving lives and health.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={onLaunchSOS}
                className="px-6 py-3.5 rounded-2xl btn-bsafe-primary text-xs sm:text-sm font-extrabold flex items-center space-x-2 shadow-lg group active:scale-95 transition-all"
              >
                <AlertOctagon className="w-4 h-4 text-white" />
                <span>Launch Live Silent SOS App</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onOpenFakeCall}
                className="px-5 py-3.5 rounded-2xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all hover:border-blue-500 active:scale-95 shadow-sm"
              >
                <Phone className="w-4 h-4 text-amber-500" />
                <span>Test Fake Call</span>
              </button>

              <button
                onClick={onOpenSafeWalk}
                className="px-5 py-3.5 rounded-2xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all hover:border-blue-500 active:scale-95 shadow-sm"
              >
                <Footprints className="w-4 h-4 text-teal-500" />
                <span>Follow Me Timer</span>
              </button>
            </div>

            {/* Trust and SLA Metrics Row */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">&lt; 2.0s</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Response SLA</div>
              </div>
              <div>
                <div className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">20M+</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Safe Walk Minutes</div>
              </div>
              <div>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">100+</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Countries</div>
              </div>
              <div>
                <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">99.99%</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Uptime Tier</div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Live bSafe Cockpit Preview */}
          <div className="lg:col-span-5 relative">
            <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-xl transition-all text-center">
              {/* Header inside phone card */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-extrabold text-sm lowercase">
                    b
                  </div>
                  <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">bSafe Live Controller</span>
                </div>
                <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 px-2 py-0.5 rounded-full font-mono font-bold">
                  ● GPS LOCKED
                </span>
              </div>

              {/* Central Interactive SOS Beacon (ALWAYS CLICKABLE!) */}
              <div className="my-6">
                <div className="relative inline-block">
                  <div className="absolute inset-0 rounded-full bg-red-500/10 bsafe-pulse-ripple pointer-events-none"></div>
                  <button
                    onClick={onLaunchSOS}
                    className="relative z-10 w-40 h-40 sm:w-44 sm:h-44 rounded-full btn-emergency-sos btn-bsafe-emergency bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white flex flex-col items-center justify-center shadow-sos-glow active:scale-95 transition-all mx-auto border-4 border-white cursor-pointer"
                  >
                    <AlertOctagon className="w-11 h-11 text-white mb-1" />
                    <span className="text-2xl font-black tracking-widest font-mono text-white">
                      {activeAlert ? 'CANCEL' : 'SOS'}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-100 mt-0.5">
                      {activeAlert ? 'ACTIVE (TAP TO DISARM)' : 'TAP TO DISPATCH'}
                    </span>
                  </button>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 font-medium">
                  {activeAlert ? '🚨 Emergency Beacon Transmitting' : 'One-touch silent activation notifying guardians instantly.'}
                </p>
              </div>

              {/* Live Location Strip */}
              <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-3 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between mb-3 text-left">
                <div className="flex items-center space-x-2 truncate">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                  <div className="truncate">
                    <span className="text-slate-800 dark:text-slate-200 font-semibold block truncate">
                      {currentLocation?.address || '742 Market St, San Francisco, CA'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      ±{currentLocation?.accuracy || 8}m Precision • Satellite HUD
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick actions row */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={onOpenFakeCall}
                  className="py-2 px-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center space-x-1.5 transition-all"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-500" />
                  <span>Fake Call Escape</span>
                </button>
                <button
                  onClick={onOpenSafeWalk}
                  className="py-2 px-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center space-x-1.5 transition-all"
                >
                  <Footprints className="w-3.5 h-3.5 text-teal-500" />
                  <span>Follow Me Timer</span>
                </button>
              </div>

              <div className="mt-3.5 pt-3 border-t border-slate-200 dark:border-slate-800 text-center">
                <button
                  onClick={onLaunchSOS}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-bold inline-flex items-center space-x-1"
                >
                  <span>Open Full Emergency Controller</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PRESS & RECOGNITION BADGES (As featured on getbsafe.com) */}
      <section className="py-7 border-y border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-950/60 transition-colors">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-4">
            FEATURED ACROSS GLOBAL MEDIA & EMERGENCY NETWORKS
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 opacity-70 text-slate-600 dark:text-slate-400 font-bold text-xs sm:text-sm tracking-wider">
            <span>FORBES</span>
            <span>CNN</span>
            <span>BBC NEWS</span>
            <span>TECHCRUNCH</span>
            <span>ABC NEWS</span>
            <span>THE NEW YORK TIMES</span>
            <span>NBC TODAY</span>
          </div>
        </div>
      </section>

      {/* 3. CORE FEATURES SHOWCASE (bSafe's 6 Key Features) */}
      <section className="py-16 px-4 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-500/20">
            PROACTIVE SAFETY ECOSYSTEM
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-2.5">
            Intelligent Protection Built for Real-Life Emergencies
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1.5">
            Every feature on bSafe is designed to prevent danger before it happens and ensure instantaneous response when every second counts.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
          {/* Feature 1: SOS Alarm */}
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mb-4 border border-red-500/20">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">SOS Alarm & Silent Trigger</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Activate the emergency alert with a single tap, long-press, or secret PIN. Dispatches your live GPS coordinates silently without audible escalation or visible screen flashes.
              </p>
            </div>
            <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800">
              <button onClick={onLaunchSOS} className="text-xs text-blue-600 dark:text-blue-400 font-bold flex items-center space-x-1 hover:underline">
                <span>Test Live SOS</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Feature 2: Follow Me */}
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-500 flex items-center justify-center mb-4 border border-teal-500/20">
                <Footprints className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">Follow Me with Timer</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Walking home at night? Set a journey countdown (e.g. 10 or 15 minutes). If you don't check in with your safety PIN before the timer ends, the SOS automatically triggers to your guardians.
              </p>
            </div>
            <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800">
              <button onClick={onOpenSafeWalk} className="text-xs text-teal-600 dark:text-teal-400 font-bold flex items-center space-x-1 hover:underline">
                <span>Start Follow Me Walk</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Feature 3: Fake Call */}
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4 border border-amber-500/20">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">Fake Call Escape Generator</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Need to politely exit an uncomfortable or threatening encounter? Receive a realistic simulated phone call with synthesized audio ringtone and speech murmurs to excuse yourself safely.
              </p>
            </div>
            <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800">
              <button onClick={onOpenFakeCall} className="text-xs text-amber-600 dark:text-amber-400 font-bold flex items-center space-x-1 hover:underline">
                <span>Schedule Fake Call</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Feature 4: Live GPS Tracking */}
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-4 border border-blue-500/20">
                <Radio className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">Live GPS Tracking & Breadcrumbs</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Streams high-accuracy GPS coordinates, speed, compass heading, and breadcrumb trails via real-time WebSockets so responders track your path live on an interactive map.
              </p>
            </div>
            <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800">
              <button onClick={() => onViewResponder()} className="text-xs text-blue-600 dark:text-blue-400 font-bold flex items-center space-x-1 hover:underline">
                <span>View Responder Map</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Feature 5: Guardian Network */}
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center mb-4 border border-indigo-500/20">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">Guardian Safety Network</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Add trusted family, friends, or campus security dispatchers who receive instant notification alerts via SMS, web link, and email in less than 400 milliseconds.
              </p>
            </div>
            <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800">
              <button onClick={() => window.location.hash = 'guardians'} className="text-xs text-indigo-600 dark:text-indigo-400 font-bold flex items-center space-x-1 hover:underline">
                <span>Manage Guardians ({guardians.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Feature 6: Auto Evidence Recording */}
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center mb-4 border border-purple-500/20">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">Automatic Evidence Recording</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                When an emergency SOS is triggered, ambient microphone audio and camera snapshots are captured silently and attached to the responder dashboard for forensic proof.
              </p>
            </div>
            <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800">
              <button onClick={onViewDocs} className="text-xs text-purple-600 dark:text-purple-400 font-bold flex items-center space-x-1 hover:underline">
                <span>Read Evidence Spec</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CAMPUS & ENTERPRISE SAFETY SECTION */}
      <section className="py-12 px-4 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white rounded-3xl p-8 lg:p-12 shadow-xl text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3.5">
              <span className="text-xs font-bold text-blue-300 uppercase tracking-widest bg-blue-500/20 px-3 py-1 rounded-full border border-blue-400/30">
                ENTERPRISE & UNIVERSITY SAFETY
              </span>
              <h2 className="text-2xl sm:text-3xl font-black">
                Empowering Universities, Cities & Enterprises to Act Within Seconds
              </h2>
              <p className="text-blue-100 text-xs sm:text-sm leading-relaxed max-w-2xl">
                bSafe provides campus security teams and enterprise duty-of-care managers with a real-time command dashboard. Monitor active student distress alerts, dispatch security to exact coordinates, and review cryptographically signed audit logs.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={onViewAdmin}
                  className="px-5 py-2.5 rounded-xl bg-white text-blue-900 hover:bg-blue-50 text-xs font-bold flex items-center space-x-2 transition-all shadow"
                >
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span>Launch Campus Monitoring Center</span>
                </button>
                <button
                  onClick={onViewDocs}
                  className="px-5 py-2.5 rounded-xl bg-blue-800/80 hover:bg-blue-800 text-white text-xs font-semibold border border-blue-400/30"
                >
                  <span>Review PRD & Technical Specs</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-950/80 p-5 rounded-2xl border border-blue-500/30 space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">DISPATCH RADAR</span>
                <span className="text-emerald-400">ONLINE 99.99%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Avg Delivery:</span>
                <span className="text-white font-bold">0.38 seconds</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Resolution Rate:</span>
                <span className="text-blue-400 font-bold">98.5%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Active Guardians:</span>
                <span className="text-white font-bold">{guardians.length} Configured</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
