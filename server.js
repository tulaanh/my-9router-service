// Cloud entry point for 9router on Render / Railway / Cloud PaaS
const port = String(process.env.PORT || '20128');
const host = '0.0.0.0';

console.log(`[Cloud 9router] Starting 9router service on port ${port}, host ${host}...`);

process.argv = [
  process.execPath,
  '9router',
  '--port', port,
  '--host', host,
  '--no-browser',
  '--skip-update',
  '--log'
];

try {
  require('9router/cli.js');
} catch (err) {
  console.error('[Cloud 9router] Failed to start 9router:', err);
  process.exit(1);
}
