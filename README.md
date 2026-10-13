# Songster 🎵

Przeglądarkowa gra muzyczna: układanie piosenek na osi czasu (inspirowane planszówką
Hitster) oraz tryb w stylu „Jaka to melodia”. Polskie i zagraniczne przeboje od lat 50. do dziś.

**Zagraj:** https://matyz55.github.io/hitster/ (po włączeniu GitHub Pages)

## Tryby gry

- **Oś czasu – 1 gracz** – układasz piosenki na osi czasu wg roku wydania;
  masz ograniczoną liczbę pomyłek. Wpisanie poprawnego tytułu i wykonawcy daje żeton.
- **Oś czasu – multiplayer** – 2–8 graczy przy jednym urządzeniu, z wyzwaniami
  i żetonami jak w planszówce.
- **Jaka to melodia** – 1–8 graczy po kolei odgadują tytuł, wykonawcę albo oba.
  Wielkość liter, polskie znaki i drobne literówki nie mają znaczenia.

Przed grą można zawęzić pulę piosenek: polskie/zagraniczne, **dekady**, **gatunki**
(z Discogs), **kraj wykonawcy**, **popularność** (wg Spotify), a także ustawić
**długość fragmentu** (30/15/10/5 s), odtwarzanie z **losowego miejsca** i podpowiedź
z dekadą. Ustawienia są zapamiętywane. Każda gra losuje piosenki równomiernie z różnych dekad. Po grze widać listę
wszystkich piosenek, które padły, z linkami do serwisu streamingowego.

## Ustawienia (⚙)

- serwis dla przycisku „Posłuchaj całości”: YouTube, Spotify albo Apple Music,
- poprawianie roku wydania dowolnej piosenki (zapisywane w przeglądarce).

## Jak uruchomić lokalnie

To statyczna strona – bez instalacji i bez budowania.

```bash
python3 -m http.server 8000
# otwórz http://localhost:8000
```

Wymagany jest internet: 30-sekundowe fragmenty utworów są pobierane w trakcie
gry z publicznego [iTunes Search API](https://performance-partners.apple.com/search-api)
(format AAC/.m4a – przeglądarka musi go obsługiwać). Piosenki, dla których iTunes
nie ma fragmentu, są w grze automatycznie pomijane.

## Lista piosenek i lata wydania

Piosenki są w pliku [`songs.js`](songs.js) (`a` – wykonawca, `t` – tytuł,
`y` – rok, `c` – `PL`/`INT`, `cc` – kraj artysty, `g` – gatunki, `p` – popularność
w Spotify, `src` – źródło daty).
Rok oznacza **rok pierwszego wydania nagrania** danego wykonawcy.

Źródła: [Discogs](https://www.discogs.com/) (wydanie sprawdzane po trackliście),
[MusicBrainz](https://musicbrainz.org/), Wikipedia oraz daty wydań ze Spotify
(z eksportu playlist). Piosenka trafia do gry, jeśli rok podaje choć jedno źródło.
Szczegóły, reguła wyboru roku i pełna tabela: [`VERIFICATION.md`](VERIFICATION.md).

Dopasowanie nagrania w iTunes (`match.js`) wymaga zgodności wykonawcy i tytułu
oraz pomija wersje koncertowe, remiksy, karaoke i covery (pola `q`, `m`, `al`
w `songs.js` to podpowiedzi dla wyszukiwarki).
