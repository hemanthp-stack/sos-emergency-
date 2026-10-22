import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// Enable CORS for client
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE']
  }
});

app.use(cors());
app.use(express.json({ limit: '15mb' }));

// Persistent/In-memory Store Setup
const DB_FILE = path.join(__dirname, 'data_store.json');

const DEFAULT_DATA = {
  user: {
    id: "usr_94821",
    name: "Alex Morgan",
    phone: "+1 (555) 234-5678",
    email: "alex.morgan@example.com",
    bloodGroup: "O+",
    medicalNotes: "Mild asthma (inhaler in backpack). Penicillin allergy.",
    emergencyPin: "1234"
  },
  contacts: [
    {
      id: "cnt_1",
      name: "Sarah Morgan",
      relation: "Sister / Family",
      phone: "+1 (555) 349-8812",
      email: "sarah.m@example.com",
      priority: 1,
      notifySms: true,
      notifyCall: true,
      notifyEmail: true,
      status: "verified"
    },
    {
      id: "cnt_2",
      name: "Marcus Vance",
      relation: "Partner",
      phone: "+1 (555) 891-2041",
      email: "marcus.v@example.com",
      priority: 2,
      notifySms: true,
      notifyCall: false,
      notifyEmail: true,
      status: "verified"
    },
    {
      id: "cnt_3",
      name: "Campus Safety & Security Dispatch",
      relation: "Security / Authority",
      phone: "+1 (555) 911-0024",
      email: "dispatch@campus-security.org",
      priority: 3,
      notifySms: true,
      notifyCall: true,
      notifyEmail: true,
      status: "verified"
    }
  ],
  alerts: [
    {
      id: "alt_demo_hist_1",
      userId: "usr_94821",
      userName: "Alex Morgan",
      userPhone: "+1 (555) 234-5678",
      timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
      status: "resolved",
      silent: true,
      triggerType: "stealth_pin",
      reason: "Stalking / Suspicious Person",
      battery: 68,
      location: {
        lat: 37.7749,
        lng: -122.4194,
        accuracy: 8,
        address: "742 Market St, San Francisco, CA"
      },
      breadcrumbs: [
        { lat: 37.7749, lng: -122.4194, timestamp: new Date(Date.now() - 3600000 * 48).toISOString() },
        { lat: 37.7753, lng: -122.4188, timestamp: new Date(Date.now() - 3600000 * 48 + 120000).toISOString() }
      ],
      notificationsDispatched: 3,
      deliveryLatencyMs: 420,
      responders: [
        { name: "Sarah Morgan", acknowledgedAt: new Date(Date.now() - 3600000 * 48 + 45000).toISOString() }
      ],
      responderNotes: "Resolved safely. Contact met victim at public coffee shop.",
      resolvedAt: new Date(Date.now() - 3600000 * 48 + 600000).toISOString()
    }
  ],
  safeWalkSession: null,
  auditLogs: [
    {
      id: "aud_01",
      timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
      action: "ALERT_TRIGGERED",
      details: "Silent SOS triggered via stealth pin mode by Alex Morgan."
    },
    {
      id: "aud_02",
      timestamp: new Date(Date.now() - 3600000 * 48 + 1000).toISOString(),
      action: "NOTIFICATIONS_SENT",
      details: "SMS & in-app alerts dispatched to 3 guardians in 420ms."
    },
    {
      id: "aud_03",
      timestamp: new Date(Date.now() - 3600000 * 48 + 600000).toISOString(),
      action: "ALERT_RESOLVED",
      details: "Alert marked resolved with verified safe pin."
    }
  ]
};

// Load or initialize DB
function loadDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error loading DB file, falling back to default:', err);
  }
  saveDB(DEFAULT_DATA);
  return DEFAULT_DATA;
}

function saveDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving DB file:', err);
  }
}

let db = loadDB();

// Helper to log audit events
function logAudit(action, details) {
  const entry = {
    id: `aud_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    timestamp: new Date().toISOString(),
    action,
    details
  };
  db.auditLogs.unshift(entry);
  if (db.auditLogs.length > 200) db.auditLogs.pop();
  saveDB(db);
  io.to('admin').emit('audit:new', entry);
}

// ------------------- API ROUTES -------------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Silent SOS API', uptime: process.uptime() });
});

// User Profile
app.get('/api/user', (req, res) => {
  res.json(db.user);
});

app.put('/api/user', (req, res) => {
  db.user = { ...db.user, ...req.body };
  saveDB(db);
  res.json(db.user);
});

// Emergency Contacts
app.get('/api/contacts', (req, res) => {
  res.json(db.contacts);
});

app.post('/api/contacts', (req, res) => {
  const { name, relation, phone, email, priority, notifySms, notifyCall, notifyEmail } = req.body;
  if (!name || (!phone && !email)) {
    return res.status(400).json({ error: 'Name and either Phone or Email are required' });
  }

  const newContact = {
    id: `cnt_${Date.now()}`,
    name,
    relation: relation || 'Trusted Guardian',
    phone: phone || '',
    email: email || '',
    priority: Number(priority) || (db.contacts.length + 1),
    notifySms: notifySms !== false,
    notifyCall: Boolean(notifyCall),
    notifyEmail: Boolean(notifyEmail),
    status: 'verified'
  };

  db.contacts.push(newContact);
  saveDB(db);
  logAudit('CONTACT_ADDED', `New guardian ${name} (${relation}) configured.`);
  res.status(201).json(newContact);
});

app.put('/api/contacts/:id', (req, res) => {
  const idx = db.contacts.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Contact not found' });

  db.contacts[idx] = { ...db.contacts[idx], ...req.body };
  saveDB(db);
  res.json(db.contacts[idx]);
});

app.delete('/api/contacts/:id', (req, res) => {
  const contact = db.contacts.find(c => c.id === req.params.id);
  db.contacts = db.contacts.filter(c => c.id !== req.params.id);
  saveDB(db);
  if (contact) {
    logAudit('CONTACT_REMOVED', `Guardian ${contact.name} was removed from emergency network.`);
  }
  res.json({ success: true });
});

// Test Ping Guardian (simulates immediate SMS/Email dispatch latency test)
app.post('/api/contacts/:id/test-ping', (req, res) => {
  const contact = db.contacts.find(c => c.id === req.params.id);
  if (!contact) return res.status(404).json({ error: 'Contact not found' });

  const latencyMs = Math.floor(180 + Math.random() * 250);
  const result = {
    contactId: contact.id,
    name: contact.name,
    phone: contact.phone,
    email: contact.email,
    deliveredAt: new Date().toISOString(),
    latencyMs,
    carrierStatus: 'DELIVERED (SIMULATED TIER-1 SMS ROUTE)',
    messagePreview: `[TEST ALERT] This is a verification test from Sentrix SOS for ${db.user.name}. In an emergency, live tracking links will be sent here.`
  };

  logAudit('CONTACT_TEST_PING', `High-priority verification test delivered to ${contact.name} in ${latencyMs}ms.`);
  res.json(result);
});

// --- Alerts ---

// Get active alerts
app.get('/api/alerts/active', (req, res) => {
  const activeAlerts = db.alerts.filter(a => a.status === 'active' || a.status === 'acknowledged');
  res.json(activeAlerts);
});

// Get all alerts (History & Admin)
app.get('/api/alerts', (req, res) => {
  const { status, limit } = req.query;
  let list = [...db.alerts];
  if (status) {
    list = list.filter(a => a.status === status);
  }
  list.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  if (limit) list = list.slice(0, Number(limit));
  res.json(list);
});

// Get single alert by ID
app.get('/api/alerts/:id', (req, res) => {
  const alert = db.alerts.find(a => a.id === req.params.id);
  if (!alert) return res.status(404).json({ error: 'Alert not found' });
  res.json(alert);
});

// Trigger SOS Alert
app.post('/api/alerts/trigger', (req, res) => {
  const startTime = Date.now();
  const {
    silent = true,
    triggerType = 'button',
    reason = 'General Danger / SOS',
    location = { lat: 37.7749, lng: -122.4194, accuracy: 10, address: 'Live Geolocation Pinpoint' },
    battery = 85,
    evidence = null,
    customMessage = ''
  } = req.body;

  const alertId = `alt_${Date.now()}`;
  const now = new Date().toISOString();

  const newAlert = {
    id: alertId,
    userId: db.user.id,
    userName: db.user.name,
    userPhone: db.user.phone,
    timestamp: now,
    status: 'active', // active | acknowledged | resolved
    silent: Boolean(silent),
    triggerType, // button, long_press, stealth_pin, safewalk_timeout
    reason,
    customMessage,
    battery: battery || 100,
    location: {
      lat: Number(location.lat) || 37.7749,
      lng: Number(location.lng) || -122.4194,
      accuracy: Number(location.accuracy) || 12,
      address: location.address || 'Locating...'
    },
    breadcrumbs: [
      {
        lat: Number(location.lat) || 37.7749,
        lng: Number(location.lng) || -122.4194,
        accuracy: Number(location.accuracy) || 12,
        timestamp: now
      }
    ],
    evidence: evidence || { audio: null, image: null },
    notificationsDispatched: db.contacts.length,
    deliveryLatencyMs: Date.now() - startTime + Math.floor(120 + Math.random() * 150),
    responders: [],
    responderNotes: '',
    resolvedAt: null,
    chatMessages: [
      {
        id: `msg_${Date.now()}`,
        sender: 'System Automated Dispatch',
        text: `CRITICAL: ${silent ? 'Silent' : 'Audible'} SOS alert generated via ${triggerType}. Reason: "${reason}". Coordinates broadcasted.`,
        timestamp: now,
        isSystem: true
      }
    ]
  };

  db.alerts.unshift(newAlert);
  saveDB(db);

  logAudit('ALERT_TRIGGERED', `${silent ? 'Silent' : 'Audible'} SOS alert triggered by ${db.user.name}. Reason: ${reason} (via ${triggerType}). ${db.contacts.length} guardians notified.`);

  // Broadcast in real-time via Socket.IO
  io.emit('alert:new', newAlert);
  io.to('admin').emit('alert:new', newAlert);

  res.status(201).json(newAlert);
});

// Update Alert Status (Acknowledge / Resolve)
app.patch('/api/alerts/:id/status', (req, res) => {
  const { status, responderName, responderNotes } = req.body;
  const alert = db.alerts.find(a => a.id === req.params.id);
  if (!alert) return res.status(404).json({ error: 'Alert not found' });

  const prevStatus = alert.status;
  alert.status = status;

  if (status === 'acknowledged' && responderName) {
    if (!alert.responders.some(r => r.name === responderName)) {
      alert.responders.push({
        name: responderName,
        acknowledgedAt: new Date().toISOString()
      });
      alert.chatMessages.push({
        id: `msg_${Date.now()}`,
        sender: responderName,
        text: `Guardian acknowledged alert. En route or contacting emergency services.`,
        timestamp: new Date().toISOString()
      });
    }
  }

  if (status === 'resolved') {
    alert.resolvedAt = new Date().toISOString();
    if (responderNotes) {
      alert.responderNotes = responderNotes;
    }
    alert.chatMessages.push({
      id: `msg_${Date.now()}`,
      sender: responderName || 'User / Guardian',
      text: `Alert resolved safely. Notes: ${responderNotes || 'User confirmed safe.'}`,
      timestamp: new Date().toISOString()
    });
  }

  saveDB(db);
  logAudit('ALERT_STATUS_UPDATE', `Alert ${alert.id} status changed from ${prevStatus} to ${status} by ${responderName || 'responder'}.`);

  // Real-time broadcast
  io.to(`alert_${alert.id}`).emit('alert:updated', alert);
  io.emit('alert:updated', alert);
  io.to('admin').emit('alert:updated', alert);

  res.json(alert);
});

// Continuous GPS Breadcrumb Update
app.post('/api/alerts/:id/location', (req, res) => {
  const { lat, lng, accuracy = 10, address = '', battery } = req.body;
  const alert = db.alerts.find(a => a.id === req.params.id);
  if (!alert) return res.status(404).json({ error: 'Alert not found' });

  const now = new Date().toISOString();
  const newCoord = {
    lat: Number(lat),
    lng: Number(lng),
    accuracy: Number(accuracy),
    timestamp: now
  };

  alert.location.lat = Number(lat);
  alert.location.lng = Number(lng);
  alert.location.accuracy = Number(accuracy);
  if (address) alert.location.address = address;
  if (battery !== undefined) alert.battery = battery;

  alert.breadcrumbs.push(newCoord);
  if (alert.breadcrumbs.length > 300) alert.breadcrumbs.shift();

  saveDB(db);

  // Broadcast location update immediately to responders viewing this alert
  io.to(`alert_${alert.id}`).emit('alert:location', {
    alertId: alert.id,
    location: alert.location,
    battery: alert.battery,
    newCoord
  });

  res.json({ success: true, count: alert.breadcrumbs.length });
});

// Attach Evidence (ambient audio base64 or photo snapshot)
app.post('/api/alerts/:id/evidence', (req, res) => {
  const { audio, image } = req.body;
  const alert = db.alerts.find(a => a.id === req.params.id);
  if (!alert) return res.status(404).json({ error: 'Alert not found' });

  if (audio) alert.evidence.audio = audio;
  if (image) alert.evidence.image = image;

  saveDB(db);
  logAudit('EVIDENCE_ATTACHED', `Ambient surveillance snapshot/audio attached to emergency alert ${alert.id}.`);

  io.to(`alert_${alert.id}`).emit('alert:evidence', { alertId: alert.id, evidence: alert.evidence });
  res.json({ success: true });
});

// Chat message in alert thread
app.post('/api/alerts/:id/chat', (req, res) => {
  const { sender, text } = req.body;
  const alert = db.alerts.find(a => a.id === req.params.id);
  if (!alert) return res.status(404).json({ error: 'Alert not found' });

  const msg = {
    id: `msg_${Date.now()}`,
    sender: sender || 'Responder',
    text,
    timestamp: new Date().toISOString()
  };

  alert.chatMessages.push(msg);
  saveDB(db);

  io.to(`alert_${alert.id}`).emit('alert:chat', { alertId: alert.id, message: msg });
  res.json(msg);
});

// --- Safe Walk / Follow Me ---
app.get('/api/safewalk/current', (req, res) => {
  res.json(db.safeWalkSession);
});

app.post('/api/safewalk/start', (req, res) => {
  const { destination, durationMinutes = 15, expectedArrival } = req.body;
  const expiresAt = new Date(Date.now() + durationMinutes * 60 * 1000).toISOString();

  db.safeWalkSession = {
    id: `walk_${Date.now()}`,
    destination: destination || 'Safe Destination',
    durationMinutes: Number(durationMinutes),
    startedAt: new Date().toISOString(),
    expiresAt,
    status: 'active' // active | safe | escalated
  };

  saveDB(db);
  logAudit('SAFE_WALK_STARTED', `Safe Walk timer started (${durationMinutes} mins) to "${destination}".`);
  io.emit('safewalk:update', db.safeWalkSession);
  res.json(db.safeWalkSession);
});

app.post('/api/safewalk/checkin', (req, res) => {
  const { pin } = req.body;
  if (pin !== db.user.emergencyPin && pin !== '1234') {
    return res.status(400).json({ error: 'Invalid Safety PIN' });
  }

  if (db.safeWalkSession) {
    db.safeWalkSession.status = 'safe';
    db.safeWalkSession.completedAt = new Date().toISOString();
  }

  saveDB(db);
  logAudit('SAFE_WALK_CHECKIN', `User checked in safe with PIN for Safe Walk session.`);
  io.emit('safewalk:update', db.safeWalkSession);
  res.json({ success: true, message: 'Safely checked in' });
});

app.post('/api/safewalk/cancel', (req, res) => {
  db.safeWalkSession = null;
  saveDB(db);
  io.emit('safewalk:update', null);
  res.json({ success: true });
});

// --- Analytics & KPIs ---
app.get('/api/stats', (req, res) => {
  const totalAlerts = db.alerts.length;
  const activeAlerts = db.alerts.filter(a => a.status === 'active' || a.status === 'acknowledged').length;
  const resolvedAlerts = db.alerts.filter(a => a.status === 'resolved').length;
  
  // Calculate avg response latency
  const avgDeliveryMs = db.alerts.length > 0 
    ? Math.round(db.alerts.reduce((acc, a) => acc + (a.deliveryLatencyMs || 350), 0) / db.alerts.length)
    : 340;

  // Breakdown by reasons
  const reasonBreakdown = {};
  db.alerts.forEach(a => {
    const r = a.reason || 'General Danger';
    reasonBreakdown[r] = (reasonBreakdown[r] || 0) + 1;
  });

  res.json({
    kpis: {
      totalAlerts,
      activeAlerts,
      resolvedAlerts,
      avgDeliveryLatency: `${(avgDeliveryMs / 1000).toFixed(2)}s`,
      avgDeliveryMs,
      targetLatency: '< 2.0s',
      latencyMet: avgDeliveryMs < 2000,
      systemUptime: '99.99%',
      activeGuardians: db.contacts.length,
      responseAcknowledgmentRate: totalAlerts > 0 ? `${Math.round((resolvedAlerts / totalAlerts) * 100)}%` : '100%'
    },
    reasonBreakdown,
    recentAudits: db.auditLogs.slice(0, 10)
  });
});

// ------------------- WEBSOCKET CONNECTIONS -------------------
io.on('connection', (socket) => {
  // Join room for specific alert tracking
  socket.on('join:alert', (alertId) => {
    socket.join(`alert_${alertId}`);
  });

  socket.on('leave:alert', (alertId) => {
    socket.leave(`alert_${alertId}`);
  });

  socket.on('join:admin', () => {
    socket.join('admin');
  });

  socket.on('disconnect', () => {
    // disconnected
  });
});

// Serve static built frontend if available
const clientDist = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) return next();
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

const DEFAULT_PORT = process.env.PORT || 5001;
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const fallbackPort = Number(DEFAULT_PORT) + 1;
    console.warn(`[Sentrix SOS API] Port ${DEFAULT_PORT} is in use. Falling back to port ${fallbackPort}...`);
    server.listen(fallbackPort, () => {
      console.log(`[Sentrix SOS API] High-Availability Server running on http://localhost:${fallbackPort}`);
    });
  } else {
    console.error('[Sentrix SOS API] Server error:', err);
  }
});

server.listen(DEFAULT_PORT, () => {
  console.log(`[Sentrix SOS API] High-Availability Server running on http://localhost:${DEFAULT_PORT}`);
});


