# LeadFlow 🚀

LeadFlow is a premium, real-time Lead Management Application designed to seamlessly integrate with Meta (Facebook) Lead Ads Webhooks. It instantly captures incoming leads from Facebook and pushes them directly to a mobile application using WebSockets, providing a state-of-the-art Glassmorphism UI experience.

## ✨ Key Features

- **Real-Time Integration:** Instantly captures Facebook Lead Gen webhook events.
- **WebSocket Architecture:** Uses `Socket.io` to push data from the Node.js backend to the React Native app in milliseconds.
- **Premium Glassmorphism UI:** Built with an advanced transparent, blurred UI aesthetic and smooth micro-animations.
- **Meta Graph API:** Fetches actual lead details securely using Page Access Tokens.
- **TypeScript First:** 100% strongly typed backend and frontend for maximum stability.

## 🏗️ System Architecture

1. **Meta Webhook (Facebook):** A user submits a Lead form on a Facebook Ad.
2. **Node.js/Express Backend:** Receives the `POST` request payload containing the `leadgen_id`.
3. **Graph API Fetch:** The backend securely queries the Meta Graph API to resolve the `leadgen_id` into actual user data (Name, Email, Phone).
4. **WebSocket Broadcast:** The parsed data is instantly broadcasted to all connected mobile clients.
5. **React Native Mobile App:** The user's device plays a notification sound and beautifully renders the incoming lead on the screen.

## 💻 Tech Stack

- **Frontend:** React Native (Expo), TypeScript, React Native Reanimated.
- **Backend:** Node.js, Express.js, TypeScript.
- **Real-time Engine:** Socket.io.
- **External APIs:** Meta Graph API (v19.0).

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Expo CLI
- Meta Developer App with Webhook access

### Backend Setup
```bash
cd server
npm install
# Create a .env file based on .env.example with your Meta Access Tokens
npm run dev
```

### Mobile App Setup
```bash
cd mobile
npm install
# Ensure you are connected to the same network as your backend
npx expo start -c
```

---
*Built with ❤️ for modern real-time lead management.*
