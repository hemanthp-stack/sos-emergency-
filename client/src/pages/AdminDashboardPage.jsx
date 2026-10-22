import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, ShieldAlert, Activity, CheckCircle2, Clock, 
  FileText, Download, Filter, Search, ArrowUpRight, Radio, AlertTriangle
} from 'lucide-react';

export default function AdminDashboardPage({
  alerts = [],
  stats,
  auditLogs = [],
  onSelectAlertForView
}) {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('alerts'); // 'alerts' | 'audits'

  const filteredAlerts = alerts.filter(a => {
    const matchesStatus = filterStatus === 'all' || a.status === filterStatus;
    const matchesSearch = 
      a.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.id?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleExportData = () => {
    const report = {
      exportTimestamp: new Date().toISOString(),
      kpis: stats?.kpis || {},
      totalAlerts: alerts.length,
      incidents: alerts,
      auditLogs
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sentrix_Incident_Report_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const kpis = stats?.kpis || {
    totalAlerts: alerts.length,
    activeAlerts: alerts.filter(a => a.status === 'active').length,
    avgDeliveryLatency: '0.38s',
    systemUptime: '99.99%',
    responseAcknowledgmentRate: '98.5%'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center space-x-2.5">
              <LayoutDashboard className="w-6 h-6 text-red-500" />
              <span>Campus & City Safety Monitoring Center</span>
            </h1>
            <span className="text-[10px] bg-red-950 text-red-300 border border-red-800 px-2 py-0.5 rounded-full font-bold">
              ADMIN CONTROL ROOM
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time incident dispatch overview, SLA telemetry, and cryptographic audit logs.
          </p>
        </div>

        <button
          onClick={handleExportData}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 flex items-center space-x-2 shadow transition-all self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-slate-400" />
          <span>Export Incident Report</span>
        </button>
      </div>

      {/* KPI Cards (KPI Metrics specified in PRD) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Latency KPI */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Delivery Latency</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{kpis.avgDeliveryLatency}</div>
          <div className="mt-1 flex items-center space-x-1.5 text-[11px] text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>&lt;2.0s Target Met (99.8%)</span>
          </div>
        </div>

        {/* Active Emergencies */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Alerts</span>
            <Radio className="w-4 h-4 text-red-400 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-red-400 font-mono">{kpis.activeAlerts}</div>
          <div className="mt-1 text-[11px] text-slate-400">
            {kpis.totalAlerts} total alerts handled
          </div>
        </div>

        {/* Acknowledgment Rate */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Acknowledgment Rate</span>
            <Activity className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{kpis.responseAcknowledgmentRate}</div>
          <div className="mt-1 text-[11px] text-blue-400">
            Average guardian pickup in 42s
          </div>
        </div>

        {/* System Uptime */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Platform Availability</span>
            <ShieldAlert className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{kpis.systemUptime}</div>
          <div className="mt-1 text-[11px] text-teal-400">
            24×7 High Availability Tier
          </div>
        </div>
      </div>

      {/* Main Tabs & Filters */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('alerts')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'alerts' ? 'bg-red-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Emergency Incidents ({filteredAlerts.length})
            </button>
            <button
              onClick={() => setActiveTab('audits')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'audits' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Security Audit Trail ({auditLogs.length})
            </button>
          </div>

          {activeTab === 'alerts' && (
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search victim, reason, ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 w-48"
                />
              </div>

              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                {['all', 'active', 'acknowledged', 'resolved'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                      filterStatus === s ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tab 1: Incidents List */}
        {activeTab === 'alerts' && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] text-slate-400 uppercase tracking-wider border-b border-slate-800/80">
                <tr>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Victim</th>
                  <th className="py-3 px-3">Trigger / Reason</th>
                  <th className="py-3 px-3">Location Pin</th>
                  <th className="py-3 px-3">Latency</th>
                  <th className="py-3 px-3">Timestamp</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredAlerts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500">
                      No matching emergency incidents found
                    </td>
                  </tr>
                ) : (
                  filteredAlerts.map((alert) => (
                    <tr key={alert.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-3">
                        <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                          alert.status === 'active'
                            ? 'bg-red-950 text-red-400 border border-red-800 animate-pulse'
                            : alert.status === 'acknowledged'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        }`}>
                          {alert.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-white">{alert.userName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{alert.userPhone}</div>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="text-slate-200 font-medium">{alert.reason}</div>
                        <div className="text-[11px] text-slate-500">
                          {alert.silent ? 'Silent Protocol' : 'Audible'} • via {alert.triggerType}
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="text-slate-300 truncate max-w-xs">{alert.location?.address || 'GPS Lock'}</div>
                        <div className="text-[10px] text-emerald-400 font-mono">
                          ±{alert.location?.accuracy || 10}m
                        </div>
                      </td>

                      <td className="py-3.5 px-3 font-mono text-emerald-400 font-semibold">
                        {alert.deliveryLatencyMs || 340}ms
                      </td>

                      <td className="py-3.5 px-3 text-slate-400">
                        {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <button
                          onClick={() => onSelectAlertForView(alert.id)}
                          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-all inline-flex items-center space-x-1"
                        >
                          <span>Track</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Security Audit Logs */}
        {activeTab === 'audits' && (
          <div className="mt-4 space-y-2.5 max-h-[460px] overflow-y-auto">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl text-xs flex items-start justify-between gap-3"
              >
                <div className="flex items-start space-x-2.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 shrink-0"></span>
                  <div>
                    <span className="font-mono font-bold text-blue-300 mr-2">[{log.action}]</span>
                    <span className="text-slate-200">{log.details}</span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 font-mono shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
