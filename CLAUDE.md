# Songster – zasady pracy w repozytorium

## Historia zmian (CHANGELOG.md)

- Przy **każdej** wydanej zmianie (każdy commit wypychany na gałąź) dopisz w `CHANGELOG.md` nową wersję na końcu pliku:
  `## X.Y.Z – DD.MM.RRRR (`skrót commitu`)` i krótką listę zmian po polsku, zrozumiałą dla gracza.
- Numer wersji według wagi zmiany:
  - główna (X) – nowy sposób grania albo przebudowa całej gry,
  - pośrednia (Y) – nowe funkcje, tryby, ustawienia, duże uzupełnienia bazy piosenek,
  - poprawkowa (Z) – poprawki błędów, danych piosenek i drobne zmiany.
- Skrót commitu wpisz po utworzeniu commitu (np. w kolejnym commicie albo poprawką tej samej wersji).
- Pisz tylko to, co faktycznie zmieniono – bez obietnic i bez niesprawdzonych informacji.

## Wersja dla dużego ekranu i telefonów

- Przy zmianach w `tv.js`, `tv.html`, `net.js` lub w danych wysyłanych do dużego ekranu podnieś `version` w `net.js`
  i `CACHE` w `sw.js` (ta sama liczba) – starsze strony same się wtedy odświeżą.
