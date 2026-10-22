import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, Mic, Volume2, Grid, User, Clock, Check, Shield } from 'lucide-react';
import { audioEngine } from '../utils/audioSynthesizer';

export default function FakeCallModal({ isOpen, onClose }) {
  const [callerName, setCallerName] = useState('Mom');
  const [delaySeconds, setDelaySeconds] = useState(3);
  const [status, setStatus] = useState('idle'); // idle | countdown | ringing | in_call
  const [countdown, setCountdown] = useState(3);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);

  // Countdown before ringing
  useEffect(() => {
    let timer;
    if (status === 'countdown' && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(c => c - 1);
      }, 1000);
    } else if (status === 'countdown' && countdown === 0) {
      setStatus('ringing');
      audioEngine.startPhoneRing();
    }
    return () => clearTimeout(timer);
  }, [status, countdown]);

  // In-call duration timer
  useEffect(() => {
    let callTimer;
    if (status === 'in_call') {
      callTimer = setInterval(() => {
        setCallDuration(d => d + 1);
      }, 1000);
    }
    return () => clearInterval(callTimer);
  }, [status]);

  if (!isOpen) return null;

  const handleStartFakeCall = () => {
    if (delaySeconds === 0) {
      setStatus('ringing');
      audioEngine.startPhoneRing();
    } else {
      setCountdown(delaySeconds);
      setStatus('countdown');
    }
  };

  const handleAcceptCall = () => {
    audioEngine.stop();
    setStatus('in_call');
    setCallDuration(0);
    audioEngine.startCallerMurmur();
  };

  const handleEndCall = () => {
    audioEngine.stop();
    setStatus('idle');
    onClose();
  };

  const formatCallTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
      {/* 1. Setup Screen */}
      {status === 'idle' && (
        <div className="w-full max-w-sm glass-panel border border-white/10 rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in-95">
          <div className="flex items-center space-x-3 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Discreet Fake Call</h3>
              <p className="text-xs text-slate-400">Exit uncomfortable or threatening encounters</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Caller Identity</label>
              <div className="grid grid-cols-2 gap-2">
                {['Mom', 'Office Boss', 'Campus Security', 'Dr. Reynolds'].map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setCallerName(name)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border text-left transition-all ${
                      callerName === name
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-slate-900/60 border-white/10 text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="Or enter custom caller name"
                value={callerName}
                onChange={(e) => setCallerName(e.target.value)}
                className="mt-2 w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Ring Trigger Delay</label>
              <div className="flex space-x-2">
                {[
                  { label: 'Now', secs: 0 },
                  { label: '3s', secs: 3 },
                  { label: '10s', secs: 10 },
                  { label: '30s', secs: 30 }
                ].map((opt) => (
                  <button
                    key={opt.secs}
                    type="button"
                    onClick={() => setDelaySeconds(opt.secs)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                      delaySeconds === opt.secs
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-slate-900/60 border-white/10 text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl border border-white/10 text-slate-400 text-xs font-bold hover:bg-slate-800 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleStartFakeCall}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition-all flex items-center justify-center space-x-1.5"
            >
              <span>Schedule Call</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Countdown Waiting State */}
      {status === 'countdown' && (
        <div className="text-center p-8 glass-panel border border-white/10 rounded-3xl shadow-2xl max-w-xs w-full animate-in fade-in zoom-in-95">
          <Clock className="w-12 h-12 text-amber-400 mx-auto mb-3 animate-spin" />
          <h4 className="text-xl font-black text-white mb-1">Triggering Escape Call</h4>
          <p className="text-xs text-slate-400 mb-4">Phone will ring in <b className="text-white font-mono">{countdown}s</b>...</p>
          <button
            onClick={() => { setStatus('idle'); onClose(); }}
            className="text-xs text-rose-400 hover:underline font-semibold"
          >
            Cancel schedule
          </button>
        </div>
      )}

      {/* 3. Authentic Smartphone Incoming Ring Screen */}
      {status === 'ringing' && (
        <div className="fixed inset-0 bg-slate-950 flex flex-col justify-between items-center py-16 px-6 z-50 text-white select-none">
          <div className="text-center mt-12">
            <div className="w-28 h-28 rounded-full bg-slate-800/80 border-2 border-white/20 mx-auto flex items-center justify-center mb-4 shadow-2xl relative">
              <User className="w-14 h-14 text-slate-300" />
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center text-[10px]">
                <Phone className="w-3 h-3 text-white" />
              </span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">{callerName}</h2>
            <p className="text-sm text-slate-400 mt-1">Mobile</p>
            <p className="text-xs text-amber-400 mt-3 font-mono animate-pulse">Incoming call...</p>
          </div>

          <div className="w-full max-w-xs flex justify-around items-center mb-10">
            {/* Decline */}
            <div className="flex flex-col items-center space-y-2">
              <button
                onClick={handleEndCall}
                className="w-18 h-18 p-4 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-2xl active:scale-95 transition-all"
              >
                <PhoneOff className="w-8 h-8" />
              </button>
              <span className="text-xs text-slate-400 font-semibold">Decline</span>
            </div>

            {/* Accept */}
            <div className="flex flex-col items-center space-y-2">
              <button
                onClick={handleAcceptCall}
                className="w-18 h-18 p-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center shadow-2xl active:scale-95 transition-all animate-bounce"
              >
                <Phone className="w-8 h-8 text-white" />
              </button>
              <span className="text-xs text-slate-400 font-semibold">Accept</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. Active In-Call Screen */}
      {status === 'in_call' && (
        <div className="fixed inset-0 bg-slate-950 flex flex-col justify-between items-center py-16 px-6 z-50 text-white select-none">
          <div className="text-center mt-8">
            <div className="w-20 h-20 rounded-full bg-slate-800 border border-white/10 mx-auto flex items-center justify-center mb-3 shadow-xl">
              <User className="w-10 h-10 text-slate-300" />
            </div>
            <h2 className="text-2xl font-bold">{callerName}</h2>
            <p className="text-base text-emerald-400 font-mono mt-1 font-bold">{formatCallTime(callDuration)}</p>
          </div>

          {/* In-Call Keypad Controls */}
          <div className="w-full max-w-xs grid grid-cols-3 gap-6 my-auto text-slate-300">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                isMuted ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'bg-slate-900/60 border-white/10'
              }`}
            >
              <Mic className="w-6 h-6 mb-1" />
              <span className="text-[11px] font-semibold">{isMuted ? 'Muted' : 'Mute'}</span>
            </button>

            <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900/60 border border-white/10">
              <Grid className="w-6 h-6 mb-1" />
              <span className="text-[11px] font-semibold">Keypad</span>
            </div>

            <button
              onClick={() => setIsSpeaker(!isSpeaker)}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                isSpeaker ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'bg-slate-900/60 border-white/10'
              }`}
            >
              <Volume2 className="w-6 h-6 mb-1" />
              <span className="text-[11px] font-semibold">{isSpeaker ? 'Speaker On' : 'Speaker'}</span>
            </button>
          </div>

          {/* End Call Button */}
          <div className="mb-6">
            <button
              onClick={handleEndCall}
              className="px-8 py-4 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-2xl active:scale-95 transition-all space-x-2 font-bold"
            >
              <PhoneOff className="w-6 h-6" />
              <span>End Call</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
