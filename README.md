# CARGA — Cognitive Assessment Research Gamified Application

A modern, tablet-optimized cognitive test suite built for psychology demos, science fairs, and educational research. Hosted on GitHub Pages with optional Firebase Firestore data collection.

Developed at the **Laboratorio de Aprendizaje y Motivación (LAMP)**, Universidad de Magallanes.

👉 **[README en Español](README_ES.md)**

---

## Tests included

| Test | What it measures | Origin |
|------|-----------------|--------|
| **Stroop** | Cognitive interference / inhibitory control | Stroop (1935) |
| **Simple RT** | Processing speed | Donders (1869), Wundt (1879) |
| **Digit Span** | Verbal working memory | Jacobs (1887), Miller (1956) |
| **Eriksen Flanker** | Selective attention | Eriksen & Eriksen (1974) |
| **Go / No-Go** | Impulsive inhibitory control | Donders (1869) |
| **Visual Search** | Visual attention / pop-out | Treisman (1980) |

---

## Based on

Original experimental paradigms — no third-party test code was copied. RT measurement uses `performance.now()` (same precision as jsPsych). Stimulus logic follows established procedures from the cited literature.

---

## Stack

- Vanilla JS (ES Modules, no build step)
- Custom CSS (no framework)
- Firebase Firestore (optional)
- GitHub Pages (fully static)

---

## Repository structure

```
carga/
├── index.html          # App shell
├── app.js              # Main router, onboarding, hub
├── styles.css          # Full design system
├── lib/
│   ├── helpers.js      # Shared utilities
│   ├── state.js        # Global state + localStorage
│   ├── firebase.js     # Firebase wrapper (place config here)
│   └── tests/
│       ├── stroop.js
│       ├── rt.js
│       ├── digitspan.js
│       ├── flanker.js
│       ├── gonogo.js
│       └── search.js
├── README.md
└── README_ES.md
```

---

## Firebase setup

### 1 — Create a Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com) and create a project.
2. Go to **Firestore Database → Create database** (production mode).
3. In **Project settings → Your apps**, add a Web app and copy the config object.

### 2 — Add config to `lib/firebase.js`

Replace the placeholder near the top of `lib/firebase.js`:

```js
const FIREBASE_CONFIG = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID",
};
```

### 3 — Firestore security rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /carga_sessions/{docId} {
      allow create: if request.resource.data.keys().hasAll(['session_id', 'participant', 'results'])
                    && request.resource.data.participant.keys().hasAll(['nickname', 'age']);
      allow read, update, delete: if false;
    }
  }
}
```

---

## Demo mode (no Firebase)

If `FIREBASE_CONFIG` still has `"YOUR_API_KEY"`, the app runs normally. At session end, data is logged to the browser console (`F12 → Console`) instead of Firestore.

---

## Data schema (Firestore document)

```json
{
  "session_id": "uuid-v4",
  "participant": {
    "nickname": "...",
    "emoji": "🎯",
    "age": 16,
    "curso": "2M",
    "gender": "F"
  },
  "timestamp": "<server timestamp>",
  "results": {
    "stroop":    { "trials": [...], "summary": { "stroop_effect_ms": 47, ... } },
    "rt":        { "trials": [...], "summary": { "mean_rt_ms": 234, ... } },
    "digitspan": { "trials": [...], "summary": { "max_span": 7, ... } },
    "flanker":   { "trials": [...], "summary": { "flanker_effect_ms": 38, ... } },
    "gonogo":    { "trials": [...], "summary": { "false_alarm_rate": 8, ... } },
    "search":    { "trials": [...], "summary": { "popout_advantage_ms": 210, ... } }
  }
}
```

---

## Deploy to GitHub Pages

```bash
gh repo create lamp-umag/carga --public
git init && git add . && git commit -m "feat: initial CARGA suite"
git remote add origin https://github.com/lamp-umag/carga.git
git push -u origin main
```

Then: **Settings → Pages → Deploy from branch → main → / (root)**

Live at: `https://lamp-umag.github.io/carga/`

---

## References

- Stroop, J. R. (1935). Studies of interference in serial verbal reactions. *Journal of Experimental Psychology*, 18(6), 643–662.
- Donders, F. C. (1869). On the speed of mental processes. *Acta Psychologica*, 30, 412–431.
- Miller, G. A. (1956). The magical number seven, plus or minus two. *Psychological Review*, 63(2), 81–97.
- Eriksen, B. A., & Eriksen, C. W. (1974). Effects of noise letters upon the identification of a target letter. *Perception & Psychophysics*, 16(1), 143–149.
- Treisman, A. M., & Gelade, G. (1980). A feature-integration theory of attention. *Cognitive Psychology*, 12(1), 97–136.

---

## License

MIT — free to use and adapt with attribution.
