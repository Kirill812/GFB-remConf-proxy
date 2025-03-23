const admin = require('firebase-admin');
const path = require('path');
const dotenv = require('dotenv');

// Ensure environment variables are loaded
dotenv.config();

const credentialsPath = process.env.FIREBASE_CREDENTIALS_PATH;

if (!credentialsPath) {
  console.error('Error: FIREBASE_CREDENTIALS_PATH environment variable is not set');
  process.exit(1);
}

try {
  // Attempt to load the credentials
  // Using process.cwd() for relative paths
  const credentialsResolved = path.resolve(credentialsPath);
  console.log(`Loading Firebase credentials from: ${credentialsResolved}`);

  // Initialize Firebase Admin SDK
  admin.initializeApp({
    credential: admin.credential.cert(credentialsResolved)
  });

  console.log('Firebase Admin SDK initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error);
  process.exit(1);
}

module.exports = admin;