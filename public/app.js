'use strict';

/* ------------------------------------------------------------------ *
 * Interface text
 * ------------------------------------------------------------------ */

const I18N = {
  en: {
    label: 'English',
    autoLabel: 'Auto',
    voiceSpeed: 'Voice speed',
    detected: 'Detected',
    urduDictationHint: 'For dictating in Urdu, choose اردو so the microphone listens in Urdu.',
    appTitle: 'Health Assistant',
    tagline: 'Describe your problem by voice or text',
    aiMode: 'AI mode',
    inputLabel: 'Describe your problem',
    placeholder: 'For example: I have had fever and a sore throat for two days',
    speak: 'Speak',
    listening: 'Listening…',
    analyze: 'Get advice',
    clear: 'Clear',
    tryLabel: 'Try:',
    analyzing: 'Looking at your symptoms…',
    emergencyTitle: 'Get medical help now',
    supportTitle: 'Please talk to someone',
    emergencyContacts: 'Emergency numbers',
    summaryTitle: 'What I understood',
    conditionsTitle: 'Possible causes',
    adviceTitle: 'What to do',
    medicinesTitle: 'Safe over-the-counter options',
    doctorTitle: 'See a doctor if',
    notesTitle: 'Important for your situation',
    followTitle: 'To give better advice, tell me',
    dose: 'Dose',
    maxDaily: 'Limit',
    brands: 'Common brands',
    cautions: 'Cautions',
    listen: 'Listen',
    stopListen: 'Stop',
    speaking: 'Reading the answer aloud…',
    preparing: 'Preparing the voice…',
    micUnsupported: 'Voice input is not supported in this browser. Please use Google Chrome or Microsoft Edge, and type in the meantime.',
    micDenied: 'Microphone access was blocked. Allow it in the browser address bar, then try again.',
    micError: 'Could not hear anything. Please try again or type instead.',
    ttsFailed: 'The voice could not be played. Check your internet connection, or read the answer on screen.',
    aiFailed: 'AI mode was unavailable, so this answer comes from the built-in medical guide.',
    empty: 'Please describe your problem first.',
    error: 'Something went wrong. Please try again.',
    sourceOffline: 'Built-in guide',
    sourceAI: 'AI assisted',
    footerDisclaimer: 'This assistant gives general health information only. It is not a doctor and cannot diagnose you.',
    examples: [
      'I have had fever and body ache for two days',
      'Burning in my chest after eating',
      'Loose motions since morning',
      'Severe headache and my eyes hurt'
    ]
  },
  ur: {
    label: 'اردو',
    autoLabel: 'خودکار',
    voiceSpeed: 'آواز کی رفتار',
    detected: 'پہچانی گئی زبان',
    urduDictationHint: 'اردو بولنے کے لیے اردو کا انتخاب کریں تاکہ مائیکروفون اردو سنے۔',
    appTitle: 'ہیلتھ اسسٹنٹ',
    tagline: 'اپنی تکلیف بول کر یا لکھ کر بتائیں',
    aiMode: 'اے آئی موڈ',
    inputLabel: 'اپنی تکلیف بتائیں',
    placeholder: 'مثلاً: مجھے دو دن سے بخار اور گلے میں درد ہے',
    speak: 'بولیں',
    listening: 'سن رہا ہوں…',
    analyze: 'مشورہ لیں',
    clear: 'صاف کریں',
    tryLabel: 'مثالیں:',
    analyzing: 'آپ کی علامات دیکھی جا رہی ہیں…',
    emergencyTitle: 'فوری طبی مدد حاصل کریں',
    supportTitle: 'براہِ کرم کسی سے بات کریں',
    emergencyContacts: 'ایمرجنسی نمبر',
    summaryTitle: 'میں نے یہ سمجھا',
    conditionsTitle: 'ممکنہ وجوہات',
    adviceTitle: 'کیا کرنا چاہیے',
    medicinesTitle: 'محفوظ عام دستیاب دوائیں',
    doctorTitle: 'ڈاکٹر سے رجوع کریں اگر',
    notesTitle: 'آپ کی صورتحال کے لیے اہم',
    followTitle: 'بہتر مشورے کے لیے یہ بتائیں',
    dose: 'خوراک',
    maxDaily: 'حد',
    brands: 'عام برانڈ',
    cautions: 'احتیاط',
    listen: 'سنیں',
    stopListen: 'روکیں',
    speaking: 'جواب پڑھ کر سنایا جا رہا ہے…',
    preparing: 'آواز تیار کی جا رہی ہے…',
    micUnsupported: 'اس براؤزر میں آواز سے ان پٹ دستیاب نہیں۔ براہِ کرم گوگل کروم یا مائیکروسافٹ ایج استعمال کریں، فی الحال لکھ کر بتائیں۔',
    micDenied: 'مائیکروفون کی اجازت نہیں ملی۔ براؤزر کے ایڈریس بار سے اجازت دیں اور دوبارہ کوشش کریں۔',
    micError: 'آواز سنائی نہیں دی۔ دوبارہ کوشش کریں یا لکھ کر بتائیں۔',
    ttsFailed: 'آواز نہیں چل سکی۔ انٹرنیٹ کنکشن چیک کریں، یا جواب اسکرین پر پڑھ لیں۔',
    aiFailed: 'اے آئی موڈ دستیاب نہیں تھا، اس لیے یہ جواب اندرونی طبی رہنما سے دیا گیا ہے۔',
    empty: 'براہِ کرم پہلے اپنی تکلیف بتائیں۔',
    error: 'کچھ مسئلہ ہو گیا۔ دوبارہ کوشش کریں۔',
    sourceOffline: 'اندرونی رہنما',
    sourceAI: 'اے آئی کی مدد سے',
    footerDisclaimer: 'یہ اسسٹنٹ صرف عام صحت سے متعلق معلومات دیتا ہے۔ یہ ڈاکٹر نہیں ہے اور تشخیص نہیں کر سکتا۔',
    examples: [
      'مجھے دو دن سے بخار اور جسم میں درد ہے',
      'کھانے کے بعد سینے میں جلن ہوتی ہے',
      'صبح سے دست لگے ہوئے ہیں',
      'شدید سر درد ہے اور آنکھیں دکھ رہی ہیں'
    ]
  }
};

/**
 * `langMode` is what the user picked: 'auto', 'en' or 'ur'. In auto mode the
 * language of each answer is detected from what was actually written or said,
 * and `uiLang` follows it. Answers are always shown in both languages either
 * way - the language decides which comes first and which is spoken.
 */
let langMode = 'auto';
let uiLang = 'en';
const t = (key) => I18N[uiLang][key];

/** Playback speed for both the built-in voices and the server audio. */
let voiceSpeed = 1.4;

/* ------------------------------------------------------------------ *
 * Elements
 * ------------------------------------------------------------------ */

const el = {
  input: document.getElementById('symptomInput'),
  micBtn: document.getElementById('micBtn'),
  micLabel: document.getElementById('micLabel'),
  micStatus: document.getElementById('micStatus'),
  analyzeBtn: document.getElementById('analyzeBtn'),
  clearBtn: document.getElementById('clearBtn'),
  results: document.getElementById('results'),
  examples: document.getElementById('examples'),
  aiToggle: document.getElementById('aiToggle'),
  aiToggleWrap: document.getElementById('aiToggleWrap'),
  langBtns: document.querySelectorAll('.lang-btn'),
  autoLangBtn: document.getElementById('autoLangBtn'),
  speedSelect: document.getElementById('speedSelect')
};

/* ------------------------------------------------------------------ *
 * Language switching
 * ------------------------------------------------------------------ */

/** Repaint the interface in `next` without touching the user's mode choice. */
function paintInterface(next) {
  uiLang = next;
  document.documentElement.lang = next === 'ur' ? 'ur' : 'en';
  document.documentElement.dir = next === 'ur' ? 'rtl' : 'ltr';
  document.body.classList.toggle('ur', next === 'ur');

  document.querySelectorAll('[data-i18n]').forEach((node) => {
    const key = node.getAttribute('data-i18n');
    if (I18N[next][key]) node.textContent = I18N[next][key];
  });

  el.input.placeholder = t('placeholder');
  el.micLabel.textContent = recognizing ? t('listening') : t('speak');
  // In auto mode the button shows which language was last detected.
  el.autoLangBtn.textContent = langMode === 'auto'
    ? `${t('autoLabel')} · ${I18N[next].label}`
    : t('autoLabel');

  el.langBtns.forEach((b) => b.classList.toggle('active', b.dataset.lang === langMode));
  renderExamples();
}

function setLanguageMode(mode) {
  langMode = mode;
  paintInterface(mode === 'ur' ? 'ur' : 'en');
  el.results.innerHTML = '';
  el.micStatus.textContent = '';
  stopSpeaking();
}

el.langBtns.forEach((btn) => {
  btn.addEventListener('click', () => setLanguageMode(btn.dataset.lang));
});

/** The language the microphone should listen in. */
function recognitionLanguage() {
  if (langMode === 'ur') return 'ur-PK';
  if (langMode === 'en') return 'en-US';
  // The Web Speech API needs one language up front and cannot auto-detect, so
  // auto mode follows whatever was last detected (Urdu speech typed back as
  // Roman Urdu is still detected correctly from the transcript).
  return uiLang === 'ur' ? 'ur-PK' : 'en-US';
}

/* ------------------------------------------------------------------ *
 * Voice speed
 * ------------------------------------------------------------------ */

function applyVoiceSpeed(value) {
  voiceSpeed = Number(value) || 1.4;
  el.speedSelect.value = String(voiceSpeed);
  try { localStorage.setItem('voiceSpeed', String(voiceSpeed)); } catch { /* private mode */ }
  // Take effect straight away if something is already playing.
  if (currentAudio) currentAudio.playbackRate = voiceSpeed;
}

el.speedSelect.addEventListener('change', () => applyVoiceSpeed(el.speedSelect.value));

function renderExamples() {
  el.examples.innerHTML = '';
  t('examples').forEach((text) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip';
    chip.textContent = text;
    chip.addEventListener('click', () => {
      el.input.value = text;
      spokenInput = false;
      el.input.focus();
      analyze();
    });
    el.examples.appendChild(chip);
  });
}

/* ------------------------------------------------------------------ *
 * Speech recognition (microphone input)
 * ------------------------------------------------------------------ */

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let recognizing = false;
let finalTranscript = '';

/** True when the current text came from the microphone, not the keyboard. */
let spokenInput = false;
/** The Urdu-dictation hint is worth saying once, not on every recording. */
let hintShown = false;

function setMicState(on) {
  recognizing = on;
  el.micBtn.setAttribute('aria-pressed', String(on));
  el.micLabel.textContent = on ? t('listening') : t('speak');
}

function startRecognition() {
  if (!SpeechRecognition) {
    el.micStatus.textContent = t('micUnsupported');
    return;
  }

  stopSpeaking();

  recognition = new SpeechRecognition();
  recognition.lang = recognitionLanguage();

  if (langMode === 'auto' && recognition.lang === 'en-US' && !hintShown) {
    hintShown = true;
    el.micStatus.textContent = t('urduDictationHint');
  }
  recognition.continuous = true;
  recognition.interimResults = true;

  finalTranscript = el.input.value ? el.input.value.trim() + ' ' : '';

  recognition.onstart = () => {
    setMicState(true);
    el.micStatus.textContent = t('listening');
  };

  recognition.onresult = (event) => {
    let interim = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const chunk = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += chunk + ' ';
        spokenInput = true; // answer this one out loud
      } else {
        interim += chunk;
      }
    }
    el.input.value = (finalTranscript + interim).trim();
  };

  recognition.onerror = (event) => {
    if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
      el.micStatus.textContent = t('micDenied');
    } else if (event.error !== 'aborted' && event.error !== 'no-speech') {
      el.micStatus.textContent = t('micError');
    }
    setMicState(false);
  };

  recognition.onend = () => {
    setMicState(false);
    if (el.micStatus.textContent === t('listening')) el.micStatus.textContent = '';
    // Speaking a complaint and then waiting for a button is unnatural, so a
    // finished dictation submits by itself.
    if (spokenInput && el.input.value.trim()) analyze();
  };

  try {
    recognition.start();
  } catch {
    el.micStatus.textContent = t('micError');
    setMicState(false);
  }
}

function stopRecognition() {
  if (recognition) recognition.stop();
  setMicState(false);
}

el.micBtn.addEventListener('click', () => {
  if (recognizing) stopRecognition();
  else startRecognition();
});

// Typing replaces a dictated complaint, so the answer goes back to text only.
el.input.addEventListener('input', () => { if (!recognizing) spokenInput = false; });

/* ------------------------------------------------------------------ *
 * Speech synthesis (the voice answer)
 * ------------------------------------------------------------------ */

let speakingButton = null;
let currentAudio = null;
/** Guards against an older request finishing after the user started another. */
let speakToken = 0;

/** Chrome fills the voice list asynchronously; wait for it once. */
function ensureVoices() {
  if (!window.speechSynthesis) return Promise.resolve([]);
  const voices = window.speechSynthesis.getVoices();
  if (voices.length) return Promise.resolve(voices);

  return new Promise((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      resolve(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.addEventListener('voiceschanged', finish, { once: true });
    setTimeout(finish, 1200);
  });
}

function pickVoice(voices, target) {
  return voices.find((v) => v.lang && v.lang.toLowerCase().startsWith(target)) || null;
}

function resetSpeakButton(btn) {
  if (btn) btn.textContent = btn.dataset.idle;
}

function clearSpokenStatus() {
  const status = el.micStatus.textContent;
  if (status === t('speaking') || status === t('preparing')) el.micStatus.textContent = '';
}

function stopSpeaking() {
  speakToken++;
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  if (currentAudio) {
    currentAudio.pause();
    URL.revokeObjectURL(currentAudio.src);
    currentAudio = null;
  }
  resetSpeakButton(speakingButton);
  speakingButton = null;
  clearSpokenStatus();
}

/**
 * Ask the server to synthesise the audio. Used when the device has no voice
 * for this language, which on most Windows machines is the case for Urdu.
 */
/** Play one audio blob to completion. Resolves on end, error, or stop. */
function playBlob(blob) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.playbackRate = voiceSpeed;
    currentAudio = audio;

    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      URL.revokeObjectURL(url);
      if (currentAudio === audio) currentAudio = null;
      resolve();
    };

    audio.onended = done;
    audio.onerror = done;
    // stopSpeaking() pauses the element, which must also release the wait.
    audio.onpause = () => { if (!audio.ended) done(); };

    audio.play().catch(done);
  });
}

function fetchChunkAudio(text, lang) {
  return fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, lang })
  }).then((r) => {
    if (!r.ok) throw new Error(`tts ${r.status}`);
    return r.blob();
  });
}

async function speakViaServer(text, lang, button) {
  const token = speakToken;
  if (button) button.textContent = button.dataset.loading;
  el.micStatus.textContent = t('preparing');

  const finish = () => {
    if (speakingButton === button) speakingButton = null;
    resetSpeakButton(button);
    clearSpokenStatus();
  };

  try {
    const planRes = await fetch('/api/tts/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    if (!planRes.ok) throw new Error(`plan ${planRes.status}`);

    const { chunks } = await planRes.json();
    if (token !== speakToken) return; // the user moved on while we waited
    if (!chunks || !chunks.length) throw new Error('nothing to speak');

    // Fetch the next piece while the current one is playing, so speech starts
    // after the first short request rather than after the whole answer.
    let pending = fetchChunkAudio(chunks[0], lang);

    for (let i = 0; i < chunks.length; i++) {
      const blob = await pending;
      if (token !== speakToken) return;

      pending = i + 1 < chunks.length ? fetchChunkAudio(chunks[i + 1], lang) : null;

      if (i === 0) {
        if (button) button.textContent = button.dataset.busy;
        el.micStatus.textContent = t('speaking');
      }

      await playBlob(blob);
      if (token !== speakToken) return;
    }

    finish();
  } catch (err) {
    if (token !== speakToken) return;
    console.error('Voice playback failed:', err);
    el.micStatus.textContent = t('ttsFailed');
    if (speakingButton === button) speakingButton = null;
    resetSpeakButton(button);
  }
}

/**
 * Read `text` aloud in `lang`. A voice installed on the device is preferred
 * because it is instant and works offline; otherwise the server synthesises
 * the audio. Clicking the button that is already speaking stops it; clicking
 * a different one switches over.
 */
async function speak(text, lang, button) {
  if (!text) return;

  const wasSpeaking = speakingButton;
  stopSpeaking();
  if (wasSpeaking && wasSpeaking === button) return;

  const token = ++speakToken;
  speakingButton = button || null;

  const voices = await ensureVoices();
  if (token !== speakToken) return;

  const voice = pickVoice(voices, lang === 'ur' ? 'ur' : 'en');

  if (!voice || !window.speechSynthesis) {
    await speakViaServer(text, lang, button);
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang === 'ur' ? 'ur-PK' : 'en-US';
  utterance.voice = voice;
  utterance.rate = Math.min(voiceSpeed, 2);

  const finish = () => {
    if (speakingButton === button) speakingButton = null;
    resetSpeakButton(button);
    clearSpokenStatus();
  };
  utterance.onend = finish;
  utterance.onerror = finish;

  if (button) button.textContent = button.dataset.busy;
  el.micStatus.textContent = t('speaking');
  window.speechSynthesis.speak(utterance);
}

/* ------------------------------------------------------------------ *
 * Rendering helpers
 *
 * Every result is rendered twice - once per language - so `L` is the label
 * set for the block being built, not the interface language.
 * ------------------------------------------------------------------ */

function card(title, bodyNode, className) {
  const wrap = document.createElement('section');
  wrap.className = 'card' + (className ? ' ' + className : '');

  const head = document.createElement('div');
  head.className = 'card-head';
  const h = document.createElement('h2');
  h.textContent = title;
  head.appendChild(h);

  const body = document.createElement('div');
  body.className = 'card-body';
  body.appendChild(bodyNode);

  wrap.append(head, body);
  return wrap;
}

function list(items, className) {
  const ul = document.createElement('ul');
  if (className) ul.className = className;
  items.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    ul.appendChild(li);
  });
  return ul;
}

/** The banner that heads each language block, with its own listen button. */
function languageBanner(lang, speechText, sourceBadge) {
  const L = I18N[lang];
  const bar = document.createElement('div');
  bar.className = 'lang-banner';

  const name = document.createElement('span');
  name.className = 'lang-name';
  name.textContent = L.label;
  bar.appendChild(name);

  if (sourceBadge) bar.appendChild(sourceBadge);

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'btn btn-small speak-btn';
  btn.dataset.idle = `🔊 ${L.listen}`;
  btn.dataset.busy = `■ ${L.stopListen}`;
  btn.dataset.loading = `… ${L.preparing}`;
  btn.textContent = btn.dataset.idle;
  btn.addEventListener('click', () => speak(speechText, lang, btn));
  bar.appendChild(btn);

  return { bar, btn };
}

function renderMedicineCard(med, L) {
  const wrap = document.createElement('div');
  wrap.className = 'med';

  const name = document.createElement('p');
  name.className = 'med-name';
  name.textContent = med.generic;
  wrap.appendChild(name);

  if (med.brands && med.brands.length && med.brands[0] !== '-') {
    const brands = document.createElement('p');
    brands.className = 'med-brands';
    brands.textContent = `${L.brands}: ${med.brands.join(', ')}`;
    wrap.appendChild(brands);
  }

  const dl = document.createElement('dl');
  [[L.dose, med.dose], [L.maxDaily, med.maxDaily]].forEach(([label, value]) => {
    if (!value || value === '-') return;
    const row = document.createElement('div');
    row.className = 'med-row';
    const dt = document.createElement('dt');
    dt.textContent = label;
    const dd = document.createElement('dd');
    dd.textContent = value;
    row.append(dt, dd);
    dl.appendChild(row);
  });
  wrap.appendChild(dl);

  if (med.cautions && med.cautions.length) {
    const box = document.createElement('div');
    box.className = 'med-cautions';
    const strong = document.createElement('strong');
    strong.textContent = L.cautions;
    box.append(strong, list(med.cautions));
    wrap.appendChild(box);
  }

  return wrap;
}

/* ------------------------------------------------------------------ *
 * Blocks
 * ------------------------------------------------------------------ */

function buildAnswerBlock(data, lang) {
  const L = I18N[lang];
  const answer = data.answers[lang];

  const block = document.createElement('div');
  block.className = `lang-block lang-${lang}`;
  block.lang = lang;
  block.dir = lang === 'ur' ? 'rtl' : 'ltr';

  const badge = document.createElement('span');
  badge.className = 'badge ' + (data.source === 'ai' ? 'high' : 'low');
  badge.textContent = data.source === 'ai' ? L.sourceAI : L.sourceOffline;

  const { bar, btn } = languageBanner(lang, data.speech[lang], badge);
  block.appendChild(bar);

  if (answer.summary) {
    const p = document.createElement('p');
    p.className = 'summary';
    p.textContent = answer.summary;
    block.appendChild(card(L.summaryTitle, p));
  }

  if (answer.conditions.length) {
    const ul = document.createElement('ul');
    ul.className = 'cond-list';
    answer.conditions.forEach((c) => {
      const li = document.createElement('li');
      const name = document.createElement('span');
      name.className = 'cond-name';
      name.textContent = c.name;
      const b = document.createElement('span');
      b.className = 'badge ' + (c.confidence || 'low');
      b.textContent = c.confidence || 'low';
      li.append(name, b);
      if (c.why) {
        const why = document.createElement('span');
        why.className = 'cond-why';
        why.textContent = c.why;
        li.appendChild(why);
      }
      ul.appendChild(li);
    });
    block.appendChild(card(L.conditionsTitle, ul));
  }

  if (answer.advice.length) block.appendChild(card(L.adviceTitle, list(answer.advice)));

  if (answer.notes.length) {
    const box = document.createElement('div');
    answer.notes.forEach((n) => {
      const div = document.createElement('div');
      div.className = 'note';
      div.textContent = n;
      box.appendChild(div);
    });
    block.appendChild(card(L.notesTitle, box));
  }

  if (answer.medicines.length) {
    const box = document.createElement('div');
    answer.medicines.forEach((m) => box.appendChild(renderMedicineCard(m, L)));
    block.appendChild(card(L.medicinesTitle, box));
  }

  if (answer.seeDoctorIf.length) {
    block.appendChild(card(L.doctorTitle, list(answer.seeDoctorIf, 'doctor-list')));
  }

  if (answer.followUps.length) {
    const box = document.createElement('div');
    box.className = 'followups';
    answer.followUps.forEach((q) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'chip';
      chip.textContent = q;
      chip.addEventListener('click', () => {
        el.input.value = el.input.value.trim() + ' — ' + q + ' ';
        spokenInput = false;
        el.input.focus();
      });
      box.appendChild(chip);
    });
    block.appendChild(card(L.followTitle, box));
  }

  const disc = document.createElement('p');
  disc.className = 'disclaimer';
  disc.textContent = data.disclaimer[lang];
  block.appendChild(disc);

  return { block, btn };
}

function buildEmergencyBlock(data, lang) {
  const L = I18N[lang];

  const block = document.createElement('div');
  block.className = `lang-block lang-${lang}`;
  block.lang = lang;
  block.dir = lang === 'ur' ? 'rtl' : 'ltr';

  const { bar, btn } = languageBanner(lang, data.speech[lang], null);
  block.appendChild(bar);

  const body = document.createElement('div');
  data.warnings.forEach((w) => {
    const p = document.createElement('p');
    p.className = 'emergency-msg';
    p.textContent = w[lang];
    body.appendChild(p);
  });

  const label = document.createElement('strong');
  label.textContent = L.emergencyContacts;
  body.appendChild(label);

  const ul = document.createElement('ul');
  ul.className = 'contacts';
  data.contacts[lang].forEach((c) => {
    const li = document.createElement('li');
    li.textContent = c;
    ul.appendChild(li);
  });
  body.appendChild(ul);

  block.appendChild(card(
    data.supportive ? L.supportTitle : L.emergencyTitle,
    body,
    data.supportive ? 'support' : 'emergency'
  ));

  return { block, btn };
}

/* ------------------------------------------------------------------ *
 * Result rendering
 * ------------------------------------------------------------------ */

function renderResult(data, speakAloud) {
  // Auto mode: follow the language the person actually used.
  if (langMode === 'auto' && data.lang && data.lang !== uiLang) paintInterface(data.lang);

  el.results.innerHTML = '';

  if (data.empty) {
    const p = document.createElement('p');
    p.textContent = data.message[uiLang];
    el.results.appendChild(card(I18N[uiLang].summaryTitle, p));
    return;
  }

  // The language the user used comes first; the other follows underneath.
  const order = data.lang === 'ur' ? ['ur', 'en'] : ['en', 'ur'];
  const build = data.emergency ? buildEmergencyBlock : buildAnswerBlock;

  let primaryButton = null;
  order.forEach((lang) => {
    const { block, btn } = build(data, lang);
    if (lang === data.lang) primaryButton = btn;
    el.results.appendChild(block);
  });

  if (data.aiError) el.micStatus.textContent = t('aiFailed');

  // Spoken question, spoken answer - in the language they spoke.
  if (speakAloud && data.speech && data.speech[data.lang]) {
    el.micStatus.textContent = t('speaking');
    speak(data.speech[data.lang], data.lang, primaryButton);
  }
}

/* ------------------------------------------------------------------ *
 * Analyze
 * ------------------------------------------------------------------ */

async function analyze() {
  const text = el.input.value.trim();
  if (!text) {
    el.micStatus.textContent = t('empty');
    return;
  }

  const speakAloud = spokenInput;
  spokenInput = false;

  if (recognizing) stopRecognition();
  stopSpeaking();
  el.micStatus.textContent = '';
  el.analyzeBtn.disabled = true;

  el.results.innerHTML =
    `<div class="card"><div class="loading"><div class="spinner"></div>${t('analyzing')}</div></div>`;

  try {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        lang: langMode === 'auto' ? undefined : langMode,
        useAI: el.aiToggle.checked
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'request failed');
    renderResult(data, speakAloud);
  } catch (err) {
    el.results.innerHTML = '';
    const p = document.createElement('p');
    p.textContent = t('error');
    el.results.appendChild(card(t('summaryTitle'), p));
    console.error(err);
  } finally {
    el.analyzeBtn.disabled = false;
  }
}

el.analyzeBtn.addEventListener('click', analyze);
el.clearBtn.addEventListener('click', () => {
  el.input.value = '';
  el.results.innerHTML = '';
  el.micStatus.textContent = '';
  spokenInput = false;
  stopSpeaking();
  el.input.focus();
});

el.input.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') analyze();
});

/* ------------------------------------------------------------------ *
 * Startup
 * ------------------------------------------------------------------ */

(async function init() {
  let saved = null;
  try { saved = localStorage.getItem('voiceSpeed'); } catch { /* private mode */ }
  applyVoiceSpeed(saved || 1.4);
  setLanguageMode('auto');

  if (!SpeechRecognition) {
    el.micBtn.disabled = true;
    el.micStatus.textContent = t('micUnsupported');
  }
  if (window.speechSynthesis) ensureVoices();

  try {
    const status = await (await fetch('/api/status')).json();
    if (status.aiAvailable) el.aiToggleWrap.classList.remove('hidden');
  } catch {
    /* offline mode is the default anyway */
  }
})();
