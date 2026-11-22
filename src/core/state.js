/**
 * Persistent learning progress, multi-profile vault, levels, daily goals,
 * streak tracking, adaptive recommendations, and 15 cross-subject badges.
 */

export const STORAGE_KEY = 'kluug-progress';
export const VAULT_STORAGE_KEY = 'kluug-profiles-v1';
export const DAILY_GOAL_XP = 60;
export const MAX_PROFILES = 6;

export const levels = [
  { level: 1, minXp: 0, title: 'Neugier-Funke', icon: '✨' },
  { level: 2, minXp: 100, title: 'Bruch-Entdecker', icon: '🧩' },
  { level: 3, minXp: 250, title: 'Denk-Detektiv', icon: '🔎' },
  { level: 4, minXp: 500, title: 'Rechen-Profi', icon: '⚡' },
  { level: 5, minXp: 900, title: 'Wissens-Architekt', icon: '📐' },
  { level: 6, minXp: 1500, title: 'KLUUG-Champion', icon: '🏆' }
];

export const badgeDefinitions = [
  { id: 'firstStep', icon: '👣', name: 'Erster Schritt', hint: 'Öffne deine erste Station' },
  { id: 'pizza', icon: '🍕', name: 'Pizza-Meister', hint: 'Erfülle eine Pizza-Bestellung' },
  { id: 'lab', icon: '🍫', name: 'Schoko-Forscher', hint: 'Merke dir einen Labor-Bruch' },
  { id: 'duel', icon: '⚖️', name: 'Vergleichs-Champion', hint: 'Gewinne ein Bruch-Duell' },
  { id: 'quest', icon: '🚀', name: 'Quest-Bezwinger', hint: 'Beende die Bruch-Quiz-Quest' },
  { id: 'streak', icon: '🔥', name: 'Feuer-Serie', hint: 'Löse drei Quiz-Aufgaben in Folge' },
  { id: 'geometry', icon: '📐', name: 'Formen-Architekt', hint: 'Meistere Geometrie-Aufgaben' },
  { id: 'words', icon: '🔎', name: 'Wort-Detektiv', hint: 'Knacke die Wortarten-Werkstatt' },
  { id: 'dictation', icon: '🎧', name: 'Hör-Profi', hint: 'Löse ein Hör-Diktat in Deutsch' },
  { id: 'science', icon: '⚡', name: 'Energie-Checker', hint: 'Erforsche den Energie-Check' },
  { id: 'english', icon: '🌍', name: 'Global Talker', hint: 'Meistere das Englisch-Studio' },
  { id: 'profi', icon: '🎯', name: 'Selbst-Denker', hint: 'Löse 3 Aufgaben im Profi-Eingabemodus' },
  { id: 'sprint', icon: '⏱️', name: 'Blitz-Kopf', hint: 'Erreiche 5 Treffer im 60-Sekunden-Sprint' },
  { id: 'dailyGoal', icon: '🌟', name: 'Tagesheld', hint: 'Erreiche dein Tagesziel von 60 XP' },
  { id: 'allSubjects', icon: '🧭', name: 'Allrounder', hint: 'Sammle Punkte in allen 5 Themenwelten' }
];

const VALID_SUBJECTS = ['fractions', 'geometry', 'words', 'science', 'english'];

function createEmptyGradeMap() {
  return { 5: 0, 6: 0, 7: 0, 8: 0 };
}

export function createDefaultProgress(userName = '', selectedGrade = 5) {
  const cleanName = String(userName || '').trim().slice(0, 24);
  const grade = [5, 6, 7, 8].includes(Number(selectedGrade)) ? Number(selectedGrade) : 5;
  return {
    totalXp: 0,
    dailyXp: 0,
    dailyDate: null,
    badges: [],
    visitedStations: [],
    labDiscoveries: [],
    labChallengesSolved: [],
    soundOn: true,
    profiMode: false,
    profiSolvedCount: 0,
    selectedGrade: grade,
    lastSubject: 'fractions',
    userName: cleanName,
    streakDays: 0,
    lastActiveDate: null,
    bestCorrectByGrade: createEmptyGradeMap(),
    sprintBestByGrade: createEmptyGradeMap(),
    bestCorrectBySubject: {
      fractions: createEmptyGradeMap(),
      geometry: createEmptyGradeMap(),
      words: createEmptyGradeMap(),
      science: createEmptyGradeMap(),
      english: createEmptyGradeMap()
    },
    topicStatsByGrade: { 5: {}, 6: {}, 7: {}, 8: {} },
    stationStats: {
      pizzaSolved: 0,
      duelWins: 0,
      duelStreak: 0,
      bestDuelStreak: 0,
      geometrySolved: 0,
      wordsSolved: 0,
      dictationSolved: 0,
      scienceSolved: 0,
      englishSolved: 0
    }
  };
}

/**
 * Merges persisted raw JSON safely with defaults (supports upgrading v1/v2/v3 storage).
 */
export function mergeProgress(raw) {
  const base = createDefaultProgress();
  if (!raw || typeof raw !== 'object') return base;

  const grade = Number(raw.selectedGrade);
  const mergedBestGrade = {
    ...base.bestCorrectByGrade,
    ...(raw.bestCorrectByGrade && typeof raw.bestCorrectByGrade === 'object' ? raw.bestCorrectByGrade : {})
  };

  const rawBySubj = raw.bestCorrectBySubject && typeof raw.bestCorrectBySubject === 'object' ? raw.bestCorrectBySubject : {};
  const mergedBestBySubject = {
    fractions: { ...mergedBestGrade, ...(rawBySubj.fractions || {}) },
    geometry: { ...createEmptyGradeMap(), ...(rawBySubj.geometry || {}) },
    words: { ...createEmptyGradeMap(), ...(rawBySubj.words || {}) },
    science: { ...createEmptyGradeMap(), ...(rawBySubj.science || {}) },
    english: { ...createEmptyGradeMap(), ...(rawBySubj.english || {}) }
  };

  return {
    ...base,
    ...raw,
    totalXp: Math.max(0, Number(raw.totalXp) || 0),
    dailyXp: Math.max(0, Number(raw.dailyXp) || 0),
    dailyDate: typeof raw.dailyDate === 'string' ? raw.dailyDate : null,
    badges: Array.isArray(raw.badges) ? [...new Set(raw.badges)] : [],
    visitedStations: Array.isArray(raw.visitedStations) ? [...new Set(raw.visitedStations)] : [],
    labDiscoveries: Array.isArray(raw.labDiscoveries) ? [...new Set(raw.labDiscoveries)] : [],
    labChallengesSolved: Array.isArray(raw.labChallengesSolved) ? [...new Set(raw.labChallengesSolved)] : [],
    soundOn: raw.soundOn !== false,
    profiMode: raw.profiMode === true,
    profiSolvedCount: Math.max(0, Number(raw.profiSolvedCount) || 0),
    selectedGrade: [5, 6, 7, 8].includes(grade) ? grade : 5,
    lastSubject: VALID_SUBJECTS.includes(raw.lastSubject) ? raw.lastSubject : 'fractions',
    userName: typeof raw.userName === 'string' && raw.userName.trim() ? raw.userName.trim().slice(0, 24) : '',
    streakDays: Math.max(0, Number(raw.streakDays) || 0),
    lastActiveDate: typeof raw.lastActiveDate === 'string' ? raw.lastActiveDate : null,
    bestCorrectByGrade: mergedBestBySubject.fractions,
    sprintBestByGrade: {
      ...createEmptyGradeMap(),
      ...(raw.sprintBestByGrade && typeof raw.sprintBestByGrade === 'object' ? raw.sprintBestByGrade : {})
    },
    bestCorrectBySubject: mergedBestBySubject,
    topicStatsByGrade: {
      ...base.topicStatsByGrade,
      ...(raw.topicStatsByGrade && typeof raw.topicStatsByGrade === 'object' ? raw.topicStatsByGrade : {})
    },
    stationStats: {
      ...base.stationStats,
      ...(raw.stationStats && typeof raw.stationStats === 'object' ? raw.stationStats : {})
    }
  };
}

/**
 * Multi-profile vault helpers.
 */
export function createProfileVault(initialProgress = createDefaultProgress()) {
  return {
    activeProfileId: 'p1',
    profiles: {
      p1: mergeProgress(initialProgress)
    }
  };
}

export function mergeVault(raw) {
  if (!raw || typeof raw !== 'object' || !raw.profiles || typeof raw.profiles !== 'object') {
    return createProfileVault();
  }
  const entries = Object.entries(raw.profiles);
  if (entries.length === 0) {
    return createProfileVault();
  }
  const profiles = {};
  for (const [id, data] of entries.slice(0, MAX_PROFILES)) {
    profiles[id] = mergeProgress(data);
  }
  const activeProfileId = profiles[raw.activeProfileId] ? raw.activeProfileId : Object.keys(profiles)[0];
  return { activeProfileId, profiles };
}

export function addProfileToVault(vault, userName, grade = 5) {
  const existingIds = Object.keys(vault.profiles);
  if (existingIds.length >= MAX_PROFILES) {
    throw new Error(`Maximal ${MAX_PROFILES} Profile möglich.`);
  }
  let idx = existingIds.length + 1;
  while (vault.profiles[`p${idx}`]) idx += 1;
  const newId = `p${idx}`;
  const nextVault = {
    activeProfileId: newId,
    profiles: {
      ...vault.profiles,
      [newId]: createDefaultProgress(userName, grade)
    }
  };
  return { vault: nextVault, newId };
}

export function switchProfileInVault(vault, profileId) {
  if (!vault.profiles[profileId]) return vault;
  return { ...vault, activeProfileId: profileId };
}

export function deleteProfileFromVault(vault, profileId) {
  const ids = Object.keys(vault.profiles);
  if (ids.length <= 1 || !vault.profiles[profileId]) return vault;
  const profiles = { ...vault.profiles };
  delete profiles[profileId];
  const remaining = Object.keys(profiles);
  const activeProfileId =
    vault.activeProfileId === profileId ? remaining[0] : vault.activeProfileId;
  return { activeProfileId, profiles };
}

/**
 * Checks whether the learner has completed at least one task across all 5 subjects.
 */
export function hasExploredAllSubjects(progress) {
  const bySubj = progress?.bestCorrectBySubject || {};
  const stats = progress?.stationStats || {};
  const hasAnyGrade = subj => [5, 6, 7, 8].some(g => (bySubj[subj]?.[g] || 0) > 0);

  const fractionsOk = (progress?.visitedStations?.length || 0) > 0 || hasAnyGrade('fractions');
  const geometryOk = (stats.geometrySolved || 0) > 0 || hasAnyGrade('geometry');
  const wordsOk = (stats.wordsSolved || 0) > 0 || (stats.dictationSolved || 0) > 0 || hasAnyGrade('words');
  const scienceOk = (stats.scienceSolved || 0) > 0 || hasAnyGrade('science');
  const englishOk = (stats.englishSolved || 0) > 0 || hasAnyGrade('english');
  return fractionsOk && geometryOk && wordsOk && scienceOk && englishOk;
}

/**
 * Formats a Date as a local YYYY-MM-DD key.
 */
export function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getPreviousDateKey(dateKey) {
  const match = String(dateKey).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]) - 1);
  return getLocalDateKey(date);
}

/**
 * Computes updated daily streak counts for a given YYYY-MM-DD activity date.
 */
export function computeNextStreak(currentStreak, lastActiveDate, todayKey) {
  const streak = Math.max(0, Number(currentStreak) || 0);
  if (!todayKey) return { streakDays: streak, lastActiveDate };

  if (lastActiveDate === todayKey) {
    return { streakDays: Math.max(1, streak), lastActiveDate: todayKey };
  }
  const yesterdayKey = getPreviousDateKey(todayKey);
  if (lastActiveDate && lastActiveDate === yesterdayKey) {
    return { streakDays: streak + 1, lastActiveDate: todayKey };
  }
  return { streakDays: 1, lastActiveDate: todayKey };
}

/**
 * Computes current KLUUG rank/level and progress toward the next level.
 */
export function getLevelInfo(totalXp) {
  const xp = Math.max(0, Number(totalXp) || 0);
  let current = levels[0];
  let next = levels[1] || null;

  for (let i = 0; i < levels.length; i++) {
    if (xp >= levels[i].minXp) {
      current = levels[i];
      next = levels[i + 1] || null;
    }
  }

  if (!next) {
    return {
      ...current,
      nextLevelXp: null,
      remainingXp: 0,
      progressPercent: 100
    };
  }

  const span = next.minXp - current.minXp;
  const intoLevel = xp - current.minXp;
  return {
    ...current,
    nextLevelXp: next.minXp,
    remainingXp: next.minXp - xp,
    progressPercent: Math.min(100, Math.max(0, Math.round((intoLevel / span) * 100)))
  };
}

/**
 * Returns today's earned XP (resets automatically when the calendar date changes).
 */
export function getTodayXp(progress, todayKey = getLocalDateKey()) {
  if (!progress || progress.dailyDate !== todayKey) return 0;
  return Math.max(0, Number(progress.dailyXp) || 0);
}

/**
 * Derives 1-2 uppercase initials from a student's display name.
 */
export function getInitials(name) {
  const cleaned = String(name || '').trim();
  if (!cleaned) return 'KL';
  const parts = cleaned.split(/[\s-]+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return cleaned.slice(0, 2).toUpperCase();
}

/**
 * Computes overall progress percentage (0-100) for a given subject and grade.
 */
export function computeSubjectProgressPercent(progress, subject, grade) {
  if (subject === 'fractions') {
    const visitedCount = Math.min(4, progress.visitedStations?.length || 0);
    const bestCorrect = Math.min(10, Math.max(0, Number(progress.bestCorrectBySubject?.fractions?.[grade]) || 0));
    return Math.round((visitedCount / 4) * 40 + (bestCorrect / 10) * 60);
  }

  const statKey =
    subject === 'geometry'
      ? 'geometrySolved'
      : subject === 'words'
        ? 'wordsSolved'
        : subject === 'english'
          ? 'englishSolved'
          : 'scienceSolved';
  const labPart = (progress.stationStats?.[statKey] || 0) > 0 ? 30 : 0;
  const bestCorrect = Math.min(6, Math.max(0, Number(progress.bestCorrectBySubject?.[subject]?.[grade]) || 0));
  return Math.round(labPart + (bestCorrect / 6) * 70);
}

/**
 * Backward-compatible alias for fraction grade progress percentage.
 */
export function computeGradeProgressPercent(progress, grade) {
  return computeSubjectProgressPercent(progress, 'fractions', grade);
}

/**
 * Serializes progress for portable JSON export.
 */
export function exportProgressJSON(progress) {
  return JSON.stringify(
    {
      app: 'KLUUG',
      exportedAt: new Date().toISOString(),
      progress
    },
    null,
    2
  );
}

/**
 * Analyzes local topic statistics and subject progress for an adaptive study tip.
 */
export function getSmartRecommendation(progress, grade = progress?.selectedGrade || 5) {
  const topicStats = progress?.topicStatsByGrade?.[grade] || {};
  let weakest = null;

  for (const [topic, stat] of Object.entries(topicStats)) {
    if (!stat || stat.total < 2) continue;
    const ratio = stat.correct / stat.total;
    if (ratio < 0.7 && (!weakest || ratio < weakest.ratio)) {
      weakest = { topic, ratio, correct: stat.correct, total: stat.total };
    }
  }

  if (weakest) {
    const pct = Math.round(weakest.ratio * 100);
    return {
      kind: 'focus',
      grade,
      topic: weakest.topic,
      accuracyPct: pct,
      badge: 'GEZIELTES TRAINING',
      title: `Thema „${weakest.topic}“ festigen`,
      description: `Hier stehst du in Klasse ${grade} aktuell bei ${pct} % (${weakest.correct}/${weakest.total}). Fiete hat genau passende Übungen bereitgelegt!`,
      buttonLabel: 'Fokus-Übung starten →'
    };
  }

  const bySubj = progress?.bestCorrectBySubject || {};
  const subjectPrompts = [
    { id: 'fractions', name: 'Brüche verstehen', desc: 'Starte deine 10er Quiz-Quest rund um Brüche.' },
    { id: 'geometry', name: 'Formen & Flächen', desc: 'Entdecke Winkel, Flächen und Kreise in Geometrie.' },
    { id: 'words', name: 'Wortarten-Detektive', desc: 'Teste Wortarten, Fälle, Diktate und Satzbau in Deutsch.' },
    { id: 'english', name: 'English Boost', desc: 'Trainiere Vokabeln, Zeitformen und Aussprache auf Englisch.' },
    { id: 'science', name: 'Energie-Check', desc: 'Prüfe Stromkreise, Kräfte und Energieformen.' }
  ];

  const untouched = subjectPrompts.find(item => (bySubj[item.id]?.[grade] || 0) === 0);
  if (untouched) {
    return {
      kind: 'subject',
      subjectId: untouched.id,
      grade,
      badge: 'NEUES ENTDECKEN',
      title: `Probier „${untouched.name}“ in Klasse ${grade}`,
      description: untouched.desc,
      buttonLabel: 'Thema starten →'
    };
  }

  const sprintBest = progress?.sprintBestByGrade?.[grade] || 0;
  return {
    kind: 'sprint',
    grade,
    badge: 'TEMPO-CHALLENGE',
    title: sprintBest > 0 ? `Knack deinen Sprint-Rekord (${sprintBest} Treffer)` : 'Teste den 60-Sekunden-Sprint!',
    description: `Kurze Kopf-Fragen zu Klasse ${grade} quer durch alle Themen. Fehler kosten keine Punkte!`,
    buttonLabel: 'Blitz-Sprint starten →'
  };
}

/**
 * Formats a concise human-readable learning summary for parents, teachers, or personal notes.
 */
export function formatLearningReportText(progress) {
  const grade = progress?.selectedGrade || 5;
  const levelInfo = getLevelInfo(progress?.totalXp || 0);
  const bySubj = progress?.bestCorrectBySubject || {};
  const topicEntries = Object.entries(progress?.topicStatsByGrade?.[grade] || {});
  const topicsText =
    topicEntries.length > 0
      ? topicEntries.map(([t, s]) => `- ${t}: ${s.correct}/${s.total}`).join('\n')
      : '- Noch keine Quiz-Daten in dieser Klasse';

  return [
    `KLUUG Lernbericht – ${progress?.userName || 'Mein Lernprofil'} (Klasse ${grade})`,
    `Level: ${levelInfo.level} (${levelInfo.title}) · ${progress?.totalXp || 0} XP`,
    `Lernserie: ${progress?.streakDays || 0} Tage · Abzeichen: ${progress?.badges?.length || 0}/${badgeDefinitions.length}`,
    `Bestleistungen Klasse ${grade}:`,
    `- Brüche: ${bySubj.fractions?.[grade] || 0}/10`,
    `- Geometrie: ${bySubj.geometry?.[grade] || 0}/6`,
    `- Deutsch: ${bySubj.words?.[grade] || 0}/6`,
    `- Englisch: ${bySubj.english?.[grade] || 0}/6`,
    `- Natur & Technik: ${bySubj.science?.[grade] || 0}/6`,
    `- Blitz-Sprint Rekord: ${progress?.sprintBestByGrade?.[grade] || 0} Treffer`,
    `Themen-Check Klasse ${grade}:`,
    topicsText
  ].join('\n');
}

/**
 * Loads the multi-profile vault from localStorage, migrating legacy single-profile data seamlessly.
 */
export function loadVault(storage = typeof localStorage !== 'undefined' ? localStorage : null) {
  if (!storage) return createProfileVault();
  try {
    const rawVault = storage.getItem(VAULT_STORAGE_KEY);
    if (rawVault) {
      return mergeVault(JSON.parse(rawVault));
    }
    const legacy = storage.getItem(STORAGE_KEY);
    if (legacy) {
      return createProfileVault(mergeProgress(JSON.parse(legacy)));
    }
  } catch (_) {
    /* Storage fallback */
  }
  return createProfileVault();
}

/**
 * Saves the multi-profile vault and mirrors the active profile to STORAGE_KEY.
 */
export function persistVault(vault, storage = typeof localStorage !== 'undefined' ? localStorage : null) {
  if (!storage || !vault) return;
  try {
    storage.setItem(VAULT_STORAGE_KEY, JSON.stringify(vault));
    const active = vault.profiles[vault.activeProfileId];
    if (active) {
      storage.setItem(STORAGE_KEY, JSON.stringify(active));
    }
  } catch (_) {
    /* Storage is optional. */
  }
}

export function loadProgress(storage = typeof localStorage !== 'undefined' ? localStorage : null) {
  const vault = loadVault(storage);
  return vault.profiles[vault.activeProfileId] || createDefaultProgress();
}

export function persistProgress(progress, storage = typeof localStorage !== 'undefined' ? localStorage : null) {
  if (!storage) return;
  try {
    const vault = loadVault(storage);
    vault.profiles[vault.activeProfileId] = mergeProgress(progress);
    persistVault(vault, storage);
  } catch (_) {
    /* Storage is optional. */
  }
}
