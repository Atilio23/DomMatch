// This file is replaced by the 'firebase-frameworks' CLI command.
// See https://firebase.google.com/docs/hosting/frameworks/frameworks-overview
// This file is used to initialize the Firebase Client SDK.
// The configuration is automatically provided by the server environment.

// In a local environment, this variable might be missing. We provide a fallback.
// A proper setup would involve a .env.local file.
let config;
try {
    config = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG || "");
} catch (e) {
    config = {};
}

export const firebaseConfig = config;
