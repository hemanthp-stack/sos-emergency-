import React, { useState, useEffect } from 'react';
import { Footprints, AlertTriangle, ShieldCheck, Clock, X, Lock, MapPin } from 'lucide-react';

export default function SafeWalkModal({ isOpen, onClose, onEscalateToSOS }) {
  const [destination, setDestination] = useState('Walking to Campus Metro');
  const [durationMins, setDurationMins] = useState(10);
  const [isActive, setIsActive] = useState(false);
  const [timeLeftSecs, setTimeLeftSecs] = useState(600);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [isSafe, setIsSafe] = useState(false);

  useEffect(() => {
    let timer;
    if (isActive && timeLeftSecs > 0) {
      timer = setInterval(() => {
        setTimeLeftSecs(t => t - 1);
      }, 1000);
    } else if (isActive && timeLeftSecs === 0) {
      // Escalation triggered!
      setIsActive(false);
      onEscalateToSOS({
        silent: true,
        triggerType: 'safewalk_timeout',
        reason: `Safe Walk Timed Out: Failed to check in while heading to "${destination}"`
      });
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeftSecs, destination]);

  if (!isOpen) return null;

  const handleStartWalk = async () => {
    const totalSecs = durationMins * 60;
    setTimeLeftSecs(totalSecs);
    setIsActive(true);
    setIsSafe(false);
    setPinError(false);

    try {
      await fetch('/api/safewalk/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination, durationMinutes: durationMins })
      });
    } catch (e) {}
  };

  const handleCheckInSafe = async () => {
    if (enteredPin === '1234') {
      setIsActive(false);
      setIsSafe(true);
      setPinError(false);
      try {
        await fetch('/api/safewalk/checkin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pin: enteredPin })
        });
      } catch (e) {}

      setTimeout(() => {
        setIsSafe(false);
        setEnteredPin('');
        onClose();
      }, 1800);
    } else {
      setPinError(true);
      setEnteredPin('');
    }
  };

  const formatCountdown = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const percentLeft = Math.round((timeLeftSecs / (durationMins * 60)) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
      <div className="w-full max-w-sm glass-panel border border-white/10 rounded-3xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-500 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {!isActive && !isSafe && (
          <div>
            <div className="flex items-center space-x-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
                <Footprints className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Safe Walk (Follow Me)</h3>
                <p className="text-xs text-slate-400">Timed guardian safety journey monitoring</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-teal-400" />
                  <span>Destination / Route</span>
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                  placeholder="e.g. Walking from science building to parking lot"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Expected Duration
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[5, 10, 15, 30].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setDurationMins(mins)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        durationMins === mins
                          ? 'bg-teal-500/20 border-teal-500 text-teal-300'
                          : 'bg-slate-900/60 border-white/10 text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3.5 bg-teal-950/30 border border-teal-900/50 rounded-2xl text-xs text-teal-200/90 leading-relaxed">
                If you do not safely enter your PIN before countdown expires, the system automatically escalates into a Critical Silent SOS broadcast with your live coordinates.
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleStartWalk}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 font-black text-xs shadow-lg shadow-teal-500/20 hover:from-teal-400 hover:to-emerald-500 transition-all flex items-center justify-center space-x-2"
              >
                <Footprints className="w-4 h-4" />
                <span>Start Follow Me Session</span>
              </button>
            </div>
          </div>
        )}

        {isActive && (
          <div className="text-center py-4">
            <div className="relative w-48 h-48 mx-auto mb-6 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-slate-800 fill-none"
                  strokeWidth="6"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-teal-400 fill-none transition-all duration-1000 ease-linear shadow-lg"
                  strokeWidth="6"
                  strokeDasharray="264"
                  strokeDashoffset={264 - (264 * percentLeft) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-white font-mono tracking-tight">
                  {formatCountdown(timeLeftSecs)}
                </span>
                <span className="text-[10px] text-teal-400 uppercase tracking-widest font-mono mt-1 font-bold">Remaining</span>
              </div>
            </div>

            <h4 className="text-sm font-bold text-white mb-1">{destination}</h4>
            <p className="text-xs text-slate-400 mb-5">Guardians tracking journey telemetry</p>

            {/* Check-in with PIN */}
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-white/10 text-left">
              <label className="text-xs font-bold text-slate-400 block mb-2 flex items-center justify-between">
                <span>Enter PIN to Check-in Safe (Default: 1234)</span>
                <Lock className="w-3.5 h-3.5 text-slate-500" />
              </label>
              <div className="flex space-x-2">
                <input
                  type="password"
                  maxLength={4}
                  placeholder="PIN"
                  value={enteredPin}
                  onChange={(e) => { setEnteredPin(e.target.value); setPinError(false); }}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-center text-sm font-mono tracking-widest text-white focus:outline-none focus:border-teal-400"
                />
                <button
                  onClick={handleCheckInSafe}
                  className="px-4 py-2 bg-teal-400 text-slate-950 font-black rounded-xl text-xs hover:bg-teal-300 transition-all shadow"
                >
                  Verify Safe
                </button>
              </div>
              {pinError && (
                <p className="text-[11px] text-rose-400 mt-1.5 font-semibold">Incorrect Safety PIN</p>
              )}
            </div>
          </div>
        )}

        {isSafe && (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center mb-4 shadow-xl">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-white mb-1">Journey Verified Safe!</h4>
            <p className="text-xs text-slate-400">Safe walk concluded. Guardians updated that you arrived safely.</p>
          </div>
        )}
      </div>
    </div>
  );
}
