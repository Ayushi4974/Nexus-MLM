const helmet = require('helmet');

/**
 * Apply common security HTTP headers using helmet.
 * This middleware should be placed early in the middleware chain,
 * before any route handling.
 */
function applySecurityHeaders(req, res, next) {
  // helmet() includes a default set of protections.
  // We also enable Content Security Policy with a permissive default for dev.
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "blob:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    // Hide X-Powered-By header
    hidePoweredBy: true,
    // Prevent clickjacking
    frameguard: { action: 'deny' },
    // Prevent MIME type sniffing
    noSniff: true,
  })(req, res, next);
}

module.exports = { applySecurityHeaders };
