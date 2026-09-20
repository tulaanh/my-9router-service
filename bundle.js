const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SECRET_KEY = process.env.ENCRYPTION_KEY || 'vietphuc-9router-secret-2026';
const key = crypto.createHash('sha256').update(SECRET_KEY).digest();

const sourceData = path.join(__dirname, 'data');
const sqlitePath = path.join(sourceData, 'db', 'data.sqlite');
const machineIdPath = path.join(sourceData, 'machine-id');
const jwtSecretPath = path.join(sourceData, 'jwt-secret');
const cliSecretPath = path.join(sourceData, 'auth', 'cli-secret');

if (!fs.existsSync(sqlitePath)) {
  console.error('Error: data.sqlite not found in data/db/');
  process.exit(1);
}

const bundle = {
  sqlite: fs.readFileSync(sqlitePath).toString('base64'),
  machineId: fs.existsSync(machineIdPath) ? fs.readFileSync(machineIdPath, 'utf-8').trim() : '',
  jwtSecret: fs.existsSync(jwtSecretPath) ? fs.readFileSync(jwtSecretPath, 'utf-8').trim() : '',
  cliSecret: fs.existsSync(cliSecretPath) ? fs.readFileSync(cliSecretPath, 'utf-8').trim() : ''
};

const plaintext = Buffer.from(JSON.stringify(bundle), 'utf-8');
const iv = crypto.randomBytes(16);
const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
const encrypted = Buffer.concat([iv, cipher.update(plaintext), cipher.final()]);

const outputPath = path.join(__dirname, 'data.bundle.enc');
fs.writeFileSync(outputPath, encrypted);

console.log(`[Bundle] Successfully encrypted 9router data into ${outputPath} (${encrypted.length} bytes)`);
