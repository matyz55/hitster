# Songster 🎵

Przeglądarkowa gra muzyczna: układanie piosenek na osi czasu (inspirowane planszówką
Hitster) oraz tryb w stylu „Jaka to melodia”. Polskie i zagraniczne przeboje od lat 50. do dziś.

**Zagraj:** https://matyz55.github.io/songster/ (po włączeniu GitHub Pages)

## Tryby gry

- **Oś czasu – 1 gracz** – układasz piosenki na osi czasu wg roku wydania;
  masz ograniczoną liczbę pomyłek. Wpisanie poprawnego tytułu i wykonawcy daje żeton.
- **Oś czasu – multiplayer** – 2–8 graczy przy jednym urządzeniu, z wyzwaniami
  i żetonami jak w planszówce.
- **Jaka to melodia** – 1–8 graczy po kolei odgadują tytuł, wykonawcę albo oba.
  Wielkość liter, polskie znaki i drobne literówki nie mają znaczenia.

Każdy wykonawca pojawia się w jednej grze najwyżej raz. **Poziom trudności**:
łatwy (znane piosenki), średni – domyślny (wszystkie piosenki) i trudny (mniej znane;
na osi czasu częściej trafiają się utwory wydane blisko lat Twoich kart). Na każdym
poziomie piosenki są losowane równomiernie z różnych dekad, a przy mieszanych piosenkach
można ustawić **udział polskich** (domyślnie 50%). W multiplayerze można widzieć osie wszystkich graczy.
Na telefonie oś czasu jest pionowa, a przyciski akcji przyklejone do dołu ekranu.

Przed grą można zawęzić pulę piosenek: polskie/zagraniczne, **dekady** (lata 30.–60. to jedna
kategoria „do 1969”, bo starszych piosenek jest niewiele), **gatunki**
(z Discogs), **kraj wykonawcy**, a także ustawić
**długość fragmentu** (30/15/10/5 s), odtwarzanie z **losowego miejsca** i podpowiedź
z dekadą. Ustawienia są zapamiętywane. Po grze widać listę
wszystkich piosenek, które padły, z linkami do serwisu streamingowego.

## Ustawienia (⚙)

- serwis dla przycisku „Posłuchaj całości”: YouTube, Spotify albo Apple Music,
- poprawianie roku wydania i kraju wykonawcy dowolnej piosenki (zapisywane w przeglądarce;
  kraj decyduje też, czy piosenka jest polska, czy zagraniczna).

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

Flagi to obrazki SVG z pakietu [flag-icons](https://github.com/lipis/flag-icons) 7.5.0
(licencja MIT, `flags/LICENSE`) – emoji flag nie wyświetlają się w Windows.

Dopasowanie nagrania w iTunes (`match.js`) wymaga zgodności wykonawcy i tytułu
oraz pomija wersje koncertowe, remiksy, karaoke i covery (pola `q`, `m`, `al`
w `songs.js` to podpowiedzi dla wyszukiwarki).
