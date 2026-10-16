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

## 5.7.2 – 15.10.2026 (`24ed88b`)

- Dla twórców: automatyczne testy gry w repozytorium (Playwright, bez łączenia z iTunes – fragmenty podstawiane
  w teście), osobne testy telefonów i dużego ekranu przez sieć, sprawdzanie kodu (ESLint) i uruchamianie wszystkiego
  przy każdej zmianie na GitHubie.
- Poprawki drobnych usterek w kodzie wykrytych przez ESLint (bez zmian w działaniu gry).

## 5.8.0 – 15.10.2026 (`7c52f02`)

- Szybsze i pewniejsze wczytywanie fragmentów: zapytania do iTunes idą przez kolejkę pilnującą limitu (najwyżej
  18 na minutę) z przerwą po odmowie serwera, znalezione adresy fragmentów są zapamiętywane w przeglądarce na 30 dni,
  a w trakcie gry kilka piosenek z puli jest wyszukiwanych na zapas. Nieaktualny zapamiętany adres jest wyszukiwany od nowa.
- Lżejsze pierwsze ładowanie: identyfikatory utworów Spotify (do ikonki Spotify) są w osobnym pliku wczytywanym w tle –
  baza piosenek do pobrania na starcie jest o ok. 35% mniejsza.
- „Fragment z losowego miejsca” widoczny tylko wtedy, gdy działa – przy fragmencie krótszym niż 30 s (przy „30 s (cały)”
  nie ma się gdzie przesunąć) oraz w trybach z krokami.
- „Muzyka gra na” pokazuje się tylko, gdy jest podłączony duży ekran albo (w multiplayerze) telefon gracza – i tylko
  z dostępnymi w danej chwili możliwościami.
- Usunięty gatunek disco polo (5 piosenek; „Wyglądasz idealnie” Skolima jest teraz bez gatunku).

## 5.9.0 – 15.10.2026 (`573179a`)

- **Wznowienie przerwanej gry**: po każdym ruchu gra zapisuje się w przeglądarce urządzenia gospodarza. Po
  przeładowaniu, zamknięciu karty albo zgaszeniu telefonu ekran startowy proponuje „▶ Wznów grę” (przez 12 godzin).
  Wracają gracze, osie, punkty, żetony, tura, talia (bez zagranych piosenek) i postęp imprezy; tura zaczyna się od nowej
  piosenki. W multiplayerze pokój otwiera się z tym samym kodem – telefony wracają przyciskiem „↻ Dołącz ponownie”
  albo same, jeśli połączenie przez serwer pośredniczący się nie zerwało.
- Zapis znika po zakończeniu gry albo po wyjściu z niej do menu.

## 5.10.0 – 15.10.2026 (`e5fce6c`)

- **Stan połączenia telefonów** u gospodarza: przy graczach w lobby i na pasku nad grą widać „📱 połączony”,
  „🐢 słabe połączenie” albo „📵 rozłączony” (z podpowiedzią, że na telefonie wystarczy stuknąć „↻ Dołącz ponownie”).
  Telefony odpowiadają na sygnał obecności co 4 s, z czego gospodarz mierzy opóźnienie.
- **Uczciwy „Kto pierwszy?”**: zgłoszenia z telefonów są zbierane przez krótką chwilę (opóźnienie najwolniejszego
  telefonu + 80 ms, najwyżej 0,6 s) i wygrywa to, które po odjęciu opóźnienia sieci danego telefonu było najwcześniejsze.
  Bez telefonów zgłoszenie działa od razu.

## 5.11.0 – 15.10.2026 (`aa619fb`)

- Cztery nowe tryby w grupie **Quizy** (dla jednej osoby i w multiplayerze):
  - **📅 Rok co do roku** – wpisujesz rok wydania; dokładnie – 3 pkt, do 2 lat różnicy – 1 pkt
    (na telefonie gracza z turą pojawia się pole roku),
  - **🎙️ Kto to śpiewa?** – czterech wykonawców do wyboru (podobne lata i ta sama kategoria polska/zagraniczna),
  - **🌍 Skąd jest wykonawca?** – cztery kraje z flagami do wyboru,
  - **💰 Licytacja** – start z 5 pkt; przed odpowiedzią stawiasz 1–3 pkt, potem wskazujesz dekadę
    (dobrze – zyskujesz stawkę, źle – tracisz).
- Rok co do roku, Kto to śpiewa? i Skąd jest wykonawca? są też minigrami w trybie Impreza.

## 5.12.0 – 15.10.2026 (`be589e1`)

- Nowy tryb **🤝 Współpraca** (multiplayer, od 2 osób): wszyscy razem przeciw grze – wspólna oś czasu, wspólne
  pomyłki i cel kart; gracze odpowiadają po kolei (także z telefonów).
- **🏆 Liga wieczoru**: w lobby multiplayera każda kolejna gra dodaje punkty za miejsca (3/2/1, remis – tyle samo,
  wynik 0 – bez punktów); łączna tabela jest na podsumowaniu, na dużym ekranie i na telefonach. Liga zeruje się po
  wyjściu z lobby do menu głównego.

## 5.13.0 – 15.10.2026 (`1db52f3`)

- Nowy tryb **📆 Wyzwanie dnia** (jeden gracz): 10 znanych piosenek – ten sam zestaw dla wszystkich danego dnia
  (losowanie zależne tylko od daty). Wpisujesz rok wydania (dokładnie – 3 pkt, do 2 lat różnicy – 1 pkt), na koniec
  wynik z kwadracikami 🟩🟨⬛ i przycisk „📤 Udostępnij wynik”. Liczy się pierwsze podejście danego dnia.

## 5.14.0 – 15.10.2026 (`abbb45f`)

- Nowy tryb **🔢 Ułóż piątkę** (jeden gracz i multiplayer): 5 fragmentów po 10 s (każdy z własnym przyciskiem ▶ A–E)
  do ułożenia od najstarszego do najnowszego w 90 sekund od pierwszego odtworzenia. Za każdą dobrze ułożoną sąsiednią
  parę 1 pkt i 1 pkt premii za całą piątkę (do 5 pkt); po czasie sprawdzana jest bieżąca kolejność.

## 5.15.0 – 15.10.2026 (`dd1761e`)

- Nowy tryb **🟩 Bingo muzyczne** (jeden gracz i multiplayer): każdy gracz ma planszę 3×3 z kategoriami (dekady,
  gatunki, kraje, polska/zagraniczna, przed 1980 r., od 2000 r., duet). Przy każdej piosence zaznacza jedno pole, które
  według niego pasuje – po odkryciu trafione pola zostają skreślone (1 pkt). Trzy w linii to BINGO i koniec gry;
  inaczej po ustalonej liczbie piosenek wygrywa najwięcej skreśleń. Plansze widać u gospodarza i na dużym ekranie,
  a gracz z telefonem zaznacza pola na swojej planszy na telefonie.

## 5.16.0 – 15.10.2026 (`d960b0b`)

- Nowy wariant wyzwania w osi czasu: **„Wszyscy naraz – kartę bierze pierwszy trafny”**. Wyzwanie może rzucić kilka
  osób (każda płaci 1 żeton), każda wskazuje swoje miejsce – także równocześnie na swoich telefonach. Jeśli gracz z turą
  się pomyli, kartę zabiera ta osoba, która pierwsza wskazała dobre miejsce; po odkryciu widać wynik każdego wyzywającego.

## 5.17.0 – 15.10.2026 (`81a1feb`)

- **✨ Najciekawsze momenty** na podsumowaniu gry (też na dużym ekranie i telefonach): najdłuższa seria trafień,
  najcelniejszy gracz, karty przejęte w wyzwaniach, trafienia co do roku, największa pomyłka w „Rok co do roku”,
  najstarsza i najnowsza piosenka gry.
- **Drużyny w multiplayerze**: gracze widoczni jako przyciski w drużynach – stuknij gracza, a potem drużynę
  (albo przeciągnij), oraz „🎲 Losuj drużyny”.
- **Ustawienia imprezy**: długość minigier (krótkie / średnie / długie – więcej piosenek, kart i czasu) oraz punktacja
  w multiplayerze: za miejsca (3/2/1) albo suma punktów z minigier.

## 5.18.0 – 15.10.2026 (`68bcf8a`)

- **📋 Własna lista piosenek** (ustawienia gry → Piosenki): wklejasz piosenki linia po linii („wykonawca – tytuł”
  w dowolnej kolejności, także z tabulatorem lub średnikiem z arkusza), gra dopasowuje je do piosenek z bazy
  i zapisuje jako zestaw. Piosenki spoza bazy są wypisane (dopasowanie tylko do bazy, bo tam lata wydania są sprawdzone).
  Gra z własnej listy nie zawęża jej poziomem trudności.

## 5.19.0 – 15.10.2026 (`615f3ca`)

- Nowe **ciekawostki o nagrodach** po odkryciu karty (38 piosenek): Oscar i Złoty Glob za piosenkę, Grammy (w tym
  piosenka i nagranie roku), Grammy Hall of Fame, Latin Grammy – z Wikidata, tylko wpisy z datą przyznania, z dopiskiem
  „wg Wikidata”. Lista z odnośnikami do źródeł: `AWARDS.md` (generuje ją `tools/awards.mjs`). Nagrody są pokazywane
  przed innymi ciekawostkami.

## 5.19.1 – 15.10.2026 (`49e887c`)

- Dla twórców: okresowe sprawdzanie bazy – skrypt `tools/check-previews.mjs` sprawdza w iTunes porcję piosenek
  (tym samym sposobem co gra, z limitem zapytań) i zapisuje raport piosenek bez fragmentu w `PREVIEW-REPORT.md`;
  na GitHubie uruchamia się codziennie (150 piosenek dziennie).

## 5.19.2 – 15.10.2026 (`b4c7fab`)

- Poprawka: zmiana roku lub kraju w ustawieniach („Poprawki dat”) mogła zgłaszać błąd przy przejściu do kolejnego pola
  – lista odświeża się teraz po zakończeniu edycji.
- Dla twórców: kod gry podzielony z jednego pliku `game.js` na moduły w katalogu `js/` (rdzeń, ekrany, telefony, lobby,
  ustawienia gry, rozgrywka, zasady, dźwięk, wyświetlanie, ustawienia, tryby, listy, statystyki, wznawianie);
  nowe testy: wersja angielska i edytor dat. Wersja dla dużego ekranu podniesiona – starsze strony same się odświeżą.

## 5.20.0 – 15.10.2026 (`e1c75f3`)

- **Ułóż piątkę** – nowy wygląd: fragmenty A–E są na liście, którą układa się przeciąganiem palcem lub myszą
  (za uchwyt ⠿), najstarszy u góry, najnowszy na dole. Każdy wiersz ma swój przycisk ▶ i strzałki ▲▼ do przesuwania
  o jedno miejsce. Ta sama lista jest na telefonie gracza z turą i na dużym ekranie.
- Poprawka: na początku nowej tury poprzednia piątka znika od razu – wcześniej dało się ją przestawiać, zanim wczytały się
  nowe fragmenty, i zmiany przepadały.
- Na dole ekranu startowego widać numer aktualnej wersji gry.

## 5.21.0 – 15.10.2026 (`9db2e44`)

- **Duży ekran na monitorach o innych proporcjach**: wielkość napisów i kart zależy teraz od obu wymiarów ekranu, a nie
  tylko od szerokości. Na monitorach ultraszerokich (21:9, 32:9) nic nie jest ucięte, a przy 32:9 treść jest wyśrodkowana
  i nie rozciąga się na całą szerokość. Na ekranach 4:3 i 5:4 lista trybów nie nachodzi na podpis.
- Duży ekran w pionie (obrócony monitor lub telewizor): kod QR i ustawienia gry są jeden pod drugim, a osie pozostałych
  graczy mają całą szerokość ekranu.

## 5.21.1 – 15.10.2026 (`a415648`)

- Poprawiona data piosenki „Tak mi źle – Tylko wróć” (Wojciech Gąssowski): 1966 zamiast 2015. Piosenka pochodzi
  z serialu „Wojna domowa” (odcinek „Młode talenty”, 1966); 2015 to rok późniejszej składanki.

## 5.22.0 – 15.10.2026 (`57e46ce`)

- **Więcej ciekawostek** po odkryciu karty – z Wikidata, z dokładnymi danymi: kompozytor i autor tekstu, film lub serial,
  w którym piosenka zabrzmiała (z rokiem), album z rokiem wydania, producent nagrania, utwór, na którym piosenka jest
  oparta; o wykonawcy: prawdziwe imię i nazwisko (przy pseudonimach), rok i miejsce urodzenia, rok i miejsce powstania
  zespołu. Ciekawostkę ma teraz 4864 z 5750 piosenek. Lista ze źródłami: `FACTS.md`.
- Przy karcie pokazuje się **jedna** ciekawostka, losowo wybrana spośród dostępnych – przy kolejnym spotkaniu tej samej
  piosenki może być inna.
- Ciekawostka o festiwalu w Opolu podaje też rok (np. LIII KFPP – 2016).
- Poprawiona data: Eugeniusz Bodo – „Umówiłem się z nią na dziewiątą”: 1937 (film „Piętro wyżej”) zamiast 2005.

## 5.22.1 – 15.10.2026 (`6985106`)

- Muzyka nie cichnie już po udzieleniu odpowiedzi – we wszystkich trybach (m.in. Kto to śpiewa?, Rok co do roku,
  Skąd jest wykonawca?, Licytacja, Starsza czy nowsza?, Pojedynek dekad, Kto pierwszy?, Melodia krok po kroku, Bingo,
  Ułóż piątkę) gra dalej do końca podglądu i zatrzymuje się dopiero przy przejściu do kolejnej piosenki.
  Dotyczy też muzyki grającej na dużym ekranie i na telefonie gracza.

## 5.22.2 – 15.10.2026 (`d111100`)

- Przycisk „Kup losową kartę” nazywa się teraz „Kup kartę”.

## 5.22.3 – 15.10.2026 (`ef3cb42`)

- Napis „🔈 Brak połączonego urządzenia – muzyka gra na tym telefonie.” nie pokazuje się, gdy nie jest podłączony żaden
  duży ekran (np. przy grze na jednym telefonie z zapamiętanym ustawieniem „muzyka gra na dużym ekranie”).

## 5.22.4 – 15.10.2026 (`1ade1d5`)

- Przycisk po odkryciu karty znów nazywa się „Kup losową kartę” (cofnięta zmiana z 5.22.2).

## 5.23.0 – 15.10.2026 (`d84552f`)

- **Bingo 4×4 i 5×5** – wybór planszy w ustawieniach gry (BINGO = cały wiersz, kolumna albo przekątna). Nowe kategorie
  na większe plansze: tytuł z jednego słowa, tytuł z co najmniej 4 słów, pięciolecia (np. lata 1985–1989), więcej krajów.
- **Pomijanie piosenek niecenzuralnych** – przełącznik w ustawieniach gry (przy poziomie trudności): bez piosenek
  oznaczonych przez wydawców jako „explicit” (tekst z przekleństwami, w dowolnym języku); w trakcie gry dodatkowo
  sprawdzane oznaczenie z Apple Music.
- **Ciekawostki zależne od zestawu**: w zestawie Eurowizja – o występie na Eurowizji, w Opolu – o festiwalu, w Przebojach
  Trójki – o Liście Przebojów, w muzyce filmowej – z jakiego filmu; we wszystkich piosenkach – losowa.
- Nowe rodzaje ciekawostek: występ w preselekcjach do Eurowizji (z rokiem i miejscem) oraz film/serial/gra, w którym
  piosenka zabrzmiała (m.in. ze ścieżek dźwiękowych filmów w Wikidata).

## 5.24.0 – 15.10.2026 (`0e121c1`)

- **Nowe tryby**: „Kto za tym stoi?” (pytania o autora tekstu, kompozytora, producenta, album, pochodzenie lub
  prawdziwe nazwisko wykonawcy), „Okładka z mgły” (najpierw rozmyta okładka bez dźwięku), „Krzywe zwierciadło”
  (fragment zza ściany, na helu, zwolniony albo od tyłu), „Mikser” (dwie piosenki naraz), a w multiplayerze
  „Licytacja sekund”, „Gorąca bomba” i „Ostatni na placu boju” (gra na serca).
- **Nowe karty specjalne**: 🛡️ tarcza (jednorazowa ochrona przed zamianą osi, kradzieżą żetonu i utratą karty przy
  wyzwaniu „dokładny rok”), 🌫️ mgła (do Twojej następnej tury inni nie widzą lat na Twojej osi), 🎯 złoty strzał
  (trafiony dokładny rok daje +2 żetony) i 🧲 magnes (dla gracza na ostatnim miejscu – dobre ułożenie daje darmową kartę).
- „Ułóż piątkę” to teraz lista, na której piosenki przeciąga się (albo przesuwa strzałkami ▲▼) – także na telefonie gracza.
- Muzyka gra po odpowiedzi aż do przejścia do następnej piosenki.
- Napis „Brak połączonego urządzenia” pojawia się tylko, gdy podłączony był duży ekran.
- Duży ekran dopasowuje się do nietypowych proporcji i rozdzielczości (np. monitory ultraszerokie).
- Aktualna wersja gry na dole ekranu startowego.
- Sprawdzone ponownie lata wszystkich piosenek według zasady „pierwsze wydanie tego wykonania albo pierwsze wykonanie
  w filmie/serialu” – poprawione 120 dat (m.in. „Tak mi źle” Wojciecha Gąssowskiego i „Umówiłem się z nią na
  dziewiątą” Eugeniusza Bodo) i kilka krajów wykonawców.
- Oznaczone piosenki niecenzuralne (dla opcji pomijania), lepsze ciekawostki – bez pomyłek z osobami o tym samym
  nazwisku; przy piosence pokazywana jest jedna ciekawostka.
- Poprawki stabilności połączenia z dużym ekranem i telefonami; zaktualizowane zasady gry i README.

## 5.24.1 – 15.10.2026 (`922fc71`)

- „Eldorado” to teraz jedna piosenka wykonawców sanah & Daria Zawiałow (wcześniej dwa osobne wpisy: osobno Darii
  Zawiałow i osobno sanah).
- Ujednolicony zapis wykonawców zapisanych na kilka sposobów, np. sanah, Kult, IRA, Wanda i Banda, Czesław Niemen,
  Stanisław Soyka, Ania Rusowicz, 2 plus 1, The Black Eyed Peas, Jay-Z, OutKast.
- Dodane brakujące polskie znaki w nazwach wykonawców (np. Halina Frąckowiak, Kalina Jędrusik, Bohdan Łazuka,
  Kabaret Starszych Panów, Świetliki) i w 54 tytułach (np. „Miłość jak ogień”, „Dziewczyna mojego chłopaka”,
  „Z każdym twym oddechem”, „Życie jak wino”).
- iPhone i iPad: na ekranie startowym jest przycisk „Zainstaluj Songstera na tym urządzeniu” – w Safari pokazuje,
  jak dodać grę do ekranu początkowego.

## 5.25.0 – 15.10.2026 (`22a1319`)

- **1110 nowych piosenek** z playlisty „spokojnie panowie” – polskie i zagraniczne przeboje, rap, muzyka z filmów
  i bajek (także polskie wersje piosenek z filmów Disneya). Lata sprawdzone: zgodne w co najmniej dwóch bazach
  (Spotify, MusicBrainz, Discogs) albo potwierdzone w Wikipedii; 9 piosenek bez pewnej daty nie zostało dodanych.
- 118 nowych piosenek z filmów, seriali i gier ma ciekawostkę, w czym zabrzmiały, i należy do muzyki filmowej.
- Nowe piosenki z polskich preselekcji do Eurowizji są w zestawie Eurowizja (np. Chrust – „Tempo”).
- Oznaczenia piosenek niecenzuralnych dla nowych piosenek (z Deezer i ze znacznika Spotify).
- Kolejne poprawki zapisu wykonawców i polskich znaków w tytułach (np. „Zaopiekuj się mną”, „Się ściemnia”).

## 5.26.0 – 15.10.2026 (`e35f06d`)

- **Nowy zestaw „😂 Memy”** – 660 piosenek znanych z internetowych memów: polskie przeboje i disco polo, rap, hity
  z TikToka, EDM, motywy z gier, anime i filmów, utwory Kevina MacLeoda i muzyka klasyczna.
- 200 z nich to nowe piosenki w bazie; lata sprawdzone w Wikipedii, Know Your Meme i innych źródłach (piosenki bez
  pewnej daty nie zostały dodane).
- Przy 104 piosenkach ciekawostka, z jakiego memu pochodzą (ze źródłem), pokazywana w pierwszej kolejności
  w zestawie Memy.
- Część nowych piosenek trafiła też do zestawów Opole i Eurowizja (np. Blue Café – „You May Be in Love”
  z polskich preselekcji 2003).
- Poprawione lata: Alice Deejay – „Better Off Alone” (1998), Daft Punk – „Around the World” (1997),
  Vicetone & Tony Igy – „Astronomia” (2014).

## 5.26.1 – 15.10.2026 (`bde27f9`)

- Ciekawostki z Wikidata (kompozytor, autor tekstu, album, film, o wykonawcy) także dla nowych piosenek – teraz
  przy 1764 piosenkach i 1863 wykonawcach (wcześniej 1525 i 1659).

## 5.27.0 – 15.10.2026 (`d32111b`)

- **Nowy tryb „Tak to leciało!”** (na razie ukryty – kafelek pojawi się, gdy będzie gotowy katalog polskich piosenek
  z tekstem i filmem): 9 kategorii po 2 piosenki i narzucony finał, drabinka 500 zł → 100 000 zł z progami
  gwarantowanymi, koła ratunkowe (trzy słowa, wymiana piosenki, trzy wersje wersu, w multiplayerze sufler), piosenka
  z YouTube od początku z tekstem jak w karaoke, puste pola na brakujące słowa, odpowiedź wpisana albo zaśpiewana.
  W multiplayerze gracze grają po kolei, a odpowiedź i podpowiedź suflera można wpisać na telefonie; duży ekran
  pokazuje drabinkę i tekst.
- Poprawiony niestabilny test wyzwania „wszyscy naraz” z telefonów.

## 5.28.0 – 15.10.2026 (`b3bd9ed`)

- **„Tak to leciało!” jest już w grze** – katalog ma 88 polskich piosenek z tekstem z czasami wersów (lrclib.net)
  i filmem na YouTube (osadzalnym i niezablokowanym w Polsce, o długości zgodnej z nagraniem). Kolejne piosenki
  będą dochodzić w następnych dniach (limit wyszukiwań YouTube).
- Gdy film albo tekst nie działa, a w kategorii nie ma już drugiej piosenki, gra bierze inną piosenkę z katalogu
  (zamiast wracać do planszy z pustą kategorią).
- Narzędzie katalogu: przy limicie zapytań YouTube nie oznacza piosenek jako „bez filmu”, robi przerwy między
  wyszukiwaniami, a piosenki bez filmu sprawdza ponownie najwcześniej po 30 dniach (zmiany z sesji pomocniczej:
  `1863a8d`, `c689c90`, `a27bbfc`).

## 5.29.0 – 15.10.2026 (`49deac6`)

- **Tak to leciało! – nowa plansza:** każdy gracz ma 3×3 kategorie z samymi nazwami (zagrane zostają wyszarzone
  i niedostępne), a nad nimi szeroki kafelek „Hit za 100 000 zł”, dostępny dopiero na końcu – wtedy grasz albo
  rezygnujesz z 50 000 zł.
- Do uzupełnienia jest zawsze **cały wers, który wcześniej w piosence nie padł** (z etapem rośnie liczba słów
  i przerwa wypada dalej w piosence).
- Poprawione wyświetlanie pustych pól, gdy luka obejmuje dwa wersy (zamiast pól pojawiał się napis
  „[object HTMLBRElement]”).
- Piosenka może mieć kilka filmów: gdy jeden nie działa, gra od razu próbuje następnego, a niedziałające zapamiętuje
  na tym urządzeniu i pomija w kolejnych grach. Katalog bierze tylko filmy z tytułem tej piosenki (koniec z
  „Małomiasteczkowym” zamiast „Trójkątów i kwadratów”) i bez tekstu na ekranie; zostały 44 piosenki – kolejne
  będą dochodzić.
- Więcej kategorii (m.in. Jedzenie i picie, W drodze, Uczucia, Sny i marzenia, Pory roku, Muzyka, Jednym słowem,
  Złote przeboje, gatunki), a kategorie z ostatnich gier są losowane rzadziej.
- Kafelek „Tak to leciało!” jest duży, pod „Imprezą”.
- **Impreza:** nowe minigry – „Tak to leciało!” (piosenka od zwrotki lub refrenu z wersem do uzupełnienia, 1 pkt
  za dobrą odpowiedź), Mikser, Ułóż piątkę, Licytacja sekund, Gorąca bomba i Ostatni na placu boju.
- Katalog: tylko filmy z oficjalnych kanałów i sprawdzenie wszystkich zapisanych filmów (zmiana z sesji pomocniczej:
  `5d3a7d9`).

## 5.29.1 – 15.10.2026 (`70f843b`)

- Tak to leciało!: szybszy start piosenki – film zaczyna się ładować od razu po wyborze (tekst dochodzi w trakcie),
  teksty piosenek z planszy pobierają się w tle, zanim gracz coś wybierze, a przeglądarka wcześniej łączy się
  z YouTube i lrclib.net.

## 5.30.0 – 16.10.2026 (`73c8e95`)

- **Tak to leciało! – nowa drabinka:** 500, 1000, 2000, 5000, 10 000 (kwota gwarantowana), 15 000, 25 000, 50 000,
  75 000 zł i finał za 100 000 zł. Przed finałem można zrezygnować i zabrać 50 000 zł; w finale nie ma kół
  ratunkowych (znikają z ekranu).
- Po wyborze kategorii zamiast kafelków pokazują się dwie piosenki z rokiem wydania; innej kategorii nie da się już
  wybrać. Rok wydania widać też przy granej piosence.
- Tekst jak w karaoke: na początku kilka pierwszych wersów, potem jeden wers poprzedni, bieżący i kolejne; na końcu
  ostatnie wersy. Przerwa jest zaskoczeniem – wers do uzupełnienia nie pojawia się wcześniej w podglądzie, a gra nie
  zapowiada, kiedy muzyka stanie. Muzyka staje też nieco wcześniej (nie słychać już pierwszego brakującego słowa).
- Odpowiedź wpisuje się w jedno pole; liczbę brakujących słów pokazują kropki, które zapełniają się przy pisaniu
  (odsłonięte słowa widać w kropkach).
- Po „Tak to leciało!” piosenka wraca o dwa wersy, a prawidłowy wers pojawia się słowo po słowie, gdy jest śpiewany.
- „Trzy wersje wersu”: podmienione słowa mają taką samą wielkość liter jak w prawdziwym wersie.
- Wyłączone napisy w odtwarzaczu YouTube.
- Przycisk „Zła wersja piosenki / błędy w tekście” – film nie wróci w kolejnych grach na tym urządzeniu.
- Kategoria „Tytuł po angielsku” nie łapie już polskich tytułów (np. „Sobie i wam”).
- Animacje planszy, wyboru piosenki, przewijania tekstu i odpowiedzi; na telefonie 100 000 zł jest zawsze szerokim
  polem na górze drabinki.
- Katalog: film z kanału „… – Topic” musi być kanałem wykonawcy tej piosenki (np. bez późniejszego nagrania Kombi
  Łosowski zamiast Kombi); dane skanu tekstów (`60e1d6c`, `29405ac`).

## 5.30.1 – 16.10.2026 (`8f67f3e`)

- Tak to leciało!: 100 000 zł jest wyśrodkowane w szerokim polu na górze drabinki.
- Nowe kategorie: Lato i wakacje, Młodość i szkoła, Kobieta, Mężczyzna, Polska i ojczyzna, Pieniądze, Ogień
  i światło, Kwiaty i drzewa, Wojna i pokój, Bóg i wiara, Telefon i technika, Alkohol.
- Katalog: nowe piosenki są dobierane tak, żeby w pierwszej kolejności uzupełnić kategorie, w których jest mało
  piosenek.

## 5.30.2 – 16.10.2026 (`3bd5ca1`)

- Tak to leciało!: przed finałem rezygnacja daje 75 000 zł (wygraną za 9. piosenkę), a pomyłka w finale – 50 000 zł.

## 5.30.3 – 16.10.2026 (`ead7fee`)

- Tak to leciało!: zgłoszenie „Zła wersja piosenki / błędy w tekście” można cofnąć tym samym przyciskiem, a w
  ustawieniach jest lista zgłoszonych piosenek z przyciskiem „Przywróć” (także dla zgłoszeń z wcześniejszych gier).
- Nowy nagłówek piosenki: kategoria i rok obok siebie (ten sam kolor), pod nimi tytuł i wykonawca w osobnych liniach.

## 5.30.4 – 16.10.2026 (`0a64842`)

- Tak to leciało!: bez napisu „Śpiewaj razem z tekstem” w trakcie piosenki; informacja o źródłach (lrclib.net,
  YouTube) przeniesiona na sam dół, pod koła ratunkowe.

## 5.30.5 – 16.10.2026 (`af70b02`)

- Tak to leciało!: koła ratunkowe są teraz przyciskami pod tekstem już w trakcie śpiewania (wtedy działa wymiana piosenki; odsłonięcie słowa i trzy wersje – przy przerwie).
- Przy odpowiedzi przycisk „Tak to leciało!” zajmuje całą szerokość, a pod nim są trzy koła ratunkowe.
- Źródła tekstu i filmu są na samym dole, pod kołami ratunkowymi.

## 5.31.0 – 16.10.2026 (`HASH`)

- Na czas: gra nie kończy się po zebraniu określonej liczby kart – trwa, aż minie czas. Gdy czas minie, piosenka milknie, ale bieżącą kartę można jeszcze ułożyć.
- Bingo muzyczne: bez limitu piosenek – gra trwa, aż ktoś skreśli cały wiersz, kolumnę albo przekątną (z ustawień zniknęło pole „Piosenek na gracza”).
