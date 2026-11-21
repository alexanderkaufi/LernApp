# KLUUG – interaktive Lern-App

Ein motivierender, responsiver Lern-Campus für Schülerinnen und Schüler der Klassen 5–8 mit fünf aktiven Themenwelten: **Brüche verstehen**, **Formen & Flächen (Geometrie)**, **Wortarten-Detektive (Deutsch)**, **English Boost (Englisch)** und **Energie-Check (Natur & Technik)**.

## Starten

```bash
python3 -m http.server 8000
```

Danach im Browser `http://localhost:8000` öffnen (Hinweis: Da KLUUG ES-Module und einen Service Worker verwendet, bitte über einen lokalen Webserver oder GitHub Pages öffnen, nicht direkt per `file://`).

## Tests ausführen (macOS JavaScriptCore)

```bash
/System/Library/Frameworks/JavaScriptCore.framework/Versions/A/Helpers/jsc -m tests/run_tests.mjs
/System/Library/Frameworks/JavaScriptCore.framework/Versions/A/Helpers/jsc -m tests/smoke_boot.mjs
```

## Enthalten

- **5 voll funktionsfähige Lernwelten** für die Klassen 5–8 (136 kuratierte Quiz-Aufgaben + 9 interaktive Stationen/Werkstätten)
- **Mathe · Brüche:** Pizza-Bäckerei (direkt, Erweitern/Kürzen, Rechnen, Prozente), Schoko-Labor (Zahlenstrahl, Dezimalzahl, Prozent, Gleichwertigkeit, 12 Forscher-Aufgaben), Bruch-Duell (mit visuellem Balken-Beweis) und 10er Quiz-Quest
- **Mathe · Geometrie (`Formen & Flächen`):** Geometrie-Labor (Winkel-Scanner `10°–350°` & Flächen-/Umfangs-Baumeister) + 24 klassenspezifische SVG-Aufgaben
- **Deutsch (`Wortarten-Detektive`):** Wort-Lupe (gesuchte Wörter direkt im Satz anklicken), **Hör-Diktat** (Satz anhören & Rechtschreibung prüfen) + 24 klassenspezifische Aufgaben
- **Englisch (`English Boost`):** Audio-Studio mit englischer Sprachausgabe (`en-GB`), Vokabel-/Grammatik-Training + 24 klassenspezifische Aufgaben
- **Natur & Technik (`Energie-Check`):** Energie-Labor (Solarmodul, Wasserkraft, LED, Fahrrad-Dynamo mit Eingangsleistung & Wirkungsgrad) + 24 klassenspezifische Physik-/Energie-Aufgaben
- **Blitz-Sprint (`60s` oder Ruhemodus):** Endlose, klassenspezifische Kopf-Fragen quer durch alle 5 Fächer mit Combo-Anzeige und Klassenrekord
- **Quiz-Engine & Profi-Eingabe:** Gemischte Aufgaben- und Antwortreihenfolge, umschaltbarer **Profi-Eingabemodus** (freies Eintippen mit Mathe-Schnelltasten und +30 XP), Tastaturkürzel (`1`–`3`, `Enter`/`→`), „Zweite Chance“ für Fehler, adaptives Fokus-Training und Fiete mit Sprachausgabe
- **Multi-Profil, Merk-Karten & Lernbericht:** Geschwister-Wechsler (bis zu 6 Profile), **Fietes Merk-Karten** (filterbarer Spickzettel für alle 5 Fächer), KLUUG-Level-System (Level 1–6), Tagesziel (`60 XP`), echte tägliche Lernserie, **15 Abzeichen**, **druckbarer Wochenbericht**, kopierbarer Textbericht und JSON-Backup-Export/Import
- **Offline-fähige, datenschutzfreundliche PWA-Basis:** `manifest.webmanifest`, `assets/icon.svg`, `sw.js` und lokale Systemschriftarten ohne externe Tracking-/Font-Requests
