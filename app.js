/**
 * Application entry point: coordinates dashboard filters, adaptive smart tips,
 * grade switching, all four subject worlds, Blitz-Sprint, Merk-Karten, and offline SW.
 */

import { gradeContent, stationMeta } from './data/fractions.js';
import { subjectCatalog } from './data/subjects.js';
import { initCheatSheets } from './src/cheatsheets.js';
import { extractReadableText, speakText, stopSpeech } from './src/core/audio.js';
import { computeSubjectProgressPercent, getSmartRecommendation } from './src/core/state.js';
import {
  getProgress,
  setLastSubject,
  setSelectedGrade,
  subscribeProgress,
  toggleSound,
  visitStation
} from './src/core/store.js';
import {
  $,
  $$,
  handleStoreNotification,
  openBadges,
  reactWithFiete,
  setStationTutor,
  setupTablistKeyboard,
  showToast,
  showView,
  updateCommonProgressUI
} from './src/core/ui.js';
import { initProfileDialog } from './src/profile.js';
import { initDuelStation, newDuel } from './src/stations/duel.js';
import { initEnglishLab, resetEnglishLabForGrade } from './src/stations/englishLab.js';
import { initGeometryLab, resetGeometryLabForGrade } from './src/stations/geometryLab.js';
import { initLabStation, resetLabChallengeForGrade } from './src/stations/lab.js';
import { initPizzaStation, updatePizzaOrder } from './src/stations/pizza.js';
import {
  initQuestStation,
  renderQuestMap,
  startFocusLesson,
  startLesson,
  syncProfiToggleUI
} from './src/stations/quest.js';
import { initScienceLab, resetScienceLabForGrade } from './src/stations/scienceLab.js';
import { initSprintStation, resetSprintForGrade, stopSprintTimer } from './src/stations/sprint.js';
import { initWordsLab, resetWordsLabForGrade } from './src/stations/wordsLab.js';

let activeSubjectFilter = 'all';
let currentStationId = 'pizza';
let currentRecommendation = null;

const FRACTION_STATIONS = new Set(['pizza', 'lab', 'duel', 'quest']);
const STANDALONE_LABS = new Set(['geometry', 'words', 'science', 'english', 'sprint']);

function updateSmartBanner(progress) {
  const grade = progress.selectedGrade || 5;
  currentRecommendation = getSmartRecommendation(progress, grade);

  if ($('#smartTipBadge')) $('#smartTipBadge').textContent = currentRecommendation.badge;
  if ($('#smartTipTitle')) $('#smartTipTitle').textContent = currentRecommendation.title;
  if ($('#smartTipDesc')) $('#smartTipDesc').textContent = currentRecommendation.description;
  if ($('#smartTipButton')) $('#smartTipButton').textContent = currentRecommendation.buttonLabel;
}

function updateContinueCard(progress) {
  const grade = progress.selectedGrade || 5;
  const subjectId = progress.lastSubject || 'fractions';
  const subject = subjectCatalog[subjectId] || subjectCatalog.fractions;
  const percent = computeSubjectProgressPercent(progress, subjectId, grade);
  const bestCorrect = Number(progress.bestCorrectBySubject?.[subjectId]?.[grade]) || 0;
  const totalQuestions = subject.questionCount;

  const iconEl = $('#continueIcon');
  if (iconEl) {
    if (subjectId === 'fractions') {
      iconEl.className = 'continue-icon fraction-symbol';
      iconEl.innerHTML = '<span>3</span><span>4</span>';
    } else {
      iconEl.className = 'continue-icon emoji-icon';
      iconEl.textContent =
        subjectId === 'geometry'
          ? '📐'
          : subjectId === 'words'
            ? '🔎'
            : subjectId === 'english'
              ? '🌍'
              : '⚡';
    }
  }

  if ($('#continueContext')) {
    $('#continueContext').textContent = `${subject.kicker} · KLASSE ${grade} · WEITERMACHEN`;
  }
  if ($('#continueTitle')) {
    $('#continueTitle').textContent = subject.getGradeTitle(grade);
  }
  if ($('#continueSubtitle')) {
    const levelLabel = subject.getGradeLevel(grade);
    const levelText = `${levelLabel.charAt(0)}${levelLabel.slice(1).toLowerCase()}`;
    const bestPart = bestCorrect > 0 ? `Bestleistung ${bestCorrect}/${totalQuestions}` : `Quiz mit ${totalQuestions} Aufgaben`;
    const extraPart =
      subjectId === 'fractions' ? ` · ${progress.visitedStations.length}/4 Stationen` : '';
    $('#continueSubtitle').textContent = `${levelText} · ${bestPart}${extraPart}`;
  }
  if ($('#continueProgressBar')) {
    $('#continueProgressBar').style.width = `${Math.max(6, percent)}%`;
  }
}

function updateTopicCardsMeta(progress) {
  const grade = progress.selectedGrade || 5;
  const bySubj = progress.bestCorrectBySubject || {};
  if ($('#geometryBestMeta')) {
    const best = bySubj.geometry?.[grade] || 0;
    $('#geometryBestMeta').textContent = best > 0 ? `Bestleistung: ${best}/6` : '6 Missionen · Labor';
  }
  if ($('#wordsBestMeta')) {
    const best = bySubj.words?.[grade] || 0;
    $('#wordsBestMeta').textContent = best > 0 ? `Bestleistung: ${best}/6` : '6 Missionen · Lupe & Diktat';
  }
  if ($('#englishBestMeta')) {
    const best = bySubj.english?.[grade] || 0;
    $('#englishBestMeta').textContent = best > 0 ? `Bestleistung: ${best}/6` : '6 Missionen · Audio-Studio';
  }
  if ($('#scienceBestMeta')) {
    const best = bySubj.science?.[grade] || 0;
    $('#scienceBestMeta').textContent = best > 0 ? `Bestleistung: ${best}/6` : '6 Missionen · Labor';
  }
}

function applyDashboardFilters() {
  const selectedGrade = String(getProgress().selectedGrade || 5);
  $$('.topic-card').forEach(card => {
    const subjectMatches = activeSubjectFilter === 'all' || card.dataset.subject === activeSubjectFilter;
    const gradeMatches = !card.dataset.grades || card.dataset.grades.split(',').includes(selectedGrade);
    card.classList.toggle('hidden', !subjectMatches || !gradeMatches);
  });
  $('#mathAdventure')?.classList.toggle('hidden', activeSubjectFilter !== 'all' && activeSubjectFilter !== 'mathe');
}

function updateGradeUI({ refreshStations = false } = {}) {
  const progress = getProgress();
  const grade = progress.selectedGrade || 5;
  const content = gradeContent[grade];

  if ($('#gradeSelect')) $('#gradeSelect').value = String(grade);
  if ($('#adventureGrade')) $('#adventureGrade').textContent = `KLASSE ${grade}`;
  if ($('#adventureSubtitle')) $('#adventureSubtitle').textContent = content.description;
  if ($('#levelPill')) $('#levelPill').textContent = content.level;
  if ($('#fractionTopicLabel')) $('#fractionTopicLabel').textContent = `MATHE · KLASSE ${grade}`;
  if ($('#fractionTopicTitle')) $('#fractionTopicTitle').textContent = content.title;
  if ($('#fractionTopicDescription')) $('#fractionTopicDescription').textContent = content.description;
  if ($('#fractionLessonCount')) $('#fractionLessonCount').textContent = content.lessons;
  if ($('#questGradeLabel')) $('#questGradeLabel').textContent = `QUIZ-QUEST · KLASSE ${grade}`;
  if ($('#questDescription')) $('#questDescription').textContent = content.quest;

  updateContinueCard(progress);
  updateSmartBanner(progress);
  updateTopicCardsMeta(progress);
  applyDashboardFilters();
  renderQuestMap();
  syncProfiToggleUI();

  if (refreshStations) {
    updatePizzaOrder(true);
    resetLabChallengeForGrade();
    newDuel();
    resetGeometryLabForGrade();
    resetWordsLabForGrade();
    resetEnglishLabForGrade();
    resetScienceLabForGrade();
    resetSprintForGrade();
  }
}

function switchStation(id, { updateHash = true } = {}) {
  const isFraction = FRACTION_STATIONS.has(id);
  const isStandalone = STANDALONE_LABS.has(id);
  if (!isFraction && !isStandalone) return;

  if (id !== 'sprint') stopSprintTimer();
  currentStationId = id;
  const grade = getProgress().selectedGrade || 5;
  const stationTabs = $('.station-tabs');

  if (isFraction) {
    setLastSubject('fractions');
    visitStation(id);
    const meta = stationMeta[id];
    if (stationTabs) stationTabs.classList.remove('hidden');
    if ($('#stationContextLabel')) $('#stationContextLabel').textContent = `MATHE · BRÜCHE · KLASSE ${grade}`;
    if ($('#stationTitle')) $('#stationTitle').textContent = meta.title;
    setStationTutor(meta.messages[grade] || meta.messages[5], 'happy');
  } else if (id === 'sprint') {
    if (stationTabs) stationTabs.classList.add('hidden');
    if ($('#stationContextLabel')) $('#stationContextLabel').textContent = `ALLE FÄCHER · KLASSE ${grade}`;
    if ($('#stationTitle')) $('#stationTitle').textContent = '60-Sekunden-Sprint';
    setStationTutor('Bereit für kurze Kopf-Fragen? Wähle den Tempo- oder den Ruhemodus!', 'happy');
    resetSprintForGrade();
  } else {
    setLastSubject(id);
    const subject = subjectCatalog[id];
    if (stationTabs) stationTabs.classList.add('hidden');
    if ($('#stationContextLabel')) $('#stationContextLabel').textContent = `${subject.kicker} · KLASSE ${grade}`;
    if ($('#stationTitle')) $('#stationTitle').textContent = subject.labTitle;
    setStationTutor(subject.labMessage, 'happy');
  }

  $$('[data-station-tab]').forEach(button => {
    const selected = isFraction && button.dataset.stationTab === id;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-selected', String(selected));
    button.setAttribute('tabindex', selected ? '0' : '-1');
  });
  $$('[data-panel]').forEach(panel => {
    panel.classList.toggle('active', panel.dataset.panel === id);
  });

  if (updateHash && typeof history !== 'undefined' && typeof location !== 'undefined') {
    const targetHash = `#station/${id}`;
    if (location.hash !== targetHash) {
      try {
        history.pushState({ view: 'station', stationId: id }, '', targetHash);
      } catch (_) {
        /* Fallback when history manipulation is restricted. */
      }
    }
  }
}

function openStation(id, options = {}) {
  showView('station', { updateHash: options.updateHash ?? true, stationId: id });
  switchStation(id, options);
}

function activateSubjectTab(tab) {
  $$('.subject-tab').forEach(item => {
    const selected = item === tab;
    item.classList.toggle('active', selected);
    item.setAttribute('aria-selected', String(selected));
    item.setAttribute('tabindex', selected ? '0' : '-1');
  });
  activeSubjectFilter = tab.dataset.filter;
  applyDashboardFilters();
}

function openMathLearning() {
  const mathTab = $('.subject-tab[data-filter="mathe"]');
  if (mathTab) activateSubjectTab(mathTab);
  $('#mathAdventure')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function returnToDashboard(updateHash = true) {
  stopSprintTimer();
  showView('dashboard', { updateHash });
}

function syncViewFromHash() {
  const hash = location.hash || '#dashboard';
  if (hash.startsWith('#station/')) {
    const stationId = hash.slice('#station/'.length);
    if (FRACTION_STATIONS.has(stationId) || STANDALONE_LABS.has(stationId)) {
      openStation(stationId, { updateHash: false });
      return;
    }
  }
  if (hash === '#lesson') {
    startLesson({ updateHash: false });
    return;
  }
  returnToDashboard(false);
}

// Store subscriptions
subscribeProgress((progress, event) => {
  handleStoreNotification(progress, event);
  updateContinueCard(progress);
  updateSmartBanner(progress);
  updateTopicCardsMeta(progress);
  if (event?.type === 'reset' || event?.type === 'import' || event?.type === 'profileSwitch') {
    updateGradeUI({ refreshStations: true });
  }
});

// Top-level navigation events
$('#homeButton')?.addEventListener('click', () => returnToDashboard(true));
$('#backButton')?.addEventListener('click', () => returnToDashboard(true));
$('#stationBackButton')?.addEventListener('click', () => returnToDashboard(true));
$('#resultHomeButton')?.addEventListener('click', () => returnToDashboard(true));
$('#continueButton')?.addEventListener('click', () => {
  startLesson({ subjectId: getProgress().lastSubject || 'fractions' });
});
$('#openSprintButton')?.addEventListener('click', () => openStation('sprint'));

$('#smartTipButton')?.addEventListener('click', () => {
  if (!currentRecommendation) return;
  if (currentRecommendation.kind === 'focus') {
    startFocusLesson(currentRecommendation.grade, currentRecommendation.topic);
  } else if (currentRecommendation.kind === 'subject') {
    startLesson({ subjectId: currentRecommendation.subjectId });
  } else {
    openStation('sprint');
  }
});

$$('[data-open-math]').forEach(button => button.addEventListener('click', openMathLearning));
$$('[data-open-lab]').forEach(button => {
  button.addEventListener('click', () => openStation(button.dataset.openLab));
});
$$('[data-start-quiz]').forEach(button => {
  button.addEventListener('click', () => startLesson({ subjectId: button.dataset.startQuiz }));
});
$$('[data-station]').forEach(button => button.addEventListener('click', () => openStation(button.dataset.station)));
$$('[data-station-tab]').forEach(button => {
  button.addEventListener('click', () => switchStation(button.dataset.stationTab));
});

$('#heroMascot')?.addEventListener('click', () => reactWithFiete('hero'));
$('#stationFiete')?.addEventListener('click', () => reactWithFiete('station'));

$('#heroSpeakButton')?.addEventListener('click', event => {
  speakText(extractReadableText($('#heroSpeech')), {
    soundOn: getProgress().soundOn,
    button: event.currentTarget,
    onSoundDisabled: showToast
  });
});

$('#stationSpeakButton')?.addEventListener('click', event => {
  speakText($('#stationTutorText')?.textContent || '', {
    soundOn: getProgress().soundOn,
    button: event.currentTarget,
    onSoundDisabled: showToast
  });
});

$('#soundButton')?.addEventListener('click', () => {
  const soundOn = toggleSound();
  if (!soundOn) stopSpeech();
});

$$('.subject-tab').forEach(tab => tab.addEventListener('click', () => activateSubjectTab(tab)));
setupTablistKeyboard('.subject-tabs', '.subject-tab', activateSubjectTab);
setupTablistKeyboard('.station-tabs', '[data-station-tab]', button => switchStation(button.dataset.stationTab));

$('#gradeSelect')?.addEventListener('change', event => {
  setSelectedGrade(event.target.value);
  updateGradeUI({ refreshStations: true });
  if ($('#stationView')?.classList.contains('active')) {
    switchStation(currentStationId, { updateHash: false });
  }
});

$('#badgeButton')?.addEventListener('click', openBadges);
$('#badgeCloseButton')?.addEventListener('click', () => $('#badgeDialog')?.close());
$('#badgeDoneButton')?.addEventListener('click', () => $('#badgeDialog')?.close());
$('#badgeDialog')?.addEventListener('click', event => {
  if (event.target === $('#badgeDialog')) $('#badgeDialog')?.close();
});

window.addEventListener('hashchange', syncViewFromHash);

// Initialize stations, dialogs, cheat sheets, and initial UI state
function bootApp() {
  if (typeof window !== 'undefined') {
    if (window.__KLUUG_BOOTED__) return;
    window.__KLUUG_BOOTED__ = true;
  }

  updateCommonProgressUI(getProgress());
  initPizzaStation();
  initLabStation();
  initDuelStation();
  initQuestStation();
  initSprintStation();
  initGeometryLab({ onStartQuiz: subjectId => startLesson({ subjectId }) });
  initWordsLab({ onStartQuiz: subjectId => startLesson({ subjectId }) });
  initEnglishLab({ onStartQuiz: subjectId => startLesson({ subjectId }) });
  initScienceLab({ onStartQuiz: subjectId => startLesson({ subjectId }) });
  initCheatSheets();
  initProfileDialog({
    onReset: () => updateGradeUI({ refreshStations: true }),
    onImport: () => updateGradeUI({ refreshStations: true }),
    onProfileChange: () => updateGradeUI({ refreshStations: true })
  });
  updateGradeUI({ refreshStations: false });

  if (location.hash && location.hash !== '#dashboard') {
    syncViewFromHash();
  }

  // Register offline service worker when served via HTTP/HTTPS
  if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator && location.protocol?.startsWith('http')) {
    navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' }).catch(() => {});
  }
}

bootApp();
