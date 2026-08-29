# Health Assistant

A bilingual (English / Urdu) health assistant that takes input by **microphone or keyboard**,
works out what the symptoms are consistent with, gives practical self-care advice, and
suggests **safe over-the-counter medicines** with doses, limits and cautions.

**The language is detected automatically** — English, Urdu script, or Roman Urdu
("mujhe bukhar hai"). The interface follows what you actually wrote, and so does the voice.
You can still pin it to English or اردو if you prefer.

**Every answer is given in both English and Urdu**, one block after the other, with the
language you used shown first. Each block has its own Listen button.

**Speak your question and it answers out loud** in the same language: when the text came
from the microphone, dictation submits itself and the reply is read back automatically.
Typed questions are answered on screen only, unless you press Listen.

**Voice speed is adjustable** (1× to 2×, default 1.4×) and is remembered between visits.

It runs fully offline by default. An optional AI mode adds better-worded, more targeted
answers when an Anthropic API key is available.

## Run it

```bash
npm install
npm start
```

Then open <http://localhost:3100>.

Voice input uses the browser's Web Speech API, so use **Chrome or Edge**. It needs
`http://localhost` or HTTPS — opening `index.html` directly from disk will not work.

### Voice answers — English and Urdu

Both languages speak. The app picks a voice in this order:

1. **A voice installed on the device**, via the browser's `speechSynthesis`. Instant and
   offline. This is what English normally uses, since Windows ships English voices.
2. **Server-side synthesis** (`POST /api/tts`) when the device has no voice for that
   language. Most Windows desktops have no Urdu voice at all, so Urdu takes this path.

So Urdu is spoken even on a machine with no Urdu voice installed — no setup needed beyond
an internet connection for the first playback of a given piece of text.

**Speed.** The `Voice speed` control in the header applies to both paths — as the utterance
rate for built-in voices and as the playback rate for server audio — and takes effect
immediately, even mid-sentence. The default of 1.4× is deliberate: the free Urdu voice is
slow at its natural rate.

**Latency and caching.** The script is split into ~190-character pieces. The client starts
playing the first piece while the rest are still being synthesised, so speech begins after
about a second instead of waiting for the whole answer. Every piece is cached on disk under
`.cache/tts/`, so repeated advice replays instantly and works offline the second time.

## Deploy it (live link)

The Urdu voice needs the Node server as a proxy — browsers are blocked from calling the
speech endpoint directly — so this has to run as a web service, not a static site.

A `render.yaml` blueprint is included, so on [Render](https://render.com):

1. Sign in with GitHub.
2. **New → Blueprint**, and pick the `health-assistant` repository.
3. **Apply**. Render reads `render.yaml`, runs `npm ci`, and starts `node server.js`.

You get a public URL like `https://health-assistant-XXXX.onrender.com` in a few minutes.

Notes on the free plan:

- The service sleeps after ~15 minutes with no traffic, so the first request after a pause
  takes roughly 50 seconds to wake up. Later requests are fast.
- The disk is ephemeral, so the TTS cache resets whenever the service restarts. It refills
  itself as people use the app.
- To turn on AI mode, add `ANTHROPIC_API_KEY` under the service's Environment settings.

Any host that runs a Node process works the same way — the only requirements are
`npm ci`, `node server.js`, and the `PORT` environment variable, which the server honours.

### Optional AI mode

```bash
set ANTHROPIC_API_KEY=sk-ant-...
npm start
```

The "AI mode" toggle then appears in the header. Without a key the app stays in offline mode
and the toggle stays hidden.

## How it works

```
browser (mic / keyboard, EN+UR)
        │
        ▼
POST /api/analyze  ──►  1. red-flag scan     → emergency? stop here, show emergency card
                        2. condition match   → score symptoms against the knowledge base
                        3. safety filter     → drop medicines unsafe for this person
                        4. optional AI pass  → rewording, constrained to the same whitelist
                        5. render both langs → plus a condensed script for the voice reply
```

The engine is a pure function, so it is simply run twice — once per language — which
guarantees the English and Urdu answers describe the same assessment rather than two
independent ones. In AI mode the model returns every field as an `{en, ur}` pair in a
single call, so the two languages cannot drift apart.

| File | Role |
| --- | --- |
| `lib/redflags.js` | 13 emergency patterns (cardiac, stroke, bleeding, anaphylaxis, self-harm…) with Pakistani helpline numbers |
| `lib/conditions.js` | 34 common conditions: keywords, advice, and "see a doctor if" triggers, all in English and Urdu |
| `lib/medicines.js` | 29 OTC medicines with adult doses, daily limits, cautions and common local brands |
| `lib/engine.js` | Language detection (script + Roman Urdu), matching, context extraction, and the medicine safety filter |
| `lib/ai.js` | Optional Claude pass, restricted to the medicine whitelist |
| `lib/tts.js` | Server-side speech for languages the device has no voice for, with chunking and a disk cache |
| `server.js` | Express API and static hosting |
| `public/` | The bilingual UI, speech input and speech output |

## Safety rules built into the code

These are enforced in code, not left to a prompt:

- **Emergencies short-circuit everything.** If a red flag matches, no self-care advice or
  medicine is shown, and the request is never sent to the AI model.
- **No antibiotics, steroids, sleeping pills, or any prescription-only drug** is ever
  suggested. If the user asks for one by name, the app explains why they need a doctor.
- **Context-based filtering.** Mentioning pregnancy, a child, an ulcer, asthma, kidney or
  liver disease, high blood pressure, or old age removes the medicines that are unsafe in
  that situation and explains what was removed and why.
- **Dengue overrides.** If dengue is suspected, ibuprofen and diclofenac are removed
  because of bleeding risk, and only paracetamol is offered.
- **The AI cannot invent a medicine.** It may only return keys from the vetted whitelist;
  the server maps those keys back to the same dose and caution text used offline. Anything
  outside the list is dropped.
- Every answer carries a disclaimer that this is not a diagnosis.

## Known limits

- Language detection is automatic for typed text. **The microphone is different**: the Web
  Speech API has to be told which language to listen for and cannot detect it itself, so in
  Auto mode it listens in whichever language was last detected (English to begin with). If
  you dictate in Urdu, pick اردو first — otherwise the transcript comes back as rough Latin.
  Roman Urdu in that transcript is still detected, so the answer usually still comes back in
  Urdu, but recognition accuracy is much better with اردو selected.
- Urdu speech recognition quality depends on the browser; Chrome supports `ur-PK` but
  accuracy varies. Typing always works as a fallback.
- Urdu voice output needs an internet connection the first time a given script is spoken,
  because it is synthesised server-side. After that it is served from the local cache.
- Server-side speech uses Google's public translate-TTS endpoint. It needs no API key, but
  it is not a contracted service, so it can rate-limit or change. If it fails, the app says
  so and the written answer is unaffected. Swapping in a paid provider means changing one
  function in `lib/tts.js`.
- The spoken reply is a condensed version of the page: causes, what to do, the first three
  medicines with their doses, and when to see a doctor. Full cautions stay on screen,
  because reading every one aloud would take minutes.
- The condition list covers common primary-care complaints, not rare or specialist disease.
