'use strict';

/**
 * Server-side text-to-speech, used when the browser has no voice for a
 * language. Most Windows desktops ship no Urdu voice at all, so without this
 * the Urdu answer could be shown but never spoken.
 *
 * The browser's own `speechSynthesis` is still preferred when a matching voice
 * exists (instant, offline, no request). This is the fallback.
 *
 * Audio is cached on disk, so repeating the same advice costs nothing and
 * works offline the second time.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const CACHE_DIR = path.join(__dirname, '..', '.cache', 'tts');

/** Google's TTS endpoint rejects long inputs, so requests are chunked. */
const MAX_CHUNK = 190;
const REQUEST_TIMEOUT_MS = 12000;

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';

/**
 * Split text into speakable chunks, breaking on sentence ends first and word
 * boundaries second so a chunk never splits a word.
 */
function chunkText(text, limit = MAX_CHUNK) {
  const clean = String(text).replace(/\s+/g, ' ').trim();
  if (!clean) return [];

  // Urdu full stop (۔) and Urdu comma (،) alongside the Latin equivalents.
  const sentences = clean.match(/[^۔.!?،,]+[۔.!?،,]*\s*/g) || [clean];
  const chunks = [];
  let current = '';

  const flushWords = (sentence) => {
    let line = '';
    for (const word of sentence.split(' ')) {
      if ((line + ' ' + word).trim().length > limit) {
        if (line) chunks.push(line.trim());
        line = word;
      } else {
        line = (line + ' ' + word).trim();
      }
    }
    if (line) chunks.push(line.trim());
  };

  for (const sentence of sentences) {
    const s = sentence.trim();
    if (!s) continue;

    if (s.length > limit) {
      if (current) { chunks.push(current.trim()); current = ''; }
      flushWords(s);
    } else if ((current + ' ' + s).trim().length > limit) {
      if (current) chunks.push(current.trim());
      current = s;
    } else {
      current = (current + ' ' + s).trim();
    }
  }
  if (current) chunks.push(current.trim());

  return chunks;
}

async function fetchChunk(chunk, lang, index, total, textLen) {
  const params = new URLSearchParams({
    ie: 'UTF-8',
    client: 'tw-ob',
    tl: lang === 'ur' ? 'ur' : 'en',
    q: chunk,
    total: String(total),
    idx: String(index),
    textlen: String(textLen)
  });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(`https://translate.google.com/translate_tts?${params}`, {
      signal: controller.signal,
      headers: { 'User-Agent': UA, 'Referer': 'https://translate.google.com/' }
    });
    if (!res.ok) throw new Error(`TTS provider returned ${res.status}`);

    const type = res.headers.get('content-type') || '';
    if (!type.includes('audio')) throw new Error(`TTS provider returned ${type}`);

    return Buffer.from(await res.arrayBuffer());
  } finally {
    clearTimeout(timer);
  }
}

function cachePath(text, lang) {
  const key = crypto.createHash('sha1').update(`${lang}:${text}`).digest('hex');
  return path.join(CACHE_DIR, `${key}.mp3`);
}

/**
 * @returns {Promise<{audio: Buffer, cached: boolean, chunks: number}>}
 */
async function synthesize(text, lang) {
  const chunks = chunkText(text);
  if (!chunks.length) throw new Error('Nothing to speak');

  const file = cachePath(text, lang);
  if (fs.existsSync(file)) {
    return { audio: fs.readFileSync(file), cached: true, chunks: chunks.length };
  }

  const textLen = text.length;
  const parts = [];
  // Sequential on purpose: parallel requests to this endpoint get throttled.
  for (let i = 0; i < chunks.length; i++) {
    parts.push(await fetchChunk(chunks[i], lang, i, chunks.length, textLen));
  }

  const audio = Buffer.concat(parts);

  try {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    fs.writeFileSync(file, audio);
  } catch (err) {
    // A cache failure must not break playback.
    console.error('TTS cache write failed:', err.message);
  }

  return { audio, cached: false, chunks: chunks.length };
}

module.exports = { synthesize, chunkText };
