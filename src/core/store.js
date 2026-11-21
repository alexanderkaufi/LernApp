/**
 * Central in-memory multi-profile store backed by localStorage and subscribers.
 */

import {
  DAILY_GOAL_XP,
  addProfileToVault,
  badgeDefinitions,
  computeNextStreak,
  createDefaultProgress,
  deleteProfileFromVault,
  getLevelInfo,
  getLocalDateKey,
  getTodayXp,
  hasExploredAllSubjects,
  loadVault,
  mergeProgress,
  persistVault,
  switchProfileInVault
} from './state.js';

let vault = loadVault();
let progress = vault.profiles[vault.activeProfileId];
const listeners = new Set();

function syncVaultAndNotify(event = { type: 'update' }) {
  vault.profiles[vault.activeProfileId] = progress;
  persistVault(vault);
  listeners.forEach(listener => listener(progress, event));
}

function checkAllSubjectsBadge() {
  if (!progress.badges.includes('allSubjects') && hasExploredAllSubjects(progress)) {
    unlockBadge('allSubjects');
  }
}

export function getProgress() {
  return progress;
}

export function getVaultSnapshot() {
  return {
    activeProfileId: vault.activeProfileId,
    profiles: Object.entries(vault.profiles).map(([id, data]) => ({
      id,
      userName: data.userName,
      selectedGrade: data.selectedGrade,
      totalXp: data.totalXp
    }))
  };
}

export function subscribeProgress(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function createNewProfile(userName, grade = 5) {
  const result = addProfileToVault(vault, userName, grade);
  vault = result.vault;
  progress = vault.profiles[vault.activeProfileId];
  syncVaultAndNotify({ type: 'profileSwitch', profileId: result.newId });
  return result.newId;
}

export function selectProfile(profileId) {
  const next = switchProfileInVault(vault, profileId);
  if (next.activeProfileId === vault.activeProfileId) return false;
  vault = next;
  progress = vault.profiles[vault.activeProfileId];
  syncVaultAndNotify({ type: 'profileSwitch', profileId });
  return true;
}

export function removeProfile(profileId) {
  const next = deleteProfileFromVault(vault, profileId);
  if (Object.keys(next.profiles).length === Object.keys(vault.profiles).length) return false;
  vault = next;
  progress = vault.profiles[vault.activeProfileId];
  syncVaultAndNotify({ type: 'profileSwitch', profileId: vault.activeProfileId });
  return true;
}

export function setSelectedGrade(grade) {
  const numeric = Number(grade);
  if (![5, 6, 7, 8].includes(numeric)) return;
  progress.selectedGrade = numeric;
  syncVaultAndNotify({ type: 'grade', grade: numeric });
}

export function setLastSubject(subject) {
  if (!['fractions', 'geometry', 'words', 'science', 'english'].includes(subject)) return;
  if (progress.lastSubject === subject) return;
  progress.lastSubject = subject;
  syncVaultAndNotify({ type: 'subject', subject });
}

export function toggleSound() {
  progress.soundOn = !progress.soundOn;
  syncVaultAndNotify({ type: 'sound', soundOn: progress.soundOn });
  return progress.soundOn;
}

export function setUserName(name) {
  const trimmed = String(name || '').trim().slice(0, 24);
  progress.userName = trimmed || 'Alex';
  syncVaultAndNotify({ type: 'profile' });
  return progress.userName;
}

function touchDailyStreak(date = new Date()) {
  const todayKey = getLocalDateKey(date);
  const next = computeNextStreak(progress.streakDays, progress.lastActiveDate, todayKey);
  progress.streakDays = next.streakDays;
  progress.lastActiveDate = next.lastActiveDate;
  return todayKey;
}

export function recordActivity(date = new Date()) {
  touchDailyStreak(date);
  syncVaultAndNotify({ type: 'streak' });
}

export function unlockBadge(id) {
  if (progress.badges.includes(id)) return false;
  progress.badges.push(id);
  const badge = badgeDefinitions.find(item => item.id === id);
  syncVaultAndNotify({ type: 'badge', badge });
  return true;
}

export function awardXp(amount) {
  if (!amount || amount <= 0) return;
  const prevLevel = getLevelInfo(progress.totalXp).level;
  const todayKey = touchDailyStreak(new Date());
  const prevDaily = getTodayXp(progress, todayKey);
  const nextDaily = prevDaily + amount;

  progress.dailyDate = todayKey;
  progress.dailyXp = nextDaily;
  progress.totalXp += amount;

  const newLevelInfo = getLevelInfo(progress.totalXp);
  const leveledUp = newLevelInfo.level > prevLevel ? newLevelInfo : null;
  const dailyGoalReached = prevDaily < DAILY_GOAL_XP && nextDaily >= DAILY_GOAL_XP;

  syncVaultAndNotify({ type: 'xp', amount, leveledUp, dailyGoalReached });
  if (dailyGoalReached) {
    unlockBadge('dailyGoal');
  }
}

export function visitStation(id) {
  if (progress.visitedStations.includes(id)) return false;
  progress.visitedStations.push(id);
  const todayKey = touchDailyStreak(new Date());
  const prevDaily = getTodayXp(progress, todayKey);
  progress.dailyDate = todayKey;
  progress.dailyXp = prevDaily + 5;
  progress.totalXp += 5;

  const unlockedFirst = !progress.badges.includes('firstStep');
  if (unlockedFirst) {
    progress.badges.push('firstStep');
  }
  syncVaultAndNotify({
    type: 'stationVisit',
    stationId: id,
    badge: unlockedFirst ? badgeDefinitions.find(item => item.id === 'firstStep') : null
  });
  checkAllSubjectsBadge();
  return true;
}

export function rememberDiscovery(fractionText) {
  if (progress.labDiscoveries.includes(fractionText)) return false;
  progress.labDiscoveries.push(fractionText);
  awardXp(10);
  unlockBadge('lab');
  return true;
}

export function markLabChallengeSolved(challengeId) {
  if (progress.labChallengesSolved.includes(challengeId)) return false;
  progress.labChallengesSolved.push(challengeId);
  progress.stationStats.labChallengesSolved += 1;
  awardXp(10);
  unlockBadge('lab');
  return true;
}

export function recordPizzaSolved() {
  progress.stationStats.pizzaSolved += 1;
  awardXp(15);
  unlockBadge('pizza');
}

export function recordDuelOutcome(won) {
  if (won) {
    progress.stationStats.duelWins += 1;
    progress.stationStats.duelStreak += 1;
    progress.stationStats.bestDuelStreak = Math.max(
      progress.stationStats.bestDuelStreak,
      progress.stationStats.duelStreak
    );
    awardXp(15);
    unlockBadge('duel');
  } else {
    progress.stationStats.duelStreak = 0;
    recordActivity();
  }
}

export function recordSubjectLabSolved(subject, challengeId = null) {
  const isNew = !challengeId || !progress.labChallengesSolved.includes(challengeId);
  if (challengeId && isNew) {
    progress.labChallengesSolved.push(challengeId);
  }
  if (subject === 'geometry') {
    if (isNew) {
      progress.stationStats.geometrySolved += 1;
      awardXp(15);
    } else {
      recordActivity();
    }
    unlockBadge('geometry');
  } else if (subject === 'words') {
    if (isNew) {
      progress.stationStats.wordsSolved += 1;
      awardXp(15);
    } else {
      recordActivity();
    }
    unlockBadge('words');
  } else if (subject === 'dictation') {
    if (isNew) {
      progress.stationStats.dictationSolved += 1;
      awardXp(15);
    } else {
      recordActivity();
    }
    unlockBadge('dictation');
  } else if (subject === 'science') {
    if (isNew) {
      progress.stationStats.scienceSolved += 1;
      awardXp(15);
    } else {
      recordActivity();
    }
    unlockBadge('science');
  } else if (subject === 'english') {
    if (isNew) {
      progress.stationStats.englishSolved += 1;
      awardXp(15);
    } else {
      recordActivity();
    }
    unlockBadge('english');
  }
  checkAllSubjectsBadge();
  return isNew;
}

export function recordTopicResult(grade, topic, isCorrect) {
  const gradeBucket = progress.topicStatsByGrade[grade] || (progress.topicStatsByGrade[grade] = {});
  const entry = gradeBucket[topic] || { correct: 0, total: 0 };
  entry.total += 1;
  if (isCorrect) entry.correct += 1;
  gradeBucket[topic] = entry;
  vault.profiles[vault.activeProfileId] = progress;
  persistVault(vault);
}

export function recordQuizCompletion(subject, grade, correctCount, expectedTotal) {
  if (!progress.bestCorrectBySubject[subject]) {
    progress.bestCorrectBySubject[subject] = { 5: 0, 6: 0, 7: 0, 8: 0 };
  }
  const currentBest = Number(progress.bestCorrectBySubject[subject][grade]) || 0;
  if (correctCount > currentBest) {
    progress.bestCorrectBySubject[subject][grade] = correctCount;
    if (subject === 'fractions') {
      progress.bestCorrectByGrade[grade] = correctCount;
    }
  }
  syncVaultAndNotify({ type: 'quizComplete', subject, grade, correctCount, expectedTotal });
  checkAllSubjectsBadge();
}

export function setProfiMode(enabled) {
  progress.profiMode = Boolean(enabled);
  syncVaultAndNotify({ type: 'profiMode', profiMode: progress.profiMode });
  return progress.profiMode;
}

export function recordProfiSolved() {
  progress.profiSolvedCount = (Number(progress.profiSolvedCount) || 0) + 1;
  vault.profiles[vault.activeProfileId] = progress;
  persistVault(vault);
  if (progress.profiSolvedCount >= 3) {
    unlockBadge('profi');
  }
}

export function recordSprintResult(grade, hits, xpGain) {
  if (!progress.sprintBestByGrade) {
    progress.sprintBestByGrade = { 5: 0, 6: 0, 7: 0, 8: 0 };
  }
  const prevBest = Number(progress.sprintBestByGrade[grade]) || 0;
  const isNewRecord = hits > prevBest;
  if (isNewRecord) {
    progress.sprintBestByGrade[grade] = hits;
  }
  if (xpGain > 0) {
    awardXp(xpGain);
  } else {
    recordActivity();
  }
  if (hits >= 5) {
    unlockBadge('sprint');
  }
  syncVaultAndNotify({ type: 'sprintComplete', grade, hits, isNewRecord });
  return isNewRecord;
}

export function importProgressData(rawPayload) {
  const candidate =
    rawPayload && typeof rawPayload === 'object' && rawPayload.progress
      ? rawPayload.progress
      : rawPayload;
  if (!candidate || typeof candidate !== 'object') {
    throw new Error('Ungültiges Backup-Format');
  }
  progress = mergeProgress(candidate);
  syncVaultAndNotify({ type: 'import' });
  return progress;
}

export function resetAllProgress() {
  const keepSound = progress.soundOn;
  const keepName = progress.userName;
  const keepGrade = progress.selectedGrade;
  progress = createDefaultProgress(keepName, keepGrade);
  progress.soundOn = keepSound;
  syncVaultAndNotify({ type: 'reset' });
}
