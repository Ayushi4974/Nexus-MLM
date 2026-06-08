require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

// Disable mongoose command buffering globally so it fails immediately if not connected
mongoose.set('bufferCommands', false);

const connectDB = require('./config/db');

const app = express();

// Middleware
// app.use(cors());
// app.use(express.json());

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Security headers middleware
const { applySecurityHeaders } = require('./src/middleware/securityHeaders');
app.use(applySecurityHeaders);

// Rate limiting middleware
const { apiLimiter } = require('./src/middleware/rateLimiter');
app.use(apiLimiter);

app.options("*", cors());

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Basic Health Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'MLM API Server is running', mockDb: global.useMockDb });
});

const startServer = async () => {
  // 1. Check database connection state (MongoDB vs Mock DB)
  await connectDB();

  // 2. Load API Routing AFTER connection completes so dynamic models bind correctly
  app.use('/api/auth', require('./routes/authRoutes'));
  app.use('/api/admin', require('./routes/adminRoutes'));
  app.use('/api/users', require('./routes/userRoutes'));
  app.use('/api/wallet', require('./routes/walletRoutes'));
  app.use('/api/packages', require('./routes/packageRoutes'));
  app.use('/api/team', require('./routes/teamRoutes'));
  app.use('/api/notifications', require('./src/modules/notifications/routes/notificationRoutes'));

  // Start background periodic ROI task (runs every 10 minutes in the process background)
  setTimeout(() => {
    const { runDailyROICron } = require('./controllers/adminController');
    const runBackgroundROI = async () => {
      try {
        console.log('[Scheduler] Running automated background ROI yield credits...');
        const mockReq = {};
        const mockRes = {
          json: (data) => console.log('[Scheduler] Background ROI Payout Success:', data.message),
          status: () => ({ json: (data) => console.error('[Scheduler] Background ROI Payout Failed:', data.message) })
        };
        await runDailyROICron(mockReq, mockRes);
      } catch (err) {
        console.error('[Scheduler] Error in automated background ROI processing:', err.message);
      }
    };

    // Run first calculation after 1 minute of server startup
    setTimeout(runBackgroundROI, 60 * 1000);
    // Recurring execution every 10 minutes
    setInterval(runBackgroundROI, 10 * 60 * 1000);
  }, 5000);

  // 3. Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      success: false,
      message: err.message || 'Internal Server Error',
    });
  });

  const http = require('http');
  const socketIo = require('socket.io');

  const server = http.createServer(app);
  const io = socketIo(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });
  // Expose globally for services
  global.io = io;

  // Simple connection handler (optional JWT auth can be added later)
  io.on('connection', (socket) => {
    // Expect client to join a room named with their userId after authentication on frontend
    socket.on('join', (userId) => {
      socket.join(`user_${userId}`);
    });
    socket.on('disconnect', () => {
      // cleanup if needed
    });
  });

  const PORT = process.env.PORT || 5000;
  // Replace app.listen with server.listen
  server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
};

startServer();
