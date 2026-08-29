'use strict';

const { CONDITIONS } = require('./conditions');
const { MEDICINES, NEVER_SUGGEST } = require('./medicines');
const { RED_FLAGS, EMERGENCY_CONTACTS } = require('./redflags');

/* ------------------------------------------------------------------ *
 * Text handling
 * ------------------------------------------------------------------ */

const URDU_RANGE = /[؀-ۿ]/;

/**
 * Roman Urdu markers. Plenty of users type Urdu in Latin letters ("mujhe
 * bukhar hai"), which is neither Urdu script nor English, so the script test
 * alone would answer them in the wrong language.
 *
 * `strong` words appear in Urdu and essentially never in English; `weak` ones
 * are Urdu grammar words that are too short to be trusted on their own.
 */
const ROMAN_UR_STRONG = [
  'mujhe', 'mujhy', 'mera', 'meri', 'mere', 'bukhar', 'dard', 'khansi', 'dast',
  'ulti', 'matli', 'peshab', 'khujli', 'zukam', 'nazla', 'tabiyat', 'bimar',
  'kamzori', 'chakkar', 'ilaj', 'dawa', 'dawai', 'jism', 'gala', 'gale', 'pait',
  'saans', 'neend', 'bacha', 'bachi', 'bache', 'garmi', 'sardi', 'marorh',
  'jalan', 'kamar', 'gardan', 'seene', 'behosh', 'khoon', 'balgham', 'chhale',
  'sujan', 'ghabrahat', 'bechaini', 'qabz', 'kabz', 'daant', 'aankh', 'aankhon'
];
const ROMAN_UR_WEAK = [
  'hai', 'hain', 'raha', 'rahi', 'rahe', 'gaya', 'gayi', 'gaye', 'nahi', 'nahin',
  'mein', 'aur', 'bohat', 'bohot', 'zyada', 'thora', 'kya', 'kar', 'karta',
  'hoti', 'hota', 'lag', 'lagi', 'ho', 'se', 'ko', 'ka', 'ki', 'ke'
];

const countMarkers = (words, markers) => markers.filter((m) => words.has(m)).length;

/**
 * Detect the language the user actually used: Urdu script, Roman Urdu, or
 * English. Used whenever the interface is set to auto.
 */
function detectLanguage(text) {
  const raw = String(text || '');
  if (URDU_RANGE.test(raw)) return 'ur';

  const words = new Set(raw.toLowerCase().replace(/[^a-z\s]/g, ' ').split(/\s+/).filter(Boolean));
  const strong = countMarkers(words, ROMAN_UR_STRONG);
  const weak = countMarkers(words, ROMAN_UR_WEAK);

  if (strong >= 2 || (strong >= 1 && weak >= 1)) return 'ur';
  return 'en';
}

/**
 * Normalise for matching: lowercase, strip Urdu diacritics, unify the
 * alef/yeh/heh variants users type inconsistently, and collapse spaces.
 */
function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[ً-ْٰ]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/[ىیي]/g, 'ی')
    .replace(/[ہۃة]/g, 'ه')
    .replace(/[.,!?;:()"'،؟۔]/g, ' ')
    .replace(/\s+/g, ' ')
    // Roman Urdu verbs agree with gender, so the same complaint is written
    // "aa raha hai" or "aa rahi hai". Fold those endings together so one
    // keyword covers both.
    .replace(/\b(raha|rahi|rahe)\b/g, 'rah')
    .replace(/\b(gaya|gayi|gaye)\b/g, 'gay')
    .replace(/\b(hota|hoti|hote)\b/g, 'hot')
    .replace(/\b(lagta|lagti|lagte)\b/g, 'lagt')
    .trim();
}

const isAscii = (s) => /^[\x00-\x7F]+$/.test(s);

/**
 * People rarely use the clinical noun. "my back hurts" and "pain in my ear"
 * mean "back pain" and "ear pain", so derive those forms and append them to
 * the text used for matching. Appending never removes an existing match.
 */
function expandSynonyms(normText) {
  const extra = [];
  const push = (word) => {
    if (!word) return;
    extra.push(`${word} pain`);
    if (word.endsWith('s')) extra.push(`${word.slice(0, -1)} pain`);
  };

  for (const m of normText.matchAll(/([a-z]+)\s+(?:is\s+|are\s+)?(?:hurts?|hurting|aches?|aching)/g)) {
    push(m[1] === 'my' || m[1] === 'the' ? null : m[1]);
  }
  for (const m of normText.matchAll(/pain(?:ful)?\s+(?:in|on)\s+(?:my\s+|the\s+)?([a-z]+)/g)) {
    push(m[1]);
  }
  // Urdu: "دکھ رہا/رہی ہے" is the everyday way of saying something hurts.
  if (/دکھ ر/.test(normText)) extra.push('درد');

  return extra.length ? `${normText} ${extra.join(' ')}` : normText;
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Match one keyword against normalised text. ASCII keywords are matched on
 * word boundaries so "cold" does not fire inside "could"; Urdu-script
 * keywords are matched as substrings because Urdu words join freely.
 */
function hasKeyword(normText, keyword) {
  const k = normalize(keyword);
  if (!k) return false;

  if (isAscii(k)) {
    if (new RegExp(`(^|\\s)${escapeRe(k)}(\\s|$)`).test(normText)) return true;

    // People drop words into the middle of a phrase - "seene mein SHADEED
    // dard" against the keyword "seene mein dard" - so an exact phrase match
    // misses them. Fall back to requiring every meaningful word of the
    // keyword, matched whole, ignoring short glue words like "in" or "aa".
    const words = k.split(' ');
    if (words.length < 2) return false;

    const meaningful = words.filter((w) => w.length >= 4);
    if (meaningful.length < 2) return false;

    return meaningful.every((w) => new RegExp(`(^|\\s)${escapeRe(w)}(\\s|$)`).test(normText));
  }

  if (normText.includes(k)) return true;

  // Urdu script joins freely, so the same allowance is made by substring.
  const parts = k.split(' ');
  return parts.length > 1 && parts.every((p) => normText.includes(p));
}

/** Longer, more specific phrases count for more than single words. */
function keywordWeight(keyword) {
  const words = normalize(keyword).split(' ').length;
  return 1 + (words - 1) * 0.6;
}

/* ------------------------------------------------------------------ *
 * Context extraction
 * ------------------------------------------------------------------ */

const CONTEXT_PATTERNS = {
  pregnancy: ['pregnant', 'pregnancy', 'expecting', 'breastfeeding', 'breast feeding',
    'hamla', 'hamal', 'doodh pilati', 'حاملہ', 'حمل', 'دودھ پلاتی'],
  child: ['my child', 'my son', 'my daughter', 'my baby', 'kid', 'toddler', 'infant', 'year old child',
    'mera beta', 'meri beti', 'bacha', 'bachi', 'bache', 'bachay',
    'بچہ', 'بچی', 'بچے', 'بچوں', 'میرا بیٹا', 'میری بیٹی'],
  elderly: ['my father', 'my mother', 'elderly', 'old age', 'grandfather', 'grandmother',
    'buzurg', 'walid', 'walida', 'بزرگ', 'والد', 'والدہ'],
  diabetes: ['diabetes', 'diabetic', 'sugar patient', 'shugar', 'shooger',
    'ذیابیطس', 'شوگر کا مریض'],
  hypertension: ['blood pressure', 'high bp', 'hypertension', 'bp ka mareez',
    'بلڈ پریشر', 'بی پی'],
  kidneyLiver: ['kidney disease', 'kidney patient', 'liver disease', 'hepatitis', 'dialysis',
    'gurday ka mareez', 'jigar', 'گردے', 'جگر', 'ہیپاٹائٹس'],
  ulcer: ['ulcer', 'stomach ulcer', 'gastric ulcer', 'السر', 'معدے کا السر'],
  asthma: ['asthma', 'inhaler', 'dama', 'دمہ', 'انہیلر']
};

/** People write "two days" far more often than "2 days". */
const WORD_NUMBERS = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  a: 1, an: 1, couple: 2, few: 3, several: 4,
  ایک: 1, دو: 2, تین: 3, چار: 4, پانچ: 5, چھ: 6, سات: 7, آٹھ: 8, نو: 9, دس: 10,
  ek: 1, do: 2, teen: 3, char: 4, panch: 5, chand: 3
};

function digitize(normText) {
  let out = ` ${normText} `;
  for (const [word, value] of Object.entries(WORD_NUMBERS)) {
    out = out.replace(new RegExp(`(\\s)${escapeRe(word)}(\\s)`, 'g'), `$1${value}$2`);
  }
  return out.trim();
}

const DURATION_PATTERNS = [
  { re: /(\d+)\s*(day|days|din)\b/, unit: 'days' },
  { re: /(\d+)\s*(week|weeks|hafta|hafte)\b/, unit: 'weeks' },
  { re: /(\d+)\s*(month|months|mahine|mah)\b/, unit: 'months' },
  { re: /(\d+)\s*(hour|hours|ghante|ghanta)\b/, unit: 'hours' },
  { re: /(\d+)\s*(دن)/, unit: 'days' },
  { re: /(\d+)\s*(ہفت)/, unit: 'weeks' },
  { re: /(\d+)\s*(ماہ|مہین)/, unit: 'months' },
  { re: /(\d+)\s*(گھنٹ)/, unit: 'hours' }
];

const SEVERITY_PATTERNS = {
  severe: ['severe', 'unbearable', 'very bad', 'extreme', 'worst', 'intense', 'shadeed',
    'bohat zyada', 'ناقابل برداشت', 'شدید', 'بہت زیادہ'],
  mild: ['mild', 'slight', 'a little', 'thora', 'halka', 'ہلکا', 'تھوڑا']
};

function extractContext(normText) {
  const flags = {};
  for (const [key, list] of Object.entries(CONTEXT_PATTERNS)) {
    if (list.some((k) => hasKeyword(normText, k))) flags[key] = true;
  }

  let duration = null;
  const withDigits = digitize(normText);
  for (const { re, unit } of DURATION_PATTERNS) {
    const m = withDigits.match(re);
    if (m) { duration = { value: Number(m[1]), unit }; break; }
  }

  let severity = null;
  for (const [level, list] of Object.entries(SEVERITY_PATTERNS)) {
    if (list.some((k) => hasKeyword(normText, k))) { severity = level; break; }
  }

  return { flags, duration, severity };
}

/* ------------------------------------------------------------------ *
 * Red flags
 * ------------------------------------------------------------------ */

function findRedFlags(normText) {
  return RED_FLAGS.filter((flag) => flag.keywords.some((k) => hasKeyword(normText, k)));
}

/* ------------------------------------------------------------------ *
 * Medicine safety filter
 * ------------------------------------------------------------------ */

/** Medicines that must be withheld given the user's context. */
const CONTRA = {
  pregnancy: ['ibuprofen', 'diclofenacGel', 'omeprazole', 'loperamide', 'dimenhydrinate', 'hyoscine', 'oralGel'],
  child: ['ibuprofen', 'loperamide', 'omeprazole', 'oralGel', 'hyoscine', 'diclofenacGel', 'xylometazoline'],
  ulcer: ['ibuprofen', 'diclofenacGel'],
  kidneyLiver: ['ibuprofen', 'diclofenacGel', 'paracetamol'],
  asthma: ['ibuprofen', 'diclofenacGel'],
  hypertension: ['xylometazoline'],
  elderly: ['ibuprofen', 'loperamide']
};

const CONTEXT_NOTES = {
  pregnancy: {
    en: 'Because pregnancy or breastfeeding was mentioned, painkillers other than paracetamol and most stomach medicines have been removed. Confirm every medicine with your doctor before taking it.',
    ur: 'حمل یا دودھ پلانے کا ذکر ہونے کی وجہ سے پیراسیٹامول کے علاوہ درد کش اور زیادہ تر معدے کی دوائیں ہٹا دی گئی ہیں۔ کوئی بھی دوا لینے سے پہلے ڈاکٹر سے تصدیق کریں۔'
  },
  child: {
    en: 'This appears to be about a child. Children need weight-based doses, so no adult tablet doses are shown. Please have a doctor or pharmacist calculate the dose.',
    ur: 'یہ بات بچے کے بارے میں لگتی ہے۔ بچوں کی خوراک وزن کے حساب سے ہوتی ہے، اس لیے بڑوں کی خوراکیں نہیں دکھائی گئیں۔ خوراک ڈاکٹر یا فارماسسٹ سے متعین کروائیں۔'
  },
  ulcer: {
    en: 'Because a stomach ulcer was mentioned, ibuprofen and similar painkillers have been removed - they can cause bleeding.',
    ur: 'معدے کے السر کا ذکر ہونے کی وجہ سے آئبوپروفین جیسی درد کش دوائیں ہٹا دی گئی ہیں، یہ خون بہنے کا سبب بن سکتی ہیں۔'
  },
  kidneyLiver: {
    en: 'Because kidney or liver disease was mentioned, painkiller doses must be set by your doctor. None are recommended here.',
    ur: 'گردے یا جگر کی بیماری کا ذکر ہونے کی وجہ سے درد کش دوا کی خوراک آپ کا ڈاکٹر ہی طے کرے گا۔ یہاں کوئی تجویز نہیں کی گئی۔'
  },
  asthma: {
    en: 'Because asthma was mentioned, ibuprofen-type painkillers have been removed - they trigger attacks in some people with asthma.',
    ur: 'دمے کا ذکر ہونے کی وجہ سے آئبوپروفین قسم کی دوائیں ہٹا دی گئی ہیں، یہ بعض دمے کے مریضوں میں دورہ شروع کر دیتی ہیں۔'
  },
  hypertension: {
    en: 'Because blood pressure was mentioned, decongestant nasal sprays have been removed - they can raise blood pressure.',
    ur: 'بلڈ پریشر کا ذکر ہونے کی وجہ سے ناک کے ڈی کنجسٹنٹ سپرے ہٹا دیے گئے ہیں، یہ بلڈ پریشر بڑھا سکتے ہیں۔'
  },
  elderly: {
    en: 'For an older adult, ibuprofen-type painkillers carry a higher risk to the stomach and kidneys, so they have been left out.',
    ur: 'بزرگ افراد میں آئبوپروفین قسم کی دوائیں معدے اور گردوں کے لیے زیادہ خطرناک ہیں، اس لیے شامل نہیں کی گئیں۔'
  },
  diabetes: {
    en: 'Diabetes was mentioned: avoid sugary syrups and honey-based remedies, and treat any infection or wound as more serious than usual.',
    ur: 'ذیابیطس کا ذکر ہے: میٹھے شربت اور شہد والے نسخوں سے پرہیز کریں، اور کسی بھی انفیکشن یا زخم کو معمول سے زیادہ سنجیدہ لیں۔'
  }
};

function filterMedicines(medKeys, contextFlags, conditionIds) {
  const removed = new Set();
  let allowed = [...new Set(medKeys)];

  for (const flag of Object.keys(contextFlags)) {
    for (const med of CONTRA[flag] || []) {
      if (allowed.includes(med)) removed.add(med);
    }
  }

  // Dengue overrides everything: NSAIDs are dangerous there.
  if (conditionIds.includes('dengue_suspect')) {
    ['ibuprofen', 'diclofenacGel'].forEach((m) => { if (allowed.includes(m)) removed.add(m); });
  }
  // Do not suggest a motion-stopper when the picture looks like an infection.
  if (conditionIds.includes('food_poisoning')) removed.add('loperamide');

  allowed = allowed.filter((m) => !removed.has(m));
  if (contextFlags.diabetes) allowed = allowed.filter((m) => m !== 'honeyLemon');

  return allowed;
}

/* ------------------------------------------------------------------ *
 * Follow-up questions
 * ------------------------------------------------------------------ */

function buildFollowUps(ctx, matched, lang) {
  const qs = [];
  const add = (en, ur) => qs.push(lang === 'ur' ? ur : en);

  if (!ctx.duration) {
    add('How many days have you had this?', 'یہ تکلیف کتنے دن سے ہے؟');
  }
  if (!ctx.severity) {
    add('How bad is it out of 10?', 'تکلیف کی شدت دس میں سے کتنی ہے؟');
  }
  if (matched.some((c) => ['flu_fever', 'dengue_suspect', 'common_cold', 'cough'].includes(c.id))) {
    add('Have you measured your temperature? What was the reading?',
      'کیا آپ نے بخار ناپا ہے؟ کتنا تھا؟');
  }
  if (!Object.keys(ctx.flags).length) {
    add('Do you have any ongoing condition (diabetes, blood pressure, asthma, pregnancy) or take regular medicines?',
      'کیا آپ کو کوئی مستقل بیماری ہے (شوگر، بلڈ پریشر، دمہ، حمل) یا آپ کوئی دوا باقاعدگی سے لیتے ہیں؟');
  }
  if (matched.length === 0) {
    add('Where exactly is the problem, and what makes it better or worse?',
      'تکلیف بالکل کس جگہ ہے، اور کس چیز سے کم یا زیادہ ہوتی ہے؟');
  }
  return qs.slice(0, 3);
}

/* ------------------------------------------------------------------ *
 * Main analysis
 * ------------------------------------------------------------------ */

const DISCLAIMER = {
  en: 'This is general health information, not a medical diagnosis. Only a qualified doctor who examines you can diagnose and prescribe. If you feel worse, or your symptoms do not fit what is described here, see a doctor.',
  ur: 'یہ عام صحت سے متعلق معلومات ہیں، طبی تشخیص نہیں۔ تشخیص اور نسخہ صرف وہی مستند ڈاکٹر دے سکتا ہے جو آپ کا معائنہ کرے۔ اگر طبیعت بگڑے یا علامات یہاں بیان کی گئی باتوں سے مطابقت نہ رکھیں تو ڈاکٹر سے رجوع کریں۔'
};

function analyze(rawText, requestedLang) {
  const text = String(rawText || '').trim();
  const lang = requestedLang === 'ur' || requestedLang === 'en'
    ? requestedLang
    : detectLanguage(text);
  const norm = expandSynonyms(normalize(text));

  if (!norm) {
    return {
      lang,
      source: 'offline',
      empty: true,
      message: lang === 'ur'
        ? 'براہِ کرم اپنی تکلیف بتائیں، مثلاً: مجھے دو دن سے بخار اور گلے میں درد ہے۔'
        : 'Please describe your problem, for example: I have had fever and a sore throat for two days.',
      disclaimer: DISCLAIMER[lang]
    };
  }

  const ctx = extractContext(norm);
  const flags = findRedFlags(norm);

  if (flags.length) {
    return {
      lang,
      source: 'offline',
      emergency: true,
      supportive: flags.some((f) => f.tone === 'support'),
      warnings: flags.map((f) => ({ id: f.id, message: f[lang] })),
      contacts: EMERGENCY_CONTACTS[lang],
      context: ctx,
      disclaimer: DISCLAIMER[lang]
    };
  }

  // Score conditions.
  const scored = CONDITIONS.map((cond) => {
    let score = 0;
    const hits = [];
    // `strong` keywords are the ones where the user has named the problem
    // outright ("dengue", "migraine"). Those must outrank generic symptom hits.
    for (const kw of cond.strong || []) {
      if (hasKeyword(norm, kw)) { score += 4; hits.push(kw); }
    }
    for (const kw of cond.keywords) {
      if (hasKeyword(norm, kw)) { score += keywordWeight(kw); hits.push(kw); }
    }
    return { cond, score, hits };
  }).filter((s) => s.score > 0).sort((a, b) => b.score - a.score);

  const top = scored.slice(0, 3);
  const conditionIds = top.map((s) => s.cond.id);

  const conditions = top.map((s) => ({
    id: s.cond.id,
    name: lang === 'ur' ? s.cond.name_ur : s.cond.name,
    confidence: s.score >= 3 ? 'high' : s.score >= 1.6 ? 'medium' : 'low',
    matchedOn: s.hits.slice(0, 4),
    advice: lang === 'ur' ? s.cond.advice_ur : s.cond.advice,
    seeDoctorIf: lang === 'ur' ? s.cond.seeDoctorIf_ur : s.cond.seeDoctorIf
  }));

  // Collect medicines from the matched conditions, best match first.
  const medKeys = [];
  for (const s of top) for (const m of s.cond.meds) if (!medKeys.includes(m)) medKeys.push(m);

  const allowedKeys = filterMedicines(medKeys, ctx.flags, conditionIds).slice(0, 5);
  const medicines = allowedKeys.map((key) => {
    const m = MEDICINES[key];
    return {
      key,
      generic: lang === 'ur' ? `${m.generic_ur} (${m.generic})` : m.generic,
      brands: m.brands,
      form: m.form,
      dose: lang === 'ur' ? m.adultDose_ur : m.adultDose,
      maxDaily: lang === 'ur' ? m.maxDaily_ur : m.maxDaily,
      cautions: lang === 'ur' ? m.cautions_ur : m.cautions
    };
  });

  // Notes triggered by the user's own context.
  const notes = Object.keys(ctx.flags)
    .filter((f) => CONTEXT_NOTES[f])
    .map((f) => CONTEXT_NOTES[f][lang]);

  // Warn if the user asked about a drug this assistant will not recommend.
  const requestedBanned = NEVER_SUGGEST.filter((d) => hasKeyword(norm, d));
  if (requestedBanned.length) {
    notes.push(lang === 'ur'
      ? `آپ نے ${requestedBanned[0]} کا ذکر کیا۔ اینٹی بائیوٹک، اسٹیرائیڈ اور نیند یا درد کی سخت دوائیں صرف ڈاکٹر کے نسخے سے لی جا سکتی ہیں۔ خود سے لینا مزاحمت اور نقصان کا باعث بنتا ہے، اس لیے یہ ایپ ایسی دوا تجویز نہیں کرتی۔`
      : `You mentioned ${requestedBanned[0]}. Antibiotics, steroids and strong sleep or pain medicines are prescription-only. Taking them on your own drives resistance and side effects, so this assistant will not suggest one.`);
  }

  if (ctx.duration && ((ctx.duration.unit === 'weeks' && ctx.duration.value >= 2) ||
      ctx.duration.unit === 'months' || (ctx.duration.unit === 'days' && ctx.duration.value > 10))) {
    notes.push(lang === 'ur'
      ? 'یہ مسئلہ کافی عرصے سے چل رہا ہے۔ اتنی دیر تک رہنے والی علامت کو خود علاج کے بجائے ڈاکٹر سے چیک کروانا چاہیے۔'
      : 'This has been going on for a while. A symptom lasting this long should be checked by a doctor rather than self-treated.');
  }

  if (ctx.severity === 'severe') {
    notes.push(lang === 'ur'
      ? 'آپ نے شدت کا ذکر کیا ہے۔ شدید علامت میں گھریلو علاج پر انحصار نہ کریں، آج ہی ڈاکٹر کو دکھائیں۔'
      : 'You described this as severe. Do not rely on home treatment for severe symptoms - see a doctor today.');
  }

  return {
    lang,
    source: 'offline',
    emergency: false,
    understood: {
      text,
      duration: ctx.duration,
      severity: ctx.severity,
      context: Object.keys(ctx.flags)
    },
    conditions,
    medicines,
    notes,
    followUps: buildFollowUps(ctx, top.map((s) => s.cond), lang),
    noMatch: conditions.length === 0,
    generalAdvice: conditions.length === 0
      ? (lang === 'ur'
        ? ['آپ کی بتائی گئی بات سے کوئی مخصوص عام مسئلہ واضح نہیں ہوا۔ براہِ کرم بتائیں: تکلیف کہاں ہے، کب سے ہے، اور اس کے ساتھ اور کیا علامات ہیں۔',
          'اس دوران آرام کریں، وافر پانی پئیں، اور بغیر تشخیص کوئی دوا شروع نہ کریں۔']
        : ['I could not match your description to a specific common problem. Please tell me where the problem is, how long it has been there, and what other symptoms you have.',
          'Meanwhile, rest, drink plenty of fluids, and do not start any medicine without knowing what you are treating.'])
      : [],
    disclaimer: DISCLAIMER[lang]
  };
}

module.exports = { analyze, detectLanguage, normalize, DISCLAIMER };
