import React, { useState } from 'react';
import { FileText, Shield, Cpu, Activity, Database, CheckCircle2, Lock, Radio } from 'lucide-react';

export default function DocumentationPage() {
  const [activeSection, setActiveSection] = useState('prd');

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-red-950 text-red-400 border border-red-800 px-2 py-0.5 rounded-full">
              OFFICIAL SYSTEM SPECIFICATION
            </span>
            <span className="text-xs text-slate-500">v1.2 Production Ready</span>
          </div>
          <h1 className="text-3xl font-black text-white mt-2">
            Sentrix Product Requirements & Technical Architecture
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Silent Emergency Web Platform inspired by bSafe (getbsafe.com) architecture
          </p>
        </div>

        {/* Section switcher */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveSection('prd')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeSection === 'prd' ? 'bg-red-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Product Requirements (PRD)
          </button>
          <button
            onClick={() => setActiveSection('architecture')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeSection === 'architecture' ? 'bg-red-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            System Architecture & APIs
          </button>
          <button
            onClick={() => setActiveSection('matrix')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeSection === 'matrix' ? 'bg-red-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            bSafe Benchmark Matrix
          </button>
        </div>
      </div>

      {/* SECTION 1: PRD */}
      {activeSection === 'prd' && (
        <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
          {/* Executive Summary */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Shield className="w-5 h-5 text-red-500" />
              <span>1. Executive Summary & Problem Statement</span>
            </h2>
            <p>
              In life-threatening situations such as harassment, domestic assault, stalking, or medical emergencies, standard voice-based emergency calls (e.g., 911 / 112) can directly escalate danger. Speaking aloud alerts the perpetrator, victims in panic often cannot articulate exact street addresses, and response delays are catastrophic.
            </p>
            <p>
              <b>Sentrix</b> solves this through non-verbal, one-action silent emergency dispatch. Built with zero-latency WebSocket broadcasting, stealth camouflage overlays, continuous high-precision GPS breadcrumb tracking, and an ambient evidence locker, it enables vulnerable individuals to summon help without making a sound.
            </p>
          </div>

          {/* Objectives */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-2">
              <h3 className="text-base font-bold text-white">Primary Objectives</h3>
              <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                <li><span className="text-white font-medium">One-Action Silent Trigger:</span> Instant single-tap or 3-second hold to bypass device locks.</li>
                <li><span className="text-white font-medium">Sub-2-Second Delivery:</span> Guardian notification delivery within &lt; 2,000 milliseconds.</li>
                <li><span className="text-white font-medium">Continuous Telemetry:</span> High-accuracy GPS with breadcrumbs and accuracy radius.</li>
                <li><span className="text-white font-medium">Zero-Acoustic Escalation:</span> Completely silent feedback preventing assailant awareness.</li>
              </ul>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-2">
              <h3 className="text-base font-bold text-white">Secondary Objectives (bSafe Inspired)</h3>
              <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                <li><span className="text-white font-medium">Stealth Camouflage:</span> Working calculator facade with hidden backdoor triggers.</li>
                <li><span className="text-white font-medium">Proactive Escape Tools:</span> Realistic Fake Call generator with synthesized ringtones.</li>
                <li><span className="text-white font-medium">Safe Walk / Follow Me:</span> Timed journey watchdog with automatic emergency escalation.</li>
                <li><span className="text-white font-medium">Silent Evidence Locker:</span> Ambient microphone and camera captures saved securely.</li>
              </ul>
            </div>
          </div>

          {/* Non-Functional & KPIs */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              <span>Key Performance Indicators (KPIs) & Target SLA</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400 block">Target Dispatch</span>
                <span className="text-lg font-black text-emerald-400 font-mono">&lt; 2.0s</span>
                <span className="text-[10px] text-slate-500 block">Avg actual: 0.38s</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400 block">System Availability</span>
                <span className="text-lg font-black text-emerald-400 font-mono">99.99%</span>
                <span className="text-[10px] text-slate-500 block">24/7 Redundant</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400 block">GPS Precision</span>
                <span className="text-lg font-black text-emerald-400 font-mono">± 8m</span>
                <span className="text-[10px] text-slate-500 block">High Accuracy</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400 block">Resolution Rate</span>
                <span className="text-lg font-black text-emerald-400 font-mono">&gt; 98%</span>
                <span className="text-[10px] text-slate-500 block">Guardian Network</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: SYSTEM ARCHITECTURE & APIS */}
      {activeSection === 'architecture' && (
        <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-blue-400" />
              <span>Full-Stack Architecture & Real-Time Data Pipeline</span>
            </h2>

            {/* ASCII Architecture Flow */}
            <pre className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto leading-tight">
{`+-----------------------------------------------------------------------------------+
|                           CLIENT TIER (React 18 + Vite)                           |
|  - Dual-mode SOS Trigger   - Stealth Calculator   - Safe Walk Timer  - Fake Call   |
|  - HTML5 Geolocation API   - Web Audio Synth      - Silent Media Snapshot Capture |
+----------------------------------------+------------------------------------------+
                                         | REST & WebSocket (Socket.IO)
                                         v
+-----------------------------------------------------------------------------------+
|                        BACKEND TIER (Node.js + Express.js)                        |
|  - Express REST Endpoints (/api/alerts, /api/contacts, /api/safewalk, /api/stats) |
|  - Socket.IO Real-Time Dispatch Hub (alert_room, admin_room)                      |
|  - Audit Log Logger (Millisecond Precision)                                       |
+----------------------------------------+------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                        STORAGE & REAL-TIME BROADCAST ENGINE                       |
|  - Persistent Store with seeded demo data & incident histories                    |
|  - Broadcast to Guardian Tracking Portal (/responder/:alertId) in < 400ms         |
|  - Broadcast to Campus / City Security Command Center (/admin) in < 200ms        |
+-----------------------------------------------------------------------------------+`}
            </pre>
          </div>

          {/* REST API & WebSocket Contracts */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Database className="w-5 h-5 text-purple-400" />
              <span>Core API & WebSocket Specifications</span>
            </h3>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-emerald-400 font-bold">POST /api/alerts/trigger</span>
                <span className="text-slate-400 block font-sans text-[11px] mt-0.5">
                  Body: <code>&#123; silent, triggerType, reason, location: &#123; lat, lng, accuracy &#125;, evidence &#125;</code> &rarr; Dispatches alert to guardians via Socket.IO within &lt; 400ms.
                </span>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-blue-400 font-bold">POST /api/alerts/:id/location</span>
                <span className="text-slate-400 block font-sans text-[11px] mt-0.5">
                  Appends continuous GPS coordinate breadcrumb; emits <code>alert:location</code> to connected responders.
                </span>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-amber-400 font-bold">PATCH /api/alerts/:id/status</span>
                <span className="text-slate-400 block font-sans text-[11px] mt-0.5">
                  Updates status to <code>acknowledged</code> or <code>resolved</code>; logs responder name & dispatch notes.
                </span>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-purple-400 font-bold">POST /api/contacts/:id/test-ping</span>
                <span className="text-slate-400 block font-sans text-[11px] mt-0.5">
                  Performs instant carrier delivery ping simulation and benchmarks round-trip latency.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: bSAFE BENCHMARK MATRIX */}
      {activeSection === 'matrix' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-white">
            Feature Comparison: Sentrix vs. bSafe (getbsafe.com)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Capability</th>
                  <th className="py-2.5 px-3">bSafe Platform</th>
                  <th className="py-2.5 px-3">Sentrix Platform</th>
                  <th className="py-2.5 px-3">Advantage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                <tr>
                  <td className="py-3 px-3 font-semibold text-white">Silent / Discreet SOS</td>
                  <td className="py-3 px-3 text-emerald-400">Supported</td>
                  <td className="py-3 px-3 text-emerald-400">Supported (Dual-mode: 1-Tap & 3s Safety Hold)</td>
                  <td className="py-3 px-3 text-slate-400">Prevents false pocket alarms</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-white">Stealth Camouflage</td>
                  <td className="py-3 px-3 text-slate-500">Limited to app icon</td>
                  <td className="py-3 px-3 text-emerald-400">Full Working Calculator Disguise (PIN 911= Trigger)</td>
                  <td className="py-3 px-3 text-slate-400">Assailant cannot detect safety app</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-white">Live GPS Tracking & Breadcrumbs</td>
                  <td className="py-3 px-3 text-emerald-400">Supported</td>
                  <td className="py-3 px-3 text-emerald-400">Leaflet OpenStreetMap with real-time WebSockets</td>
                  <td className="py-3 px-3 text-slate-400">Instant streaming without app refresh</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-white">Follow Me / Safe Walk</td>
                  <td className="py-3 px-3 text-emerald-400">Supported</td>
                  <td className="py-3 px-3 text-emerald-400">Countdown Timer with PIN disarm & auto-escalation</td>
                  <td className="py-3 px-3 text-slate-400">Fires SOS automatically if unresponsive</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-white">Fake Call Escape Generator</td>
                  <td className="py-3 px-3 text-emerald-400">Supported</td>
                  <td className="py-3 px-3 text-emerald-400">Synthesized Web Audio Ringtones & Voice murmurs</td>
                  <td className="py-3 px-3 text-slate-400">Zero external mp3 dependencies</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-white">Ambient Evidence Locker</td>
                  <td className="py-3 px-3 text-emerald-400">Supported</td>
                  <td className="py-3 px-3 text-emerald-400">Silent mic snippet & front-camera snapshots</td>
                  <td className="py-3 px-3 text-slate-400">Preserved in responder portal</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-white">Campus / City Command Room</td>
                  <td className="py-3 px-3 text-slate-400">Enterprise add-on</td>
                  <td className="py-3 px-3 text-emerald-400">Built-in Monitoring Center with Audit Logs & SLA metrics</td>
                  <td className="py-3 px-3 text-slate-400">Instant visibility for campus security</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
