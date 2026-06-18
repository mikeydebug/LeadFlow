import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import mongoose from 'mongoose';
import { initSocket, getIO } from './services/socket';
import webhookRouter from './routes/webhook';
import { LeadModel } from './models/Lead';

const app = express();
const server = createServer(app);

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/leadflow';
mongoose.connect(mongoUri)
  .then(() => console.log('✅ MongoDB connected successfully!'))
  .catch((err) => console.error('❌ MongoDB connection error:', err.message));

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get('/leads', async (req, res) => {
  try {
    const leads = await LeadModel.find().sort({ timestamp: -1 }).limit(100);
    res.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

app.use('/webhook', webhookRouter);

app.get('/', (req, res) => {
  let clientsCount = 0;
  try {
    const io = getIO();
    clientsCount = io.engine.clientsCount;
  } catch (e) {
    // Socket not initialized yet
  }

  res.json({
    status: 'ok',
    connectedClients: clientsCount,
    uptime: process.uptime()
  });
});

const PORT = process.env.PORT || 3000;

initSocket(server);

server.listen(PORT, () => {
  console.log(`LeadFlow server running on port ${PORT}`);
});
