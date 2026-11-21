/**
 * Mathematical and formatting helpers for fractions, comparisons, and expressions.
 */

const HTML_ESCAPE_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

/**
 * Escapes special HTML characters in untrusted text.
 */
export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => HTML_ESCAPE_MAP[char]);
}

/**
 * Computes the positive greatest common divisor of two integers.
 */
export function greatestCommonDivisor(a, b) {
  let x = Math.abs(Math.trunc(a));
  let y = Math.abs(Math.trunc(b));
  while (y !== 0) {
    const rest = x % y;
    x = y;
    y = rest;
  }
  return x || 1;
}

/**
 * Reduces a fraction to lowest terms with a positive denominator.
 */
export function simplifyFraction(numerator, denominator) {
  if (denominator === 0) {
    throw new RangeError('Denominator must not be zero.');
  }
  const sign = denominator < 0 ? -1 : 1;
  const normalizedNum = numerator * sign;
  const normalizedDen = Math.abs(denominator);
  if (normalizedNum === 0) {
    return { numerator: 0, denominator: 1 };
  }
  const divisor = greatestCommonDivisor(normalizedNum, normalizedDen);
  return {
    numerator: normalizedNum / divisor,
    denominator: normalizedDen / divisor
  };
}

/**
 * Compares two fractions exactly using cross-multiplication.
 * Returns -1 if left < right, 0 if equal, 1 if left > right.
 */
export function compareFractions(leftNum, leftDen, rightNum, rightDen) {
  const leftCross = leftNum * rightDen;
  const rightCross = rightNum * leftDen;
  if (leftCross === rightCross) return 0;
  return leftCross > rightCross ? 1 : -1;
}

/**
 * Formats a number in German decimal notation (comma separator).
 */
export function formatDecimalDE(value, maxFractionDigits = 3) {
  return Number(value).toLocaleString('de-DE', { maximumFractionDigits: maxFractionDigits });
}

/**
 * Formats a ratio (e.g. 0.375) as a German percentage string (e.g. "37,5 %").
 */
export function formatPercentDE(ratio, maxFractionDigits = 1) {
  return `${formatDecimalDE(ratio * 100, maxFractionDigits)} %`;
}

/**
 * Returns a shuffled copy of an array using Fisher-Yates.
 */
export function shuffleArray(items, rng = Math.random) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Renders a fraction string (e.g. "3/4", "−2/3", "1 1/2", "2x/3") as stacked HTML.
 */
export function fractionHTML(rawValue) {
  const text = String(rawValue).trim();

  const mixedMatch = text.match(/^([−-]?)\s*(\d+)\s+(\d+)\/(\d+)$/);
  if (mixedMatch) {
    const [, sign, whole, num, den] = mixedMatch;
    const signHtml = sign ? `<span class="fraction-sign">${escapeHtml(sign)}</span>` : '';
    return `<div class="fraction-mixed">${signHtml}<span class="fraction-whole">${escapeHtml(whole)}</span><div class="fraction-number"><span>${escapeHtml(num)}</span><span>${escapeHtml(den)}</span></div></div>`;
  }

  const fracMatch = text.match(/^([−-]?)\s*([^/\s][^/]*)\/([^/]+)$/);
  if (fracMatch) {
    const [, sign, num, den] = fracMatch;
    const fracBlock = `<div class="fraction-number"><span>${escapeHtml(num.trim())}</span><span>${escapeHtml(den.trim())}</span></div>`;
    if (sign) {
      return `<div class="fraction-mixed"><span class="fraction-sign">${escapeHtml(sign)}</span>${fracBlock}</div>`;
    }
    return fracBlock;
  }

  return `<div class="fraction-number">${escapeHtml(text)}</div>`;
}

/**
 * Renders a math expression string with inline stacked fractions where present.
 */
export function expressionHTML(equation) {
  const source = String(equation);
  const pattern = /\(([^()]+)\)\/([A-Za-z0-9²³?]+)|(^|[\s(=])([−-]?)(\d+)\s+(\d+)\/(\d+)|([−-]?)([A-Za-z0-9²³?]+)\/([A-Za-z0-9²³?]+)/g;
  let result = '';
  let lastIndex = 0;

  for (const match of source.matchAll(pattern)) {
    const start = match.index;
    result += escapeHtml(source.slice(lastIndex, start));

    if (match[1] !== undefined) {
      result += `<span class="inline-fraction"><span>${escapeHtml(match[1].trim())}</span><span>${escapeHtml(match[2])}</span></span>`;
    } else if (match[5] !== undefined) {
      const prefix = escapeHtml(match[3]);
      const sign = match[4] ? `<span class="inline-sign">${escapeHtml(match[4])}</span>` : '';
      result += `${prefix}<span class="inline-mixed">${sign}<span class="inline-whole">${escapeHtml(match[5])}</span><span class="inline-fraction"><span>${escapeHtml(match[6])}</span><span>${escapeHtml(match[7])}</span></span></span>`;
    } else {
      const sign = match[8] ? `<span class="inline-sign">${escapeHtml(match[8])}</span>` : '';
      result += `<span class="inline-mixed">${sign}<span class="inline-fraction"><span>${escapeHtml(match[9])}</span><span>${escapeHtml(match[10])}</span></span></span>`;
    }

    lastIndex = start + match[0].length;
  }

  result += escapeHtml(source.slice(lastIndex));
  return result;
}

const UNIT_PATTERN = /(km\/h|cm\^?3|cm\^?2|kwh|wh|cm|ohm|°|%|ω|m|w|j|n|v|a)$/;

/**
 * Normalizes user-typed math/fraction/unit strings for forgiving free-input grading.
 */
export function canonicalizeMathText(raw, stripAssignmentPrefix = true) {
  let text = String(raw || '')
    .trim()
    .toLowerCase()
    .replace(/[−–]/g, '-')
    .replace(/,/g, '.')
    .replace(/²/g, '^2')
    .replace(/³/g, '^3')
    .replace(/\s*[·*]\s*/g, '*')
    .replace(/\s+/g, '');

  if (stripAssignmentPrefix && !text.includes('==')) {
    text = text.replace(/^[a-zη]=/, '');
  }
  return text;
}

function splitCoreAndUnit(canon) {
  const match = canon.match(UNIT_PATTERN);
  if (!match) return { core: canon, unit: '' };
  let unit = match[1];
  if (unit === 'ohm') unit = 'ω';
  if (unit === 'cm2') unit = 'cm^2';
  if (unit === 'cm3') unit = 'cm^3';
  return {
    core: canon.slice(0, match.index),
    unit
  };
}

/**
 * Checks whether a question's correct answer is suitable for typed free input.
 */
export function isFreeInputEligible(question) {
  if (!question || question.allowFreeInput === false) return false;
  if (Array.isArray(question.acceptedInputs) && question.acceptedInputs.length > 0) return true;
  const answer = String(question.answers?.[question.correct] || '').trim();
  if (!answer || answer.includes('π')) return false;
  return /^[−-]?\s*[\d.,/x²³\s]+(?:\s*(?:%|°|cm²|cm³|cm|m|km\/h|kWh|Wh|W|J|N|V|A|Ω))?$/i.test(answer);
}

/**
 * Compares a typed student answer against expected answer(s), allowing missing units
 * and minor spacing/decimal-separator variations while rejecting wrong units.
 */
export function isFreeInputMatch(userRaw, expectedAnswer, extraAccepted = []) {
  const userCanon = canonicalizeMathText(userRaw, true);
  if (!userCanon) return false;

  const candidates = [expectedAnswer, ...(extraAccepted || [])];
  const userParts = splitCoreAndUnit(userCanon);

  return candidates.some(candidate => {
    const expCanon = canonicalizeMathText(candidate, true);
    if (userCanon === expCanon) return true;
    const expParts = splitCoreAndUnit(expCanon);
    if (!expParts.core || userParts.core !== expParts.core) return false;
    return userParts.unit === '' || userParts.unit === expParts.unit;
  });
}

/**
 * Formats "[highlighted]" segments inside a sentence safely as <mark>.
 */
export function formatSentenceMarkup(sentence) {
  const source = String(sentence || '');
  let out = '';
  let lastIndex = 0;
  for (const match of source.matchAll(/\[([^\]]+)\]/g)) {
    out += escapeHtml(source.slice(lastIndex, match.index));
    out += `<mark>${escapeHtml(match[1])}</mark>`;
    lastIndex = match.index + match[0].length;
  }
  out += escapeHtml(source.slice(lastIndex));
  return out;
}
