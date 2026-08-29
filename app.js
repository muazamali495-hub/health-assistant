'use strict';

/**
 * The Express app itself, with no server attached. `server.js` runs it as a
 * long-lived process locally and in Docker; `api/index.js` hands the same app
 * to a serverless platform. Keeping them apart means one set of routes.
 */

const path = require('path');
const express = require('express');

const engine = require('./lib/engine');
const ai = require('./lib/ai');
const tts = require('./lib/tts');
const { MEDICINES } = require('./lib/medicines');
const { EMERGENCY_CONTACTS } = require('./lib/redflags');

const app = express();

app.use(express.json({ limit: '32kb' }));
app.use(express.static(path.join(__dirname, 'public')));

const LANGS = ['en', 'ur'];

/** Turn a medicine key into the display record for one language. */
function renderMedicine(key, lang) {
  const m = MEDICINES[key];
  if (!m) return null;
  return {
    key,
    generic: lang === 'ur' ? `${m.generic_ur} (${m.generic})` : m.generic,
    spokenName: lang === 'ur' ? m.generic_ur : m.generic,
    brands: m.brands,
    form: m.form,
    dose: lang === 'ur' ? m.adultDose_ur : m.adultDose,
    maxDaily: lang === 'ur' ? m.maxDaily_ur : m.maxDaily,
    cautions: lang === 'ur' ? m.cautions_ur : m.cautions
  };
}

const dedupe = (arr) => [...new Set(arr.filter(Boolean))];

/** Flatten one language's engine result into the shape the UI renders. */
function normalizeOffline(result) {
  const advice = result.noMatch
    ? result.generalAdvice
    : dedupe([
      ...result.conditions[0].advice,
      ...(result.conditions[1] ? result.conditions[1].advice.slice(0, 1) : [])
    ]).slice(0, 6);

  return {
    summary: null,
    conditions: result.conditions.map((c) => ({
      name: c.name,
      confidence: c.confidence,
      why: null
    })),
    advice,
    medicines: result.medicines.map((m) => ({ ...m, spokenName: m.generic })),
    seeDoctorIf: dedupe(result.conditions.flatMap((c) => c.seeDoctorIf)).slice(0, 5),
    notes: result.notes,
    followUps: result.followUps,
    noMatch: result.noMatch
  };
}

/* ------------------------------------------------------------------ *
 * Spoken script
 *
 * The voice answer is a condensed version of the page: cause, what to do,
 * what to take, and when to see a doctor. Reading every caution aloud would
 * take minutes, so cautions stay on screen only.
 * ------------------------------------------------------------------ */

const SPEECH_LABELS = {
  en: {
    causes: 'This could be',
    advice: 'What you should do.',
    meds: 'Medicines you can consider.',
    doctor: 'See a doctor if',
    closing: 'Remember, this is general advice, not a diagnosis. If you feel worse, please see a doctor.',
    emergencyContacts: 'Emergency numbers are',
    join: ', ',
    stop: '.'
  },
  ur: {
    causes: 'یہ ممکنہ طور پر یہ ہو سکتا ہے',
    advice: 'آپ کو یہ کرنا چاہیے۔',
    meds: 'آپ یہ دوائیں لے سکتے ہیں۔',
    doctor: 'ڈاکٹر سے رجوع کریں اگر',
    closing: 'یاد رکھیں، یہ عام مشورہ ہے، تشخیص نہیں۔ طبیعت بگڑے تو ڈاکٹر کو دکھائیں۔',
    emergencyContacts: 'ایمرجنسی نمبر یہ ہیں',
    join: '، ',
    stop: '۔'
  }
};

function buildSpeech(answer, lang) {
  const L = SPEECH_LABELS[lang];
  const parts = [];

  if (answer.summary) parts.push(answer.summary);

  if (answer.conditions.length) {
    parts.push(`${L.causes}: ${answer.conditions.map((c) => c.name).join(L.join)}${L.stop}`);
  }

  if (answer.advice.length) {
    parts.push(L.advice);
    answer.advice.slice(0, 4).forEach((a) => parts.push(a));
  }

  if (answer.notes.length) parts.push(answer.notes[0]);

  if (answer.medicines.length) {
    parts.push(L.meds);
    answer.medicines.slice(0, 2).forEach((m) => parts.push(`${m.spokenName}${L.stop} ${m.dose}`));
  }

  if (answer.seeDoctorIf.length) {
    parts.push(`${L.doctor}: ${answer.seeDoctorIf.slice(0, 2).join(L.join)}${L.stop}`);
  }

  parts.push(L.closing);
  return parts.join(' ');
}

function buildEmergencySpeech(messages, contacts, lang) {
  const L = SPEECH_LABELS[lang];
  return `${messages.join(' ')} ${L.emergencyContacts}: ${contacts.join(L.join)}${L.stop}`;
}

/* ------------------------------------------------------------------ *
 * Routes
 * ------------------------------------------------------------------ */

app.get('/api/status', (req, res) => {
  res.json({
    ok: true,
    aiAvailable: ai.isAvailable(),
    model: ai.isAvailable() ? ai.MODEL : null,
    conditions: require('./lib/conditions').CONDITIONS.length,
    medicines: Object.keys(MEDICINES).length
  });
});

/**
 * Voice for languages the browser has no installed voice for. Most Windows
 * desktops have no Urdu voice, so the Urdu answer is synthesised here instead.
 */
/**
 * Split the script the same way the synthesiser will. The client fetches the
 * pieces one at a time and starts playing the first while the rest are still
 * being made, instead of waiting for the whole answer.
 */
app.post('/api/tts/plan', (req, res) => {
  const { text } = req.body || {};
  if (typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'Nothing to speak.' });
  }
  return res.json({ chunks: tts.chunkText(text) });
});

app.post('/api/tts', async (req, res) => {
  const { text, lang } = req.body || {};

  if (typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'Nothing to speak.' });
  }
  if (text.length > 4000) {
    return res.status(400).json({ error: 'Text is too long to speak.' });
  }

  try {
    const { audio, cached, chunks } = await tts.synthesize(text, LANGS.includes(lang) ? lang : 'en');
    res.set('Content-Type', 'audio/mpeg');
    res.set('Content-Length', String(audio.length));
    res.set('Cache-Control', 'public, max-age=86400');
    res.set('X-TTS-Cache', cached ? 'hit' : 'miss');
    res.set('X-TTS-Chunks', String(chunks));
    return res.send(audio);
  } catch (err) {
    console.error('TTS failed:', err.message);
    return res.status(502).json({ error: 'Voice service is unavailable.' });
  }
});

app.post('/api/analyze', async (req, res) => {
  const { text, lang, useAI } = req.body || {};

  if (typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'Please provide a description of the problem.' });
  }
  if (text.length > 4000) {
    return res.status(400).json({ error: 'Description is too long.' });
  }

  const primary = LANGS.includes(lang) ? lang : engine.detectLanguage(text);

  // The engine is a pure function, so running it once per language is cheap
  // and guarantees the two versions describe exactly the same assessment.
  const results = { en: engine.analyze(text, 'en'), ur: engine.analyze(text, 'ur') };

  const disclaimer = { en: results.en.disclaimer, ur: results.ur.disclaimer };

  if (results.en.empty) {
    return res.json({
      lang: primary,
      empty: true,
      message: { en: results.en.message, ur: results.ur.message },
      speech: { en: results.en.message, ur: results.ur.message },
      disclaimer
    });
  }

  if (results.en.emergency) {
    // Match warnings by id so the two languages cannot drift out of step.
    const warnings = results.en.warnings.map((w) => ({
      id: w.id,
      en: w.message,
      ur: (results.ur.warnings.find((u) => u.id === w.id) || {}).message || w.message
    }));
    const contacts = { en: EMERGENCY_CONTACTS.en, ur: EMERGENCY_CONTACTS.ur };

    return res.json({
      lang: primary,
      source: 'offline',
      emergency: true,
      supportive: results.en.supportive === true,
      warnings,
      contacts,
      speech: {
        en: buildEmergencySpeech(warnings.map((w) => w.en), contacts.en, 'en'),
        ur: buildEmergencySpeech(warnings.map((w) => w.ur), contacts.ur, 'ur')
      },
      disclaimer
    });
  }

  const answers = { en: normalizeOffline(results.en), ur: normalizeOffline(results.ur) };
  let source = 'offline';
  let aiError = false;

  if (useAI && ai.isAvailable()) {
    try {
      const enriched = await ai.enrich(text, results);

      if (enriched.emergency) {
        const warnings = [{
          id: 'ai_flagged',
          en: 'What you have described may need urgent medical attention. Please go to the nearest hospital emergency department now, or call Rescue 1122.',
          ur: 'آپ کی بتائی گئی علامات فوری طبی توجہ کی متقاضی لگ رہی ہیں۔ براہِ کرم ابھی قریبی ہسپتال کی ایمرجنسی سے رجوع کریں یا ریسکیو 1122 کو کال کریں۔'
        }];
        const contacts = { en: EMERGENCY_CONTACTS.en, ur: EMERGENCY_CONTACTS.ur };
        return res.json({
          lang: primary,
          source: 'ai',
          emergency: true,
          supportive: false,
          warnings,
          contacts,
          speech: {
            en: buildEmergencySpeech([warnings[0].en], contacts.en, 'en'),
            ur: buildEmergencySpeech([warnings[0].ur], contacts.ur, 'ur')
          },
          disclaimer
        });
      }

      // The model may only pick from the whitelist; doses and cautions still
      // come from our own medicine file, never from the model.
      const medicines = {
        en: enriched.medicineKeys.map((k) => renderMedicine(k, 'en')).filter(Boolean),
        ur: enriched.medicineKeys.map((k) => renderMedicine(k, 'ur')).filter(Boolean)
      };

      for (const l of LANGS) {
        const base = answers[l];
        answers[l] = {
          summary: enriched.summary[l] || null,
          conditions: enriched.conditions.length
            ? enriched.conditions.map((c) => ({
              name: c.name[l], confidence: c.confidence, why: c.why ? c.why[l] : null
            }))
            : base.conditions,
          advice: enriched.advice.length ? enriched.advice.map((a) => a[l]) : base.advice,
          medicines: medicines[l].length ? medicines[l] : base.medicines,
          seeDoctorIf: enriched.seeDoctorIf.length ? enriched.seeDoctorIf.map((s) => s[l]) : base.seeDoctorIf,
          notes: base.notes,
          followUps: enriched.followUps.length ? enriched.followUps.map((f) => f[l]) : base.followUps,
          noMatch: false
        };
      }
      source = 'ai';
    } catch (err) {
      console.error('AI enrichment failed, serving offline result:', err.message);
      aiError = true;
    }
  }

  return res.json({
    lang: primary,
    source,
    aiError,
    emergency: false,
    understood: results[primary].understood,
    answers,
    speech: { en: buildSpeech(answers.en, 'en'), ur: buildSpeech(answers.ur, 'ur') },
    disclaimer
  });
});

module.exports = app;
