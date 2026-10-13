# Hitster web 🎵

Przeglądarkowa gra muzyczna wzorowana na planszówce **Hitster**: słuchasz
fragmentu piosenki i próbujesz wstawić ją we właściwe miejsce swojej osi czasu
(wg roku wydania). Polskie i zagraniczne przeboje od lat 50. do dziś.

## Jak uruchomić

To statyczna strona – bez instalacji i bez budowania.

```bash
python3 -m http.server 8000
# otwórz http://localhost:8000
```

Można też po prostu otworzyć `index.html` w przeglądarce albo włączyć
GitHub Pages dla repozytorium.

Wymagany jest internet: 30-sekundowe fragmenty utworów są pobierane w trakcie
gry z publicznego [iTunes Search API](https://performance-partners.apple.com/search-api)
(format AAC/.m4a – działa w Chrome, Edge, Firefoksie i Safari).

## Zasady (w skrócie)

1. Każdy gracz zaczyna z jedną odkrytą kartą.
2. W swojej turze słuchasz piosenki i wybierasz miejsce na osi (przed, między
   albo po swoich kartach).
3. Inni gracze mogą rzucić **wyzwanie** (1 żeton) i wskazać inne miejsce.
4. Trafiłeś – karta zostaje. Nie trafiłeś, a pretendent tak – karta trafia do
   niego. W innym przypadku przepada.
5. Odgadnięcie wykonawcy i tytułu = +1 żeton (maks. 5).
   1 żeton = pominięcie piosenki, 3 żetony = kupienie karty.
6. Wygrywa pierwsza osoba z ustaloną liczbą kart (domyślnie 10).

Utwory z tego samego roku można kłaść w dowolnej kolejności.

## Lista piosenek i weryfikacja lat

Piosenki są w pliku [`songs.js`](songs.js) (`a` – wykonawca, `t` – tytuł,
`y` – rok, `c` – `PL`/`INT`). Rok oznacza **rok pierwszego wydania nagrania**
(singla lub albumu, na którym utwór ukazał się po raz pierwszy).

Każdy rok został sprawdzony automatycznie w dwóch źródłach:

- [MusicBrainz](https://musicbrainz.org/) – najwcześniejsza data pierwszego
  wydania nagrania danego wykonawcy,
- Wikipedia (pole „wydany” / „released” w infoboksie artykułu o utworze).

Domyślnie w grze są tylko utwory z poziomu **v2** – oba źródła są zgodne albo
rozbieżność została wyjaśniona (np. wcześniejsza data w MusicBrainz dotyczyła
bootlegu lub dema). Utwory **v1** (rok potwierdza tylko jedno źródło) można
dołączyć zaznaczając opcję w ustawieniach gry. Utwory z danymi sprzecznymi lub
bez fragmentu w iTunes zostały odrzucone. Pełna tabela z uzasadnieniem:
[`VERIFICATION.md`](VERIFICATION.md). Jeśli znajdziesz błąd – popraw rok w `songs.js`.

Własną piosenkę dodasz, dopisując wiersz do `songs.js`; gra sama znajdzie
fragment w iTunes (pole `q` nadpisuje frazę wyszukiwania, a `m` – tytuł, pod
jakim utwór figuruje w iTunes). Dopasowanie nagrania (`match.js`) wymaga zgodności
wykonawcy i tytułu oraz pomija wersje koncertowe, remiksy, karaoke i covery.
