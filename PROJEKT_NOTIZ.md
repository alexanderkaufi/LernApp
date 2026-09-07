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

- Fächerfilter: Alle, Mathe, Deutsch, Natur & Technik.
- Klassenwahl: Klassen 5, 6, 7 und 8.
- Bruch-Lernbereich mit Pizza-Bäckerei, Schoko-Labor, Bruch-Duell und Quiz-Quest.
- Quiz mit zehn Aufgaben pro Klassenstufe, unmittelbarem Feedback und Ergebnisansicht.
- Lokale Speicherung von XP, besuchten Stationen und Abzeichen.
- Sprachausgabe und Ton können ein- und ausgeschaltet werden.
- Responsive, frameworkfreie Web-App in `index.html`, `styles.css` und `app.js`.

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

- Deutsch, Geometrie sowie Natur & Technik sind bislang Vorschauen ohne vollständige Aufgaben.
- Nutzerprofil und echte Lernstandsdiagnostik sind noch nicht umgesetzt.
- Die Klassenstufe wird lokal gespeichert und beim nächsten Besuch wiederhergestellt.
- Die Lernstationen verwenden derzeit noch weitgehend dieselbe Schwierigkeit für alle Klassen; später sollen auch Pizza, Schoko-Labor und Duell klassenabhängig werden.
- Inhalte, Gestaltung, Tutorreaktionen und Aufgaben sollen später mit Kindern praktisch getestet und auf Verständlichkeit geprüft werden.

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
