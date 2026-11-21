# KLUUG – dauerhafte Projektnotiz

> Diese Datei ist das Kurzzeitgedächtnis des Projekts. Bei jeder relevanten Änderung werden Entscheidungen, aktueller Stand und nächste sinnvolle Schritte hier ergänzt, damit nicht erneut der gesamte Chatverlauf gelesen werden muss.

## Produktziel

KLUUG ist eine motivierende, interaktive Lern-App für Schülerinnen und Schüler der Klassen 5–8. Die Kinder sollen kurze Erfolgserlebnisse haben, Fehler als normalen Teil des Lernens erleben und von Fiete emotional begleitet werden. Die Architektur soll später weitere Mathematikthemen und andere Schulfächer aufnehmen können.

## Zielgruppe und Ton

- Klassen 5–8; Sprache weder kleinkindlich noch schulbuchhaft.
- Kurze Aufgaben, direkte Rückmeldung und sichtbarer Fortschritt.
- Fiete reagiert ermutigend, erklärt Fehler und feiert Erfolge.
- Motivation durch XP, Serien, Abzeichen und spielerische Lernstationen.

## Aktueller Funktionsumfang

- Fächerfilter: Alle, Mathe, Deutsch, Englisch, Natur & Technik – alle fünf Themenkarten sind voll interaktiv spielbar.
- Klassenwahl: Klassen 5, 6, 7 und 8 (dauerhaft gespeichert, wirkt auf alle fünf Fächer und Stationen).
- **Mathe · Brüche:** Pizza-Bäckerei, Schoko-Labor, Bruch-Duell (mit visuellem Balken-Beweis) und 10er Quiz-Quest (40 Aufgaben).
- **Mathe · Geometrie (`Formen & Flächen`):** Geometrie-Labor (Winkel-Scanner + Flächen-/Umfangs-Baumeister) und SVG-Quiz (24 Aufgaben).
- **Deutsch (`Wortarten-Detektive`):** Interaktive Wort-Lupe, Hör-Diktat und Grammatik-/Rechtschreib-Quiz (24 Aufgaben).
- **Englisch (`English Boost`):** Interaktives Audio-Studio (`en-GB`) und Vokabel-/Grammatik-Quiz (24 Aufgaben).
- **Natur & Technik (`Energie-Check`):** Interaktives Energie-Labor (Eingangsleistung & Wirkungsgrad für Solar, Wasser, LED, Dynamo) und Energie-/Physik-Quiz (24 Aufgaben).
- **Quiz & Motivation:** Gemischte Aufgaben/Antworten, umschaltbarer **Profi-Eingabemodus** (+30 XP), adaptiver **Trainings-Tipp / Fokus-Training**, **60-Sekunden-Sprint** (inkl. Ruhemodus), **Fietes Merk-Karten**, Tastaturkürzel (`1`–`3`, `Enter`/`→`), „Zweite Chance“ für Fehler, KLUUG-Level (1–6), Tagesziel (`60 XP`), echte tägliche Lernserie und 15 Abzeichen.
- **Multi-Profil & Offline-Betrieb:** Geschwister-Wechsler (bis 6 Profile in `kluug-profiles-v1`), Bestleistungen je Fach, Themen-Check, kopierbarer & **druckbarer Lernbericht** (`@media print`), JSON-Backup Export/Import, sicherer Reset, Fiete mit Sprachausgabe (`AudioContext`-Singleton), native System-Schriftarten ohne externe Anfragen sowie PWA-Manifest + Service Worker (`sw.js`).

## Strukturentscheidung vom 7. September 2026

- Der Bruch-Spielplatz und die Quiz-Quest gehören fachlich zu **Mathe → Brüche** und dürfen bei den Filtern Deutsch oder Natur & Technik nicht sichtbar bleiben.
- Die Klassenwahl darf kein rein optisches Element sein. Jede Klassenstufe erhält einen eigenen Aufgabensatz und eine sichtbare Niveau-Beschreibung.
- Klasse 5: Bruchteile erkennen, vergleichen und einfache gleichwertige Brüche.
- Klasse 6: Kürzen, Erweitern, Addieren und Subtrahieren.
- Klasse 7: Brüche multiplizieren/dividieren und negative Brüche.
- Klasse 8: Bruchterme, Gleichungen und anspruchsvollere Anwendungen.
- Interaktive Stationen bleiben Teil des Mathe-Bruchbereichs; das Quiz ist eine Station innerhalb dieses Bereichs, kein fachloser Block.

## Technischer Stand

- GitHub: `git@github.com:alexanderkaufi/LernApp.git`
- Repository im Browser: https://github.com/alexanderkaufi/LernApp
- Veröffentlichte App: https://alexanderkaufi.github.io/LernApp/
- Hosting: GitHub Pages aus Branch `main`, Ordner `/ (root)`.
- Branch: `main`
- Lokaler Start: `python3 -m http.server 8000`, anschließend `http://localhost:8000`.
- Der aktuelle veröffentlichte Commit lässt sich mit `git log -1 --oneline` prüfen.

## Arbeitsweise und Absprachen

- Änderungen nach Möglichkeit über Dateien und Kommandozeile bearbeiten und testen.
- Den Browser nicht unnötig automatisiert bedienen, da dies viele Tokens verbraucht. Wenn ein Klick in GitHub nötig ist, dem Nutzer bevorzugt kurz sagen, wo er klicken soll.
- Nach einer abgeschlossenen Codeänderung: Syntax und Verknüpfungen prüfen, `PROJEKT_NOTIZ.md` aktualisieren, committen und zu `main` pushen.
- GitHub Pages übernimmt Änderungen an `main` automatisch; die Veröffentlichung kann anschließend ein bis zwei Minuten dauern.
- Bestehende oder fremde lokale Änderungen niemals verwerfen. Vor jedem Commit zuerst `git status` und `git diff` prüfen.

## Entstehung und dauerhafte Produktentscheidungen

- Ausgangspunkt war ein motivierender, responsiver Bruchlern-Prototyp für die Klassen 5–8.
- Das Repository `alexanderkaufi/LernApp` wurde als öffentliches GitHub-Repository eingerichtet und über GitHub Pages veröffentlicht.
- Der Markenname der App bleibt **KLUUG**; der emotionale Lernbegleiter heißt **Fiete**.
- Fiete soll Erfolge sichtbar feiern, bei Fehlern aufbauen und niemals mit einem harten roten „Falsch!“ demotivieren.
- Gewünschte Kernstationen sind Pizza-Bäckerei, Schoko-Labor, Bruch-Duell und Quiz-Quest.
- Sprachausgabe, einfache Browser-Sounds, High-Five-Reaktionen, Konfetti, XP, Serien und Abzeichen gehören zum Motivationskonzept.
- Lernfortschritt wird derzeit ohne Konto über `localStorage` im jeweiligen Browser gespeichert.
- Die Anwendung bleibt vorerst frameworkfrei, damit sie direkt über GitHub Pages läuft und leicht weiterentwickelt werden kann.

## Bei künftigen Änderungen aktualisieren

Immer kurz ergänzen:

1. Was wurde fachlich oder technisch verändert?
2. Welche Entscheidung ist dauerhaft relevant?
3. Was ist noch offen oder nur als Vorschau vorhanden?
4. Wurde die Änderung lokal getestet und bereits zu GitHub übertragen?

## Noch offen

- Optionale Einbindung eigener `.woff2`-Webfonts (`Manrope`/`Space Grotesk`), falls über den nativen System-Font-Stack hinaus eine einheitliche Webfont gewünscht ist.
- Weiterer Ausbau zusätzlicher Themen pro Fach (z. B. Leseverständnis-Langtexte, Biologie/Ökosysteme, Terme & Funktionen).
- Praktischer Test der Inhalte, Tutorreaktionen und Aufgaben mit Schülerinnen und Schülern der Klassen 5–8.

## Änderungsprotokoll

### 6. September 2026 – Projektstart und Veröffentlichung

- Responsiven KLUUG-Prototyp mit Dashboard, Bruchquiz, Tutorfeedback, XP, Serie, Fortschritt, Ergebnisansicht, Ton und Konfetti erstellt.
- Lokales Git-Repository initialisiert und das öffentliche GitHub-Repository `alexanderkaufi/LernApp` verbunden.
- GitHub Pages für `main` und `/ (root)` aktiviert.

### 7. September 2026 – Interaktive Lernstationen

- Fiete als anklickbaren emotionalen Tutor mit High-Five-Reaktionen und deutscher Browser-Sprachausgabe ergänzt.
- Pizza-Bäckerei, Schoko-Labor, animiertes Bruch-Duell und Quiz-Quest in einen gemeinsamen Bruch-Spielplatz eingebaut.
- Sechs Abzeichen und dauerhaft gespeicherte XP ergänzt.
- Mehrfaches XP-Sammeln durch wiederholtes Prüfen derselben Pizza-Aufgabe oder desselben Labor-Bruchs verhindert.
- Pizza-Stücke zusätzlich per Tastatur bedienbar gemacht.
- Commit `088310b` zu GitHub übertragen.

### 7. September 2026 – Fach- und Klassenstruktur

- `Fietes Bruch-Spielplatz` wird nur bei **Alle** oder **Mathe** angezeigt; bei Deutsch und Natur & Technik ist er ausgeblendet.
- Die Klassen 5–8 haben jeweils zehn eigene Quizfragen mit steigendem Niveau (40 Aufgaben insgesamt).
- Die Quest-Anzeige, Fortschrittslogik, Tutor-Texte und Ergebnisbewertung sind auf zehn Aufgaben angepasst.
- Lokal getestet: alle vier Klassen zeigen `1/10`; eine vollständige Klasse-5-Runde endet korrekt mit `10/10`, `200 XP` und ohne Konsolenfehler.
- Lernkarte, Weitermachen-Karte, Stationskopf und Quiz zeigen die gewählte Klassenstufe und das Niveau an.
- Die Klassenwahl wird im Browser gespeichert.
- Lokal geprüft: Aufgaben der Klassen 5–8, Fachfilter, gespeicherte Klassenwahl und JavaScript-Konsole ohne Fehler.
- Zusammen mit dieser Projektnotiz zu GitHub übertragen.

### 21. November 2026 – Klassenabhängige Stationen, Bugfixes, Diagnostik & Modularisierung

- **Code-Struktur & Wartbarkeit:** `app.js` ohne Framework/Build-Step in ES-Module aufgeteilt (`data/fractions.js`, `src/core/{math,state,store,audio,ui}.js`, `src/stations/{pizza,lab,duel,quest}.js`, `src/profile.js`), `styles.css` sauber formatiert und Hash-Verlauf (`#dashboard`, `#station/*`, `#lesson`) plus WAI-ARIA-Pfeiltastennavigation ergänzt.
- **Bugfixes & Accessibility:** Fokusverlust in der Pizza-Bäckerei durch gezielte SVG-Attribut-Updates statt `innerHTML`-Neuaufbau behoben, `AudioContext` als Singleton umgesetzt, Textextraktion für Sprachausgabe (`<br>`-Abstände, Mathe-Operatoren) bereinigt, `body { overflow-x: clip; }` für funktionierendes `position: sticky` genutzt und Mobile-Layouts (sichtbare XP/Serie, responsive Quest-Map ohne Überlauf) korrigiert.
- **Didaktik & Klassenbezug (Klassen 5–8):** Pizza-Bestellungen (direkt / Erweitern / Rechnen / Prozent, inkl. ganzer Pizza und neuer Bestellung bei Nennerwechsel), Schoko-Labor (Prozente, gleichwertige Brüche, Zahlenstrahl-Marken, 12 Forscher-Aufgaben), Bruch-Duell (gleichwertige/negative/unechte Brüche & Prozente plus Balken-Beweis nach Auflösung) und Quiz-Quest (gemischte Aufgaben/Antworten, echte gestapelte Inline-Brüche in Termen, Fiete-Tutor mit Vorlese-Button im Quiz, Themen-Auswertung und „Zweite Chance“-Wiederholung) umgesetzt.
- **Fortschritt & Profil:** Dynamischer Fortschritt auf Weitermachen-Karte und Quest-Map, echte tägliche Lernserie (`lastActiveDate`/`streakDays`), Profil-Dialog (eigener Name, Bestleistungen je Klasse, Themen-Check, zweistufiger Reset) sowie ehrliche Vorschau-Kennzeichnung der offenen Fächer ergänzt.
- **Lokal geprüft:** `tests/run_tests.mjs` (2154 Assertions), `tests/smoke_boot.mjs`, HTML/CSS-Strukturcheck sowie DOM-ID- und ES-Modul-Import-Prüfung ohne Fehler bestanden (noch nicht zu GitHub gepusht).

### 21. November 2026 – Ausbau auf alle 4 Lernwelten, Level/Tagesziel, Backup & PWA

- **Alle 4 Fächer aktiv (112 Aufgaben + 7 Werkstätten):** Die bisherigen Vorschaukarten `Formen & Flächen` (Geometrie), `Wortarten-Detektive` (Deutsch) und `Energie-Check` (Natur & Technik) wurden vollständig mit eigenen interaktiven Laboren (`src/stations/{geometryLab,wordsLab,scienceLab}.js`) und je 24 klassenspezifischen Aufgaben für die Klassen 5–8 (`data/{geometry,words,science,subjects}.js`) ausgebaut.
- **Quiz-Engine & Bedienung:** Unterstützt nun SVG-Geometrieformen, Satz-Markierungen und Energiefluss-Karten sowie Tastaturkürzel (`1`–`3` zum Antworten, `Enter`/`ArrowRight` für „Weiter“).
- **Motivation & Portabilität:** KLUUG-Level-System (Level 1–6), Tagesziel (`60 XP`), insgesamt 9 fächerübergreifende Abzeichen (`geometry`, `words`, `science` ergänzt), dynamische Weitermachen-Karte für das zuletzt genutzte Fach sowie JSON-Export/Import des Lernstands im Profil-Dialog umgesetzt.
- **PWA-Basis:** `manifest.webmanifest`, `assets/icon.svg` und Service Worker (`sw.js`) für Offline-Caching ergänzt.
- **Lokal geprüft:** `tests/run_tests.mjs` (2278 Assertions), `tests/smoke_boot.mjs` (inkl. aller 4 Fächer), HTML/CSS/Manifest/Service-Worker-Asset-Prüfung und ES-Modul-Imports ohne Fehler bestanden (noch nicht zu GitHub gepusht).

### 21. November 2026 – Profi-Eingabemodus, Blitz-Sprint, Merk-Karten & Adaptive Fokus-Übungen

- **Profi-Eingabemodus (`src/core/math.js`, `src/stations/quest.js`):** Umschaltbarer Eingabemodus für Rechen-, Bruch-, Gleichungs-, Geometrie- und Physik-Aufgaben mit toleranter Normalisierung (Brüche, Vorzeichen, Komma/Punkt, optionale Einheiten, `x=`-Präfixe), mobilen Mathe-Schnelltasten und +30 XP.
- **Adaptiver Lernvorschlag & Fokus-Training (`src/core/state.js`, `data/subjects.js`):** `getSmartRecommendation` erkennt Themen unter 70 % Trefferquote in `topicStatsByGrade` und startet mit einem Klick gezielte Fokus-Runden (`startFocusLesson`).
- **60-Sekunden-Sprint & Merk-Karten (`src/stations/sprint.js`, `data/cheatsheets.js`, `src/cheatsheets.js`):** Endloser, klassenspezifischer Kopf-Sprint mit optionalem Ruhemodus ohne Timer und Klassenrekord sowie filterbare Spickzettel-Karten für alle 4 Fächer.
- **Abzeichen & Bericht (`src/core/state.js`, `src/profile.js`, `sw.js`):** Auf 12 symmetrische Abzeichen erweitert (`profi`, `sprint`, `dailyGoal`), kopierbaren Lernbericht im Profil ergänzt und Service-Worker-Cache auf `kluug-v3` aktualisiert.
- **Lokal geprüft:** `tests/run_tests.mjs` (3022 Assertions), `tests/smoke_boot.mjs`, HTML/CSS/Manifest/Service-Worker-Prüfung ohne Fehler bestanden (noch nicht zu GitHub gepusht).

### 21. November 2026 – Multi-Profil, Englisch-Lernwelt, Hör-Diktat, Druckbericht & Offline-Fonts

- **5. Fach Englisch (`data/english.js`, `src/stations/englishLab.js`):** Interaktives Audio-Studio mit `en-GB`-Sprachausgabe sowie 24 klassenspezifische Quizfragen (136 Aufgaben insgesamt über alle 5 Fächer), ergänzt in Merk-Karten, Blitz-Sprint und Fokus-Training.
- **Deutsch Hör-Diktat (`data/words.js`, `src/stations/wordsLab.js`):** Zweiter Werkstatt-Modus zum Anhören und präzisen Schreiben schwieriger Rechtschreibwörter (inkl. Groß-/Kleinschreibung).
- **Multi-Profil-Vault (`src/core/state.js`, `src/core/store.js`, `src/profile.js`):** Geschwister-Wechsler (`kluug-profiles-v1`) für bis zu 6 Profile mit automatischer Migration aus `kluug-progress`, 15 Abzeichen (`english`, `dictation`, `allSubjects` ergänzt) und druckbarem Wochenbericht (`@media print`).
- **Offline- & Datenschutz-Hygiene (`index.html`, `styles.css`, `sw.js`):** Externe Google-Fonts-Einbindung durch nativen geometrischen System-Font-Stack ersetzt (0 externe Requests) und Service Worker auf `kluug-v4` aktualisiert.
- **Lokal geprüft:** `tests/run_tests.mjs` (3191 Assertions), `tests/smoke_boot.mjs`, HTML/CSS/Manifest/Service-Worker-Prüfung ohne Fehler bestanden.
