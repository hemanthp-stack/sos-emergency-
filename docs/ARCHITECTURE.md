# Technical Architecture & API Specifications
## AegisSOS: Silent Emergency Safety Platform

---

### 1. System Architecture Overview

AegisSOS utilizes an event-driven, full-stack architecture optimized for low-latency dispatch and high reliability.

```
+---------------------------------------------------------------------------------------+
|                                    CLIENT BROWSER                                     |
|                                                                                       |
|  +--------------------+   +-----------------------+   +----------------------------+  |
|  |  SOS Trigger Page  |   |  Stealth Calculator   |   |   Safe Walk & Fake Call    |  |
|  | (1-Tap & 3s Hold)  |   |  (Pin 911= Backdoor)  |   |  (Timer & Audio Synthesis) |  |
|  +---------+----------+   +-----------+-----------+   +-------------+--------------+  |
|            |                          |                             |                 |
|            +--------------------------+-----------------------------+                 |
|                                       |                                               |
|                    +------------------v-------------------+                           |
|                    |  Telemetry & Hardware Abstraction    |                           |
|                    |  - HTML5 Geolocation (watchPosition) |                           |
|                    |  - Web Audio API (Synthesizer)       |                           |
|                    |  - MediaRecorder (Evidence capture)  |                           |
|                    |  - Battery Status API                |                           |
|                    +------------------+-------------------+                           |
+---------------------------------------|-----------------------------------------------+
                                        | HTTP / WebSocket (Socket.IO)
                                        v
+---------------------------------------------------------------------------------------+
|                                  BACKEND SERVER                                       |
|                                                                                       |
|  +------------------------------------+   +----------------------------------------+  |
|  |         Express.js REST API        |   |       Socket.IO Real-Time Engine       |  |
|  | - /api/alerts (trigger/manage)     |   | - Room 'alert_{id}': victim to guardian|  |
|  | - /api/contacts (guardians CRUD)   |   | - Room 'admin': campus dispatch radar  |  |
|  | - /api/safewalk (timed sessions)   |   | - Instant broadcast (< 50ms)           |  |
|  | - /api/stats (SLA metrics)         |   +----------------------------------------+  |
|  +------------------------------------+                                               |
|                                       |                                               |
|                    +------------------v-------------------+                           |
|                    |   Data Persistence & Audit Log Store |                           |
|                    |   - Contacts & Medical Profiles      |                           |
|                    |   - Active & Historical Incidents    |                           |
|                    |   - Millisecond Security Audit Trail |                           |
|                    +--------------------------------------+                           |
+---------------------------------------------------------------------------------------+
```

---

### 2. Technology Stack Breakdown

- **Frontend**:
  - React 18 (Functional components, hooks, React StrictMode)
  - Vite 5 (Sub-second HMR and production bundle optimization)
  - Tailwind CSS 3 (Hardware-accelerated dark theme and safety palette)
  - Lucide React (Tactile vector emergency iconography)
  - Leaflet 1.9 (GPU-accelerated interactive OpenStreetMap & CartoDB tiles)
  - Web Audio API (Zero-dependency ringtone & emergency siren synthesis)
- **Backend**:
  - Node.js v20+ with ES Modules
  - Express.js (REST API layer with CORS & body parser)
  - Socket.IO 4.7 (Dual WebSocket & long-polling transport fallback)
- **Persistence**:
  - In-Memory State Engine with persistent JSON atomic writes (`data_store.json`)
  - Ready for seamless plug-in to PostgreSQL / MongoDB / Redis.

---

### 3. REST API Specifications

#### 3.1 Alerts Endpoint
- `POST /api/alerts/trigger`
  - **Description**: Creates and dispatches an emergency alert.
  - **Request Body**:
    ```json
    {
      "silent": true,
      "triggerType": "hold",
      "reason": "Stalking / Suspicious Person",
      "customMessage": "Near corner of 5th Ave",
      "location": { "lat": 37.7749, "lng": -122.4194, "accuracy": 8, "address": "742 Market St" },
      "battery": 86,
      "evidence": { "audio": "data:audio/webm;base64,...", "image": "data:image/jpeg;base64,..." }
    }
    ```
  - **Response (201 Created)**: Returns populated alert object with delivery latency stats.
- `GET /api/alerts`
  - Returns list of incidents with query filtering by `status` (`active`, `acknowledged`, `resolved`).
- `PATCH /api/alerts/:id/status`
  - Updates alert lifecycle (`acknowledged` or `resolved`) and attaches responder dispatch notes.
- `POST /api/alerts/:id/location`
  - Streams updated coordinates from victim's device to breadcrumbs ledger.
- `POST /api/alerts/:id/chat`
  - Posts a message to the incident response coordination thread.

#### 3.2 Guardians Endpoint
- `GET /api/contacts` / `POST /api/contacts` / `PUT /api/contacts/:id` / `DELETE /api/contacts/:id`
- `POST /api/contacts/:id/test-ping`
  - Generates an instant tier-1 SMS verification packet and reports delivery latency.

#### 3.3 Safe Walk Endpoint
- `POST /api/safewalk/start`: Starts timed journey session.
- `POST /api/safewalk/checkin`: Validates safety PIN (`1234`) and marks journey completed.
- `POST /api/safewalk/cancel`: Cancels session.

#### 3.4 SLA & Telemetry Endpoint
- `GET /api/stats`
  - Returns KPI aggregations: average delivery latency, uptime, resolution rates, and audit logs.

---

### 4. WebSocket Event Contracts (Socket.IO)

| Event Name | Direction | Payload | Description |
| :--- | :--- | :--- | :--- |
| `join:alert` | Client &rarr; Server | `alertId` | Joins private room for specific victim incident |
| `leave:alert` | Client &rarr; Server | `alertId` | Leaves incident room |
| `join:admin` | Client &rarr; Server | None | Subscribes to campus dispatch master room |
| `alert:new` | Server &rarr; Client | `AlertObject` | Broadcast when a new emergency is triggered |
| `alert:updated` | Server &rarr; Client | `AlertObject` | Emitted when alert is acknowledged or resolved |
| `alert:location`| Server &rarr; Client | `{ alertId, location, battery, newCoord }` | Real-time GPS coordinate stream |
| `alert:evidence`| Server &rarr; Client | `{ alertId, evidence }` | Emitted when ambient audio/photo is attached |
| `alert:chat` | Server &rarr; Client | `{ alertId, message }` | Responder chat message |
| `audit:new` | Server &rarr; Client | `AuditLogEntry` | Real-time audit log event for monitoring room |

---

### 5. Threat Model & Safety Fail-Safes

1. **Assailant Screen Inspection**:
   - The user can instantly engage the **Stealth Mode** button to convert the interface into an authentic Calculator.
   - When an SOS is triggered from the calculator, the screen does not shift; the calculation remains untouched while dispatch executes invisibly.
2. **Forced Alert Disarming (Coercion)**:
   - Disarming an active SOS requires entering a 4-digit Safety PIN (`1234`).
   - If an assailant attempts random numbers, the system rejects the disarm without alerting them.
3. **GPS Signal Loss / Degradation**:
   - The system tracks historical breadcrumbs with timestamp and accuracy radius. If GPS signal drops, the last known high-accuracy pinpoint remains locked on the responders' radar.
4. **Network Drop Re-connectivity**:
   - Socket.IO automatically buffers and reconnects over WebSocket or HTTP long-polling upon connection restoration.

---

### 6. Deployment Runbook

#### 6.1 Local Development
```bash
# Clone and install dependencies
git clone <repo-url>
cd "unified sos app"
npm run install:all

# Run backend and frontend concurrently
npm run dev
# Frontend runs at: http://localhost:5173
# Backend runs at:  http://localhost:5001
```

#### 6.2 Production Deployment (Container / Cloud)
```bash
# 1. Build the frontend production bundle
npm run build:client

# 2. Start the unified production server (serves API + static client)
npm start
```
The application is pre-configured so that `server/server.js` automatically serves `client/dist` statically on single-port deployments (e.g. AWS Elastic Beanstalk, Render, Railway, Fly.io, or Heroku).
