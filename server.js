'use strict';

/** Local and container entry point: run the Express app as a normal server. */

const app = require('./app');
const ai = require('./lib/ai');

const PORT = process.env.PORT || 3100;

app.listen(PORT, () => {
  console.log(`Health assistant running at http://localhost:${PORT}`);
  console.log(ai.isAvailable()
    ? `AI mode available (${ai.MODEL})`
    : 'Offline mode only (set ANTHROPIC_API_KEY to enable AI mode)');
});
