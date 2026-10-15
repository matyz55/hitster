# Historia zmian Songstera

Wszystkie wydane wersje gry, od pierwszej. Każda wersja to jedna publikacja na gałęzi (commit) – w nawiasie skrót
commitu, po którym można ją odnaleźć w historii repozytorium.

Numeracja (nadana po fakcie, według wagi zmian):

- **główna** (np. 4.0.0) – nowy sposób grania albo przebudowa całej gry,
- **pośrednia** (np. 4.3.0) – nowe funkcje, tryby, ustawienia, duże uzupełnienia bazy piosenek,
- **poprawkowa** (np. 4.3.1) – poprawki błędów, danych piosenek i drobne zmiany.

Liczby piosenek podane przy wersjach to liczba wpisów w `songs.js` w danej wersji.

---

## 0.1.0 – 13.10.2026 (`1371cf0`) – pierwsza wersja

Pierwsza, statyczna wersja gry w przeglądarce, wzorowana na planszówce Hitster (wtedy jeszcze pod nazwą „Hitster web”).

- Słuchasz 30-sekundowego fragmentu z iTunes i układasz piosenkę na osi czasu według roku wydania.
- Gra dla kilku graczy: wyzwania, żetony, pominięcie piosenki i kupno karty.
- 177 polskich i zagranicznych piosenek; lata wydania sprawdzone w MusicBrainz i Wikipedii
  (źródła i odrzucone wpisy w `VERIFICATION.md`).

## 0.1.1 – 13.10.2026 (`90f9cf8`, `5439a5b`)

- Dokładniejsze dopasowanie nagrań w iTunes: oryginalna wersja studyjna zamiast wersji koncertowych, remiksów,
  karaoke i ponownych nagrań.
- Lista piosenek odtworzona po pełnym sprawdzeniu dostępności w iTunes (176 piosenek).
- Opcja dopuszczenia piosenek, których rok potwierdza tylko jedno źródło.
- Poprawiona polska odmiana liczebników.
- Usunięta niesprawdzona informacja o obsłudze formatu AAC w przeglądarkach.

## 0.2.0 – 13.10.2026 (`f82a7bc`, `e2dea3d`)

- Ekran startowy z trzema trybami: oś czasu dla jednej osoby (ograniczona liczba pomyłek), oś czasu dla 2–8 graczy
  przy jednym urządzeniu i „Jaka to melodia” (tytuł, wykonawca albo oba; drobne literówki są wybaczane).
- Losowanie z wyrównaniem dekad – żadna dekada nie dominuje w grze.
- Poprawki roku wydania zapisywane w przeglądarce.
- Wybór serwisu (YouTube, Spotify, Apple Music) do odsłuchania całej piosenki.
- Lista wszystkich piosenek z gry na koniec rozgrywki.
- Flaga kraju zamiast ikony globusa.
- README z opisem trybów i źródeł dat.

## 1.0.0 – 13.10.2026 (`f1ce560`, `0bee2a7`) – Songster

- Nowa nazwa gry: **Songster**; tryby osi czasu nazywają się „Oś czasu”.
- **3322 piosenki** – lista przebudowana z przesłanej playlisty Spotify (bez duplikatów) i dotychczasowej listy.
- Lata wydania sprawdzane w Discogs (z kontrolą tracklisty), MusicBrainz, Wikipedii i datach wydań Spotify.
- Kraj wykonawcy z MusicBrainz i Wikidata, gatunki z Discogs (zapasowo ze Spotify), popularność ze Spotify.
- Filtry w ustawieniach gry: dekady, gatunki, kraj wykonawcy, popularność; długość fragmentu, fragment z losowego
  miejsca, podpowiedź z dekadą.
- Kolejna piosenka pobierana w tle, gdy gra obecna.

## 1.0.1 – 13.10.2026 (`0e21480`)

- Poprawione kraje wykonawców: Ewa Farna liczona jako polska; polscy wykonawcy pomyleni z zagranicznymi imiennikami
  (m.in. Tilt, Mafia, Hurt, Feel, Jamal, VOX, IRA) poprawieni na podstawie MusicBrainz i Wikidata.
- Wykonawcy bez kraju w żadnym źródle, obecni tylko na polskich playlistach, liczeni jako polscy (bez flagi).

## 1.1.0 – 13.10.2026 (`1801a79`)

- Każdy wykonawca (także gościnny) pojawia się w jednej grze najwyżej raz.
- Poziomy trudności zamiast filtra popularności.
- W grze wieloosobowej opcja pokazywania osi wszystkich graczy.
- Układ na telefony: pionowa oś, przyklejony pasek przycisków, większe pola dotyku.

## 1.2.0 – 13.10.2026 (`a098105`)

- Nowe poziomy trudności: łatwy, średni (domyślny), trudny (mniej znane piosenki, częściej z lat bliskich kartom gracza).
- Progi popularności liczone osobno dla piosenek polskich i zagranicznych.
- Suwak udziału polskich piosenek w mieszanej puli (domyślnie 50%).

## 1.2.1 – 13.10.2026 (`1ff6dc4`)

- Lata 30.–50. połączone z 60. w jedną kategorię „do 1969” (filtry, wyrównanie dekad, podpowiedź).

## 1.3.0 – 13.10.2026 (`4a5981b`)

- Oś czasu zaczyna się od karty z samym rokiem (bez piosenki), dla każdego gracza z innej dekady, jeśli to możliwe.

## 1.4.0 – 13.10.2026 (`abf5dd4`)

- Flagi jako obrazki SVG (flag-icons 7.5.0) – Windows nie wyświetla flag emoji.
- W ustawieniach można poprawić kraj wykonawcy piosenki (zmienia też kategorię polska/zagraniczna).
- Jugosławia wyświetlana poprawnie (zamiast „Serbia”).

## 1.4.1 – 13.10.2026 (`647ca07`)

- Przy duetach i utworach kilku wykonawców wystarczy podać jednego z nich; dodatkowi wykonawcy dla 50 piosenek.

## 1.5.0 – 13.10.2026 (`8774d32`)

- **718 nowych piosenek** (659 polskich) z czterech polskich playlist – razem **4038**.
- Piosenki datowane tylko przez Spotify sprawdzone ponownie w Discogs.
- Wydania koncertowe, wideo i nagrania radiowe nie liczą się już jako pierwsze wydanie.
- Ręczne poprawki lat ze źródłami (Tina Turner, Kult, Republika, Stiltskin, Chłopcy z Placu Broni).

## 1.5.1 – 13.10.2026 (`de35d56`, `92fc46c`)

- Poprawki lat wprowadzone przez autora: Rena Rolska – „Jeszcze poczekajmy” (1961), Małgorzata Ostrowska –
  „Meluzyna” (1985).

## 1.6.0 – 13.10.2026 (`d37ab00`)

- Płynne odtwarzanie na telefonach: cały fragment pobierany przed włączeniem przycisku ▶, następny – z wyprzedzeniem.
- Gra bez końca w trybie jednego gracza (do wyczerpania pomyłek, rekord na każdy poziom).
- Wariant wyzwania „dokładny rok”.
- Przy jednej karcie na osi miejsca opisane „Wcześniej” / „Później”.

## 1.6.1 – 13.10.2026 (`3d2e3cf`)

- Poprawione lata: „Opowieść” (Edyta Bartosiewicz) 2001, „Z ciszą pośród czterech ścian” (Anna Wyszkoni) 2009,
  „Don't Cry” (Guns N' Roses) 1991.
- Usunięty cover „Bieszczadzkich aniołów”.
- Pomijane późne nagrania z dodatkowym wykonawcą (np. „Małgośka” z 2025 r. zamiast oryginału z 1973 r.).

## 1.7.0 – 14.10.2026 (`ce9bc73`)

- **Razem 5490 piosenek**: uzupełnienia z Billboard Year-End, numerów jeden w Polsce i artykułów polskiej Wikipedii.
- Rok pierwszego singla z Discogs; MusicBrainz rozstrzyga, gdy rok podaje tylko Spotify.
- Kolejni polscy wykonawcy pomyleni z zagranicznymi poprawieni (m.in. Marissa, Igo, Basia, Venus, Kowalski, Oki, Blanka).
- Usunięte duplikaty; poprawione daty m.in. „Zielono mi”, „Sen o Warszawie”, „Napisz proszę”, „Sybilla”.

## 1.8.0 – 14.10.2026 (`6f56717`)

- Po pomyłce oś pokazuje, gdzie gracz położył kartę, gdzie wskazał wyzywający i gdzie było właściwe miejsce.
- Piosenki zagrane w danej karcie przeglądarki nie wracają w kolejnych grach, dopóki są nowe.

## 1.8.1 – 14.10.2026 (`ce98d7d`)

- Poprawione daty 13 piosenek datowanych rokiem składanki (m.in. „Psalm stojących w kolejce” Krystyny Prońko – 1981).

## 1.9.0 – 14.10.2026 (`d6cd26e`)

- Nowy poziom **„Bardzo łatwy”** – 1000 najpopularniejszych piosenek (po 500 polskich i zagranicznych).
- Covery zastąpione oryginałami albo usunięte (m.in. „Łatwopalni”); dodane oryginały Niemena, Skaldów i Łucji Prus,
  Klinczu, O.N.A. Razem 5452 piosenki.
- Poprawione daty kolejnych piosenek.

## 1.9.1 – 14.10.2026 (`16a0dec`)

- Przywrócona piosenka „Plamy na słońcu” w wersji Kazika (to inny utwór niż piosenka Klinczu).

## 1.9.2 – 14.10.2026 (`5ff183a`)

- „Szklana pogoda” – 1983; piosenki Lombardu z rokiem pierwszego wydania, bez późniejszych wersji jako osobnych kart.

## 1.9.3 – 14.10.2026 (`b989e98`)

- „Agnieszka już dawno…” – jedna karta zespołu Łzy z rokiem pierwszego wydania.

## 2.0.0 – 14.10.2026 (`692cfce`) – nowe tryby i aplikacja

- **Tryb ekspert**: kartę zatrzymuje się tylko z poprawnym miejscem i podanym tytułem, wykonawcą i/lub rokiem.
- **Drużyny** ze wspólną osią; członkowie odpowiadają po kolei.
- **Melodia krok po kroku**: 1 → 2 → 4 → 8 s, punkty 4/3/2/1, podpowiedź z pierwszą literą.
- **Zestawy tematyczne** (m.in. Trójka, Opole, Eurowizja, muzyka filmowa) i własne zestawy ustawień.
- **Aplikacja (PWA)**: instalacja na telefonie i komputerze, działanie bez sieci (poza fragmentami).
- Przeciąganie karty na oś palcem lub myszą, animacje, dźwięki efektów.

## 2.1.0 – 14.10.2026 (`bc5c741`)

- Zestaw „Eurowizja”: 254 piosenki (było 16) – zwycięzcy, polskie występy i najbardziej znane piosenki konkursu.
  Razem 5685 piosenek.

## 3.0.0 – 14.10.2026 (`ee9bbba`) – duży ekran, statystyki, kolejne tryby

- Nowe tryby: **Na czas** (ranking rekordów), **Starsza czy nowsza?**, **Pojedynek dekad**, **Kto pierwszy?**.
- **Karty specjalne**: podwójna, kradzież żetonu, zamiana osi.
- **Moje statystyki**: skuteczność w dekadach i gatunkach, mylone piosenki, historia rekordów, wykres postępów.
- **Ciekawostki** po odkryciu karty (Eurowizja, Lista Przebojów Trójki, Opole, Billboard, nr 1 w Polsce).
- **Duży ekran** (TV / rzutnik) w drugim oknie na tym samym komputerze; okno gry jest pilotem.
- Anonimowe statystyki odwiedzin (Umami, bez ciasteczek).

## 3.1.0 – 14.10.2026 (`ad3c9b4`)

- **Wersja angielska** całego interfejsu z przełącznikiem w ustawieniach (domyślnie wg języka przeglądarki).

## 3.1.1 – 14.10.2026 (`6b26ee7`)

- Usunięte zestawy: disco polo, złote przeboje, polskie lata 80. i 90., nowości.

## 3.2.0 – 14.10.2026 (`90ca2ba`)

- 65 nowych piosenek z Eurowizji (polskie występy 1994–2026, playlisty eurowizyjne) – razem **5750**.
- Ciekawostki o Eurowizji Junior i odwołanym konkursie 2020 (COVID-19).

## 3.3.0 – 14.10.2026 (`094871b`)

- Duży ekran: karta „?” w wybranym miejscu, znaczniki pomyłki, wszystkie osie bez przewijania, przypomnienie o wyzwaniu.
- Kupno karty przed odkryciem – na oś trafia grana piosenka; po odkryciu – losowa karta z talii.
- Pominięcie piosenki najpierw pokazuje, co to był za utwór.

## 3.4.0 – 14.10.2026 (`a2633d8`)

- Duży ekran: przyciski akcji z gry widoczne i klikalne, skalowanie całego widoku do okna, wyniki tylko przy osiach.

## 3.5.0 – 14.10.2026 (`d3d11e8`)

- Duży ekran zoptymalizowany do rozdzielczości 4K (czcionki, karty, okładki w wyższej rozdzielczości).

## 3.6.0 – 14.10.2026 (`0109cc4`)

- **Jedno pole odpowiedzi** na tytuł i wykonawcę z podpowiedziami ze wszystkich piosenek (od 3 liter), we wszystkich trybach.
- „Kto pierwszy?”: każdy gracz może przypisać sobie własny klawisz.

## 3.6.1 – 14.10.2026 (`aa1a35e`)

- Podpowiedzi zależne od tego, co się zgaduje (same tytuły, sami wykonawcy albo piosenki).
- Ujednolicona pisownia wykonawców (m.in. Urszula Sipińska, Tadeusz Woźniak, Łucja Prus, Céline Dion).

## 3.6.2 – 14.10.2026 (`60fb891`)

- Po wyborze podpowiedzi na ekranie dotykowym chowa się klawiatura.

## 3.6.3 – 14.10.2026 (`bb4bb04`)

- Anna Wyszkoni – „Czy ten pan i pani”: rok 2009, kraj PL, gatunek pop/rock.

## 3.6.4 – 14.10.2026 (`1699c07`)

- Listę podpowiedzi można przewijać palcem; wybór dopiero po stuknięciu.

## 3.6.5 – 14.10.2026 (`37eac63`)

- Lista podpowiedzi nie znika na telefonach przy utracie fokusu – zamyka ją wybór, Esc albo dotknięcie poza nią.

## 3.7.0 – 14.10.2026 (`f4beaa9`)

- „Posłuchaj całości” na Androidzie otwiera od razu aplikację YouTube, Spotify albo Apple Music.

## 3.8.0 – 14.10.2026 (`1317e22`)

- Trzy ikonki serwisów (YouTube, Spotify, Apple Music) zamiast linku „Posłuchaj całości”; bez wyboru serwisu w ustawieniach.

## 3.8.1 – 14.10.2026 (`f235c31`)

- Ikonki serwisów na Androidzie otwierają aplikację w tej samej karcie (poprawka dla przeglądarki Brave).

## 4.0.0 – 14.10.2026 (`0648f80`) – telewizor przez sieć i telefony graczy

- **Telewizor przez sieć**: duży ekran na telewizorze lub innym komputerze, połączenie kodem albo kodem QR.
- **Gracze na własnych telefonach**: pokój z kodem QR, widok gracza z osią, przyciskami i odpowiedzią.
- Duży ekran: kroki, przyciski graczy, kręcąca się płyta i pasek postępu.
- Płynne wyciszanie początku i końca fragmentów.
- Ekran nie gaśnie w trakcie gry.
- Tryb na czas: zegar startuje od pierwszego dźwięku; opcja automatycznego odtwarzania.
- Poprawione błędne przypisanie gatunku „disco polo”.

## 4.0.1 – 14.10.2026 (`5fdc9e5`)

- Ikonki serwisów w Brave na Androidzie jako zwykłe linki (Brave nie obsługuje linków do aplikacji).

## 4.1.0 – 14.10.2026 (`09005a0`)

- Przycisk „📱 Dołącz przez telefon” przy liście graczy; domyślnie jeden gracz na liście.
- Do **16 graczy** (16 kolorów i klawiszy w „Kto pierwszy?”).

## 4.2.0 – 15.10.2026 (`ffc69ce`)

- „Kto pierwszy?” na telefonie: duże pola graczy na cały ekran (górna połowa obrócona), bez klawiszy.

## 4.3.0 – 15.10.2026 (`7815f9b`)

- Połączenia przez serwer pośredniczący (MQTT), gdy bezpośrednie połączenie (WebRTC) zawodzi.
- Osobny, pionowy widok telefonu gracza.
- Telewizor: kod QR obok dużego, kontrastowego kodu; telefon podaje adres strony do otwarcia na telewizorze.
- Do **16 drużyn**.

## 4.4.0 – 15.10.2026 (`9f69825`)

- Telewizor od razu pokazuje kod QR i wraca do niego po utracie połączenia; telefon sam łączy się ponownie po przeładowaniu.
- Telewizor na każdym etapie: „Telefon połączony”, ustawienia gry z opcjami i dużym kodem QR do dołączania, rozgrywka, koniec.
- Nowy wygląd rozgrywki na telewizorze (margines na overscan, większe karty).

## 4.5.0 – 15.10.2026 (`03fa5d9`)

- Wybór, gdzie gra muzyka: na tym urządzeniu, na dużym ekranie albo na telefonie gracza, który ma turę.

## 5.0.0 – 15.10.2026 (`a994870`) – jeden gracz / multiplayer i impreza

- Ekran startowy: **Jeden gracz** albo **Multiplayer**.
- Multiplayer: **lobby** z listą graczy i kodem QR, potem **wybór trybu z głosowaniem** na telefonach (decyduje gospodarz).
- Nowy tryb **Impreza – minigry**: seria krótkich minigier z różnych trybów, punkty za miejsca (dla jednej osoby – suma wyników).
- Po grze w multiplayerze: jeszcze raz ten sam tryb i ustawienia, inny tryb albo menu główne (rozłączenie graczy).
- „Starsza czy nowsza?” dla kilku graczy (po kolei, pomyłka nie kończy gry).
- Szybsze dołączanie telefonem (oba rodzaje połączenia naraz – ok. 2 s).
- Poprawka: ekran wpisywania imienia na telefonie nie znika już po kilku sekundach.

## 5.0.1 – 15.10.2026 (`2d9dd23`)

- Duży ekran bez przycisku „Dotknij, aby włączyć dźwięk”: gdy przeglądarka blokuje dźwięk, muzyka gra od razu
  u gospodarza, a pierwsze naciśnięcie przycisku pilota przenosi ją na telewizor.

## 5.1.0 – 15.10.2026 (`bd1cda2`)

- W multiplayerze odtwarzaniem steruje gracz, który odpowiada – przycisk ▶/⏸ na jego telefonie.

## 5.2.0 – 15.10.2026 (`37916d5`)

- Przycisk „wstecz” w górnym pasku na każdym ekranie menu; działa też systemowe „wstecz” telefonu.

## 5.3.0 – 15.10.2026 (`02e7c35`)

- Telefony graczy: podgląd na żywo osi gracza, który odpowiada, z zaznaczonym miejscem (pomaga zdecydować o wyzwaniu).

## 5.4.0 – 15.10.2026 (`d69e357`)

- Telefon gracza w jego turze wygląda jak ekran gospodarza.
- Poprawka: przycisk odtwarzania na początku tury pokazuje „▶ Odtwórz”, a nie „⏸ Pauza”.

## 5.4.1 – 15.10.2026 (`c874026`)

- Poprawki przycisku ▶ na telefonie gracza: stuknięcie nie ginie przy odświeżeniu ekranu, informacja o blokadzie
  dźwięku u gospodarza, muzyka u gospodarza, gdy telefon nie może jej odtworzyć.

## 5.5.0 – 15.10.2026 (`f65e57f`)

- Telefon gracza zawsze w układzie gospodarza: karta tury, podgląd osi odpowiadającego, własna oś, osie pozostałych
  graczy i flagi na kartach.

## 5.5.1 – 15.10.2026 (`b7922dc`)

- Układ gospodarza na telefonie gracza we wszystkich trybach; poprawki dla „Starsza czy nowsza?”, „Melodii krok po
  kroku” i drużyn.

## 5.6.0 – 15.10.2026 (`550247e`)

- Wyzwanie z telefonu: kto stuknie „⚔ Wyzwanie”, od razu jest wyzywającym; pole roku albo oś z miejscami „＋”
  pojawia się na jego telefonie. Miejsce na osi gra przyjmuje tylko od właściwego gracza.

## 5.7.0 – 15.10.2026 (`59f4aa6`)

- Duży ekran sam się odświeża, gdy ma starszą wersję gry niż gospodarz; gospodarz łączy się z telewizorem ponownie.
- Wygląd dużego ekranu spójny z gospodarzem: karta tury, kafelki trybów z opisami, podsumowanie z listą piosenek.
- Głosy na tryb zostają do startu gry.

## 5.7.1 – 15.10.2026 (`73980ab`)

- Dodana ta historia zmian (`CHANGELOG.md`).

## 5.7.2 – 15.10.2026 (`HASH`)

- Dla twórców: automatyczne testy gry w repozytorium (Playwright, bez łączenia z iTunes – fragmenty podstawiane
  w teście), osobne testy telefonów i dużego ekranu przez sieć, sprawdzanie kodu (ESLint) i uruchamianie wszystkiego
  przy każdej zmianie na GitHubie.
- Poprawki drobnych usterek w kodzie wykrytych przez ESLint (bez zmian w działaniu gry).
