/**
 * Zero-dependency test suite runnable with macOS JavaScriptCore (`jsc -m tests/run_tests.mjs`).
 */

import {
  compareFractions,
  expressionHTML,
  formatDecimalDE,
  formatPercentDE,
  fractionHTML,
  greatestCommonDivisor,
  isFreeInputEligible,
  isFreeInputMatch,
  shuffleArray,
  simplifyFraction
} from '../src/core/math.js';
import {
  DAILY_GOAL_XP,
  STORAGE_KEY,
  VAULT_STORAGE_KEY,
  addProfileToVault,
  badgeDefinitions,
  computeGradeProgressPercent,
  computeNextStreak,
  computeSubjectProgressPercent,
  createProfileVault,
  deleteProfileFromVault,
  exportProgressJSON,
  formatLearningReportText,
  getInitials,
  getLevelInfo,
  getSmartRecommendation,
  getTodayXp,
  hasExploredAllSubjects,
  loadVault,
  mergeProgress,
  switchProfileInVault
} from '../src/core/state.js';
import { prepareSpeechText } from '../src/core/audio.js';
import { cheatSheetCards } from '../data/cheatsheets.js';
import { englishQuestionsByGrade, englishStudioTasksByGrade } from '../data/english.js';
import {
  buildQuizSession,
  labChallengesByGrade,
  prepareQuestionWithShuffledAnswers,
  questionsByGrade
} from '../data/fractions.js';
import { geometryLabChallengesByGrade, geometryQuestionsByGrade } from '../data/geometry.js';
import { wordScannerTasksByGrade, wordsDictationByGrade, wordsQuestionsByGrade } from '../data/words.js';
import {
  scienceLabChallengesByGrade,
  scienceLabSystems,
  scienceQuestionsByGrade
} from '../data/science.js';
import { buildSubjectQuizSession, buildTopicFocusSession, subjectCatalog } from '../data/subjects.js';
import { createPizzaOrder } from '../src/stations/pizza.js';
import { getEquivalentFractions } from '../src/stations/lab.js';
import { createDuelRound } from '../src/stations/duel.js';
import { createSprintQuestion } from '../src/stations/sprint.js';
import {
  classifyAngle,
  renderAngleSvg,
  renderGeometryQuestionSvg
} from '../src/stations/geometryLab.js';
import { evaluateDictationAnswer, evaluateWordSelection } from '../src/stations/wordsLab.js';
import { computeEnergyOutputs } from '../src/stations/scienceLab.js';
import { formatSentenceMarkup } from '../src/stations/quest.js';

let passed = 0;

function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
  passed += 1;
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(
      `Assertion failed (${message}): expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`
    );
  }
  passed += 1;
}

// 1. Math helpers
assertEqual(greatestCommonDivisor(18, 24), 6, 'gcd(18, 24)');
assertEqual(greatestCommonDivisor(-6, 8), 2, 'gcd(-6, 8)');

const s1 = simplifyFraction(18, 24);
assert(s1.numerator === 3 && s1.denominator === 4, 'simplifyFraction(18, 24)');
const s2 = simplifyFraction(0, 5);
assert(s2.numerator === 0 && s2.denominator === 1, 'simplifyFraction(0, 5)');

assertEqual(compareFractions(2, 3, 3, 5), 1, '2/3 > 3/5');
assertEqual(compareFractions(1, 2, 2, 4), 0, '1/2 = 2/4');
assertEqual(compareFractions(-2, 3, -3, 4), 1, '-2/3 > -3/4');
assertEqual(compareFractions(3, 8, 40, 100), -1, '3/8 < 40%');

assert(formatDecimalDE(0.375) === '0,375', 'formatDecimalDE(0.375)');
assert(formatPercentDE(0.375, 1) === '37,5 %', 'formatPercentDE(0.375)');

assert(fractionHTML('3/4').includes('<span>3</span><span>4</span>'), 'fractionHTML simple');
assert(fractionHTML('1 1/2').includes('fraction-whole">1</span>'), 'fractionHTML mixed');
assert(fractionHTML('−2/3').includes('fraction-sign">−</span>'), 'fractionHTML negative');
assert(!fractionHTML('<script>').includes('<script>'), 'fractionHTML escapes HTML');

const exprParen = expressionHTML('(x − 1)/3 = 2');
assert(
  exprParen.includes('<span>x − 1</span><span>3</span>') && exprParen.endsWith(' = 2'),
  'expressionHTML parenthesized numerator'
);
const exprMixed = expressionHTML('1 1/2 · 2/3');
assert(
  exprMixed.includes('inline-whole">1</span>') && exprMixed.includes('<span>2</span><span>3</span>'),
  'expressionHTML mixed & fraction'
);

// 2. Audio text normalization
assertEqual(
  prepareSpeechText('Pizza-Bäckerei: 5/6 : 10/9'),
  'Pizza-Bäckerei: 5/6 geteilt durch 10/9',
  'prose colon vs math division'
);
assertEqual(prepareSpeechText('−2/3 + 1/3 = −1/3 ✋'), 'minus 2/3 + 1/3 gleich minus 1/3', 'negative fraction speech');
assertEqual(prepareSpeechText('High-Five für Fiete!'), 'High-Five für Fiete!', 'hyphenated word preserved');

// 3. State, levels, daily goal, streak, initials, upgrade compatibility & export
assertEqual(badgeDefinitions.length, 15, '15 cross-subject and mode badges');
assertEqual(getLevelInfo(0).level, 1, 'level 1 at 0 XP');
assertEqual(getLevelInfo(100).level, 2, 'level 2 at 100 XP');
assertEqual(getLevelInfo(1600).level, 6, 'max level 6 at 1600 XP');
assertEqual(getLevelInfo(1600).remainingXp, 0, 'max level remainingXp = 0');

assertEqual(getInitials('Alex'), 'AL', 'initials single word');
assertEqual(getInitials('Alex Kaufmann'), 'AK', 'initials two words');
assertEqual(getInitials('Mia-Lena'), 'ML', 'initials hyphenated');
assertEqual(getInitials(''), 'KL', 'initials empty fallback');

const st1 = computeNextStreak(0, null, '2026-11-21');
assert(st1.streakDays === 1 && st1.lastActiveDate === '2026-11-21', 'first day streak');
const st2 = computeNextStreak(1, '2026-11-21', '2026-11-21');
assert(st2.streakDays === 1, 'same day keeps streak');
const st3 = computeNextStreak(2, '2026-02-28', '2026-03-01');
assert(st3.streakDays === 3 && st3.lastActiveDate === '2026-03-01', 'month boundary streak increments');
const st4 = computeNextStreak(5, '2026-11-18', '2026-11-21');
assert(st4.streakDays === 1, 'skipped days resets streak to 1');

const upgraded = mergeProgress({
  totalXp: 120,
  selectedGrade: 7,
  visitedStations: ['pizza', 'lab'],
  bestCorrectByGrade: { 7: 5 }
});
assert(
  upgraded.totalXp === 120 &&
    upgraded.selectedGrade === 7 &&
    upgraded.userName === 'Alex' &&
    upgraded.bestCorrectBySubject.fractions[7] === 5,
  'v1 storage merge preserves fractions score'
);
assertEqual(computeGradeProgressPercent(upgraded, 7), 50, '2/4 stations (20%) + 5/10 quiz (30%) = 50%');
assertEqual(computeSubjectProgressPercent(upgraded, 'geometry', 7), 0, 'unplayed geometry = 0%');

assertEqual(getTodayXp({ dailyXp: 45, dailyDate: '2026-11-21' }, '2026-11-21'), 45, 'today xp matches same date');
assertEqual(getTodayXp({ dailyXp: 45, dailyDate: '2026-11-20' }, '2026-11-21'), 0, 'today xp resets on new day');
assert(DAILY_GOAL_XP === 60, 'daily goal is 60 XP');

const exported = JSON.parse(exportProgressJSON(upgraded));
assert(exported.app === 'KLUUG' && exported.progress.totalXp === 120, 'exportProgressJSON valid');

// 4. All 136 Questions across all 5 subjects & grades 5..8
const subjectMaps = [
  ['fractions', questionsByGrade, 10],
  ['geometry', geometryQuestionsByGrade, 6],
  ['words', wordsQuestionsByGrade, 6],
  ['english', englishQuestionsByGrade, 6],
  ['science', scienceQuestionsByGrade, 6]
];

let totalQuestions = 0;
for (const [subjectId, map, expectedLen] of subjectMaps) {
  assert(Boolean(subjectCatalog[subjectId]), `subject ${subjectId} in catalog`);
  for (const grade of [5, 6, 7, 8]) {
    const list = map[grade];
    assertEqual(list.length, expectedLen, `${subjectId} grade ${grade} has ${expectedLen} questions`);
    totalQuestions += list.length;

    list.forEach((q, idx) => {
      assert(Array.isArray(q.answers) && q.answers.length === 3, `${subjectId} g${grade} q${idx + 1} 3 answers`);
      assert(new Set(q.answers).size === 3, `${subjectId} g${grade} q${idx + 1} 3 distinct answers`);
      assert(q.correct >= 0 && q.correct < 3, `${subjectId} g${grade} q${idx + 1} valid correct index`);
      assert(Boolean(q.topic && q.title && q.hint && q.tip), `${subjectId} g${grade} q${idx + 1} metadata`);
      if (q.visual === 'expression') {
        const rendered = expressionHTML(q.equation);
        assert(rendered.length > 0 && !rendered.includes('undefined'), `${subjectId} expressionHTML valid`);
      } else if (q.visual === 'svgShape') {
        const svg = renderGeometryQuestionSvg(q);
        assert(svg.includes('<svg') && svg.includes('</svg>'), `geometry svg valid for q${idx + 1}`);
      } else if (q.visual === 'sentence') {
        const marked = formatSentenceMarkup(q.sentence);
        assert(marked.length > 0 && !marked.includes('<script>'), `sentence markup valid for q${idx + 1}`);
      } else if (q.visual === 'englishCard') {
        assert(Boolean(q.phrase && q.speakText), `english card valid for q${idx + 1}`);
      }
    });

    const session = buildSubjectQuizSession(subjectId, grade);
    assertEqual(session.length, expectedLen, `${subjectId} g${grade} session length`);
  }
}
assertEqual(totalQuestions, 136, 'total curated questions across all 5 subjects = 136');

// Fractions session keeps opener & finale
const fracSession = buildQuizSession(6);
assertEqual(fracSession[0].title, questionsByGrade[6][0].title, 'fractions keeps opener first');
assertEqual(fracSession[9].type, 'FINALE', 'fractions keeps FINALE last');

// Answer shuffling preserves exact answer text and balances indices
const posCounts = [0, 0, 0];
const sampleQ = questionsByGrade[5][0];
const expectedText = sampleQ.answers[sampleQ.correct];
for (let i = 0; i < 300; i++) {
  const shuffled = prepareQuestionWithShuffledAnswers(sampleQ);
  assertEqual(shuffled.answers[shuffled.correct], expectedText, 'shuffled correct text preserved');
  posCounts[shuffled.correct] += 1;
}
assert(posCounts[0] > 40 && posCounts[1] > 40 && posCounts[2] > 40, `answer positions balanced: ${posCounts.join(',')}`);

// 5. Lab challenges achievability across ALL 4 labs
assertEqual(
  getEquivalentFractions(3, 6).join(','),
  '1/2,2/4,3/6,4/8,5/10,6/12',
  'lab equivalents for 3/6'
);
for (const grade of [5, 6, 7, 8]) {
  for (const ch of labChallengesByGrade[grade]) {
    let solvable = false;
    for (let den = 2; den <= 12; den++) {
      for (let num = 0; num <= den; num++) {
        if (ch.check(num, den)) solvable = true;
      }
    }
    assert(solvable, `fractions lab challenge ${ch.id} is solvable`);
  }

  for (const ch of geometryLabChallengesByGrade[grade]) {
    let solvable = false;
    if (ch.mode === 'angle') {
      for (let d = 10; d <= 350; d += 5) if (ch.checkAngle(d)) solvable = true;
    } else {
      for (let w = 1; w <= 12; w++) {
        for (let h = 1; h <= 10; h++) {
          if (ch.checkArea(w, h, ch.shape || 'rect')) solvable = true;
        }
      }
    }
    assert(solvable, `geometry lab challenge ${ch.id} is solvable`);
  }

  for (const task of wordScannerTasksByGrade[grade]) {
    assert(task.words.length >= 4 && task.targets.length >= 1, `word task ${task.id} valid`);
    assert(
      task.targets.every(idx => idx >= 0 && idx < task.words.length),
      `word task ${task.id} target indices in bounds`
    );
    assert(evaluateWordSelection(new Set(task.targets), task.targets).exact === true, `word task ${task.id} solvable`);
  }

  for (const ch of scienceLabChallengesByGrade[grade]) {
    let solvable = false;
    for (const sys of scienceLabSystems) {
      for (let p = 10; p <= 200; p += 10) {
        for (let e = 10; e <= 95; e += 5) {
          if (ch.check(sys.id, p, e)) solvable = true;
        }
      }
    }
    assert(solvable, `science lab challenge ${ch.id} is solvable`);
  }
}

// 6. Geometry, Words, Science pure helpers
assertEqual(classifyAngle(45), 'Spitzer Winkel', '45 deg');
assertEqual(classifyAngle(90), 'Rechter Winkel', '90 deg');
assertEqual(classifyAngle(135), 'Stumpfer Winkel', '135 deg');
assertEqual(classifyAngle(180), 'Gestreckter Winkel', '180 deg');
assertEqual(classifyAngle(240), 'Überstumpfer Winkel', '240 deg');
assert(renderAngleSvg(90).includes('<svg'), 'renderAngleSvg outputs SVG');

const wordPartial = evaluateWordSelection(new Set([0]), [0, 2]);
assert(!wordPartial.exact && wordPartial.missingCount === 1 && wordPartial.extraCount === 0, 'word partial check');
const wordExtra = evaluateWordSelection(new Set([0, 1, 2]), [0, 2]);
assert(!wordExtra.exact && wordExtra.extraCount === 1, 'word extra check');

const energy = computeEnergyOutputs(120, 25);
assert(energy.usefulPower === 30 && energy.lossPower === 90 && energy.energy1hWh === 30, 'computeEnergyOutputs(120, 25)');

// 7. Pizza & Duel generators across all grades
for (const grade of [5, 6, 7, 8]) {
  for (const den of [2, 4, 6, 8]) {
    for (let i = 0; i < 20; i++) {
      const order = createPizzaOrder(grade, den);
      assert(
        order.targetCount >= 1 && order.targetCount <= den,
        `pizza order grade ${grade} den ${den} target ${order.targetCount} within range`
      );
      assert(Boolean(order.prompt && order.successDetail && order.hintMessage), 'pizza order text complete');
    }
  }

  const seenResults = new Set();
  for (let i = 0; i < 80; i++) {
    const round = createDuelRound(grade);
    const exact = compareFractions(round.left.num, round.left.den, round.right.num, round.right.den);
    const expectedResult = exact === 0 ? 'equal' : exact > 0 ? 'left' : 'right';
    assertEqual(round.result, expectedResult, `duel grade ${grade} exact comparison`);
    assert(round.explanation.length > 10, `duel grade ${grade} has explanation`);
    seenResults.add(round.result);
  }
  assert(seenResults.size >= 2, `duel grade ${grade} varies outcomes`);
}

const orig = [1, 2, 3, 4, 5];
const shuf = shuffleArray(orig);
assert(shuf.length === orig.length && orig.every(v => shuf.includes(v)), 'shuffleArray preserves elements');

// 8. Free-input Profi mode validation
assert(isFreeInputEligible(questionsByGrade[5][0]), '3/8 eligible for free input');
assert(!isFreeInputEligible(wordsQuestionsByGrade[5][0]), 'prose word question stays multiple choice');
assert(!isFreeInputEligible(geometryQuestionsByGrade[8][1]), 'pi answer excluded from typed free input');

assert(isFreeInputMatch(' 3 / 4 ', '3/4'), 'free input ignores spaces');
assert(isFreeInputMatch('-2/3', '−2/3'), 'free input normalizes ASCII hyphen');
assert(isFreeInputMatch('x = 7', '7'), 'free input strips x= prefix');
assert(isFreeInputMatch('87.5', '87,5 %'), 'free input accepts decimal dot without unit');
assert(isFreeInputMatch('87,5%', '87,5 %'), 'free input accepts %');
assert(isFreeInputMatch('25 cm2', '25 cm²'), 'free input accepts cm2 for cm²');
assert(!isFreeInputMatch('25 cm3', '25 cm²'), 'free input rejects wrong unit cm3 vs cm²');
assert(!isFreeInputMatch('20 m', '20 cm'), 'free input rejects wrong unit m vs cm');
assert(isFreeInputMatch('12', '12/20', ['12', '12/20']), 'free input uses extraAccepted list');
assert(isFreeInputMatch('4 ohm', '4 Ω'), 'free input accepts ohm for Ω');

// 9. Smart recommendations, focus training, learning report, cheat sheets & Blitz-Sprint
const weakProg = mergeProgress({
  userName: 'Mia',
  selectedGrade: 6,
  totalXp: 300,
  topicStatsByGrade: { 6: { 'Addieren & Subtrahieren': { correct: 1, total: 4 } } }
});
const recWeak = getSmartRecommendation(weakProg, 6);
assertEqual(recWeak.kind, 'focus', 'recommends focus training for <70% topic');
assertEqual(recWeak.topic, 'Addieren & Subtrahieren', 'picks weakest topic');

const focusSession = buildTopicFocusSession(6, 'Addieren & Subtrahieren');
assertEqual(focusSession.subjectId, 'fractions', 'focus session resolves subject');
assertEqual(focusSession.questions.length, 6, 'focus session yields 6 questions');

const allSolvedProg = mergeProgress({
  selectedGrade: 5,
  bestCorrectBySubject: {
    fractions: { 5: 10 },
    geometry: { 5: 6 },
    words: { 5: 6 },
    english: { 5: 6 },
    science: { 5: 6 }
  }
});
assertEqual(getSmartRecommendation(allSolvedProg, 5).kind, 'sprint', 'recommends sprint when all 5 subjects done');
assert(hasExploredAllSubjects(allSolvedProg), 'hasExploredAllSubjects true for all 5');
assert(!hasExploredAllSubjects(weakProg), 'hasExploredAllSubjects false when untouched');

const report = formatLearningReportText(weakProg);
assert(
  report.includes('Mia') && report.includes('Klasse 6') && report.includes('Englisch:') && report.includes('Addieren & Subtrahieren: 1/4'),
  'learning report formatted with English'
);

assert(cheatSheetCards.length >= 15, 'cheat sheets populated');
for (const subj of ['fractions', 'geometry', 'words', 'english', 'science']) {
  assert(cheatSheetCards.some(c => c.subject === subj), `cheat sheet covers ${subj}`);
}

// 10. English studio, German dictation & Multi-profile vault
for (const grade of [5, 6, 7, 8]) {
  assertEqual(englishStudioTasksByGrade[grade].length, 3, `english studio g${grade} 3 tasks`);
  for (const t of englishStudioTasksByGrade[grade]) {
    assert(t.options.includes(t.correct) && t.speakSentence.length > 5, `english task ${t.id} valid`);
  }
  assertEqual(wordsDictationByGrade[grade].length, 2, `dictation g${grade} 2 tasks`);
  for (const d of wordsDictationByGrade[grade]) {
    assert(d.masked.includes('___') && evaluateDictationAnswer(d.target, d.target), `dictation ${d.id} valid`);
  }
}
assert(!evaluateDictationAnswer('fahrrad', 'Fahrrad'), 'dictation enforces capitalization');

let vault = createProfileVault(weakProg);
const added = addProfileToVault(vault, 'Ben', 7);
vault = added.vault;
assertEqual(Object.keys(vault.profiles).length, 2, 'added second profile');
assertEqual(vault.activeProfileId, added.newId, 'switches to newly created profile');
assertEqual(vault.profiles[added.newId].userName, 'Ben', 'new profile name set');
vault = switchProfileInVault(vault, 'p1');
assertEqual(vault.activeProfileId, 'p1', 'switched back to p1');
vault = deleteProfileFromVault(vault, added.newId);
assertEqual(Object.keys(vault.profiles).length, 1, 'deleted profile cleanly');
vault = deleteProfileFromVault(vault, 'p1');
assertEqual(Object.keys(vault.profiles).length, 1, 'refuses deleting last remaining profile');

const fakeStorageMap = new Map([[STORAGE_KEY, JSON.stringify({ totalXp: 88, userName: 'Jonas' })]]);
const migratedVault = loadVault({
  getItem: k => fakeStorageMap.get(k) ?? null,
  setItem: (k, v) => fakeStorageMap.set(k, v)
});
assertEqual(migratedVault.profiles.p1.userName, 'Jonas', 'legacy kluug-progress migrates into vault');
assert(VAULT_STORAGE_KEY === 'kluug-profiles-v1', 'vault key constant intact');

for (const grade of [5, 6, 7, 8]) {
  for (let i = 0; i < 60; i++) {
    const sq = createSprintQuestion(grade);
    assertEqual(sq.answers.length, 3, `sprint g${grade} 3 answers`);
    assertEqual(new Set(sq.answers).size, 3, `sprint g${grade} distinct answers`);
    assert(sq.correct >= 0 && sq.correct < 3, `sprint g${grade} valid correct index`);
  }
}

print(`ALL TESTS PASSED (${passed} assertions)`);
