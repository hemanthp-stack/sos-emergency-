# AegisSOS | Silent Emergency Safety Web Platform
> **Non-verbal, one-action emergency alert system with real-time location sharing, dual stealth camouflage, and proactive escape tools. Inspired by [bSafe](https://www.getbsafe.com).**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node: v20+](https://img.shields.io/badge/node-v20%2B-green.svg)](https://nodejs.org)
[![React: 18](https://img.shields.io/badge/react-18.3-61dafb.svg)](https://react.dev)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.7-black.svg)](https://socket.io)
[![SLA: <2s Delivery](https://img.shields.io/badge/SLA-%3C2.0s%20Delivery-critical.svg)](#key-performance-indicators)

---

## 🛠️ How to Open & Run in VS Code (Quickstart)

### Step 1: Open the Project in VS Code
1. Open VS Code.
2. Select **File > Open Folder...** and choose `/Users/hemanth/Desktop/unified sos app`.

### Step 2: Run the App (Choose Any of the 3 Easy Methods)

#### Option A: One-Click Script (Recommended)
Open a terminal in VS Code (`Ctrl + ~` or `Cmd + ~`) and run:
```bash
./start.sh
```

#### Option B: Standard NPM Command
In the VS Code terminal, run:
```bash
npm run dev
```

#### Option C: VS Code F5 Run & Debug
1. Press `F5` or go to the **Run and Debug** tab on the left sidebar.
2. Click the green play button **"Run Full App (Server + Client)"**.

### Step 3: View in Browser
- **Frontend Web App**: [http://localhost:5173](http://localhost:5173)
- **Backend API & Portal**: [http://localhost:5001](http://localhost:5001)

---

## 🌟 Unique Interface Design Highlights

### 1. Cyber-Guardian Tactical Cockpit
- Deep midnight obsidian theme (`#030712`) with frosted glassmorphic panels and luminous neon accents.
- **Tactile 3D SOS Radar Trigger**:
  - Expanding concentric radar sonar rings (`radar-ripple`).
  - Animated soundwave equalizer visualizer monitoring vital acoustic stealth.
  - Telemetry crosshairs (`BEACON ACQUIRED`, `GPS HUD LOCKED`).
  - Dual-mode trigger: **Instant Strike** (1-tap) vs **Tactical 3s Lock** (prevents pocket triggers).
  - Audio switch: **Silent Stealth (0dB)** vs **Sonic Siren (120dB)**.

### 2. Smartphone Mockup Simulator (`Phone Mockup` Toggle)
- One-click toggle in the navbar to switch between **Desktop Cockpit View** and a **Photorealistic iPhone 16 Pro Frame** (featuring a working Dynamic Island, antenna bands, and handheld ergonomics) directly inside the desktop browser!

### 3. Dual Stealth Camouflage System
- **Disguise A: Dark Calculator**: Performs standard math. Secret trigger: Type `911 =` or hold `AC` to fire Silent SOS.
- **Disguise B: Notes Checklist**: Masks app as a daily grocery/errands list. Secret trigger: Type `911` in note body or tap note title 3 times.

### 4. Photorealistic Fake Call Escape
- Realistic iOS 18 incoming call screen with dual-frequency synthesized ringtone.
- Accept button opens active call HUD with conversation murmur audio so anyone nearby believes you are on an authentic call.

### 5. Follow Me / Safe Walk HUD
- Timed journey countdown timer with destination tracking.
- Requires Safety PIN `1234` to disarm; automatically escalates into a Critical SOS if the countdown expires.

### 6. Tactical Responder Portal (`/responder/:id`) & Campus Admin Radar
- Live Leaflet map with pulsing victim beacon, accuracy radius (±8m), and dynamic breadcrumb trail.
- One-click Google Maps navigation, 911 quick dial, and situational responder chat.
- Live SLA telemetry monitoring the `<2.0s` target delivery latency (~0.38s actual).

---

## 📁 Repository Structure
```
├── client/                     # React 18 + Vite Frontend
│   ├── src/
│   │   ├── components/         # Map, StealthCalculator, StealthNotes, FakeCall, SafeWalk, Navbar
│   │   ├── pages/              # Trigger, Guardians, Responder, Admin, Docs
│   │   ├── utils/              # Web Audio Synth, Geolocation, Media Capture
│   │   ├── App.jsx             # Top-level state & WebSocket connection
│   │   └── main.jsx            # Entry point
├── server/                     # Node.js + Express + Socket.IO Backend
│   ├── server.js               # REST endpoints, WebSocket rooms, and persistent store
│   └── data_store.json         # Seeded demo data & persistent state
├── .vscode/                    # VS Code 1-click launch configurations
│   ├── launch.json             # F5 Run & Debug
│   └── tasks.json              # VS Code task runner
├── docs/                       # Product Requirements & Architecture
│   ├── PRD.md                  # Comprehensive Product Requirements Document
│   └── ARCHITECTURE.md         # Technical architecture & API contracts
├── start.sh                    # One-click startup script for Mac/Linux
├── index.html                  # Root launcher portal
└── package.json                # Root orchestration scripts
```
