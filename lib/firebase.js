// ── Firebase Config ─────────────────────────────────────
// Paste your Firebase project config here.
// Until configured, the app runs in demo mode: data is
// stored locally and logged to the console instead.
const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyBTsNMIeVUNioJwFL0mF0jMwRs_ucj5PXc",
  authDomain:        "carga-lamp.firebaseapp.com",
  projectId:         "carga-lamp",
  storageBucket:     "carga-lamp.firebasestorage.app",
  messagingSenderId: "1067672938771",
  appId:             "1:1067672938771:web:e970d5cf50e6a7107312e6",
};

let db = null;

export function initFirebase() {
  if (FIREBASE_CONFIG.apiKey.startsWith('YOUR')) {
    console.warn('[CARGA] Firebase not configured — demo mode active.');
    return false;
  }
  try {
    if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
    db = firebase.firestore();
    console.info('[CARGA] Firebase connected.');
    return true;
  } catch (e) {
    console.error('[CARGA] Firebase init failed:', e);
    return false;
  }
}

export async function saveSession(sessionData) {
  if (!db) {
    console.info('[CARGA] Demo mode — session payload:', sessionData);
    return null;
  }
  try {
    const ref = await db.collection('carga_sessions').add({
      ...sessionData,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    console.info('[CARGA] Saved to Firestore:', ref.id);
    return ref.id;
  } catch (e) {
    console.error('[CARGA] Firestore write failed:', e);
    return null;
  }
}
