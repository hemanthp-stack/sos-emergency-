import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import Navbar from './components/Navbar';
import SentrixHomePage from './pages/SentrixHomePage';
import EmergencyTriggerPage from './pages/EmergencyTriggerPage';
import GuardiansPage from './pages/GuardiansPage';
import ResponderViewPage from './pages/ResponderViewPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import DocumentationPage from './pages/DocumentationPage';
import StealthCalculator from './components/StealthCalculator';
import StealthNotes from './components/StealthNotes';
import FakeCallModal from './components/FakeCallModal';
import SafeWalkModal from './components/SafeWalkModal';
import { getCurrentCoordinates, watchCoordinates, getBatteryLevel } from './utils/geolocation';
import { getInitialTheme, applyTheme } from './utils/theme';
import { Wifi, Battery } from 'lucide-react';

const SOCKET_URL = window.location.hostname === 'localhost' ? 'http://localhost:5001' : '/';
const socket = io(SOCKET_URL, {
  transports: ['websocket', 'polling']
});

export default function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'trigger' | 'guardians' | 'responder' | 'admin' | 'docs'
  const [theme, setTheme] = useState(getInitialTheme());
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isFakeCallOpen, setIsFakeCallOpen] = useState(false);
  const [isSafeWalkOpen, setIsSafeWalkOpen] = useState(false);
  const [isMockupMode, setIsMockupMode] = useState(false);

  const [activeAlert, setActiveAlert] = useState(null);
  const [alertsList, setAlertsList] = useState([]);
  const [guardians, setGuardians] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);

  const [currentLocation, setCurrentLocation] = useState({
    lat: 37.7749,
    lng: -122.4194,
    accuracy: 8,
    address: 'Civic Center Plaza, San Francisco, CA'
  });
  const [batteryLevel, setBatteryLevel] = useState(86);
  const [gpsStatus, setGpsStatus] = useState('locked');

  const activeAlertRef = useRef(activeAlert);
  activeAlertRef.current = activeAlert;

  // Handle Theme Application & System Listener
  useEffect(() => {
    applyTheme(theme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      const currentStored = localStorage.getItem('bsafe_theme');
      if (!currentStored || currentStored === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [theme]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  // Initial Data Fetch
  useEffect(() => {
    fetchInitialData();
    initTelemetry();

    // Socket.io listeners
    socket.on('connect', () => {
      console.log('Connected to bSafe Real-Time Stream');
      socket.emit('join:admin');
    });

    socket.on('alert:new', (newAlert) => {
      setAlertsList(prev => [newAlert, ...prev.filter(a => a.id !== newAlert.id)]);
      fetchStats();
    });

    socket.on('alert:updated', (updated) => {
      setAlertsList(prev => prev.map(a => a.id === updated.id ? updated : a));
      if (activeAlertRef.current?.id === updated.id) {
        if (updated.status === 'resolved') {
          setActiveAlert(null);
        } else {
          setActiveAlert(updated);
        }
      }
      fetchStats();
    });

    socket.on('alert:location', ({ alertId, location, battery, newCoord }) => {
      setAlertsList(prev => prev.map(a => {
        if (a.id === alertId) {
          const breadcrumbs = [...(a.breadcrumbs || []), newCoord];
          return { ...a, location, battery, breadcrumbs };
        }
        return a;
      }));

      if (activeAlertRef.current?.id === alertId) {
        setActiveAlert(prev => {
          if (!prev) return null;
          return {
            ...prev,
            location,
            battery,
            breadcrumbs: [...(prev.breadcrumbs || []), newCoord]
          };
        });
      }
    });

    socket.on('alert:evidence', ({ alertId, evidence }) => {
      setAlertsList(prev => prev.map(a => a.id === alertId ? { ...a, evidence } : a));
      if (activeAlertRef.current?.id === alertId) {
        setActiveAlert(prev => prev ? { ...prev, evidence } : null);
      }
    });

    socket.on('audit:new', (newAudit) => {
      setAuditLogs(prev => [newAudit, ...prev]);
    });

    return () => {
      socket.off('alert:new');
      socket.off('alert:updated');
      socket.off('alert:location');
      socket.off('alert:evidence');
      socket.off('audit:new');
    };
  }, []);

  const fetchInitialData = async () => {
    try {
      const [uRes, cRes, aRes, sRes] = await Promise.all([
        fetch('/api/user').then(r => r.json()),
        fetch('/api/contacts').then(r => r.json()),
        fetch('/api/alerts').then(r => r.json()),
        fetch('/api/stats').then(r => r.json())
      ]);

      setUserProfile(uRes);
      setGuardians(cRes);
      setAlertsList(aRes);
      setStats(sRes);
      if (sRes.recentAudits) setAuditLogs(sRes.recentAudits);

      const currentActive = aRes.find(a => a.status === 'active' || a.status === 'acknowledged');
      if (currentActive) {
        setActiveAlert(currentActive);
      }
    } catch (err) {
      console.warn('API fetch warning:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const s = await fetch('/api/stats').then(r => r.json());
      setStats(s);
      if (s.recentAudits) setAuditLogs(s.recentAudits);
    } catch (e) {}
  };

  const initTelemetry = async () => {
    try {
      const b = await getBatteryLevel();
      setBatteryLevel(b);

      const coords = await getCurrentCoordinates();
      setCurrentLocation(coords);
      setGpsStatus('locked');

      watchCoordinates((updatedCoords) => {
        setCurrentLocation(updatedCoords);
        setGpsStatus('locked');

        if (activeAlertRef.current) {
          broadcastLocationUpdate(activeAlertRef.current.id, updatedCoords);
        }
      });
    } catch (e) {
      setGpsStatus('locked');
    }
  };

  const broadcastLocationUpdate = async (alertId, coords) => {
    try {
      await fetch(`/api/alerts/${alertId}/location`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lat: coords.lat,
          lng: coords.lng,
          accuracy: coords.accuracy,
          address: coords.address,
          battery: batteryLevel
        })
      });
    } catch (e) {}
  };

  // Trigger SOS Alert
  const handleTriggerSOS = async (alertParams) => {
    try {
      const payload = {
        silent: alertParams.silent !== false,
        triggerType: alertParams.triggerType || 'button',
        reason: alertParams.reason || 'General Threat',
        customMessage: alertParams.customMessage || '',
        location: currentLocation,
        battery: batteryLevel,
        evidence: alertParams.evidence || null
      };

      const res = await fetch('/api/alerts/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const newAlert = await res.json();
      setActiveAlert(newAlert);
      setAlertsList(prev => [newAlert, ...prev]);
      setCurrentView('trigger');
      fetchStats();
    } catch (err) {
      console.error('Trigger SOS error:', err);
    }
  };

  // Resolve SOS Alert
  const handleResolveSOS = async (pin, notes) => {
    if (!activeAlert) return;
    try {
      const res = await fetch(`/api/alerts/${activeAlert.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'resolved',
          responderName: 'User Disarm',
          responderNotes: notes || 'User verified safe.'
        })
      });
      const updated = await res.json();
      setActiveAlert(null);
      setAlertsList(prev => prev.map(a => a.id === updated.id ? updated : a));
      fetchStats();
    } catch (e) {
      console.error(e);
    }
  };

  // Guardians CRUD
  const handleAddGuardian = async (guardianData) => {
    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(guardianData)
      });
      const newContact = await res.json();
      setGuardians(prev => [...prev, newContact]);
      fetchStats();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteGuardian = async (id) => {
    try {
      await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
      setGuardians(prev => prev.filter(c => c.id !== id));
      fetchStats();
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateProfile = async (profileData) => {
    try {
      const res = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });
      const updated = await res.json();
      setUserProfile(updated);
    } catch (e) {
      console.error(e);
    }
  };

  // Responder actions
  const handleAcknowledgeAlert = async (alertId, responderName) => {
    try {
      const res = await fetch(`/api/alerts/${alertId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'acknowledged',
          responderName
        })
      });
      const updated = await res.json();
      setAlertsList(prev => prev.map(a => a.id === updated.id ? updated : a));
    } catch (e) {
      console.error(e);
    }
  };

  const handleResolveAlert = async (alertId, responderName, notes) => {
    try {
      const res = await fetch(`/api/alerts/${alertId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'resolved',
          responderName,
          responderNotes: notes
        })
      });
      const updated = await res.json();
      setAlertsList(prev => prev.map(a => a.id === updated.id ? updated : a));
      if (activeAlert?.id === alertId) {
        setActiveAlert(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendChatMessage = async (alertId, sender, text) => {
    try {
      await fetch(`/api/alerts/${alertId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender, text })
      });
    } catch (e) {
      console.error(e);
    }
  };

  // View Router
  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return (
          <SentrixHomePage
            onLaunchSOS={() => setCurrentView('trigger')}
            onOpenFakeCall={() => setIsFakeCallOpen(true)}
            onOpenSafeWalk={() => setIsSafeWalkOpen(true)}
            onOpenStealth={() => setIsCalculatorOpen(true)}
            onViewResponder={() => setCurrentView('responder')}
            onViewAdmin={() => setCurrentView('admin')}
            onViewDocs={() => setCurrentView('docs')}
            currentLocation={currentLocation}
            activeAlert={activeAlert}
            guardians={guardians}
          />
        );
      case 'trigger':
        return (
          <EmergencyTriggerPage
            activeAlert={activeAlert}
            onTriggerSOS={handleTriggerSOS}
            onResolveSOS={handleResolveSOS}
            onOpenFakeCall={() => setIsFakeCallOpen(true)}
            onOpenSafeWalk={() => setIsSafeWalkOpen(true)}
            onOpenCalculator={() => setIsCalculatorOpen(true)}
            onOpenNotes={() => setIsNotesOpen(true)}
            onViewResponder={() => setCurrentView('responder')}
            currentLocation={currentLocation}
            batteryLevel={batteryLevel}
            guardians={guardians}
          />
        );
      case 'guardians':
        return (
          <GuardiansPage
            guardians={guardians}
            onAddGuardian={handleAddGuardian}
            onDeleteGuardian={handleDeleteGuardian}
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
          />
        );
      case 'responder':
        return (
          <ResponderViewPage
            activeAlert={activeAlert}
            alertsList={alertsList}
            onSelectAlert={() => {}}
            onAcknowledgeAlert={handleAcknowledgeAlert}
            onResolveAlert={handleResolveAlert}
            onSendChatMessage={handleSendChatMessage}
            socket={socket}
          />
        );
      case 'admin':
        return (
          <AdminDashboardPage
            alerts={alertsList}
            stats={stats}
            auditLogs={auditLogs}
            onSelectAlertForView={() => setCurrentView('responder')}
          />
        );
      case 'docs':
        return <DocumentationPage />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors selection:bg-blue-600 selection:text-white">
      {/* bSafe Responsive Top Navbar */}
      <Navbar
        currentView={currentView}
        onViewChange={setCurrentView}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenNotes={() => setIsNotesOpen(true)}
        onOpenFakeCall={() => setIsFakeCallOpen(true)}
        onOpenSafeWalk={() => setIsSafeWalkOpen(true)}
        theme={theme}
        onThemeChange={handleThemeChange}
        isMockupMode={isMockupMode}
        onToggleMockupMode={() => setIsMockupMode(!isMockupMode)}
        activeAlert={activeAlert}
        guardianCount={guardians.length}
        batteryLevel={batteryLevel}
        gpsStatus={gpsStatus}
      />

      {/* Main View Area (with bottom padding for mobile dock) */}
      <main className="flex-1 pb-24 lg:pb-12">
        {isMockupMode ? (
          <div className="py-6 flex flex-col items-center justify-center px-4">
            <div className="text-center mb-3">
              <span className="text-xs font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full uppercase tracking-wider">
                📱 iPhone 16 Pro Mobile Simulator
              </span>
            </div>

            <div className="w-full max-w-[395px] min-h-[800px] rounded-[48px] border-[10px] border-slate-300 dark:border-slate-800 bg-white dark:bg-[#0A0F1D] shadow-2xl relative overflow-hidden">
              {/* Dynamic Island */}
              <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-50 flex items-center justify-between px-3">
                <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-800"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
              </div>

              {/* Status bar */}
              <div className="pt-4 px-6 pb-2 flex justify-between items-center text-[10px] text-slate-500 font-mono">
                <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <div className="flex items-center space-x-1.5">
                  <Wifi className="w-3 h-3" />
                  <Battery className="w-3 h-3" />
                </div>
              </div>

              {/* Scrollable interior */}
              <div className="max-h-[720px] overflow-y-auto">
                {renderCurrentView()}
              </div>
            </div>
          </div>
        ) : (
          renderCurrentView()
        )}
      </main>

      {/* Camouflage Disguise 1: Calculator */}
      {isCalculatorOpen && (
        <StealthCalculator
          onTriggerSilentSOS={handleTriggerSOS}
          onExitStealth={() => setIsCalculatorOpen(false)}
        />
      )}

      {/* Camouflage Disguise 2: Notes */}
      {isNotesOpen && (
        <StealthNotes
          onTriggerSilentSOS={handleTriggerSOS}
          onExitStealth={() => setIsNotesOpen(false)}
        />
      )}

      {/* Fake Call Generator Modal */}
      <FakeCallModal
        isOpen={isFakeCallOpen}
        onClose={() => setIsFakeCallOpen(false)}
      />

      {/* Safe Walk / Follow Me Modal */}
      <SafeWalkModal
        isOpen={isSafeWalkOpen}
        onClose={() => setIsSafeWalkOpen(false)}
        onEscalateToSOS={handleTriggerSOS}
      />

      {/* Sentrix Global Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-10 px-4 lg:px-8 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-left">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-[#1E1B4B] flex items-center justify-center text-white font-black text-xs">
                S
              </div>
              <span className="font-bold text-sm text-slate-900 dark:text-white">Sentrix</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
              Sentrix is a world leading safety technology platform dedicated to protecting lives through proactive non-verbal emergency response.
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">Features</h4>
            <ul className="space-y-1 text-slate-500 dark:text-slate-400">
              <li><button onClick={() => setCurrentView('trigger')} className="hover:text-indigo-600">Silent SOS Trigger</button></li>
              <li><button onClick={() => setIsSafeWalkOpen(true)} className="hover:text-indigo-600">Follow Me with Timer</button></li>
              <li><button onClick={() => setIsFakeCallOpen(true)} className="hover:text-indigo-600">Fake Call Escape</button></li>
              <li><button onClick={() => setCurrentView('responder')} className="hover:text-indigo-600">Live GPS Streaming</button></li>
            </ul>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">Solutions</h4>
            <ul className="space-y-1 text-slate-500 dark:text-slate-400">
              <li><button onClick={() => setCurrentView('admin')} className="hover:text-indigo-600">Campus & University Safety</button></li>
              <li><button onClick={() => setCurrentView('admin')} className="hover:text-indigo-600">Enterprise Duty of Care</button></li>
              <li><button onClick={() => setCurrentView('docs')} className="hover:text-indigo-600">PRD Specifications</button></li>
            </ul>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">Emergency Hotlines</h4>
            <div className="flex flex-wrap gap-1.5 text-[11px] font-mono pt-1">
              <span className="bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">USA: 911</span>
              <span className="bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">EU/India: 112</span>
              <span className="bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">UK: 999</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400">
          <div>
            © {new Date().getFullYear()} Sentrix Safety Technologies. All rights reserved.
          </div>
          <div className="flex items-center space-x-3 mt-2 sm:mt-0">
            <button onClick={() => setCurrentView('docs')} className="hover:underline">Privacy Policy</button>
            <span>•</span>
            <button onClick={() => setCurrentView('docs')} className="hover:underline">Terms of Service</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
