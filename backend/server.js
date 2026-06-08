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

// Create a router for database-dependent routes
const apiRouter = express.Router();

let isInitialized = false;
let initializationPromise = null;

const initializeApp = async () => {
  if (isInitialized) return;
  if (!initializationPromise) {
    initializationPromise = (async () => {
      // 1. Connect to database
      await connectDB();

      // 2. Load API Routing AFTER connection completes so dynamic models bind correctly
      apiRouter.use('/api/auth', require('./routes/authRoutes'));
      apiRouter.use('/api/admin', require('./routes/adminRoutes'));
      apiRouter.use('/api/users', require('./routes/userRoutes'));
      apiRouter.use('/api/wallet', require('./routes/walletRoutes'));
      apiRouter.use('/api/packages', require('./routes/packageRoutes'));
      apiRouter.use('/api/team', require('./routes/teamRoutes'));
      apiRouter.use('/api/notifications', require('./src/modules/notifications/routes/notificationRoutes'));

      // 3. Error handling middleware inside the router
      apiRouter.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json({
          success: false,
          message: err.message || 'Internal Server Error',
        });
      });

      isInitialized = true;
    })();
  }
  await initializationPromise;
};

// Middleware to ensure DB connection is active and routes are loaded
app.use(async (req, res, next) => {
  try {
    await initializeApp();
    next();
  } catch (err) {
    next(err);
  }
});

// Mount the apiRouter
app.use(apiRouter);

// Export app for serverless deployments (Vercel)
module.exports = app;

// Start local HTTP server, WebSockets, and background schedulers ONLY when running server.js directly
if (require.main === module) {
  const http = require('http');
  const socketIo = require('socket.io');

  const startLocalServer = async () => {
    // Run initialization before listening
    await initializeApp();

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

    io.on('connection', (socket) => {
      socket.on('join', (userId) => {
        socket.join(`user_${userId}`);
      });
      socket.on('disconnect', () => {});
    });

    // Start background periodic ROI task
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

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  };

  startLocalServer();
}

