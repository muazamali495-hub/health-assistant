'use strict';

/**
 * Entry point used when the app is hosted on a serverless platform such as
 * Vercel: it hands over the same Express app that `server.js` runs locally,
 * without starting a listener of its own.
 */

module.exports = require('../app');
