# LeadFlow

Real-time Meta Lead Ads → React Native live feed PoC

## Architecture

```text
Meta Testing Tool → Webhook (ngrok) → Express Server → Socket.io → React Native App
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

### 2. Mobile App

```bash
cd mobile
npm install
# In src/services/socket.ts, replace YOUR_LOCAL_IP with your machine's IP
npx expo start
```

### 3. ngrok Tunnel (for Meta webhook)

```bash
ngrok http 3000
# Copy the HTTPS URL
```

### 4. Meta Setup

1. Go to developers.meta.com → Your App → Add Product: Webhooks
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
- Field data (name/email) is fetched from Graph API using `leadgen_id`

## Tech Decisions

- **Socket.io over FCM**: app is already open, WebSocket is faster and simpler for PoC
- **Expo over bare RN**: faster setup, same real-time capability
- **Zustand over Redux**: lightweight, zero boilerplate for this scope
