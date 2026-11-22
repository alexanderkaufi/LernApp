/**
 * Shared DOM helpers, navigation/view management, tutor UI, toasts, and badge modal.
 */

import { DAILY_GOAL_XP, badgeDefinitions, getInitials, getLevelInfo, getTodayXp } from './state.js';
import { getProgress } from './store.js';
import { playChime, playTone, stopSpeech } from './audio.js';

export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

let toastTimer = null;
let reactionIndex = 0;

const fieteReactions = [
  'High Five! ✋ Dein Gehirn ist heute richtig wach.',
  'Fun Fact: Ein halber Kuchen bleibt ein halber Kuchen – egal wie groß er ist!',
  'Hihi, das kitzelt! Jetzt aber weiterforschen.',
  'Du musst nicht schnell sein. Genau hinschauen ist viel wichtiger.',
  'Fehler entdeckt? Perfekt – jetzt weiß dein Kopf, wo er trainieren darf.'
];

export function showToast(title, message) {
  const toast = $('#toast');
  if (!toast) return;
  $('strong', toast).textContent = title;
  $('p', toast).textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

export function showView(name, { updateHash = true, stationId = null } = {}) {
  const views = {
    dashboard: $('#dashboardView'),
    station: $('#stationView'),
    lesson: $('#lessonView'),
    result: $('#resultView')
  };
  if (!views[name]) return;

  stopSpeech();
  Object.values(views).forEach(view => view && view.classList.remove('active'));
  views[name].classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (updateHash && typeof history !== 'undefined' && typeof location !== 'undefined') {
    const targetHash =
      name === 'station' && stationId
        ? `#station/${stationId}`
        : name === 'dashboard'
          ? '#dashboard'
          : `#${name}`;
    if (location.hash !== targetHash) {
      try {
        history.pushState({ view: name, stationId }, '', targetHash);
      } catch (_) {
        /* Fallback when history manipulation is restricted. */
      }
    }
  }
}

export function setStationTutor(message, mood = 'happy') {
  const textEl = $('#stationTutorText');
  const faceEl = $('#stationFiete');
  if (textEl) textEl.textContent = message;
  if (faceEl) {
    faceEl.classList.toggle('thinking', mood === 'thinking');
    faceEl.classList.toggle('celebrating', mood === 'celebrating');
  }
}

export function setLessonTutor(message, mood = 'happy') {
  const textEl = $('#tutorText');
  const mascotEl = $('#lessonMascot');
  if (textEl) textEl.textContent = message;
  if (mascotEl) {
    mascotEl.classList.toggle('sad', mood === 'sad');
    mascotEl.classList.toggle('celebrating', mood === 'celebrating');
  }
}

export function reactWithFiete(location = 'hero') {
  const message = fieteReactions[reactionIndex++ % fieteReactions.length];
  if (location === 'hero') {
    $('#heroSpeech').innerHTML = `${message}<br /><strong>Weiter so!</strong>`;
    $('#heroMascot').classList.remove('high-five');
    requestAnimationFrame(() => $('#heroMascot').classList.add('high-five'));
  } else if (location === 'lesson') {
    setLessonTutor(message, 'celebrating');
  } else {
    setStationTutor(message, 'celebrating');
  }
  playTone(620, 0.16, getProgress().soundOn);
}

export function renderBadges() {
  const grid = $('#badgeGrid');
  if (!grid) return;
  const progress = getProgress();
  grid.innerHTML = badgeDefinitions
    .map(badge => {
      const unlocked = progress.badges.includes(badge.id);
      return `<article class="badge-item ${unlocked ? 'unlocked' : 'locked'}"><span>${unlocked ? badge.icon : '🔒'}</span><strong>${badge.name}</strong><small>${unlocked ? 'Geschafft!' : badge.hint}</small></article>`;
    })
    .join('');
}

export function openBadges() {
  renderBadges();
  const dialog = $('#badgeDialog');
  if (dialog && typeof dialog.showModal === 'function') {
    dialog.showModal();
  }
}

export function updateCommonProgressUI(progress) {
  const xp = progress.totalXp;
  if ($('#headerXp')) $('#headerXp').textContent = xp;
  if ($('#stationXp')) $('#stationXp').textContent = xp;
  if ($('#adventureCount')) $('#adventureCount').textContent = progress.visitedStations.length;
  if ($('#headerStreak')) $('#headerStreak').textContent = progress.streakDays;

  const levelInfo = getLevelInfo(xp);
  if ($('#heroLevelText')) {
    $('#heroLevelText').textContent = `${levelInfo.icon} Level ${levelInfo.level} · ${levelInfo.title}`;
  }
  if ($('#heroLevelBar')) {
    $('#heroLevelBar').style.width = `${levelInfo.progressPercent}%`;
  }
  if ($('#heroNextLevelHint')) {
    $('#heroNextLevelHint').textContent = levelInfo.nextLevelXp
      ? `Noch ${levelInfo.remainingXp} XP bis Level ${levelInfo.level + 1}`
      : 'Höchstes Level erreicht!';
  }

  const todayXp = getTodayXp(progress);
  const dailyPct = Math.min(100, Math.round((todayXp / DAILY_GOAL_XP) * 100));
  if ($('#dailyGoalText')) {
    $('#dailyGoalText').textContent =
      todayXp >= DAILY_GOAL_XP
        ? `🎯 Tagesziel geschafft (${todayXp} XP)`
        : `🎯 Tagesziel: ${todayXp} / ${DAILY_GOAL_XP} XP`;
  }
  if ($('#dailyGoalBar')) {
    $('#dailyGoalBar').style.width = `${dailyPct}%`;
  }

  const userName = progress.userName || '';
  const profileBtn = $('#profileButton');
  if (profileBtn) {
    profileBtn.textContent = getInitials(userName);
    profileBtn.setAttribute('aria-label', userName ? `Profil von ${userName} öffnen` : 'Profil öffnen');
  }

  const soundBtn = $('#soundButton');
  if (soundBtn) {
    soundBtn.classList.toggle('off', !progress.soundOn);
    soundBtn.textContent = progress.soundOn ? '♪' : '×';
    soundBtn.setAttribute('aria-pressed', String(progress.soundOn));
    soundBtn.setAttribute('aria-label', progress.soundOn ? 'Ton ausschalten' : 'Ton einschalten');
  }

  renderBadges();
}

export function handleStoreNotification(progress, event) {
  updateCommonProgressUI(progress);
  if (event?.badge) {
    showToast(`${event.badge.icon} Abzeichen freigeschaltet!`, event.badge.name);
    playChime([587.33, 739.99, 880], progress.soundOn);
  } else if (event?.leveledUp) {
    showToast(`${event.leveledUp.icon} Level ${event.leveledUp.level} erreicht!`, `Neuer Rang: ${event.leveledUp.title}`);
    playChime([523.25, 659.25, 783.99, 1046.5], progress.soundOn);
  } else if (event?.dailyGoalReached) {
    showToast('🎯 Tagesziel geschafft!', `Du hast heute schon ${DAILY_GOAL_XP} XP gesammelt.`);
    playChime([587.33, 783.99], progress.soundOn);
  }
}

/**
 * Adds WAI-ARIA Left/Right/Home/End keyboard navigation to a tablist.
 */
export function setupTablistKeyboard(containerSelector, tabSelector, onActivate) {
  const container = $(containerSelector);
  if (!container) return;

  container.addEventListener('keydown', event => {
    const tabs = $$(tabSelector, container);
    const currentIndex = tabs.indexOf(document.activeElement);
    if (currentIndex === -1) return;

    let nextIndex = -1;
    if (event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % tabs.length;
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = tabs.length - 1;
    }

    if (nextIndex !== -1) {
      event.preventDefault();
      tabs[nextIndex].focus();
      onActivate(tabs[nextIndex]);
    }
  });
}
