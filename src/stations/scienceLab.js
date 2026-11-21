/**
 * Science & Technology interactive station (Energie-Labor):
 * energy system selector, power & efficiency sliders, live Sankey-style bar, and challenges.
 */

import { scienceLabChallengesByGrade, scienceLabSystems } from '../../data/science.js';
import { playTone } from '../core/audio.js';
import { getProgress, recordSubjectLabSolved } from '../core/store.js';
import { $, $$, setStationTutor } from '../core/ui.js';

let activeSystemId = 'solar';
let scienceChallengeIndex = 0;

export function computeEnergyOutputs(inputPower, efficiencyPercent) {
  const power = Math.max(0, Number(inputPower) || 0);
  const eff = Math.min(100, Math.max(0, Number(efficiencyPercent) || 0));
  const usefulPower = Math.round((power * eff) / 100);
  const lossPower = power - usefulPower;
  return { power, efficiency: eff, usefulPower, lossPower, energy1hWh: usefulPower };
}

function getCurrentSystem() {
  return scienceLabSystems.find(s => s.id === activeSystemId) || scienceLabSystems[0];
}

function getCurrentScienceChallenge() {
  const grade = getProgress().selectedGrade || 5;
  const list = scienceLabChallengesByGrade[grade] || scienceLabChallengesByGrade[5];
  return { list, challenge: list[scienceChallengeIndex % list.length] };
}

function renderScienceChallenge() {
  const { challenge } = getCurrentScienceChallenge();
  const solved = getProgress().labChallengesSolved.includes(challenge.id);
  if ($('#scienceChallengePrompt')) $('#scienceChallengePrompt').textContent = challenge.prompt;
  if ($('#scienceChallengeStatus')) {
    $('#scienceChallengeStatus').textContent = solved ? '✓ Geschafft' : 'Offen';
    $('#scienceChallengeStatus').className = `challenge-status ${solved ? 'done' : ''}`;
  }
}

export function renderScienceLab() {
  const sys = getCurrentSystem();
  const power = Number($('#sciencePowerSlider')?.value || sys.defaultPower);
  const eff = Number($('#scienceEffSlider')?.value || sys.defaultEfficiency);
  const stats = computeEnergyOutputs(power, eff);

  $$('[data-science-system]').forEach(btn => {
    const active = btn.dataset.scienceSystem === activeSystemId;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', String(active));
  });

  if ($('#sciencePowerValue')) $('#sciencePowerValue').textContent = `${stats.power} W`;
  if ($('#scienceEffValue')) $('#scienceEffValue').textContent = `${stats.efficiency} %`;
  if ($('#scienceInputLabel')) $('#scienceInputLabel').textContent = `${sys.icon} ${sys.inputLabel}: ${stats.power} W`;
  if ($('#scienceUsefulLabel')) $('#scienceUsefulLabel').textContent = `${sys.usefulLabel}: ${stats.usefulPower} W (${stats.energy1hWh} Wh/h)`;
  if ($('#scienceLossLabel')) $('#scienceLossLabel').textContent = `${sys.lossLabel}: ${stats.lossPower} W`;
  if ($('#scienceUsefulBar')) $('#scienceUsefulBar').style.width = `${stats.efficiency}%`;
  if ($('#scienceLossBar')) $('#scienceLossBar').style.width = `${100 - stats.efficiency}%`;
  if ($('#scienceSystemNote')) $('#scienceSystemNote').textContent = sys.note;
}

function selectSystem(systemId) {
  const sys = scienceLabSystems.find(s => s.id === systemId);
  if (!sys) return;
  activeSystemId = sys.id;
  if ($('#sciencePowerSlider')) $('#sciencePowerSlider').value = String(sys.defaultPower);
  if ($('#scienceEffSlider')) $('#scienceEffSlider').value = String(sys.defaultEfficiency);
  renderScienceLab();
  setStationTutor(sys.note, 'happy');
}

function checkScienceChallenge() {
  const { challenge } = getCurrentScienceChallenge();
  const power = Number($('#sciencePowerSlider')?.value || 100);
  const eff = Number($('#scienceEffSlider')?.value || 50);
  const fb = $('#scienceChallengeFeedback');
  const soundOn = getProgress().soundOn;

  if (challenge.check(activeSystemId, power, eff)) {
    const isNew = recordSubjectLabSolved('science', challenge.id);
    fb.className = 'station-feedback show success';
    fb.textContent = `${challenge.tip}${isNew ? ' +15 XP' : ''}`;
    setStationTutor(challenge.tip, 'celebrating');
    renderScienceChallenge();
    playTone(700, 0.18, soundOn);
  } else {
    const stats = computeEnergyOutputs(power, eff);
    fb.className = 'station-feedback show try-again';
    fb.textContent = `Aktuell: ${getCurrentSystem().name}, ${stats.power} W Eingang, ${stats.efficiency} % → ${stats.usefulPower} W Nutzleistung / ${stats.lossPower} W Wärme.`;
    setStationTutor('Schau genau auf System, Wattzahl und Wirkungsgrad.', 'thinking');
    playTone(260, 0.18, soundOn);
  }
}

export function resetScienceLabForGrade() {
  scienceChallengeIndex = 0;
  const fb = $('#scienceChallengeFeedback');
  if (fb) fb.className = 'station-feedback';
  renderScienceChallenge();
  renderScienceLab();
}

export function initScienceLab({ onStartQuiz } = {}) {
  $$('[data-science-system]').forEach(btn => {
    btn.addEventListener('click', () => selectSystem(btn.dataset.scienceSystem));
  });
  $('#sciencePowerSlider')?.addEventListener('input', renderScienceLab);
  $('#scienceEffSlider')?.addEventListener('input', renderScienceLab);
  $('#scienceCheckChallengeButton')?.addEventListener('click', checkScienceChallenge);
  $('#scienceNextChallengeButton')?.addEventListener('click', () => {
    scienceChallengeIndex += 1;
    const fb = $('#scienceChallengeFeedback');
    if (fb) fb.className = 'station-feedback';
    renderScienceChallenge();
  });
  $('#scienceQuizStartButton')?.addEventListener('click', () => {
    if (typeof onStartQuiz === 'function') onStartQuiz('science');
  });

  selectSystem('solar');
  resetScienceLabForGrade();
}
