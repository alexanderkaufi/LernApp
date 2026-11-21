/**
 * Geometry interactive station (Angle Scanner + Area/Perimeter Builder)
 * and SVG shape renderer for geometry quiz questions.
 */

import { geometryLabChallengesByGrade } from '../../data/geometry.js';
import { escapeHtml, formatDecimalDE } from '../core/math.js';
import { playTone } from '../core/audio.js';
import { getProgress, recordSubjectLabSolved } from '../core/store.js';
import { $, $$, setStationTutor } from '../core/ui.js';

let geoMode = 'angle';
let geoShape = 'rect';
let geoChallengeIndex = 0;

export function classifyAngle(degrees) {
  const deg = Number(degrees);
  if (deg === 90) return 'Rechter Winkel';
  if (deg === 180) return 'Gestreckter Winkel';
  if (deg === 360 || deg === 0) return 'Vollwinkel';
  if (deg > 0 && deg < 90) return 'Spitzer Winkel';
  if (deg > 90 && deg < 180) return 'Stumpfer Winkel';
  return 'Überstumpfer Winkel';
}

export function renderAngleSvg(degrees, showValue = true) {
  const deg = Math.max(5, Math.min(355, Number(degrees) || 45));
  const cx = 110;
  const cy = 110;
  const radius = 82;
  const arcR = 34;
  const rad = (deg * Math.PI) / 180;
  const x2 = cx + radius * Math.cos(rad);
  const y2 = cy - radius * Math.sin(rad);
  const ax = cx + arcR * Math.cos(rad);
  const ay = cy - arcR * Math.sin(rad);
  const largeArc = deg > 180 ? 1 : 0;

  const arcMarkup =
    deg === 90
      ? `<path d="M ${cx + 28} ${cy} L ${cx + 28} ${cy - 28} L ${cx} ${cy - 28}" fill="rgba(91,76,240,0.18)" stroke="#5b4cf0" stroke-width="2.5"/><circle cx="${cx + 12}" cy="${cy - 12}" r="3" fill="#5b4cf0"/>`
      : `<path d="M ${cx} ${cy} L ${cx + arcR} ${cy} A ${arcR} ${arcR} 0 ${largeArc} 0 ${ax.toFixed(1)} ${ay.toFixed(1)} Z" fill="rgba(91,76,240,0.22)" stroke="#5b4cf0" stroke-width="2.5"/>`;

  const labelMarkup = showValue
    ? `<text x="110" y="206" text-anchor="middle" class="geo-svg-label">${deg}°</text>`
    : '';

  return `<svg class="geo-svg" viewBox="0 0 220 220" role="img" aria-label="Winkel mit ${deg} Grad">
    <circle cx="${cx}" cy="${cy}" r="88" fill="#fbfaff" stroke="#ece9f6" stroke-width="2" stroke-dasharray="4 4"/>
    ${arcMarkup}
    <line x1="${cx}" y1="${cy}" x2="${cx + radius}" y2="${cy}" stroke="#17203b" stroke-width="4" stroke-linecap="round"/>
    <line x1="${cx}" y1="${cy}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#17203b" stroke-width="4" stroke-linecap="round"/>
    <circle cx="${cx}" cy="${cy}" r="5" fill="#ffc94a" stroke="#17203b" stroke-width="2.5"/>
    ${labelMarkup}
  </svg>`;
}

export function renderGeometryQuestionSvg(question) {
  if (question.shape === 'angle') {
    return renderAngleSvg(question.angle, true);
  }

  if (question.shape === 'rect') {
    const wLabel = escapeHtml(question.widthLabel || 'a');
    const hLabel = escapeHtml(question.heightLabel || 'b');
    return `<svg class="geo-svg" viewBox="0 0 240 165" role="img" aria-label="Rechteck ${wLabel} mal ${hLabel}">
      <rect x="44" y="24" width="144" height="92" rx="8" fill="#eeeaff" stroke="#17203b" stroke-width="4"/>
      <text x="116" y="142" text-anchor="middle" class="geo-svg-label">${wLabel}</text>
      <text x="208" y="75" text-anchor="middle" class="geo-svg-label">${hLabel}</text>
    </svg>`;
  }

  if (question.shape === 'triangle') {
    const bLabel = escapeHtml(question.baseLabel || 'g');
    const hLabel = escapeHtml(question.heightLabel || '');
    return `<svg class="geo-svg" viewBox="0 0 240 165" role="img" aria-label="Dreieck ${bLabel}">
      <polygon points="40,125 200,125 128,26" fill="#e6f7f1" stroke="#17203b" stroke-width="4" stroke-linejoin="round"/>
      <line x1="128" y1="26" x2="128" y2="125" stroke="#5b4cf0" stroke-width="2.5" stroke-dasharray="5 4"/>
      <text x="120" y="150" text-anchor="middle" class="geo-svg-label">${bLabel}</text>
      <text x="155" y="84" text-anchor="middle" class="geo-svg-label">${hLabel}</text>
    </svg>`;
  }

  if (question.shape === 'circle') {
    const rLabel = escapeHtml(question.radiusLabel || 'r');
    return `<svg class="geo-svg" viewBox="0 0 220 175" role="img" aria-label="Kreis mit ${rLabel}">
      <circle cx="110" cy="86" r="64" fill="#fff5da" stroke="#17203b" stroke-width="4"/>
      <line x1="110" y1="86" x2="174" y2="86" stroke="#5b4cf0" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="110" cy="86" r="4.5" fill="#17203b"/>
      <text x="142" y="76" text-anchor="middle" class="geo-svg-label">${rLabel}</text>
    </svg>`;
  }

  const cubeLabel = escapeHtml(question.label || 'Würfel');
  return `<svg class="geo-svg" viewBox="0 0 220 175" role="img" aria-label="Körper ${cubeLabel}">
    <polygon points="62,56 132,56 132,126 62,126" fill="#eeeaff" stroke="#17203b" stroke-width="3.5" stroke-linejoin="round"/>
    <polygon points="62,56 96,30 166,30 132,56" fill="#d9d2ff" stroke="#17203b" stroke-width="3.5" stroke-linejoin="round"/>
    <polygon points="132,56 166,30 166,100 132,126" fill="#c3b8ff" stroke="#17203b" stroke-width="3.5" stroke-linejoin="round"/>
    <text x="112" y="154" text-anchor="middle" class="geo-svg-label">${cubeLabel}</text>
  </svg>`;
}

function getCurrentGeoChallenge() {
  const grade = getProgress().selectedGrade || 5;
  const list = geometryLabChallengesByGrade[grade] || geometryLabChallengesByGrade[5];
  return { list, challenge: list[geoChallengeIndex % list.length] };
}

function renderAreaSvg(width, height, shape) {
  const cell = 14;
  const maxW = 12 * cell;
  const maxH = 10 * cell;
  const wPx = width * cell;
  const hPx = height * cell;
  const x0 = Math.round((210 - wPx) / 2);
  const y0 = Math.round((165 - hPx) / 2);

  const gridLines = [];
  for (let i = 1; i < width; i++) {
    gridLines.push(`<line x1="${x0 + i * cell}" y1="${y0}" x2="${x0 + i * cell}" y2="${y0 + hPx}" stroke="rgba(23,32,59,0.16)" stroke-width="1"/>`);
  }
  for (let j = 1; j < height; j++) {
    gridLines.push(`<line x1="${x0}" y1="${y0 + j * cell}" x2="${x0 + wPx}" y2="${y0 + j * cell}" stroke="rgba(23,32,59,0.16)" stroke-width="1"/>`);
  }

  const shapeEl =
    shape === 'triangle'
      ? `<polygon points="${x0},${y0 + hPx} ${x0 + wPx},${y0 + hPx} ${x0},${y0}" fill="rgba(48,189,136,0.28)" stroke="#17203b" stroke-width="3.5" stroke-linejoin="round"/>`
      : `<rect x="${x0}" y="${y0}" width="${wPx}" height="${hPx}" rx="4" fill="rgba(91,76,240,0.22)" stroke="#17203b" stroke-width="3.5"/>`;

  return `<svg class="geo-svg" viewBox="0 0 210 175" role="img" aria-label="${shape === 'triangle' ? 'Dreieck' : 'Rechteck'} ${width} auf ${height} cm">
    <rect x="${Math.round((210 - maxW) / 2)}" y="${Math.round((165 - maxH) / 2)}" width="${maxW}" height="${maxH}" fill="none" stroke="#eeeaf7" stroke-dasharray="3 3"/>
    ${gridLines.join('')}
    ${shapeEl}
  </svg>`;
}

function renderGeometryChallenge() {
  const { challenge } = getCurrentGeoChallenge();
  const solved = getProgress().labChallengesSolved.includes(challenge.id);
  if ($('#geoChallengePrompt')) $('#geoChallengePrompt').textContent = challenge.prompt;
  if ($('#geoChallengeStatus')) {
    $('#geoChallengeStatus').textContent = solved ? '✓ Geschafft' : 'Offen';
    $('#geoChallengeStatus').className = `challenge-status ${solved ? 'done' : ''}`;
  }
}

function renderGeometryControls() {
  const angleBox = $('#geoAngleWorkbench');
  const areaBox = $('#geoAreaWorkbench');
  if (angleBox) angleBox.classList.toggle('hidden', geoMode !== 'angle');
  if (areaBox) areaBox.classList.toggle('hidden', geoMode !== 'area');

  $$('[data-geo-mode]').forEach(btn => {
    const active = btn.dataset.geoMode === geoMode;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', String(active));
  });

  if (geoMode === 'angle') {
    const deg = Number($('#geoAngleSlider')?.value || 90);
    if ($('#geoAngleValue')) $('#geoAngleValue').textContent = `${deg}°`;
    if ($('#geoAngleType')) $('#geoAngleType').textContent = classifyAngle(deg);
    if ($('#geoAngleVisual')) $('#geoAngleVisual').innerHTML = renderAngleSvg(deg, true);
  } else {
    const w = Number($('#geoWidthSlider')?.value || 6);
    const h = Number($('#geoHeightSlider')?.value || 4);
    const area = geoShape === 'triangle' ? (w * h) / 2 : w * h;
    const perimeter =
      geoShape === 'triangle'
        ? w + h + Math.hypot(w, h)
        : 2 * (w + h);

    if ($('#geoWidthValue')) $('#geoWidthValue').textContent = `${w} cm`;
    if ($('#geoHeightValue')) $('#geoHeightValue').textContent = `${h} cm`;
    if ($('#geoAreaReadout')) $('#geoAreaReadout').textContent = `${formatDecimalDE(area, 1)} cm²`;
    if ($('#geoPerimeterReadout')) {
      $('#geoPerimeterReadout').textContent = `${formatDecimalDE(perimeter, 1)} cm`;
    }
    if ($('#geoAreaVisual')) $('#geoAreaVisual').innerHTML = renderAreaSvg(w, h, geoShape);

    $$('[data-geo-shape]').forEach(btn => {
      const active = btn.dataset.geoShape === geoShape;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
  }
}

function checkGeoChallenge() {
  const { challenge } = getCurrentGeoChallenge();
  const feedback = $('#geoChallengeFeedback');
  const soundOn = getProgress().soundOn;

  let passed = false;
  if (challenge.mode === 'angle') {
    const deg = Number($('#geoAngleSlider')?.value || 90);
    passed = geoMode === 'angle' && challenge.checkAngle(deg);
  } else {
    const w = Number($('#geoWidthSlider')?.value || 6);
    const h = Number($('#geoHeightSlider')?.value || 4);
    passed = geoMode === 'area' && challenge.checkArea(w, h, geoShape);
  }

  if (passed) {
    const isNew = recordSubjectLabSolved('geometry', challenge.id);
    feedback.className = 'station-feedback show success';
    feedback.textContent = `${challenge.tip}${isNew ? ' +15 XP' : ''}`;
    setStationTutor(challenge.tip, 'celebrating');
    renderGeometryChallenge();
    playTone(700, 0.18, soundOn);
  } else {
    feedback.className = 'station-feedback show try-again';
    feedback.textContent =
      challenge.mode !== geoMode
        ? `Tipp: Schalte oben auf "${challenge.mode === 'angle' ? 'Winkel-Scanner' : 'Flächen-Baumeister'}" um!`
        : 'Noch nicht ganz – probiere die Regler noch ein bisschen weiter!';
    setStationTutor('Schau genau auf die geforderte Größe oder Formart.', 'thinking');
    playTone(260, 0.18, soundOn);
  }
}

export function resetGeometryLabForGrade() {
  geoChallengeIndex = 0;
  const { challenge } = getCurrentGeoChallenge();
  geoMode = challenge.mode || 'angle';
  if (challenge.shape) geoShape = challenge.shape;
  const fb = $('#geoChallengeFeedback');
  if (fb) fb.className = 'station-feedback';
  renderGeometryChallenge();
  renderGeometryControls();
}

export function initGeometryLab({ onStartQuiz } = {}) {
  $$('[data-geo-mode]').forEach(btn => {
    btn.addEventListener('click', () => {
      geoMode = btn.dataset.geoMode;
      renderGeometryControls();
    });
  });

  $$('[data-geo-shape]').forEach(btn => {
    btn.addEventListener('click', () => {
      geoShape = btn.dataset.geoShape;
      renderGeometryControls();
    });
  });

  $('#geoAngleSlider')?.addEventListener('input', renderGeometryControls);
  $('#geoWidthSlider')?.addEventListener('input', renderGeometryControls);
  $('#geoHeightSlider')?.addEventListener('input', renderGeometryControls);
  $('#geoCheckChallengeButton')?.addEventListener('click', checkGeoChallenge);
  $('#geoNextChallengeButton')?.addEventListener('click', () => {
    geoChallengeIndex += 1;
    const { challenge } = getCurrentGeoChallenge();
    geoMode = challenge.mode;
    if (challenge.shape) geoShape = challenge.shape;
    const fb = $('#geoChallengeFeedback');
    if (fb) fb.className = 'station-feedback';
    renderGeometryChallenge();
    renderGeometryControls();
  });
  $('#geoQuizStartButton')?.addEventListener('click', () => {
    if (typeof onStartQuiz === 'function') onStartQuiz('geometry');
  });

  resetGeometryLabForGrade();
}
