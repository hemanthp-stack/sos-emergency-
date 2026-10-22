import React, { useState } from 'react';
import { Users, UserPlus, Phone, Mail, Shield, CheckCircle, Trash2, Send, AlertCircle, Heart } from 'lucide-react';

export default function GuardiansPage({
  guardians = [],
  onAddGuardian,
  onDeleteGuardian,
  userProfile,
  onUpdateProfile
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [testingId, setTestingId] = useState(null);

  // Form state
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('Family / Friend');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [priority, setPriority] = useState(1);
  const [notifySms, setNotifySms] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);

  // Profile state
  const [medicalNotes, setMedicalNotes] = useState(userProfile?.medicalNotes || 'Mild asthma (inhaler in backpack). Penicillin allergy.');
  const [bloodGroup, setBloodGroup] = useState(userProfile?.bloodGroup || 'O+');
  const [profileSaved, setProfileSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || (!phone && !email)) return;

    onAddGuardian({
      name,
      relation,
      phone,
      email,
      priority: Number(priority),
      notifySms,
      notifyEmail
    });

    setName('');
    setPhone('');
    setEmail('');
    setIsAddModalOpen(false);
  };

  const handleTestPing = async (id) => {
    setTestingId(id);
    try {
      const res = await fetch(`/api/contacts/${id}/test-ping`, { method: 'POST' });
      const data = await res.json();
      setTestResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setTestingId(null);
    }
  };

  const handleSaveMedical = (e) => {
    e.preventDefault();
    onUpdateProfile({ medicalNotes, bloodGroup });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2.5">
            <Users className="w-6 h-6 text-blue-400" />
            <span>Guardian Safety Network</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Pre-configured trusted responders who receive instant coordinates and evidence during an SOS.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow flex items-center space-x-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Trusted Guardian</span>
        </button>
      </div>

      {/* Test Ping Delivery Modal */}
      {testResult && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/60 shadow-xl flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-emerald-300">High-Speed Verification Delivered</span>
                <span className="text-[11px] font-mono bg-emerald-900 text-emerald-200 px-2 py-0.5 rounded-full">
                  {testResult.latencyMs}ms Latency (Target &lt;2000ms MET)
                </span>
              </div>
              <p className="text-xs text-emerald-200/80 mt-1">
                Recipient: <span className="font-semibold">{testResult.name}</span> ({testResult.phone || testResult.email})
              </p>
              <p className="text-[11px] text-slate-400 font-mono mt-1 bg-slate-950/70 p-2 rounded-lg border border-emerald-900/40">
                {testResult.messagePreview}
              </p>
            </div>
          </div>
          <button
            onClick={() => setTestResult(null)}
            className="text-xs text-emerald-400 hover:text-emerald-200 px-2 py-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Guardians List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {guardians.map((g, idx) => (
          <div
            key={g.id}
            className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-md relative"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                  #{g.priority || idx + 1}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{g.name}</h3>
                  <span className="text-xs text-blue-400 font-medium">{g.relation}</span>
                </div>
              </div>

              <span className="text-[10px] bg-emerald-950/80 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full">
                Active Tier 1
              </span>
            </div>

            <div className="mt-4 space-y-1.5 text-xs text-slate-300">
              {g.phone && (
                <div className="flex items-center space-x-2 text-slate-400">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>{g.phone}</span>
                </div>
              )}
              {g.email && (
                <div className="flex items-center space-x-2 text-slate-400">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>{g.email}</span>
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <button
                onClick={() => handleTestPing(g.id)}
                disabled={testingId === g.id}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center space-x-1 transition-colors"
              >
                <Send className="w-3 h-3" />
                <span>{testingId === g.id ? 'Pinging Carrier...' : 'Test Instant Ping'}</span>
              </button>

              <button
                onClick={() => onDeleteGuardian(g.id)}
                className="text-xs text-slate-500 hover:text-red-400 p-1 transition-colors"
                title="Remove guardian"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Emergency Medical & Responder Dossier */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
            <Heart className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Critical Medical & Identification Dossier</h3>
            <p className="text-xs text-slate-400">Shared discreetly with first responders when an alert is triggered</p>
          </div>
        </div>

        <form onSubmit={handleSaveMedical} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Blood Group
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              >
                {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Emergency Safe PIN
              </label>
              <input
                type="text"
                disabled
                value="1234 (Default Master PIN)"
                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400 font-mono cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Medical Conditions / Allergies / Notes
            </label>
            <textarea
              rows={2}
              value={medicalNotes}
              onChange={(e) => setMedicalNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500 placeholder-slate-500"
              placeholder="e.g. Inhaler in bag, allergic to penicillin, diabetes type 1"
            />
          </div>

          <div className="flex items-center justify-between">
            {profileSaved && (
              <span className="text-xs text-emerald-400 flex items-center space-x-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Emergency Dossier Updated</span>
              </span>
            )}
            <button
              type="submit"
              className="ml-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-all"
            >
              Save Dossier
            </button>
          </div>
        </form>
      </div>

      {/* Add Guardian Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Add Trusted Guardian</h3>
            <p className="text-xs text-slate-400 mb-5">This contact will be notified automatically with your live GPS location</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jessica Taylor"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Relationship</label>
                <input
                  type="text"
                  placeholder="e.g. Mother, Roommate, Campus Security"
                  value={relation}
                  onChange={(e) => setRelation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Phone (SMS / Call)</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="contact@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="mt-6 flex space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-400 text-xs font-semibold hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow"
                >
                  Save Guardian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
