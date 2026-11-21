/**
 * Web Audio tone synthesizer (singleton AudioContext) and German speech output.
 */

let sharedAudioContext = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;

  if (!sharedAudioContext || sharedAudioContext.state === 'closed') {
    sharedAudioContext = new AudioCtx();
  }
  if (sharedAudioContext.state === 'suspended') {
    sharedAudioContext.resume().catch(() => {});
  }
  return sharedAudioContext;
}

/**
 * Plays a short soft sine tone when sound is enabled.
 */
export function playTone(frequency, duration = 0.18, soundOn = true, delaySeconds = 0) {
  if (!soundOn) return;
  try {
    const audio = getAudioContext();
    if (!audio) return;

    const startTime = audio.currentTime + delaySeconds;
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.connect(gain);
    gain.connect(audio.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(0.055, startTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration + 0.01);
  } catch (_) {
    /* Optional audio feedback. */
  }
}

/**
 * Plays a short sequence of gentle tones (e.g. on badge unlock or round completion).
 */
export function playChime(frequencies = [523.25, 659.25, 783.99], soundOn = true) {
  frequencies.forEach((freq, index) => {
    playTone(freq, 0.17, soundOn, index * 0.09);
  });
}

/**
 * Extracts text from a DOM node while treating <br> and block boundaries as spaces.
 */
export function extractReadableText(element) {
  if (!element) return '';
  const clone = element.cloneNode(true);
  clone.querySelectorAll('br').forEach(br => br.replaceWith(' '));
  return clone.textContent.replace(/\s+/g, ' ').trim();
}

/**
 * Cleans emojis and converts math symbols into natural German speech phrasing.
 */
export function prepareSpeechText(rawText) {
  return String(rawText)
    .replace(/\p{Extended_Pictographic}|\uFE0F|\u200D/gu, ' ')
    .replace(/\s*·\s*/g, ' mal ')
    .replace(/\s+:\s+(?=[\d(x])/gi, ' geteilt durch ')
    .replace(/\s*=\s*/g, ' gleich ')
    .replace(/≠/g, ' ungleich ')
    .replace(/(^|\s)[−](?=\S)|(^|\s)-(?=\d)/g, '$1$2minus ')
    .replace(/\s+−\s+|\s+-\s+/g, ' minus ')
    .replace(/\s+/g, ' ')
    .trim();
}

let activeSpeakButton = null;

function resetActiveButton() {
  if (activeSpeakButton) {
    activeSpeakButton.textContent = activeSpeakButton.dataset.defaultLabel || '🔊 Vorlesen';
    activeSpeakButton.setAttribute('aria-pressed', 'false');
    activeSpeakButton = null;
  }
}

/**
 * Stops any running speech synthesis output.
 */
export function stopSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  resetActiveButton();
}

/**
 * Reads German text aloud using Web Speech API, toggling off if the same button is clicked again.
 */
export function speakText(rawText, { soundOn = true, button = null, onSoundDisabled = null, lang = 'de-DE' } = {}) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onSoundDisabled) onSoundDisabled('Sprachausgabe nicht unterstützt', 'Dein Browser bietet leider keine Vorlesefunktion.');
    return;
  }
  if (!soundOn) {
    if (onSoundDisabled) onSoundDisabled('🔇 Vorlesen ist aus', 'Aktiviere zuerst den Ton oben rechts.');
    return;
  }

  const wasSameButtonSpeaking = button && activeSpeakButton === button && window.speechSynthesis.speaking;
  stopSpeech();
  if (wasSameButtonSpeaking) return;

  const isGerman = String(lang).toLowerCase().startsWith('de');
  const cleanText = isGerman
    ? prepareSpeechText(rawText)
    : String(rawText).replace(/\p{Extended_Pictographic}|\uFE0F|\u200D/gu, ' ').replace(/\s+/g, ' ').trim();
  if (!cleanText) return;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  const voices = window.speechSynthesis.getVoices ? window.speechSynthesis.getVoices() : [];
  const langPrefix = String(lang).slice(0, 2).toLowerCase();
  const matchedVoice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith(langPrefix));
  if (matchedVoice) utterance.voice = matchedVoice;

  utterance.lang = lang;
  utterance.rate = isGerman ? 0.94 : 0.9;
  utterance.pitch = 1.04;

  if (button) {
    if (!button.dataset.defaultLabel) {
      button.dataset.defaultLabel = button.textContent.trim();
    }
    activeSpeakButton = button;
    button.textContent = '⏹ Stopp';
    button.setAttribute('aria-pressed', 'true');
  }

  utterance.onend = resetActiveButton;
  utterance.onerror = resetActiveButton;
  window.speechSynthesis.speak(utterance);
}
