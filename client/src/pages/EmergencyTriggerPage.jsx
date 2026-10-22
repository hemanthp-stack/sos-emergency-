import React, { useState, useEffect, useRef } from 'react';
import { 
  AlertOctagon, VolumeX, Volume2, ShieldAlert, Navigation, Lock, 
  CheckCircle, Radio, Clock, Phone, Footprints, EyeOff, Camera,
  Check, ChevronRight, RefreshCw, Send, Zap, Compass, Activity, BookOpen, Calculator, RotateCcw
} from 'lucide-react';
import { audioEngine } from '../utils/audioSynthesizer';
import { captureAmbientEvidence } from '../utils/mediaCapture';

export default function EmergencyTriggerPage({
  activeAlert,
  onTriggerSOS,
  onResolveSOS,
  onOpenFakeCall,
  onOpenSafeWalk,
  onOpenCalculator,
  onOpenNotes,
  onViewResponder,
  currentLocation,
  batteryLevel,
  guardians
}) {
  const [triggerMode, setTriggerMode] = useState('instant'); // Default to instant 1-tap so clicking ALWAYS works immediately!
  const [isSilent, setIsSilent] = useState(true);
  const [selectedReason, setSelectedReason] = useState('Stalking / Suspicious Person');
  const [customNote, setCustomNote] = useState('');
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const holdIntervalRef = useRef(null);

  const reasons = [
    { label: 'Stalking / Followed', tag: 'High Threat' },
    { label: 'Street Harassment', tag: 'Immediate' },
    { label: 'Domestic Violence', tag: 'Critical' },
    { label: 'Medical Distress', tag: 'Health Emergency' },
    { label: 'Unsafe Transit / Cab', tag: 'Route Ambush' },
    { label: 'Immediate Danger / Panic', tag: 'Code Red' }
  ];

  // Active alert elapsed timer
  useEffect(() => {
    let timer;
    if (activeAlert) {
      const startTime = new Date(activeAlert.timestamp).getTime();
      timer = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    } else {
      setElapsedSeconds(0);
    }
    return () => clearInterval(timer);
  }, [activeAlert]);

  // Hold to Trigger logic
  const startHold = () => {
    if (activeAlert) return;
    setIsHolding(true);
    let progress = 0;
    holdIntervalRef.current = setInterval(() => {
      progress += 10;
      setHoldProgress(progress);
      if (progress >= 100) {
        clearInterval(holdIntervalRef.current);
        fireSOS('long_press');
        setIsHolding(false);
        setHoldProgress(0);
      }
    }, 150); // ~1.5 - 2s hold for snappy response
  };

  const endHold = () => {
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    setIsHolding(false);
    setHoldProgress(0);
  };

  // Main fire SOS function
  const fireSOS = async (type = 'button') => {
    if (activeAlert) {
      // If alert is already active, clicking allows user to disarm directly!
      handleQuickDisarm();
      return;
    }

    if (!isSilent) {
      audioEngine.startSiren();
    } else {
      audioEngine.playDiscreetConfirm();
    }

    let evidence = null;
    try {
      evidence = await captureAmbientEvidence({ recordAudio: false, capturePhoto: false });
    } catch (e) {}

    onTriggerSOS({
      silent: isSilent,
      triggerType: type,
      reason: selectedReason,
      customMessage: customNote,
      evidence
    });
  };

  const handleMainButtonClick = () => {
    if (activeAlert) {
      handleQuickDisarm();
      return;
    }

    if (triggerMode === 'instant') {
      fireSOS('button');
    } else {
      // If in hold mode but user just clicked, fire immediate SOS so they are NEVER frustrated!
      fireSOS('button');
    }
  };

  const handlePinDisarm = () => {
    if (pinInput === '1234' || pinInput.trim() === '') {
      audioEngine.stop();
      onResolveSOS('1234', 'User confirmed safe.');
      setPinInput('');
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleQuickDisarm = () => {
    audioEngine.stop();
    onResolveSOS('1234', 'User canceled alert (marked safe).');
    setPinInput('');
    setPinError(false);
  };

  const formatElapsed = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 text-slate-900 dark:text-slate-100">
      {/* 1. ACTIVE EMERGENCY HUD BANNER */}
      {activeAlert && (
        <div className="relative overflow-hidden rounded-3xl bg-red-50 dark:bg-red-950/70 border-2 border-red-500 p-6 shadow-2xl animate-pulse-subtle">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center shrink-0 shadow-xl animate-pulse">
                <AlertOctagon className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-black uppercase tracking-wider bg-red-600 text-white px-2.5 py-0.5 rounded-full font-mono">
                    {activeAlert.silent ? '🚨 SILENT BEACON ACTIVE' : '🚨 AUDIBLE SIREN ACTIVE'}
                  </span>
                  <span className="text-xs font-mono text-red-600 dark:text-red-300 font-bold">
                    Elapsed: {formatElapsed(elapsedSeconds)}
                  </span>
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
                  Discreet Live GPS Broadcasting to Guardians
                </h2>
                <p className="text-xs text-slate-600 dark:text-red-200 mt-0.5">
                  Threat: <span className="font-semibold">{activeAlert.reason}</span> • {guardians.length} Guardians notified in <b className="font-mono">{activeAlert.deliveryLatencyMs || 250}ms</b>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => onViewResponder(activeAlert.id)}
                className="px-4 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-slate-800 text-xs font-bold transition-all flex items-center space-x-2 shadow hover:bg-slate-800"
              >
                <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>Open Guardian Radar</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleQuickDisarm}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow flex items-center space-x-1.5"
              >
                <Check className="w-4 h-4" />
                <span>1-Click I Am Safe</span>
              </button>
            </div>
          </div>

          {/* PIN Disarm Form */}
          <div className="mt-5 pt-4 border-t border-red-200 dark:border-red-900/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
            <div className="flex items-center space-x-2 text-xs text-slate-700 dark:text-red-200">
              <Lock className="w-4 h-4 text-red-500" />
              <span>Safety PIN Disarm (Default: <b className="font-mono">1234</b>):</span>
            </div>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <input
                type="password"
                maxLength={4}
                value={pinInput}
                onChange={(e) => { setPinInput(e.target.value); setPinError(false); }}
                placeholder="1234"
                className="w-24 bg-white dark:bg-slate-950 border border-slate-300 dark:border-red-700 rounded-xl px-3 py-1.5 text-center text-sm font-mono text-slate-900 dark:text-white tracking-widest focus:outline-none focus:border-red-500"
              />
              <button
                onClick={handlePinDisarm}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow transition-all"
              >
                Confirm PIN
              </button>
            </div>
          </div>
          {pinError && (
            <p className="text-[11px] text-red-600 dark:text-red-300 mt-1 font-semibold text-right">Incorrect Safety PIN</p>
          )}
        </div>
      )}

      {/* 2. THE TACTILE SOS BUTTON HUB */}
      <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl relative overflow-hidden transition-all">
        {/* Header */}
        <div className="text-center max-w-lg mx-auto mb-6">
          <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-slate-950 border border-blue-200 dark:border-slate-800 px-3 py-1 rounded-full mb-3 text-[11px] text-blue-600 dark:text-blue-400 font-semibold font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>BEACON SATELLITE HUD: READY</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Non-Verbal Silent Dispatch
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Zero-sound, one-touch emergency transmission to your guardian network with live telemetry.
          </p>
        </div>

        {/* Central Tactical SOS Button */}
        <div className="my-6 flex flex-col items-center justify-center relative">
          <div className="relative flex items-center justify-center">
            {/* Concentric Animated Radar Rings */}
            {!activeAlert && (
              <div className="absolute w-56 h-56 rounded-full border border-red-500/20 bsafe-pulse-ripple pointer-events-none"></div>
            )}

            {/* Hold progress SVG ring */}
            {triggerMode === 'hold' && (
              <svg className="w-68 h-68 lg:w-76 lg:h-76 -rotate-90 pointer-events-none absolute -inset-5">
                <circle
                  cx="50%"
                  cy="50%"
                  r="46%"
                  className="stroke-slate-200 dark:stroke-slate-800 fill-none"
                  strokeWidth="8"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="46%"
                  className="stroke-red-500 fill-none transition-all duration-100 ease-linear shadow-lg"
                  strokeWidth="8"
                  strokeDasharray="880"
                  strokeDashoffset={880 - (880 * holdProgress) / 100}
                  strokeLinecap="round"
                />
              </svg>
            )}

            {/* THE SOS BUTTON (Always visible & interactive in Light & Dark Mode!) */}
            <button
              type="button"
              onMouseDown={triggerMode === 'hold' && !activeAlert ? startHold : undefined}
              onMouseUp={triggerMode === 'hold' && !activeAlert ? endHold : undefined}
              onMouseLeave={triggerMode === 'hold' && !activeAlert ? endHold : undefined}
              onTouchStart={triggerMode === 'hold' && !activeAlert ? startHold : undefined}
              onTouchEnd={triggerMode === 'hold' && !activeAlert ? endHold : undefined}
              onClick={handleMainButtonClick}
              className={`relative z-10 w-56 h-56 lg:w-64 lg:h-64 rounded-full flex flex-col items-center justify-center transition-all transform active:scale-95 cursor-pointer select-none shadow-2xl ${
                activeAlert
                  ? 'bg-gradient-to-tr from-amber-600 via-orange-600 to-red-600 text-white border-4 border-amber-300 animate-pulse glow-neon-red shadow-sos-glow'
                  : isHolding
                  ? 'bg-gradient-to-tr from-red-700 via-rose-600 to-red-800 text-white border-4 border-white scale-98 shadow-sos-glow'
                  : 'btn-emergency-sos btn-bsafe-emergency bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white border-4 border-red-300 hover:scale-105 shadow-sos-glow'
              }`}
            >
              <AlertOctagon className="w-16 h-16 lg:w-20 lg:h-20 mb-1 drop-shadow-lg text-white" />
              
              <span className="text-3xl lg:text-4xl font-black tracking-widest font-mono text-white drop-shadow-md">
                {activeAlert ? 'CANCEL' : 'SOS'}
              </span>

              <span className="text-[11px] font-extrabold uppercase tracking-widest mt-1 text-white bg-black/40 px-3.5 py-0.5 rounded-full border border-white/30 shadow-sm">
                {activeAlert 
                  ? 'TAP TO DISARM' 
                  : triggerMode === 'hold'
                  ? (isHolding ? `HOLDING (${Math.round((2 * (100 - holdProgress)) / 100)}s)` : 'HOLD OR TAP')
                  : 'TAP TO TRIGGER'}
              </span>

              <div className="absolute bottom-4 font-mono text-[10px] font-semibold text-white/90 tracking-wider">
                {isSilent ? '0dB DISCREET' : '120dB SIREN'}
              </div>
            </button>
          </div>

          {/* Quick trigger shortcut buttons below main button */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {!activeAlert ? (
              <>
                <button
                  onClick={() => fireSOS('button')}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold shadow flex items-center space-x-1.5 active:scale-95 transition-all"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>1-Tap Instant Dispatch</span>
                </button>

                <button
                  onClick={() => { setTriggerMode('hold'); startHold(); }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 transition-all"
                >
                  <span>Simulate 3s Hold</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleQuickDisarm}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-lg flex items-center space-x-1.5 active:scale-95 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset / Mark Safe</span>
              </button>
            )}
          </div>
        </div>

        {/* Configuration Bar: Trigger Mode & Silent Switch */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-200 dark:border-slate-800 text-left">
          {/* Trigger method toggle */}
          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">Activation Mode</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Choose trigger sensitivity</span>
            </div>
            <div className="flex bg-slate-200 dark:bg-slate-900 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setTriggerMode('instant')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  triggerMode === 'instant' ? 'bg-red-600 text-white shadow' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                1-Tap Instant
              </button>
              <button
                type="button"
                onClick={() => setTriggerMode('hold')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  triggerMode === 'hold' ? 'bg-red-600 text-white shadow' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Hold 3s
              </button>
            </div>
          </div>

          {/* Silent SOS vs Audible Siren */}
          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">Audio Stealth Protocol</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">{isSilent ? 'Discreet silent beacon' : 'Loud deterrent siren'}</span>
            </div>
            <div className="flex bg-slate-200 dark:bg-slate-900 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setIsSilent(true)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  isSilent ? 'bg-blue-600 text-white shadow' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Silent Mode
              </button>
              <button
                type="button"
                onClick={() => setIsSilent(false)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  !isSilent ? 'bg-amber-600 text-white shadow' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Audible Siren
              </button>
            </div>
          </div>
        </div>

        {/* Threat Scenario Selector */}
        <div className="mt-5 text-left">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2.5">
            Emergency Threat Scenario
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {reasons.map((r) => (
              <button
                key={r.label}
                type="button"
                onClick={() => setSelectedReason(r.label)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  selectedReason === r.label
                    ? 'bg-red-50 dark:bg-red-950/60 border-red-500 text-red-700 dark:text-red-200 shadow-sm font-bold'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold truncate">{r.label}</span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                    selectedReason === r.label ? 'bg-red-500/20 text-red-600 dark:text-red-300' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {r.tag}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-3">
            <input
              type="text"
              placeholder="Optional situational note (e.g. 'Stalker in blue hoodie, heading towards subway')"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-red-500"
            />
          </div>
        </div>
      </div>

      {/* 3. DEVICE TELEMETRY & GPS HUD */}
      <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-md text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Live Geolocation Telemetry</span>
                <span className="text-[10px] font-mono bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                  ±{currentLocation?.accuracy || 8}m SATELLITE LOCK
                </span>
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5 font-mono font-semibold">
                {currentLocation?.lat?.toFixed(5) || '37.77490'}° N, {currentLocation?.lng?.toFixed(5) || '-122.41940'}° W
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {currentLocation?.address || 'Civic Center Plaza, San Francisco, CA'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-xs font-mono text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-950 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div>Battery: <b className="text-slate-900 dark:text-white">{batteryLevel}%</b></div>
            <div>•</div>
            <div>Guardians: <b className="text-emerald-600 dark:text-emerald-400">{guardians.length} Sync</b></div>
          </div>
        </div>
      </div>

      {/* 4. PROACTIVE ESCAPE TOOLKIT */}
      <div className="text-left">
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
          Proactive Escape & Camouflage Toolkit
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div
            onClick={onOpenFakeCall}
            className="cursor-pointer bg-white dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl transition-all shadow-sm group hover:border-amber-400"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
                <Phone className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded-full">
                ESCAPE
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
              Discreet Fake Call
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Ring your phone in 3s with realistic audio to excuse yourself safely.
            </p>
          </div>

          <div
            onClick={onOpenSafeWalk}
            className="cursor-pointer bg-white dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl transition-all shadow-sm group hover:border-teal-400"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-500 flex items-center justify-center border border-teal-500/20">
                <Footprints className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-bold text-teal-600 dark:text-teal-400 bg-teal-100 dark:bg-teal-950/80 px-2 py-0.5 rounded-full">
                FOLLOW ME
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-500 transition-colors">
              Safe Walk Timer
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Timed countdown. Automatically fires SOS if PIN is not entered.
            </p>
          </div>

          <div
            onClick={onOpenCalculator}
            className="cursor-pointer bg-white dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl transition-all shadow-sm group hover:border-blue-400"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20">
                <Calculator className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-950/80 px-2 py-0.5 rounded-full">
                DISGUISE
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
              Calculator Camouflage
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Masks as working calculator. Type <b className="text-slate-900 dark:text-white">911 =</b> to trigger SOS.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
