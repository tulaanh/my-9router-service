// Cloud entry point for 9router on Render / Railway / Cloud PaaS
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

const port = String(process.env.PORT || '20128');
const host = '0.0.0.0';

// Set initial admin password for remote cloud access security requirement
process.env.INITIAL_PASSWORD = process.env.INITIAL_PASSWORD || 'Admin@12345678';

// Decrypt and restore pre-configured 9router data bundle across container restarts
try {
  const bundleEncPath = path.join(__dirname, 'data.bundle.enc');
  if (fs.existsSync(bundleEncPath)) {
    const SECRET_KEY = process.env.ENCRYPTION_KEY || 'vietphuc-9router-secret-2026';
    const key = crypto.createHash('sha256').update(SECRET_KEY).digest();
    const data = fs.readFileSync(bundleEncPath);
    const iv = data.subarray(0, 16);
    const ciphertext = data.subarray(16);

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    const bundle = JSON.parse(decrypted.toString('utf-8'));

    const targetDirs = [
      path.join(os.homedir(), '.9router'),
      '/app/data'
    ];

    for (const targetDir of targetDirs) {
      try {
        fs.mkdirSync(path.join(targetDir, 'db'), { recursive: true });
        fs.mkdirSync(path.join(targetDir, 'auth'), { recursive: true });

        const sqliteDst = path.join(targetDir, 'db', 'data.sqlite');
        if (!fs.existsSync(sqliteDst) && bundle.sqlite) {
          fs.writeFileSync(sqliteDst, Buffer.from(bundle.sqlite, 'base64'));
          console.log(`[Cloud 9router] Restored persistent database to ${sqliteDst}`);
        }

        if (bundle.machineId) fs.writeFileSync(path.join(targetDir, 'machine-id'), bundle.machineId);
        if (bundle.jwtSecret) fs.writeFileSync(path.join(targetDir, 'jwt-secret'), bundle.jwtSecret);
        if (bundle.cliSecret) fs.writeFileSync(path.join(targetDir, 'auth', 'cli-secret'), bundle.cliSecret);
      } catch (dirErr) {
        console.warn(`[Cloud 9router] Note: Could not restore to ${targetDir}:`, dirErr.message);
      }
    }

    process.env.DATA_DIR = path.join(os.homedir(), '.9router');
    console.log('[Cloud 9router] Pre-configured credentials and connections restored successfully!');
  }
} catch (err) {
  console.warn('[Cloud 9router] Error restoring data bundle:', err.message);
}

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
