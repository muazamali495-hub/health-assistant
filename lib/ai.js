'use strict';

/**
 * Optional AI layer.
 *
 * The offline engine always runs first. When an Anthropic API key is present,
 * this layer re-reads the user's description in their own words and writes a
 * better-worded explanation - but it is NOT allowed to invent medicines: it may
 * only choose from the vetted OTC whitelist, and the server maps those keys
 * back to the same dose and caution text used in offline mode. So the safety
 * guarantees do not depend on the model behaving.
 */

const { MEDICINES } = require('./medicines');

let Anthropic = null;
try {
  Anthropic = require('@anthropic-ai/sdk');
} catch {
  Anthropic = null; // SDK not installed - offline mode only.
}

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-opus-5';

function isAvailable() {
  return Boolean(Anthropic && (process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN));
}

let client = null;
function getClient() {
  if (!client) client = new Anthropic();
  return client;
}

const MED_KEYS = Object.keys(MEDICINES);

const MED_MENU = MED_KEYS
  .map((k) => `- ${k}: ${MEDICINES[k].generic} (${MEDICINES[k].form})`)
  .join('\n');

const SYSTEM_PROMPT = `You are the reasoning layer of a bilingual (English/Urdu) home health assistant used mainly in Pakistan. A deterministic rule engine has already screened the user's message for emergencies and matched it against a condition database. Your job is to read the user's own words and produce a clearer, better-targeted version of that guidance.

HARD RULES - these are not negotiable:
1. You never diagnose. You describe what the symptoms are "consistent with" and always leave room for other causes.
2. You may only suggest medicines by picking keys from the whitelist below. Never name any medicine outside it, and never invent a dose - the application supplies the dose text itself.
3. Never suggest antibiotics, steroids, sleeping pills, or any prescription-only medicine, even if the user asks for one by name. If they ask, explain briefly why they need a doctor for it.
4. If the description suggests a medical emergency, set "emergency": true and keep the advice short: tell them to get emergency care.
5. For a child, a pregnant or breastfeeding person, or someone with kidney/liver disease, do not suggest tablet medicines - route them to a doctor or pharmacist.
6. Every piece of text you write must be given in BOTH English and Urdu, as {"en": "...", "ur": "..."}. The two must say the same thing - the Urdu is a natural rendering, not a word-for-word translation. Write Urdu in Urdu script (never Roman), of the kind an educated Pakistani doctor would use with a patient.
7. Keep advice practical and specific to Pakistan: local food, climate, and what is realistically available at a local pharmacy.

MEDICINE WHITELIST (use these exact keys):
${MED_MENU}

Reply with ONLY a JSON object, no markdown fence and no text around it, in this exact shape:
{
  "summary": {"en": "one or two sentences restating what the person is experiencing", "ur": "..."},
  "emergency": false,
  "conditions": [{"name": {"en": "possible condition", "ur": "..."}, "why": {"en": "which of their symptoms point to it", "ur": "..."}, "confidence": "high|medium|low"}],
  "advice": [{"en": "practical step", "ur": "..."}],
  "medicineKeys": ["key_from_whitelist"],
  "seeDoctorIf": [{"en": "specific warning sign", "ur": "..."}],
  "followUps": [{"en": "a question that would meaningfully change your advice", "ur": "..."}]
}`;

/** Strip a stray code fence if the model adds one, then parse. */
function parseJson(text) {
  const cleaned = String(text).trim().replace(/^```(?:json)?\s*/i, '').replace(/```$/, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('No JSON object in model response');
  return JSON.parse(cleaned.slice(start, end + 1));
}

/** A bilingual field is only usable if both halves came back as strings. */
const isPair = (v) => v && typeof v.en === 'string' && typeof v.ur === 'string';

const pairList = (arr) => (Array.isArray(arr) ? arr.filter(isPair) : []);

/**
 * @param {string} text     what the user said
 * @param {object} results  the offline engine results, keyed by language,
 *                          used as grounding for the model
 */
async function enrich(text, results) {
  const offline = results.en;

  const grounding = {
    ruleEngineConditions: (offline.conditions || []).map((c) => ({ id: c.id, name: c.name, confidence: c.confidence })),
    detectedContext: offline.understood ? offline.understood.context : [],
    detectedDuration: offline.understood ? offline.understood.duration : null,
    detectedSeverity: offline.understood ? offline.understood.severity : null
  };

  const message = await getClient().messages.create({
    model: MODEL,
    max_tokens: 8000,
    system: SYSTEM_PROMPT,
    output_config: { effort: 'medium' },
    messages: [
      {
        role: 'user',
        content: `Give every text field in both English and Urdu.

The person wrote:
"""
${text}
"""

What the rule engine already found (use it, correct it, or add to it as you see fit):
${JSON.stringify(grounding, null, 2)}`
      }
    ]
  });

  const textOut = message.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('\n');

  const parsed = parseJson(textOut);

  // Whitelist enforcement: silently drop anything the model made up.
  const keys = Array.isArray(parsed.medicineKeys)
    ? parsed.medicineKeys.filter((k) => MED_KEYS.includes(k))
    : [];

  // Anything that did not come back as a complete {en, ur} pair is dropped;
  // the server then falls back to the rule engine for that field.
  const conditions = (Array.isArray(parsed.conditions) ? parsed.conditions : [])
    .filter((c) => c && isPair(c.name))
    .map((c) => ({
      name: c.name,
      why: isPair(c.why) ? c.why : null,
      confidence: ['high', 'medium', 'low'].includes(c.confidence) ? c.confidence : 'medium'
    }));

  return {
    summary: isPair(parsed.summary) ? parsed.summary : { en: null, ur: null },
    emergency: parsed.emergency === true,
    conditions: conditions.slice(0, 4),
    advice: pairList(parsed.advice).slice(0, 6),
    medicineKeys: keys.slice(0, 5),
    seeDoctorIf: pairList(parsed.seeDoctorIf).slice(0, 5),
    followUps: pairList(parsed.followUps).slice(0, 3)
  };
}

module.exports = { isAvailable, enrich, MODEL };
