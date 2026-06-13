import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { initSocket, getIO } from './services/socket';
import webhookRouter from './routes/webhook';

const app = express();
const server = createServer(app);

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
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
