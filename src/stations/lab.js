/**
 * Station 2: Schoko-Labor with sliders, number line landmarks, equivalents,
 * percentages, and grade-specific challenges.
 */

import { labChallengesByGrade } from '../../data/fractions.js';
import { formatDecimalDE, formatPercentDE, simplifyFraction } from '../core/math.js';
import { playTone } from '../core/audio.js';
import { getProgress, markLabChallengeSolved, rememberDiscovery } from '../core/store.js';
import { $, setStationTutor, showToast } from '../core/ui.js';

let challengeIndex = 0;

/**
 * Finds all equivalent fractions (denominator 2..12) for numerator/denominator.
 */
export function getEquivalentFractions(numerator, denominator, maxDenominator = 12) {
  if (numerator === 0) return ['0'];
  const simplified = simplifyFraction(numerator, denominator);
  const results = [];
  for (let den = 2; den <= maxDenominator; den++) {
    if (den % simplified.denominator === 0) {
      const num = (den / simplified.denominator) * simplified.numerator;
      results.push(`${num}/${den}`);
    }
  }
  return results;
}

function getCurrentChallenge() {
  const grade = getProgress().selectedGrade || 5;
  const list = labChallengesByGrade[grade] || labChallengesByGrade[5];
  return { list, challenge: list[challengeIndex % list.length] };
}

export function renderLabChallenge() {
  const { challenge } = getCurrentChallenge();
  const progress = getProgress();
  const solved = progress.labChallengesSolved.includes(challenge.id);

  const promptEl = $('#labChallengePrompt');
  const statusEl = $('#labChallengeStatus');
  if (promptEl) promptEl.textContent = challenge.prompt;
  if (statusEl) {
    statusEl.textContent = solved ? '✓ Geschafft' : 'Offen';
    statusEl.className = `challenge-status ${solved ? 'done' : ''}`;
  }
}

export function renderLab(announceTutor = false) {
  const denominatorInput = $('#labDenominator');
  const numeratorInput = $('#labNumerator');
  if (!denominatorInput || !numeratorInput) return;

  const denominator = Number(denominatorInput.value);
  numeratorInput.max = denominator;
  if (Number(numeratorInput.value) > denominator) {
    numeratorInput.value = denominator;
  }
  const numerator = Number(numeratorInput.value);
  const ratio = numerator / denominator;

  $('#labDenominatorValue').textContent = denominator;
  $('#labNumeratorValue').textContent = numerator;
  $('#labFraction').textContent = `${numerator}/${denominator}`;
  $('#labDecimal').textContent = formatDecimalDE(ratio, 3);
  if ($('#labPercent')) {
    $('#labPercent').textContent = formatPercentDE(ratio, 1);
  }

  const percentLeft = `${(ratio * 100).toFixed(2)}%`;
  const numberTrack = $('.number-track');
  if (numberTrack) numberTrack.style.setProperty('--marker', percentLeft);
  $('#numberMarker').style.left = percentLeft;

  const chocoBar = $('#chocolateBar');
  chocoBar.style.setProperty('--choco-cols', Math.min(denominator, 6));
  chocoBar.setAttribute('aria-label', `Schokoladentafel mit ${numerator} von ${denominator} Stücken gefärbt`);
  chocoBar.innerHTML = Array.from({ length: denominator }, (_, index) => {
    const filled = index < numerator;
    return `<span class="${filled ? 'filled' : ''}">${filled ? '★' : ''}</span>`;
  }).join('');

  const simplified = simplifyFraction(numerator, denominator);
  const equivalents = getEquivalentFractions(numerator, denominator);
  const equivEl = $('#labEquivalents');
  if (equivEl) {
    if (numerator === 0) {
      equivEl.textContent = '0 Teile gewählt – zieh am Zähler-Regler!';
    } else if (equivalents.length > 1) {
      equivEl.textContent = `Gleichwertig: ${equivalents.join(' = ')}`;
    } else {
      equivEl.textContent = `Grundform: ${simplified.numerator}/${simplified.denominator} (${formatPercentDE(ratio, 1)})`;
    }
  }

  if (announceTutor) {
    const isReducible = simplified.denominator !== denominator && numerator > 0;
    const simplifiedText = isReducible
      ? ` Das ist gekürzt ${simplified.numerator}/${simplified.denominator}.`
      : '';
    setStationTutor(`${numerator} von ${denominator} Teilen sind markiert.${simplifiedText}`);
  }
}

function checkLabChallenge() {
  const denominator = Number($('#labDenominator').value);
  const numerator = Number($('#labNumerator').value);
  const { challenge } = getCurrentChallenge();
  const feedback = $('#labChallengeFeedback');
  const soundOn = getProgress().soundOn;

  if (challenge.check(numerator, denominator)) {
    const isFirstSolve = markLabChallengeSolved(challenge.id);
    feedback.className = 'station-feedback show success';
    feedback.textContent = `${challenge.successTip}${isFirstSolve ? ' +10 XP' : ''}`;
    setStationTutor(challenge.successTip, 'celebrating');
    renderLabChallenge();
    playTone(700, 0.18, soundOn);
  } else {
    feedback.className = 'station-feedback show try-again';
    feedback.textContent = `Aktuell hast du ${numerator}/${denominator} (${formatDecimalDE(numerator / denominator, 3)} = ${formatPercentDE(numerator / denominator, 1)}). Schau noch mal auf die Aufgabe!`;
    setStationTutor('Noch nicht ganz – probiere andere Kombinationen aus Zähler und Nenner.', 'thinking');
    playTone(260, 0.18, soundOn);
  }
}

function nextLabChallenge() {
  challengeIndex += 1;
  const feedback = $('#labChallengeFeedback');
  if (feedback) feedback.className = 'station-feedback';
  renderLabChallenge();
}

function rememberLabFraction() {
  const fraction = $('#labFraction').textContent;
  const decimal = $('#labDecimal').textContent;
  const isNew = rememberDiscovery(fraction);
  setStationTutor(`Gespeichert im Forscherkopf: ${fraction}!${isNew ? ' +10 XP' : ''}`, 'celebrating');
  showToast(
    isNew ? '🍫 Neuer Bruch entdeckt' : '🍫 Schon im Forscherbuch',
    `${fraction} liegt auf dem Zahlenstrahl bei ${decimal}.`
  );
  playTone(isNew ? 680 : 540, 0.15, getProgress().soundOn);
}

export function resetLabChallengeForGrade() {
  challengeIndex = 0;
  const feedback = $('#labChallengeFeedback');
  if (feedback) feedback.className = 'station-feedback';
  renderLabChallenge();
}

export function initLabStation() {
  $('#labDenominator')?.addEventListener('input', () => renderLab(true));
  $('#labNumerator')?.addEventListener('input', () => renderLab(true));
  $('#labCelebrateButton')?.addEventListener('click', rememberLabFraction);
  $('#labCheckChallengeButton')?.addEventListener('click', checkLabChallenge);
  $('#labNextChallengeButton')?.addEventListener('click', nextLabChallenge);

  renderLab(false);
  renderLabChallenge();
}
