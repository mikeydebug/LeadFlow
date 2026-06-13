# LeadFlow

Real-time Meta Lead Ads → React Native (Mobile & Web) live feed PoC

## Features

- **Real-time Synchronization**: New leads appear instantly without refreshing via Socket.io.
- **Cross-Platform Support**: Works on iOS, Android, and Web browsers seamlessly.
- **WhatsApp Click-to-Chat**: One-click WhatsApp message button on each lead card to instantly connect with prospects.
- **Audio Notifications**: Plays a notification sound ("Ding") as soon as a new lead arrives (Web supported).
- **Premium UI**: Smooth animations (Reanimated), haptics, and a sleek dark theme.

## Architecture

```text
Meta Testing Tool → Webhook (ngrok) → Express Server → Socket.io → React Native App (Mobile/Web)
```

## Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- ngrok account (free tier works)
- Meta for Developers account

## Setup

### 1. Backend

```bash
cd server
npm install
cp .env.example .env
# Fill in your META_APP_SECRET and META_PAGE_ACCESS_TOKEN
npm run dev
```

### 2. Mobile / Web App

```bash
cd mobile
npm install
# For Mobile testing, in src/services/socket.ts, replace localhost with your machine's IP
# For Web testing, leave it as localhost
npx expo start -c
# Press 'w' to open in browser for Web testing
```

### 3. ngrok Tunnel (for Meta webhook)

```bash
ngrok config add-authtoken <YOUR_TOKEN>
ngrok http 3000
# Copy the HTTPS URL
```

### 4. Meta Setup

1. Go to developers.facebook.com → Your App → Add Product: Webhooks (or Use cases -> Capture & manage ad leads)
2. Subscribe to Page object, field: `leadgen`
3. Webhook URL: `https://YOUR_NGROK_URL/webhook`
4. Verify Token: `leadflow_verify_2024`
5. Get Page Access Token from Graph API Explorer
6. Add it to `server/.env` as `META_PAGE_ACCESS_TOKEN`

### 5. Test

- Go to Meta for Developers → Lead Ads → Lead Testing Tool
- Select your Page and Form
- Click "Create Lead"
- Watch it appear in the app instantly 🎯

## Assumptions

- The app screen must already be open (no push notifications needed; uses WebSocket)
- A Meta Developer App and Page are required (free)
- ngrok free tier is sufficient for demo purposes
- Field data (name/email/phone) is fetched from Graph API using `leadgen_id`

## Tech Decisions

- **Socket.io over FCM**: app is already open, WebSocket is faster and simpler for PoC
- **Expo over bare RN**: faster setup, same real-time capability with easy Web support
- **Zustand over Redux**: lightweight, zero boilerplate for this scope
