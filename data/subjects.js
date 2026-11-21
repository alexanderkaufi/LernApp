/**
 * Unified subject catalog and quiz session builder across all 4 learning worlds.
 */

import { shuffleArray } from '../src/core/math.js';
import {
  buildQuizSession as buildFractionsSession,
  gradeContent,
  prepareQuestionWithShuffledAnswers,
  questionsByGrade
} from './fractions.js';
import { geometryQuestionsByGrade } from './geometry.js';
import { wordsQuestionsByGrade } from './words.js';
import { scienceQuestionsByGrade } from './science.js';
import { englishQuestionsByGrade } from './english.js';

export const subjectCatalog = {
  fractions: {
    id: 'fractions',
    kicker: 'MATHE · BRÜCHE',
    title: 'Brüche verstehen',
    questionCount: 10,
    badgeId: 'quest',
    getGradeTitle: grade => gradeContent[grade]?.title || 'Brüche verstehen',
    getGradeLevel: grade => gradeContent[grade]?.level || 'GRUNDLAGEN',
    getIntro: grade =>
      gradeContent[grade]?.intro ||
      'Zähle zuerst alle Teile und dann die markierten. Ganz ruhig – du packst das!'
  },
  geometry: {
    id: 'geometry',
    kicker: 'MATHE · GEOMETRIE',
    title: 'Formen & Flächen',
    labTitle: 'Geometrie-Labor',
    labMessage: 'Bewege Winkel und Seitenlängen – sieh direkt, wie sich Fläche und Umfang verändern!',
    questionCount: 6,
    badgeId: 'geometry',
    getGradeTitle: () => 'Formen & Flächen',
    getGradeLevel: grade => (grade >= 7 ? 'FLÄCHEN & KREIS' : 'WINKEL & FLÄCHEN'),
    getIntro: () => 'Schau dir Formen und Maße in Ruhe an. Skizze im Kopf hilft sofort!'
  },
  words: {
    id: 'words',
    kicker: 'DEUTSCH · SPRACHE',
    title: 'Wortarten-Detektive',
    labTitle: 'Wort-Lupe',
    labMessage: 'Klicke im Satz auf die gesuchten Wörter und trainiere dein Sprachgefühl!',
    questionCount: 6,
    badgeId: 'words',
    getGradeTitle: () => 'Wortarten-Detektive',
    getGradeLevel: grade => (grade >= 7 ? 'SATZBAU & MODUS' : 'WORTARTEN & KASUS'),
    getIntro: () => 'Lies den Satz laut im Kopf – und stelle immer die passende Kontrollfrage!'
  },
  science: {
    id: 'science',
    kicker: 'NATUR & TECHNIK',
    title: 'Energie-Check',
    labTitle: 'Energie-Labor',
    labMessage: 'Experimentiere mit Eingangsleistung und Wirkungsgrad – wo geht Energie in Wärme über?',
    questionCount: 6,
    badgeId: 'science',
    getGradeTitle: () => 'Energie-Check',
    getGradeLevel: grade => (grade >= 7 ? 'LEISTUNG & PHYSIK' : 'ENERGIE & STROM'),
    getIntro: () => 'Beobachte immer: Welche Energie geht rein – und was kommt am Ende heraus?'
  },
  english: {
    id: 'english',
    kicker: 'ENGLISCH · SPRACHE',
    title: 'English Boost',
    labTitle: 'English Studio',
    labMessage: 'Hör dir englische Sätze an und trainiere Vokabeln sowie Zeitformen!',
    questionCount: 6,
    badgeId: 'english',
    getGradeTitle: () => 'English Boost',
    getGradeLevel: grade => (grade >= 7 ? 'PERFECT & CONDITIONALS' : 'TENSES & VOCAB'),
    getIntro: () => 'Read carefully – und hör dir den Satz bei Bedarf mit dem Lautsprecher auf Englisch an!'
  }
};

export function getQuestionsMapForSubject(subjectId) {
  if (subjectId === 'geometry') return geometryQuestionsByGrade;
  if (subjectId === 'words') return wordsQuestionsByGrade;
  if (subjectId === 'science') return scienceQuestionsByGrade;
  if (subjectId === 'english') return englishQuestionsByGrade;
  return questionsByGrade;
}

export function buildSubjectQuizSession(subjectId, grade, rng = Math.random) {
  if (subjectId === 'fractions') {
    return buildFractionsSession(grade, rng);
  }
  const map = getQuestionsMapForSubject(subjectId);
  const raw = map[grade] || map[5];
  return shuffleArray(raw, rng).map(q => prepareQuestionWithShuffledAnswers(q, rng));
}

/**
 * Builds a targeted practice round (up to 6 questions) prioritizing a weak topic in `grade`.
 */
export function buildTopicFocusSession(grade, targetTopic, rng = Math.random) {
  const g = Number(grade) || 5;
  const allSubjects = ['fractions', 'geometry', 'words', 'science', 'english'];
  let primarySubject = 'fractions';
  const matching = [];

  for (const subj of allSubjects) {
    const map = getQuestionsMapForSubject(subj);
    const list = map[g] || [];
    for (const q of list) {
      if (q.topic === targetTopic) {
        matching.push(q);
        primarySubject = subj;
      }
    }
  }

  const fallbackPool = (getQuestionsMapForSubject(primarySubject)[g] || []).filter(
    q => q.topic !== targetTopic
  );
  const combined = [...shuffleArray(matching, rng)];
  for (const q of shuffleArray(fallbackPool, rng)) {
    if (combined.length >= 6) break;
    combined.push(q);
  }

  return {
    subjectId: primarySubject,
    questions: combined.slice(0, 6).map(q => prepareQuestionWithShuffledAnswers(q, rng))
  };
}
