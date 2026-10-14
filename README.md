# Songster 🎵

Przeglądarkowa gra muzyczna: układanie piosenek na osi czasu (inspirowane planszówką
Hitster) oraz tryb w stylu „Jaka to melodia”. Polskie i zagraniczne przeboje od lat 50. do dziś.

**Zagraj:** https://matyz55.github.io/songster/ (po włączeniu GitHub Pages)

## Tryby gry

- **Oś czasu – 1 gracz** – układasz piosenki na osi czasu wg roku wydania;
  masz ograniczoną liczbę pomyłek. Wpisanie poprawnego tytułu i wykonawcy daje żeton.
- **Oś czasu – multiplayer** – 2–8 graczy przy jednym urządzeniu, z wyzwaniami
  i żetonami jak w planszówce. Żetony: 1 = pominięcie piosenki (gra najpierw pokazuje, co to było),
  3 = kupno karty – przed odkryciem na oś trafia grana piosenka, po odkryciu losowa karta z talii.
- **Oś czasu – drużyny** – 2–4 drużyny, każda ze wspólną osią czasu; członkowie drużyny
  odpowiadają po kolei (gra pokazuje, kto teraz zgaduje). Zasady jak w multiplayerze.
- **Jaka to melodia** – 1–8 graczy po kolei odgadują tytuł, wykonawcę albo oba. Odpowiedź wpisuje się
  w jedno pole – od 3 liter pojawiają się podpowiedzi ze wszystkich piosenek w bazie (także przy osi czasu).
  Wielkość liter, polskie znaki i drobne literówki nie mają znaczenia. Przy duetach
  i utworach kilku wykonawców wystarczy podać jednego z nich.
- **Melodia krok po kroku** – najpierw 1 s fragmentu, potem 2, 4 i 8 s. Odgadnięcie
  daje 4/3/2/1 pkt (za każdą zgadywaną część), błędna odpowiedź wydłuża fragment,
  a podpowiedź z pierwszą literą kosztuje 1 punkt.

- **Na czas** – jak najwięcej poprawnie ułożonych kart w 1/2/3/5 minut (czas płynie tylko
  podczas słuchania i układania); ranking 10 najlepszych wyników dla każdego limitu i poziomu.
- **Starsza czy nowsza?** – czy piosenka jest starsza, czy nowsza od poprzedniej karty;
  seria bez pomyłki i rekord.
- **Pojedynek dekad** – dwie dekady (losowe lub wybrane), trzeba wskazać, z której jest piosenka.
- **Kto pierwszy?** – 2–8 osób przy jednym urządzeniu, każda ma przycisk i klawisz (domyślnie 1–8, w ustawieniach każdy gracz może przypisać własny);
  kto pierwszy naciśnie, ten odpowiada: +1 pkt za dobrą odpowiedź, −1 za złą.

**Karty specjalne** (modyfikatory osi czasu, do wyboru): podwójna, kradzież żetonu, zamiana osi.

**Ciekawostki** po odkryciu karty: zwycięstwo lub miejsce na Eurowizji, 1. miejsce Listy
Przebojów Trójki, festiwal w Opolu, miejsce na Billboard Year-End Hot 100, nr 1 w Polsce.

**Moje statystyki** (📊, tylko na danym urządzeniu): skuteczność w dekadach i gatunkach,
najczęściej mylone piosenki, historia rekordów i wykres postępów.

**Duży ekran** (📺): drugie okno (`tv.html`) dla telewizora lub rzutnika, z dużymi kartami
i osiami wszystkich graczy; okno gry na tym samym urządzeniu jest pilotem (BroadcastChannel).
Wszystkie osie mieszczą się na ekranie bez przewijania (przy 4+ graczach w dwóch kolumnach), widać
wybrane miejsce karty (i miejsce wskazane przy wyzwaniu) oraz znaczniki po pomyłce. Stan graczy
(karty, żetony) jest przy ich osiach. Przyciski z okna gry (zatwierdź, wyzwanie z podpowiedzią, kto może je
rzucić, kupno karty, pominięcie…) są też na dużym ekranie i można je tam klikać. Wszystko skaluje się
na bieżąco do rozmiaru okna – także w 2K i 4K (czcionki, ramki i odstępy rosną z rozdzielczością,
okładki pobierane są w jakości dopasowanej do ekranu).

**Telewizor przez sieć**: na telewizorze (np. Google TV) lub innym komputerze otwórz `tv.html` i kliknij
„📶 Połącz z innym urządzeniem” – pojawi się 4-znakowy kod i kod QR. Telefon, na którym toczy się gra, skanuje
QR (albo w oknie 📺 wpisuje kod) i od tej chwili steruje dużym ekranem. Połączenie: WebRTC przez PeerJS
(biblioteka i serwer pośredniczący ładowane dopiero po kliknięciu).

**Gracze na własnych telefonach**: gospodarz (też gra, u niego gra muzyka) w oknie 📺 tworzy pokój – gracze
skanują QR (`tv.html?join=KOD`), wybierają, kim są, i w swojej turze wybierają miejsce na osi, wpisują
odpowiedź (z podpowiedziami), naciskają przyciski (wyzwanie, kupno karty…) albo swój przycisk w „Kto pierwszy?”.

Na dużym ekranie widać też pasek kroków (Melodia krok po kroku), przyciski graczy (Kto pierwszy?), kręcącą
się płytę i postęp fragmentu. W trakcie gry ekran telefonu nie gaśnie (Screen Wake Lock), a fragmenty
wchodzą i kończą się płynnie (150 ms).

**Wersja angielska**: język wybiera się w Ustawieniach (domyślnie wg języka przeglądarki).
Teksty interfejsu przechodzą przez `T()` (`i18n.js`), słownik jest w `i18n-en.js`; tytuły
piosenek i nazwy wykonawców się nie zmieniają.

**Statystyki odwiedzin**: Umami Cloud (`analytics.js`) – bez ciasteczek; zdarzenia
`start-gry` (tryb, poziom, zestaw, liczba graczy, język), `koniec-gry` (tryb, czas, wynik),
`czas-wizyty`, `statystyki`, `duzy-ekran`. Dane wysyłane są tylko z matyz55.github.io.

**Tryb ekspert** (osie czasu): żeby zatrzymać kartę, oprócz miejsca na osi trzeba podać
wybrane dane – tytuł, wykonawcę i/lub dokładny rok (do wyboru w ustawieniach gry).

**Zestawy tematyczne** – gotowe ustawienia puli: Przeboje Trójki (1. miejsca Listy Przebojów
Programu Trzeciego wg polskiej Wikipedii i plebiscyty „Polski Top Wszech Czasów”), Opole
(piosenki z artykułów o Krajowym Festiwalu Piosenki Polskiej w Opolu), Eurowizja (kategorie
„Eurovision songs” angielskiej Wikipedii) i muzyka filmowa. Własne ustawienia można zapisać
jako zestaw.

Kartę można **przeciągnąć palcem lub myszą** na oś (albo kliknąć „＋”). Gra ma proste
animacje i dźwięki efektów (do wyłączenia w ustawieniach) i działa jako **aplikacja (PWA)**:
na Androidzie przycisk „Zainstaluj”, na iPhonie „Udostępnij → Do ekranu początkowego”.

Każdy wykonawca pojawia się w jednej grze najwyżej raz, a piosenki nie powtarzają się
między kolejnymi rozgrywkami w tej samej karcie przeglądarki (dopóki w wybranej puli
nie zabraknie nowych). Po pomyłce oś pokazuje, gdzie gracz położył kartę i gdzie było
właściwe miejsce. **Poziom trudności**:
bardzo łatwy (ok. 1000 najpopularniejszych piosenek w Spotify – po 500 polskich
i zagranicznych), łatwy (znane piosenki), średni – domyślny (wszystkie piosenki) i trudny (mniej znane;
na osi czasu częściej trafiają się utwory wydane blisko lat Twoich kart). Na każdym
poziomie piosenki są losowane równomiernie z różnych dekad, a przy mieszanych piosenkach
można ustawić **udział polskich** (domyślnie 50%). W multiplayerze można widzieć osie wszystkich graczy.
Na telefonie oś czasu jest pionowa, a przyciski akcji przyklejone do dołu ekranu.

Przed grą można zawęzić pulę piosenek: polskie/zagraniczne, **dekady** (lata 30.–60. to jedna
kategoria „do 1969”, bo starszych piosenek jest niewiele), **gatunki**
(z Discogs), **kraj wykonawcy**, a także ustawić
**długość fragmentu** (30/15/10/5 s), odtwarzanie z **losowego miejsca** i podpowiedź
z dekadą. Ustawienia są zapamiętywane. Po grze widać listę
wszystkich piosenek, które padły, z ikonkami YouTube, Spotify i Apple Music (na Androidzie
otwierają od razu aplikację, a gdy jej nie ma – stronę serwisu). Te same ikonki są pod odkrytą kartą.

## Ustawienia (⚙)

- dźwięki efektów i animacje (włączone domyślnie; animacje wyłączają się też przy
  systemowym ustawieniu „ogranicz ruch”),
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
w Spotify, `src` – źródło daty, `w` – piosenka dodana z Wikipedii dla uzupełnienia roku,
bez danych o popularności – nie trafia na poziom łatwy).
Rok oznacza **rok pierwszego wydania nagrania** danego wykonawcy.

Źródła: [Discogs](https://www.discogs.com/) (wydanie sprawdzane po trackliście),
[MusicBrainz](https://musicbrainz.org/), Wikipedia oraz daty wydań ze Spotify
(z eksportu playlist). Piosenka trafia do gry, jeśli rok podaje choć jedno źródło.
Oprócz przesłanych playlist lista jest uzupełniona o piosenki z list przebojów
(Billboard Year-End Hot 100, numery jeden w Polsce) i z artykułów polskiej Wikipedii o
piosenkach – tam, gdzie w danym roku brakowało polskich lub zagranicznych utworów.
Szczegóły, reguła wyboru roku i pełna tabela: [`VERIFICATION.md`](VERIFICATION.md).

Flagi to obrazki SVG z pakietu [flag-icons](https://github.com/lipis/flag-icons) 7.5.0
(licencja MIT, `flags/LICENSE`) – emoji flag nie wyświetlają się w Windows.

Dopasowanie nagrania w iTunes (`match.js`) wymaga zgodności wykonawcy i tytułu
oraz pomija wersje koncertowe, remiksy, karaoke i covery (pola `q`, `m`, `al`
w `songs.js` to podpowiedzi dla wyszukiwarki; `ia` – inny wykonawca, pod którym
nagranie jest w iTunes, `nx` – albumy z późniejszymi nagraniami do pominięcia).
Oryginałów Lombardu nie ma w iTunes – gra odtwarza nowe aranżacje z oryginalną
wokalistką z albumu Małgorzaty Ostrowskiej „Instynkt” (2001), a nie wersje
„Lombard Swing” (2016) czy „Lombard 40/40” (2025).
