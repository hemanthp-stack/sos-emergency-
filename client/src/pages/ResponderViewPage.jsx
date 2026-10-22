import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, Phone, Navigation, Clock, CheckCircle, Radio, 
  Battery, AlertTriangle, MessageSquare, Volume2, Image, Send, ExternalLink, Heart
} from 'lucide-react';
import LiveEmergencyMap from '../components/LiveEmergencyMap';

export default function ResponderViewPage({
  activeAlert,
  alertsList = [],
  onSelectAlert,
  onAcknowledgeAlert,
  onResolveAlert,
  onSendChatMessage,
  socket
}) {
  const [selectedAlertId, setSelectedAlertId] = useState(activeAlert?.id || alertsList[0]?.id);
  const [chatInput, setChatInput] = useState('');
  const [responderName, setResponderName] = useState('Sarah Morgan (Guardian)');
  const [isResolving, setIsResolving] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');

  const currentAlert = alertsList.find(a => a.id === selectedAlertId) || activeAlert || alertsList[0];

  useEffect(() => {
    if (activeAlert) {
      setSelectedAlertId(activeAlert.id);
    }
  }, [activeAlert]);

  // Join WebSocket room for selected alert
  useEffect(() => {
    if (socket && currentAlert?.id) {
      socket.emit('join:alert', currentAlert.id);
      return () => {
        socket.emit('leave:alert', currentAlert.id);
      };
    }
  }, [socket, currentAlert?.id]);

  if (!currentAlert) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-800 text-slate-500 mx-auto flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">No Active Emergency Alerts</h2>
        <p className="text-xs text-slate-400">
          When an SOS is triggered, guardians and responders will see live real-time location streaming and evidence here.
        </p>
      </div>
    );
  }

  const handleAcknowledge = () => {
    onAcknowledgeAlert(currentAlert.id, responderName);
  };

  const handleResolveSubmit = (e) => {
    e.preventDefault();
    onResolveAlert(currentAlert.id, responderName, resolutionNotes);
    setIsResolving(false);
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    onSendChatMessage(currentAlert.id, responderName, chatInput);
    setChatInput('');
  };

  const openInGoogleMaps = () => {
    const lat = currentAlert.location?.lat || 37.7749;
    const lng = currentAlert.location?.lng || -122.4194;
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
  };

  const isResolved = currentAlert.status === 'resolved';
  const isAcknowledged = currentAlert.status === 'acknowledged';

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Alert Selector Bar (if multiple exist) */}
      {alertsList.length > 1 && (
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0">Switch Incident:</span>
          {alertsList.map(a => (
            <button
              key={a.id}
              onClick={() => setSelectedAlertId(a.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all border ${
                selectedAlertId === a.id
                  ? 'bg-red-600 text-white border-red-500 shadow'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <span>{a.userName}</span>
              <span className={`ml-2 px-1.5 py-0.2 rounded text-[10px] ${a.status === 'active' ? 'bg-red-950 text-red-300' : 'bg-slate-800 text-slate-400'}`}>
                {a.status.toUpperCase()}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Primary Header Card */}
      <div className={`p-6 rounded-3xl border shadow-xl relative overflow-hidden ${
        isResolved 
          ? 'bg-emerald-950/40 border-emerald-800/80' 
          : isAcknowledged 
          ? 'bg-amber-950/40 border-amber-800/80' 
          : 'bg-red-950/40 border-red-800/80 glow-sos'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
              isResolved ? 'bg-emerald-600' : isAcknowledged ? 'bg-amber-600' : 'bg-red-600 animate-pulse'
            }`}>
              <ShieldAlert className="w-8 h-8 text-white" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  isResolved ? 'bg-emerald-600 text-white' : isAcknowledged ? 'bg-amber-600 text-white' : 'bg-red-600 text-white'
                }`}>
                  {currentAlert.status === 'active' ? '🚨 CRITICAL EMERGENCY ACTIVE' : currentAlert.status.toUpperCase()}
                </span>
                <span className="text-xs bg-slate-900/80 text-slate-300 border border-slate-700 px-2.5 py-0.5 rounded-full font-mono">
                  {currentAlert.silent ? 'Silent SOS Dispatch' : 'Audible SOS Alert'}
                </span>
                <span className="text-xs text-slate-400">
                  Triggered {new Date(currentAlert.timestamp).toLocaleTimeString()}
                </span>
              </div>

              <h1 className="text-2xl font-black text-white mt-1.5">
                {currentAlert.userName} • <span className="text-red-400">{currentAlert.reason}</span>
              </h1>

              <p className="text-xs text-slate-300 mt-1 flex items-center space-x-3">
                <span>Phone: <b className="text-white font-mono">{currentAlert.userPhone}</b></span>
                <span>•</span>
                <span>Battery: <b className="text-white font-mono">{currentAlert.battery}%</b></span>
                <span>•</span>
                <span>GPS Accuracy: <b className="text-emerald-400 font-mono">±{currentAlert.location?.accuracy || 8}m</b></span>
              </p>
            </div>
          </div>

          {/* Quick Actions for Guardian / Responder */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={openInGoogleMaps}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold border border-slate-700 flex items-center space-x-1.5 shadow transition-all"
            >
              <Navigation className="w-4 h-4 text-emerald-400" />
              <span>Navigate in Maps</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </button>

            <a
              href={`tel:911`}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-lg transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>Call Emergency 911 / 112</span>
            </a>

            {!isResolved && (
              <>
                {!isAcknowledged && (
                  <button
                    onClick={handleAcknowledge}
                    className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-lg transition-all flex items-center space-x-1.5"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Acknowledge (I Am Responding)</span>
                  </button>
                )}

                <button
                  onClick={() => setIsResolving(true)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg transition-all flex items-center space-x-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Mark Resolved</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Custom note if user added one */}
        {currentAlert.customMessage && (
          <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-amber-200">
            <span className="font-semibold text-amber-400">Victim's Situational Note: </span>
            "{currentAlert.customMessage}"
          </div>
        )}
      </div>

      {/* Main Grid: Interactive Map + Situational Dossier & Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Map & Breadcrumbs */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                <h3 className="text-sm font-bold text-white">Live GPS Location & Breadcrumb Trail</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {currentAlert.breadcrumbs?.length || 1} Coordinates Logged
              </span>
            </div>

            <LiveEmergencyMap
              center={[currentAlert.location?.lat || 37.7749, currentAlert.location?.lng || -122.4194]}
              accuracy={currentAlert.location?.accuracy || 10}
              breadcrumbs={currentAlert.breadcrumbs || []}
              victimName={currentAlert.userName}
              status={currentAlert.status}
              height="400px"
            />

            <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
              <span className="truncate pr-2">
                Address: <b className="text-slate-200">{currentAlert.location?.address || 'Locating pin...'}</b>
              </span>
              <span className="font-mono shrink-0">
                Lat: {currentAlert.location?.lat?.toFixed(5)}, Lng: {currentAlert.location?.lng?.toFixed(5)}
              </span>
            </div>
          </div>

          {/* Ambient Evidence Locker (Audio & Snapshot) */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 shadow-xl">
            <div className="flex items-center space-x-2.5 mb-3">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Ambient Situation Evidence (Silent Capture)</h3>
                <p className="text-[11px] text-slate-400">Silently collected at moment of SOS trigger to preserve proof</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Audio playback */}
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                <span className="text-xs font-semibold text-slate-300 block mb-2 flex items-center space-x-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Ambient Microphone Snippet</span>
                </span>
                {currentAlert.evidence?.audio ? (
                  <audio controls src={currentAlert.evidence.audio} className="w-full h-8" />
                ) : (
                  <div className="text-xs text-slate-500 py-3 text-center">
                    Microphone recording encrypted or permission pending on victim device.
                  </div>
                )}
              </div>

              {/* Photo snapshot */}
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                <span className="text-xs font-semibold text-slate-300 block mb-2 flex items-center space-x-1.5">
                  <Image className="w-3.5 h-3.5 text-blue-400" />
                  <span>Camera Snapshot</span>
                </span>
                {currentAlert.evidence?.image ? (
                  <img
                    src={currentAlert.evidence.image}
                    alt="Silent Incident Evidence"
                    className="w-full h-32 object-cover rounded-xl border border-slate-800"
                  />
                ) : (
                  <div className="text-xs text-slate-500 py-3 text-center">
                    Visual camera snapshot encrypted or pending.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Responder Log & Incident Chat */}
        <div className="space-y-4">
          {/* Medical Dossier Quick Look */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 shadow-xl">
            <div className="flex items-center space-x-2 text-rose-400 mb-2">
              <Heart className="w-4 h-4" />
              <h4 className="text-xs font-bold uppercase tracking-wider">Victim Medical Dossier</h4>
            </div>
            <p className="text-xs text-slate-300">
              Blood Group: <b className="text-white font-mono">O+</b>
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Medical Notes: <span className="text-slate-300">Mild asthma (inhaler in backpack). Penicillin allergy.</span>
            </p>
          </div>

          {/* Live Responder Thread */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col h-[480px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white">Responder Coordination</h3>
              </div>
              <span className="text-[10px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded-full border border-blue-900">
                Live Channel
              </span>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto py-3 space-y-2.5 text-xs">
              {currentAlert.chatMessages?.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-2.5 rounded-xl border ${
                    msg.isSystem
                      ? 'bg-slate-950/80 border-slate-800 text-slate-300'
                      : 'bg-slate-800/60 border-slate-700/60 text-white'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span className="font-semibold text-blue-300">{msg.sender}</span>
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-xs leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendChat} className="pt-2 border-t border-slate-800 flex space-x-2">
              <input
                type="text"
                placeholder="Post update or dispatch status..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Resolve Incident Modal */}
      {isResolving && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Resolve Emergency Alert</h3>
            <p className="text-xs text-slate-400 mb-4">
              Confirm that the victim is in a safe location and assistance has completed.
            </p>

            <form onSubmit={handleResolveSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Resolver Name
                </label>
                <input
                  type="text"
                  required
                  value={responderName}
                  onChange={(e) => setResponderName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Resolution Notes
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Guardian met victim safely. Police escort arranged."
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsResolving(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-400 text-xs font-semibold hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow"
                >
                  Confirm Resolved
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
