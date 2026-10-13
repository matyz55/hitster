# Weryfikacja lat wydania

Rok na karcie = rok **pierwszego wydania nagrania** danego wykonawcy (singiel lub album – co było wcześniej).

## Źródła

- **[Discogs](https://www.discogs.com/)** – wyszukiwanie wydań głównych (*master releases*) wykonawcy zawierających utwór, bez wydań nieoficjalnych (*Unofficial Release*), koncertowych (*live*, *koncert*, *unplugged*), wideo (VHS/DVD) i radiowych transkrypcji – rok na karcie dotyczy nagrania studyjnego. Wyszukiwarka Discogs bywa nieprecyzyjna, dlatego wydanie, które dawałoby wcześniejszy rok, jest dodatkowo sprawdzane **po trackliście** (czy naprawdę zawiera ten utwór tego wykonawcy).
- **MusicBrainz + Wikipedia** – ręczna weryfikacja piosenek z pierwszej wersji gry.
- **[MusicBrainz](https://musicbrainz.org/)** – daty oficjalnych wydań nagrania (bez bootlegów); rozstrzyga, gdy rok podaje tylko Spotify.
- **Spotify** – data wydania albumu z eksportu playlist (to rzeczywiste wydanie zawierające utwór, ale często reedycja lub składanka).

## Reguła wyboru roku

1. Rok = **najwcześniejsze potwierdzone wydanie** spośród: Discogs (po sprawdzeniu tracklisty), weryfikacji MusicBrainz + Wikipedia, daty ze Spotify.
2. Piosenki z rokiem tylko ze Spotify są dodatkowo sprawdzane w Discogs „od strony wykonawcy” – jego wydania od najstarszych, po trackliście, z tolerancją pisowni (np. „Rain Drops … Falling” = „Raindrops … Fallin’”).
3. Gdy nadal rok podaje tylko Spotify, rozstrzyga MusicBrainz: jeśli zna wcześniejsze oficjalne wydanie – bierzemy je; jeśli zgadza się z Discogs – bierzemy ten rok.
4. Gdy nie ma żadnego z powyższych – MusicBrainz.
5. Zgodnie z ustaleniem piosenka trafia do gry, jeśli rok podaje choć jedno źródło. Kolumna *Źródło* w tabeli pokazuje, które źródła podają ten sam rok. Każdą datę można poprawić w grze: **Ustawienia → Lata wydania piosenek**.

## Pozostałe dane

- **Kraj artysty (flaga)** – MusicBrainz (kraj lub obszar artysty; region typu „England” jest przeliczany na państwo), a gdy brak – [Wikidata](https://www.wikidata.org/) (kraj pochodzenia zespołu lub obywatelstwo, tylko gdy jednoznaczne). 🌍 = nie ustalono. Polska/zagraniczna = kraj artysty.
- **Ręczne poprawki kraju:** Ewa Farna – Polska (decyzja; w MusicBrainz: Czechy). Polscy wykonawcy automatycznie dopasowani do zagranicznych imienników, poprawieni po sprawdzeniu w MusicBrainz (*country:PL*): Tilt, MAFIA, Hurt, Feel, Jamal, VOX, Jacek Stachursky, ŁZY Adam Konkol; w Wikidacie: IRA, Ørganek | ØNA, Dwa plus Jeden, Muniek Staszczyk.
- **Kategoria „polskie” bez flagi** (żadne źródło nie podaje kraju, ale utwory są wyłącznie na polskich playlistach): Anna Wyszkoni, Antek Smykiewicz, Basia Stępniak-Wilk, Bluszcz, KARAŚ/ROGUCKI, KOSKA, Klincz, Maciek Czemplik, Marcelina, Wojciech Baranowski.
- **Gatunki** – kategorie gatunków i stylów z Discogs (np. styl z „Metal” → metal, Disco/Italo-Disco → disco), a gdy brak – gatunki ze Spotify.
- **Popularność** – wskaźnik popularności utworu w Spotify (0–100) z eksportu playlist.

## Podsumowanie

- piosenek w grze: **4038** (polskich: 1275, zagranicznych: 2763)
- bez żadnej daty (pominięte): 7
- covery zamiast oryginałów (pominięte): 5
- usunięte duplikaty: 3
- bez ustalonego kraju artysty: 82

| Źródło roku | Piosenek |
|---|---|
| Discogs + Spotify | 2062 |
| Discogs | 976 |
| Spotify + MusicBrainz | 371 |
| Spotify | 263 |
| MusicBrainz | 122 |
| Discogs + MusicBrainz+Wikipedia + Spotify | 96 |
| Discogs + MusicBrainz | 64 |
| Discogs + MusicBrainz+Wikipedia | 59 |
| MusicBrainz+Wikipedia | 12 |
| MusicBrainz+Wikipedia + Spotify | 8 |
| Ręczna poprawka (opis niżej) | 5 |

## Rozbieżności Discogs ↔ wcześniejsza weryfikacja (MusicBrainz + Wikipedia)

W grze użyto roku z Discogs. Jeśli uważasz, że poprzedni był lepszy – popraw go w ustawieniach gry.

| Wykonawca | Tytuł | Discogs | MB+Wikipedia | Wydanie w Discogs |
|---|---|---|---|---|
| The Killers | Mr. Brightside | 2001 | 2003 | The Killers - The Killers |

## Poprawki ręczne i z ponownego sprawdzenia

Piosenki, dla których rok ze Spotify okazał się datą reedycji – wcześniejsze wydanie znalezione w Discogs (po trackliście) lub zgłoszone przez użytkownika.

| Wykonawca | Tytuł | Rok | Źródło |
|---|---|---|---|
| Chłopcy z Placu Broni | O Ela! | 1993 | MusicBrainz – oficjalny album „Kocham Cię” (1993); w Discogs tylko wersja koncertowa z 2004 |
| KULT | Do Ani | 1986 | MusicBrainz – oficjalny singiel „Piloci / Do Ani” (1986); w Discogs na albumie „Kult” (1987) jako „O Ani” |
| Republika | Biała Flaga | 1991 | Discogs – najwcześniejsze wydanie płytowe (album „1991”); Wikipedia: nagranie radiowe 1982, MusicBrainz: demo 1981 |
| AC/DC | T.N.T. | 1975 | Discogs (ponowne sprawdzenie) – AC/DC - T.N.T. / „T.N.T.” |
| Sister Sledge | He's the Greatest Dancer | 1978 | Discogs (ponowne sprawdzenie) – Sister Sledge - He's The Greatest Dancer / We Are Family / „He's The Greatest Dancer” |
| Tavares | Heaven Must Be Missing An Angel - Pt. 1 | 1976 | Discogs (ponowne sprawdzenie) – Tavares - Sky-High! / „Heaven Must Be Missing An Angel” |
| Cinderella | Nobody's Fool | 1984 | Discogs (ponowne sprawdzenie) – Cinderella (3) - Shake Me! / Nobody's Fool / „Nobodys' Fool” |
| The Zombies | She's Not There | 1964 | Discogs (ponowne sprawdzenie) – The Zombies - She's Not There / „She's Not There” |
| Four Tops | Reach Out I'll Be There | 1966 | Discogs (ponowne sprawdzenie) – Four Tops - Reach Out I'll Be There / „Reach Out I'll Be There” |
| Kombi | Nasze rendez-vous | 1985 | Discogs (ponowne sprawdzenie) – Kombi - Kombi 4 / „Nasze Randez-Vous” |
| Al Green | Let's Stay Together | 1971 | Discogs (ponowne sprawdzenie) – Al Green - Let's Stay Together / Tomorrow's Dream / „Let's Stay Together” |
| B.J. Thomas | Rain Drops Keep Falling on My Head | 1969 | Discogs (ponowne sprawdzenie) – B.J. Thomas - Raindrops Keep Fallin' On My Head / „Raindrops Keep Fallin' On My Head” |
| Damien Rice | The Blower's Daughter | 2001 | Discogs (ponowne sprawdzenie) – Damien Rice - The Blowers Daughter / „The Blowers Daughter” |
| Guns N' Roses | Don't Cry | 1986 | Discogs (ponowne sprawdzenie) – Guns 'N' Roses* - Guns 'N' Roses / „Don't Cry” |
| Ray Wilson & Stiltskin | Inside | 1994 | Discogs – singiel Stiltskin „Inside” (1994); Ray Wilson był wokalistą Stiltskin |
| Tina Turner | What's Love Got to Do with It | 1984 | Discogs – album „Private Dancer” (1984), utwór na trackliście; wynik automatyczny (box set 1990) był błędny |
| Anna Jurksztowicz | Hej, man! | 1987 | Discogs (ponowne sprawdzenie) – Anna Jurksztowicz - Dziękuję, Nie Tańczę / „Hej, Man!” |
| Kalina Jedrusik | Bo we mnie jest seks | 1992 | Discogs (ponowne sprawdzenie) – Kalina Jędrusik - Kalinowe Serce / „Bo We Mnie Jest Sex ” |
| Nosowska | Na Całych Jeziorach Ty | 2008 | Discogs (ponowne sprawdzenie) – Nosowska* - Osiecka / „Na Całych Jeziorach Ty” |
| Nosowska | Kto? | 2011 | Discogs (ponowne sprawdzenie) – Nosowska* - 8 / „Kto?” |
| Nosowska | Uciekaj, Moje Serce | 2008 | Discogs (ponowne sprawdzenie) – Nosowska* - Osiecka / „Uciekaj, Moje Serce” |

## Usunięte duplikaty

| Pominięto | Zostaje |
|---|---|
| Edyta Geppert – Jaka róża taki czerń | Edyta Geppert – Jaka Róża Taki Cierń |
| Kool & The Gang – Celebration | Kool & the Gang – Celebration |
| Kat & Roman Kostrzewski – Łza dla cieniów minionych | KAT – Łza dla cieniów minionych |

## Pominięte – covery zamiast oryginałów

| Wykonawca | Tytuł |
|---|---|
| Magic Finger Project | Equinoxe Part Iv |
| Movie Sounds Unlimited | The World Is Not Enough |
| New Tribute Kings | Barcelona Originally Performed By Freddie Mercury & Montserrat Caballe |
| Studio Sunset | Sex Bomb - Tom Jones (Tribute) |
| Tohma Nitoube | Falling -Twin Peaks Theme- |

## Pominięte – brak daty w jakimkolwiek źródle

| Wykonawca | Tytuł |
|---|---|
| Robert Kasprzycki | Mam Wszystko Jestem Niczym |
| Robert Kasprzycki | Niebo Do Wynajêcia |
| Wanda i Banda | Hi-Fi Superstar |
| Łzy | Agnieszka już dawno tutaj nie mieszka |
| Doda | Nie daj się |
| Earth, Wind & Fire | September |
| Bob Marley & The Wailers | Could You Be Loved |

## Pełna lista

| Wykonawca | Tytuł | Rok | Źródło | Discogs | MusicBrainz | Spotify | Kraj |
|---|---|---|---|---|---|---|---|
| 10cc | Dreadlock Holiday | 1978 | Discogs + Spotify | 1978 | – | 1978 | GB |
| 10cc | Good Morning Judge | 1977 | Discogs + Spotify | 1977 | – | 1977 | GB |
| 10cc | I'm Not In Love | 1975 | Spotify + MusicBrainz | – | 1975 | 1975 | GB |
| 10cc | The Things We Do For Love | 1976 | Discogs | 1976 | – | 1977 | GB |
| 15 Minut Projekt & Bogusz Bilewski jr. | Soca | 2003 | Spotify + MusicBrainz | – | 2003 | 2003 | PL |
| 2Pac | Dear Mama | 1995 | Discogs + Spotify | 1995 | – | 1995 | US |
| 2Pac & Roger | California Love | 1995 | Discogs | 1995 | – | 1998 | US |
| 2Pac & Talent | Changes | 1998 | Discogs + Spotify | 1998 | – | 1998 | US |
| 3 Doors Down | Here Without You | 2002 | Discogs + Spotify | 2002 | – | 2002 | US |
| 4 Non Blondes | What's Up? | 1992 | MusicBrainz+Wikipedia + Spotify | – | 1992 | 1992 | US |
| 4GramY & Janusz Iwanski | Wielkie podzielenie | 2016 | Spotify | – | – | 2016 | ? |
| 5 Seconds of Summer | Youngblood | 2018 | Discogs + Spotify | 2018 | – | 2018 | AU |
| 50 Cent | In Da Club | 2003 | Discogs + Spotify | 2003 | – | 2003 | US |
| A Flock Of Seagulls | I Ran (So Far Away) | 1982 | Spotify + MusicBrainz | 1988 | 1982 | 1982 | GB |
| A Perfect Circle | Judith | 2000 | Discogs + Spotify | 2000 | – | 2000 | US |
| A Tribe Called Quest | Can I Kick It? | 1990 | Discogs + Spotify | 1990 | – | 1990 | US |
| A Tribe Called Quest | Electric Relaxation | 1993 | Discogs | 1993 | – | 1999 | US |
| a-ha | Crying in the Rain | 1990 | Discogs + Spotify | 1990 | – | 1990 | NO |
| a-ha | Hunting High and Low | 1985 | Discogs + Spotify | 1985 | – | 1985 | NO |
| a-ha | Lifelines | 2002 | Discogs + Spotify | 2002 | – | 2002 | NO |
| a-ha | Stay On These Roads | 1988 | Discogs | 1988 | – | 2017 | NO |
| a-ha | Summer Moved On | 2000 | Discogs + Spotify | 2000 | – | 2000 | NO |
| a-ha | Take On Me | 1984 | Discogs + MusicBrainz+Wikipedia | 1984 | 1984 | 1985 | NO |
| a-ha | The Sun Always Shines on T.V. | 1985 | Spotify + MusicBrainz | 1986 | 1985 | 1985 | NO |
| Aaliyah | Try Again | 2000 | Discogs | 2000 | – | 2001 | US |
| ABBA | Angeleyes | 1979 | Discogs + Spotify | 1979 | – | 1979 | SE |
| ABBA | Dancing Queen | 1976 | Discogs + MusicBrainz+Wikipedia + Spotify | 1976 | 1976 | 1976 | SE |
| ABBA | Gimme! Gimme! Gimme! (A Man After Midnight) | 1982 | Discogs + MusicBrainz | 1982 | 1982 | 1979 | SE |
| ABBA | Lay All Your Love On Me | 1980 | Discogs + Spotify | 1980 | – | 1980 | SE |
| ABBA | Mamma Mia | 1975 | Discogs + Spotify | 1975 | – | 1975 | SE |
| ABBA | Money, Money, Money | 1976 | Discogs + Spotify | 1976 | – | 1976 | SE |
| ABBA | SOS | 1975 | Discogs + Spotify | 1975 | – | 1975 | SE |
| ABBA | Super Trouper | 1980 | Discogs + Spotify | 1980 | – | 1980 | SE |
| ABBA | Take A Chance On Me | 1977 | Discogs + Spotify | 1977 | – | 1977 | SE |
| ABBA | The Day Before You Came | 1982 | Discogs + MusicBrainz | 1982 | 1982 | 1981 | SE |
| ABBA | The Winner Takes It All | 1980 | Discogs + Spotify | 1980 | – | 1980 | SE |
| ABBA | Voulez-Vous | 1979 | Discogs + Spotify | 1979 | – | 1979 | SE |
| ABBA | Waterloo | 1974 | Discogs + MusicBrainz+Wikipedia + Spotify | 1974 | 1974 | 1974 | SE |
| ABC | The Look Of Love, Pt.1 | 1982 | Spotify (MusicBrainz: 2023) | – | 2023 | 1982 | GB |
| ABC & Halina Frackowiak | Napisz proszę | 2021 | Spotify | – | – | 2021 | GB |
| Abradab & Gutek | Rapowe ziarno 2 (Szyderap) | 2004 | Discogs + Spotify | 2004 | – | 2004 | PL |
| AC/DC | Back In Black | 1980 | Discogs + Spotify | 1980 | – | 1980 | AU |
| AC/DC | For Those About to Rock (We Salute You) | 1981 | Discogs + Spotify | 1981 | – | 1981 | AU |
| AC/DC | Highway to Hell | 1979 | Discogs + MusicBrainz+Wikipedia + Spotify | 1979 | 1979 | 1979 | AU |
| AC/DC | T.N.T. | 1975 | Discogs (ponowne sprawdzenie) | 1975 | 1997 | 1976 | AU |
| AC/DC | Thunderstruck | 1990 | Discogs + Spotify | 1990 | – | 1990 | AU |
| AC/DC | Whole Lotta Rosie | 1977 | Discogs + Spotify | 1977 | – | 1977 | AU |
| AC/DC | You Shook Me All Night Long | 1980 | Discogs + Spotify | 1980 | – | 1980 | AU |
| Accept | Balls to the Wall | 1983 | Discogs + Spotify | 1983 | – | 1983 | DE |
| Accept | Metal Heart | 1985 | Discogs + Spotify | 1985 | – | 1985 | DE |
| Ace of Base | All That She Wants | 1992 | Discogs + MusicBrainz+Wikipedia | 1992 | 1992 | 1993 | SE |
| Ace of Base | The Sign | 1993 | Discogs + Spotify | 1993 | – | 1993 | SE |
| Adam Lambert | Whataya Want from Me | 2009 | Discogs + Spotify | 2009 | – | 2009 | US |
| Adamski & Seal | Killer | 1990 | Discogs + Spotify | 1990 | – | 1990 | GB |
| Adele | Easy On Me | 2021 | Discogs + Spotify | 2021 | – | 2021 | GB |
| Adele | Hello | 2015 | Discogs + Spotify | 2015 | – | 2015 | GB |
| Adele | Rolling in the Deep | 2010 | Discogs + MusicBrainz+Wikipedia | 2010 | 2010 | 2011 | GB |
| Adele | Set Fire to the Rain | 2011 | Discogs + Spotify | 2011 | – | 2011 | GB |
| Adele | Skyfall | 2012 | Discogs + Spotify | 2012 | – | 2012 | GB |
| Adele | Someone Like You | 2011 | Discogs + Spotify | 2011 | – | 2011 | GB |
| Adrian Gurvitz | Classic | 1982 | Discogs | 1982 | – | 2014 | GB |
| Aerosmith | Amazing | 1993 | Discogs + Spotify | 1993 | – | 1993 | US |
| Aerosmith | Crazy | 1993 | Discogs + Spotify | 1993 | – | 1993 | US |
| Aerosmith | Cryin' | 1993 | Discogs + Spotify | 1993 | – | 1993 | US |
| Aerosmith | Dream On | 1973 | Discogs + Spotify | 1973 | – | 1973 | US |
| Aerosmith | Dude (Looks Like A Lady) | 1987 | Discogs + Spotify | 1987 | – | 1987 | US |
| Aerosmith | I Don't Want to Miss a Thing | 1998 | Spotify + MusicBrainz | 2001 | 1998 | 1998 | US |
| Aerosmith | Janie's Got A Gun | 1989 | MusicBrainz (Spotify: 1994) | 2002 | 1989 | 1994 | US |
| Aerosmith | Rag Doll | 1987 | Discogs + Spotify | 1987 | – | 1987 | US |
| Afromental | Radio Song | 2009 | Spotify + MusicBrainz | – | 2009 | 2009 | PL |
| After Blues | Zobacz jak Pięknie | 2013 | Discogs + Spotify | 2013 | – | 2013 | PL |
| Agnieszka Chylińska | Kiedy powiem sobie dość | 2019 | Discogs + Spotify | 2019 | – | 2019 | PL |
| Agnieszka Chylińska | Kiedyś do Ciebie wrócę | 2022 | Discogs + Spotify | 2022 | – | 2022 | PL |
| Agnieszka Chylińska | Koła czasu | 2019 | Discogs + Spotify | 2019 | – | 2019 | PL |
| Agnieszka Chylińska | Królowa łez | 2016 | Discogs + Spotify | 2016 | – | 2016 | PL |
| Agnieszka Chylińska | Nie mogę Cię zapomnieć | 2009 | Discogs + Spotify | 2009 | – | 2009 | PL |
| Agnieszka Chylińska | Niekochana | 2019 | Discogs + Spotify | 2019 | – | 2019 | PL |
| Agnieszka Chylińska | Winna | 2004 | MusicBrainz (Spotify: 2005) | 2019 | 2004 | 2005 | PL |
| Agnieszka Chylińska | Znalazłam | 2019 | Discogs + Spotify | 2019 | – | 2019 | PL |
| Agressiva 69 | Egoisci | 2001 | Discogs + Spotify | 2001 | – | 2001 | PL |
| Air | Cherry Blossom Girl | 2004 | Discogs + Spotify | 2004 | – | 2004 | FR |
| Air & Beth Hirsch | All I Need | 1998 | Discogs + Spotify | 1998 | – | 1998 | FR |
| Airbag | Colours | 2009 | Discogs + Spotify | 2009 | – | 2009 | ES |
| Al Green | Let's Stay Together | 1971 | Discogs (ponowne sprawdzenie) | 1971 | 1975 | 1972 | US |
| Al Stewart | Time Passages | 1978 | Discogs | 1978 | – | 2021 | GB |
| Al Stewart | Year of the Cat | 1976 | Discogs | 1976 | – | 2003 | GB |
| Alabama 3 | Woke Up This Morning | 1997 | Discogs | 1997 | – | 2008 | GB |
| Alabama Shakes | Don't Wanna Fight | 2015 | Spotify + MusicBrainz | – | 2015 | 2015 | US |
| Alan Price | O Lucky Man! | 1975 | Discogs | 1975 | – | 2005 | GB |
| Alanis Morissette | Ironic | 1995 | Discogs + MusicBrainz+Wikipedia + Spotify | 1995 | 1995 | 1995 | CA |
| Alanis Morissette | Thank U | 1998 | Discogs + Spotify | 1998 | – | 1998 | CA |
| Alanis Morissette | You Oughta Know | 1995 | Discogs + Spotify | 1995 | – | 1995 | CA |
| Alannah Myles | Black Velvet | 1989 | Discogs + Spotify | 1989 | – | 1989 | CA |
| Alex Warren | Ordinary | 2025 | Discogs + Spotify | 2025 | – | 2025 | US |
| Alexandra Stan | Mr. Saxobeat | 2010 | Discogs | 2010 | – | 2011 | RO |
| Alibabki | Kwiat jednej nocy | 1994 | Discogs | 1994 | – | 2014 | PL |
| Alice Cooper | Poison | 1989 | Discogs + Spotify | 1989 | – | 1989 | US |
| Alice Cooper | School's Out | 1972 | Spotify (MusicBrainz: 1990) | 2006 | 1990 | 1972 | US |
| Alice In Chains | I Stay Away | 1994 | Discogs + Spotify | 1994 | – | 1994 | US |
| Alice In Chains | Man in the Box | 1990 | Discogs + Spotify | 1990 | – | 1990 | US |
| Alice In Chains | Nutshell | 1994 | Discogs + Spotify | 1994 | – | 1994 | US |
| Alice In Chains | Rooster | 1992 | Discogs + Spotify | 1992 | – | 1992 | US |
| Alice In Chains | Would? | 1992 | Discogs + Spotify | 1992 | – | 1992 | US |
| Alice In Chains | Your Decision | 2009 | Discogs + Spotify | 2009 | – | 2009 | US |
| Alicia Keys | Empire State of Mind (Part II) Broken Down | 2009 | Discogs + Spotify | 2009 | – | 2009 | US |
| Alicia Keys | Fallin' | 2001 | Discogs + Spotify | 2001 | – | 2001 | US |
| Alicia Keys | Girl on Fire | 2012 | Discogs + Spotify | 2012 | – | 2012 | US |
| Alicja Majewska | Jeszcze się tam żagiel bieli | 1987 | Discogs | 1987 | – | 2014 | PL |
| Alicja Majewska | Odkryjemy miłość nieznaną | 1987 | Discogs | 1987 | – | 2016 | PL |
| All Saints | Pure Shores | 2000 | Discogs + Spotify | 2000 | – | 2000 | GB |
| Allman Brothers Band | Jessica | 1973 | Discogs | 1973 | – | 1989 | US |
| Aloe Blacc | I Need A Dollar | 2010 | Discogs + Spotify | 2010 | – | 2010 | US |
| Alphaville | Big In Japan | 1984 | Discogs + Spotify | 1984 | – | 1984 | DE |
| Alphaville | Forever Young | 1984 | Discogs + Spotify | 1984 | – | 1984 | DE |
| Alphaville | Sounds Like A Melody | 1984 | Discogs + Spotify | 1984 | – | 1984 | DE |
| Alphaville | The Jet Set | 1984 | Discogs + Spotify | 1984 | – | 1984 | DE |
| America & George Martin | A Horse with No Name | 1971 | Discogs | 1971 | – | 1972 | US |
| America & George Martin | Ventura Highway | 1972 | Discogs + Spotify | 1972 | – | 1972 | US |
| Amii Stewart | Knock on Wood | 1978 | Discogs | 1978 | – | 2024 | US |
| Amy Macdonald | This Is The Life | 2007 | Discogs + Spotify | 2007 | – | 2007 | GB |
| Amy Winehouse | Back To Black | 2006 | Discogs + Spotify | 2006 | – | 2006 | GB |
| Amy Winehouse | Rehab | 2006 | Discogs + MusicBrainz+Wikipedia + Spotify | 2006 | 2006 | 2006 | GB |
| Amy Winehouse | You Know I'm No Good | 2006 | Spotify + MusicBrainz | 2018 | 2006 | 2006 | GB |
| Anastacia | I'm Outta Love | 1999 | Spotify (MusicBrainz: 2000) | – | 2000 | 1999 | US |
| Anastacia | Left Outside Alone | 2004 | Discogs + Spotify | 2004 | – | 2004 | US |
| Andrea Bocelli & Sarah Brightman | Time To Say Goodbye | 1996 | Discogs + Spotify | 1996 | – | 1996 | IT |
| Andrzej Dabrowski | Do zakochania jeden krok | 1997 | Discogs | 1997 | – | 2016 | PL |
| Andrzej Dabrowski | Przygoda z Marią | 1997 | Discogs | 1997 | – | 2015 | PL |
| Andrzej Dabrowski | Zielono Mi | 1997 | Discogs | 1997 | – | 2015 | PL |
| Andrzej i Eliza | Czas relaksu | 1974 | Discogs + Spotify | 1974 | – | 1974 | PL |
| Andrzej Piaseczny | Chodz, przytul, przebacz | 2009 | Discogs + Spotify | 2009 | – | 2009 | PL |
| Andrzej Piaseczny | Śniadanie do łóżka | 2018 | Discogs + MusicBrainz | 2018 | 2018 | 2010 | PL |
| Andrzej Piaseczny & Krzysztof Krawczyk | Przytul Mnie Życie | 2008 | MusicBrainz (Spotify: 2016) | – | 2008 | 2016 | PL |
| Andrzej Piaseczny & Robert Chojnacki | Niecierpliwi | 1995 | Spotify (MusicBrainz: 2008) | 2018 | 2008 | 1995 | PL |
| Andrzej Sikorowski | Ballada o ciotce Matyldzie | 2010 | Spotify + MusicBrainz | – | 2010 | 2010 | PL |
| Andrzej Sikorowski | Nie Przenoście Nam Stolicy Do Krakowa | 2007 | Discogs | 2007 | – | 2010 | PL |
| Andrzej Sikorowski & Pod Budą | Bardzo smutna piosenka retro | 2007 | Discogs | 2007 | – | 2012 | PL |
| Andrzej Zaucha | Byłaś serca biciem | 1989 | Discogs | 1989 | – | 2004 | PL |
| Andrzej Zaucha | C'est la vie - Paryż z pocztówki | 1987 | MusicBrainz (Spotify: 2014) | – | 1987 | 2014 | PL |
| Andrzej Zaucha | Księżniczka mego serca | 1991 | MusicBrainz (Spotify: 2012) | – | 1991 | 2012 | PL |
| Andrzej Zaucha & Anawa | Abyś czuł | 2004 | MusicBrainz (Spotify: 2014) | – | 2004 | 2014 | PL |
| Andrzej Zaucha & Anawa | Ta wiara | 2004 | MusicBrainz (Spotify: 2014) | – | 2004 | 2014 | PL |
| Andrzej Zaucha & Anawa | Tańcząc w powietrzu | 2004 | MusicBrainz (Spotify: 2014) | – | 2004 | 2014 | PL |
| Andy Gibb | Shadow Dancing | 1978 | Discogs | 1978 | – | 1991 | AU |
| Andy Williams | Where Do I Begin | 1971 | Discogs + Spotify | 1971 | – | 1971 | US |
| Aneka | Japanese Boy | 1981 | Discogs + Spotify | 1981 | – | 1981 | GB |
| Angie Stone | Wish I Didn't Miss You | 2001 | Spotify + MusicBrainz | – | 2001 | 2001 | US |
| Ania Dąbrowska | Charlie, Charlie | 2004 | Discogs + Spotify | 2004 | – | 2004 | PL |
| Ania Dąbrowska | Jeszcze ten jeden raz | 2012 | Discogs | 2012 | – | 2013 | PL |
| Ania Dąbrowska | Nieprawda | 2016 | Discogs + Spotify | 2016 | – | 2016 | PL |
| Ania Dąbrowska | Nigdy wiecej nie tancz ze mna | 2008 | Discogs + Spotify | 2008 | – | 2008 | PL |
| Ania Dąbrowska | Porady Na Zdrady [Dreszcze] | 2017 | Discogs + Spotify | 2017 | – | 2017 | PL |
| Ania Dąbrowska | Tego chcialam | 2004 | Discogs + Spotify | 2004 | – | 2004 | PL |
| Ania Dąbrowska | Trudno mi się przyznać | 2006 | Discogs + Spotify | 2006 | – | 2006 | PL |
| Ania Dąbrowska | W Glowie | 2016 | Discogs + Spotify | 2016 | – | 2016 | PL |
| Ania Dąbrowska | Z Tobą Nie Umiem Wygrać | 2017 | Discogs + Spotify | 2017 | – | 2017 | PL |
| Ania Karwan | Słucham Cię w radiu co tydzień | 2019 | Spotify + MusicBrainz | – | 2019 | 2019 | PL |
| Ania Karwan | W to mi graj | 2025 | Spotify | – | – | 2025 | PL |
| Anita Baker | Sweet Love | 1986 | Discogs + Spotify | 1986 | – | 1986 | US |
| Anita Lipnicka | Historia jednej miłości | 1998 | Discogs + Spotify | 1998 | – | 1998 | PL |
| Anita Lipnicka | I wszystko się może zdarzyć | 1996 | Discogs | 1996 | – | 2014 | PL |
| Anita Lipnicka | Piosenka księżycowa (prod. Kuba Karaś) | 2019 | Spotify | – | – | 2019 | PL |
| Anita Lipnicka | Piękna i rycerz | 1996 | Discogs | 1996 | – | 2014 | PL |
| Anita Lipnicka | Tokyo | 2024 | Spotify | – | – | 2024 | PL |
| Anita Lipnicka & John Porter | Bones of Love | 2003 | Discogs + Spotify | 2003 | – | 2003 | PL |
| Anita Lipnicka & The Hats | Ptasiek | 2016 | Spotify | 2019 | – | 2016 | PL |
| Anita Ward | Ring My Bell | 1979 | Discogs | 1979 | – | 2005 | US |
| Anna German & Marta Majek | Człowieczy Los | 1983 | Discogs | 1983 | – | 2021 | PL |
| Anna Jantar | Moje jedyne marzenie | 1980 | Discogs + Spotify | 1980 | – | 1980 | PL |
| Anna Jantar | Najtrudniejszy pierwszy krok | 1973 | Discogs + MusicBrainz | 1973 | 1973 | 1974 | PL |
| Anna Jantar | Nic nie może wiecznie trwać | 1980 | Discogs + Spotify | 1980 | – | 1980 | PL |
| Anna Jantar | Radość najpiękniejszych lat | 1977 | Discogs + Spotify | 1977 | – | 1977 | PL |
| Anna Jantar | Staruszek świat | 1976 | Discogs | 1976 | – | 2016 | PL |
| Anna Jantar | Tyle słońca w całym mieście | 1974 | Discogs + MusicBrainz+Wikipedia + Spotify | 1974 | 1974 | 1974 | PL |
| Anna Jantar | Wielka dama tańczy sama | 1980 | Discogs + Spotify | 1980 | – | 1980 | PL |
| Anna Jantar | Żeby szczęśliwym być | 1974 | Discogs + Spotify | 1974 | – | 1974 | PL |
| Anna Jurksztowicz | Hej, man! | 1987 | Discogs (ponowne sprawdzenie) | 1987 | 1988 | 2003 | PL |
| Anna Jurksztowicz | Stan pogody | 1987 | Discogs | 1987 | – | 2003 | PL |
| Anna Maria Jopek | Ale Jestem | 1997 | Discogs | 1997 | – | 2003 | PL |
| Anna Maria Jopek | Ja Wysiadam | 1999 | Discogs | 1999 | – | 2014 | PL |
| Anna Maria Jopek | Laura i Filon | 2011 | Discogs + Spotify | 2011 | – | 2011 | PL |
| Anna Maria Jopek | Szepty i Lzy | 2000 | Discogs + Spotify | 2000 | – | 2000 | PL |
| Anna Rusowicz & Adam Nowak | Trudne życzenia | 2016 | Spotify | – | – | 2016 | ? |
| Anna Szałapak | Grajmy Panu | 1999 | Discogs | 1999 | – | 2014 | PL |
| Anna Wyszkoni | Czy Ten Pan I Pani | 2021 | Spotify | – | – | 2021 | ? |
| Anna Wyszkoni | Wiem, że jesteś tam | 2011 | Spotify | – | – | 2011 | ? |
| Anna Wyszkoni | Z Ciszą Pośród Czterech Ścian | 2021 | Spotify | – | – | 2021 | ? |
| Annie Lennox | No More "I Love You's" | 1995 | Discogs + Spotify | 1995 | – | 1995 | GB |
| Annie Lennox | Walking on Broken Glass | 1992 | Discogs + Spotify | 1992 | – | 1992 | GB |
| Annie Lennox | Why | 1992 | Discogs + Spotify | 1992 | – | 1992 | GB |
| Antek Smykiewicz | Fotografie | 2026 | Spotify | – | – | 2026 | ? |
| Antek Smykiewicz | Pomimo Burz | 2016 | Discogs + Spotify | 2016 | – | 2016 | ? |
| Antonina Krzyszton | Perłowa łódź | 1993 | Discogs | 1993 | – | 2013 | PL |
| Antony and the Johnsons & ANOHNI | Hope There's Someone | 2005 | Spotify (MusicBrainz: 2006) | – | 2006 | 2005 | US |
| Aphex Twin | Windowlicker | 1999 | Discogs + Spotify | 1999 | – | 1999 | GB |
| Aphrodite's Child | End Of The World | 1968 | Discogs | 1968 | – | 1990 | GR |
| Apollo 440 | Ain't Talkin' 'Bout Dub | 1996 | MusicBrainz (Spotify: 1997) | – | 1996 | 1997 | GB |
| Apollo 440 | Stop the Rock | 1999 | Discogs + MusicBrainz | 1999 | 1999 | 1998 | GB |
| Arab Strap | The First Big Weekend | 1996 | Discogs + Spotify | 1996 | – | 1996 | GB |
| Arcade Fire | Everything Now | 2017 | Discogs + Spotify | 2017 | – | 2017 | CA |
| Arcade Fire | Rebellion (Lies) | 2004 | Discogs + Spotify | 2004 | – | 2004 | CA |
| Arcade Fire | Reflektor | 2013 | Discogs + Spotify | 2013 | – | 2013 | CA |
| Arcade Fire | The Suburbs | 2010 | Discogs + Spotify | 2010 | – | 2010 | CA |
| Arcade Fire | Wake Up | 2004 | Discogs + Spotify | 2004 | – | 2004 | CA |
| Archive | Again | 2001 | Discogs | 2001 | – | 2002 | GB |
| Archive | Bullets | 2009 | Discogs + Spotify | 2009 | – | 2009 | GB |
| Archive | Lights | 2006 | Discogs + Spotify | 2006 | – | 2006 | GB |
| Arctic Monkeys | 505 | 2007 | Discogs | 2007 | – | 2020 | GB |
| Arctic Monkeys | Do I Wanna Know? | 2013 | Discogs + MusicBrainz+Wikipedia + Spotify | 2013 | 2013 | 2013 | GB |
| Arctic Monkeys | I Bet You Look Good On The Dancefloor | 2005 | Discogs | 2005 | – | 2020 | GB |
| Aretha Franklin | (You Make Me Feel Like) A Natural Woman | 1967 | Discogs | 1967 | – | 1968 | US |
| Aretha Franklin | Don't Play That Song | 1970 | Spotify + MusicBrainz | – | 1970 | 1970 | US |
| Aretha Franklin | I Say a Little Prayer | 1968 | Discogs + Spotify | 1968 | – | 1968 | US |
| Aretha Franklin | Jumpin' Jack Flash | 1986 | Discogs + Spotify | 1986 | – | 1986 | US |
| Aretha Franklin | Respect | 1967 | Discogs + MusicBrainz+Wikipedia + Spotify | 1967 | 1967 | 1967 | US |
| Aretha Franklin | Spanish Harlem | 1971 | Discogs | 1971 | – | 1994 | US |
| Aretha Franklin | Think | 1968 | Discogs + Spotify | 1968 | – | 1968 | US |
| Ariana Grande | we can't be friends (wait for your love) | 2024 | Spotify + MusicBrainz | – | 2024 | 2024 | US |
| Armani White | BILLIE EILISH. | 2022 | Discogs | 2022 | – | 2023 | US |
| Armia | Jeżeli | 1992 | Discogs | 1992 | – | 2007 | PL |
| Armia | Niezwyciężony | 1992 | Discogs | 1992 | – | 2013 | PL |
| Armia | Opowieść zimowa | 1991 | Discogs + Spotify | 1991 | – | 1991 | PL |
| Arrested Development | People Everyday | 1992 | Discogs + Spotify | 1992 | – | 1992 | US |
| ARS LATRANS Orchestra & Odet | Żebra | 2021 | Spotify + MusicBrainz | – | 2021 | 2021 | ? |
| Artemas | i like the way you kiss me | 2024 | Discogs + Spotify | 2024 | – | 2024 | GB |
| Artur Andrus | Glanki i pacyfki | 2012 | Discogs + Spotify | 2012 | – | 2012 | PL |
| Artur Andrus | Nazywali Go Marynarz – Szanta Narciarska | 2015 | Discogs + Spotify | 2015 | – | 2015 | PL |
| Artur Andrus | Piłem w Spale, spałem w Pile | 2012 | Discogs + Spotify | 2012 | – | 2012 | PL |
| Artur Rojek | Beksa | 2014 | Discogs + Spotify | 2014 | – | 2014 | PL |
| Artur Rojek | Bez końca | 2020 | Discogs + Spotify | 2020 | – | 2020 | PL |
| Artur Rojek | Chciałbym umrzeć z miłości | 2017 | Spotify + MusicBrainz | 2025 | 2017 | 2017 | PL |
| Artur Rojek | Długość dźwięku samotności | 2017 | Spotify + MusicBrainz | – | 2017 | 2017 | PL |
| Artur Rojek | Mirafiori | 2026 | Discogs + Spotify | 2026 | – | 2026 | PL |
| Artur Rojek | Syreny | 2014 | Discogs + Spotify | 2014 | – | 2014 | PL |
| Ascetoholix & Doniu | Suczki | 2003 | Discogs | 2003 | – | 2009 | PL |
| Asia | Heat Of The Moment | 1982 | Discogs + Spotify | 1982 | – | 1982 | GB |
| Asia | Only Time Will Tell | 1982 | Discogs + Spotify | 1982 | – | 1982 | GB |
| Audioslave | Be Yourself | 2005 | Discogs + Spotify | 2005 | – | 2005 | US |
| Audioslave | Like a Stone | 2002 | Discogs + Spotify | 2002 | – | 2002 | US |
| Audrey Hepburn | Moon River | 1993 | MusicBrainz (Spotify: 2014) | – | 1993 | 2014 | GB |
| Ava Max | Kings & Queens | 2020 | Discogs + Spotify | 2020 | – | 2020 | US |
| Average White Band | Pick up the Pieces | 1974 | Discogs + Spotify | 1974 | – | 1974 | GB |
| Avicii | Hey Brother | 2013 | Discogs + Spotify | 2013 | – | 2013 | SE |
| Avicii | Levels | 2011 | Discogs + Spotify | 2011 | – | 2011 | SE |
| Avicii | Wake Me Up | 2013 | Discogs + MusicBrainz+Wikipedia + Spotify | 2013 | 2013 | 2013 | SE |
| Avril Lavigne | Complicated | 2002 | Discogs + Spotify | 2002 | – | 2002 | CA |
| Avril Lavigne | Sk8er Boi | 2002 | Discogs + Spotify | 2002 | – | 2002 | CA |
| AWOLNATION | Sail | 2010 | Discogs | 2010 | – | 2011 | US |
| Axwell /\ Ingrosso | More Than You Know | 2017 | Discogs + Spotify | 2017 | – | 2017 | ? |
| Aya RL | Księżycowy Krok | 1986 | Discogs | 1986 | – | 1991 | PL |
| Aya RL | Skóra | 1985 | Spotify (MusicBrainz: 1991) | – | 1991 | 1985 | PL |
| Azyl P | Mała Maggie | 1985 | Discogs + MusicBrainz | 1985 | 1985 | 2014 | PL |
| B.B. King | The Thrill Is Gone | 1969 | Discogs + Spotify | 1969 | – | 1969 | US |
| B.J. Thomas | Rain Drops Keep Falling on My Head | 1969 | Discogs (ponowne sprawdzenie) | 1969 | – | 2019 | US |
| Babylon Zoo | Spaceman | 1995 | Discogs + MusicBrainz | 1995 | 1995 | 1996 | GB |
| Baccara | Yes Sir, I Can Boogie | 1977 | Discogs | 1977 | – | 1998 | ES |
| Bachman-Turner Overdrive | You Ain't Seen Nothing Yet | 1974 | Spotify + MusicBrainz | – | 1974 | 1974 | CA |
| Backstreet Boys | Everybody (Backstreet's Back) | 1997 | Spotify + MusicBrainz | – | 1997 | 1997 | US |
| Backstreet Boys | I Want It That Way | 1999 | Discogs + MusicBrainz+Wikipedia | 1999 | 1999 | – | US |
| Bad Boys Blue | I Wanna Hear Your Heartbeat (Sunday Girl) | 1986 | Discogs + Spotify | 1986 | – | 1986 | DE |
| Bad Boys Blue | You're a Woman | 1985 | Spotify + MusicBrainz | 2010 | 1985 | 1985 | DE |
| Bad Bunny | DtMF | 2025 | Discogs + Spotify | 2025 | – | 2025 | PR |
| Bad Bunny | Tití Me Preguntó | 2022 | Discogs + Spotify | 2022 | – | 2022 | PR |
| Badly Drawn Boy | Something to Talk About | 2002 | Discogs + Spotify | 2002 | – | 2002 | GB |
| Bajm | Biała armia | 1990 | Discogs + Spotify | 1990 | – | 1990 | PL |
| Bajm | Co mi Panie dasz | 1983 | Discogs | 1983 | – | 2018 | PL |
| Bajm | Dwa serca, dwa smutki | 1986 | Discogs | 1986 | – | 1997 | PL |
| Bajm | Jezioro szczęścia | 1988 | Discogs + MusicBrainz | 1988 | 1988 | 1987 | PL |
| Bajm | Krótka historia | 2008 | Discogs + Spotify | 2008 | – | 2008 | PL |
| Bajm | Lola | 2000 | Discogs + Spotify | 2000 | – | 2000 | PL |
| Bajm | Małpa i ja | 1985 | Discogs | 1985 | – | 1997 | PL |
| Bajm | Modlitwa o złoty deszcz | 2000 | Discogs + Spotify | 2000 | – | 2000 | PL |
| Bajm | Myśli i słowa | 2003 | Discogs + Spotify | 2003 | – | 2003 | PL |
| Bajm | Nie ma wody na pustyni | 1983 | Discogs | 1983 | – | 2018 | PL |
| Bajm | O Tobie | 2000 | Discogs + Spotify | 2000 | – | 2000 | PL |
| Bajm | Płynie w nas gorąca krew | 1986 | Discogs | 1986 | – | 2018 | PL |
| Bajm | Szklanka wody | 2000 | Discogs + Spotify | 2000 | – | 2000 | PL |
| Bajm | Ta sama chwila | 1993 | Discogs + Spotify | 1993 | – | 1993 | PL |
| bambi & Young Leosia | BFF | 2023 | Spotify + MusicBrainz | – | 2023 | 2023 | AR |
| Bananarama | Cruel Summer | 1983 | Discogs | 1983 | – | 1984 | GB |
| Bananarama | Venus | 1986 | Discogs + Spotify | 1986 | – | 1986 | GB |
| Banco De Gaia | Last Train to Lhasa | 1995 | Discogs + Spotify | 1995 | – | 1995 | GB |
| Band of Horses | The Funeral | 2006 | Spotify + MusicBrainz | – | 2006 | 2006 | US |
| Bandolier Kings | Zoom Club | 2019 | Spotify + MusicBrainz | 2020 | 2019 | 2019 | SE |
| Barbara Wrońska | Nie czekaj | 2018 | Spotify + MusicBrainz | – | 2018 | 2018 | PL |
| Barbra Streisand | Evergreen | 1976 | Discogs + Spotify | 1976 | – | 1976 | US |
| Barbra Streisand | The Way We Were | 1973 | Discogs | 1973 | – | 1974 | US |
| Barbra Streisand | Woman in Love | 1980 | Spotify + MusicBrainz | – | 1980 | 1980 | US |
| Barry Manilow | Copacabana (At the Copa) | 1978 | Discogs | 1978 | – | 2006 | US |
| Barry White | Can't Get Enough Of Your Love, Babe | 1974 | Spotify + MusicBrainz | 2007 | 1974 | 1974 | US |
| Barry White | I'm Gonna Love You Just A Little More Baby | 1973 | Spotify + MusicBrainz | – | 1973 | 1973 | US |
| Barry White | Never, Never Gonna Give Ya Up | 1973 | Discogs | 1973 | – | 1975 | US |
| Barry White | You See The Trouble With Me | 1976 | Discogs + Spotify | 1976 | – | 1976 | US |
| Barry White | You're The First, The Last, My Everything | 1974 | Discogs | 1974 | – | 1988 | US |
| Basement Jaxx | Where's Your Head At | 2001 | Spotify + MusicBrainz | – | 2001 | 2001 | GB |
| Basia | Copernicus | 1990 | Discogs + Spotify | 1990 | – | 1990 | US |
| Basia | Cruising For Bruising | 1990 | Discogs + Spotify | 1990 | – | 1990 | US |
| Basia | Dzien Sie Budzi | 1995 | Discogs + Spotify | 1995 | – | 1995 | US |
| Basia | New Day for You | 1987 | Discogs | 1987 | – | 1998 | US |
| Basia Stępniak-Wilk & Grzegorz Turnau | Bombonierka | 2005 | Spotify (MusicBrainz: 2009) | – | 2009 | 2005 | ? |
| Bass Astral x Igo | Juno | 2017 | Discogs + Spotify | 2017 | – | 2017 | ? |
| Bastille | Pompeii | 2013 | Discogs + Spotify | 2013 | – | 2013 | GB |
| Bat For Lashes | Daniel | 2009 | Discogs + Spotify | 2009 | – | 2009 | GB |
| Bauhaus | Bela Lugosi's Dead | 1985 | Discogs | 1985 | – | 2018 | GB |
| Bay City Rollers | Bye Bye Baby | 1975 | Discogs + Spotify | 1975 | – | 1975 | GB |
| bbno$ & Rich Brian | edamame | 2021 | Spotify + MusicBrainz | – | 2021 | 2021 | CA |
| Beastie Boys | (You Gotta) Fight For Your Right (To Party!) | 1987 | Discogs | 1987 | – | 2020 | US |
| Beastie Boys | Intergalactic | 1998 | Discogs + Spotify | 1998 | – | 1998 | US |
| Beastie Boys | Sabotage | 1994 | Discogs + Spotify | 1994 | – | 1994 | US |
| Beata Kozidrak | Siedzę i myślę | 1998 | Discogs + Spotify | 1998 | – | 1998 | PL |
| Beata Kozidrak | Żal mi tamtych nocy i dni | 1998 | Discogs + Spotify | 1998 | – | 1998 | PL |
| Beck | Loser | 1993 | Discogs | 1993 | – | 1994 | US |
| Becky Hill & David Guetta | Remember | 2021 | Discogs + Spotify | 2021 | – | 2021 | GB |
| Bee Gees | How Can You Mend A Broken Heart | 1971 | Discogs + Spotify | 1971 | – | 1971 | GB |
| Bee Gees | How Deep Is Your Love | 1977 | Discogs | 1977 | – | 1979 | GB |
| Bee Gees | Night Fever | 1977 | Discogs + Spotify | 1977 | – | 1977 | GB |
| Bee Gees | Stayin' Alive | 1977 | Discogs + MusicBrainz+Wikipedia + Spotify | 1977 | 1977 | 1977 | GB |
| Bee Gees | To Love Somebody | 1967 | Discogs + Spotify | 1967 | – | 1967 | GB |
| Bee Gees | Tragedy | 1979 | Discogs + Spotify | 1979 | – | 1979 | GB |
| Bee Gees | You Should Be Dancing | 1976 | Discogs | 1976 | – | 2009 | GB |
| Beirut | Postcards from Italy | 2006 | Discogs + Spotify | 2006 | – | 2006 | US |
| Belinda Carlisle | Heaven Is a Place on Earth | 1987 | Discogs + Spotify | 1987 | – | 1987 | US |
| Bemibem | Podaruj mi trochę słońca | 1974 | Discogs + Spotify | 1974 | – | 1974 | PL |
| Ben E. King | Stand by Me | 1961 | Discogs + MusicBrainz+Wikipedia | 1961 | 1962 | 1962 | US |
| BENEE & Gus Dapperton | Supalonely | 2019 | Spotify + MusicBrainz | 2020 | 2019 | 2019 | NZ |
| Benson Boone | Beautiful Things | 2024 | Discogs + Spotify | 2024 | – | 2024 | US |
| Benson Boone | Mystical Magical | 2025 | Discogs + Spotify | 2025 | – | 2025 | US |
| Berlin | Take My Breath Away | 1986 | Discogs | 1986 | – | 1999 | US |
| Betty Everett | It's In The Kiss (The Shoop Shoop Song) | 2010 | Spotify | – | – | 2010 | US |
| Beverley Craven | Promise Me | 1990 | Discogs + Spotify | 1990 | – | 1990 | GB |
| Beyoncé | Crazy in Love | 2003 | Discogs + MusicBrainz+Wikipedia + Spotify | 2003 | 2003 | 2003 | US |
| Beyoncé | Halo | 2008 | Discogs + Spotify | 2008 | – | 2008 | US |
| Beyoncé | If I Were a Boy | 2008 | Discogs + Spotify | 2008 | – | 2008 | US |
| Beyoncé | TEXAS HOLD 'EM | 2024 | Discogs + Spotify | 2024 | – | 2024 | US |
| Bianka Jackowska & Three Times Four | W Życiu Trzeba Zawsze Wolnym Być | 2016 | Spotify | – | – | 2016 | ? |
| Bibobit & Anna Rusowicz | Kropla | 2021 | Spotify | – | – | 2021 | PL |
| Bielizna | Stefan | 1988 | Discogs | 1988 | – | 2016 | PL |
| Biesiada | Zielone wzgórza nad Solina | 2011 | Spotify | – | – | 2011 | ? |
| Big Brother & The Holding Company & Janis Joplin | Piece of My Heart | 1968 | Discogs + Spotify | 1968 | – | 1968 | US |
| Big Cyc | Berlin Zachodni | 1990 | Discogs + Spotify | 1990 | – | 1990 | PL |
| Big Cyc | Berlin Zachodni 2011 | 2013 | Spotify + MusicBrainz | – | 2013 | 2013 | PL |
| Big Cyc | Makumba | 1996 | Discogs + Spotify | 1996 | – | 1996 | PL |
| Big Day | Przestrzeń | 1995 | Discogs + Spotify | 1995 | – | 1995 | PL |
| Big Day | W Dzień Gorącego Lata | 1997 | Discogs + Spotify | 1997 | – | 1997 | PL |
| Big Day | W Świetle I We Mgle | 1993 | Discogs + Spotify | 1993 | – | 1993 | PL |
| Big Scythe & Tymek | Język Ciała | 2018 | Spotify | – | – | 2018 | PL |
| Bijelo Dugme | Selma | 1974 | Discogs | 1974 | – | 1995 | YU |
| Bill Haley & His Comets | Rock Around The Clock | 1954 | Discogs | 1954 | – | 1968 | US |
| Bill Medley & Jennifer Warnes | (I've Had) The Time of My Life | 1987 | MusicBrainz (Spotify: 1988) | – | 1987 | 1988 | US |
| Bill Withers | Ain't No Sunshine | 1971 | Spotify + MusicBrainz | – | 1971 | 1971 | US |
| Bill Withers | Lovely Day | 1977 | Discogs + Spotify | 1977 | – | 1977 | US |
| Billie Eilish | bad guy | 2019 | Discogs + MusicBrainz+Wikipedia + Spotify | 2019 | 2019 | 2019 | US |
| Billie Eilish | BIRDS OF A FEATHER | 2024 | Discogs + Spotify | 2024 | – | 2024 | US |
| Billie Eilish | Happier Than Ever | 2021 | Discogs + Spotify | 2021 | – | 2021 | US |
| Billie Eilish | No Time To Die | 2020 | Discogs + Spotify | 2020 | – | 2020 | US |
| Billie Eilish | ocean eyes | 2016 | Discogs | 2016 | – | 2017 | US |
| Billie Eilish | What Was I Made For? | 2023 | Discogs + Spotify | 2023 | – | 2023 | US |
| Billie Eilish | when the party's over | 2018 | MusicBrainz (Spotify: 2019) | – | 2018 | 2019 | US |
| Billy Idol | Cradle Of Love | 1990 | Discogs + Spotify | 1990 | – | 1990 | GB |
| Billy Idol | Eyes Without A Face | 1983 | Discogs | 1983 | – | 2001 | GB |
| Billy Idol | Rebel Yell | 1983 | Discogs | 1983 | – | 2001 | GB |
| Billy Idol | White Wedding | 1982 | Discogs | 1982 | – | 1985 | GB |
| Billy Joel | Honesty | 1978 | Discogs + Spotify | 1978 | – | 1978 | US |
| Billy Joel | Just the Way You Are | 1977 | Discogs + Spotify | 1977 | – | 1977 | US |
| Billy Joel | My Life | 1978 | Discogs + Spotify | 1978 | – | 1978 | US |
| Billy Joel | Piano Man | 1973 | Discogs + Spotify | 1973 | – | 1973 | US |
| Billy Joel | She's Always a Woman | 1977 | Spotify + MusicBrainz | 2014 | 1977 | 1977 | US |
| Billy Joel | The River of Dreams | 1993 | Discogs + Spotify | 1993 | – | 1993 | US |
| Billy Joel | The Stranger | 1977 | Discogs + Spotify | 1977 | – | 1977 | US |
| Billy Joel | Turn the Lights Back On | 2024 | Spotify + MusicBrainz | – | 2024 | 2024 | US |
| Billy Joel | Uptown Girl | 1983 | Discogs | 1983 | – | 2001 | US |
| Billy Joel | Vienna | 1977 | Discogs + Spotify | 1977 | – | 1977 | US |
| Billy Joel | We Didn't Start the Fire | 1989 | Spotify + MusicBrainz | 2022 | 1989 | 1989 | US |
| Billy Ocean | Love Really Hurts Without You | 1975 | Discogs | 1975 | – | 1976 | GB |
| Billy Ocean | Red Light Spells Danger | 1977 | Discogs + MusicBrainz | 1977 | 1977 | 1976 | GB |
| Billy Preston | Nothing From Nothing | 1974 | Discogs + Spotify | 1974 | – | 1974 | US |
| Bing Crosby & Ken Darby Singers | White Christmas | 1942 | Discogs + Spotify | 1942 | – | 1942 | US |
| Bitamina | Dom | 2017 | Discogs + Spotify | 2017 | – | 2017 | PL |
| Bitamina | Niech no tylko zakwitną jabłonie | 2021 | Spotify | – | – | 2021 | PL |
| Bitamina | Pytanie do Niej | 2017 | Discogs + Spotify | 2017 | – | 2017 | PL |
| Björk | All Is Full Of Love | 1997 | Discogs | 1997 | – | 2002 | IS |
| Björk | Human Behaviour | 1993 | Discogs + Spotify | 1993 | – | 1993 | IS |
| Björk | It's Oh So Quiet | 1995 | Spotify + MusicBrainz | 2001 | 1995 | 1995 | IS |
| Björk | I’ve Seen It All | 2000 | Spotify + MusicBrainz | – | 2000 | 2000 | IS |
| Black | Wonderful Life | 1986 | Discogs | 1986 | – | 1987 | ? |
| Black Box | Ride on Time | 1989 | Discogs | 1989 | – | 2006 | IT |
| Black Eyed Peas | Meet Me Halfway | 2009 | Discogs + Spotify | 2009 | – | 2009 | US |
| Black Eyed Peas | Pump It | 2005 | Discogs + Spotify | 2005 | – | 2005 | US |
| Black Pumas | Colors | 2019 | Discogs + Spotify | 2019 | – | 2019 | US |
| Black Sabbath | Changes | 1972 | Discogs + Spotify | 1972 | – | 1972 | GB |
| Black Sabbath | Heaven and Hell | 1980 | Discogs + Spotify | 1980 | – | 1980 | GB |
| Black Sabbath | Iron Man | 1970 | Discogs + Spotify | 1970 | – | 1970 | GB |
| Black Sabbath | Paranoid | 1970 | Discogs + Spotify | 1970 | – | 1970 | GB |
| Black Sabbath | Sabbath Bloody Sabbath | 1973 | Discogs + Spotify | 1973 | – | 1973 | GB |
| Black Sabbath | War Pigs | 1970 | Discogs + Spotify | 1970 | – | 1970 | GB |
| blackbear | hot girl bummer | 2019 | Discogs | 2019 | – | 2020 | US |
| Blackfield | Blackfield | 2004 | Discogs + Spotify | 2004 | – | 2004 | GB |
| Blackfield | End of the World | 2007 | Discogs + Spotify | 2007 | – | 2007 | GB |
| Blenders | Biribomba | 1996 | Discogs + Spotify | 1996 | – | 1996 | PL |
| Blenders | Ciągnik | 1996 | Discogs + Spotify | 1996 | – | 1996 | PL |
| Bletka | Dwa dni | 2026 | Spotify + MusicBrainz | – | 2026 | 2026 | PL |
| Bletka | Komu miałabym powiedzieć? | 2025 | Spotify + MusicBrainz | – | 2025 | 2025 | PL |
| blink-182 | All The Small Things | 1999 | Discogs + Spotify | 1999 | – | 1999 | US |
| Bloc Party | Banquet | 2004 | Discogs | 2004 | – | 2005 | GB |
| Blondie | Call Me | 1980 | Discogs | 1980 | – | 1999 | US |
| Blondie | Heart of Glass | 1978 | Discogs + MusicBrainz+Wikipedia | 1978 | 1978 | 2006 | US |
| Blondie | Maria | 1998 | Discogs | 1998 | – | 2013 | US |
| Blondie | One Way Or Another | 1978 | Discogs + Spotify | 1978 | – | 1978 | US |
| Blondie | Rapture | 1980 | Discogs | 1980 | – | 2006 | US |
| Blood, Sweat & Tears | Hi-De-Ho | 1970 | Discogs + Spotify | 1970 | – | 1970 | US |
| Blood, Sweat & Tears | Lucretia Mac Evil | 1970 | Discogs + MusicBrainz | 1970 | 1970 | 1988 | US |
| Blood, Sweat & Tears | Spinning Wheel | 1969 | Discogs + MusicBrainz | 1969 | 1969 | 1968 | US |
| Bloodhound Gang | The Bad Touch | 1999 | Discogs + Spotify | 1999 | – | 1999 | US |
| Blue Cafe | Czas nie będzie czekał | 2008 | MusicBrainz (Spotify: 2017) | – | 2008 | 2017 | PL |
| Blue Cafe | Wina | 2011 | Discogs + Spotify | 2011 | – | 2011 | PL |
| Blue Swede & Björn Skifs | Hooked On A Feeling | 1974 | Discogs + Spotify | 1974 | – | 1974 | SE |
| Blue Öyster Cult | (Don't Fear) The Reaper | 1976 | Spotify (MusicBrainz: 1982) | 2020 | 1982 | 1976 | US |
| Blur | Girls & Boys | 1994 | Discogs | 1994 | – | 2000 | GB |
| Blur | Out of Time | 2003 | Discogs + Spotify | 2003 | – | 2003 | GB |
| Blur | Song 2 | 1997 | Discogs + Spotify | 1997 | – | 1997 | GB |
| Blur | Tender | 1999 | Discogs + Spotify | 1999 | – | 1999 | GB |
| Bluszcz | Lamparty | 2020 | Discogs + Spotify | 2020 | – | 2020 | ? |
| Bob Dylan | Blowin' in the Wind | 1963 | Discogs + Spotify | 1963 | – | 1963 | US |
| Bob Dylan | Hurricane | 1975 | Discogs | 1975 | – | 1976 | US |
| Bob Dylan | Knockin' On Heaven's Door | 1973 | Spotify + MusicBrainz | 2013 | 1973 | 1973 | US |
| Bob Dylan | Like a Rolling Stone | 1965 | Discogs + MusicBrainz+Wikipedia + Spotify | 1965 | 1965 | 1965 | US |
| Bob Dylan | Mr. Tambourine Man | 1965 | Discogs + Spotify | 1965 | – | 1965 | US |
| Bob Dylan | The Times They Are A-Changin' | 1964 | Discogs + Spotify | 1964 | – | 1964 | US |
| Bob Marley & The Wailers | Could You Be Loved | 1980 | Discogs + MusicBrainz+Wikipedia + Spotify | 1980 | 1980 | 1980 | JM |
| Bob Marley & The Wailers | Get Up, Stand Up | 1973 | Discogs + Spotify | 1973 | – | 1973 | JM |
| Bob Marley & The Wailers | I Shot The Sheriff | 1974 | Discogs | 1974 | – | 2003 | JM |
| Bob Marley & The Wailers | No Woman, No Cry | 1974 | Discogs | 1974 | – | 2002 | JM |
| Bob Marley & The Wailers | Redemption Song | 1980 | Discogs + Spotify | 1980 | – | 1980 | JM |
| Bobby Hebb | Sunny | 1966 | Discogs + Spotify | 1966 | – | 1966 | US |
| Bobby McFerrin | Don't Worry Be Happy | 1988 | MusicBrainz (Spotify: 1997) | – | 1988 | 1997 | US |
| Bobby Vinton | Blue Velvet | 1963 | Discogs | 1963 | – | 2004 | US |
| Bobby Vinton | My Melody Of Love | 1974 | Discogs | 1974 | – | 2006 | US |
| Bogusław Mec | Jej portret | 1979 | Discogs | 1979 | – | 2004 | PL |
| Bohdan Lazuka | Bo to się zwykle tak zaczyna | 1965 | Discogs | 1965 | – | 2016 | PL |
| Bomfunk MC's | Freestyler | 1999 | Discogs + Spotify | 1999 | – | 1999 | FI |
| Bon Iver | Skinny Love | 2007 | Discogs | 2007 | – | 2008 | US |
| Bon Jovi | Always | 1994 | Spotify + MusicBrainz | – | 1994 | 1994 | US |
| Bon Jovi | Bad Medicine | 1988 | Discogs + Spotify | 1988 | – | 1988 | US |
| Bon Jovi | It's My Life | 2000 | Discogs + Spotify | 2000 | – | 2000 | US |
| Bon Jovi | Keep The Faith | 1992 | Discogs + Spotify | 1992 | – | 1992 | US |
| Bon Jovi | Livin' on a Prayer | 1986 | Discogs + MusicBrainz+Wikipedia + Spotify | 1986 | 1986 | 1986 | US |
| Bon Jovi | Runaway | 1984 | Discogs + Spotify | 1984 | – | 1984 | US |
| Bon Jovi | Wanted Dead Or Alive | 1986 | Discogs + Spotify | 1986 | – | 1986 | US |
| Bon Jovi | You Give Love A Bad Name | 1986 | Discogs + Spotify | 1986 | – | 1986 | US |
| Boney M. | Bahama Mama | 1979 | Discogs | 1979 | – | 2012 | DE |
| Boney M. | Daddy Cool | 1976 | Discogs + Spotify | 1976 | – | 1976 | DE |
| Boney M. | Ma Baker | 1977 | Discogs + Spotify | 1977 | – | 1977 | DE |
| Boney M. | Rasputin | 1978 | Discogs + MusicBrainz+Wikipedia | 1978 | 1978 | 1984 | DE |
| Boney M. | Rivers of Babylon | 1978 | Discogs + Spotify | 1978 | – | 1978 | DE |
| Boney M. | Sunny | 1976 | Discogs + Spotify | 1976 | – | 1976 | DE |
| Bonnie Tyler | Holding Out for a Hero | 1984 | Discogs + Spotify | 1984 | – | 1984 | GB |
| Bonnie Tyler | It's a Heartache | 1977 | MusicBrainz (Spotify: 1978) | 1981 | 1977 | 1978 | GB |
| Bonnie Tyler | Total Eclipse of the Heart | 1983 | Discogs + MusicBrainz+Wikipedia | 1983 | 1983 | 2009 | GB |
| Booker T. & the M.G.'s | Green Onions | 1962 | Discogs + Spotify | 1962 | – | 1962 | US |
| Boston | More Than a Feeling | 1976 | Discogs + Spotify | 1976 | – | 1976 | US |
| Brainstorm | Maybe | 2001 | Discogs | 2001 | – | 2003 | DE |
| Bran Van 3000 | Astounded | 2001 | Discogs + Spotify | 2001 | – | 2001 | CA |
| Brathanki | Czerwone korale | 2000 | Discogs + MusicBrainz+Wikipedia | 2000 | 2000 | – | PL |
| Brathanki | Gdzie Ten, Ktory Powie Mi | 2000 | Discogs + Spotify | 2000 | – | 2000 | PL |
| Breakout | Co stało się kwiatom | 1971 | Discogs + Spotify | 1971 | – | 1971 | PL |
| Breakout | Gdybyś kochał, hej! | 1969 | Discogs + Spotify | 1969 | – | 1969 | PL |
| Breakout | Kiedy byłem małym chłopcem | 1971 | Discogs + Spotify | 1971 | – | 1971 | PL |
| Breakout | Modlitwa | 1974 | Discogs + Spotify | 1974 | – | 1974 | PL |
| Breakout | Na drugim brzegu tęczy | 1969 | Discogs + Spotify | 1969 | – | 1969 | PL |
| Breakout | Oni zaraz przyjdą tu | 1971 | Discogs + Spotify | 1971 | – | 1971 | PL |
| Breakout | Pomaluj moje sny | 1971 | Discogs + Spotify | 1971 | – | 1971 | PL |
| Breakout | Poszłabym za tobą | 1969 | Discogs + Spotify | 1969 | – | 1969 | PL |
| Breakout | Rzeka dzieciństwa | 1972 | Discogs + Spotify | 1972 | – | 1972 | PL |
| Breakout | W co mam wierzyć | 1971 | Discogs + Spotify | 1971 | – | 1971 | PL |
| Brenda Lee | I'm Sorry | 1960 | Spotify (MusicBrainz: 1972) | 2024 | 1972 | 1960 | US |
| Brian Hyland | Sealed With A Kiss | 1962 | Discogs | 1962 | – | 1993 | US |
| Brian May | Too Much Love Will Kill You | 1992 | Discogs | 1992 | – | 2021 | GB |
| Britney Spears | ...Baby One More Time | 1998 | Discogs + MusicBrainz+Wikipedia | 1998 | 1998 | 1999 | US |
| Britney Spears | Gimme More | 2007 | Discogs + Spotify | 2007 | – | 2007 | US |
| Britney Spears | Oops!...I Did It Again | 2000 | Spotify + MusicBrainz | – | 2000 | 2000 | US |
| Britney Spears | Stronger | 2000 | Discogs + Spotify | 2000 | – | 2000 | US |
| Britney Spears | Toxic | 2003 | Discogs + Spotify | 2003 | – | 2003 | US |
| Britney Spears | Work Bitch | 2013 | Spotify + MusicBrainz | – | 2013 | 2013 | US |
| Brodka | Dziewczyna Mojego Chlopaka | 2004 | Discogs + Spotify | 2004 | – | 2004 | PL |
| Brodka | Game Change | 2021 | Discogs + Spotify | 2021 | – | 2021 | PL |
| Brodka | Granda | 2010 | Discogs + MusicBrainz+Wikipedia + Spotify | 2010 | 2010 | 2010 | PL |
| Brodka | Horses | 2016 | Discogs + Spotify | 2016 | – | 2016 | PL |
| Brodka | Mial byc slub... | 2006 | Discogs + Spotify | 2006 | – | 2006 | PL |
| Brodka | Miales Byc | 2005 | Spotify + MusicBrainz | – | 2005 | 2005 | PL |
| Brodka | Ten | 2004 | Discogs + Spotify | 2004 | – | 2004 | PL |
| Brodka | Varsovie | 2012 | Discogs + Spotify | 2012 | – | 2012 | PL |
| Brodka | W pieciu smakach | 2010 | Discogs + Spotify | 2010 | – | 2010 | PL |
| Brodka | Znam cie na pamiec | 2006 | Discogs + Spotify | 2006 | – | 2006 | PL |
| Brodka & A_GIM | Wszystko czego dziś chcę (Z serialu Rojst na Showmax) | 2018 | Spotify | – | – | 2018 | PL |
| Bronski Beat | Smalltown Boy | 1984 | Discogs + Spotify | 1984 | – | 1984 | GB |
| Bruce Channel | Hey! Baby | 1962 | Discogs | 1962 | – | 2017 | US |
| Bruce Hornsby and the Range | The Way It Is | 1986 | Discogs + Spotify | 1986 | – | 1986 | US |
| Bruce Springsteen | Born in the U.S.A. | 1984 | Spotify (MusicBrainz: 2019) | – | 2019 | 1984 | US |
| Bruce Springsteen | Born to Run | 1975 | Discogs + Spotify | 1975 | – | 1975 | US |
| Bruce Springsteen | Dancing In the Dark | 1984 | Discogs + Spotify | 1984 | – | 1984 | US |
| Bruce Springsteen | I'm On Fire | 1984 | Spotify (MusicBrainz: 1985) | 1990 | 1985 | 1984 | US |
| Bruce Springsteen | Streets of Philadelphia | 1994 | Discogs + Spotify | 1994 | – | 1994 | US |
| Bruce Springsteen | The River | 1980 | Spotify (MusicBrainz: 1982) | – | 1982 | 1980 | US |
| Bruno Mars | Just the Way You Are | 2010 | Discogs + MusicBrainz+Wikipedia | 2010 | 2010 | – | US |
| Bruno Mars | Locked out of Heaven | 2012 | Discogs + Spotify | 2012 | – | 2012 | US |
| Bruno Mars & Anderson .Paak | Leave The Door Open | 2021 | Spotify + MusicBrainz | 2026 | 2021 | 2021 | US |
| Bryan Adams | (Everything I Do) I Do It For You | 1991 | Discogs + Spotify | 1991 | – | 1991 | CA |
| Bryan Adams | Do I Have To Say The Words? | 1991 | Discogs + Spotify | 1991 | – | 1991 | CA |
| Bryan Adams | Have You Ever Really Loved A Woman? | 1995 | Discogs | 1995 | – | 1996 | CA |
| Bryan Adams | Heaven | 1984 | Discogs + Spotify | 1984 | – | 1984 | CA |
| Bryan Adams | On A Day Like Today | 1998 | Discogs + Spotify | 1998 | – | 1998 | CA |
| Bryan Adams | Please Forgive Me | 1993 | Discogs | 1993 | – | 2005 | CA |
| Bryan Adams | Run To You | 1984 | Discogs + Spotify | 1984 | – | 1984 | CA |
| Bryan Adams | Summer of '69 | 1984 | Discogs + MusicBrainz+Wikipedia + Spotify | 1984 | 1984 | 1984 | CA |
| Bryan Adams & Sting | All For Love | 1993 | Discogs | 1993 | – | 2017 | CA |
| Bryan Ferry | Don't Stop The Dance | 1985 | Spotify + MusicBrainz | – | 1985 | 1985 | GB |
| Bryan Ferry | Slave To Love | 1985 | Discogs + Spotify | 1985 | – | 1985 | GB |
| Brygada Kryzys | Centrala | 1982 | Discogs | 1982 | – | 1999 | PL |
| Brygada Kryzys | To co czujesz, to co wiesz | 2000 | Spotify (MusicBrainz: 2004) | – | 2004 | 2000 | PL |
| BTS | Dynamite | 2020 | Discogs + Spotify | 2020 | – | 2020 | KR |
| Buddy Holly & The Crickets | That'll Be The Day | 1957 | Spotify (MusicBrainz: 1969) | 2009 | 1969 | 1957 | US |
| Budgie | I Turned To Stone | 1981 | Discogs | 1981 | – | 2019 | GB |
| Budgie | Parents | 1973 | Discogs | 1973 | – | 2019 | GB |
| Budka Suflera | Bal wszystkich świętych | 2000 | Discogs + Spotify | 2000 | – | 2000 | PL |
| Budka Suflera | Cień wielkiej góry | 1975 | Discogs | 1975 | – | 2010 | PL |
| Budka Suflera | Cisza jak ta | 1993 | Discogs | 1993 | – | 2010 | PL |
| Budka Suflera | Czas czekania, czas olśnienia | 1984 | Discogs | 1984 | – | 2010 | PL |
| Budka Suflera | Czas ołowiu | 1984 | Discogs | 1984 | – | 2000 | PL |
| Budka Suflera | Jest taki samotny dom | 1975 | Discogs | 1975 | – | 1998 | PL |
| Budka Suflera | Jolka Jolka pamiętasz | 1984 | Discogs | 1984 | – | 2000 | PL |
| Budka Suflera | Nie wierz nigdy kobiecie | 1982 | Discogs | 1982 | – | 2000 | PL |
| Budka Suflera | Ona przyszła prosto z chmur | 1980 | Discogs | 1980 | – | 2010 | PL |
| Budka Suflera | Sen o dolinie | 1984 | Discogs | 1984 | – | 1994 | PL |
| Budka Suflera | Takie tango | 1997 | Discogs + MusicBrainz+Wikipedia + Spotify | 1997 | 1997 | 1997 | PL |
| Budka Suflera | Za ostatni grosz | 1981 | Discogs + Spotify | 1981 | – | 1981 | PL |
| Buena Vista Social Club | Chan Chan | 1997 | Discogs | 1997 | – | 2021 | CU |
| Buffalo Springfield | For What It's Worth | 1966 | Spotify + MusicBrainz | 2000 | 1966 | 1966 | US |
| Buldog | Do prostego człowieka | 2012 | MusicBrainz (Spotify: 2013) | – | 2012 | 2013 | PL |
| Burial | Archangel | 2007 | Discogs + Spotify | 2007 | – | 2007 | GB |
| Busta Rhymes | Break Ya Neck | 2001 | Discogs + Spotify | 2001 | – | 2001 | US |
| Buzu Squat | Przebudzenie | 1993 | Discogs | 1993 | – | 1995 | PL |
| BØRNS | Electric Love | 2015 | Discogs + Spotify | 2015 | – | 2015 | US |
| Błażej Król | Głos wewnętrzny | 2020 | Spotify | – | – | 2020 | PL |
| Błażej Król | TAK JAK TY | 2021 | Discogs + Spotify | 2021 | – | 2021 | PL |
| Błażej Król | Te smaki i zapachy | 2019 | Discogs + Spotify | 2019 | – | 2019 | PL |
| Błażej Król | z tobą / DO DOMU | 2018 | Discogs + Spotify | 2018 | – | 2018 | PL |
| C.C. Catch | Cause You Are Young | 1986 | Discogs | 1986 | – | 2005 | ? |
| C.C. Catch | I Can Lose My Heart Tonight | 1985 | Discogs | 1985 | – | 2005 | ? |
| C.C. Catch | Soul Survivor | 1987 | Discogs | 1987 | – | 2007 | ? |
| C.C. Catch | Strangers by Night | 1986 | Discogs | 1986 | – | 2005 | ? |
| Calvin Harris | Feel So Close | 2011 | Discogs | 2011 | – | 2012 | GB |
| Calvin Harris | Summer | 2014 | Discogs + Spotify | 2014 | – | 2014 | GB |
| Calvin Harris & Ellie Goulding | Outside | 2014 | Discogs + Spotify | 2014 | – | 2014 | GB |
| Camel | Lady Fantasy - Medley | 1974 | Spotify | – | – | 1974 | GB |
| Camila Cabello & Ed Sheeran | Bam Bam | 2022 | Discogs + Spotify | 2022 | – | 2022 | US |
| Candi Staton | Young Hearts Run Free | 1976 | Discogs + Spotify | 1976 | – | 1976 | US |
| Canned Heat | On the Road Again | 1968 | Discogs | 1968 | – | 2003 | US |
| Capital Cities | Safe and Sound | 2012 | Discogs | 2012 | – | 2013 | US |
| Cardi B & Megan Thee Stallion | WAP | 2020 | Discogs + Spotify | 2020 | – | 2020 | US |
| Caribou | Can't Do Without You | 2014 | Spotify + MusicBrainz | – | 2014 | 2014 | CA |
| Carl Douglas | Kung Fu Fighting | 1974 | Discogs + Spotify | 1974 | – | 1974 | JM |
| Carla Fernandes | A2 | 2026 | Spotify | – | – | 2026 | PL |
| Carly Simon | You're So Vain | 1972 | Spotify + MusicBrainz | 2023 | 1972 | 1972 | US |
| Carole King | It's Too Late | 1971 | Spotify + MusicBrainz | 1985 | 1971 | 1971 | US |
| Carpenters | (They Long To Be) Close To You | 1970 | Discogs + Spotify | 1970 | – | 1970 | US |
| Carpenters | Solitaire | 1975 | Discogs + Spotify | 1975 | – | 1975 | US |
| Carpenters | This Masquerade | 1973 | Discogs + Spotify | 1973 | – | 1973 | US |
| Cass Elliot | Make Your Own Kind Of Music | 1969 | Discogs + MusicBrainz | 1969 | 1969 | 1973 | US |
| Celine Dion | My Heart Will Go On | 1997 | Discogs + MusicBrainz+Wikipedia + Spotify | 1997 | 1997 | 1997 | CA |
| Chad Kroeger & Josey Scott | Hero | 2002 | Discogs | 2002 | – | 2003 | CA |
| Chaka Khan | Ain't Nobody | 1989 | MusicBrainz (Spotify: 1996) | – | 1989 | 1996 | US |
| Chaka Khan | I'm Every Woman | 1978 | Spotify + MusicBrainz | – | 1978 | 1978 | US |
| Chappell Roan | Good Luck, Babe! | 2024 | Spotify + MusicBrainz | – | 2024 | 2024 | US |
| Chappell Roan | Pink Pony Club | 2020 | Discogs | 2020 | – | 2023 | US |
| Chapterhouse | Pearl | 1991 | Discogs | 1991 | – | 2007 | GB |
| Charles Aznavour & Bryan Ferry | She | 1974 | Discogs | 1974 | – | 2008 | FR |
| Charli xcx | Boom Clap | 2014 | Discogs + Spotify | 2014 | – | 2014 | GB |
| Charli xcx | Break the Rules | 2014 | Discogs | 2014 | – | 2015 | GB |
| Charli xcx & Billie Eilish | Guess featuring billie eilish | 2024 | Spotify | – | – | 2024 | GB |
| Chemia | Send Me The Ravens | 2015 | Discogs + Spotify | 2015 | – | 2015 | PL |
| Cher | Believe | 1998 | MusicBrainz+Wikipedia + Spotify | – | 1998 | 1998 | US |
| Cher | If I Could Turn Back Time | 1989 | Discogs + Spotify | 1989 | – | 1989 | US |
| Cher | Strong Enough | 1998 | Discogs + Spotify | 1998 | – | 1998 | US |
| Cher | The Shoop Shoop Song (It's In His Kiss) | 1990 | MusicBrainz (Spotify: 1991) | 2024 | 1990 | 1991 | US |
| Cheryl Lynn | Got to Be Real | 1978 | Discogs + Spotify | 1978 | – | 1978 | US |
| Chesney Hawkes | The One and Only | 1991 | Discogs + Spotify | 1991 | – | 1991 | GB |
| CHIC | Everybody Dance | 1977 | Discogs | 1977 | – | 2013 | US |
| CHIC | Good Times | 1979 | Discogs + Spotify | 1979 | – | 1979 | US |
| CHIC | I Want Your Love | 1978 | Discogs + Spotify | 1978 | – | 1978 | US |
| CHIC | Le Freak | 1978 | Discogs + Spotify | 1978 | – | 1978 | US |
| Chicago | Hard to Say I'm Sorry / Get Away | 1982 | Spotify + MusicBrainz | – | 1982 | 1982 | US |
| Chicago | If You Leave Me Now | 1976 | Discogs + Spotify | 1976 | – | 1976 | US |
| Childish Gambino | Redbone | 2016 | Discogs + Spotify | 2016 | – | 2016 | US |
| Childish Gambino | This Is America | 2018 | Discogs + Spotify | 2018 | – | 2018 | US |
| Chris Cornell | You Know My Name | 2006 | Discogs | 2006 | – | 2007 | US |
| Chris de Burgh | Don't Pay The Ferryman | 1982 | Spotify + MusicBrainz | 2005 | 1982 | 1982 | GB |
| Chris de Burgh | The Lady In Red | 1986 | Discogs + Spotify | 1986 | – | 1986 | GB |
| Chris Isaak | Wicked Game | 1989 | Discogs + Spotify | 1989 | – | 1989 | US |
| Chris Norman & Suzi Quatro | Stumblin' In | 1978 | Discogs + Spotify | 1978 | – | 1978 | GB |
| Chris Rea | Driving Home for Christmas | 1986 | Discogs | 1986 | – | 2007 | GB |
| Chris Rea | Josephine | 1985 | Discogs + Spotify | 1985 | – | 1985 | GB |
| Chris Rea | Looking for the Summer | 1991 | Discogs + Spotify | 1991 | – | 1991 | GB |
| Chris Rea | On the Beach | 1986 | Discogs | 1986 | – | 1988 | GB |
| Chris Rea | The Road to Hell, Pt. 1 & 2 | 2008 | Spotify | – | – | 2008 | GB |
| Chris Stapleton | Tennessee Whiskey | 2015 | Discogs + Spotify | 2015 | – | 2015 | US |
| Christie | Yellow River | 1970 | Discogs + Spotify | 1970 | – | 1970 | GB |
| Christina Aguilera | Genie In a Bottle | 1999 | Discogs + Spotify | 1999 | – | 1999 | US |
| Christina Aguilera & Lil' Kim | Lady Marmalade | 2001 | Discogs + Spotify | 2001 | – | 2001 | US |
| Chubby Checker | Let's Twist Again | 1961 | Spotify (MusicBrainz: 1986) | 1963 | 1986 | 1961 | US |
| Chuck Berry | Johnny B. Goode | 1958 | Discogs + MusicBrainz+Wikipedia | 1958 | 1958 | 1959 | US |
| Chuck Berry | Rock And Roll Music | 1958 | Spotify (MusicBrainz: 1981) | – | 1981 | 1958 | US |
| Chuck Berry | You Never Can Tell | 1964 | Discogs + Spotify | 1964 | – | 1964 | US |
| Chuck Mangione & Don Potter | Children Of Sanchez | 1978 | Discogs + Spotify | 1978 | – | 1978 | US |
| Chumbawamba | Tubthumping | 1997 | Discogs + Spotify | 1997 | – | 1997 | GB |
| Chłopcy Z Placu Broni | Kocham cię | 1991 | Spotify + MusicBrainz | 1993 | 1991 | 1991 | PL |
| Chłopcy z Placu Broni | Kocham wolność | 1990 | Discogs | 1990 | – | 2011 | PL |
| Chłopcy z Placu Broni | O Ela! | 1993 | MusicBrainz – oficjalny album „Kocham Cię” (1993); w Discogs tylko wersja koncertowa z 2004 | 2004 | – | 2020 | PL |
| Cigarettes After Sex | Apocalypse | 2017 | Discogs + Spotify | 2017 | – | 2017 | US |
| Cigarettes After Sex | Sweet | 2017 | Discogs + Spotify | 2017 | – | 2017 | US |
| Cinderella | Don't Know What You Got (Till It's Gone) | 1988 | Spotify + MusicBrainz | – | 1988 | 1988 | US |
| Cinderella | Gypsy Road | 1988 | Discogs + Spotify | 1988 | – | 1988 | US |
| Cinderella | Nobody's Fool | 1984 | Discogs (ponowne sprawdzenie) | 1984 | 1986 | 1986 | US |
| Cinderella | Shake Me | 1984 | Discogs | 1984 | – | 1986 | US |
| Clannad | Robin (The Hooded Man) | 1984 | Discogs + Spotify | 1984 | – | 1984 | IE |
| Clannad & Bono | In a Lifetime | 1985 | Discogs | 1985 | – | 1996 | IE |
| Classix Nouveaux | Never Never Comes | 1983 | Discogs + Spotify | 1983 | – | 1983 | GB |
| Clean Bandit & Jess Glynne | Rather Be | 2014 | Discogs + Spotify | 2014 | – | 2014 | GB |
| Cleo & Skolim | LUBIMY | 2026 | Spotify | – | – | 2026 | PL |
| Cliff Richard | Congratulations | 1968 | Discogs | 1968 | – | 1989 | GB |
| Cliff Richard | We Don't Talk Anymore | 1979 | Spotify + MusicBrainz | 1982 | 1979 | 1979 | GB |
| Cliff Richard & The Shadows | The Young Ones | 1961 | Discogs | 1961 | – | 2015 | GB |
| Clock Machine | Morphine | 2015 | Discogs | 2015 | – | 2016 | PL |
| Cocteau Twins | Pandora | 1984 | Discogs | 1984 | – | 2000 | GB |
| Coi Leray | Players | 2022 | Discogs + Spotify | 2022 | – | 2022 | US |
| Coldplay | A Sky Full of Stars | 2014 | Discogs + Spotify | 2014 | – | 2014 | GB |
| Coldplay | Adventure of a Lifetime | 2015 | Discogs + Spotify | 2015 | – | 2015 | GB |
| Coldplay | Clocks | 2002 | Discogs + Spotify | 2002 | – | 2002 | GB |
| Coldplay | Fix You | 2005 | Discogs + Spotify | 2005 | – | 2005 | GB |
| Coldplay | Hymn for the Weekend | 2015 | Discogs + Spotify | 2015 | – | 2015 | GB |
| Coldplay | In My Place | 2002 | Spotify + MusicBrainz | – | 2002 | 2002 | GB |
| Coldplay | Paradise | 2011 | Discogs + Spotify | 2011 | – | 2011 | GB |
| Coldplay | Speed of Sound | 2005 | Discogs + Spotify | 2005 | – | 2005 | GB |
| Coldplay | Talk | 2005 | Discogs + Spotify | 2005 | – | 2005 | GB |
| Coldplay | The Scientist | 2002 | Discogs + Spotify | 2002 | – | 2002 | GB |
| Coldplay | Trouble | 2000 | Discogs + Spotify | 2000 | – | 2000 | GB |
| Coldplay | Viva la Vida | 2008 | Discogs + MusicBrainz+Wikipedia + Spotify | 2008 | 2008 | 2008 | GB |
| Coldplay | Yellow | 2000 | Discogs + Spotify | 2000 | – | 2000 | GB |
| Coldplay & BTS | My Universe | 2021 | Discogs + Spotify | 2021 | – | 2021 | GB |
| Coma | Cisza I Ogień | 2008 | Discogs | 2008 | – | 2011 | PL |
| Coma | Leszek Żukowski | 2004 | Discogs + Spotify | 2004 | – | 2004 | PL |
| Coma | Los cebula i krokodyle łzy | 2011 | Discogs + Spotify | 2011 | – | 2011 | PL |
| Coma | Spadam | 2004 | Discogs + Spotify | 2004 | – | 2004 | PL |
| Coma | Sto tysięcy jednakowych miast | 2004 | Discogs + Spotify | 2004 | – | 2004 | PL |
| Coma | Zaprzepaszczone sily wielkiej armii swietych znaków | 2006 | Discogs + Spotify | 2006 | – | 2006 | PL |
| Commodores | Easy | 1977 | Discogs | 1977 | – | 1995 | US |
| Conan Gray | Heather | 2020 | Discogs + Spotify | 2020 | – | 2020 | US |
| Cool Kids Of Death | Butelki z benzyna i kamienie | 2002 | Discogs + Spotify | 2002 | – | 2002 | PL |
| Coolio | Gangsta's Paradise | 1995 | Discogs + MusicBrainz+Wikipedia + Spotify | 1995 | 1995 | 1995 | US |
| Cornershop & Norman Cook | Brimful of Asha | 1997 | Discogs + Spotify | 1997 | – | 1997 | GB |
| Corona | The Rhythm Of The Night | 1993 | Discogs | 1993 | – | 1995 | IT |
| Counting Crows | Mr. Jones | 1993 | Discogs + Spotify | 1993 | – | 1993 | US |
| Coverdale/Page | Take Me for a Little While | 1993 | Discogs + Spotify | 1993 | – | 1993 | GB |
| Craig David | 7 Days | 2000 | Discogs + Spotify | 2000 | – | 2000 | GB |
| Craig David | Walking Away | 2000 | Discogs + Spotify | 2000 | – | 2000 | GB |
| Crash Test Dummies | Mmm Mmm Mmm Mmm | 1993 | Discogs + Spotify | 1993 | – | 1993 | CA |
| Crazy Town | Butterfly | 1999 | Discogs | 1999 | – | 2000 | US |
| Cream | Badge | 1969 | Discogs + Spotify | 1969 | – | 1969 | GB |
| Cream | Sunshine Of Your Love | 1967 | Discogs + Spotify | 1967 | – | 1967 | GB |
| Cream | White Room | 1968 | Discogs + Spotify | 1968 | – | 1968 | GB |
| Creedence Clearwater Revival | Bad Moon Rising | 1969 | Discogs + Spotify | 1969 | – | 1969 | US |
| Creedence Clearwater Revival | Fortunate Son | 1969 | Discogs + Spotify | 1969 | – | 1969 | US |
| Creedence Clearwater Revival | Have You Ever Seen The Rain | 1970 | Discogs + Spotify | 1970 | – | 1970 | US |
| Creedence Clearwater Revival | I Put A Spell On You | 1968 | Discogs + Spotify | 1968 | – | 1968 | US |
| Creedence Clearwater Revival | Lookin' Out My Back Door | 1970 | Discogs + Spotify | 1970 | – | 1970 | US |
| Creedence Clearwater Revival | Proud Mary | 1968 | Discogs | 1968 | – | 1969 | US |
| Crowded House | Don't Dream It's Over | 1986 | Spotify (MusicBrainz: 1989) | – | 1989 | 1986 | AU |
| Crowded House | Weather With You | 1991 | Discogs + Spotify | 1991 | – | 1991 | AU |
| Culture Club | Do You Really Want To Hurt Me | 1982 | Discogs + Spotify | 1982 | – | 1982 | GB |
| Curly Heads | Synthlove | 2014 | Spotify + MusicBrainz | – | 2014 | 2014 | PL |
| Curtis Mayfield | Move on Up | 1970 | Discogs + Spotify | 1970 | – | 1970 | US |
| Curtis Mayfield | Pusherman | 1972 | Discogs + Spotify | 1972 | – | 1972 | US |
| Curtis Mayfield | Superfly | 1972 | Discogs + Spotify | 1972 | – | 1972 | US |
| Cutting Crew | (I Just) Died In Your Arms | 1986 | Discogs + Spotify | 1986 | – | 1986 | GB |
| Cyndi Lauper | Girls Just Want to Have Fun | 1983 | Discogs + MusicBrainz+Wikipedia + Spotify | 1983 | 1983 | 1983 | US |
| Cyndi Lauper | Time After Time | 1983 | Discogs + Spotify | 1983 | – | 1983 | US |
| Cyndi Lauper | True Colors | 1986 | Discogs + Spotify | 1986 | – | 1986 | US |
| Cypress Hill | Insane in the Brain | 1993 | Discogs + Spotify | 1993 | – | 1993 | US |
| Czarno-Czarni | Nogi | 1998 | Discogs + Spotify | 1998 | – | 1998 | PL |
| Czerwone Gitary | Anna Maria | 1970 | Discogs | 1970 | – | 2015 | PL |
| Czerwone Gitary | Biały krzyż | 1968 | Discogs + MusicBrainz+Wikipedia | 1968 | 1968 | 2015 | PL |
| Czerwone Gitary | Ciągle pada | 1974 | Discogs | 1974 | – | 2021 | PL |
| Czerwone Gitary | Gdy kiedyś znów zawołam cię | 1994 | Discogs | 1994 | – | 2014 | PL |
| Czerwone Gitary | Historia jednej znajomości | 1966 | Discogs + Spotify | 1966 | – | 1966 | PL |
| Czerwone Gitary | Jesień idzie przez park | 1979 | Discogs | 1979 | – | 2015 | PL |
| Czerwone Gitary | Kwiaty we włosach | 1991 | Discogs | 1991 | – | 2014 | PL |
| Czerwone Gitary | Nie spoczniemy | 1977 | Discogs | 1977 | – | – | PL |
| Czerwone Gitary | Nie zadzieraj nosa | 1966 | Discogs + Spotify | 1966 | – | 1966 | PL |
| Czerwone Gitary | Powiedz stary gdzieś ty był | 1991 | Discogs | 1991 | – | 2015 | PL |
| Czerwone Gitary | Płoną góry, płoną lasy | 1971 | Discogs + Spotify | 1971 | – | 1971 | PL |
| Czerwone Gitary | Tak bardzo się starałem | 1969 | Discogs + Spotify | 1969 | – | 1969 | PL |
| Czerwone Gitary | Wróćmy na jeziora | 1979 | Discogs | 1979 | – | 2015 | PL |
| Czerwony Tulipan | Jedyne co mam | 1995 | Discogs | 1995 | – | 1997 | PL |
| Czerwony Tulipan | Jesienna zaduma | 2011 | Spotify + MusicBrainz | – | 2011 | 2011 | PL |
| Czesław Mozil | Lubię mówić z Tobą | 2016 | Spotify | – | – | 2016 | PL |
| Czesław Niemen | Dziwny jest ten świat | 1967 | Discogs + MusicBrainz+Wikipedia | 1967 | 1980 | – | PL |
| Czesław Śpiewa | Maszynka do świerkania | 2008 | Spotify | 2011 | – | 2008 | PL |
| Czesław Śpiewa | W sam raz | 2010 | Discogs + Spotify | 2010 | – | 2010 | PL |
| Céline Dion | Because You Loved Me | 1996 | Discogs + Spotify | 1996 | – | 1996 | CA |
| Céline Dion | It's All Coming Back to Me Now | 1996 | Discogs + Spotify | 1996 | – | 1996 | CA |
| Céline Dion | Pour que tu m'aimes encore | 1995 | Spotify + MusicBrainz | – | 1995 | 1995 | CA |
| D'Angelo | Brown Sugar | 1995 | Discogs + Spotify | 1995 | – | 1995 | US |
| D'Angelo | Lady | 1995 | Discogs + Spotify | 1995 | – | 1995 | US |
| D'Angelo | Untitled (How Does It Feel) | 2000 | Discogs + Spotify | 2000 | – | 2000 | US |
| Daab | Fryzjer na plaży | 1985 | Discogs | 1985 | – | 2004 | PL |
| Daab | Ogrodu serce | 1985 | Discogs | 1985 | – | 2004 | PL |
| Daft Punk | Get Lucky | 2013 | Discogs + MusicBrainz+Wikipedia + Spotify | 2013 | 2013 | 2013 | FR |
| Daft Punk | One More Time | 2000 | Discogs | 2000 | – | 2001 | FR |
| Dalida & Alain Delon | Paroles… paroles… | 1973 | Discogs | 1973 | – | 1997 | FR |
| Damian Marley | Welcome To Jamrock | 2005 | Discogs + Spotify | 2005 | – | 2005 | JM |
| Damien Rice | 9 Crimes | 2006 | Discogs + Spotify | 2006 | – | 2006 | IE |
| Damien Rice | The Blower's Daughter | 2001 | Discogs (ponowne sprawdzenie) | 2001 | 2002 | 2002 | IE |
| Damn Yankees | High Enough | 1990 | Discogs + Spotify | 1990 | – | 1990 | US |
| Danny Vera | Roller Coaster | 2019 | Discogs + Spotify | 2019 | – | 2019 | NL |
| Danuta Rinn | Nie Mam o To Żalu | 1975 | Discogs | 1975 | – | 2015 | PL |
| Danzig | Mother | 1988 | Discogs + Spotify | 1988 | – | 1988 | US |
| Daria Zawiałow | Gdybym Miała Serce | 2019 | Discogs + Spotify | 2019 | – | 2019 | PL |
| Daria Zawiałow | Hej Hej! | 2019 | Discogs + Spotify | 2019 | – | 2019 | PL |
| Daria Zawiałow | Jeszcze w zielone gramy - piosenka z filmu Plan B | 2017 | Spotify | – | – | 2017 | PL |
| Daria Zawiałow | Kundel Bury | 2017 | Discogs + Spotify | 2017 | – | 2017 | PL |
| Daria Zawiałow | Malinowy chruśniak | 2016 | Discogs + MusicBrainz+Wikipedia | 2016 | 2017 | 2017 | PL |
| Daria Zawiałow | Szarówka | 2019 | Discogs + Spotify | 2019 | – | 2019 | PL |
| Daria Zawiałow & Dawid Podsiadło | Za krótki sen | 2021 | Discogs + Spotify | 2021 | – | 2021 | PL |
| Darude | Sandstorm | 1999 | Discogs | 1999 | – | 2000 | FI |
| Daryl Hall & John Oates | Maneater | 1982 | Discogs + Spotify | 1982 | – | 1982 | US |
| Daryl Hall & John Oates | Out of Touch | 1984 | Discogs | 1984 | – | 2009 | US |
| Daryl Hall & John Oates | Rich Girl | 1976 | Discogs + Spotify | 1976 | – | 1976 | US |
| Dasha | Austin (Boots Stop Workin') | 2024 | Spotify + MusicBrainz | – | 2024 | 2024 | US |
| Dave Matthews Band | Don't Drink the Water | 1998 | Spotify + MusicBrainz | 2017 | 1998 | 1998 | US |
| Dave Matthews Band | Funny the Way It Is | 2009 | Discogs + Spotify | 2009 | – | 2009 | US |
| Dave Matthews Band | Mother Father | 2001 | Discogs + Spotify | 2001 | – | 2001 | US |
| Dave Matthews Band | The Space Between | 2001 | Discogs + Spotify | 2001 | – | 2001 | US |
| Dave Stewart & Candy Dulfer | Lily Was Here | 1990 | Spotify + MusicBrainz | 2008 | 1990 | 1990 | GB |
| David Bowie | Absolute Beginners | 1986 | Discogs + Spotify | 1986 | – | 1986 | GB |
| David Bowie | Ashes to Ashes | 1980 | Discogs + Spotify | 1980 | – | 1980 | GB |
| David Bowie | China Girl | 1983 | Discogs + Spotify | 1983 | – | 1983 | GB |
| David Bowie | Heroes | 1977 | Discogs + MusicBrainz+Wikipedia + Spotify | 1977 | 1977 | 1977 | GB |
| David Bowie | Lazarus | 2015 | Discogs | 2015 | – | 2016 | GB |
| David Bowie | Let's Dance | 1983 | Spotify + MusicBrainz | 1993 | 1983 | 1983 | GB |
| David Bowie | Life on Mars? | 1971 | Discogs + Spotify | 1971 | – | 1971 | GB |
| David Bowie | Space Oddity | 1969 | Discogs + Spotify | 1969 | – | 1969 | GB |
| David Bowie | Starman | 1972 | Discogs + Spotify | 1972 | – | 1972 | GB |
| David Bowie | The Man Who Sold the World | 1970 | Discogs + Spotify | 1970 | – | 1970 | GB |
| David Bowie | Wild Is the Wind | 1976 | Discogs + Spotify | 1976 | – | 1976 | GB |
| David Bowie | Ziggy Stardust | 1972 | Discogs + Spotify | 1972 | – | 1972 | GB |
| David Bowie & Pat Metheny Group | This Is Not America | 1985 | Discogs | 1985 | – | 2002 | GB |
| David Gilmour | On an Island | 2006 | Discogs + Spotify | 2006 | – | 2006 | GB |
| David Gilmour & Romany Gilmour | Between Two Points | 2024 | Discogs + Spotify | 2024 | – | 2024 | GB |
| David Gray | Babylon | 1998 | Discogs + Spotify | 1998 | – | 1998 | GB |
| David Gray | This Year's Love | 1998 | Spotify + MusicBrainz | – | 1998 | 1998 | GB |
| David Guetta | Love Don't Let Me Go | 2002 | Spotify + MusicBrainz | – | 2002 | 2002 | FR |
| David Guetta & Bebe Rexha | I'm Good (Blue) | 2022 | Spotify + MusicBrainz | – | 2022 | 2022 | FR |
| David Guetta & Kelly Rowland | When Love Takes Over | 2009 | Discogs | 2009 | – | 2010 | FR |
| David Guetta & Sia | Titanium | 2011 | Discogs | 2011 | – | 2012 | FR |
| David Kushner | Daylight | 2024 | Discogs + Spotify | 2024 | – | 2024 | US |
| David Lee Roth | Just Like Paradise | 1987 | Discogs | 1987 | – | 1988 | US |
| Dawid Kwiatkowski | Tak bym chciał... | 2026 | Discogs + Spotify | 2026 | – | 2026 | PL |
| Dawid Kwiatkowski & Margaret | Później Ci opowiem | 2026 | Discogs + Spotify | 2026 | – | 2026 | PL |
| Dawid Podsiadło | 4:30 | 2014 | Spotify (MusicBrainz: 2023) | – | 2023 | 2014 | PL |
| Dawid Podsiadło | Matylda | 2018 | Discogs + Spotify | 2018 | – | 2018 | PL |
| Dawid Podsiadło | Małomiasteczkowy | 2018 | Discogs + MusicBrainz+Wikipedia + Spotify | 2018 | 2018 | 2018 | PL |
| Dawid Podsiadło | na błysk | 2026 | Spotify | – | – | 2026 | PL |
| Dawid Podsiadło | Najnowszy Klip | 2018 | Discogs + Spotify | 2018 | – | 2018 | PL |
| Dawid Podsiadło | Nie Ma Fal | 2018 | Discogs + Spotify | 2018 | – | 2018 | PL |
| Dawid Podsiadło | Nieznajomy | 2013 | Discogs + Spotify | 2013 | – | 2013 | PL |
| Dawid Podsiadło | Pastempomat | 2015 | Discogs + Spotify | 2015 | – | 2015 | PL |
| Dawid Podsiadło | Trofea | 2018 | Discogs + Spotify | 2018 | – | 2018 | PL |
| Dawid Podsiadło | Trójkąty i kwadraty | 2013 | Discogs + MusicBrainz+Wikipedia + Spotify | 2013 | 2013 | 2013 | PL |
| Dawid Podsiadło | W Dobrą Stronę | 2015 | Discogs + Spotify | 2015 | – | 2015 | PL |
| De La Soul | Me Myself and I | 1989 | Discogs + Spotify | 1989 | – | 1989 | US |
| De Mono | Kochać inaczej | 1989 | Discogs | 1989 | – | 2013 | PL |
| De Mono | Moje miasto nocą | 1990 | Discogs | 1990 | – | 2017 | PL |
| De Mono | Póki na to czas | 2017 | Discogs + Spotify | 2017 | – | 2017 | PL |
| De Mono | Statki na niebie | 1993 | Discogs | 1993 | – | 2014 | PL |
| De Mono | Znów Jesteś ze Mną | 1993 | Discogs | 1993 | – | 2014 | PL |
| De Mono & Polska Orkiestra Radiowa | Kamień i aksamit | 1994 | Discogs | 1994 | – | 2014 | PL |
| De Press | Bo Jo Cie Kochom | 1981 | Discogs + Spotify | 1981 | – | 1981 | NO |
| Dead Can Dance | Amnesia | 2012 | Discogs + Spotify | 2012 | – | 2012 | AU |
| Dead Can Dance | In Power We Entrust the Love Advocated | 1984 | Discogs | 1984 | – | 2002 | AU |
| Dead Can Dance | Xavier | 1987 | Discogs + Spotify | 1987 | – | 1987 | AU |
| Dead Or Alive | You Spin Me Round (Like a Record) | 1984 | Discogs | 1984 | – | 1985 | GB |
| Dean Martin | Everybody Loves Somebody | 1963 | Discogs | 1963 | – | 1964 | US |
| Dean Martin | Sway (Quien Sera) | 1954 | Discogs | 1954 | – | 1964 | US |
| Deee-Lite | Groove Is in the Heart | 1990 | Discogs + Spotify | 1990 | – | 1990 | US |
| Deep Blue Something | Breakfast At Tiffany's | 1993 | MusicBrainz (Spotify: 1995) | – | 1993 | 1995 | US |
| Deep Purple | Black Night | 1970 | Discogs | 1970 | – | 1990 | GB |
| Deep Purple | Burn | 1974 | Discogs + Spotify | 1974 | – | 1974 | GB |
| Deep Purple | Child in Time | 1970 | Discogs | 1970 | – | 2017 | GB |
| Deep Purple | Fireball | 1971 | Discogs + Spotify | 1971 | – | 1971 | GB |
| Deep Purple | Highway Star | 1972 | Discogs + Spotify | 1972 | – | 1972 | GB |
| Deep Purple | Hush | 1968 | Discogs + Spotify | 1968 | – | 1968 | GB |
| Deep Purple | Perfect Strangers | 1984 | Discogs + Spotify | 1984 | – | 1984 | GB |
| Deep Purple | Smoke on the Water | 1972 | Discogs + MusicBrainz+Wikipedia + Spotify | 1972 | 1972 | 1972 | GB |
| Deep Purple | Sometimes I Feel Like Screaming | 1996 | Discogs + MusicBrainz | 1996 | 1996 | 1990 | GB |
| Deep Purple | When A Blind Man Cries | 1972 | Discogs + Spotify | 1972 | – | 1972 | GB |
| Def Leppard | Love Bites | 1987 | Discogs + Spotify | 1987 | – | 1987 | GB |
| Def Leppard | Pour Some Sugar On Me | 1987 | Discogs + Spotify | 1987 | – | 1987 | GB |
| Del Shannon | Runaway | 1961 | Discogs + Spotify | 1961 | – | 1961 | US |
| Demis Roussos | Goodbye My Love Goodbye | 1973 | Discogs | 1973 | – | 1983 | GR |
| Demis Roussos | My Friend The Wind | 1971 | Discogs | 1971 | – | 2011 | GR |
| Dennis Lloyd | Nevermind | 2017 | Discogs + Spotify | 2017 | – | 2017 | IL |
| Depeche Mode | Behind the Wheel | 1987 | Discogs + Spotify | 1987 | – | 1987 | GB |
| Depeche Mode | Dream On | 2001 | Discogs + Spotify | 2001 | – | 2001 | GB |
| Depeche Mode | Enjoy the Silence | 1990 | Discogs + MusicBrainz+Wikipedia | 1990 | 1990 | 1998 | GB |
| Depeche Mode | Freelove | 2001 | Discogs + Spotify | 2001 | – | 2001 | GB |
| Depeche Mode | Ghosts Again | 2023 | Discogs + Spotify | 2023 | – | 2023 | GB |
| Depeche Mode | I Feel You | 1993 | Discogs + Spotify | 1993 | – | 1993 | GB |
| Depeche Mode | In Your Room | 1993 | Discogs + Spotify | 1993 | – | 1993 | GB |
| Depeche Mode | Just Can't Get Enough | 1981 | Spotify + MusicBrainz | – | 1981 | 1981 | GB |
| Depeche Mode | Never Let Me Down Again | 1987 | Discogs | 1987 | – | 1998 | GB |
| Depeche Mode | People Are People | 1984 | Discogs + Spotify | 1984 | – | 1984 | GB |
| Depeche Mode | Personal Jesus | 1989 | Discogs | 1989 | – | 1990 | GB |
| Depeche Mode | Policy of Truth | 1990 | Discogs + Spotify | 1990 | – | 1990 | GB |
| Depeche Mode | Precious | 2005 | Discogs + Spotify | 2005 | – | 2005 | GB |
| Depeche Mode | Shake the Disease | 1985 | Discogs | 1985 | – | 1986 | GB |
| Depeche Mode | Somebody | 1984 | Discogs + Spotify | 1984 | – | 1984 | GB |
| Depeche Mode | Strangelove | 1987 | Discogs | 1987 | – | 1998 | GB |
| Depeche Mode | Walking in My Shoes | 1993 | Discogs + Spotify | 1993 | – | 1993 | GB |
| Depeche Mode | World In My Eyes | 1990 | Discogs + Spotify | 1990 | – | 1990 | GB |
| Derek & The Dominos | Layla | 1970 | Discogs + Spotify | 1970 | – | 1970 | US |
| Dermot Kennedy | Power Over Me | 2019 | Discogs + Spotify | 2019 | – | 2019 | IE |
| Destiny's Child | Say My Name | 1999 | Discogs + Spotify | 1999 | – | 1999 | US |
| Dexys Midnight Runners | Come On Eileen | 1982 | Discogs + MusicBrainz+Wikipedia + Spotify | 1982 | 1982 | 1982 | GB |
| Dezerter | Kłamstwo to nowa prawda | 2021 | Discogs + Spotify | 2021 | – | 2021 | PL |
| Dezerter | Spytaj milicjanta | 1983 | Discogs | 1983 | – | 1987 | PL |
| Diana Ross | I'm Coming Out | 1980 | Spotify + MusicBrainz | – | 1980 | 1980 | US |
| Diana Ross | It's My House | 1979 | Discogs + Spotify | 1979 | – | 1979 | US |
| Diana Ross | The Boss | 1979 | Discogs + Spotify | 1979 | – | 1979 | US |
| Diana Ross | Upside Down | 1980 | Discogs + Spotify | 1980 | – | 1980 | US |
| Dido | Here With Me | 1999 | Discogs + Spotify | 1999 | – | 1999 | GB |
| Dido | Life for Rent | 2003 | Discogs + Spotify | 2003 | – | 2003 | GB |
| Dido | Thank You | 1999 | Discogs + Spotify | 1999 | – | 1999 | GB |
| Dido | White Flag | 2003 | Discogs + Spotify | 2003 | – | 2003 | GB |
| Die Antwoord & G.O.D. | I FINK YOU FREEKY | 2016 | Discogs + Spotify | 2016 | – | 2016 | ZA |
| Diiya | Czerwone Jagody Drill | 2026 | Spotify | – | – | 2026 | PL |
| Dinosaur Jr. | Freak Scene | 1988 | Discogs + Spotify | 1988 | – | 1988 | US |
| Dio | Holy Diver | 1983 | Discogs + Spotify | 1983 | – | 1983 | US |
| Dio | Rainbow In The Dark | 1983 | Discogs + Spotify | 1983 | – | 1983 | US |
| Dionne Warwick | Heartbreaker | 1982 | Discogs + Spotify | 1982 | – | 1982 | US |
| Dionne Warwick | Walk on By | 1963 | Discogs | 1963 | – | 1964 | US |
| Dire Straits | Brothers In Arms | 1985 | Discogs + Spotify | 1985 | – | 1985 | GB |
| Dire Straits | Money For Nothing | 1985 | Discogs + Spotify | 1985 | – | 1985 | GB |
| Dire Straits | On Every Street | 1991 | Discogs + Spotify | 1991 | – | 1991 | GB |
| Dire Straits | Once Upon A Time In The West | 1979 | Discogs + Spotify | 1979 | – | 1979 | GB |
| Dire Straits | Private Investigations | 1982 | Discogs + Spotify | 1982 | – | 1982 | GB |
| Dire Straits | Romeo And Juliet | 1980 | Discogs + Spotify | 1980 | – | 1980 | GB |
| Dire Straits | Sultans of Swing | 1978 | Discogs + MusicBrainz+Wikipedia + Spotify | 1978 | 1978 | 1978 | GB |
| Dire Straits | Telegraph Road | 1982 | Discogs + Spotify | 1982 | – | 1982 | GB |
| Dire Straits | Tunnel Of Love | 1980 | Discogs + Spotify | 1980 | – | 1980 | GB |
| Dire Straits | Walk Of Life | 1985 | Discogs | 1985 | – | 2005 | GB |
| Dire Straits | You And Your Friend | 1991 | Discogs + Spotify | 1991 | – | 1991 | GB |
| Dire Straits | Your Latest Trick | 1985 | Discogs + Spotify | 1985 | – | 1985 | GB |
| Disclosure & Sam Smith | Latch | 2012 | Discogs | 2012 | – | 2013 | GB |
| Disturbed | The Sound of Silence | 2015 | Discogs + Spotify | 2015 | – | 2015 | US |
| DJ Adamus & Kayomee | Zanim Znikniesz | 2026 | Spotify | – | – | 2026 | PL |
| DJ Shadow | Six Days | 2002 | Discogs + Spotify | 2002 | – | 2002 | US |
| Djo | End of Beginning | 2022 | Discogs + Spotify | 2022 | – | 2022 | US |
| DNA & Suzanne Vega | Tom's Diner | 1990 | MusicBrainz (Spotify: 1998) | – | 1990 | 1998 | GB |
| DNCE | Cake By The Ocean | 2015 | Discogs | 2015 | – | 2016 | US |
| Doda | Pamiętnik | 2026 | Spotify + MusicBrainz | – | 2026 | 2026 | PL |
| Doja Cat | Paint The Town Red | 2023 | Discogs + Spotify | 2023 | – | 2023 | US |
| Doja Cat | Woman | 2021 | Discogs + Spotify | 2021 | – | 2021 | US |
| Doja Cat & SZA | Kiss Me More | 2021 | Discogs + Spotify | 2021 | – | 2021 | US |
| Dokken | Alone Again | 1984 | Discogs + Spotify | 1984 | – | 1984 | US |
| Dokken | Breaking The Chains | 1983 | Discogs + Spotify | 1983 | – | 1983 | US |
| Dokken | In My Dreams | 1985 | Discogs | 1985 | – | 2010 | US |
| Dolly Parton | 9 to 5 | 1980 | Discogs + Spotify | 1980 | – | 1980 | US |
| Dolly Parton | I Will Always Love You | 1974 | Spotify + MusicBrainz | – | 1974 | 1974 | US |
| Dolly Parton | Jolene | 1973 | Discogs | 1973 | – | 1974 | US |
| Domenico Modugno | Nel blu dipinto di blu' (Volare) | 1958 | Discogs | 1958 | – | 2014 | IT |
| Dominic Fike | 3 Nights | 2018 | Discogs + Spotify | 2018 | – | 2018 | US |
| Dominika Płonka | będziesz tu tylko raz | 2026 | Spotify | – | – | 2026 | PL |
| Domowe Melodie | Grażka | 2012 | MusicBrainz (Spotify: 2013) | – | 2012 | 2013 | PL |
| Don Henley | The Boys Of Summer | 1984 | Discogs + Spotify | 1984 | – | 1984 | US |
| Don McLean | American Pie | 1971 | Discogs + Spotify | 1971 | – | 1971 | US |
| Don McLean | Vincent | 1971 | Discogs + Spotify | 1971 | – | 1971 | US |
| Donna Lewis | I Love You Always Forever | 1996 | Discogs + Spotify | 1996 | – | 1996 | GB |
| Donna Summer | Bad Girls | 1979 | Discogs + Spotify | 1979 | – | 1979 | US |
| Donna Summer | Hot Stuff | 1979 | Discogs + Spotify | 1979 | – | 1979 | US |
| Donna Summer | I Feel Love | 1977 | Discogs + MusicBrainz+Wikipedia + Spotify | 1977 | 1977 | 1977 | US |
| Donna Summer | MacArthur Park | 1978 | Discogs + MusicBrainz | 1978 | 1978 | 1979 | US |
| Dorota Lulka & Paweł A. Nowak | Ballada jarzynowa | 2016 | Spotify | – | – | 2016 | ? |
| Dorota Miskiewicz | Nuce, gwizdze sobie | 2008 | Discogs + Spotify | 2008 | – | 2008 | PL |
| Dorota Miskiewicz | Poza Czasem | 2005 | Discogs + Spotify | 2005 | – | 2005 | PL |
| Dorota Osinska | Remedium (Wsiąść do pociągu) | 2013 | Spotify | – | – | 2013 | PL |
| Dove Cameron | Boyfriend | 2022 | Discogs + Spotify | 2022 | – | 2022 | US |
| Doves | There Goes The Fear | 2002 | Discogs + Spotify | 2002 | – | 2002 | GB |
| Dr. Alban | It's My Life | 1992 | Spotify + MusicBrainz | – | 1992 | 1992 | SE |
| Dr. Alban | Sing Hallelujah! | 1997 | Discogs + Spotify | 1997 | – | 1997 | SE |
| Dr. Dre & Snoop Dogg | Nuthin' But A "G" Thang | 1992 | Discogs + Spotify | 1992 | – | 1992 | US |
| Dr. Dre & Snoop Dogg | Still D.R.E. | 1999 | Spotify + MusicBrainz | – | 1999 | 1999 | US |
| Dr. Dre & Snoop Dogg | The Next Episode | 1999 | Discogs + Spotify | 1999 | – | 1999 | US |
| Drake | Hotline Bling | 2015 | Discogs | 2015 | – | 2016 | CA |
| Drake & Majid Jordan | Hold On, We're Going Home | 2013 | Spotify + MusicBrainz | – | 2013 | 2013 | CA |
| Drake & Rihanna | Take Care | 2011 | Discogs + Spotify | 2011 | – | 2011 | CA |
| Dropkick Murphys | The State of Massachusetts | 2007 | Discogs + Spotify | 2007 | – | 2007 | US |
| Dua Lipa | Dance The Night | 2023 | Discogs + Spotify | 2023 | – | 2023 | GB |
| Dua Lipa | Don't Start Now | 2020 | Discogs + Spotify | 2020 | – | 2020 | GB |
| Dua Lipa | Levitating | 2020 | Discogs + MusicBrainz+Wikipedia + Spotify | 2020 | 2020 | 2020 | GB |
| Duckanon Orkiestra | Souvenir Of China | 2015 | Spotify | – | – | 2015 | ? |
| Duffy | Mercy | 2007 | Discogs | 2007 | – | 2008 | GB |
| Duffy | Stepping Stone | 2008 | Discogs + Spotify | 2008 | – | 2008 | GB |
| Duran Duran | A View to a Kill | 1985 | Discogs | 1985 | – | 1989 | GB |
| Duran Duran | Come Undone | 1993 | Discogs + Spotify | 1993 | – | 1993 | GB |
| Duran Duran | Ordinary World | 1993 | Discogs + Spotify | 1993 | – | 1993 | GB |
| Duran Duran | Save a Prayer | 1982 | Discogs + Spotify | 1982 | – | 1982 | GB |
| Dusty Springfield | In Private | 1989 | Discogs | 1989 | – | 1990 | GB |
| Dusty Springfield | Son Of A Preacher Man | 1968 | Discogs | 1968 | – | 1969 | GB |
| Dusty Springfield | Spooky | 1970 | Discogs + MusicBrainz | 1970 | 1970 | 1968 | GB |
| Dusty Springfield | The Look Of Love | 1967 | Discogs | 1967 | – | 2006 | GB |
| Dusty Springfield | You Don't Have To Say You Love Me | 1966 | Spotify + MusicBrainz | – | 1966 | 1966 | GB |
| Dwa plus Jeden | Chodź, Pomaluj Mój Świat | 1978 | MusicBrainz (Spotify: 2014) | – | 1978 | 2014 | PL |
| Dwa plus Jeden | Wstawaj szkoda dnia | 1972 | Spotify (MusicBrainz: 1978) | – | 1978 | 1972 | PL |
| Dzamble | Wymyśliłem Ciebie | 1971 | Discogs + Spotify | 1971 | – | 1971 | PL |
| Dżem | Autsajder | 1993 | Discogs | 1993 | – | 2012 | PL |
| Dżem | Czerwony jak cegła | 1985 | Discogs | 1985 | – | 2011 | PL |
| Dżem | Do kołyski | 2004 | Discogs + Spotify | 2004 | – | 2004 | PL |
| Dżem | Dzień, W Którym Pękło Niebo | 1985 | Discogs | 1985 | – | 2003 | PL |
| Dżem | Jak malowany ptak | 1991 | Discogs | 1991 | – | 2012 | PL |
| Dżem | List Do M. | 1991 | Discogs | 1991 | – | 2003 | PL |
| Dżem | Modlitwa III | 1989 | Discogs | 1989 | – | 2012 | PL |
| Dżem | Naiwne pytania | 1987 | Discogs | 1987 | – | 2003 | PL |
| Dżem | Partyzant | 2010 | Discogs + Spotify | 2010 | – | 2010 | PL |
| Dżem | Sen o Victorii | 1991 | Discogs | 1991 | – | 2003 | PL |
| Dżem | Skazany na bluesa | 1992 | Discogs | 1992 | – | 2012 | PL |
| Dżem | Wehikuł czasu | 1989 | Discogs + MusicBrainz+Wikipedia | 1989 | 1989 | 1998 | PL |
| Dżem | Wehikuł Czasu / To byłby cud | 1995 | Discogs | 1995 | – | 2019 | PL |
| Dżem | Whisky | 1985 | Discogs | 1985 | – | 1999 | PL |
| Dżem | Złoty Paw | 1994 | Discogs | 1994 | – | 2012 | PL |
| Dżem & Tadeusz Nalepa | Ten o Tobie film | 1988 | Discogs + Spotify | 1988 | – | 1988 | PL |
| Eagle-Eye Cherry | Save Tonight | 1997 | Discogs | 1997 | – | 1998 | SE |
| Eagles | Hotel California | 1976 | Discogs + MusicBrainz+Wikipedia + Spotify | 1976 | 1976 | 1976 | US |
| Eagles | New Kid in Town | 1976 | Discogs + Spotify | 1976 | – | 1976 | US |
| Eagles | Take It Easy | 1972 | Discogs + Spotify | 1972 | – | 1972 | US |
| Earth, Wind & Fire | Fantasy | 1977 | Discogs + Spotify | 1977 | – | 1977 | US |
| Earth, Wind & Fire | September | 1978 | Discogs + MusicBrainz+Wikipedia + Spotify | 1978 | 1978 | 1978 | US |
| Earth, Wind & Fire | Shining Star | 1975 | Discogs + Spotify | 1975 | – | 1975 | US |
| Earth, Wind & Fire & The Emotions | Boogie Wonderland | 1979 | Discogs + Spotify | 1979 | – | 1979 | US |
| EastWest Rockers & Cheeba | Dotknąć Cię | 2006 | Spotify + MusicBrainz | – | 2006 | 2006 | PL |
| Echo & the Bunnymen | The Killing Moon | 1984 | Discogs + Spotify | 1984 | – | 1984 | GB |
| Echosmith | Cool Kids | 2013 | Discogs + Spotify | 2013 | – | 2013 | US |
| Ed Sheeran | Bad Habits | 2021 | Discogs + Spotify | 2021 | – | 2021 | GB |
| Ed Sheeran | I See Fire | 2013 | Spotify + MusicBrainz | 2014 | 2013 | 2013 | GB |
| Ed Sheeran | Perfect | 2017 | Discogs + Spotify | 2017 | – | 2017 | GB |
| Ed Sheeran | Shape of You | 2017 | Discogs + MusicBrainz+Wikipedia + Spotify | 2017 | 2017 | 2017 | GB |
| Ed Sheeran | Shivers | 2021 | Discogs + Spotify | 2021 | – | 2021 | GB |
| Ed Sheeran | Thinking out Loud | 2014 | Discogs + Spotify | 2014 | – | 2014 | GB |
| Eddie Vedder | Society | 2007 | Discogs + Spotify | 2007 | – | 2007 | US |
| Eddy Huntington | Ussr | 1986 | Discogs | 1986 | – | 2010 | GB |
| Edie Brickell & New Bohemians | What I Am | 1988 | Discogs + Spotify | 1988 | – | 1988 | US |
| Edison Lighthouse | Love Grows (Where My Rosemary Goes) | 1970 | Discogs + Spotify | 1970 | – | 1970 | GB |
| Editors | Papillon | 2009 | Discogs + Spotify | 2009 | – | 2009 | GB |
| Editors | Smokers Outside The Hospital Doors | 2007 | Discogs + Spotify | 2007 | – | 2007 | GB |
| Edmund Fetting | Ballada o pancernych | 1970 | Spotify | – | – | 1970 | PL |
| Edmund Fetting | Nim Wstanie Dzień | 1966 | Spotify (MusicBrainz: 1997) | – | 1997 | 1966 | PL |
| Edmund Fetting | Przed nami Odra | 1970 | Spotify (MusicBrainz: 2002) | – | 2002 | 1970 | PL |
| Edward Sharpe & The Magnetic Zeros | Home | 2009 | Discogs + Spotify | 2009 | – | 2009 | ? |
| Edwin Starr | War | 1970 | Discogs + Spotify | 1970 | – | 1970 | US |
| Edwyn Collins | A Girl Like You | 1994 | Discogs + Spotify | 1994 | – | 1994 | GB |
| Edyta Bartosiewicz | Jenny | 1997 | Discogs | 1997 | – | 1999 | PL |
| Edyta Bartosiewicz | Lovesong | 2020 | Discogs + Spotify | 2020 | – | 2020 | PL |
| Edyta Bartosiewicz | Milosc Jak Ogien | 1998 | Discogs + Spotify | 1998 | – | 1998 | PL |
| Edyta Bartosiewicz | Niewinność | 2014 | Discogs | 2014 | – | 2018 | PL |
| Edyta Bartosiewicz | Opowieść | 2014 | Discogs | 2014 | – | 2018 | PL |
| Edyta Bartosiewicz | Ostatni | 1995 | Discogs | 1995 | – | 1999 | PL |
| Edyta Bartosiewicz | Sen | 1994 | Discogs + Spotify | 1994 | – | 1994 | PL |
| Edyta Bartosiewicz | Skłamałam | 1997 | Discogs | 1997 | – | 1999 | PL |
| Edyta Bartosiewicz | Szał | 1995 | Discogs | 1995 | – | 2010 | PL |
| Edyta Bartosiewicz | Tatuaż | 1994 | Discogs | 1994 | – | 1999 | PL |
| Edyta Geppert | Jaka Róża Taki Cierń | 1986 | Discogs | 1986 | – | 2014 | PL |
| Edyta Geppert | Nie Żałuję | 1992 | Discogs | 1992 | – | 2018 | PL |
| Edyta Geppert | Zamiast | 1986 | Discogs | 1986 | – | 2018 | PL |
| Edyta Geppert | Życie, kocham cię nad życie | 2001 | MusicBrainz (Spotify: 2014) | – | 2001 | 2014 | PL |
| Edyta Górniak | Dotyk | 1995 | Discogs + Spotify | 1995 | – | 1995 | PL |
| Edyta Górniak | Jestem kobietą | 1995 | Discogs | 1995 | – | 2004 | PL |
| Edyta Górniak | Kolorowy Wiatr | 1995 | MusicBrainz (Spotify: 2003) | 2004 | 1995 | 2003 | PL |
| Edyta Górniak | Nie proszę o więcej | 2002 | Discogs + Spotify | 2002 | – | 2002 | PL |
| Edyta Górniak | To nie ja! | 1994 | Discogs + MusicBrainz+Wikipedia | 1994 | 1994 | 1995 | PL |
| Edyta Górniak | To nie tak jak myślisz | 2008 | MusicBrainz (Spotify: 2009) | – | 2008 | 2009 | PL |
| Edyta Górniak & Mietek Szczesniak | Dumka na dwa serca | 2004 | Discogs + Spotify | 2004 | – | 2004 | PL |
| Eiffel 65 | Blue (Da Ba Dee) | 1998 | Discogs + MusicBrainz+Wikipedia | 1998 | 1998 | – | IT |
| Elbow | One Day Like This | 2008 | Discogs + Spotify | 2008 | – | 2008 | GB |
| Electric Light Orchestra | Confusion | 1979 | Discogs + Spotify | 1979 | – | 1979 | GB |
| Electric Light Orchestra | Don't Bring Me Down | 1979 | Spotify + MusicBrainz | – | 1979 | 1979 | GB |
| Electric Light Orchestra | Here Is the News | 1981 | Discogs + Spotify | 1981 | – | 1981 | GB |
| Electric Light Orchestra | Last Train to London | 1979 | Discogs + Spotify | 1979 | – | 1979 | GB |
| Electric Light Orchestra | Livin' Thing | 1976 | Discogs + Spotify | 1976 | – | 1976 | GB |
| Electric Light Orchestra | Mr. Blue Sky | 1977 | Discogs + Spotify | 1977 | – | 1977 | GB |
| Electric Light Orchestra | Rock 'N' Roll Is King | 1983 | Discogs + Spotify | 1983 | – | 1983 | GB |
| Electric Light Orchestra | Telephone Line | 1976 | Discogs + Spotify | 1976 | – | 1976 | GB |
| Electric Light Orchestra | Ticket to the Moon | 1981 | Discogs + Spotify | 1981 | – | 1981 | GB |
| Elektryczne Gitary | Co powie Ryba | 1999 | Discogs | 1999 | – | – | PL |
| Elektryczne Gitary | Co Ty Tutaj Robisz | 1997 | Discogs + Spotify | 1997 | – | 1997 | PL |
| Elektryczne Gitary | Człowiek z liściem | 1992 | Discogs | 1992 | – | 2014 | PL |
| Elektryczne Gitary | Dzieci wybiegły | 1996 | Discogs + MusicBrainz | 1996 | 1996 | 1993 | PL |
| Elektryczne Gitary | Jestem z miasta | 1992 | Discogs | 1992 | – | 2014 | PL |
| Ella Fitzgerald | Manhattan | 1956 | Discogs + Spotify | 1956 | – | 1956 | US |
| Ella Fitzgerald & Louis Armstrong | Dream A Little Dream Of Me | 1952 | Discogs | 1952 | – | 1990 | US |
| Ella Langley | Choosin' Texas | 2025 | Spotify + MusicBrainz | 2026 | 2025 | 2025 | US |
| Elle King | Ex's & Oh's | 2014 | MusicBrainz (Spotify: 2015) | – | 2014 | 2015 | US |
| Ellie Goulding | Burn | 2013 | Discogs | 2013 | – | 2014 | GB |
| Ellie Goulding | Lights | 2010 | Discogs + Spotify | 2010 | – | 2010 | GB |
| Elton John | Can You Feel the Love Tonight - End Title | 1994 | Discogs | 1994 | – | 2003 | GB |
| Elton John | Candle In The Wind | 1973 | Discogs | 1973 | – | 1995 | GB |
| Elton John | Crocodile Rock | 1972 | Discogs | 1972 | – | 1973 | GB |
| Elton John | Goodbye Yellow Brick Road | 1973 | Discogs + Spotify | 1973 | – | 1973 | GB |
| Elton John | I Guess That's Why They Call It The Blues | 1983 | Spotify + MusicBrainz | 1990 | 1983 | 1983 | GB |
| Elton John | I'm Still Standing | 1983 | Spotify + MusicBrainz | 1990 | 1983 | 1983 | GB |
| Elton John | Nikita | 1985 | Discogs + Spotify | 1985 | – | 1985 | GB |
| Elton John | Rocket Man | 1972 | Discogs + MusicBrainz+Wikipedia + Spotify | 1972 | 1972 | 1972 | GB |
| Elton John | Sacrifice | 1989 | Discogs + Spotify | 1989 | – | 1989 | GB |
| Elton John | Saturday Night’s Alright (For Fighting) | 1973 | Spotify (MusicBrainz: 1983) | 1981 | 1983 | 1973 | GB |
| Elton John | Song For Guy | 1978 | Discogs + Spotify | 1978 | – | 1978 | GB |
| Elton John | Sorry Seems To Be The Hardest Word | 1976 | Discogs + Spotify | 1976 | – | 1976 | GB |
| Elton John | The Bitch Is Back | 1974 | Discogs + Spotify | 1974 | – | 1974 | GB |
| Elton John | Tiny Dancer | 1971 | Discogs + Spotify | 1971 | – | 1971 | GB |
| Elton John | Your Song | 1970 | Discogs + Spotify | 1970 | – | 1970 | GB |
| Elton John & Dua Lipa | Cold Heart | 2017 | MusicBrainz (Spotify: 2021) | – | 2017 | 2021 | GB |
| Elton John & Kiki Dee | Don't Go Breaking My Heart | 1975 | Spotify (MusicBrainz: 1976) | 2026 | 1976 | 1975 | GB |
| Elvis Costello & The Attractions | Shipbuilding | 1983 | Discogs | 1983 | – | 2020 | GB |
| Elvis Presley | Always On My Mind | 1972 | Discogs | 1972 | – | 1973 | US |
| Elvis Presley | Are You Lonesome Tonight? | 1961 | Discogs | 1961 | – | 2016 | US |
| Elvis Presley | Blue Suede Shoes | 1956 | Discogs + Spotify | 1956 | – | 1956 | US |
| Elvis Presley | Burning Love | 1972 | Discogs | 1972 | – | 1973 | US |
| Elvis Presley | Can't Help Falling in Love | 1961 | Spotify (MusicBrainz: 1969) | 1982 | 1969 | 1961 | US |
| Elvis Presley | Heartbreak Hotel | 1956 | Discogs | 1956 | – | 2002 | US |
| Elvis Presley | In the Ghetto | 1969 | Discogs + Spotify | 1969 | – | 1969 | US |
| Elvis Presley | Jailhouse Rock | 1957 | Discogs + MusicBrainz+Wikipedia | 1957 | 1957 | 1958 | US |
| Elvis Presley | Love Me Tender | 1956 | Discogs | 1956 | – | 2002 | US |
| Elvis Presley | Surrender | 1961 | Discogs | 1961 | – | 2002 | US |
| Elvis Presley | Suspicious Minds | 1969 | Discogs + Spotify | 1969 | – | 1969 | US |
| Elzbieta Wojnowska | Zaproście mnie do stołu | 1978 | Discogs | 1978 | – | 2015 | ? |
| Elżbieta Mielczarek | Poczekalnia PKP | 1983 | MusicBrainz (Spotify: 2005) | – | 1983 | 2005 | PL |
| Emeli Sandé | Next To Me | 2012 | Discogs + Spotify | 2012 | – | 2012 | GB |
| Emerson, Lake & Palmer | C'est La Vie | 1977 | Spotify (MusicBrainz: 1979) | 2020 | 1979 | 1977 | GB |
| Emerson, Lake & Palmer | From the Beginning | 1972 | Discogs + Spotify | 1972 | – | 1972 | GB |
| Emerson, Lake & Palmer | Lucky Man | 1970 | Discogs + Spotify | 1970 | – | 1970 | GB |
| EMF | Unbelievable | 1990 | Discogs | 1990 | – | 1991 | GB |
| Emigranci | Na Falochronie | 1992 | Discogs | 1992 | – | 1994 | PL |
| Eminem | Lose Yourself | 2002 | Discogs + MusicBrainz+Wikipedia | 2002 | 2002 | 2014 | US |
| Eminem | The Real Slim Shady | 2000 | Discogs + Spotify | 2000 | – | 2000 | US |
| Eminem | Without Me | 2002 | Discogs + Spotify | 2002 | – | 2002 | US |
| Eminem & Dido | Stan | 2000 | Discogs + Spotify | 2000 | – | 2000 | US |
| Eminem & Rihanna | The Monster | 2013 | Discogs + Spotify | 2013 | – | 2013 | US |
| Empire Of The Sun | Walking On A Dream | 2008 | Discogs + Spotify | 2008 | – | 2008 | AU |
| En Vogue | My Lovin' (You're Never Gonna Get It) | 1992 | Spotify + MusicBrainz | – | 1992 | 1992 | US |
| Enej | Skrzydlate ręce | 2012 | MusicBrainz+Wikipedia | 2021 | 2012 | – | PL |
| Enej & Bum Bum Orkestar | Bal | 2026 | Spotify | – | – | 2026 | PL |
| Ennio Morricone | Gabriel's Oboe | 1986 | Spotify + MusicBrainz | 2004 | 1986 | 1986 | IT |
| Ennio Morricone & Carlo Nistri | Chi Mai | 1971 | Discogs | 1971 | – | 2014 | IT |
| Enya | Caribbean Blue | 1991 | Discogs | 1991 | – | 2001 | IE |
| Enya | May It Be | 2001 | Discogs + Spotify | 2001 | – | 2001 | IE |
| Enya | Only Time | 2000 | Discogs + Spotify | 2000 | – | 2000 | IE |
| Enya | Orinoco Flow | 1988 | Discogs + Spotify | 1988 | – | 1988 | IE |
| Eric Carmen | All By Myself | 1975 | Discogs + Spotify | 1975 | – | 1975 | US |
| Eric Carmen | Hungry Eyes | 1987 | Discogs | 1987 | – | 1997 | US |
| Eric Clapton | Cocaine | 1977 | Discogs + Spotify | 1977 | – | 1977 | GB |
| Eric Clapton | I Shot The Sheriff | 1974 | Discogs + Spotify | 1974 | – | 1974 | GB |
| Eric Clapton | Layla | 1971 | Discogs | 1971 | – | 1992 | GB |
| Eric Clapton | My Father's Eyes | 1992 | MusicBrainz (Spotify: 1998) | – | 1992 | 1998 | GB |
| Eric Clapton | River of Tears | 1998 | Discogs + Spotify | 1998 | – | 1998 | GB |
| Eric Clapton | Tears in Heaven | 1991 | Discogs | 1991 | – | 1999 | GB |
| Eric Clapton | Wonderful Tonight | 1977 | Discogs + Spotify | 1977 | – | 1977 | GB |
| Eric Prydz | Call on Me | 2004 | Discogs + Spotify | 2004 | – | 2004 | SE |
| Erma Franklin | Piece of My Heart | 1967 | Discogs | 1967 | – | 2009 | US |
| Eros Ramazzotti | Se bastasse una canzone | 1990 | Discogs | 1990 | – | 1997 | IT |
| Eros Ramazzotti & Tina Turner | Cose Della Vita | 1993 | Discogs | 1993 | – | 2004 | IT |
| Eruption | I Can't Stand the Rain | 1977 | MusicBrainz (Spotify: 2011) | – | 1977 | 2011 | GB |
| Eruption | One Way Ticket | 1978 | Discogs | 1978 | – | 2011 | GB |
| Erykah Badu | Didn't Cha Know | 2000 | Spotify + MusicBrainz | – | 2000 | 2000 | US |
| Erykah Badu | On & On | 1996 | Discogs | 1996 | – | 1997 | US |
| Etta James | At Last | 1960 | Discogs + Spotify | 1960 | – | 1960 | US |
| Etta James | I Just Want To Make Love To You | 1960 | Discogs + Spotify | 1960 | – | 1960 | US |
| Etta James | I'd Rather Go Blind | 1968 | Spotify (MusicBrainz: 1983) | – | 1983 | 1968 | US |
| Etta James | Something's Got A Hold On Me | 1962 | MusicBrainz (Spotify: 1990) | – | 1962 | 1990 | US |
| Eugeniusz Bodo | Umówiłem się z nią na dziewiątą | 2005 | MusicBrainz (Spotify: 2016) | – | 2005 | 2016 | CH |
| Europe | Carrie | 1986 | Discogs + Spotify | 1986 | – | 1986 | SE |
| Europe | Rock the Night | 1985 | Discogs | 1985 | – | 1986 | SE |
| Europe | The Final Countdown | 1986 | Discogs + MusicBrainz+Wikipedia + Spotify | 1986 | 1986 | 1986 | SE |
| Eurythmics | Sweet Dreams (Are Made of This) | 1983 | Discogs + MusicBrainz+Wikipedia + Spotify | 1983 | 1983 | 1983 | GB |
| Eurythmics & Annie Lennox | Here Comes the Rain Again | 1983 | Discogs + Spotify | 1983 | – | 1983 | GB |
| Eurythmics & Annie Lennox | There Must Be an Angel | 1985 | Discogs | 1985 | – | 1991 | GB |
| Eva Cassidy | Autumn Leaves | 1996 | Spotify + MusicBrainz | 1998 | 1996 | 1996 | US |
| Eva Cassidy | Fields Of Gold (Songbird) | 1998 | Discogs + Spotify | 1998 | – | 1998 | US |
| Evanescence | Bring Me To Life | 2003 | Discogs + Spotify | 2003 | – | 2003 | US |
| Evanescence | My Immortal | 2000 | Discogs | 2000 | – | 2003 | US |
| Everlast | What It's Like | 1998 | Spotify + MusicBrainz | 2004 | 1998 | 1998 | US |
| Everything But The Girl | Missing | 1994 | Discogs + Spotify | 1994 | – | 1994 | GB |
| Ewa Bem | Powrotna bossa nova | 2021 | Discogs + Spotify | 2021 | – | 2021 | PL |
| Ewa Bem | Serce to jest muzyk | 2001 | MusicBrainz (Spotify: 2014) | – | 2001 | 2014 | PL |
| Ewa Bem | To cześć | 2007 | Discogs | 2007 | – | 2021 | PL |
| Ewa Bem | Żyj kolorowo | 1993 | Discogs | 1993 | – | 2014 | PL |
| Ewa Bem & Bemibek | Sprzedaj mnie wiatrowi | 2015 | Spotify | 2021 | – | 2015 | PL |
| Ewa Farna | Ciało | 2021 | Spotify + MusicBrainz | 2022 | 2021 | 2021 | PL |
| Ewa Farna | Cicho | 2009 | Discogs + MusicBrainz+Wikipedia + Spotify | 2009 | 2009 | 2009 | PL |
| Ewa Farna | Ewakuacja | 2010 | Spotify + MusicBrainz | 2011 | 2010 | 2010 | PL |
| Ewelina Flinta | Zaluje (Insanity) | 2003 | Spotify + MusicBrainz | – | 2003 | 2003 | PL |
| Ewelina Flinta & Łukasz Zagrobelny | Nie kłam że mnie kochasz | 2008 | Spotify | – | – | 2008 | PL |
| Ewelina Lisowska | Nieodporny Rozum | 2012 | MusicBrainz (Spotify: 2013) | – | 2012 | 2013 | PL |
| Ewelina Lisowska | W Stronę Słońca | 2012 | Spotify + MusicBrainz | – | 2012 | 2012 | PL |
| Exodus | Jeszcze czekam | 1981 | Spotify (MusicBrainz: 1983) | 1982 | 1983 | 1981 | US |
| Extreme | More Than Words | 1990 | Discogs + Spotify | 1990 | – | 1990 | US |
| F.R. David | Words | 1982 | Discogs | 1982 | – | 1983 | FR |
| Faith Hill | Breathe | 1999 | Discogs + Spotify | 1999 | – | 1999 | US |
| Faith Hill | This Kiss | 1998 | Discogs | 1998 | – | 2007 | US |
| Faith No More | Easy | 1992 | Discogs + Spotify | 1992 | – | 1992 | US |
| Faith No More | Epic | 1989 | Discogs + Spotify | 1989 | – | 1989 | US |
| Faith No More | Evidence | 1995 | Discogs + Spotify | 1995 | – | 1995 | US |
| Faith No More | Midlife Crisis | 1992 | Discogs + Spotify | 1992 | – | 1992 | US |
| Faithless | God Is a DJ | 1998 | Discogs | 1998 | – | 2005 | GB |
| Faithless | Insomnia | 1995 | Discogs | 1995 | – | 1996 | GB |
| Falco | Jeanny | 1985 | Discogs + Spotify | 1985 | – | 1985 | AT |
| Falco | Rock Me Amadeus | 1985 | Discogs + MusicBrainz+Wikipedia + Spotify | 1985 | 1985 | 1985 | AT |
| Fancy | Flames Of Love | 1988 | Discogs | 1988 | – | 2010 | DE |
| Farba | Chcę tu zostać | 2010 | Discogs | 2010 | – | 2011 | PL |
| Farben Lehre | Anioły i Demony | 2012 | Discogs + Spotify | 2012 | – | 2012 | PL |
| Farben Lehre | Matura 2001 | 2001 | Discogs | 2001 | – | 2005 | PL |
| Farruko | Pepas | 2021 | Discogs + Spotify | 2021 | – | 2021 | PR |
| Faster Pussycat | House of Pain | 1989 | Discogs + Spotify | 1989 | – | 1989 | US |
| Fatboy Slim | Right Here, Right Now | 1998 | Discogs + Spotify | 1998 | – | 1998 | GB |
| Fatboy Slim | Sunset (Bird of Prey) | 2000 | Discogs + Spotify | 2000 | – | 2000 | GB |
| Feel | A gdy jest już ciemno | 2007 | Discogs + MusicBrainz+Wikipedia | 2007 | 2007 | – | PL |
| Feel | Jak anioła głos | 2007 | Discogs + Spotify | 2007 | – | 2007 | PL |
| Feel | No pokaż na co cię stać | 2007 | Discogs + Spotify | 2007 | – | 2007 | PL |
| Felicjan Andrzejczak | Czas ołowiu | 2013 | Spotify | – | – | 2013 | PL |
| Felicjan Andrzejczak | Jolka, jolka pamiętasz | 2013 | Spotify (MusicBrainz: 2014) | – | 2014 | 2013 | PL |
| Felicjan Andrzejczak | Noc komety | 2013 | Spotify | – | – | 2013 | PL |
| felix jaehn & Jasmine Thompson | Ain't Nobody (Loves Me Better) | 2018 | Discogs + Spotify | 2018 | – | 2018 | DE |
| Fiction Factory | (Feels Like) Heaven | 1983 | Discogs | 1983 | – | 1984 | GB |
| Filip Lato | Jutro | 2026 | Spotify | – | – | 2026 | PL |
| Fine Young Cannibals | Good Thing | 1988 | Discogs + Spotify | 1988 | – | 1988 | GB |
| Fine Young Cannibals | She Drives Me Crazy | 1988 | Discogs + Spotify | 1988 | – | 1988 | GB |
| Firehouse | Don't Treat Me Bad | 1990 | Spotify + MusicBrainz | – | 1990 | 1990 | US |
| Fish | Cliche | 1990 | Discogs + Spotify | 1990 | – | 1990 | GB |
| Fish | Vigil | 1990 | Discogs + Spotify | 1990 | – | 1990 | GB |
| Fisz & Novika | 30 cm | 2001 | Discogs + Spotify | 2001 | – | 2001 | PL |
| Fisz Emade Tworzywo | Biegnij Dalej Sam | 2016 | Discogs + Spotify | 2016 | – | 2016 | PL |
| Fisz Emade Tworzywo | Dwa ognie | 2019 | Discogs + Spotify | 2019 | – | 2019 | PL |
| Fisz Emade Tworzywo | Jestem w niebie | 2019 | Discogs + Spotify | 2019 | – | 2019 | PL |
| Fisz Emade Tworzywo | Ok Boomer | 2021 | Spotify + MusicBrainz | – | 2021 | 2021 | PL |
| Fisz Emade Tworzywo | Telefon | 2016 | Discogs + Spotify | 2016 | – | 2016 | PL |
| Fisz Emade Tworzywo | Za Mało Czasu | 2021 | Discogs + Spotify | 2021 | – | 2021 | PL |
| Fisz Emade Tworzywo & Justyna Święs | Ślady | 2014 | Discogs + Spotify | 2014 | – | 2014 | PL |
| FKA twigs | Two Weeks | 2014 | Discogs + Spotify | 2014 | – | 2014 | GB |
| Flash & The Pain | Lights in the Night | 1980 | Discogs | 1980 | – | 2013 | GB |
| Flash and the Pan | Welcome To The Universe | 1980 | Discogs + MusicBrainz | 1980 | 1980 | 1995 | AU |
| Fleet Foxes | White Winter Hymnal | 2008 | Discogs + Spotify | 2008 | – | 2008 | US |
| Fleetwood Mac | Albatross | 1968 | Discogs | 1968 | – | 1969 | GB |
| Fleetwood Mac | Don't Stop | 1977 | Spotify + MusicBrainz | – | 1977 | 1977 | GB |
| Fleetwood Mac | Dreams | 1977 | Discogs + MusicBrainz+Wikipedia + Spotify | 1977 | 1977 | 1977 | GB |
| Fleetwood Mac | Everywhere | 1987 | Discogs + Spotify | 1987 | – | 1987 | GB |
| Fleetwood Mac | Go Your Own Way | 1976 | Discogs | 1976 | – | 1977 | GB |
| Fleetwood Mac | Landslide | 1975 | Discogs + Spotify | 1975 | – | 1975 | GB |
| Fleetwood Mac | Little Lies | 1987 | Discogs + Spotify | 1987 | – | 1987 | GB |
| Fleetwood Mac | Oh Well (Pt. 1) | 1970 | MusicBrainz (Spotify: 2018) | – | 1970 | 2018 | GB |
| Fleetwood Mac | Seven Wonders | 1987 | Discogs + Spotify | 1987 | – | 1987 | GB |
| Fleetwood Mac | Songbird | 1977 | Discogs + Spotify | 1977 | – | 1977 | GB |
| Fleetwood Mac | The Chain | 1977 | Discogs + Spotify | 1977 | – | 1977 | GB |
| Flirtini & Bitamina | Nikt | 2018 | Spotify | – | – | 2018 | PL |
| Flirtini & Suwal | Szukam | 2016 | Discogs + Spotify | 2016 | – | 2016 | PL |
| Flo Rida | Good Feeling | 2011 | Discogs | 2011 | – | 2012 | US |
| Flo Rida & Sia | Wild Ones | 2012 | Discogs + Spotify | 2012 | – | 2012 | US |
| Florence + The Machine | Cosmic Love | 2009 | Discogs + Spotify | 2009 | – | 2009 | GB |
| Florence + The Machine | Dog Days Are Over | 2008 | Discogs + MusicBrainz | 2008 | 2008 | 2009 | GB |
| Florence + The Machine | Queen Of Peace | 2015 | Discogs + Spotify | 2015 | – | 2015 | GB |
| Florence + The Machine | You've Got The Love | 2008 | MusicBrainz (Spotify: 2009) | 2014 | 2008 | 2009 | GB |
| Foals | Spanish Sahara | 2010 | Discogs + Spotify | 2010 | – | 2010 | GB |
| Focus | Hocus Pocus | 1971 | Discogs + Spotify | 1971 | – | 1971 | NL |
| Focus | Sylvia | 1972 | Discogs + Spotify | 1972 | – | 1972 | NL |
| Fontaines D.C. | I Love You | 2022 | Spotify + MusicBrainz | – | 2022 | 2022 | IE |
| Foo Fighters | Everlong | 1997 | Discogs + Spotify | 1997 | – | 1997 | US |
| Foo Fighters | The Pretender | 2007 | Discogs + Spotify | 2007 | – | 2007 | US |
| Foo Fighters | Walk | 2011 | Discogs + Spotify | 2011 | – | 2011 | US |
| Foo Fighters | Walking After You | 1997 | Discogs + Spotify | 1997 | – | 1997 | US |
| Fools Garden | Lemon Tree | 1995 | Discogs + Spotify | 1995 | – | 1995 | DE |
| Foreigner | Cold as Ice | 1977 | Discogs + Spotify | 1977 | – | 1977 | US |
| Foreigner | I Want to Know What Love Is | 1984 | Discogs + Spotify | 1984 | – | 1984 | US |
| Foreigner | Waiting for a Girl like You | 1981 | Discogs + Spotify | 1981 | – | 1981 | US |
| Formacja Niezywych Schabuff | Da Da Da | 1998 | Discogs + Spotify | 1998 | – | 1998 | PL |
| Formacja Niezywych Schabuff | Klub wesołego szampana | 1994 | Discogs | 1994 | – | 2005 | PL |
| Foster The People | Pumped Up Kicks | 2010 | Discogs | 2010 | – | 2011 | US |
| Four Tops | Reach Out I'll Be There | 1966 | Discogs (ponowne sprawdzenie) | 1966 | 1967 | 1967 | US |
| Francis Lai | Theme From Love Story | 1970 | Discogs + Spotify | 1970 | – | 1970 | FR |
| Franek Kimono | King Bruce Lee Karate Mistrz | 1984 | Discogs | 1984 | – | 2008 | PL |
| Frank Ocean | Lost | 2012 | Discogs + Spotify | 2012 | – | 2012 | US |
| Frank Ocean | Thinkin Bout You | 2012 | Discogs + Spotify | 2012 | – | 2012 | US |
| Frank Sinatra | I've Got You Under My Skin | 1970 | Discogs | 1970 | – | 2015 | US |
| Frank Sinatra | My Way | 1969 | MusicBrainz+Wikipedia + Spotify | – | 1968 | 1969 | US |
| Frank Sinatra | Night And Day | 1942 | Discogs | 1942 | – | 1957 | US |
| Frank Sinatra | Strangers In The Night | 1966 | Discogs + Spotify | 1966 | – | 1966 | US |
| Frank Sinatra | Theme From New York, New York | 1980 | Discogs | 1980 | – | 2008 | US |
| Frank Sinatra & Carson Parks | Something Stupid feat. Antonia | 2020 | Spotify | – | – | 2020 | US |
| Frank Sinatra & Count Basie | Fly Me To The Moon (In Other Words) | 1964 | Discogs + MusicBrainz | 1964 | 1964 | 1962 | US |
| Frank Sinatra & Nancy Sinatra | Somethin' Stupid | 1967 | Discogs + Spotify | 1967 | – | 1967 | US |
| Frank Zappa | Bobby Brown Goes Down | 1989 | Discogs + MusicBrainz | 1989 | 1989 | 1979 | US |
| Frankie Goes To Hollywood | Relax (Come Fighting) | 1984 | Discogs + Spotify | 1984 | – | 1984 | GB |
| Frankie Goes To Hollywood | The Power Of Love | 1984 | Discogs + Spotify | 1984 | – | 1984 | GB |
| Frankie Goes To Hollywood | Welcome To The Pleasuredome | 1984 | Spotify + MusicBrainz | 1985 | 1984 | 1984 | GB |
| Frankie Valli | Can't Take My Eyes off You | 1967 | Spotify + MusicBrainz | – | 1967 | 1967 | US |
| Frankie Valli | Grease | 1978 | Discogs + Spotify | 1978 | – | 1978 | US |
| Frankie Valli | My Eyes Adored You | 1974 | Discogs | 1974 | – | 1975 | US |
| Franz Ferdinand | Take Me Out | 2003 | Discogs + MusicBrainz | 2003 | 2003 | 2004 | GB |
| Freddie Mercury | I Was Born to Love You | 1985 | Discogs | 1985 | – | 2016 | GB |
| Freddie Mercury & Serge Ramaekers | Living On My Own | 1985 | Discogs | 1985 | – | 2016 | GB |
| Free | All Right Now | 1970 | Discogs + Spotify | 1970 | – | 1970 | GB |
| Free | Wishing Well | 1973 | Discogs + Spotify | 1973 | – | 1973 | GB |
| Frida | I Know There's Something Going On | 1982 | Spotify + MusicBrainz | 1994 | 1982 | 1982 | SE |
| Fryderyk Chopin & Natalia Kukulska | Czułe struny [Polonez As-dur] | 2020 | Spotify | – | – | 2020 | PL |
| Fugazi | Waiting Room | 1988 | Discogs | 1988 | – | 1989 | US |
| Fugees & Ms. Lauryn Hill | Killing Me Softly With His Song | 1996 | Discogs + Spotify | 1996 | – | 1996 | US |
| Fugees & Ms. Lauryn Hill | Ready or Not | 1996 | Discogs + Spotify | 1996 | – | 1996 | US |
| Fukaj & Vito Bambino | Zabiorę Cię Tam | 2026 | Discogs + MusicBrainz | 2026 | 2026 | 2025 | PL |
| Fun Lovin' Criminals | Scooby Snacks | 1996 | Discogs + Spotify | 1996 | – | 1996 | US |
| fun. & Janelle Monáe | We Are Young | 2012 | Spotify + MusicBrainz | – | 2012 | 2012 | US |
| Future Islands | Seasons (Waiting on You) | 2014 | Discogs + Spotify | 2014 | – | 2014 | US |
| Gabriel Fleszar | Kroplą Deszczu | 1999 | Discogs | 1999 | – | 2015 | PL |
| Gabriella Cilmi | Sweet About Me | 2008 | Discogs + Spotify | 2008 | – | 2008 | AU |
| Gala | Freed from Desire | 1996 | Discogs + MusicBrainz+Wikipedia | 1996 | 1996 | 1997 | IT |
| Garbage | I Think I'm Paranoid | 1998 | Spotify + MusicBrainz | – | 1998 | 1998 | US |
| Garbage | Milk | 1995 | Discogs + Spotify | 1995 | – | 1995 | US |
| Garbage | Only Happy When It Rains | 1995 | Discogs + Spotify | 1995 | – | 1995 | US |
| Gary Glitter | Rock 'n' Roll (Part 2) | 1973 | Spotify (MusicBrainz: 1977) | 1987 | 1977 | 1973 | GB |
| Gary Jules & Michael Andrews | Mad World | 2001 | Spotify + MusicBrainz | 2003 | 2001 | 2001 | US |
| Gary Moore | Empty Rooms | 1983 | Spotify + MusicBrainz | 1984 | 1983 | 1983 | GB |
| Gary Moore | Still Got The Blues | 1990 | Discogs + Spotify | 1990 | – | 1990 | GB |
| Gary Moore & Phil Lynott | Out In The Fields | 1985 | Discogs + Spotify | 1985 | – | 1985 | GB |
| Gary Moore & Phil Lynott | Parisienne Walkways | 1978 | Discogs + Spotify | 1978 | – | 1978 | GB |
| Gary Numan | Cars | 1979 | Discogs + Spotify | 1979 | – | 1979 | GB |
| GAYLE | abcdefu | 2021 | Discogs + Spotify | 2021 | – | 2021 | US |
| Gazebo | I Like Chopin | 1983 | Discogs | 1983 | – | 1994 | IT |
| Gene Kelly | Singin' In The Rain | 1952 | Discogs + Spotify | 1952 | – | 1952 | US |
| Genesis | Blood On The Rooftops | 1976 | Discogs + Spotify | 1976 | – | 1976 | GB |
| Genesis | Calling All Stations | 1997 | Discogs | 1997 | – | 2004 | GB |
| Genesis | Carpet Crawlers | 1974 | Discogs + Spotify | 1974 | – | 1974 | GB |
| Genesis | Congo | 1997 | Discogs | 1997 | – | 1999 | GB |
| Genesis | Dancing With The Moonlit Knight | 1973 | Discogs + Spotify | 1973 | – | 1973 | GB |
| Genesis | Entangled | 1976 | Discogs + Spotify | 1976 | – | 1976 | GB |
| Genesis | Firth Of Fifth | 1973 | Discogs + Spotify | 1973 | – | 1973 | GB |
| Genesis | Follow You Follow Me | 1978 | Discogs + Spotify | 1978 | – | 1978 | GB |
| Genesis | Home By The Sea | 1983 | Discogs | 1983 | – | 2004 | GB |
| Genesis | I Can't Dance | 1991 | Spotify (MusicBrainz: 1992) | – | 1992 | 1991 | GB |
| Genesis | I Know What I Like (In Your Wardrobe) | 1973 | Discogs + Spotify | 1973 | – | 1973 | GB |
| Genesis | Land Of Confusion | 1986 | Discogs + Spotify | 1986 | – | 1986 | GB |
| Genesis | Mama | 1983 | Discogs + Spotify | 1983 | – | 1983 | GB |
| Genesis | No Son Of Mine | 1991 | Discogs | 1991 | – | 2004 | GB |
| Genesis | Turn It On Again | 1980 | Discogs + Spotify | 1980 | – | 1980 | GB |
| George Ezra | Budapest | 2013 | Discogs | 2013 | – | 2014 | GB |
| George Ezra | Shotgun | 2018 | Discogs + Spotify | 2018 | – | 2018 | GB |
| George Harrison | Got My Mind Set on You | 1987 | Discogs + Spotify | 1987 | – | 1987 | GB |
| George Harrison | My Sweet Lord | 1970 | Discogs + Spotify | 1970 | – | 1970 | GB |
| George Harrison | What Is Life | 1970 | Discogs + Spotify | 1970 | – | 1970 | GB |
| George McCrae | Rock Your Baby | 1974 | Discogs | 1974 | – | 2010 | US |
| George Michael | Careless Whisper | 1984 | Discogs + Spotify | 1984 | – | 1984 | GB |
| George Michael | Faith | 1987 | Discogs + Spotify | 1987 | – | 1987 | GB |
| George Michael | Fastlove, Pt. 1 | 1996 | Spotify (MusicBrainz: 2013) | 2019 | 2013 | 1996 | GB |
| George Michael | Father Figure | 1987 | Discogs + Spotify | 1987 | – | 1987 | GB |
| George Michael | Freedom! '90 | 1990 | Discogs + Spotify | 1990 | – | 1990 | GB |
| George Michael | Jesus to a Child | 1996 | Discogs + Spotify | 1996 | – | 1996 | GB |
| George Michael | Older | 1996 | Discogs + Spotify | 1996 | – | 1996 | GB |
| George Michael | Praying for Time | 1990 | Discogs | 1990 | – | 1998 | GB |
| George Michael & Mary J. Blige | As | 1998 | Spotify + MusicBrainz | – | 1998 | 1998 | GB |
| Gerry & The Pacemakers | You'll Never Walk Alone | 1963 | Spotify + MusicBrainz | – | 1963 | 1963 | ? |
| Gerry Rafferty | Baker Street | 1978 | Discogs + Spotify | 1978 | – | 1978 | GB |
| Gerry Rafferty | Right Down the Line | 1978 | Discogs + Spotify | 1978 | – | 1978 | GB |
| Gibbs & Kukon | Ty masz | 2026 | Discogs + Spotify | 2026 | – | 2026 | PL |
| Gibson Brothers | Que Sera Mi Vida | 1979 | Discogs | 1979 | – | 2011 | FR |
| GIGI D'AGOSTINO | L'Amour Toujours | 1999 | MusicBrainz (Spotify: 2001) | – | 1999 | 2001 | IT |
| Gigi Perez | Sailor Song | 2025 | Discogs + Spotify | 2025 | – | 2025 | US |
| Gilbert Bécaud | Nathalie | 1964 | Discogs | 1964 | – | 2011 | FR |
| Gilbert O'Sullivan | Alone Again (Naturally) | 1972 | Discogs + Spotify | 1972 | – | 1972 | IE |
| Gilbert O'Sullivan | Clair | 1972 | Discogs + Spotify | 1972 | – | 1972 | IE |
| Gipsy Kings | Bamboléo | 1987 | Discogs + Spotify | 1987 | – | 1987 | FR |
| Gladys Knight | Licence To Kill | 1989 | Discogs | 1989 | – | 2001 | US |
| Glass Animals | Heat Waves | 2020 | Discogs + Spotify | 2020 | – | 2020 | GB |
| Glen Hansard & Marketa Irglova | Falling Slowly | 2006 | Discogs | 2006 | – | 2008 | ? |
| Glenn Frey | You Belong To The City | 1985 | Discogs | 1985 | – | 2018 | US |
| Glenn Medeiros | Nothing's Gonna Change My Love For You | 1986 | Spotify + MusicBrainz | – | 1986 | 1986 | US |
| Glenn Miller | In the Mood | 1953 | Discogs | 1953 | – | 1996 | US |
| Gloria Gaynor | I Will Survive | 1978 | Discogs + MusicBrainz+Wikipedia + Spotify | 1978 | 1978 | 1978 | US |
| Gnarls Barkley | Crazy | 2006 | Discogs + MusicBrainz+Wikipedia | 2006 | 2006 | 2007 | US |
| Golden Earring | Radar Love | 1973 | Discogs | 1973 | – | 2008 | NL |
| Golden Life | 24.11.94 | 2004 | MusicBrainz (Spotify: 2012) | – | 2004 | 2012 | PL |
| Golden Life | Oprocz - Blekitnego Nieba | 1993 | Spotify | 2012 | – | 1993 | PL |
| Goldfrapp | Annabel | 2013 | Discogs + Spotify | 2013 | – | 2013 | GB |
| GOLEC UORKIESTRA | Crazy Is My Life | 1999 | Discogs | 1999 | – | 2013 | PL |
| Golec uOrkiestra | Ściernisco | 2000 | Discogs + MusicBrainz+Wikipedia | 2000 | 2000 | – | PL |
| Goran Bregović & Slobodan Salijevic | Kalasnjikov | 1995 | Discogs | 1995 | – | 1998 | BA |
| Gorillaz & De La Soul | Feel Good Inc. | 2005 | Discogs + Spotify | 2005 | – | 2005 | GB |
| Gorillaz & Del The Funky Homosapien | Clint Eastwood | 2000 | Discogs | 2000 | – | 2001 | GB |
| Gorillaz & Shaun Ryder | DARE | 2005 | Discogs + Spotify | 2005 | – | 2005 | GB |
| Gosia Andrzejewicz | Pozwól żyć | 2006 | Spotify + MusicBrainz | 2007 | 2006 | 2006 | PL |
| Gossip | Heavy Cross | 2009 | Discogs + Spotify | 2009 | – | 2009 | US |
| Gossip | Standing in the Way of Control | 2005 | Discogs | 2005 | – | 2006 | US |
| Gotan Project | Santa María (del Buen Ayre) | 2001 | Discogs + Spotify | 2001 | – | 2001 | FR |
| Gotye | Hearts A Mess | 2006 | Discogs + Spotify | 2006 | – | 2006 | AU |
| Gotye | Somebody That I Used to Know | 2011 | Discogs + MusicBrainz+Wikipedia + Spotify | 2011 | 2011 | 2011 | AU |
| Goya | Mój | 2005 | Spotify + MusicBrainz | – | 2005 | 2005 | PL |
| Goya | Smak słów | 2005 | Discogs + Spotify | 2005 | – | 2005 | PL |
| Goya | Tylko mnie kochaj | 2006 | Spotify + MusicBrainz | – | 2006 | 2006 | PL |
| Grace Jones | I've Seen That Face Before (Libertango) | 1981 | MusicBrainz (Spotify: 1998) | – | 1981 | 1998 | US |
| Gracie Abrams | That’s So True | 2024 | Spotify + MusicBrainz | – | 2024 | 2024 | US |
| Grand Funk Railroad | Inside Looking Out | 1969 | Discogs + Spotify | 1969 | – | 1969 | US |
| Grandmaster Flash & The Furious Five | The Message | 1982 | Discogs | 1982 | – | 2010 | US |
| Grażyna Łobaszewska | Brzydcy | 1989 | Discogs | 1989 | – | 2013 | PL |
| Grażyna Łobaszewska | Czas nas uczy pogody | 1984 | Discogs | 1984 | – | 2015 | PL |
| Grażyna Łobaszewska | Gdybyś | 1978 | Discogs | 1978 | – | 2015 | PL |
| Great White | Once Bitten Twice Shy | 1989 | Discogs + Spotify | 1989 | – | 1989 | US |
| Green Day | American Idiot | 2004 | Discogs + Spotify | 2004 | – | 2004 | US |
| Green Day | Basket Case | 1994 | Discogs + Spotify | 1994 | – | 1994 | US |
| Green Day | Boulevard of Broken Dreams | 2004 | Discogs + Spotify | 2004 | – | 2004 | US |
| Green Day | Wake Me up When September Ends | 2004 | Discogs + Spotify | 2004 | – | 2004 | US |
| Greta Van Fleet | Age of Machine | 2021 | Discogs + Spotify | 2021 | – | 2021 | US |
| Greta Van Fleet | Highway Tune | 2017 | Discogs + Spotify | 2017 | – | 2017 | US |
| Grimes | Oblivion | 2012 | Discogs + Spotify | 2012 | – | 2012 | CA |
| Grizzly Bear | Two Weeks | 2009 | Discogs + Spotify | 2009 | – | 2009 | US |
| Groove Armada | Superstylin' | 2001 | Discogs + Spotify | 2001 | – | 2001 | GB |
| Grubson | Na Szczycie | 2009 | Discogs + Spotify | 2009 | – | 2009 | PL |
| Grzegorz Hyży | O Pani! | 2017 | Spotify + MusicBrainz | – | 2017 | 2017 | PL |
| Grzegorz Hyży & Tabb | Na Chwile | 2014 | Spotify + MusicBrainz | – | 2014 | 2014 | PL |
| Grzegorz Hyży & Tabb | Pusty dom | 2014 | Spotify + MusicBrainz | – | 2014 | 2014 | PL |
| Grzegorz Hyży & Tabb | Wstaje | 2014 | Spotify + MusicBrainz | – | 2014 | 2014 | PL |
| Grzegorz Markowski | Ballada 07 | 2015 | Spotify | – | – | 2015 | PL |
| Grzegorz Szczepaniak & ABC | Asfaltowe Łąki | 2015 | Spotify | – | – | 2015 | PL |
| Grzegorz Turnau | Bracka | 1995 | Discogs + Spotify | 1995 | – | 1995 | PL |
| Grzegorz Turnau | Cichosza | 1993 | Discogs + Spotify | 1993 | – | 1993 | PL |
| Grzegorz Turnau | Czas Blekitu | 2005 | Discogs + Spotify | 2005 | – | 2005 | PL |
| Grzegorz Turnau | Miedzy Cisza A Cisza | 1995 | Discogs + Spotify | 1995 | – | 1995 | PL |
| Grzegorz Turnau | Naprawdę nie dzieje się nic | 1991 | Discogs | 1991 | – | 1994 | PL |
| Grzegorz Turnau | Tutaj jestem | 1997 | Discogs + Spotify | 1997 | – | 1997 | PL |
| Grzegorz Turnau | Znów wędrujemy | 1991 | Discogs | 1991 | – | 1994 | PL |
| Grzegorz Turnau & Andrzej Sikorowski | Nie przenoście nam stolicy do Krakowa | 1994 | Discogs + Spotify | 1994 | – | 1994 | PL |
| Grzegorz Z Ciechowa | Piejo kury piejo | 1996 | Discogs | 1996 | – | 2004 | ? |
| Guns N' Roses | Civil War | 1991 | Discogs + Spotify | 1991 | – | 1991 | US |
| Guns N' Roses | Don't Cry | 1986 | Discogs (ponowne sprawdzenie) | 1986 | 1991 | 1991 | US |
| Guns N' Roses | Knockin' On Heaven's Door | 1991 | Spotify (MusicBrainz: 1992) | – | 1992 | 1991 | US |
| Guns N' Roses | November Rain | 1991 | Discogs + Spotify | 1991 | – | 1991 | US |
| Guns N' Roses | Paradise City | 1987 | Discogs + Spotify | 1987 | – | 1987 | US |
| Guns N' Roses | Sweet Child o' Mine | 1987 | Discogs + MusicBrainz+Wikipedia + Spotify | 1987 | 1987 | 1987 | US |
| Guns N' Roses | Welcome To The Jungle | 1986 | Discogs | 1986 | – | 1987 | US |
| Guns N' Roses | You Could Be Mine | 1991 | Discogs + Spotify | 1991 | – | 1991 | US |
| Guru Josh Project & Klaas | Infinity 2008 | 2008 | Discogs + Spotify | 2008 | – | 2008 | JE |
| GusGus | Over | 2011 | Discogs | 2011 | – | 2014 | IS |
| GusGus | Polyesterday | 1996 | Discogs | 1996 | – | 1997 | IS |
| Guus Meeuwis | Brabant | 2002 | Discogs | 2002 | – | 2006 | NL |
| Gwen Stefani & Akon | The Sweet Escape | 2006 | Discogs + Spotify | 2006 | – | 2006 | US |
| Haddaway | What Is Love | 1993 | Discogs + Spotify | 1993 | – | 1993 | DE |
| Halina Frackowiak | Bądź gotowy do drogi | 1974 | Discogs + Spotify | 1974 | – | 1974 | PL |
| Halina Frackowiak | Idę dalej | 1974 | Discogs + Spotify | 1974 | – | 1974 | PL |
| Halina Frackowiak | Papierowy księżyc | 1987 | Discogs + Spotify | 1987 | – | 1987 | PL |
| Halina Kunicka | Niech no tylko zakwitną jabłonie | 1967 | Discogs + Spotify | 1967 | – | 1967 | PL |
| Halina Kunicka | Od nocy do nocy | 1977 | Discogs + Spotify | 1977 | – | 1977 | PL |
| Halina Kunicka | Orkiestry dęte | 1970 | Discogs + Spotify | 1970 | – | 1970 | PL |
| Hania Kuzimowicz & The Voice of Poland | Trzy razy bardziej | 2025 | Spotify + MusicBrainz | – | 2025 | 2025 | PL |
| Hanna Banaszak | Nienawiść | 2015 | MusicBrainz (Spotify: 2020) | – | 2015 | 2020 | PL |
| Hanna Banaszak | Samba Przed Rozstaniem | 1998 | Discogs | 1998 | – | 2015 | PL |
| Happy End | Jak Się Masz Kochanie | 1977 | Discogs + Spotify | 1977 | – | 1977 | PL |
| Happy Mondays | Step On | 1990 | Discogs | 1990 | – | 1999 | GB |
| Happysad | Nadzy na mróz | 2017 | Discogs + Spotify | 2017 | – | 2017 | PL |
| Happysad | Zanim pójdę | 2004 | Discogs + Spotify | 2004 | – | 2004 | PL |
| Harold Faltermeyer | Axel F | 1984 | Discogs | 1984 | – | 1988 | DE |
| Harold Melvin & The Blue Notes & Teddy Pendergrass | Don't Leave Me This Way | 1975 | Spotify + MusicBrainz | – | 1975 | 1975 | US |
| Harry Belafonte | Jump in the Line | 1961 | Discogs + Spotify | 1961 | – | 1961 | US |
| Harry Nilsson | Everybody's Talkin' | 1968 | Spotify (MusicBrainz: 1988) | 2010 | 1988 | 1968 | US |
| Harry Nilsson | Without You | 1971 | Spotify (MusicBrainz: 1991) | – | 1991 | 1971 | US |
| Harry Styles | As It Was | 2022 | Discogs + MusicBrainz+Wikipedia + Spotify | 2022 | 2022 | 2022 | GB |
| Harry Styles | Sign of the Times | 2017 | Discogs + Spotify | 2017 | – | 2017 | GB |
| Harry Styles | Watermelon Sugar | 2019 | Discogs + Spotify | 2019 | – | 2019 | GB |
| Heart | Barracuda | 1977 | Discogs + Spotify | 1977 | – | 1977 | US |
| Herbie Hancock | Chameleon | 1973 | Discogs + Spotify | 1973 | – | 1973 | US |
| Hercules & Love Affair | Blind | 2008 | Discogs + Spotify | 2008 | – | 2008 | US |
| Herman's Hermits | My Sentimental Friend | 1969 | Discogs | 1969 | – | 1996 | GB |
| Herman's Hermits | No Milk Today | 1966 | Discogs | 1966 | – | 1996 | GB |
| Heroes Del Silencio | Entre dos tierras | 1990 | Discogs + Spotify | 1990 | – | 1990 | ES |
| Hey | Do Rycerzy, do Szlachty, do Mieszczan | 2012 | Discogs + Spotify | 2012 | – | 2012 | PL |
| Hey | Historie | 2016 | Discogs + Spotify | 2016 | – | 2016 | PL |
| Hey | Ja Sowa | 1994 | Discogs + Spotify | 1994 | – | 1994 | PL |
| Hey | List | 1995 | Discogs + Spotify | 1995 | – | 1995 | PL |
| Hey | Mimo Wszystko | 2005 | Discogs + Spotify | 2005 | – | 2005 | PL |
| Hey | Moja i twoja nadzieja | 1993 | Discogs + MusicBrainz+Wikipedia + Spotify | 1993 | 1993 | 1993 | PL |
| Hey | Teksański | 1993 | Discogs + MusicBrainz+Wikipedia + Spotify | 1993 | 1993 | 1993 | PL |
| Hey | Zazdrosc | 1993 | Discogs + Spotify | 1993 | – | 1993 | PL |
| Hey & Leszek Kaminski | [sic!] | 2001 | Spotify | – | – | 2001 | PL |
| Hey & Leszek Kaminski | Cisza, ja i czas | 2001 | Discogs + Spotify | 2001 | – | 2001 | PL |
| HIM | Join Me | 1999 | Discogs + Spotify | 1999 | – | 1999 | FI |
| Hole | Celebrity Skin | 1998 | Discogs + Spotify | 1998 | – | 1998 | US |
| Hot Butter | Popcorn | 1972 | Discogs | 1972 | – | 2005 | US |
| Hot Chip | Over And Over | 2005 | Discogs | 2005 | – | 2006 | GB |
| Hot Chip | Ready For The Floor | 2008 | Discogs + Spotify | 2008 | – | 2008 | GB |
| Hot Chocolate | Every 1's a Winner | 1978 | Discogs + Spotify | 1978 | – | 1978 | GB |
| Hot Chocolate | You Sexy Thing | 1975 | Discogs + Spotify | 1975 | – | 1975 | GB |
| Hot Hot Heat | Bandages | 2002 | Discogs + Spotify | 2002 | – | 2002 | CA |
| House Of Pain | Jump Around | 1992 | Discogs + Spotify | 1992 | – | 1992 | US |
| Hozier | Take Me To Church | 2013 | Discogs | 2013 | – | 2014 | IE |
| Hozier | Too Sweet | 2024 | Discogs + Spotify | 2024 | – | 2024 | IE |
| Human | Polski | 1993 | Discogs | 1993 | – | 2013 | US |
| Human | Słońce Moje | 2005 | MusicBrainz (Spotify: 2013) | – | 2005 | 2013 | US |
| HUNTR/X & EJAE | Golden | 2025 | Discogs + Spotify | 2025 | – | 2025 | US |
| Hurt | Załoga G | 2005 | Discogs + Spotify | 2005 | – | 2005 | PL |
| Hurts | Wonderful Life | 2010 | Discogs | 2010 | – | 2011 | GB |
| Ian Brown | F.E.A.R. | 2001 | Spotify + MusicBrainz | – | 2001 | 2001 | GB |
| Ich Troje | A Wszystko To...(Bo Ciebie Kocham) | 1999 | Discogs + Spotify | 1999 | – | 1999 | PL |
| Ich Troje | Powiedz | 2001 | Discogs + MusicBrainz+Wikipedia + Spotify | 2001 | 2001 | 2001 | PL |
| Ich Troje | Razem A Jednak Osobno | 2001 | Discogs + Spotify | 2001 | – | 2001 | PL |
| Ich Troje | Walczyk Bujaj Sie | 2003 | Spotify + MusicBrainz | – | 2003 | 2003 | PL |
| Ich Troje | Wypijmy Za To ! | 2001 | Discogs + Spotify | 2001 | – | 2001 | PL |
| Ich Troje | Zawsze Z Toba Chcialbym Byc... (Przez Miesiac :) ) | 2001 | Discogs + Spotify | 2001 | – | 2001 | PL |
| Icona Pop & Charli xcx | I Love It | 2012 | Discogs + Spotify | 2012 | – | 2012 | SE |
| Iggy Azalea & Rita Ora | Black Widow | 2014 | Discogs + Spotify | 2014 | – | 2014 | US |
| Iggy Pop | Candy | 1990 | Discogs + Spotify | 1990 | – | 1990 | US |
| Iggy Pop | Lust For Life | 1977 | Discogs + Spotify | 1977 | – | 1977 | US |
| Iggy Pop | Real Wild Child (Wild One) | 1986 | Discogs + Spotify | 1986 | – | 1986 | US |
| Iggy Pop | The Passenger | 1977 | Discogs + Spotify | 1977 | – | 1977 | US |
| Iggy Pop | TV Screen | 1993 | MusicBrainz (Spotify: 2013) | – | 1993 | 2013 | US |
| Igo | Bruce | 2025 | Discogs + Spotify | 2025 | – | 2025 | LV |
| Igor Herbut | Jak Ci jest? | 2026 | Discogs + Spotify | 2026 | – | 2026 | PL |
| Igor Herbut | Jasny | 2020 | Discogs + Spotify | 2020 | – | 2020 | PL |
| Igor Herbut | Wkręceni nie ufaj mi | 2013 | Spotify + MusicBrainz | – | 2013 | 2013 | PL |
| Ike & Tina Turner | Nutbush City Limits | 1978 | MusicBrainz (Spotify: 2003) | – | 1978 | 2003 | US |
| Imagine Dragons | Bad Liar | 2018 | Discogs + Spotify | 2018 | – | 2018 | US |
| Imagine Dragons | Believer | 2017 | Discogs + Spotify | 2017 | – | 2017 | US |
| Imagine Dragons | Demons | 2012 | Discogs + Spotify | 2012 | – | 2012 | US |
| Imagine Dragons | Radioactive | 2012 | Discogs + MusicBrainz+Wikipedia + Spotify | 2012 | 2012 | 2012 | US |
| Imogen Heap | Hide and Seek | 2005 | Discogs + Spotify | 2005 | – | 2005 | GB |
| Incubus | Drive | 1999 | Discogs + Spotify | 1999 | – | 1999 | US |
| Interpol | Obstacle 1 | 2002 | Discogs + Spotify | 2002 | – | 2002 | US |
| INXS | Beautiful Girl | 1992 | Discogs + Spotify | 1992 | – | 1992 | AU |
| INXS | By My Side | 1990 | Discogs + Spotify | 1990 | – | 1990 | AU |
| INXS | Disappear | 1990 | Discogs + Spotify | 1990 | – | 1990 | AU |
| INXS | Mystify | 1987 | Discogs + Spotify | 1987 | – | 1987 | AU |
| INXS | Need You Tonight | 1987 | Discogs + Spotify | 1987 | – | 1987 | AU |
| INXS | Never Tear Us Apart | 1987 | Discogs + Spotify | 1987 | – | 1987 | AU |
| IRA | Mój Dom | 1991 | Discogs + Spotify | 1991 | – | 1991 | PL |
| IRA | Nadzieja | 1991 | Discogs + Spotify | 1991 | – | 1991 | PL |
| IRA | Ona Jest Ze Snu | 2005 | MusicBrainz (Spotify: 2014) | – | 2005 | 2014 | PL |
| IRA | Wiara | 1993 | Discogs + Spotify | 1993 | – | 1993 | PL |
| Irena | Aleja Gwiazd | 2012 | Discogs + Spotify | 2012 | – | 2012 | PL |
| Irena Jarocka | Gondolierzy znad Wisły | 1975 | Discogs | 1975 | – | 1976 | PL |
| Irena Jarocka | Motylem jestem | 1974 | Discogs + Spotify | 1974 | – | 1974 | PL |
| Irena Jarocka | Odpływają Kawiarenki | 1976 | Discogs + Spotify | 1995 | – | 1976 | PL |
| Irena Jarocka | Wymyśliłam cię | 1974 | Discogs + Spotify | 1974 | – | 1974 | PL |
| Irena Santor | Embarras | 1961 | Discogs | 1961 | – | 2017 | PL |
| Irena Santor | Powrócisz tu | 1967 | Discogs + Spotify | 1981 | – | 1967 | PL |
| Irena Santor | Tych Lat Nie Odda Nikt | 1968 | Discogs + Spotify | 1968 | – | 1968 | PL |
| Irene Cara | Flashdance...What a Feeling | 1983 | Discogs + Spotify | 1983 | – | 1983 | US |
| Iron Butterfly | In-A-Gadda-Da-Vida | 1968 | Discogs + Spotify | 1968 | – | 1968 | US |
| Iron Maiden | 2 Minutes to Midnight | 1984 | Discogs + Spotify | 1984 | – | 1984 | GB |
| Iron Maiden | Fear of the Dark | 1992 | Discogs + Spotify | 1992 | – | 1992 | GB |
| Iron Maiden | Hallowed Be Thy Name | 1982 | Discogs + Spotify | 1982 | – | 1982 | GB |
| Iron Maiden | Run to the Hills | 1982 | Discogs + Spotify | 1982 | – | 1982 | GB |
| Iron Maiden | The Number of the Beast | 1982 | Discogs + Spotify | 1982 | – | 1982 | GB |
| Iron Maiden | The Trooper | 1983 | Discogs + Spotify | 1983 | – | 1983 | GB |
| Izabela Trojanowska | Jestem Twoim grzechem | 1981 | Discogs | 1981 | – | 2006 | PL |
| Izabela Trojanowska | Tyle samo prawd ile kłamstw | 1980 | Discogs | 1980 | – | 2006 | PL |
| Izabela Trojanowska | Wszystko czego dziś chcę | 1980 | Discogs | 1980 | – | 2006 | PL |
| Jacek Bonczyk & Zbigniew Krzywański | Tobie wybaczam | 2021 | Spotify | – | – | 2021 | PL |
| Jacek Kaczmarski | Nasza klasa | 1987 | Discogs | 1987 | – | 2012 | PL |
| Jacek Kaczmarski | Obława | 1987 | Discogs | 1987 | – | 2012 | PL |
| Jacek Kaczmarski & Przemyslaw Gintrowski | Modlitwa o wschodzie słońca | 1986 | MusicBrainz (Spotify: 2002) | – | 1986 | 2002 | PL |
| Jacek Kaczmarski & Przemyslaw Gintrowski | Mury | 1987 | Discogs | 1987 | – | 2002 | PL |
| Jacek Kleyff w Orkiestrze Na Zdrowie | Nocnoautobusowa | 2009 | Spotify | – | – | 2009 | ? |
| Jacek Skubikowski | Dobre miejsce dla naiwnych | 1984 | Discogs | 1984 | – | 2012 | PL |
| Jacek Skubikowski | Jedyny hotel w mieście | 1984 | Discogs | 1984 | – | 2012 | PL |
| Jacek Stachursky | Na Falochronie | 2008 | Spotify | – | – | 2008 | PL |
| Jacek Stachursky | Z Kazdym Twym Oddechem | 2011 | Spotify | – | – | 2011 | PL |
| Jacek Stachursky | Zostanmy Razem | 2010 | Spotify | – | – | 2010 | PL |
| Jack Harlow | Lovin On Me | 2023 | Discogs + Spotify | 2023 | – | 2023 | US |
| Jack Savoretti | You Don't Have To Say You Love Me / Io che non vivo senza te - Medley | 2022 | Spotify | – | – | 2022 | GB |
| Jack White & Alicia Keys | Another Way to Die | 2008 | Discogs + MusicBrainz | 2008 | 2008 | 2007 | US |
| Jamal | Peron | 2013 | Discogs + Spotify | 2013 | – | 2013 | PL |
| Jamal & Jambojet | Policeman | 2005 | Discogs + Spotify | 2005 | – | 2005 | PL |
| Jamelia | Superstar | 2003 | Discogs + Spotify | 2003 | – | 2003 | GB |
| James | Getting Away With It (All Messed Up) | 2001 | Discogs + Spotify | 2001 | – | 2001 | GB |
| James | Laid | 1993 | Discogs | 1993 | – | 1998 | GB |
| James | Sit Down | 1989 | MusicBrainz (Spotify: 1990) | – | 1989 | 1990 | GB |
| James Bay | Hold Back The River | 2014 | Discogs | 2014 | – | 2015 | GB |
| James Blake | Limit To Your Love | 2010 | Discogs | 2010 | – | 2011 | GB |
| James Blunt | You're Beautiful | 2004 | MusicBrainz (Spotify: 2005) | – | 2004 | 2005 | GB |
| James Brown | Get Up I Feel Like Being A Sex Machine | 1971 | Discogs | 1971 | – | 2003 | US |
| James Brown | It's A Man's, Man's, Man's World | 1970 | Discogs | 1970 | – | 2003 | US |
| James Brown & The Famous Flames | I Got You (I Feel Good) | 1965 | Discogs | 1965 | – | 1966 | US |
| James Hype & Miggy Dela Rosa | Ferrari | 2022 | Discogs + Spotify | 2022 | – | 2022 | GB |
| James Morrison & Nelly Furtado | Broken Strings | 2008 | Discogs + Spotify | 2008 | – | 2008 | GB |
| Jamie Lidell | Another Day | 2008 | Discogs + Spotify | 2008 | – | 2008 | GB |
| Jamie xx & Romy | Loud Places | 2015 | Discogs + Spotify | 2015 | – | 2015 | GB |
| Jamiroquai | Canned Heat | 1999 | Discogs + Spotify | 1999 | – | 1999 | GB |
| Jamiroquai | Cosmic Girl | 1996 | Discogs + MusicBrainz | 1996 | 1996 | 1987 | GB |
| Jamiroquai | Little L | 2001 | Discogs + Spotify | 2001 | – | 2001 | GB |
| Jamiroquai | Virtual Insanity | 1996 | Discogs | 1996 | – | 1999 | GB |
| Jan Hammer | Crockett's Theme | 1986 | MusicBrainz (Spotify: 1991) | – | 1986 | 1991 | US |
| Jan Kaczmarek | Do Serca Przytul Psa | 2004 | MusicBrainz (Spotify: 2008) | – | 2004 | 2008 | PL |
| Jan Kanty Pawluskiewicz & Chorek | Jak kania dzdzu | 2003 | Spotify (MusicBrainz: 2012) | – | 2012 | 2003 | PL |
| Jan Marczewski | Dotyk | 2023 | Spotify | – | – | 2023 | PL |
| Jan Pietrzak & Jonasz Kofta | Pamiętajcie o ogrodach | 1999 | MusicBrainz (Spotify: 2012) | – | 1999 | 2012 | PL |
| Jan-Rapowanie & Nocny | Pilot | 2020 | Discogs + Spotify | 2020 | – | 2020 | PL |
| Jane's Addiction | Jane Says | 1987 | Discogs | 1987 | – | 1988 | US |
| Jane's Addiction | Just Because | 2003 | Discogs + Spotify | 2003 | – | 2003 | US |
| Janelle Monáe | Tightrope | 2010 | Discogs + Spotify | 2010 | – | 2010 | US |
| Janis Joplin | Cry Baby | 1971 | Discogs + Spotify | 1971 | – | 1971 | US |
| Janis Joplin | Maybe | 1969 | Discogs + Spotify | 1969 | – | 1969 | US |
| Janis Joplin | Me and Bobby McGee | 1971 | Discogs + Spotify | 1971 | – | 1971 | US |
| Janis Joplin | Mercedes Benz | 1971 | Discogs + Spotify | 1971 | – | 1971 | US |
| Janis Joplin | Piece Of My Heart | 1968 | Discogs | 1968 | – | 2007 | US |
| Janis Joplin | Summertime | 1968 | Discogs | 1968 | – | 1969 | US |
| Janusz Grzywacz | 01 Młynek Kawowy | 2005 | Spotify | – | – | 2005 | ? |
| Janusz Radek | Groszki i róże | 2004 | Spotify + MusicBrainz | – | 2004 | 2004 | PL |
| Janusz Radek | Kiedy U-kochanie | 2007 | MusicBrainz (Spotify: 2017) | – | 2007 | 2017 | PL |
| Janusz Radek | Tomaszow | 2004 | Spotify + MusicBrainz | – | 2004 | 2004 | PL |
| Jaromir Nohavica | Minulost | 2012 | Discogs + Spotify | 2012 | – | 2012 | CZ |
| Jary Oddział Zamknięty | Obudź Się | 2016 | Spotify | – | – | 2016 | PL |
| Jary Oddział Zamknięty | Ten Wasz Swiat | 2016 | Spotify | – | – | 2016 | PL |
| Jary Oddział Zamknięty | Twój Każdy Krok | 2016 | Spotify | – | – | 2016 | PL |
| Jasiek Piwowarczyk | halo Houston | 2026 | Spotify | – | – | 2026 | PL |
| Jasiek Piwowarczyk | obłoki | 2026 | Spotify | – | – | 2026 | PL |
| Jason Derulo | Want to Want Me | 2015 | Discogs + Spotify | 2015 | – | 2015 | US |
| Jason Mraz | Life Is Wonderful | 2005 | Discogs + Spotify | 2005 | – | 2005 | US |
| Jax Jones & RAYE | You Don't Know Me | 2016 | Spotify + MusicBrainz | – | 2016 | 2016 | GB |
| JAŸ-Z | 99 Problems | 2003 | Discogs + Spotify | 2003 | – | 2003 | US |
| JAŸ-Z | Izzo (H.O.V.A.) | 2001 | Spotify + MusicBrainz | – | 2001 | 2001 | US |
| JAŸ-Z & Alicia Keys | Empire State Of Mind | 2009 | Discogs + Spotify | 2009 | – | 2009 | US |
| JAŸ-Z & Linkin Park | Numb / Encore | 2004 | Discogs + Spotify | 2004 | – | 2004 | US |
| Jean-Michel Jarre | Oxygene, Pt. 4 | 1976 | Spotify | 1980 | – | 1976 | FR |
| Jeanette | ¿Por Qué Te Vas? | 2016 | Spotify | – | – | 2016 | ES |
| Jeden Osiem L | Jak Zapomnieć | 2003 | Discogs + Spotify | 2003 | – | 2003 | PL |
| Jeff Beck | Hi Ho Silver Lining | 1967 | Discogs | 1967 | – | 2003 | GB |
| Jeff Beck & Rod Stewart | People Get Ready | 1985 | Discogs + Spotify | 1985 | – | 1985 | GB |
| Jeff Buckley | Grace | 1994 | Discogs + Spotify | 1994 | – | 1994 | US |
| Jeff Buckley | Hallelujah | 1994 | Discogs + Spotify | 1994 | – | 1994 | US |
| Jefferson Airplane | Somebody to Love | 1967 | Discogs + Spotify | 1967 | – | 1967 | US |
| Jefferson Airplane | White Rabbit | 1967 | Discogs + Spotify | 1967 | – | 1967 | US |
| Jelonek | ViolMachine | 2011 | Spotify + MusicBrainz | – | 2011 | 2011 | PL |
| Jennifer Lopez | Let's Get Loud | 1999 | Spotify + MusicBrainz | – | 1999 | 1999 | US |
| Jennifer Lopez | Waiting for Tonight | 1999 | Discogs + Spotify | 1999 | – | 1999 | US |
| Jennifer Paige | Crush | 1998 | Discogs + Spotify | 1998 | – | 1998 | US |
| Jennifer Rush | The Power of Love | 1984 | Discogs | 1984 | – | 1995 | US |
| Jeremi Sikorski | A Jak | 2026 | Spotify | – | – | 2026 | PL |
| Jeremi Sikorski | Wracam | 2025 | Spotify | – | – | 2025 | PL |
| Jerzy Połomski | Bo z dziewczynami | 1975 | Discogs | 1975 | – | 2006 | PL |
| Jerzy Połomski | Cała sala śpiewa z nami | 1998 | Discogs | 1998 | – | 2006 | PL |
| Jerzy Połomski | Daj | 1981 | Discogs | 1981 | – | 2015 | PL |
| Jerzy Połomski | To ostatnia niedziela | 1999 | Discogs | 1999 | – | 2006 | PL |
| Jess Glynne | Hold My Hand | 2015 | Discogs + Spotify | 2015 | – | 2015 | GB |
| Jessie Ware | Say You Love Me | 2014 | Discogs + Spotify | 2014 | – | 2014 | GB |
| Jessie Ware | Wildest Moments | 2012 | Discogs | 2012 | – | 2013 | GB |
| Jet | Are You Gonna Be My Girl | 2003 | Discogs + Spotify | 2003 | – | 2003 | AU |
| Jethro Tull | Aqualung | 1971 | Discogs + Spotify | 1971 | – | 1971 | GB |
| Jethro Tull | Bourée | 1969 | Discogs | 1969 | – | 2007 | GB |
| Jethro Tull | Flying Colours | 1982 | Discogs + Spotify | 1982 | – | 1982 | GB |
| Jethro Tull | Heavy Horses | 1978 | Discogs + Spotify | 1978 | – | 1978 | GB |
| Jethro Tull | Life Is a Long Song | 1971 | Discogs | 1971 | – | 2018 | GB |
| Jethro Tull | Locomotive Breath | 1971 | Discogs + Spotify | 1971 | – | 1971 | GB |
| Jethro Tull | Songs from the Wood | 1977 | Discogs + Spotify | 1977 | – | 1977 | GB |
| Jigsaw | Sky High | 1975 | Discogs + Spotify | 1975 | – | 1975 | GB |
| Jim Croce | You Don't Mess Around with Jim | 1972 | Spotify + MusicBrainz | – | 1972 | 1972 | US |
| Jimi Hendrix | All Along the Watchtower | 1968 | Discogs + Spotify | 1968 | – | 1968 | US |
| Jimi Hendrix | Crosstown Traffic | 1968 | Spotify + MusicBrainz | 1969 | 1968 | 1968 | US |
| Jimi Hendrix | Hey Joe | 1966 | Discogs | 1966 | – | 1967 | US |
| Jimi Hendrix | Little Wing | 1967 | Discogs + Spotify | 1967 | – | 1967 | US |
| Jimi Hendrix | Purple Haze | 1967 | Discogs + Spotify | 1967 | – | 1967 | US |
| Jimi Hendrix | Voodoo Child (Slight Return) | 1968 | Spotify (MusicBrainz: 1986) | 1975 | 1986 | 1968 | US |
| Joan Baez | Diamonds And Rust | 1975 | Discogs + Spotify | 1975 | – | 1975 | US |
| Joan Baez | The Night They Drove Old Dixie Down | 1971 | Discogs + Spotify | 1971 | – | 1971 | US |
| Joan Jett & the Blackhearts | I Hate Myself for Loving You | 1988 | Discogs + Spotify | 1988 | – | 1988 | US |
| Joan Jett & the Blackhearts | I Love Rock 'N Roll | 1979 | Discogs | 1979 | – | 1981 | US |
| Joan Osborne | One Of Us | 1995 | Discogs + Spotify | 1995 | – | 1995 | US |
| Joe Cocker | Unchain My Heart | 1987 | Discogs + Spotify | 1987 | – | 1987 | GB |
| Joe Cocker | With A Little Help From My Friends | 1968 | Discogs | 1968 | – | 1969 | GB |
| Joe Cocker | You Are So Beautiful | 1974 | Discogs + Spotify | 1974 | – | 1974 | GB |
| Joe Cocker | You Can Leave Your Hat On | 1986 | Discogs + Spotify | 1986 | – | 1986 | GB |
| Joe Dassin | Et si tu n'existais pas | 1975 | Spotify + MusicBrainz | 1983 | 1975 | 1975 | FR |
| Joe Dassin | L'été indien | 1975 | Discogs | 1975 | – | 2005 | FR |
| Joe Dassin | Les Champs-Elysées | 1969 | Discogs + Spotify | 1969 | – | 1969 | FR |
| Joel Corry & MNEK | Head & Heart | 2020 | Discogs + Spotify | 2020 | – | 2020 | GB |
| John Denver | Take Me Home, Country Roads | 1971 | Discogs + Spotify | 1971 | – | 1971 | US |
| John Farnham | You're the Voice | 1986 | Spotify + MusicBrainz | 2008 | 1986 | 1986 | AU |
| John Lee Hooker | Boom Boom | 1962 | Discogs | 1962 | – | 1967 | US |
| John Lee Hooker | Chill Out (Things Gonna Change) | 1995 | Discogs + Spotify | 1995 | – | 1995 | US |
| John Lennon | (Just Like) Starting Over | 1980 | Discogs + Spotify | 1980 | – | 1980 | GB |
| John Lennon | Imagine | 1971 | Discogs + MusicBrainz+Wikipedia + Spotify | 1971 | 1971 | 1971 | GB |
| John Lennon | Jealous Guy | 1971 | Discogs + Spotify | 1971 | – | 1971 | GB |
| John Lennon | Woman | 1980 | Spotify (MusicBrainz: 1988) | – | 1988 | 1980 | GB |
| John Lennon | Woman Is The N****r Of The World | 1972 | Spotify | – | – | 1972 | GB |
| John Lennon | Working Class Hero | 1970 | Discogs + Spotify | 1970 | – | 1970 | GB |
| John Lennon & Yoko Ono | Give Peace A Chance | 1981 | Discogs | 1981 | – | 2010 | GB |
| John Lennon & Yoko Ono | Happy Xmas (War Is Over) | 1981 | Discogs | 1981 | – | 2010 | GB |
| John Mayer | Belief | 2006 | Discogs + Spotify | 2006 | – | 2006 | US |
| John Mayer | Gravity | 2005 | Discogs + MusicBrainz | 2005 | 2005 | 2006 | US |
| John Miles | Music | 1976 | Discogs | 1976 | – | 2012 | GB |
| John Newman | Love Me Again | 2013 | Discogs + Spotify | 2013 | – | 2013 | GB |
| John Paul Young | Love Is in the Air | 1977 | Discogs | 1977 | – | 1978 | AU |
| John Travolta & Olivia Newton-John | Summer Nights | 1978 | Discogs + Spotify | 1978 | – | 1978 | US |
| John Travolta & Olivia Newton-John | You're The One That I Want | 1978 | Spotify + MusicBrainz | – | 1978 | 1978 | US |
| John Wetton | Rendezvous 6:02 | 1987 | Discogs | 1987 | – | 2003 | GB |
| Johnny Cash | Hurt | 2002 | Spotify + MusicBrainz | – | 2002 | 2002 | US |
| Johnny Cash | I Walk the Line | 1956 | Discogs | 1956 | – | 1970 | US |
| Johnny Cash | Ring of Fire | 1963 | Discogs + Spotify | 1963 | – | 1963 | US |
| Joji | Glimpse of Us | 2022 | Discogs + Spotify | 2022 | – | 2022 | US |
| Jon & Vangelis | I'll Find My Way Home | 1981 | Spotify + MusicBrainz | – | 1981 | 1981 | ? |
| Jon & Vangelis | State Of Independence | 1981 | Discogs + Spotify | 1981 | – | 1981 | ? |
| Jon & Vangelis | The Friends Of Mr. Cairo | 1981 | Discogs + Spotify | 1981 | – | 1981 | ? |
| Jon Anderson | Hold On to Love | 1988 | Discogs + Spotify | 1988 | – | 1988 | GB |
| Jon Bon Jovi | Blaze Of Glory | 1990 | Discogs | 1990 | – | 1994 | US |
| Jonasz Kofta | Pamiętajcie o ogrodach | 1996 | Discogs | 1996 | – | 2015 | PL |
| Jonatan & Pezet | Obejmuję noce | 2025 | Spotify | – | – | 2025 | PL |
| Joni Mitchell | Big Yellow Taxi | 1970 | Discogs + Spotify | 1970 | – | 1970 | CA |
| Joni Mitchell | Both Sides Now | 1969 | Discogs | 1969 | – | 2017 | CA |
| Joni Mitchell | River - Blue Sessions | 2021 | Discogs + Spotify | 2021 | – | 2021 | CA |
| José González | Heartbeats | 2003 | Discogs + Spotify | 2003 | – | 2003 | SE |
| Journey | Don't Stop Believin' | 1981 | Spotify + MusicBrainz | 2014 | 1981 | 1981 | US |
| Journey | Separate Ways (Worlds Apart) | 1983 | Discogs + Spotify | 1983 | – | 1983 | US |
| Journey | Who's Crying Now | 1981 | Spotify + MusicBrainz | 2014 | 1981 | 1981 | US |
| Joy | Touch By Touch | 1985 | Discogs | 1985 | – | 2012 | AT |
| Joy Division | Love Will Tear Us Apart | 1980 | Discogs + Spotify | 1980 | – | 1980 | GB |
| Joy Division | Transmission | 1979 | Discogs | 1979 | – | 2008 | GB |
| Juanes | La Camisa Negra | 2004 | Discogs + Spotify | 2004 | – | 2004 | CO |
| Judas Priest | Breaking the Law | 1980 | Discogs + Spotify | 1980 | – | 1980 | GB |
| Judas Priest | Living After Midnight | 1980 | Discogs + Spotify | 1980 | – | 1980 | GB |
| Judas Priest | Painkiller | 1990 | Discogs + Spotify | 1990 | – | 1990 | GB |
| Judy Garland | Over The Rainbow | 1939 | Discogs + Spotify | 1939 | – | 1939 | US |
| Jula | NIE ZATRZYMASZ MNIE | 2012 | Discogs + Spotify | 2012 | – | 2012 | PL |
| Jula | Za każdym razem | 2012 | Discogs + Spotify | 2012 | – | 2012 | PL |
| Julia Holter | Feel You | 2015 | Discogs + Spotify | 2015 | – | 2015 | US |
| Julia Marcell | Tarantino | 2016 | Discogs + Spotify | 2016 | – | 2016 | PL |
| Julia Wieniawa | 27 (Do gwiazd!) | 2026 | Spotify | – | – | 2026 | PL |
| Julia Wieniawa | Nie muszę | 2018 | Spotify + MusicBrainz | – | 2018 | 2018 | PL |
| Julia Wieniawa & Kuba Karaś | Nie mam dla Ciebie miłości - Kayax XX Rework | 2022 | Spotify | – | – | 2022 | PL |
| Jung Kook | Standing Next to You | 2023 | Spotify + MusicBrainz | – | 2023 | 2023 | KR |
| Jungle | Back On 74 | 2023 | Discogs + Spotify | 2023 | – | 2023 | GB |
| Junior Boys | In The Morning | 2006 | Discogs | 2006 | – | 2007 | CA |
| Junior Senior | Move Your Feet | 2002 | Discogs + Spotify | 2002 | – | 2002 | DK |
| JUST 5 | Kolorowe sny | 1997 | Discogs | 1997 | – | 2024 | PL |
| Justice | D.A.N.C.E. | 2006 | MusicBrainz (Spotify: 2007) | – | 2006 | 2007 | FR |
| Justice & Simian | We Are Your Friends - Justice Vs Simian | 2006 | Spotify | – | – | 2006 | FR |
| Justice & Tame Impala | Neverender | 2024 | Discogs + Spotify | 2024 | – | 2024 | FR |
| Justin Bieber | DAISIES | 2025 | Discogs + Spotify | 2025 | – | 2025 | CA |
| Justin Bieber & Nicki Minaj | Beauty And A Beat | 2012 | Discogs + Spotify | 2012 | – | 2012 | CA |
| Justin Hayward | Forever Autumn | 1989 | Discogs | 1989 | – | 2016 | GB |
| Justin Timberlake | CAN'T STOP THE FEELING! | 2016 | Spotify + MusicBrainz | – | 2016 | 2016 | US |
| Justin Timberlake | Cry Me a River | 2002 | Discogs + Spotify | 2002 | – | 2002 | US |
| Justin Timberlake | What Goes Around.../...Comes Around (Interlude) | 2006 | Discogs + Spotify | 2006 | – | 2006 | US |
| Justin Timberlake & Timbaland | SexyBack | 2006 | Spotify + MusicBrainz | 2007 | 2006 | 2006 | US |
| Justyna Steczkowska | Dziewczyna Szamana | 1996 | Discogs + Spotify | 1996 | – | 1996 | PL |
| Justyna Steczkowska | Grande Valse Brillante | 2004 | MusicBrainz (Spotify: 2012) | 2023 | 2004 | 2012 | PL |
| Justyna Steczkowska | Grawitacja | 1996 | Discogs | 1996 | – | 2002 | PL |
| Justyna Steczkowska | Karuzela z Madonnami | 1996 | Discogs | 1996 | – | 2002 | PL |
| Justyna Steczkowska | Oko za oko | 1996 | Discogs + Spotify | 1996 | – | 1996 | PL |
| Justyna Steczkowska | Oko za oko, słowo za słowo | 1996 | MusicBrainz (Spotify: 2002) | 2003 | 1996 | 2002 | PL |
| JVKE | golden hour | 2022 | Discogs + Spotify | 2022 | – | 2022 | US |
| k.d. lang | Constant Craving | 1991 | Discogs | 1991 | – | 2010 | CA |
| Kabaret Starszych Panow | Addio Pomidory | 1962 | Discogs | 1962 | – | 2015 | PL |
| Kabaret Starszych Panow | Herbatka | 1999 | Discogs | 1999 | – | 2015 | PL |
| Kabaret Starszych Panow | Jezeli Kochac To Nie Indywidualnie | 2015 | Spotify | – | – | 2015 | PL |
| Kabaret Starszych Panow | Już Czas Na Sen | 1999 | Discogs | 1999 | – | 2015 | PL |
| Kabaret Starszych Panow | Piosenka jest dobra na wszystko | 1962 | Discogs | 1962 | – | 2015 | PL |
| Kabaret Starszych Panow | Tanie Dranie | 1999 | Discogs | 1999 | – | 2015 | PL |
| Kacperczyk & Vito Bambino | MAM TALENT | 2025 | Spotify + MusicBrainz | – | 2025 | 2025 | PL |
| Kaeyra | na moje nieszczęście | 2026 | Spotify | – | – | 2026 | US |
| Kaiser Chiefs | Ruby | 2007 | Discogs + Spotify | 2007 | – | 2007 | GB |
| Kajagoogoo | Too Shy | 1983 | Discogs + Spotify | 1983 | – | 1983 | GB |
| Kali Uchis | telepatía | 2020 | Discogs + Spotify | 2020 | – | 2020 | US |
| Kaliber 44 | Film | 1998 | Discogs + Spotify | 1998 | – | 1998 | PL |
| Kaliber 44 | Konfrontacje | 2000 | Discogs + Spotify | 2000 | – | 2000 | PL |
| Kaliber 44 | Plus i minus | 1996 | Discogs + Spotify | 1996 | – | 1996 | PL |
| Kalina Jedrusik | Bo we mnie jest seks | 1992 | Discogs (ponowne sprawdzenie) | 1992 | 2008 | 2012 | PL |
| Kalina Jedrusik | Ja nie chcę spać | 1999 | Discogs | 1999 | – | 2015 | PL |
| Kamil Bednarek | Chodź Ucieknijmy… | 2012 | Spotify + MusicBrainz | – | 2012 | 2012 | PL |
| Kamil Bednarek | Chwile jak Te | 2014 | Spotify + MusicBrainz | – | 2014 | 2014 | PL |
| Kamil Bednarek | Cisza | 2012 | Spotify + MusicBrainz | – | 2012 | 2012 | PL |
| Kancelarya | Zabiorę Cię | 1993 | Discogs | 1993 | – | 2010 | PL |
| Kansas | Carry on Wayward Son | 1976 | Discogs + Spotify | 1976 | – | 1976 | US |
| Kansas | Dust in the Wind | 1977 | Discogs + Spotify | 1977 | – | 1977 | US |
| Kanye West | Stronger | 2007 | Discogs + Spotify | 2007 | – | 2007 | ? |
| Kanye West & Pusha T | Runaway | 2010 | Discogs + Spotify | 2010 | – | 2010 | ? |
| Kapitan Nemo | Twoja Lorelei | 1992 | Discogs | 1992 | – | 2014 | PL |
| KARAŚ/ROGUCKI & Kamil Holden Kryszak | Kilka westchnień | 2020 | Discogs + Spotify | 2020 | – | 2020 | ? |
| Karel Fialka | Hey Matthew | 1987 | Discogs | 1987 | – | 1988 | GB |
| Karin Stanek | Chłopiec z gitarą | 1963 | Discogs | 1963 | – | 2009 | PL |
| Karin Stanek & Czerwono Czarni | Jedziemy Autostopem | 2003 | Discogs | 2003 | – | 2015 | PL |
| Karl Jenkins & Adiemus Symphony Orchestra Of Europe | Adiemus | 1999 | Discogs | 1999 | – | 2017 | GB |
| KAROL G | Si Antes Te Hubiera Conocido | 2024 | Discogs + Spotify | 2024 | – | 2024 | CO |
| Kasia Cerekwicka | Na Kolana | 2006 | Discogs + Spotify | 2006 | – | 2006 | PL |
| Kasia Cerekwicka | S.O.S | 2007 | Spotify + MusicBrainz | – | 2007 | 2007 | PL |
| Kasia Klich | Lepszy Model | 2002 | Spotify + MusicBrainz | – | 2002 | 2002 | PL |
| Kasia Kowalska | A To Co Mam | 1995 | Discogs + MusicBrainz | 1995 | 1995 | 1999 | PL |
| Kasia Kowalska | Antidotum | 2002 | Discogs + Spotify | 2002 | – | 2002 | PL |
| Kasia Kowalska | Byc Tak Blisko | 2000 | Discogs + Spotify | 2000 | – | 2000 | PL |
| Kasia Kowalska | Coś Optymistycznego | 1996 | Discogs + Spotify | 1996 | – | 1996 | PL |
| Kasia Kowalska | Dlaczego Nie | 2006 | MusicBrainz (Spotify: 2008) | – | 2006 | 2008 | PL |
| Kasia Kowalska | Jak Rzecz | 1994 | Discogs + Spotify | 1994 | – | 1994 | PL |
| Kasia Kowalska | Nobody... | 2000 | Discogs + Spotify | 2000 | – | 2000 | PL |
| Kasia Kowalska | Oto Ja | 1994 | Discogs + Spotify | 1994 | – | 1994 | PL |
| Kasia Kowalska | Pieprz i Sól | 2002 | Discogs + Spotify | 2002 | – | 2002 | PL |
| Kasia Kowalska | Prowadź mnie | 2004 | Discogs + Spotify | 2004 | – | 2004 | PL |
| Kasia Kowalska | Spowiedź | 2008 | Discogs + MusicBrainz+Wikipedia + Spotify | 2008 | 2008 | 2008 | PL |
| Kasia Kowalska | To co dobre | 2004 | Discogs + Spotify | 2004 | – | 2004 | PL |
| Kasia Kowalska | Wyrzuć Ten Gniew | 1998 | Discogs | 1998 | – | 1999 | PL |
| Kasia Lins | Nieba nie ma | 2023 | Discogs + Spotify | 2023 | – | 2023 | PL |
| Kasia Lins | Rób Tak Dalej | 2020 | Discogs + Spotify | 2020 | – | 2020 | PL |
| Kasia Lins | Sto żyć | 2023 | Discogs + Spotify | 2023 | – | 2023 | PL |
| Kasia Lins | Wiersz Ostatni | 2018 | Spotify + MusicBrainz | – | 2018 | 2018 | PL |
| Kasia Wilk | Pierwszy raz | 2008 | Spotify + MusicBrainz | – | 2008 | 2008 | PL |
| KAT | Łza dla cieniów minionych | 1992 | Discogs + Spotify | 1992 | – | 1992 | PL |
| Katarzyn Gӓrtner & Katarzyna Zawada | Tańczące Eurydyki | 2021 | Spotify | – | – | 2021 | ? |
| Katarzyna Groniec | Będę z Tobą | 2007 | Spotify + MusicBrainz | – | 2007 | 2007 | PL |
| Katarzyna Groniec | Dzięki Za Miłość | 2000 | Discogs | 2000 | – | 2002 | PL |
| Katarzyna Sobczyk | Mały książę | 1991 | MusicBrainz (Spotify: 2015) | – | 1991 | 2015 | PL |
| Katarzyna Sobczyk | O mnie się nie martw | 1964 | Discogs | 1964 | – | 2015 | PL |
| Katarzyna Sobczyk & Czerwono Czarni | Nie bądź taki szybki Bill | 1965 | Spotify (MusicBrainz: 1999) | 1966 | 1999 | 1965 | PL |
| Katarzyna Sobczyk & Czerwono Czarni | Trzynastego | 1967 | Discogs + Spotify | 1967 | – | 1967 | PL |
| Kate Bush | Army Dreamers | 1980 | Discogs + Spotify | 1980 | – | 1980 | GB |
| Kate Bush | Babooshka | 1980 | Discogs + Spotify | 1980 | – | 1980 | GB |
| Kate Bush | Cloudbusting | 1985 | Discogs + Spotify | 1985 | – | 1985 | GB |
| Kate Bush | Running Up That Hill | 1985 | Discogs + MusicBrainz+Wikipedia + Spotify | 1985 | 1985 | 1985 | GB |
| Kate Bush | The Sensual World | 1989 | Discogs + Spotify | 1989 | – | 1989 | GB |
| Kate Bush | This Woman's Work | 1989 | Discogs + Spotify | 1989 | – | 1989 | GB |
| Kate Bush | Wuthering Heights | 1978 | Discogs + Spotify | 1978 | – | 1978 | GB |
| Katie Melua | Nine Million Bicycles | 2005 | Discogs + Spotify | 2005 | – | 2005 | GB |
| Katie Melua | Spider's Web | 2005 | Spotify + MusicBrainz | – | 2005 | 2005 | GB |
| Katrina & The Waves | Walking On Sunshine | 1983 | Discogs | 1983 | – | 1985 | GB |
| KATSEYE | Gabriela | 2025 | Discogs + Spotify | 2025 | – | 2025 | US |
| KATSEYE | Gnarly | 2025 | Discogs + Spotify | 2025 | – | 2025 | US |
| Katy Perry | Firework | 2010 | Discogs + Spotify | 2010 | – | 2010 | US |
| Katy Perry | Hot N Cold | 2008 | Discogs + Spotify | 2008 | – | 2008 | US |
| Katy Perry | I Kissed A Girl | 2008 | Discogs + Spotify | 2008 | – | 2008 | US |
| Katy Perry & Juicy J | Dark Horse | 2013 | Discogs + Spotify | 2013 | – | 2013 | US |
| Katy Perry & Snoop Dogg | California Gurls | 2010 | Discogs | 2010 | – | 2012 | US |
| Kavinsky | Nightcall | 2010 | Discogs + Spotify | 2010 | – | 2010 | FR |
| Kayah | Fleciki | 1995 | Discogs + Spotify | 1995 | – | 1995 | PL |
| Kayah | Jak lisc | 1995 | Discogs + Spotify | 1995 | – | 1995 | PL |
| Kayah | Jak skała | 2009 | Spotify + MusicBrainz | – | 2009 | 2009 | PL |
| Kayah | Jestem kamieniem | 1995 | Discogs + Spotify | 1995 | – | 1995 | PL |
| Kayah | Na balkonie w Weronie | 2009 | Spotify + MusicBrainz | – | 2009 | 2009 | PL |
| Kayah | Rebeka | 2013 | Discogs + Spotify | 2013 | – | 2013 | PL |
| Kayah | Supermenka | 1997 | Discogs + Spotify | 1997 | – | 1997 | PL |
| Kayah | Testosteron | 2003 | Discogs + MusicBrainz+Wikipedia + Spotify | 2003 | 2003 | 2003 | PL |
| Kayah | Twoja Dlon | 2003 | Discogs + Spotify | 2003 | – | 2003 | PL |
| Kayah | Za późno | 2011 | Spotify | – | – | 2011 | PL |
| Kayah & Goran Bregović | Bylam Roza (A Rose Was I) (Ero Una Rosa) | 1999 | Spotify + MusicBrainz | – | 1999 | 1999 | PL |
| Kayah & Goran Bregović | Jesli Bog Istnieje (If There's A God) (Se Dio Esiste) | 1999 | Spotify + MusicBrainz | – | 1999 | 1999 | PL |
| Kayah & Goran Bregović | Nie Ma Nie Ma Ciebie | 1999 | Discogs + Spotify | 1999 | – | 1999 | PL |
| Kayah & Goran Bregović | Prawy do lewego | 1999 | Discogs + MusicBrainz+Wikipedia + Spotify | 1999 | 1999 | 1999 | PL |
| Kayah & Goran Bregović | To Nie Ptak | 1999 | Discogs + Spotify | 1999 | – | 1999 | PL |
| Kayah & Goran Bregović | Trudno Kochac (Hard To Love) (E Cosi Difficile Amare) | 1999 | Spotify + MusicBrainz | – | 1999 | 1999 | PL |
| Kayah & Goran Bregović | Śpij Kochanie Śpij | 1999 | Discogs + Spotify | 1999 | – | 1999 | PL |
| Kayah & Grzegorz Hyży | Podatek od miłości | 2017 | Spotify (MusicBrainz: 2018) | – | 2018 | 2017 | PL |
| Kayah & Royal String Quartet | Wiosna przyjdzie i tak | 2005 | Discogs | 2005 | – | 2010 | PL |
| Kayah & Zbigniew Wodecki | Chwytaj dzień | 2018 | Spotify + MusicBrainz | – | 2018 | 2018 | PL |
| Kazik | 12 Groszy | 1997 | Discogs | 1997 | – | 2016 | PL |
| Kazik | Mars napada | 2000 | Spotify + MusicBrainz | 2001 | 2000 | 2000 | PL |
| Kazik | Twój ból jest lepszy niż mój | 2020 | Discogs + Spotify | 2020 | – | 2020 | PL |
| Kazik & Edyta Bartosiewicz | Cztery pokoje | 2000 | Spotify + MusicBrainz | 2001 | 2000 | 2000 | PL |
| Kazik & Kwartet ProForma | Gdybym miał kogoś | 2017 | Discogs + Spotify | 2017 | – | 2017 | ? |
| Kazik Na Żywo | Celina | 1994 | Discogs + Spotify | 1994 | – | 1994 | PL |
| Kazik Na Żywo | Plamy na słońcu | 2011 | Discogs + Spotify | 2011 | – | 2011 | PL |
| Kazik Na Żywo | Spalam się | 1994 | Discogs + Spotify | 1994 | – | 1994 | PL |
| Kaśka Sochacka | Ciche dni | 2021 | Spotify + MusicBrainz | – | 2021 | 2021 | PL |
| Kaśka Sochacka | Niebo było różowe | 2021 | Spotify + MusicBrainz | – | 2021 | 2021 | PL |
| Kaśka Sochacka | Pokoje Ta Druga na Bis | 2025 | Spotify + MusicBrainz | – | 2025 | 2025 | PL |
| Kaśka Sochacka | Spokojnie | 2024 | MusicBrainz (Spotify: 2025) | – | 2024 | 2025 | PL |
| Kaśka Sochacka | Spędź ze mną trochę czasu jeszcze | 2021 | Spotify + MusicBrainz | – | 2021 | 2021 | PL |
| Kaśka Sochacka | Wiśnia | 2019 | MusicBrainz (Spotify: 2021) | – | 2019 | 2021 | PL |
| Kaśka Sochacka & Kortez | Jak my | 2026 | Spotify | – | – | 2026 | PL |
| Kaśka Sochacka & Vito Bambino | Boję się o Ciebie | 2021 | Spotify + MusicBrainz | – | 2021 | 2021 | PL |
| KC & The Sunshine Band | (Shake, Shake, Shake) Shake Your Booty | 1976 | Discogs + MusicBrainz | 1976 | 1976 | 2013 | US |
| KC & The Sunshine Band | Get Down Tonight | 1975 | Discogs + Spotify | 1975 | – | 1975 | US |
| KC & The Sunshine Band | I'm Your Boogie Man | 1976 | Spotify + MusicBrainz | – | 1976 | 1976 | US |
| KC & The Sunshine Band | That's the Way (I Like It) | 1975 | Spotify (MusicBrainz: 1976) | 1986 | 1976 | 1975 | US |
| Keane | Everybody's Changing | 2003 | MusicBrainz (Spotify: 2004) | – | 2003 | 2004 | GB |
| Keane | Somewhere Only We Know | 2004 | Discogs + Spotify | 2004 | – | 2004 | GB |
| Keith L. Anderson | We All Must Change | 2020 | Spotify | – | – | 2020 | ? |
| Kelis | Milkshake | 2003 | Discogs + Spotify | 2003 | – | 2003 | US |
| Kelis | Trick Me | 2003 | Discogs + Spotify | 2003 | – | 2003 | US |
| Kelly Clarkson | Since U Been Gone | 2004 | Discogs + Spotify | 2004 | – | 2004 | US |
| Kelly Clarkson | Stronger (What Doesn't Kill You) | 2011 | Spotify + MusicBrainz | – | 2011 | 2011 | US |
| Ken Laszlo | Tonight | 1985 | Discogs | 1985 | – | 2016 | IT |
| Kendrick Lamar | HUMBLE. | 2017 | Discogs + Spotify | 2017 | – | 2017 | US |
| Kendrick Lamar | Not Like Us | 2024 | Discogs + Spotify | 2024 | – | 2024 | US |
| Kendrick Lamar | Swimming Pools (Drank) | 2012 | Discogs + Spotify | 2012 | – | 2012 | US |
| Kendrick Lamar & SZA | luther | 2024 | Discogs + Spotify | 2024 | – | 2024 | US |
| Kenny Loggins | Footloose | 1984 | Discogs | 1984 | – | 1997 | US |
| Kenny Loggins | Heartlight | 1982 | Discogs + Spotify | 1982 | – | 1982 | US |
| Kenny Loggins | I'm Free (Heaven Helps the Man) | 1984 | MusicBrainz (Spotify: 2002) | – | 1984 | 2002 | US |
| kent | Musik Non Stop | 1999 | Discogs + Spotify | 1999 | – | 1999 | SE |
| Kenya Grace | Strangers | 2023 | Discogs + Spotify | 2023 | – | 2023 | GB |
| Kid Rock | All Summer Long | 2007 | Discogs + Spotify | 2007 | – | 2007 | US |
| Kiesza | Hideaway | 2014 | Discogs + Spotify | 2014 | – | 2014 | CA |
| Kim Carnes | Bette Davis Eyes | 1981 | Discogs + Spotify | 1981 | – | 1981 | US |
| Kim Nowak | Mokry Pies | 2012 | Spotify + MusicBrainz | – | 2012 | 2012 | ? |
| Kim Wilde | Cambodia | 1981 | Discogs | 1981 | – | 2006 | GB |
| Kim Wilde | Kids in America | 1981 | Discogs + MusicBrainz+Wikipedia | 1981 | 1981 | – | GB |
| Kim Wilde | View From a Bridge | 1982 | Discogs + Spotify | 1982 | – | 1982 | GB |
| Kim Wilde | You Keep Me Hangin On | 1986 | Discogs + Spotify | 1986 | – | 1986 | GB |
| King Crimson | 21st Century Schizoid Man - Including "Mirrors" | 1969 | Discogs + Spotify | 1969 | – | 1969 | GB |
| King Crimson | Epitaph | 1976 | Discogs | 1976 | – | 2006 | GB |
| King Crimson | I Talk To The Wind | 1969 | Discogs + Spotify | 1969 | – | 1969 | GB |
| King Crimson | Starless | 1974 | Discogs + Spotify | 1974 | – | 1974 | GB |
| King Crimson | The Court Of The Crimson King - Including "The Return of the Fire Witch" and "The Dance of the Puppets" | 1969 | Discogs + Spotify | 1969 | – | 1969 | GB |
| King Harvest | Dancing In The Moonlight | 1972 | Discogs | 1972 | – | 2011 | US |
| Kings of Leon | Sex on Fire | 2008 | Discogs + Spotify | 2008 | – | 2008 | US |
| Kings of Leon | Use Somebody | 2008 | Discogs + Spotify | 2008 | – | 2008 | US |
| KISS | Beth | 1976 | Discogs | 1976 | – | 2021 | US |
| KISS | Crazy Crazy Nights | 1987 | Discogs + Spotify | 1987 | – | 1987 | US |
| KISS | Heaven's On Fire | 1984 | Discogs + Spotify | 1984 | – | 1984 | US |
| KISS | I Was Made For Lovin' You | 1979 | Discogs + Spotify | 1979 | – | 1979 | US |
| KISS | Lick It Up | 1983 | Discogs + Spotify | 1983 | – | 1983 | US |
| KISS | Rock And Roll All Nite | 1975 | Discogs + Spotify | 1975 | – | 1975 | US |
| Kitaro & Jon Anderson | Agreement | 1992 | Discogs + Spotify | 1992 | – | 1992 | JP |
| Kix | Don't Close Your Eyes | 1988 | Spotify + MusicBrainz | – | 1988 | 1988 | US |
| Klan | Automaty | 1970 | Spotify + MusicBrainz | 2000 | 1970 | 1970 | PL |
| Klan | Epidemia euforii | 1971 | Discogs + Spotify | 1971 | – | 1971 | PL |
| Klan | Z brzytwą na poziomki | 1970 | Spotify + MusicBrainz | 2000 | 1970 | 1970 | PL |
| Klaus Mitffoch | Jezu jak się cieszę | 1983 | MusicBrainz (Spotify: 2005) | 1998 | 1983 | 2005 | PL |
| Klaus Mitffoch | Klus mitroh | 1984 | Discogs | 1984 | – | 2003 | PL |
| Klaus Mitffoch | Strzeż się tych miejsc | 1984 | Discogs | 1984 | – | 2005 | PL |
| Klaus Mitffoch & Lech Janerka | Konstytucje | 2005 | Spotify | – | – | 2005 | PL |
| Klincz | Latarnik | 1999 | Discogs | 1999 | – | 2013 | ? |
| Kobranocka | Hipisówka | 1992 | Discogs | 1992 | – | 2007 | PL |
| Kobranocka | I nikomu nie wolno się z tego śmiać | 1988 | Discogs | 1988 | – | 2003 | PL |
| Kobranocka | Kocham cię jak irlandię | 1990 | Discogs | 1990 | – | 2004 | PL |
| Kodaline | All I Want | 2012 | Discogs | 2012 | – | 2013 | IE |
| Kombajn do zbierania kur po wioskach | Warszawa | 2004 | Discogs | 2004 | – | 2007 | PL |
| Kombi | Black and White | 1985 | Discogs | 1985 | – | 2008 | PL |
| Kombi | Królowie życia | 1982 | Discogs | 1982 | – | 2008 | PL |
| Kombi | Nasze rendez-vous | 1985 | Discogs (ponowne sprawdzenie) | 1985 | – | 2008 | PL |
| Kombi | Przytul mnie | 1979 | Discogs | 1979 | – | 2011 | PL |
| Kombi | Słodkiego, miłego życia | 1984 | Discogs | 1984 | – | 2008 | PL |
| Kombii | Mysl o Tobie | 2007 | Spotify | – | – | 2007 | PL |
| Kombii | Pokolenie | 2004 | Discogs + Spotify | 2004 | – | 2004 | PL |
| Kombii | Sen sie spelni | 2004 | Discogs + Spotify | 2004 | – | 2004 | PL |
| KONIEC ŚWIATA | Oranżada | 2010 | Discogs | 2010 | – | 2015 | PL |
| Kool & the Gang | Celebration | 1980 | Discogs + MusicBrainz+Wikipedia | 1980 | 1980 | – | MY |
| Kool & The Gang | Cherish | 1984 | Discogs + Spotify | 1984 | – | 1984 | US |
| Kool & The Gang | Jungle Boogie | 1973 | Discogs + Spotify | 1973 | – | 1973 | US |
| Korn | Freak On a Leash | 1998 | Discogs + Spotify | 1998 | – | 1998 | US |
| Kortez | Dobry moment | 2017 | Discogs + Spotify | 2017 | – | 2017 | PL |
| Kortez | Dobrze, że Cię mam | 2017 | Discogs + Spotify | 2017 | – | 2017 | PL |
| Kortez | Hej wy | 2018 | Discogs + Spotify | 2018 | – | 2018 | PL |
| Kortez | Od dawna już wiem | 2015 | Discogs + Spotify | 2015 | – | 2015 | PL |
| Kortez | Stare drzewa | 2018 | Discogs + Spotify | 2018 | – | 2018 | PL |
| Kortez | Wyjdź ze mną na deszcz | 2017 | Discogs + Spotify | 2017 | – | 2017 | PL |
| Kortez | Z imbirem | 2015 | Discogs + Spotify | 2015 | – | 2015 | PL |
| Kortez | Zostań | 2015 | Discogs + MusicBrainz+Wikipedia + Spotify | 2015 | 2015 | 2015 | PL |
| Kortez & Kaśka Sochacka | Wiśnia | 2020 | Discogs + Spotify | 2020 | – | 2020 | PL |
| KOSKA | I Like the Way You Kiss Me | 2024 | Spotify | – | – | 2024 | ? |
| Kowalski | Irlandia Zielona | 2001 | Discogs + Spotify | 2001 | – | 2001 | GB |
| Kowalski | Marian | 2001 | Discogs + Spotify | 2001 | – | 2001 | GB |
| Kraftwerk | Autobahn | 1974 | Discogs | 1974 | – | 2017 | DE |
| Kraftwerk | Das Model | 1978 | Discogs | 1978 | – | 2017 | DE |
| Kraftwerk | The Model | 1978 | Discogs + Spotify | 1978 | – | 1978 | DE |
| Kris Kross | Jump | 1992 | Discogs + Spotify | 1992 | – | 1992 | US |
| Krystyna Janda | Na Zakręcie | 1992 | Discogs | 1992 | – | 2014 | PL |
| Krystyna Konarska | Doliny w kwiatach | 1966 | Spotify | – | – | 1966 | PL |
| Krystyna Konarska | Jesienny pan | 2010 | MusicBrainz (Spotify: 2015) | – | 2010 | 2015 | PL |
| Krystyna Prońko | Deszcz w Cisnej | 1978 | Discogs | 1978 | – | 2000 | PL |
| Krystyna Prońko | Jesteś lekiem na całe zło | 1983 | Discogs + MusicBrainz | 1983 | 1983 | 2000 | PL |
| Krystyna Prońko | Małe tęsknoty | 1980 | Discogs | 1980 | – | 2000 | PL |
| Krystyna Prońko | Modlitwa o miłość prawdziwą | 1978 | Discogs | 1978 | – | 2000 | PL |
| Krystyna Prońko | Poranne łzy | 1980 | Discogs | 1980 | – | 2000 | PL |
| Krystyna Prońko | Psalm stojących w kolejce | 1992 | Discogs | 1992 | – | 2000 | PL |
| Krystyna Prońko | Senna Kołysanka | 1992 | Discogs | 1992 | – | 2000 | PL |
| Krystyna Prońko & Halina Frackowiak | Tam gdzie lekki wieje wiatr | 1990 | MusicBrainz (Spotify: 2015) | – | 1990 | 2015 | PL |
| Krzysztof Antkowiak | Zakazany Owoc | 1989 | Discogs + Spotify | 1989 | – | 1989 | PL |
| Krzysztof Jaryczewski & Oddział Zamknięty | Party | 1980 | Spotify | – | – | 1980 | PL |
| Krzysztof Kiljański & Kayah | Prócz Ciebie, Nic | 2005 | Discogs + Spotify | 2005 | – | 2005 | PL |
| Krzysztof Kiljański & Sarsa | Ktoś Między Nami | 2014 | Spotify | – | – | 2014 | PL |
| Krzysztof Klenczon & Trzy Korony | 10 w skali Beauforta | 1971 | Discogs + Spotify | 1971 | – | 1971 | PL |
| Krzysztof Klenczon & Trzy Korony | Nie przejdziemy do historii | 1971 | Discogs + Spotify | 1971 | – | 1971 | PL |
| Krzysztof Klenczon & Trzy Korony | Port | 1970 | Discogs | 1970 | – | 1971 | PL |
| Krzysztof Komeda & Mia Farrow | Lullaby From Rosemary's Baby, Part 1 | 1968 | Spotify | – | – | 1968 | PL |
| Krzysztof Krawczyk | Bo jesteś Ty | 2002 | Discogs + Spotify | 2002 | – | 2002 | PL |
| Krzysztof Krawczyk | Chciałem być | 2002 | Discogs | 2002 | – | 2019 | PL |
| Krzysztof Krawczyk | Hallo, co o tym wiesz | 1974 | Discogs + Spotify | 1974 | – | 1974 | PL |
| Krzysztof Krawczyk | My Cyganie | 2002 | Discogs | 2002 | – | 2004 | PL |
| Krzysztof Krawczyk | Ostatni Raz Zatańczysz Ze Mną | 1993 | Discogs | 1993 | – | 2012 | PL |
| Krzysztof Krawczyk | Parostatek | 1976 | Discogs + MusicBrainz+Wikipedia | 1976 | 1976 | 2011 | PL |
| Krzysztof Krawczyk | Rysunek na szkle | 1976 | Discogs | 1976 | – | 2008 | PL |
| Krzysztof Krawczyk | To Co Dał Nam Świat | 1993 | Discogs | 1993 | – | 2011 | PL |
| Krzysztof Krawczyk | Za Tobą Pójdę Jak Na Bal | 1998 | Discogs | 1998 | – | 2012 | PL |
| Krzysztof Krawczyk | Zycie jak wino | 2007 | Spotify (MusicBrainz: 2012) | – | 2012 | 2007 | PL |
| Krzysztof Krawczyk & Edyta Bartosiewicz | Trudno Tak (Razem Być Nam Ze Sobą) | 2004 | Discogs | 2004 | – | 2016 | PL |
| Krzysztof Krawczyk & Goran Bregović | Mój przyjacielu | 1999 | MusicBrainz+Wikipedia | 2001 | 1999 | 2019 | PL |
| Krzysztof Zalewski | Dziwny jest ten świat | 2018 | Discogs + Spotify | 2018 | – | 2018 | PL |
| Krzysztof Zalewski | Jaśniej | 2013 | Discogs + Spotify | 2013 | – | 2013 | PL |
| Krzysztof Zalewski | Jednakowi | 2026 | Spotify | – | – | 2026 | PL |
| Krzysztof Zalewski | Kurier | 2021 | Discogs + MusicBrainz | 2021 | 2021 | 2019 | PL |
| Krzysztof Zalewski | Miłość miłość | 2016 | Discogs + Spotify | 2016 | – | 2016 | PL |
| Krzysztof Zalewski | Polsko | 2016 | Discogs + Spotify | 2016 | – | 2016 | PL |
| Krzysztof Zalewski | Ptaki | 2021 | Discogs + Spotify | 2021 | – | 2021 | PL |
| Krzysztof Zalewski | Zabawa | 2020 | Discogs + Spotify | 2020 | – | 2020 | PL |
| Krzysztof Zalewski & Natalia Przybysz | Romanca Cherubina | 2021 | Discogs + Spotify | 2021 | – | 2021 | PL |
| KSU | Moje Bieszczady | 1994 | Discogs | 1994 | – | 2005 | PL |
| KSU | Pod Prąd | 1993 | Discogs | 1993 | – | 1998 | PL |
| KT Tunstall | Suddenly I See | 2004 | Discogs | 2004 | – | 2005 | GB |
| Kuba Badach | Byłaś serca biciem | 2009 | Discogs + Spotify | 2009 | – | 2009 | PL |
| Kuba Badach | Liczy się tylko to | 2021 | Spotify (MusicBrainz: 2022) | – | 2022 | 2021 | PL |
| Kuba Badach | Wracam do siebie | 2017 | Discogs + Spotify | 2017 | – | 2017 | PL |
| Kuba Badach | Wykidajło czas | 2018 | Spotify + MusicBrainz | – | 2018 | 2018 | PL |
| Kuba i Kuba | Chłopaki | 2026 | Spotify | – | – | 2026 | PL |
| Kuba i Kuba | Stygnie lato | 2026 | Spotify + MusicBrainz | – | 2026 | 2026 | PL |
| Kult | Arahja | 1988 | Discogs + MusicBrainz+Wikipedia + Spotify | 1988 | 1988 | 1988 | PL |
| Kult | Baranek | 1993 | Discogs + Spotify | 1993 | – | 1993 | PL |
| Kult | Celina | 1993 | Discogs + Spotify | 1993 | – | 1993 | PL |
| Kult | Czarne słońca | 1988 | Spotify (MusicBrainz: 1993) | 2010 | 1993 | 1988 | PL |
| KULT | Do Ani | 1986 | MusicBrainz – oficjalny singiel „Piloci / Do Ani” (1986); w Discogs na albumie „Kult” (1987) jako „O Ani” | 1987 | – | 2016 | PL |
| Kult | Dziewczyna bez zęba na przedzie | 1998 | Discogs + Spotify | 1998 | – | 1998 | PL |
| Kult | Gdy nie ma dzieci | 1998 | Discogs + MusicBrainz+Wikipedia + Spotify | 1998 | 1998 | 1998 | PL |
| Kult | Hej, czy nie wiecie | 1987 | Discogs | 1987 | – | 1991 | PL |
| Kult | Komu bije dzwon | 1998 | Discogs + Spotify | 1998 | – | 1998 | PL |
| Kult | Krew Boga | 1987 | Discogs + Spotify | 1987 | – | 1987 | PL |
| Kult | Lewe lewe loff | 1994 | Discogs + Spotify | 1994 | – | 1994 | PL |
| KULT | Piosenka młodych wioślarzy | 1994 | Discogs | 1994 | – | 2016 | PL |
| Kult | Po co wolność | 1989 | Discogs + Spotify | 1989 | – | 1989 | PL |
| Kult | Polska | 1988 | MusicBrainz+Wikipedia | 2001 | 1991 | 2016 | PL |
| Kungs & Cookin' On 3 Burners | This Girl (Kungs Vs. Cookin' On 3 Burners) | 2016 | Spotify + MusicBrainz | – | 2016 | 2016 | FR |
| Kwiat Jabłoni | Buka | 2021 | Discogs + Spotify | 2021 | – | 2021 | PL |
| Kwiat Jabłoni | Dziś późno pójdę spać | 2018 | MusicBrainz+Wikipedia | 2019 | 2018 | 2019 | PL |
| Kwiat Jabłoni | Mogło być nic | 2021 | Discogs + MusicBrainz | 2021 | 2021 | 2020 | PL |
| Kwiat Jabłoni | Wodymidaj | 2019 | Discogs + Spotify | 2019 | – | 2019 | PL |
| Kwiat Jabłoni & Kasia Lins | Jutro możemy być szczęśliwi | 2022 | Spotify + MusicBrainz | – | 2022 | 2022 | PL |
| Kygo & Parson James | Stole the Show | 2015 | Discogs | 2015 | – | 2016 | NO |
| Kygo & Whitney Houston | Higher Love | 2019 | Discogs + Spotify | 2019 | – | 2019 | NO |
| Kylie Minogue | Can't Get You Out of My Head | 2001 | MusicBrainz+Wikipedia | – | 2001 | 2002 | AU |
| Kylie Minogue | The Loco-Motion | 1988 | Discogs + Spotify | 1988 | – | 1988 | AU |
| L.Stadt | Oczy kamienic | 2017 | Discogs + Spotify | 2017 | – | 2017 | PL |
| La Bouche | Sweet Dreams | 1994 | Discogs | 1994 | – | 2007 | DE |
| La Roux | Bulletproof | 2008 | Discogs | 2008 | – | 2009 | GB |
| LaBelle | Lady Marmalade | 1974 | Discogs + Spotify | 1974 | – | 1974 | US |
| Lachowicz & Nuno | Nie Ma Mnie | 2007 | MusicBrainz (Spotify: 2016) | – | 2007 | 2016 | ? |
| Lady Gaga | Abracadabra | 2025 | Discogs + Spotify | 2025 | – | 2025 | US |
| Lady Gaga | Always Remember Us This Way | 2018 | Discogs + Spotify | 2018 | – | 2018 | US |
| Lady Gaga | Bad Romance | 2009 | Discogs + Spotify | 2009 | – | 2009 | US |
| Lady Gaga | Born This Way | 2011 | Discogs + Spotify | 2011 | – | 2011 | US |
| Lady Gaga | Paparazzi | 2008 | Discogs + Spotify | 2008 | – | 2008 | US |
| Lady Gaga | Poker Face | 2008 | Discogs + MusicBrainz+Wikipedia | 2008 | 2008 | – | US |
| Lady Gaga | The Edge Of Glory | 2011 | Discogs + Spotify | 2011 | – | 2011 | US |
| Lady Gaga & Bradley Cooper | Shallow | 2018 | Discogs + Spotify | 2018 | – | 2018 | US |
| Lady Gaga & Bruno Mars | Die With A Smile | 2024 | Discogs + Spotify | 2024 | – | 2024 | US |
| Lady Gaga & Colby O'Donis | Just Dance | 2008 | Discogs + Spotify | 2008 | – | 2008 | US |
| Lady Pank | Kryzysowa narzeczona | 1983 | Discogs + Spotify | 1983 | – | 1983 | PL |
| Lady Pank | Marchewkowe pole | 1986 | Discogs | 1986 | – | 2004 | PL |
| Lady Pank | Mała wojna | 1988 | Discogs | 1988 | – | 2007 | PL |
| Lady Pank | Mniej niż zero | 1983 | Discogs + MusicBrainz+Wikipedia + Spotify | 1983 | 1983 | 1983 | PL |
| Lady Pank | Na co komu dziś | 1994 | Discogs | 1994 | – | 2007 | PL |
| Lady Pank | Stacja Warszawa | 2004 | Discogs | 2004 | – | 2012 | PL |
| Lady Pank | Sztuka latania | 1990 | Discogs | 1990 | – | 2012 | PL |
| Lady Pank | Tańcz głupia tańcz | 1990 | Discogs | 1990 | – | 2004 | PL |
| Lady Pank | Vademecum skauta | 1983 | Discogs | 1983 | – | 2003 | PL |
| Lady Pank | Wciąż bardziej obcy | 1983 | Discogs + Spotify | 1983 | – | 1983 | PL |
| Lady Pank | Zamki na Piasku | 1983 | Discogs + Spotify | 1983 | – | 1983 | PL |
| Lady Pank | Zawsze tam gdzie Ty | 1990 | Discogs | 1990 | – | 2007 | PL |
| Lady Pank | Zostawcie titanica | 1988 | Discogs | 1988 | – | 2007 | PL |
| Lamb | Gabriel | 2001 | Discogs + Spotify | 2001 | – | 2001 | GB |
| Lana Del Rey | Born To Die | 2012 | Discogs + Spotify | 2012 | – | 2012 | US |
| Lana Del Rey | Doin' Time | 2019 | Discogs + Spotify | 2019 | – | 2019 | US |
| Lana Del Rey | Summertime Sadness | 2012 | Discogs + Spotify | 2012 | – | 2012 | US |
| Lana Del Rey | Video Games | 2011 | Discogs + MusicBrainz+Wikipedia | 2011 | 2011 | 2012 | US |
| Lana Del Rey | Young And Beautiful | 2013 | Discogs + Spotify | 2013 | – | 2013 | US |
| Lanberry | Piątek | 2016 | Discogs + Spotify | 2016 | – | 2016 | PL |
| Lao Che | Czarne Kowboje | 2008 | Discogs + Spotify | 2008 | – | 2008 | PL |
| Lao Che | Godzina W | 2005 | Discogs | 2005 | – | 2012 | PL |
| Lao Che | Govindam | 2012 | Discogs + Spotify | 2012 | – | 2012 | PL |
| Lao Che | Hydropiekłowstąpienie | 2008 | Discogs + Spotify | 2008 | – | 2008 | PL |
| Lao Che | Kapitan Polska | 2018 | Discogs + Spotify | 2018 | – | 2018 | PL |
| Lao Che | Nie raj | 2018 | Discogs + Spotify | 2018 | – | 2018 | PL |
| Lao Che | Stare Miasto | 2005 | Discogs + Spotify | 2005 | – | 2005 | PL |
| Lao Che | Urodziła mnie ciotka | 2010 | Discogs + Spotify | 2010 | – | 2010 | PL |
| Lao Che | Wojenka | 2015 | Discogs + Spotify | 2015 | – | 2015 | PL |
| Latto | Big Energy | 2021 | Discogs | 2021 | – | 2022 | US |
| Laufey | From The Start | 2023 | Discogs + Spotify | 2023 | – | 2023 | IS |
| Laura Branigan | Gloria | 1982 | Discogs + Spotify | 1982 | – | 1982 | US |
| Laura Branigan | Self Control | 1984 | Discogs + Spotify | 1984 | – | 1984 | US |
| Laurie Anderson | O Superman | 1981 | Discogs | 1981 | – | 1982 | US |
| LCD Soundsystem | All My Friends | 2007 | Discogs + Spotify | 2007 | – | 2007 | US |
| Leah Kate | 10 Things I Hate About You | 2022 | Discogs + Spotify | 2022 | – | 2022 | US |
| LeAnn Rimes | Can't Fight The Moonlight | 2000 | MusicBrainz (Spotify: 2001) | – | 2000 | 2001 | US |
| Lech Janerka | Paradoksy | 2005 | Discogs + MusicBrainz | 2005 | 2005 | 2002 | PL |
| Lech Janerka | Rower | 2005 | Discogs + MusicBrainz | 2005 | 2005 | 2002 | PL |
| Lech Janerka | Ta zabawa nie jest dla dziewczynek | 1986 | Discogs | 1986 | – | 2005 | PL |
| Lech Janerka | Wieje | 2002 | Discogs + Spotify | 2002 | – | 2002 | PL |
| Lech Janerka | Wyobraź sobie | 1996 | Discogs | 1996 | – | 2005 | PL |
| Led Zeppelin | All My Love | 1979 | Spotify + MusicBrainz | – | 1979 | 1979 | GB |
| Led Zeppelin | Babe I'm Gonna Leave You | 1969 | Spotify (MusicBrainz: 2003) | – | 2003 | 1969 | GB |
| Led Zeppelin | Black Dog | 1971 | Discogs + Spotify | 1971 | – | 1971 | GB |
| Led Zeppelin | D'yer Mak'er | 1973 | Spotify + MusicBrainz | – | 1973 | 1973 | GB |
| Led Zeppelin | Good Times Bad Times | 1969 | Discogs + Spotify | 1969 | – | 1969 | GB |
| Led Zeppelin | Heartbreaker | 1969 | Discogs + Spotify | 1969 | – | 1969 | GB |
| Led Zeppelin | I'm Gonna Crawl | 1979 | Spotify + MusicBrainz | – | 1979 | 1979 | GB |
| Led Zeppelin | Immigrant Song | 1970 | Discogs + Spotify | 1970 | – | 1970 | GB |
| Led Zeppelin | Kashmir | 1975 | Discogs + Spotify | 1975 | – | 1975 | GB |
| Led Zeppelin | No Quarter | 1973 | Discogs + Spotify | 1973 | – | 1973 | GB |
| Led Zeppelin | Rock and Roll | 1971 | Discogs + Spotify | 1971 | – | 1971 | GB |
| Led Zeppelin | Since I've Been Loving You | 1970 | Spotify (MusicBrainz: 2012) | – | 2012 | 1970 | GB |
| Led Zeppelin | Stairway to Heaven | 1971 | Discogs + MusicBrainz+Wikipedia + Spotify | 1971 | 1971 | 1971 | GB |
| Led Zeppelin | Thank You | 1969 | Discogs + Spotify | 1969 | – | 1969 | GB |
| Led Zeppelin | The Rain Song | 1973 | Discogs + Spotify | 1973 | – | 1973 | GB |
| Led Zeppelin | When the Levee Breaks | 1971 | Discogs + Spotify | 1971 | – | 1971 | GB |
| Led Zeppelin | Whole Lotta Love | 1969 | Discogs + Spotify | 1969 | – | 1969 | GB |
| LemON | Bede Z Toba | 2012 | Discogs + Spotify | 2012 | – | 2012 | PL |
| LemON | Dużo Ciebie Mi | 2023 | Discogs + Spotify | 2023 | – | 2023 | PL |
| LemON | Jutro | 2014 | Discogs + Spotify | 2014 | – | 2014 | PL |
| LemON | Napraw | 2012 | Discogs + Spotify | 2012 | – | 2012 | PL |
| LemON | Nice | 2013 | Spotify + MusicBrainz | – | 2013 | 2013 | PL |
| LemON | Scarlett | 2014 | Discogs + Spotify | 2014 | – | 2014 | PL |
| Lenny Kravitz | Are You Gonna Go My Way | 1993 | Discogs + Spotify | 1993 | – | 1993 | US |
| Lenny Kravitz | Fly Away | 1998 | Discogs + Spotify | 1998 | – | 1998 | US |
| Lenny Kravitz | I Belong To You | 1998 | Discogs | 1998 | – | 2000 | US |
| Lenny Kravitz | It Ain't Over 'Til It's Over | 1991 | Spotify + MusicBrainz | – | 1991 | 1991 | US |
| Lenny Kravitz | Let Love Rule | 1989 | Discogs + Spotify | 1989 | – | 1989 | US |
| Lenny Kravitz | The Chamber | 2014 | Discogs + Spotify | 2014 | – | 2014 | US |
| Lenny Valentino & Artur Rojek | Chłopiec z plasteliny | 2001 | Discogs + Spotify | 2001 | – | 2001 | PL |
| Leon Thomas | MUTT | 2024 | Discogs + Spotify | 2024 | – | 2024 | US |
| Leonard Cohen | Dance Me to the End of Love | 1984 | Discogs + Spotify | 1984 | – | 1984 | CA |
| Leonard Cohen | Famous Blue Raincoat | 1971 | Discogs + Spotify | 1971 | – | 1971 | CA |
| Leonard Cohen | Hallelujah | 1984 | Discogs + Spotify | 1984 | – | 1984 | CA |
| Leonard Cohen | I'm Your Man | 1988 | Spotify + MusicBrainz | – | 1988 | 1988 | CA |
| Leonard Cohen | In My Secret Life | 2001 | Discogs + Spotify | 2001 | – | 2001 | CA |
| Leonard Cohen | Suzanne | 1967 | Spotify + MusicBrainz | 1968 | 1967 | 1967 | CA |
| Leonard Cohen | You Want It Darker | 2016 | Discogs + Spotify | 2016 | – | 2016 | CA |
| Lesley Gore | It's My Party | 1963 | Spotify (MusicBrainz: 1972) | 1996 | 1972 | 1963 | US |
| Lesley Gore | You Don't Own Me | 1963 | Discogs + Spotify | 1963 | – | 1963 | US |
| Lewis Capaldi | Forget Me | 2022 | Discogs | 2022 | – | 2023 | GB |
| Lewis Capaldi | Someone You Loved | 2018 | Discogs + MusicBrainz+Wikipedia | 2018 | 2018 | – | GB |
| Lianne La Havas | Green & Gold | 2015 | Discogs + Spotify | 2015 | – | 2015 | GB |
| Lianne La Havas | Lost & Found | 2011 | Discogs | 2011 | – | 2012 | GB |
| Liber & Sylwia Grzeszczak | Mijamy się | 2008 | Discogs + Spotify | 2008 | – | 2008 | PL |
| Lil Nas X | MONTERO (Call Me By Your Name) | 2021 | Discogs + Spotify | 2021 | – | 2021 | US |
| Lilly Wood and The Prick & Robin Schulz | Prayer in C | 2014 | Spotify + MusicBrainz | – | 2014 | 2014 | FR |
| Limahl | Never Ending Story | 1984 | Discogs | 1984 | – | 2009 | GB |
| Limboski | Na statku | 2019 | Spotify + MusicBrainz | – | 2019 | 2019 | PL |
| Limboski | W Trawie | 2016 | Spotify | – | – | 2016 | PL |
| Limp Bizkit | Behind Blue Eyes | 2003 | Discogs + Spotify | 2003 | – | 2003 | US |
| Limp Bizkit | Take A Look Around | 2000 | Discogs + Spotify | 2000 | – | 2000 | US |
| Linkin Park | Breaking the Habit | 2003 | Discogs + Spotify | 2003 | – | 2003 | US |
| Linkin Park | In the End | 2000 | Discogs + MusicBrainz+Wikipedia + Spotify | 2000 | 2000 | 2000 | US |
| Linkin Park | Numb | 2003 | Discogs + Spotify | 2003 | – | 2003 | US |
| Linkin Park | What I've Done | 2007 | Spotify + MusicBrainz | – | 2007 | 2007 | US |
| Lionel Richie | Hello | 1983 | Discogs + Spotify | 1983 | – | 1983 | US |
| Lionel Richie | Say You, Say Me | 1985 | Discogs | 1985 | – | 1986 | US |
| Lionel Richie & Diana Ross | Endless Love | 1984 | Discogs | 1984 | – | 1992 | US |
| Lipali | Ludzie 1.2 | 2015 | Spotify + MusicBrainz | – | 2015 | 2015 | PL |
| Lipali | Wschód | 2015 | Spotify + MusicBrainz | – | 2015 | 2015 | PL |
| Liquido | Narcotic | 1998 | Discogs | 1998 | – | 2026 | DE |
| Lisa Stansfield | All Around the World | 1989 | Discogs + Spotify | 1989 | – | 1989 | GB |
| Lisa Stansfield | Change | 1991 | Discogs | 1991 | – | 2001 | GB |
| Lita Ford | Kiss Me Deadly | 1988 | Discogs + Spotify | 1988 | – | 1988 | US |
| Lita Ford & Ozzy Osbourne | Close My Eyes Forever | 1988 | Discogs + Spotify | 1988 | – | 1988 | US |
| Little Richard | Tutti Frutti | 1955 | Discogs | 1955 | – | 1957 | US |
| Live | Overcome | 2001 | Discogs + Spotify | 2001 | – | 2001 | US |
| Live | The Dolphin's Cry | 1999 | Spotify + MusicBrainz | – | 1999 | 1999 | US |
| Livka | poza Tobą nic | 2026 | Spotify | – | – | 2026 | PL |
| Livka & Igor Herbut | List | 2024 | Discogs + Spotify | 2024 | – | 2024 | PL |
| Lizzo | About Damn Time | 2022 | Discogs + Spotify | 2022 | – | 2022 | US |
| Lizzo | Juice | 2019 | Discogs + Spotify | 2019 | – | 2019 | US |
| Lizzy McAlpine | ceilings | 2022 | Discogs + Spotify | 2022 | – | 2022 | US |
| LMFAO | Sexy And I Know It | 2011 | Discogs + Spotify | 2011 | – | 2011 | US |
| LMFAO & Lauren Bennett | Party Rock Anthem | 2011 | Discogs + Spotify | 2011 | – | 2011 | US |
| Lola Young | Messy | 2024 | Discogs + Spotify | 2024 | – | 2024 | GB |
| Lombard | Adriatyk - Ocean Gorący | 1984 | Discogs | 1984 | – | 2004 | PL |
| Lombard | Diamentowa Kula | 1983 | Discogs | 1983 | – | 2002 | PL |
| Lombard | Gołębi Puch | 1985 | Discogs | 1985 | – | 2002 | PL |
| Lombard | Przeżyj to sam | 1982 | MusicBrainz+Wikipedia | 1983 | 1983 | 2002 | PL |
| Lombard | Stan gotowości | 1984 | Discogs | 1984 | – | 2004 | PL |
| Lombard | Szklana pogoda | 1994 | Discogs | 1994 | – | 2004 | PL |
| Lombard | Taniec pingwina na szkle | 1983 | Discogs | 1983 | – | 2004 | PL |
| Lombard | Znowu radio | 1994 | Discogs | 1994 | – | 2004 | PL |
| Londonbeat | I've Been Thinking About You | 1991 | MusicBrainz (Spotify: 1995) | – | 1991 | 1995 | GB |
| Lorde | Green Light | 2017 | Discogs + Spotify | 2017 | – | 2017 | NZ |
| Lorde | Royals | 2012 | Discogs | 2012 | – | 2013 | NZ |
| Lorde | Supercut | 2017 | Discogs + Spotify | 2017 | – | 2017 | NZ |
| Lorde | Team | 2013 | Discogs + Spotify | 2013 | – | 2013 | NZ |
| Los Lobos | La Bamba | 1987 | Discogs + Spotify | 1987 | – | 1987 | US |
| Lost Frequencies | Are You With Me | 2014 | Discogs | 2014 | – | 2016 | BE |
| Lost Frequencies & Calum Scott | Where Are You Now | 2021 | Discogs + Spotify | 2021 | – | 2021 | BE |
| Lou Bega | Mambo No. 5 (A Little Bit of...) | 1999 | Discogs + MusicBrainz+Wikipedia | 1999 | 1999 | – | DE |
| Lou Reed | Perfect Day | 1972 | Discogs + Spotify | 1972 | – | 1972 | US |
| Lou Reed | Satellite of Love | 1972 | Discogs + Spotify | 1972 | – | 1972 | US |
| Lou Reed | Walk On the Wild Side | 1972 | Discogs + Spotify | 1972 | – | 1972 | US |
| Louis Armstrong | We Have all The Time in the World | 1969 | Discogs | 1969 | – | 2010 | US |
| Louis Armstrong | What a Wonderful World | 1967 | Discogs + MusicBrainz+Wikipedia | 1967 | 1967 | 1968 | US |
| Love Affair | Everlasting Love | 1967 | Discogs | 1967 | – | 1968 | GB |
| Loverboy | Working for the Weekend | 1981 | Discogs + Spotify | 1981 | – | 1981 | CA |
| Luis Fonsi | Despacito | 2017 | Discogs + MusicBrainz+Wikipedia | 2017 | 2017 | – | PR |
| Luther Vandross | Never Too Much | 1981 | Discogs + Spotify | 1981 | – | 1981 | US |
| Luxtorpeda | AUTYSTYCZNY | 2011 | Discogs + Spotify | 2011 | – | 2011 | PL |
| Luxtorpeda | HYMN | 2012 | Discogs + Spotify | 2012 | – | 2012 | PL |
| Luxtorpeda | Mambałaga | 2014 | Discogs + Spotify | 2014 | – | 2014 | PL |
| Luxtorpeda | WILKI DWA | 2012 | Discogs + Spotify | 2012 | – | 2012 | PL |
| Lykke Li & The Magician | I Follow Rivers | 2011 | Discogs + Spotify | 2011 | – | 2011 | SE |
| Lynyrd Skynyrd | Free Bird | 1973 | Discogs + Spotify | 1973 | – | 1973 | US |
| Lynyrd Skynyrd | Sweet Home Alabama | 1974 | Discogs + Spotify | 1974 | – | 1974 | US |
| M / Robin Scott & Nick Launay | Pop Muzik | 1979 | Spotify (MusicBrainz: 2026) | – | 2026 | 1979 | ? |
| M.I.A. | Paper Planes | 2007 | Discogs + Spotify | 2007 | – | 2007 | GB |
| M83 | Midnight City | 2011 | Discogs + Spotify | 2011 | – | 2011 | FR |
| Maanam | Anioł | 1991 | Discogs | 1991 | – | 2015 | PL |
| Maanam | Bez ciebie umieram | 1994 | Discogs + Spotify | 1994 | – | 1994 | PL |
| Maanam | Blues Kory | 1993 | Discogs | 1993 | – | 2011 | PL |
| Maanam | Boskie Buenos | 1980 | Discogs | 1980 | – | 1981 | PL |
| Maanam | Cykady na Cykladach | 1981 | MusicBrainz+Wikipedia | 1991 | 1991 | 2006 | PL |
| Maanam | Die Grenze | 1982 | Discogs + Spotify | 1982 | – | 1982 | PL |
| Maanam | Eksplozja | 1984 | Discogs + Spotify | 1984 | – | 1984 | PL |
| Maanam | Espana for Ever | 1984 | Discogs | 1984 | – | 2006 | PL |
| Maanam | Jestem kobietą | 1984 | Discogs | 1984 | – | 2015 | PL |
| Maanam | Karuzela z madonnami | 2011 | Discogs | 2011 | – | 2015 | PL |
| Maanam | Kocham cię, kochanie moje | 1983 | MusicBrainz+Wikipedia | 1984 | 1991 | 1995 | PL |
| Maanam | Krakowski spleen | 1984 | Discogs + Spotify | 1984 | – | 1984 | PL |
| Maanam | Lipstick on the Glass | 1985 | Discogs + Spotify | 1985 | – | 1985 | PL |
| Maanam | Lucciola | 1985 | Discogs + Spotify | 1985 | – | 1985 | PL |
| Maanam | Nic dwa razy | 1994 | Discogs | 1994 | – | 2015 | PL |
| Maanam | O! Nie Rób Tyle Hałasu | 1982 | Spotify + MusicBrainz | – | 1982 | 1982 | PL |
| Maanam | Oddech Szczura | 1980 | Discogs | 1980 | – | 1981 | PL |
| Maanam | Po prostu bądź | 1995 | Discogs | 1995 | – | 1996 | PL |
| Maanam | Raz-dwa, raz-dwa | 1984 | Discogs + Spotify | 1984 | – | 1984 | PL |
| Maanam | Róża (Zdrada i Wniebowstąpienie) | 1994 | Discogs + Spotify | 1994 | – | 1994 | PL |
| Maanam | Sie Ściemnia | 1989 | Discogs + Spotify | 1989 | – | 1989 | PL |
| Maanam | Szare Miraże | 1980 | Discogs | 1980 | – | 1981 | PL |
| Maanam | Szał niebieskich ciał | 1980 | Discogs | 1980 | – | 1981 | PL |
| Maanam | Ta noc do innych jest niepodobna | 1981 | Discogs | 1981 | – | 2006 | PL |
| Maanam | To tylko tango | 1984 | Discogs | 1984 | – | 1995 | PL |
| Maanam | Wyjątkowo Zimny Maj | 1991 | Discogs + Spotify | 1991 | – | 1991 | PL |
| Maanam | Zapatrzenie | 1994 | Discogs | 1994 | – | 2015 | PL |
| Maciej Kossowski | Dwudziestolatki | 1996 | Discogs | 1996 | – | 2016 | PL |
| Maciej Malenczuk z zespolem Psychodancing | Dawna dziewczyno | 2010 | Spotify | – | – | 2010 | ? |
| Maciej Maleńczuk | Ach Proszę Pani | 1998 | Discogs | 1998 | – | 2016 | PL |
| Maciej Maleńczuk & Wojciech Waglewski | Koledzy | 2007 | Discogs + Spotify | 2007 | – | 2007 | PL |
| Maciek Czemplik & Aneta Szymczyk | Czarny Blues O Czwartej Nad Ranem | 2017 | Spotify | – | – | 2017 | ? |
| Maciek Czemplik & Aneta Szymczyk | Sen Na Pogodne Dni | 2017 | Spotify | – | – | 2017 | ? |
| Maciek Czemplik & Martyna Kasprzycka | Bieszczadzkie anioły | 2018 | Spotify | – | – | 2018 | ? |
| Maciek Czemplik & Natalia Podwin | Małe szczęścia | 2020 | Spotify | – | – | 2020 | ? |
| Macklemore & Ryan Lewis | Can't Hold Us | 2011 | MusicBrainz (Spotify: 2012) | – | 2011 | 2012 | US |
| Macklemore & Ryan Lewis & Macklemore | Thrift Shop | 2012 | Discogs + Spotify | 2012 | – | 2012 | US |
| Macy Gray | I Try | 1999 | Discogs + Spotify | 1999 | – | 1999 | US |
| Mad Season | Wake Up | 1995 | Discogs + Spotify | 1995 | – | 1995 | US |
| Madame | Sybilla (Może własnie Sybilla) | 2001 | MusicBrainz (Spotify: 2011) | – | 2001 | 2011 | IT |
| Made In Poland | Ja myślę | 2005 | Discogs | 2005 | – | 2006 | PL |
| Madness | Our House | 1982 | Discogs + Spotify | 1982 | – | 1982 | GB |
| Madonna | American Pie | 2000 | Discogs + Spotify | 2000 | – | 2000 | US |
| Madonna | Don't Tell Me | 2000 | Spotify + MusicBrainz | 2001 | 2000 | 2000 | US |
| Madonna | Frozen | 1998 | Discogs + Spotify | 1998 | – | 1998 | US |
| Madonna | Holiday | 1983 | Discogs + Spotify | 1983 | – | 1983 | US |
| Madonna | Hung Up | 2005 | Discogs + Spotify | 2005 | – | 2005 | US |
| Madonna | Into the Groove | 1985 | Discogs | 1985 | – | 2009 | US |
| Madonna | La Isla Bonita | 1986 | Discogs + Spotify | 1986 | – | 1986 | US |
| Madonna | Like a Prayer | 1989 | Discogs + Spotify | 1989 | – | 1989 | US |
| Madonna | Like a Virgin | 1984 | Discogs + MusicBrainz+Wikipedia + Spotify | 1984 | 1984 | 1984 | US |
| Madonna | Material Girl | 1984 | Discogs | 1984 | – | 1985 | US |
| Madonna | Papa Don't Preach | 1986 | Spotify + MusicBrainz | – | 1986 | 1986 | US |
| Madonna | Ray of Light | 1998 | Discogs + Spotify | 1998 | – | 1998 | US |
| Madonna | Take a Bow | 1994 | Discogs + Spotify | 1994 | – | 1994 | US |
| Madonna | The Power of Good-Bye | 1998 | Discogs + Spotify | 1998 | – | 1998 | US |
| Madonna | Vogue | 1990 | Discogs + Spotify | 1990 | – | 1990 | US |
| Madonna | You'll See | 1995 | Spotify + MusicBrainz | – | 1995 | 1995 | US |
| Madonna & Justin Timberlake | 4 Minutes | 2008 | Discogs + Spotify | 2008 | – | 2008 | US |
| Mae Stephens | If We Ever Broke Up | 2023 | Spotify + MusicBrainz | – | 2023 | 2023 | GB |
| MAFIA | Imię Deszczu | 1996 | Discogs | 1996 | – | 2008 | PL |
| Magda Umer | Jeszcze w zielone gramy | 1995 | Discogs | 1995 | – | 2014 | PL |
| Magda Umer | Już szumią kasztany | 1973 | Discogs + MusicBrainz | 1973 | 1973 | 1972 | PL |
| Magda Umer | Koncert Jesienny na Dwa Świerszcze | 2008 | MusicBrainz (Spotify: 2015) | – | 2008 | 2015 | PL |
| Magda Umer | Koncert jesienny na dwa świerszcze i wiatr w kominie | 1973 | Discogs + MusicBrainz | 1973 | 1973 | 1972 | PL |
| Magda Umer | Kołysanka | 2010 | Spotify | – | – | 2010 | PL |
| Magda Umer | Oczy Tej Małej | 1995 | Discogs | 1995 | – | 2014 | PL |
| Magda Umer & Bogdan Hołownia | Pejzaż Bez Ciebie | 2016 | Spotify | – | – | 2016 | PL |
| Majestic & Boney M. | Rasputin | 2021 | Discogs + Spotify | 2021 | – | 2021 | GB |
| Majka Jeżowska | A Ja Wolę Moją Mamę | 1986 | Discogs | 1986 | – | 2020 | PL |
| Majka Jeżowska | Laleczka z Saskiej Porcelany | 1996 | Discogs | 1996 | – | 2020 | PL |
| Majka Jeżowska | Wszystkie Dzieci Nasze Są | 1991 | Discogs | 1991 | – | 2020 | PL |
| Major Lazer & DJ Snake | Lean On | 2015 | Discogs + Spotify | 2015 | – | 2015 | JM |
| majtis & Alien BSC | na zabój | 2026 | Spotify | – | – | 2026 | ? |
| Make It New | Camel Rajaz | 2025 | Spotify | – | – | 2025 | ? |
| maks.tachasiuk | Ćma | 2026 | Spotify | – | – | 2026 | ? |
| Malarze i Żołnierze | Po prostu pastelowe | 1991 | Discogs + MusicBrainz | 1991 | 1991 | 1989 | PL |
| Manfred Mann | Do Wah Diddy Diddy | 1964 | Discogs + Spotify | 1964 | – | 1964 | GB |
| Manfred Mann's Earth Band | Blinded by the Light | 1976 | Discogs + Spotify | 1976 | – | 1976 | GB |
| Manic Street Preachers | A Design for Life | 1996 | Discogs | 1996 | – | 2002 | GB |
| Manic Street Preachers | If You Tolerate This Your Children Will Be Next | 1998 | Discogs + Spotify | 1998 | – | 1998 | GB |
| Manic Street Preachers | Motorcycle Emptiness | 1992 | Discogs + Spotify | 1992 | – | 1992 | GB |
| Manic Street Preachers | The Everlasting | 1998 | Discogs + Spotify | 1998 | – | 1998 | GB |
| Manic Street Preachers | Theme From M*A*S*H (Suicide Is Painless) | 1992 | Spotify (MusicBrainz: 2012) | 2014 | 2012 | 1992 | GB |
| Mano Negra | Mala Vida | 1988 | Discogs + Spotify | 1988 | – | 1988 | FR |
| Manu Chao | Bongo Bong | 1998 | Discogs + Spotify | 1998 | – | 1998 | FR |
| Marcelina & Piotr Rogucki | Karmelove | 2013 | Spotify + MusicBrainz | – | 2013 | 2013 | ? |
| Marcin Klimczak | Aicha | 2014 | MusicBrainz (Spotify: 2016) | – | 2014 | 2016 | PL |
| Marcin Maciejczak | To nie koniec | 2026 | Spotify | – | – | 2026 | PL |
| Marcin Przybyłowicz | Wilcza zamieć - Wiedźmin 3: Dziki Gon | 2015 | Spotify | – | – | 2015 | PL |
| Marcin Rozynek | Najlepsze | 2003 | Discogs + Spotify | 2003 | – | 2003 | PL |
| Marcin Rozynek | Silacz | 2003 | Discogs + Spotify | 2003 | – | 2003 | PL |
| Marek Bilinski | Dom w dolinie mgieł | 1983 | Discogs | 1983 | – | 2019 | PL |
| Marek Bilinski | Ucieczka z tropiku | 1983 | Discogs | 1983 | – | 2019 | PL |
| Marek Dyjak | Człowiek (Złota Ryba) | 2004 | MusicBrainz (Spotify: 2011) | – | 2004 | 2011 | PL |
| Marek Dyjak | Zmiennicy | 2019 | Spotify | – | – | 2019 | PL |
| Marek Grechuta | Chodźmy / Świecie nasz | 2008 | MusicBrainz (Spotify: 2010) | – | 2008 | 2010 | PL |
| Marek Grechuta | Dni, których nie znamy | 1971 | Discogs | 1971 | – | 2010 | PL |
| Marek Grechuta | Gdzieś w nas | 1991 | Discogs | 1991 | – | 2013 | PL |
| Marek Grechuta | Jadę Pociągiem Prawdziwym | 1990 | Discogs | 1990 | – | 2014 | PL |
| Marek Grechuta | Korowód | 1970 | Discogs | 1970 | – | 2010 | PL |
| Marek Grechuta | Ocalić od zapomnienia | 1971 | Discogs | 1971 | – | 2015 | PL |
| Marek Grechuta | Wiosna - ach to ty | 1987 | Discogs | 1987 | – | 2010 | PL |
| Marek Grechuta | Wędrówka | 1991 | Discogs | 1991 | – | 2010 | PL |
| Marek Grechuta | Świecie nasz | 1971 | Discogs | 1971 | – | 2015 | PL |
| Marek Grechuta & Anawa | Będziesz moją panią | 1970 | Discogs | 1970 | – | 2010 | PL |
| Marek Grechuta & Anawa | Nie dokazuj | 1970 | Discogs | 1970 | – | 2010 | PL |
| Marek Grechuta & Anawa | Niepewność | 1969 | Discogs | 1969 | – | 2010 | PL |
| Marek Grechuta & Anawa | Serce | 1969 | Discogs | 1969 | – | 2010 | PL |
| Marek Grechuta & Anawa | Tango Anawa | 1969 | Discogs | 1969 | – | 2010 | PL |
| Marek Grechuta i Anawa | Ocalic od zapomnienia | 2014 | Spotify | – | – | 2014 | ? |
| Marek Jackowski | Oprocz Blekitnego Nieba | 1994 | Discogs | 1994 | – | 2002 | PL |
| Margaret | Thank You Very Much | 2013 | Discogs + MusicBrainz+Wikipedia | 2013 | 2013 | – | PL |
| Maria Koterbska | Augustowskie Noce | 1990 | Discogs | 1990 | – | 2015 | PL |
| Maria McKee | Show Me Heaven | 1990 | Discogs | 1990 | – | 2002 | US |
| Maria Peszek | Moje miasto | 2005 | Discogs + Spotify | 2005 | – | 2005 | PL |
| Maria Peszek | Sorry Polsko | 2012 | Discogs + Spotify | 2012 | – | 2012 | PL |
| Maria Sadowska | Kiedy Nie Ma Miłości | 2006 | Discogs | 2006 | – | 2007 | PL |
| Mariah Carey | All I Want for Christmas Is You | 1994 | Discogs + MusicBrainz+Wikipedia | 1994 | 1994 | – | US |
| Mariah Carey | Vision of Love | 1990 | Discogs + Spotify | 1990 | – | 1990 | US |
| Mariah Carey | Without You | 1993 | Discogs + Spotify | 1993 | – | 1993 | US |
| Marianne Faithfull | As Tears Go By | 1964 | Discogs + Spotify | 1964 | – | 1964 | GB |
| Marika | Moje serce | 2008 | Spotify + MusicBrainz | – | 2008 | 2008 | PL |
| Marillion | Beautiful | 1995 | Discogs + Spotify | 1995 | – | 1995 | GB |
| Marillion | Fugazi | 1984 | Discogs | 1984 | – | 1988 | GB |
| Marillion | Incommunicado | 1987 | Discogs | 1987 | – | 1992 | GB |
| Marillion | Kayleigh | 1985 | Discogs | 1985 | – | 1992 | GB |
| Marillion | Lavender | 1985 | Discogs | 1985 | – | 1992 | GB |
| Marillion | Script for a Jester's Tear | 1983 | Spotify + MusicBrainz | 1986 | 1983 | 1983 | GB |
| Marillion | Sugar Mice | 1987 | Discogs + Spotify | 1987 | – | 1987 | GB |
| Marillion | This Is the 21st Century | 2001 | Discogs + Spotify | 2001 | – | 2001 | GB |
| Marilyn Manson | The Beautiful People | 1996 | Discogs + Spotify | 1996 | – | 1996 | US |
| Marissa | Odkochaj | 2026 | Spotify | – | – | 2026 | BR |
| Mariusz Lubomski | Spacerologia | 1998 | MusicBrainz (Spotify: 1999) | – | 1998 | 1999 | PL |
| Mark Knopfler | Sailing To Philadelphia | 2000 | Discogs | 2000 | – | 2005 | GB |
| Mark Knopfler | What It Is | 2000 | Discogs + Spotify | 2000 | – | 2000 | GB |
| Mark Knopfler & Mark Knopfler's Guitar Heroes | Going Home | 1986 | MusicBrainz (Spotify: 2024) | – | 1986 | 2024 | GB |
| Mark Ronson | Uptown Funk | 2014 | MusicBrainz+Wikipedia | 2015 | 2014 | 2015 | GB |
| Mark Ronson & Amy Winehouse | Valerie | 2007 | Discogs + Spotify | 2007 | – | 2007 | GB |
| Mark Ronson & Miley Cyrus | Nothing Breaks Like a Heart | 2018 | Discogs + Spotify | 2018 | – | 2018 | GB |
| Marlena Shaw | California Soul | 1969 | Discogs + Spotify | 1969 | – | 1969 | US |
| Maroon 5 | This Love | 2002 | Discogs + Spotify | 2002 | – | 2002 | US |
| Maroon 5 & Christina Aguilera | Moves Like Jagger | 2010 | Spotify + MusicBrainz | 2011 | 2010 | 2010 | US |
| Martika | Toy Soldiers | 1988 | Discogs + Spotify | 1988 | – | 1988 | US |
| Martyna Jakubowicz | W domach z betonu nie ma wolnej miłości | 1983 | Discogs | 1983 | – | 2015 | PL |
| Martyna Jakubowicz & Wojciech Waglewski | Ja Płonę | 2016 | Spotify + MusicBrainz | – | 2016 | 2016 | PL |
| Marvin Gaye | Got To Give It Up | 1977 | Discogs | 1977 | – | 2008 | US |
| Marvin Gaye | I Heard It Through The Grapevine | 1968 | Discogs + Spotify | 1968 | – | 1968 | US |
| Marvin Gaye | Sexual Healing | 1982 | Discogs + Spotify | 1982 | – | 1982 | US |
| Marvin Gaye | What's Going On | 1971 | Discogs + MusicBrainz+Wikipedia + Spotify | 1971 | 1971 | 1971 | US |
| Marvin Gaye & Tammi Terrell | Ain't No Mountain High Enough | 1967 | Discogs + Spotify | 1967 | – | 1967 | US |
| Mary Hopkin | Goodbye | 1969 | Discogs + Spotify | 1969 | – | 1969 | GB |
| Mary Hopkin | Those Were The Days | 1968 | Discogs | 1968 | – | 1969 | GB |
| Maryla Rodowicz | Ballada Wagonowa | 1970 | Discogs | 1970 | – | 2014 | PL |
| Maryla Rodowicz | Damą być | 1976 | Discogs + Spotify | 1976 | – | 1976 | PL |
| Maryla Rodowicz | Do łezki łezka | 1974 | Discogs + Spotify | 1974 | – | 1974 | PL |
| Maryla Rodowicz | Kiedy Się Dziwić Przestanę | 1974 | Discogs | 1974 | – | 2008 | PL |
| Maryla Rodowicz | Ludzkie gadanie | 1976 | Discogs + Spotify | 1976 | – | 1976 | PL |
| Maryla Rodowicz | Małgośka | 1973 | Discogs | 1973 | – | 2014 | PL |
| Maryla Rodowicz | Niech Żyje Bal | 1986 | Discogs + Spotify | 1986 | – | 1986 | PL |
| Maryla Rodowicz | Remedium | 1978 | Discogs + Spotify | 1978 | – | 1978 | PL |
| Maryla Rodowicz | Sing-Sing | 1976 | Discogs + Spotify | 1976 | – | 1976 | PL |
| Maryla Rodowicz | W Sumie Nie Jest Źle | 2017 | Discogs + Spotify | 2017 | – | 2017 | PL |
| Maryla Rodowicz | Wariatka Tańczy | 1979 | Discogs | 1979 | – | 2012 | PL |
| Maryla Rodowicz & Alibabki | Wielka Woda | 1979 | Discogs | 1979 | – | 2014 | PL |
| Maryla Rodowicz & Marek Grechuta | Gaj | 1978 | Discogs + Spotify | 1978 | – | 1978 | PL |
| Massive Attack | Karmacoma | 1994 | Discogs + Spotify | 1994 | – | 1994 | GB |
| Massive Attack & Elizabeth Fraser | Teardrop | 1998 | Discogs + Spotify | 1998 | – | 1998 | GB |
| Massive Attack & Shara Nelson | Unfinished Sympathy | 1991 | Discogs + Spotify | 1991 | – | 1991 | GB |
| Mata | Patointeligencja | 2020 | Discogs + Spotify | 2020 | – | 2020 | PL |
| Mata | Patoreakcja | 2021 | Discogs + Spotify | 2021 | – | 2021 | PL |
| Matthew Wilder | Break My Stride | 1983 | Discogs + Spotify | 1983 | – | 1983 | US |
| Matthews' Southern Comfort | Woodstock | 1970 | Discogs | 1970 | – | 2016 | GB |
| Maurice Williams | Stay | 1960 | Discogs | 1960 | – | 2008 | US |
| Mawn's Gallery & Nicole Kulesza | Co się śni niewidomym | 2017 | Spotify | – | – | 2017 | ? |
| Maxim & Skin | Carmen Queasy | 2000 | Discogs + Spotify | 2000 | – | 2000 | DE |
| Maxine Nightingale | Right Back Where We Started From | 1975 | Discogs | 1975 | – | 2020 | GB |
| Mazzy Star | Fade Into You | 1993 | Discogs + Spotify | 1993 | – | 1993 | US |
| Małgorzata Kozłowska | Prosta Piosenka | 2020 | Spotify | – | – | 2020 | ? |
| Małgorzata Ostrowska | Golebi puch | 2001 | Spotify + MusicBrainz | – | 2001 | 2001 | PL |
| Małgorzata Ostrowska | Lawa | 1999 | Discogs + Spotify | 1999 | – | 1999 | PL |
| Małgorzata Ostrowska | Meluzyna | 2012 | Discogs | 2012 | – | 2014 | PL |
| Małgorzata Ostrowska | Szklana pogoda | 2001 | Spotify + MusicBrainz | – | 2001 | 2001 | PL |
| MC Hammer | U Can't Touch This | 1990 | Spotify + MusicBrainz | – | 1990 | 1990 | US |
| McFadden & Whitehead | Ain't No Stoppin' Us Now | 1976 | MusicBrainz (Spotify: 1979) | – | 1976 | 1979 | US |
| Meat Loaf | Bat Out of Hell | 1977 | Discogs + Spotify | 1977 | – | 1977 | US |
| Meat Loaf | I'd Do Anything For Love (But I Won't Do That) | 1993 | Spotify + MusicBrainz | – | 1993 | 1993 | US |
| Meat Loaf | Paradise By the Dashboard Light | 1977 | Discogs + Spotify | 1977 | – | 1977 | US |
| Mecano | Hijo de la luna | 1986 | Discogs + Spotify | 1986 | – | 1986 | ES |
| Megadeth | A Tout Le Monde | 1994 | Discogs + Spotify | 1994 | – | 1994 | US |
| Megadeth | Hangar 18 | 1990 | Discogs + Spotify | 1990 | – | 1990 | US |
| Megadeth | Symphony Of Destruction | 1992 | Discogs + Spotify | 1992 | – | 1992 | US |
| Meghan Trainor | Made You Look | 2022 | Discogs + Spotify | 2022 | – | 2022 | US |
| Mel Tormé | Comin' Home Baby | 1962 | Discogs | 1962 | – | 2005 | US |
| Mela Koteluk | Fastrygi | 2014 | Discogs + Spotify | 2014 | – | 2014 | PL |
| Mela Koteluk | Melodia ulotna | 2012 | Discogs + Spotify | 2012 | – | 2012 | PL |
| Mela Koteluk | Odprowadź | 2018 | Discogs + Spotify | 2018 | – | 2018 | PL |
| Mela Koteluk | Spadochron | 2012 | Discogs + Spotify | 2012 | – | 2012 | PL |
| Mela Koteluk | Żurawie origami | 2014 | Discogs + Spotify | 2014 | – | 2014 | PL |
| Mela Koteluk & Kwadrofonik | Astronomia | 2020 | Discogs + Spotify | 2020 | – | 2020 | PL |
| Mela Koteluk & Kwadrofonik | Drzewa | 2020 | Spotify + MusicBrainz | – | 2020 | 2020 | PL |
| Men At Work | Down Under | 1981 | Discogs + Spotify | 1981 | – | 1981 | AU |
| Mercury Rev | Holes | 1998 | Discogs + Spotify | 1998 | – | 1998 | US |
| Meredith Brooks | Bitch | 1997 | Discogs + Spotify | 1997 | – | 1997 | US |
| Mery Spolsky | Bigotka | 2019 | Discogs + Spotify | 2019 | – | 2019 | PL |
| Mesajah | Kazdego dnia | 2008 | Discogs + Spotify | 2008 | – | 2008 | PL |
| Metallica | Enter Sandman | 1991 | Discogs | 1991 | – | 2021 | US |
| Metallica | Fade To Black | 1984 | Discogs + Spotify | 1984 | – | 1984 | US |
| Metallica | For Whom The Bell Tolls | 1984 | Discogs + Spotify | 1984 | – | 1984 | US |
| Metallica | Mama Said | 1996 | Discogs + Spotify | 1996 | – | 1996 | US |
| Metallica | Master Of Puppets | 1986 | Discogs + Spotify | 1986 | – | 1986 | US |
| Metallica | Nothing Else Matters | 1991 | Discogs + MusicBrainz+Wikipedia + Spotify | 1991 | 1991 | 1991 | US |
| Metallica | One | 1988 | Discogs + Spotify | 1988 | – | 1988 | US |
| Metallica | The Unforgiven | 1991 | Discogs + Spotify | 1991 | – | 1991 | US |
| Metallica | Until It Sleeps | 1996 | Discogs + Spotify | 1996 | – | 1996 | US |
| Metallica | Whiskey In The Jar | 1998 | Discogs + Spotify | 1998 | – | 1998 | US |
| Metro Boomin & The Weeknd | Creepin' | 2022 | Discogs + Spotify | 2022 | – | 2022 | US |
| Metro Station | Shake It | 2007 | Discogs + Spotify | 2007 | – | 2007 | US |
| Metronomy | The Look | 2011 | Discogs + Spotify | 2011 | – | 2011 | GB |
| Mezo & Liber | Aniele | 2003 | Discogs + Spotify | 2003 | – | 2003 | PL |
| Mezo & Tabb | Sacrum | 2006 | Spotify + MusicBrainz | – | 2006 | 2006 | PL |
| MGMT | Electric Feel | 2007 | Discogs + Spotify | 2007 | – | 2007 | US |
| MGMT | Kids | 2005 | Discogs + Spotify | 2005 | – | 2005 | US |
| MGMT | Time to Pretend | 2005 | Discogs + Spotify | 2005 | – | 2005 | US |
| Miami Sound Machine & Gloria Estefan | Conga! | 1985 | Discogs + Spotify | 1985 | – | 1985 | US |
| Michael Bolton | When a Man Loves a Woman | 1991 | Discogs + Spotify | 1991 | – | 1991 | US |
| Michael Bublé | Cry Me a River | 2009 | Discogs + Spotify | 2009 | – | 2009 | CA |
| Michael Bublé | Home | 2005 | Spotify + MusicBrainz | – | 2005 | 2005 | CA |
| Michael Bublé | Me and Mrs. Jones | 2007 | Discogs + Spotify | 2007 | – | 2007 | CA |
| Michael Giacchino | Mission: Impossible Theme | 2006 | Discogs + Spotify | 2006 | – | 2006 | US |
| Michael Jackson | Bad | 1987 | Discogs | 1987 | – | 1995 | US |
| Michael Jackson | Beat It | 1982 | Discogs | 1982 | – | 2008 | US |
| Michael Jackson | Billie Jean | 1982 | Discogs + MusicBrainz+Wikipedia | 1982 | 1982 | 2005 | US |
| Michael Jackson | Black or White | 1991 | Discogs + Spotify | 1991 | – | 1991 | US |
| Michael Jackson | Dirty Diana | 1987 | Discogs | 1987 | – | 2003 | US |
| Michael Jackson | Don't Stop 'Til You Get Enough | 1979 | Spotify + MusicBrainz | – | 1979 | 1979 | US |
| Michael Jackson | Earth Song | 1995 | Discogs + Spotify | 1995 | – | 1995 | US |
| Michael Jackson | Give In to Me | 1991 | Discogs + Spotify | 1991 | – | 1991 | US |
| Michael Jackson | Heal the World | 1991 | Discogs + Spotify | 1991 | – | 1991 | US |
| Michael Jackson | Human Nature | 1982 | Discogs + Spotify | 1982 | – | 1982 | US |
| Michael Jackson | Liberian Girl | 1987 | Discogs | 1987 | – | 2012 | US |
| Michael Jackson | Man in the Mirror | 1987 | Discogs | 1987 | – | 1995 | US |
| Michael Jackson | Rockin' Robin | 1972 | Discogs + Spotify | 1972 | – | 1972 | US |
| Michael Jackson | Smooth Criminal | 1987 | Discogs | 1987 | – | 2012 | US |
| Michael Jackson | Thriller | 1982 | Discogs | 1982 | – | 2008 | US |
| Michael Jackson | Wanna Be Startin' Somethin' | 1982 | Discogs | 1982 | – | 2009 | US |
| Michael Kiwanuka | Cold Little Heart | 2016 | Discogs + Spotify | 2016 | – | 2016 | GB |
| Michael Sembello | Maniac | 1983 | Discogs | 1983 | – | 2019 | US |
| Michał Bajor | Nie chcę więcej | 1989 | Discogs | 1989 | – | 1995 | PL |
| Michał Bajor | Och, Zycie Kocham Cie Nad Zycie | 2015 | Discogs + Spotify | 2015 | – | 2015 | PL |
| Michał Bajor | Ogrzej mnie | 1989 | Discogs | 1989 | – | 1990 | PL |
| Michał Lorenc | Taniec Eleny | 1997 | Discogs | 1997 | – | 2017 | PL |
| Michał Szpak | Kochanie! | 2026 | Spotify | – | – | 2026 | PL |
| Michał Wiśniewski & Mandaryna | Będzie Było | 2026 | Spotify | – | – | 2026 | ? |
| Middle Of The Road | Soley Soley | 1971 | Discogs | 1971 | – | 1989 | GB |
| Midge Ure | If I Was | 1985 | Discogs + Spotify | 1985 | – | 1985 | GB |
| Midnight Oil | Beds Are Burning | 1987 | Discogs + Spotify | 1987 | – | 1987 | AU |
| Midnight Oil | Blue Sky Mine | 1990 | Discogs + Spotify | 1990 | – | 1990 | AU |
| Mieczysław Fogg | To ostatnia niedziela | 1960 | Discogs | 1960 | – | 1969 | PL |
| Mietek Szczesniak | Spoza Nas | 2002 | MusicBrainz (Spotify: 2016) | – | 2002 | 2016 | PL |
| MIKA | Grace Kelly | 2006 | Discogs + Spotify | 2006 | – | 2006 | GB |
| Mike + The Mechanics | Over My Shoulder | 1995 | Discogs + Spotify | 1995 | – | 1995 | GB |
| Mike + The Mechanics | Silent Running | 1985 | Discogs + Spotify | 1985 | – | 1985 | GB |
| Mike + The Mechanics | The Living Years | 1988 | Discogs + Spotify | 1988 | – | 1988 | GB |
| Mike Oldfield | Five Miles Out | 1982 | Discogs | 1982 | – | 2009 | GB |
| Mike Oldfield | Moonlight Shadow | 1983 | Discogs | 1983 | – | 2009 | GB |
| Mike Oldfield | To France | 1984 | Discogs | 1984 | – | 2012 | GB |
| Mike Oldfield | Tubular Bells - Pt. I | 1973 | Spotify | – | – | 1973 | GB |
| Mike Oldfield | Tubular Bells - Pt. II | 1973 | Spotify | – | – | 1973 | GB |
| Mike Posner & Gigamesh | Cooler Than Me | 2009 | Discogs | 2009 | – | 2010 | US |
| Mikromusic | Tak Mi Się Nie Chce | 2017 | Spotify + MusicBrainz | 2018 | 2017 | 2017 | PL |
| Mikromusic | Takiego chłopaka | 2013 | Spotify + MusicBrainz | 2023 | 2013 | 2013 | PL |
| Miles Davis | So What | 1959 | Discogs | 1959 | – | 1998 | US |
| Miley Cyrus | Angels Like You | 2020 | Discogs + Spotify | 2020 | – | 2020 | US |
| Miley Cyrus | Flowers | 2023 | Discogs + MusicBrainz+Wikipedia + Spotify | 2023 | 2023 | 2023 | US |
| Miley Cyrus | Wrecking Ball | 2013 | Discogs + Spotify | 2013 | – | 2013 | US |
| Milky Chance | Stolen Dance | 2013 | Discogs + Spotify | 2013 | – | 2013 | DE |
| Mira Kubasinska | Do kogo idziesz | 1971 | Discogs | 1971 | – | 2018 | PL |
| Mira Kubasinska | W co mam wierzyć | 1971 | Discogs | 1971 | – | 2018 | PL |
| Mira Kubasinska & Breakout | Wielki ogień | 1973 | Discogs + Spotify | 1973 | – | 1973 | PL |
| Missy Elliott | Get Ur Freak On | 2001 | Discogs + Spotify | 2001 | – | 2001 | US |
| Mitski | My Love Mine All Mine | 2023 | Discogs + Spotify | 2023 | – | 2023 | US |
| Miuosh & Smolik | Miasto Szczęścia | 2017 | Discogs | 2017 | – | 2018 | PL |
| Miuosh & Smolik | Wizje | 2015 | Discogs | 2015 | – | 2018 | PL |
| Miętha | Mamo | 2021 | Discogs + Spotify | 2021 | – | 2021 | PL |
| Miłość | Zdrowy Kołłątaj I | 1997 | Spotify | 2002 | – | 1997 | PL |
| Miłość | Zdrowy Kołłątaj II | 1997 | Spotify | 2002 | – | 1997 | PL |
| Moby | In This World | 2002 | Discogs + Spotify | 2002 | – | 2002 | US |
| Moby | Lift Me Up | 2005 | Discogs + Spotify | 2005 | – | 2005 | US |
| Moby | Porcelain | 1999 | Discogs + Spotify | 1999 | – | 1999 | US |
| Moby | Why Does My Heart Feel so Bad? | 1999 | Discogs + Spotify | 1999 | – | 1999 | US |
| MODELKI & Vłodarski | LUBIĘ CIĘ JAK LATO | 2026 | Spotify + MusicBrainz | – | 2026 | 2026 | PL |
| Modern Talking | Atlantis Is Calling (S.O.S. for Love) | 1986 | Discogs + Spotify | 1986 | – | 1986 | DE |
| Modern Talking | Brother Louie | 1986 | Discogs + Spotify | 1986 | – | 1986 | DE |
| Modern Talking | Cheri Cheri Lady | 1985 | Discogs + Spotify | 1985 | – | 1985 | DE |
| Modern Talking | You're My Heart, You're My Soul | 1984 | MusicBrainz+Wikipedia | – | 1984 | 1985 | DE |
| Modest Mouse | Float On | 2004 | Discogs + Spotify | 2004 | – | 2004 | US |
| Modjo | Lady - Hear Me Tonight | 2000 | Discogs | 2000 | – | 2001 | FR |
| Moloko | Sing It Back | 1998 | Discogs + Spotify | 1998 | – | 1998 | GB |
| Moloko | The Time Is Now | 2000 | Discogs + Spotify | 2000 | – | 2000 | GB |
| Monaco | What Do You Want From Me? | 1997 | Discogs + Spotify | 1997 | – | 1997 | GB |
| Monika Borzym | Ty tu ja tam tango | 2021 | Spotify | – | – | 2021 | PL |
| Monty Python | Always Look On The Bright Side Of Life | 1979 | Discogs | 1979 | – | 1989 | GB |
| Morcheeba | Otherwise | 2002 | Discogs + Spotify | 2002 | – | 2002 | GB |
| Morcheeba | Rome Wasn't Built in a Day | 2000 | Spotify + MusicBrainz | – | 2000 | 2000 | GB |
| Morrissey | Everyday Is Like Sunday | 1988 | Discogs + Spotify | 1988 | – | 1988 | GB |
| Morrissey | Suedehead | 1988 | Discogs | 1988 | – | 1997 | GB |
| Mory Kanté | Yeke Yeke | 1985 | MusicBrainz (Spotify: 1987) | 1994 | 1985 | 1987 | GN |
| Mother Love Bone | Chloe Dancer/Crown Of Thorns | 1989 | Discogs | 1989 | – | 1992 | US |
| Mott The Hoople | All the Young Dudes | 1972 | Discogs + Spotify | 1972 | – | 1972 | GB |
| Motörhead | Ace of Spades | 1980 | Discogs + Spotify | 1980 | – | 1980 | GB |
| Mr. Big | To Be With You | 1991 | Discogs | 1991 | – | 1996 | US |
| Mr. Mister | Broken Wings | 1985 | Discogs + Spotify | 1985 | – | 1985 | US |
| Mr. Mister | Kyrie | 1985 | Discogs + Spotify | 1985 | – | 1985 | US |
| Mr. President | Coco Jamboo | 1996 | Discogs + Spotify | 1996 | – | 1996 | DE |
| Mr. Zoob | Mój jest ten kawałek podłogi | 1998 | Discogs | 1998 | – | 2011 | PL |
| Mrozu | Lepsze czasy | 2026 | Spotify + MusicBrainz | – | 2026 | 2026 | PL |
| Mrozu | Miliony monet | 2009 | Spotify + MusicBrainz | – | 2009 | 2009 | PL |
| Mrozu | Nie ma miejsca jak dom | 2026 | Spotify + MusicBrainz | – | 2026 | 2026 | PL |
| Mrozu | Szerokie wody | 2017 | Discogs + Spotify | 2017 | – | 2017 | PL |
| Mrozu | Złoto | 2022 | Discogs + MusicBrainz | 2022 | 2022 | 2021 | PL |
| Mrozu & Julia Pietrucha | Anioły (Pojedynek) | 2026 | Spotify + MusicBrainz | – | 2026 | 2026 | PL |
| Mrozu & Kacperczyk | Wszystko czego chciałem | 2026 | Spotify + MusicBrainz | – | 2026 | 2026 | PL |
| Mrozu & Sound n' Grace | Nic Do Stracenia | 2014 | Spotify + MusicBrainz | 2023 | 2014 | 2014 | PL |
| Mrozu & Vito Bambino | Za Daleko | 2022 | Discogs + Spotify | 2022 | – | 2022 | PL |
| Mrozu & Waldemar Kasta | Globalnie | 2010 | Spotify + MusicBrainz | – | 2010 | 2010 | PL |
| Mrozu & Zalia | Odpowiedni moment | 2025 | Spotify (MusicBrainz: 2026) | – | 2026 | 2025 | PL |
| Ms. Lauryn Hill | Doo Wop (That Thing) | 1998 | Spotify (MusicBrainz: 2014) | – | 2014 | 1998 | US |
| Muchy | Gdyby Nie Szerszenie | 2015 | Discogs + Spotify | 2015 | – | 2015 | PL |
| Muchy & BELA | Szaroróżowe | 2021 | Discogs + Spotify | 2021 | – | 2021 | PL |
| Muddy Waters | I'm Your Hoochie Coochie Man | 1960 | MusicBrainz (Spotify: 1977) | 1997 | 1960 | 1977 | US |
| Mumford & Sons | I Will Wait | 2012 | Discogs + Spotify | 2012 | – | 2012 | GB |
| Mumford & Sons | Little Lion Man | 2008 | Discogs | 2008 | – | 2009 | GB |
| Mungo Jerry | In the Summertime | 1970 | Discogs | 1970 | – | 1971 | GB |
| Muniek Staszczyk | Pola | 2019 | Discogs + Spotify | 2019 | – | 2019 | PL |
| Murray Head | One Night In Bangkok | 1984 | Discogs + MusicBrainz | 1984 | 1984 | 1980 | GB |
| Muse | Hysteria | 2003 | Discogs | 2003 | – | 2004 | GB |
| Muse | Knights of Cydonia | 2006 | Discogs | 2006 | – | 2013 | GB |
| Muse | Resistance | 2009 | Discogs + Spotify | 2009 | – | 2009 | GB |
| Muse | Starlight | 2006 | Discogs + Spotify | 2006 | – | 2006 | GB |
| Muse | Uprising | 2009 | Discogs + Spotify | 2009 | – | 2009 | GB |
| Muzycy Orkiestry Symfonicznej Filharmonii w Szczecinie & Old Skull Hippie Combo | Za majem maj | 2018 | Spotify | – | – | 2018 | ? |
| Muzyka Końca Lata | Ekstramocne | 2007 | Discogs + Spotify | 2007 | – | 2007 | PL |
| my bloody valentine | soon | 1990 | Discogs | 1990 | – | 1991 | IE |
| my bloody valentine | when you sleep | 1991 | Discogs + Spotify | 1991 | – | 1991 | IE |
| My Chemical Romance | Welcome to the Black Parade | 2006 | Discogs + Spotify | 2006 | – | 2006 | US |
| Myslovitz | Alexander | 1999 | Discogs + Spotify | 1999 | – | 1999 | PL |
| Myslovitz | Chciałbym umrzeć z miłości | 2002 | Discogs | 2002 | – | – | PL |
| Myslovitz | Chłopcy | 1999 | Discogs + Spotify | 1999 | – | 1999 | PL |
| Myslovitz | Dla Ciebie | 1999 | Discogs + Spotify | 1999 | – | 1999 | PL |
| Myslovitz | Długość dźwięku samotności | 1999 | Discogs + MusicBrainz+Wikipedia + Spotify | 1999 | 1999 | 1999 | PL |
| Myslovitz | Kraków | 1999 | Discogs + Spotify | 1999 | – | 1999 | PL |
| Myslovitz | Mieć czy być | 2006 | Discogs + Spotify | 2006 | – | 2006 | PL |
| Myslovitz | My | 1999 | Spotify + MusicBrainz | – | 1999 | 1999 | PL |
| Myslovitz | Myszy i ludzie | 1997 | Discogs + Spotify | 1997 | – | 1997 | PL |
| Myslovitz | Nienawiść | 1999 | Discogs + Spotify | 1999 | – | 1999 | PL |
| Myslovitz | Nocnym pociągiem aż do końca świata | 2006 | Discogs + Spotify | 2006 | – | 2006 | PL |
| Myslovitz | Peggy Brown | 1996 | Discogs + Spotify | 1996 | – | 1996 | PL |
| Myslovitz | Scenariusz dla moich sąsiadów | 1997 | Discogs + Spotify | 1997 | – | 1997 | PL |
| Myslovitz | The Iris Sleeps Under the Snow | 2003 | Discogs | 2003 | – | 2021 | PL |
| Myslovitz | W Deszczu Maleńkich Żółtych Kwiatów | 2006 | Discogs + Spotify | 2006 | – | 2006 | PL |
| Myslovitz | Z twarzą Marilyn Monroe | 1996 | Discogs + Spotify | 1996 | – | 1996 | PL |
| Måneskin | I WANNA BE YOUR SLAVE | 2021 | Discogs + Spotify | 2021 | – | 2021 | IT |
| Mötley Crüe | Dr. Feelgood | 1989 | Discogs + Spotify | 1989 | – | 1989 | US |
| Mötley Crüe | Girls, Girls, Girls | 1987 | Discogs + Spotify | 1987 | – | 1987 | US |
| Mötley Crüe | Home Sweet Home | 1985 | Discogs + Spotify | 1985 | – | 1985 | US |
| Mötley Crüe | Kickstart My Heart | 1989 | Discogs + Spotify | 1989 | – | 1989 | US |
| Mötley Crüe | Shout at the Devil | 1983 | Discogs + Spotify | 1983 | – | 1983 | US |
| Mötley Crüe | Wild Side | 1987 | Discogs + Spotify | 1987 | – | 1987 | US |
| Męskie Granie Orkiestra | Wspomnienie | 2019 | Spotify + MusicBrainz | – | 2019 | 2019 | PL |
| Męskie Granie Orkiestra & Błażej Król | Byłaś serca biciem | 2020 | Spotify | – | – | 2020 | PL |
| Męskie Granie Orkiestra & Daria Zawiałow | I Ciebie też, bardzo | 2021 | Discogs + Spotify | 2021 | – | 2021 | PL |
| Męskie Granie Orkiestra & Daria Zawiałow | Płoną góry, płoną lasy | 2020 | Spotify | – | – | 2020 | PL |
| Męskie Granie Orkiestra & Daria Zawiałow | Ten wasz świat | 2021 | Spotify + MusicBrainz | – | 2021 | 2021 | PL |
| Męskie Granie Orkiestra & Daria Zawiałow | Świt | 2020 | Spotify + MusicBrainz | – | 2020 | 2020 | PL |
| Męskie Granie Orkiestra & Dawid Podsiadło | Nic Nie Może Przecież Wiecznie Trwać | 2016 | Spotify | – | – | 2016 | PL |
| Męskie Granie Orkiestra & Dawid Podsiadło | Początek | 2018 | Spotify + MusicBrainz | – | 2018 | 2018 | PL |
| Męskie Granie Orkiestra & Dawid Podsiadło | Wataha | 2016 | Spotify + MusicBrainz | – | 2016 | 2016 | PL |
| Męskie Granie Orkiestra & Igo | Supermoce | 2023 | Discogs + Spotify | 2023 | – | 2023 | PL |
| Męskie Granie Orkiestra & Igor Herbut | Nareszcie | 2026 | Spotify + MusicBrainz | – | 2026 | 2026 | PL |
| Męskie Granie Orkiestra & Igor Herbut | Tańczę | 2026 | Spotify + MusicBrainz | – | 2026 | 2026 | PL |
| Męskie Granie Orkiestra & Krzysztof Zalewski | Obracam W Palcach Złoty Pieniądz | 2015 | Spotify + MusicBrainz | 2022 | 2015 | 2015 | PL |
| Męskie Granie Orkiestra & Nosowska | Sobie i Wam | 2019 | Spotify + MusicBrainz | – | 2019 | 2019 | PL |
| Męskie Granie Orkiestra & Obywatel G.C. 2.0 | Ciało | 2017 | Spotify | – | – | 2017 | PL |
| Męskie Granie Orkiestra & Smolik | Elektryczny | 2014 | Spotify + MusicBrainz | – | 2014 | 2014 | PL |
| N.E.R.D | She Wants To Move | 2004 | Spotify + MusicBrainz | – | 2004 | 2004 | FI |
| Nancy Sinatra | Bang Bang (My Baby Shot Me Down) | 1966 | Spotify + MusicBrainz | – | 1966 | 1966 | US |
| Nancy Sinatra | These Boots Are Made for Walkin' | 1965 | Discogs + MusicBrainz+Wikipedia | 1965 | 1966 | 1987 | US |
| Nas | N.Y. State of Mind | 1994 | Spotify + MusicBrainz | – | 1994 | 1994 | US |
| Nas & Ms. Lauryn Hill | If I Ruled the World (Imagine That) | 1996 | Discogs + Spotify | 1996 | – | 1996 | US |
| Nat King Cole | L-O-V-E | 1964 | Discogs | 1964 | – | 1965 | US |
| Nat King Cole | Unforgettable | 1951 | Discogs | 1951 | – | 1954 | US |
| Nat King Cole | When I Fall In Love | 1957 | Discogs + Spotify | 1957 | – | 1957 | US |
| Natalia Kukulska | Ani Słowa | 2003 | Spotify + MusicBrainz | – | 2003 | 2003 | PL |
| Natalia Kukulska | Decymy | 2003 | Discogs + Spotify | 2003 | – | 2003 | PL |
| Natalia Kukulska | Im Wiecej Ciebie Tym Mniej | 1997 | Discogs + Spotify | 1997 | – | 1997 | PL |
| Natalia Kukulska | W Biegu | 1997 | Discogs + Spotify | 1997 | – | 1997 | PL |
| Natalia Kukulska | Wierność jest nudna - Och Karol 2 OST | 2011 | Spotify | – | – | 2011 | PL |
| Natalia Kukulska & TEDE | Kamienie | 2003 | Discogs + Spotify | 2003 | – | 2003 | PL |
| Natalia Nykiel & 4Money | To tylko ciąg dalszy | 2026 | Spotify + MusicBrainz | – | 2026 | 2026 | PL |
| Natalia Przybysz | Ciepły Wiatr | 2019 | Discogs + Spotify | 2019 | – | 2019 | PL |
| Natalia Przybysz | Dzieci malarzy | 2017 | Discogs + Spotify | 2017 | – | 2017 | PL |
| Natalia Przybysz | Miod | 2014 | Discogs + Spotify | 2014 | – | 2014 | PL |
| Natalia Przybysz | Nazywam się niebo | 2014 | Discogs + Spotify | 2014 | – | 2014 | PL |
| Natalia Przybysz | Ogień | 2019 | Discogs + Spotify | 2019 | – | 2019 | PL |
| Natalia Szroeder & Vito Bambino | Późne godziny | 2021 | Discogs | 2021 | – | 2022 | PL |
| Natalia Zastępa | Nie Żałuję | 2019 | Spotify (MusicBrainz: 2021) | – | 2021 | 2019 | PL |
| Natalie Imbruglia | Torn | 1997 | Discogs + Spotify | 1997 | – | 1997 | AU |
| Natasha Bedingfield | Unwritten | 2004 | Discogs + Spotify | 2004 | – | 2004 | GB |
| Nathan Dawe & Ella Henderson | 21 Reasons | 2022 | Spotify + MusicBrainz | – | 2022 | 2022 | GB |
| Naughty Boy & Sam Smith | La La La | 2013 | Discogs + Spotify | 2013 | – | 2013 | GB |
| Nazareth | Dream On | 1982 | Spotify + MusicBrainz | – | 1982 | 1982 | GB |
| Nazareth | Hair of the Dog | 1975 | Discogs + Spotify | 1975 | – | 1975 | GB |
| Nazareth | Love Hurts | 1974 | Discogs | 1974 | – | 1975 | GB |
| Nazareth | This Flight Tonight | 1973 | Discogs | 1973 | – | 2001 | GB |
| Neil Diamond | Girl, You'll Be A Woman Soon | 1967 | MusicBrainz (Spotify: 1968) | – | 1967 | 1968 | US |
| Neil Diamond | Love On The Rocks | 1980 | Discogs | 1980 | – | 1996 | US |
| Neil Diamond | Song Sung Blue | 1972 | Discogs | 1972 | – | 2014 | US |
| Neil Diamond | Sweet Caroline | 1969 | Discogs + Spotify | 1969 | – | 1969 | US |
| Neil Diamond & Barbra Streisand | You Don't Bring Me Flowers | 1977 | MusicBrainz (Spotify: 1978) | – | 1977 | 1978 | US |
| Neil Sedaka | Laughter In The Rain | 1974 | Discogs | 1974 | – | 2007 | US |
| Neil Sedaka | Oh! Carol | 1959 | Spotify (MusicBrainz: 1986) | 1968 | 1986 | 1959 | US |
| Neil Young | Harvest Moon | 1992 | Discogs | 1992 | – | 2004 | CA |
| Neil Young | Heart of Gold | 1971 | Discogs | 1971 | – | 1972 | CA |
| Neil Young | Rockin' in the Free World | 1989 | Discogs + Spotify | 1989 | – | 1989 | CA |
| Nelly & Kelly Rowland | Dilemma | 2002 | Discogs + Spotify | 2002 | – | 2002 | US |
| Nelly Furtado | All Good Things (Come To An End) | 2006 | Discogs + Spotify | 2006 | – | 2006 | CA |
| Nelly Furtado | I'm Like A Bird | 2000 | Spotify + MusicBrainz | – | 2000 | 2000 | CA |
| Nelly Furtado | Maneater | 2006 | Discogs + Spotify | 2006 | – | 2006 | CA |
| Nelly Furtado | Say It Right | 2006 | Discogs + Spotify | 2006 | – | 2006 | CA |
| Nelly Furtado & Timbaland | Promiscuous | 2006 | Discogs + Spotify | 2006 | – | 2006 | CA |
| Nena | 99 Luftballons | 1983 | Discogs + MusicBrainz+Wikipedia + Spotify | 1983 | 1983 | 1983 | DE |
| Nena | Irgendwie, Irgendwo, Irgendwann | 1984 | Discogs | 1984 | – | 1985 | DE |
| Neneh Cherry | Buffalo Stance | 1988 | Discogs | 1988 | – | 1989 | SE |
| Neneh Cherry | Woman | 1996 | Discogs + Spotify | 1996 | – | 1996 | SE |
| New Model Army | Lullaby | 1998 | Discogs + Spotify | 1998 | – | 1998 | GB |
| New Order | Blue Monday | 1983 | Discogs | 1983 | – | 1987 | GB |
| New Order | Blue Monday '88 | 1994 | Discogs + Spotify | 1994 | – | 1994 | GB |
| New Order | Regret | 1993 | Discogs + Spotify | 1993 | – | 1993 | GB |
| New Order | True Faith | 1987 | Discogs + Spotify | 1987 | – | 1987 | GB |
| New Radicals | You Get What You Give | 1998 | Discogs + Spotify | 1998 | – | 1998 | US |
| Niall Horan | Heaven | 2023 | Discogs + Spotify | 2023 | – | 2023 | IE |
| Nick Cave & The Bad Seeds | Do You Love Me? | 1994 | Discogs + Spotify | 1994 | – | 1994 | AU |
| Nick Cave & The Bad Seeds | Into My Arms | 1997 | Discogs + Spotify | 1997 | – | 1997 | AU |
| Nick Cave & The Bad Seeds | Jubilee Street | 2012 | Discogs | 2012 | – | 2013 | AU |
| Nick Cave & The Bad Seeds | Red Right Hand | 1994 | Discogs + Spotify | 1994 | – | 1994 | AU |
| Nick Cave & The Bad Seeds | The Weeping Song | 1990 | Discogs + Spotify | 1990 | – | 1990 | AU |
| Nick Cave & The Bad Seeds & Kylie Minogue | Where the Wild Roses Grow | 1995 | Discogs | 1995 | – | 1996 | AU |
| Nick Cave & The Bad Seeds & PJ Harvey | Henry Lee | 1995 | Discogs | 1995 | – | 1996 | AU |
| Nickelback | How You Remind Me | 2001 | Discogs + Spotify | 2001 | – | 2001 | CA |
| Nicki Minaj | Starships | 2012 | Discogs + Spotify | 2012 | – | 2012 | US |
| Nicky Youre & hey daisy | Sunroof | 2021 | MusicBrainz (Spotify: 2023) | – | 2021 | 2023 | US |
| Nico | These Days | 1967 | Discogs + Spotify | 1967 | – | 1967 | DE |
| Niemen | Bema pamięci żałobny rapsod | 1969 | Spotify (MusicBrainz: 2009) | 1970 | 2009 | 1969 | PL |
| Niemen | Dziwny jest ten świat | 1967 | Discogs + MusicBrainz | 1967 | 1967 | 2011 | PL |
| Niemen | Jednego serca | 1970 | Discogs + MusicBrainz | 1970 | 1970 | 1969 | PL |
| Niemen | Sen O Warszawie | 1979 | MusicBrainz (Spotify: 2014) | – | 1979 | 2014 | PL |
| Niemen | Wspomnienie | 1967 | Discogs + MusicBrainz | 1967 | 1967 | 2011 | PL |
| Niemen & Akwarele | Czy mnie jeszcze pamiętasz? | 1968 | Spotify (MusicBrainz: 1969) | – | 1969 | 1968 | PL |
| Niemen & Akwarele | Klęcząc przed tobą | 1968 | Discogs + Spotify | 1968 | – | 1968 | PL |
| Niemen & Akwarele | Obok nas | 1969 | Discogs + MusicBrainz | 1969 | 1969 | 1968 | PL |
| Niemen & Akwarele | Pod Papugami | 1969 | Discogs + MusicBrainz | 1969 | 1969 | 1968 | PL |
| Niemen & Akwarele | Płonąca stodoła | 1968 | Discogs + Spotify | 1968 | – | 1968 | PL |
| Niemen & Akwarele | Wiem, że nie wrócisz | 1968 | Spotify (MusicBrainz: 1969) | – | 1969 | 1968 | PL |
| Night Ranger | Sister Christian | 1983 | Discogs + Spotify | 1983 | – | 1983 | US |
| Nik Kershaw | The Riddle | 1984 | Discogs + Spotify | 1984 | – | 1984 | GB |
| Nik Kershaw | Wouldn't It Be Good | 1984 | Spotify + MusicBrainz | – | 1984 | 1984 | GB |
| Nina Simone | Ain't Got No | 1992 | MusicBrainz (Spotify: 2015) | 2021 | 1992 | 2015 | US |
| Nina Simone | Feeling Good | 1965 | Discogs + Spotify | 1965 | – | 1965 | US |
| Nina Simone | I Put A Spell On You | 1965 | Discogs + Spotify | 1965 | – | 1965 | US |
| Nina Simone | Sinnerman | 1965 | Discogs + Spotify | 1965 | – | 1965 | US |
| Nine Inch Nails | Hurt | 1994 | Discogs + Spotify | 1994 | – | 1994 | US |
| Nirvana | Come As You Are | 1991 | Discogs + Spotify | 1991 | – | 1991 | US |
| Nirvana | Heart-Shaped Box | 1993 | Discogs + Spotify | 1993 | – | 1993 | US |
| Nirvana | In Bloom | 1991 | Discogs | 1991 | – | 2021 | US |
| Nirvana | Lithium | 1991 | Discogs + Spotify | 1991 | – | 1991 | US |
| Nirvana | Smells Like Teen Spirit | 1991 | Discogs + MusicBrainz+Wikipedia + Spotify | 1991 | 1991 | 1991 | US |
| Nirvana | The Man Who Sold The World | 1994 | Discogs + Spotify | 1994 | – | 1994 | US |
| Nita | To zabolało | 2026 | Spotify | – | – | 2026 | ES |
| No Doubt | Don't Speak | 1995 | Spotify + MusicBrainz | – | 1995 | 1995 | US |
| No Doubt | Hella Good | 2001 | Discogs + Spotify | 2001 | – | 2001 | US |
| No Doubt | It's My Life | 2000 | MusicBrainz (Spotify: 2003) | 2001 | 2000 | 2003 | US |
| No Doubt | Just A Girl | 1995 | Discogs + Spotify | 1995 | – | 1995 | US |
| Noah Kahan | Stick Season | 2022 | Discogs + Spotify | 2022 | – | 2022 | US |
| Norah Jones | Come Away With Me | 2001 | Discogs | 2001 | – | 2002 | US |
| Norah Jones | Don't Know Why | 2001 | MusicBrainz (Spotify: 2002) | – | 2001 | 2002 | US |
| Norbi | Kobiety Są Gorące | 1997 | Discogs | 1997 | – | 2005 | PL |
| Norbi | Rozkołysz Się | 1998 | Discogs | 1998 | – | 2005 | PL |
| Nosowska | Brawa dla Państwa | 2018 | Discogs + Spotify | 2018 | – | 2018 | PL |
| Nosowska | Era Retuszera | 2007 | Discogs + Spotify | 2007 | – | 2007 | PL |
| Nosowska | Ja pas! | 2018 | Spotify + MusicBrainz | – | 2018 | 2018 | PL |
| Nosowska | Jeśli Wiesz Co Chcę Powiedzieć | 1996 | Discogs + Spotify | 1996 | – | 1996 | PL |
| Nosowska | Kto? | 2011 | Discogs (ponowne sprawdzenie) | 2011 | 2011 | 2016 | PL |
| Nosowska | Na Całych Jeziorach Ty | 2008 | Discogs (ponowne sprawdzenie) | 2008 | 2008 | 2012 | PL |
| Nosowska | Uciekaj, Moje Serce | 2008 | Discogs (ponowne sprawdzenie) | 2008 | 2008 | 2012 | PL |
| Nowator & LEREK | Moja Panienka | 2019 | Spotify | – | – | 2019 | PL |
| Nula Stankiewicz | W moim magicznym domu | 2022 | Spotify | – | – | 2022 | ? |
| O$ka | Bezele Kochanie | 2017 | Spotify + MusicBrainz | – | 2017 | 2017 | PL |
| O-Zone | Dragostea din tei | 2003 | Discogs | 2003 | – | 2004 | MD |
| O.N.A. | Drzwi | 1995 | Discogs | 1995 | – | 2017 | PL |
| O.N.A. | Kiedy powiem sobie dość | 1996 | Discogs + Spotify | 1996 | – | 1996 | PL |
| Oasis | Champagne Supernova | 1995 | Discogs + Spotify | 1995 | – | 1995 | GB |
| Oasis | Wonderwall | 1995 | Discogs + MusicBrainz+Wikipedia | 1995 | 1995 | 2011 | GB |
| Obywatel G.C. | Nie Pytaj O Polskę | 1993 | Discogs | 1993 | – | 2004 | PL |
| Obywatel G.C. | Paryż-Moskwa 17.15 | 1986 | Discogs + Spotify | 1986 | – | 1986 | PL |
| Obywatel G.C. | Podróż Do Ciepłych Krajów | 1993 | Discogs | 1993 | – | 2017 | PL |
| Obywatel G.C. | Przyznaję się do winy | 1986 | Discogs + Spotify | 1986 | – | 1986 | PL |
| Obywatel G.C. | Tak ... Tak ... To Ja | 1993 | Discogs | 1993 | – | 2004 | PL |
| Ochman & Wszystko Dobrze | Plastik | 2026 | Spotify | – | – | 2026 | PL |
| Of Monsters and Men | Little Talks | 2011 | Discogs | 2011 | – | 2012 | IS |
| Ohio Players | Love Rollercoaster | 1975 | Discogs + Spotify | 1975 | – | 1975 | US |
| Olaf Deriglasoff | Pieśń o bohaterze | 2014 | Spotify + MusicBrainz | – | 2014 | 2014 | PL |
| Oliver Tree | Life Goes On | 2021 | Discogs + Spotify | 2021 | – | 2021 | US |
| Olivia Dean | Man I Need | 2025 | Discogs + Spotify | 2025 | – | 2025 | GB |
| Olivia Rodrigo | deja vu | 2021 | Discogs + Spotify | 2021 | – | 2021 | US |
| Olivia Rodrigo | drivers license | 2021 | Discogs + MusicBrainz+Wikipedia + Spotify | 2021 | 2021 | 2021 | US |
| Olivia Rodrigo | good 4 u | 2021 | Discogs + Spotify | 2021 | – | 2021 | US |
| Olivia Rodrigo | vampire | 2023 | Discogs + Spotify | 2023 | – | 2023 | US |
| Olly Alexander (Years & Years) | King | 2015 | Spotify | – | – | 2015 | ? |
| OMC | How Bizarre | 1995 | Discogs | 1995 | – | 1996 | NZ |
| Omega | Gyöngyhajú lány | 1969 | Discogs + Spotify | 1969 | – | 1969 | HU |
| OneRepublic | All The Right Moves | 2009 | Discogs + Spotify | 2009 | – | 2009 | US |
| OneRepublic | Counting Stars | 2013 | Discogs + Spotify | 2013 | – | 2013 | US |
| OneRepublic | I Ain't Worried | 2022 | Spotify + MusicBrainz | 2025 | 2022 | 2022 | US |
| OneRepublic | Run | 2021 | Discogs + Spotify | 2021 | – | 2021 | US |
| Opus | Live Is Life | 1984 | Discogs | 1984 | – | 2019 | AT |
| Orchestral Manoeuvres In The Dark | Enola Gay | 1980 | Discogs + Spotify | 1980 | – | 1980 | GB |
| Orchestral Manoeuvres In The Dark | Joan Of Arc (Maid Of Orleans) | 1981 | Discogs | 1981 | – | 2020 | GB |
| Organek | Czarna Madonna | 2016 | Discogs + Spotify | 2016 | – | 2016 | PL |
| Organek | Fotograf Brok | 2021 | Discogs + Spotify | 2021 | – | 2021 | PL |
| Organek | Głupi ja | 2014 | Discogs + Spotify | 2014 | – | 2014 | PL |
| Organek | Mississippi w Ogniu | 2016 | Discogs + Spotify | 2016 | – | 2016 | PL |
| Organek | Niemiłość | 2019 | Spotify (MusicBrainz: 2024) | – | 2024 | 2019 | PL |
| Organek | Walcz | 2021 | Discogs + Spotify | 2021 | – | 2021 | PL |
| Organek | Wiosna | 2016 | Discogs + Spotify | 2016 | – | 2016 | PL |
| Otis Redding | (Sittin' On) the Dock of the Bay | 1968 | Discogs + Spotify | 1968 | – | 1968 | US |
| Otis Redding | Try a Little Tenderness | 1966 | Discogs | 1966 | – | 2020 | US |
| Ottawan | D.I.S.C.O | 1980 | MusicBrainz (Spotify: 2011) | – | 1980 | 2011 | FR |
| Ottawan | Hands Up | 1981 | Discogs | 1981 | – | 2011 | FR |
| OutKast | Hey Ya! | 2003 | Discogs + MusicBrainz+Wikipedia + Spotify | 2003 | 2003 | 2003 | US |
| Outkast | Ms. Jackson | 2000 | Discogs + Spotify | 2000 | – | 2000 | US |
| Outkast | Roses | 2003 | Discogs + Spotify | 2003 | – | 2003 | US |
| Outkast | So Fresh, So Clean | 2000 | Discogs + Spotify | 2000 | – | 2000 | US |
| Ozzy Osbourne | Bark at the Moon | 1983 | Discogs + Spotify | 1983 | – | 1983 | GB |
| Ozzy Osbourne | Crazy Train | 1980 | Discogs | 1980 | – | 2020 | GB |
| Ozzy Osbourne | Dreamer | 2001 | Discogs + Spotify | 2001 | – | 2001 | GB |
| Ozzy Osbourne | Mama, I'm Coming Home | 1991 | Discogs + Spotify | 1991 | – | 1991 | GB |
| Ozzy Osbourne | Mr. Crowley | 1980 | Discogs | 1980 | – | 2020 | GB |
| Ozzy Osbourne | No More Tears | 1991 | Discogs + Spotify | 1991 | – | 1991 | GB |
| P!nk | Get the Party Started | 2001 | Spotify + MusicBrainz | – | 2001 | 2001 | US |
| P!nk | Please Don't Leave Me | 2008 | Spotify + MusicBrainz | – | 2008 | 2008 | US |
| P!nk | Sober | 2008 | MusicBrainz (Spotify: 2010) | – | 2008 | 2010 | US |
| P!nk | Try | 2012 | Spotify + MusicBrainz | – | 2012 | 2012 | US |
| P!nk | What About Us | 2017 | Spotify + MusicBrainz | – | 2017 | 2017 | US |
| P!nk & Nate Ruess | Just Give Me a Reason | 2012 | Spotify + MusicBrainz | – | 2012 | 2012 | US |
| P.O.D. | Youth of the Nation | 2001 | Discogs | 2001 | – | 2002 | US |
| Pablopavo i Ludziki | Dancingowa Piosenka Miłosna | 2014 | Spotify + MusicBrainz | – | 2014 | 2014 | ? |
| Pablopavo i Ludziki | Do Stu | 2009 | Spotify (MusicBrainz: 2021) | – | 2021 | 2009 | ? |
| Pablopavo i Ludziki | Karwoski | 2018 | Spotify + MusicBrainz | – | 2018 | 2018 | ? |
| Pablopavo i Ludziki | Ostatni Dzień Sierpnia | 2017 | Spotify (MusicBrainz: 2021) | – | 2021 | 2017 | ? |
| Paktofonika | Chwile Ulotne | 2000 | Discogs + Spotify | 2000 | – | 2000 | PL |
| Paktofonika | Jestem Bogiem | 2000 | Discogs + MusicBrainz+Wikipedia + Spotify | 2000 | 2000 | 2000 | PL |
| Pantera | Walk | 1992 | Discogs + Spotify | 1992 | – | 1992 | US |
| Paolo Nutini | Iron Sky | 2014 | Discogs + Spotify | 2014 | – | 2014 | GB |
| Papa Dance | Naj Story | 1987 | Discogs | 1987 | – | 2008 | PL |
| Papa Dance | Nasz disneyland | 1989 | Discogs | 1989 | – | 2003 | PL |
| Papa Dance | O-la-la | 1987 | Discogs | 1987 | – | 2008 | PL |
| Papa Roach | Last Resort | 1999 | Discogs | 1999 | – | 2000 | US |
| Passenger | Let Her Go | 2012 | Discogs + Spotify | 2012 | – | 2012 | GB |
| Pat Boone | Speedy Gonzales | 1962 | Discogs | 1962 | – | 1993 | US |
| Pat Metheny & Anna Maria Jopek | Tam, Gdzie Nie Siega Wzrok (Follow Me) | 2002 | Spotify + MusicBrainz | – | 2002 | 2002 | US |
| Pat Metheny & Anna Maria Jopek | Upojenie (Ecstasy) | 2002 | Spotify + MusicBrainz | – | 2002 | 2002 | US |
| Pati Yang | All That Is Thirst | 2005 | Spotify + MusicBrainz | – | 2005 | 2005 | PL |
| Patrick Fiori & Garou | Belle | 1998 | Discogs + Spotify | 1998 | – | 1998 | FR |
| Patrick Hernandez | Born to Be Alive | 1978 | Spotify (MusicBrainz: 1988) | 1979 | 1988 | 1978 | FR |
| Patrick Swayze & Wendy Fraser | She's Like the Wind | 1987 | Spotify + MusicBrainz | – | 1987 | 1987 | US |
| Patrycja Markowska | Jeszcze raz | 2003 | Discogs | 2003 | – | 2007 | PL |
| Patrycja Markowska | Kilka prostych prawd | 2007 | Discogs + Spotify | 2007 | – | 2007 | PL |
| Patrycja Markowska | Księżycowy | 2010 | Discogs + Spotify | 2010 | – | 2010 | PL |
| Patrycja Markowska | Ostatni | 2010 | Discogs + Spotify | 2010 | – | 2010 | PL |
| Patrycja Markowska | Zaćmienie serca | 2007 | Discogs + Spotify | 2007 | – | 2007 | PL |
| Patrycja Markowska | Świat się pomylił | 2007 | Discogs + Spotify | 2007 | – | 2007 | PL |
| Patryk Pietrzak | Maryś | 2021 | Spotify + MusicBrainz | – | 2021 | 2021 | PL |
| Patsy Cline | Crazy | 1961 | Discogs | 1961 | – | 2019 | US |
| Patti Smith | Because the Night | 1978 | Discogs + Spotify | 1978 | – | 1978 | US |
| Patti Smith | Gloria | 1975 | Discogs | 1975 | – | 2001 | US |
| Patty | (Zabiłeś tę miłość) Nie ma nas | 2013 | Spotify + MusicBrainz | – | 2013 | 2013 | ? |
| Patty Ryan | You're My Love (My Life) | 1998 | MusicBrainz (Spotify: 2006) | – | 1998 | 2006 | DE |
| Paul Anka | Diana | 1957 | Discogs | 1957 | – | 1966 | CA |
| Paul Anka | Put Your Head On My Shoulder | 1959 | Discogs | 1959 | – | 2000 | CA |
| Paul Anka & Odia Coates | (You're) Having My Baby | 1974 | Spotify + MusicBrainz | 1995 | 1974 | 1974 | CA |
| Paul McCartney & Linda McCartney | Monkberry Moon Delight | 1971 | Discogs + Spotify | 1971 | – | 1971 | GB |
| Paul McCartney & Linda McCartney | Uncle Albert / Admiral Halsey | 1971 | Discogs + Spotify | 1971 | – | 1971 | GB |
| Paul McCartney & Michael Jackson | Say Say Say | 1983 | Discogs + Spotify | 1983 | – | 1983 | GB |
| Paul McCartney & Stevie Wonder | Ebony And Ivory | 1982 | Discogs | 1982 | – | 1987 | GB |
| Paul McCartney & Wings | Band On The Run | 1981 | Discogs | 1981 | – | 1987 | GB |
| Paul McCartney & Wings | Live And Let Die - Main Title | 1987 | Spotify | – | – | 1987 | GB |
| Paul Russell | Lil Boo Thang | 2023 | Spotify + MusicBrainz | – | 2023 | 2023 | US |
| Paul Simon | 50 Ways to Leave Your Lover | 1975 | Discogs + Spotify | 1975 | – | 1975 | US |
| Paul Simon | Graceland | 1986 | Discogs + Spotify | 1986 | – | 1986 | US |
| Paul Simon | Me and Julio Down by the Schoolyard | 1972 | Discogs + Spotify | 1972 | – | 1972 | US |
| Paul Simon | You Can Call Me Al | 1986 | Discogs + Spotify | 1986 | – | 1986 | US |
| Paul Young | Soldier's Things | 1985 | Spotify + MusicBrainz | – | 1985 | 1985 | GB |
| Paula Abdul | Rush Rush | 1991 | Discogs + Spotify | 1991 | – | 1991 | US |
| Paula Abdul | Straight Up | 1988 | Discogs + Spotify | 1988 | – | 1988 | US |
| Paulla | Od Dzis | 2008 | Spotify + MusicBrainz | – | 2008 | 2008 | PL |
| Pawbeats & Roxie | Każdej nocy | 2023 | Spotify + MusicBrainz | 2024 | 2023 | 2023 | PL |
| Pawbeats & Roxie | Przyjdź po mnie | 2021 | Discogs + Spotify | 2021 | – | 2021 | PL |
| Paweł Domagała | Weź nie pytaj | 2018 | Discogs + Spotify | 2018 | – | 2018 | PL |
| Paweł Orkisz | Pomarańcze i mandarynki | 2011 | Spotify | – | – | 2011 | PL |
| Peaches & Herb | Shake Your Groove Thing | 1978 | Discogs + Spotify | 1978 | – | 1978 | US |
| Pearl Jam | Alive | 1991 | Discogs + Spotify | 1991 | – | 1991 | US |
| Pearl Jam | Black | 1991 | Discogs + Spotify | 1991 | – | 1991 | US |
| Pearl Jam | Crazy Mary | 2001 | Discogs + MusicBrainz | 2001 | 2001 | 1993 | US |
| Pearl Jam | Even Flow | 1991 | Discogs + Spotify | 1991 | – | 1991 | US |
| Pearl Jam | Jeremy | 1991 | Discogs + Spotify | 1991 | – | 1991 | US |
| Pearl Jam | Just Breathe | 2009 | Discogs + Spotify | 2009 | – | 2009 | US |
| Pectus | Jeden Moment | 2010 | MusicBrainz (Spotify: 2012) | – | 2010 | 2012 | PL |
| Peggy Gou | (It Goes Like) Nanana | 2023 | Discogs + Spotify | 2023 | – | 2023 | DE |
| Peggy Lee | Fever | 1958 | Discogs + Spotify | 1958 | – | 1958 | US |
| Percy Sledge | When a Man Loves a Woman | 1966 | Discogs + Spotify | 1966 | – | 1966 | US |
| Perfect | Ale Wkoło Jest Wesoło | 1981 | Discogs + Spotify | 1981 | – | 1981 | PL |
| Perfect | Autobiografia | 1982 | Discogs + MusicBrainz+Wikipedia | 1982 | 1982 | 2003 | PL |
| Perfect | Całkiem inny kraj | 1994 | Discogs | 1994 | – | 2005 | PL |
| Perfect | Chcemy Być Sobą | 1981 | Discogs + Spotify | 1981 | – | 1981 | PL |
| Perfect | Idź precz! | 1982 | Discogs | 1982 | – | 2003 | PL |
| Perfect | Kołysanka dla nieznajomej | 1994 | Discogs | 1994 | – | 2005 | PL |
| Perfect | Lokomotywa Z Ogłoszenia | 1981 | Discogs | 1981 | – | 2013 | PL |
| Perfect | Nie płacz Ewka | 1981 | Discogs + MusicBrainz+Wikipedia + Spotify | 1981 | 1981 | 1981 | PL |
| Perfect | Niepokonani | 1997 | Discogs | 1997 | – | 2014 | PL |
| Perfect | Niewiele Ci Mogę Dać | 1981 | Discogs + Spotify | 1981 | – | 1981 | PL |
| Perfect | Objazdowe nieme kino | 1982 | Discogs | 1982 | – | 2003 | PL |
| Perfect | Obracam W Palcach Złoty Pieniądz | 1981 | Discogs | 1981 | – | 2013 | PL |
| Perfect | Pepe Wróć | 1989 | Discogs | 1989 | – | 2013 | PL |
| Perfect | Raz po raz (Straszą nas) | 2010 | Spotify + MusicBrainz | – | 2010 | 2010 | PL |
| Perfect | Wszystko Ma Swój Czas | 2014 | Discogs + Spotify | 2014 | – | 2014 | PL |
| Perfect | Wyspa, drzewo, zamek | 1982 | Discogs | 1982 | – | 2003 | PL |
| Pet Shop Boys | Always on My Mind | 1987 | Discogs | 1987 | – | 1998 | GB |
| Pet Shop Boys | Go West | 1993 | Discogs | 1993 | – | 2003 | GB |
| Pet Shop Boys | It's a Sin | 1987 | Discogs + Spotify | 1987 | – | 1987 | GB |
| Pet Shop Boys | Suburbia | 1986 | Discogs | 1986 | – | 1998 | GB |
| Pet Shop Boys | West End Girls | 1984 | Discogs | 1984 | – | 1986 | GB |
| Peter Bjorn and John | Young Folks | 2006 | Discogs + Spotify | 2006 | – | 2006 | SE |
| Peter Cetera | Glory of Love | 1986 | Discogs + Spotify | 1986 | – | 1986 | US |
| Peter Frampton | Changing All The Time | 1994 | Discogs + Spotify | 1994 | – | 1994 | GB |
| Peter Frampton | Show Me The Way | 1975 | Discogs + Spotify | 1975 | – | 1975 | GB |
| Peter Gabriel | Biko | 1980 | Discogs + Spotify | 1980 | – | 1980 | GB |
| Peter Gabriel | Don't Give Up | 1986 | Spotify (MusicBrainz: 1994) | – | 1994 | 1986 | GB |
| Peter Gabriel | Games Without Frontiers | 1980 | Discogs + Spotify | 1980 | – | 1980 | GB |
| Peter Gabriel | Mercy Street | 1986 | Discogs + Spotify | 1986 | – | 1986 | GB |
| Peter Gabriel | Red Rain | 1986 | Discogs + Spotify | 1986 | – | 1986 | GB |
| Peter Gabriel | Sledgehammer | 1986 | Discogs + Spotify | 1986 | – | 1986 | GB |
| Peter Gabriel | Solsbury Hill | 1977 | Discogs + Spotify | 1977 | – | 1977 | GB |
| Peter Murphy | Cuts You Up | 1989 | Discogs + Spotify | 1989 | – | 1989 | GB |
| Peter Schilling | Terra Titanic | 1984 | Discogs | 1984 | – | 1999 | DE |
| Petula Clark | Downtown | 1964 | Discogs | 1964 | – | 2003 | GB |
| Pezet & Auer | Dom Nad Wodą | 2022 | Spotify | – | – | 2022 | PL |
| Pharrell Williams | Happy | 2013 | Discogs + MusicBrainz+Wikipedia | 2013 | 2013 | 2014 | US |
| Phil Collins | A Groovy Kind of Love | 1988 | Discogs | 1988 | – | 2004 | GB |
| Phil Collins | Against All Odds (Take a Look at Me Now) | 1984 | Discogs | 1984 | – | 2016 | GB |
| Phil Collins | Another Day in Paradise | 1989 | Discogs + Spotify | 1989 | – | 1989 | GB |
| Phil Collins | I Wish It Would Rain Down | 1989 | Discogs + Spotify | 1989 | – | 1989 | GB |
| Phil Collins | In the Air Tonight | 1981 | Discogs + Spotify | 1981 | – | 1981 | GB |
| Phil Collins | Sussudio | 1985 | Discogs + Spotify | 1985 | – | 1985 | GB |
| Phil Collins | We Fly so Close | 1993 | Discogs + Spotify | 1993 | – | 1993 | GB |
| Philip Bailey & Phil Collins | Easy Lover | 1984 | Discogs | 1984 | – | 1985 | US |
| Phoenix | 1901 | 2009 | Discogs + Spotify | 2009 | – | 2009 | FR |
| Pidżama Porno | Ezoteryczny Poznań | 1997 | Discogs | 1997 | – | 2007 | PL |
| Pidżama Porno | Nikt tak pięknie nie mówił, że się boi miłości | 2004 | Discogs | 2004 | – | 2016 | PL |
| Pidżama Porno | Twoja generacja | 2016 | Discogs + Spotify | 2016 | – | 2016 | PL |
| Pin | Niekochanie | 2008 | Spotify + MusicBrainz | – | 2008 | 2008 | PL |
| Pink Floyd | Another Brick in the Wall, Part 2 | 1979 | Discogs + MusicBrainz+Wikipedia | 1979 | 1979 | – | GB |
| Pink Floyd | Another Brick in the Wall, Pt. 2 | 1979 | Spotify (MusicBrainz: 2017) | 1988 | 2017 | 1979 | GB |
| Pink Floyd | Comfortably Numb | 1979 | Discogs + Spotify | 1979 | – | 1979 | GB |
| Pink Floyd | Echoes | 1971 | Discogs + Spotify | 1971 | – | 1971 | GB |
| Pink Floyd | Hey You | 1979 | Discogs + Spotify | 1979 | – | 1979 | GB |
| Pink Floyd | High Hopes | 1994 | Discogs + Spotify | 1994 | – | 1994 | GB |
| Pink Floyd | Learning To Fly | 1987 | Discogs + Spotify | 1987 | – | 1987 | GB |
| Pink Floyd | Money | 1973 | Discogs + Spotify | 1973 | – | 1973 | GB |
| Pink Floyd | Shine On You Crazy Diamond, Pts. 1-5 | 1975 | Spotify (MusicBrainz: 2025) | 1997 | 2025 | 1975 | GB |
| Pink Floyd | Sorrow | 1987 | Discogs + Spotify | 1987 | – | 1987 | GB |
| Pink Floyd | Time | 1973 | Spotify (MusicBrainz: 1988) | – | 1988 | 1973 | GB |
| Pink Floyd | Wish You Were Here | 1975 | Discogs | 1975 | – | 1981 | GB |
| PinkPantheress & Ice Spice | Boy's a liar Pt. 2 | 2023 | Spotify + MusicBrainz | – | 2023 | 2023 | GB |
| PinkPantheress & Zara Larsson | Stateside + Zara Larsson | 2025 | Spotify | – | – | 2025 | GB |
| Piotr Bukartyk | Kobiety Jak Te Kwiaty | 2010 | Discogs | 2010 | – | 2013 | PL |
| Piotr Bukartyk | Kup sobie psa | 2014 | Discogs + Spotify | 2014 | – | 2014 | PL |
| Piotr Bukartyk | Niestety Trzeba Mieć Ambicję | 2010 | Discogs | 2010 | – | 2013 | PL |
| Piotr Bukartyk & Sekcja | Małgocha | 2004 | Discogs + Spotify | 2004 | – | 2004 | PL |
| Piotr Rogucki | Piosenka pisana nocą | 2012 | Spotify + MusicBrainz | – | 2012 | 2012 | PL |
| Piotr Szczepanik | Kochać | 1966 | Discogs | 1966 | – | 1967 | PL |
| Piotr Szczepanik | Nigdy więcej | 1965 | Discogs | 1965 | – | 1967 | PL |
| Piotr Szczepanik | Puste koperty | 1965 | Discogs | 1965 | – | 1967 | PL |
| Piotr Szczepanik | Żółte kalendarze | 1966 | Discogs | 1966 | – | 1967 | PL |
| Piotr Szczepanik & Alibabki | Goniąc kormorany | 1965 | Discogs | 1965 | – | 1967 | PL |
| Piotr Zioła | Safari | 2016 | Discogs + Spotify | 2016 | – | 2016 | PL |
| Pitbull & AFROJACK | Give Me Everything | 2011 | Discogs + Spotify | 2011 | – | 2011 | US |
| Pixies | Here Comes Your Man | 1989 | Discogs + Spotify | 1989 | – | 1989 | US |
| Pixies | Monkey Gone to Heaven | 1989 | Discogs + Spotify | 1989 | – | 1989 | US |
| Pixies | Where Is My Mind? | 1988 | Discogs | 1988 | – | 1997 | US |
| PJ Harvey | Down By The Water | 1995 | Discogs + Spotify | 1995 | – | 1995 | GB |
| PJ Harvey | The Glorious Land | 2011 | Discogs + Spotify | 2011 | – | 2011 | GB |
| Placebo | Every You Every Me | 1998 | Discogs + Spotify | 1998 | – | 1998 | GB |
| Placebo | Pure Morning | 1998 | Discogs + Spotify | 1998 | – | 1998 | GB |
| Placebo | Song to Say Goodbye | 2006 | Discogs + Spotify | 2006 | – | 2006 | GB |
| Placebo | The Bitter End | 2003 | Discogs + Spotify | 2003 | – | 2003 | GB |
| Placebo | Without You I'm Nothing | 1998 | Spotify + MusicBrainz | – | 1998 | 1998 | GB |
| Poison | Every Rose Has Its Thorn | 1988 | Discogs + Spotify | 1988 | – | 1988 | US |
| Poison | Fallen Angel | 1988 | Discogs + Spotify | 1988 | – | 1988 | US |
| Poison | Nothin' But A Good Time | 1988 | Discogs + Spotify | 1988 | – | 1988 | US |
| Poison | Talk Dirty To Me | 1986 | Discogs | 1986 | – | 2011 | US |
| Poison | Unskinny Bop | 1990 | Discogs + Spotify | 1990 | – | 1990 | US |
| Porcupine Tree | Anesthetize | 2007 | Discogs + Spotify | 2007 | – | 2007 | GB |
| Porcupine Tree | Lazarus | 2005 | Discogs + Spotify | 2005 | – | 2005 | GB |
| Porcupine Tree | Trains | 2002 | Discogs + Spotify | 2002 | – | 2002 | GB |
| Porno for Pyros | Pets | 1993 | Discogs + Spotify | 1993 | – | 1993 | US |
| Portishead | Glory Box | 1994 | Discogs + Spotify | 1994 | – | 1994 | GB |
| Portugal. The Man | Feel It Still | 2017 | Discogs + Spotify | 2017 | – | 2017 | US |
| Post Malone & Morgan Wallen | I Had Some Help | 2024 | Discogs + Spotify | 2024 | – | 2024 | US |
| Post Malone & Swae Lee | Sunflower - Spider-Man: Into the Spider-Verse | 2018 | Discogs | 2018 | – | 2019 | US |
| Powfu & beabadoobee | death bed (coffee for your head) | 2020 | Discogs + Spotify | 2020 | – | 2020 | CA |
| Pretenders | Don't Get Me Wrong | 1986 | Spotify + MusicBrainz | 2003 | 1986 | 1986 | GB |
| Pretenders | I'll Stand by You | 1994 | Spotify + MusicBrainz | – | 1994 | 1994 | GB |
| Pretenders | Middle of the Road | 1984 | Discogs | 1984 | – | 1987 | GB |
| Primal Scream | Loaded | 1990 | Discogs | 1990 | – | 2011 | GB |
| Primal Scream | Movin' on Up | 1991 | Discogs + Spotify | 1991 | – | 1991 | GB |
| Prince | 1999 | 1982 | Discogs + Spotify | 1982 | – | 1982 | US |
| Prince | Cream | 1991 | Discogs | 1991 | – | 2004 | US |
| Prince | I Wanna Be Your Lover | 1979 | Discogs + Spotify | 1979 | – | 1979 | US |
| Prince | Kiss | 1986 | Spotify + MusicBrainz | – | 1986 | 1986 | US |
| Prince | Little Red Corvette | 1982 | Discogs + Spotify | 1982 | – | 1982 | US |
| Prince | Purple Rain | 1984 | Discogs + MusicBrainz+Wikipedia + Spotify | 1984 | 1984 | 1984 | US |
| Prince | When Doves Cry | 1984 | Discogs + Spotify | 1984 | – | 1984 | US |
| PRO8L3M | W domach z betonu | 2020 | Discogs + Spotify | 2020 | – | 2020 | PL |
| Procol Harum | A Whiter Shade of Pale | 1967 | Discogs | 1967 | – | 2019 | GB |
| Procol Harum | Conquistador | 1967 | Discogs + Spotify | 1967 | – | 1967 | GB |
| Procol Harum | Grand Hotel | 1973 | Discogs + Spotify | 1973 | – | 1973 | GB |
| Proletaryat | Pokój Z Kulą W Głowie | 1991 | Discogs | 1991 | – | 1997 | PL |
| Propaganda | Dr. Mabuse | 1984 | Discogs + Spotify | 1984 | – | 1984 | DE |
| Propaganda | Heaven Give Me Words | 1990 | Discogs + Spotify | 1990 | – | 1990 | DE |
| PSY | Gangnam Style | 2012 | Discogs + MusicBrainz+Wikipedia | 2012 | 2012 | – | KR |
| Public Enemy | Fight The Power | 1989 | Discogs | 1989 | – | 1990 | US |
| Public Enemy & Stephen Stills | He Got Game | 1998 | Discogs + Spotify | 1998 | – | 1998 | US |
| Pudelsi | Uważaj na niego | 2003 | Discogs + Spotify | 2003 | – | 2003 | PL |
| Pulp | Common People | 1995 | Discogs + Spotify | 1995 | – | 1995 | GB |
| Pulp | Disco 2000 | 1995 | Discogs + Spotify | 1995 | – | 1995 | GB |
| Pustki | Lugola | 2011 | Spotify (MusicBrainz: 2015) | – | 2015 | 2011 | PL |
| Pustki | O krok | 2015 | Spotify + MusicBrainz | – | 2015 | 2015 | PL |
| Pustki | Tchu mi brak | 2006 | Discogs | 2006 | – | 2015 | PL |
| Qncicka | nie wierzę w bajki | 2026 | Spotify | – | – | 2026 | ? |
| Quebonafide & Duit | BUBBLETEA | 2020 | Discogs + Spotify | 2020 | – | 2020 | PL |
| Quebonafide & Klaudia Szafrańska | Candy | 2017 | Spotify + MusicBrainz | – | 2017 | 2017 | PL |
| Queen | A Kind of Magic | 1986 | Discogs + Spotify | 1986 | – | 1986 | GB |
| Queen | Another One Bites The Dust | 1980 | Discogs + Spotify | 1980 | – | 1980 | GB |
| Queen | Bicycle Race | 1978 | Discogs | 1978 | – | 1981 | GB |
| Queen | Bohemian Rhapsody | 1975 | Discogs + MusicBrainz+Wikipedia + Spotify | 1975 | 1975 | 1975 | GB |
| Queen | Crazy Little Thing Called Love | 1979 | Discogs | 1979 | – | 1980 | GB |
| Queen | Don't Stop Me Now | 1978 | Spotify + MusicBrainz | 2008 | 1978 | 1978 | GB |
| Queen | I Want It All | 1989 | Spotify + MusicBrainz | – | 1989 | 1989 | GB |
| Queen | I Want To Break Free | 1984 | Discogs | 1984 | – | 2018 | GB |
| Queen | Innuendo | 1991 | Discogs + Spotify | 1991 | – | 1991 | GB |
| Queen | Killer Queen | 1974 | Discogs + Spotify | 1974 | – | 1974 | GB |
| Queen | Las Palabras De Amor (The Words Of Love) | 1982 | Discogs | 1982 | – | 1999 | GB |
| Queen | Love Of My Life | 1975 | Discogs + Spotify | 1975 | – | 1975 | GB |
| Queen | Radio Ga Ga | 1984 | Discogs + Spotify | 1984 | – | 1984 | GB |
| Queen | Somebody To Love | 1976 | Discogs + Spotify | 1976 | – | 1976 | GB |
| Queen | The Show Must Go On | 1991 | Discogs | 1991 | – | 2018 | GB |
| Queen | These Are The Days Of Our Lives | 1991 | Discogs | 1991 | – | 1999 | GB |
| Queen | We Are The Champions | 1977 | Discogs + Spotify | 1977 | – | 1977 | GB |
| Queen | We Will Rock You | 1977 | Discogs | 1977 | – | 2006 | GB |
| Queen | Who Wants to Live Forever | 1986 | Discogs + Spotify | 1986 | – | 1986 | GB |
| Queen & David Bowie | Under Pressure | 1981 | Discogs | 1981 | – | 1982 | GB |
| Queens of the Stone Age | No One Knows | 2002 | Discogs + Spotify | 2002 | – | 2002 | US |
| Queensrÿche | I Don't Believe In Love | 1988 | Spotify + MusicBrainz | – | 1988 | 1988 | US |
| Queensrÿche | Jet City Woman | 1990 | Discogs + Spotify | 1990 | – | 1990 | US |
| Queensrÿche | Silent Lucidity | 1990 | Discogs + Spotify | 1990 | – | 1990 | US |
| Quiet Riot | Cum on Feel the Noize | 1983 | Discogs | 1983 | – | 1996 | US |
| Quiet Riot | Metal Health (Bang Your Head) | 1983 | Discogs + Spotify | 1983 | – | 1983 | US |
| Quincy Jones & Charles May | Ai No Corrida | 1981 | Discogs + Spotify | 1981 | – | 1981 | US |
| R.E.M. | Drive | 1992 | Discogs + Spotify | 1992 | – | 1992 | US |
| R.E.M. | Everybody Hurts | 1992 | Discogs + Spotify | 1992 | – | 1992 | US |
| R.E.M. | Imitation Of Life | 2001 | Discogs | 2001 | – | 2011 | US |
| R.E.M. | It's The End Of The World As We Know It (And I Feel Fine) | 1987 | Discogs + Spotify | 1987 | – | 1987 | US |
| R.E.M. | Leave | 1996 | Discogs + Spotify | 1996 | – | 1996 | US |
| R.E.M. | Losing My Religion | 1991 | Discogs + MusicBrainz+Wikipedia + Spotify | 1991 | 1991 | 1991 | US |
| R.E.M. | Man On The Moon | 1992 | Discogs + Spotify | 1992 | – | 1992 | US |
| R.E.M. | Shiny Happy People | 1991 | Discogs + Spotify | 1991 | – | 1991 | US |
| R.E.M. | The One I Love | 1987 | Discogs + Spotify | 1987 | – | 1987 | US |
| Radiohead | Creep | 1992 | Discogs | 1992 | – | 1993 | GB |
| Radiohead | High and Dry | 1995 | Discogs + Spotify | 1995 | – | 1995 | GB |
| Radiohead | Karma Police | 1997 | Discogs + Spotify | 1997 | – | 1997 | GB |
| Radiohead | No Surprises | 1997 | Discogs + Spotify | 1997 | – | 1997 | GB |
| Radiohead | Paranoid Android | 1997 | Discogs + Spotify | 1997 | – | 1997 | GB |
| Rafał Brzozowski | Tak Blisko | 2012 | Discogs + Spotify | 2012 | – | 2012 | PL |
| Rag'n'Bone Man | Human | 2015 | Discogs | 2015 | – | 2017 | GB |
| Rage Against The Machine | Killing In The Name | 1991 | Discogs | 1991 | – | 1992 | US |
| Rainbow | Catch The Rainbow | 1975 | Discogs + Spotify | 1975 | – | 1975 | GB |
| Rainbow | Since You Been Gone | 1979 | Discogs + Spotify | 1979 | – | 1979 | GB |
| Rainbow | Stargazer | 1976 | Discogs + Spotify | 1976 | – | 1976 | GB |
| Rainbow | Street Of Dreams | 1983 | Discogs + Spotify | 1983 | – | 1983 | GB |
| Ralph Kaminski | 2009 | 2019 | Discogs + Spotify | 2019 | – | 2019 | PL |
| Ralph Kaminski | Autobusy | 2019 | Discogs + Spotify | 2019 | – | 2019 | PL |
| Ralph Kaminski | Kosmiczne Energie | 2019 | Discogs + Spotify | 2019 | – | 2019 | PL |
| Ralph Kaminski | Pięć Minut Łez | 2021 | Spotify | – | – | 2021 | PL |
| Ralph Kaminski | Tata | 2019 | Discogs + Spotify | 2019 | – | 2019 | PL |
| Ram Jam | Black Betty | 1977 | Discogs + Spotify | 1977 | – | 1977 | US |
| Rammstein | Amerika | 2004 | Discogs + Spotify | 2004 | – | 2004 | DE |
| Rammstein | Du hast | 1997 | Discogs + Spotify | 1997 | – | 1997 | DE |
| Rammstein | Mutter | 2001 | Discogs + Spotify | 2001 | – | 2001 | DE |
| Rammstein | Radio | 2019 | Spotify + MusicBrainz | – | 2019 | 2019 | DE |
| Rammstein | Sonne | 2001 | Discogs + Spotify | 2001 | – | 2001 | DE |
| Rammstein | Zeit | 2022 | Discogs + Spotify | 2022 | – | 2022 | DE |
| Ramones | Blitzkrieg Bop | 1976 | Discogs + Spotify | 1976 | – | 1976 | US |
| Ramones | Sheena Is a Punk Rocker | 1977 | Discogs + Spotify | 1977 | – | 1977 | US |
| Randy Crawford | Almaz | 1986 | Discogs + Spotify | 1986 | – | 1986 | US |
| Randy Crawford | One Day I'll Fly Away | 1980 | Spotify + MusicBrainz | – | 1980 | 1980 | US |
| Rare Bird | Sympathy | 1969 | Discogs | 1969 | – | 1970 | GB |
| Rare Earth | I Just Want To Celebrate | 1971 | Discogs + Spotify | 1971 | – | 1971 | US |
| Rasmentalism | Krajobrazy | 2020 | Discogs + Spotify | 2020 | – | 2020 | PL |
| Raspberries | Go All The Way | 1972 | Discogs + Spotify | 1972 | – | 1972 | US |
| Ratt | Lay It Down | 1985 | Discogs + MusicBrainz | 1985 | 1985 | 1984 | US |
| Ratt | Round and Round | 1984 | Discogs + Spotify | 1984 | – | 1984 | US |
| Ratt | You're in Love | 1984 | Spotify (MusicBrainz: 1985) | – | 1985 | 1984 | US |
| Ravyn Lenae | Love Me Not | 2024 | Discogs + Spotify | 2024 | – | 2024 | US |
| Ray Charles | Georgia on My Mind | 1960 | Discogs | 1960 | – | 2011 | US |
| Ray Charles | Hit the Road Jack | 1961 | Discogs + MusicBrainz+Wikipedia | 1961 | 1961 | 2021 | US |
| Ray Charles | I Can't Stop Loving You | 1962 | Spotify (MusicBrainz: 1971) | 1991 | 1971 | 1962 | US |
| Ray Wilson | Song for a Friend | 2016 | Discogs + Spotify | 2016 | – | 2016 | GB |
| Ray Wilson & Stiltskin | Inside | 1994 | Discogs – singiel Stiltskin „Inside” (1994); Ray Wilson był wokalistą Stiltskin | 2004 | – | 2011 | GB |
| RAYE | WHERE IS MY HUSBAND! | 2025 | Spotify + MusicBrainz | – | 2025 | 2025 | GB |
| RAYE & 070 Shake | Escapism. | 2023 | Discogs + Spotify | 2023 | – | 2023 | GB |
| Raz Dwa Trzy | Czarna Inez | 1998 | Discogs | 1998 | – | 2000 | PL |
| Raz Dwa Trzy | Jutro Możemy Być Szczęśliwi | 2003 | Discogs | 2003 | – | 2008 | PL |
| Raz Dwa Trzy | Juz | 2010 | Spotify + MusicBrainz | – | 2010 | 2010 | PL |
| Raz Dwa Trzy | Nikt nikogo (I tak warto żyć) | 1994 | Discogs + Spotify | 1994 | – | 1994 | PL |
| Raz Dwa Trzy | Oczy Tej Małej | 2002 | Discogs | 2002 | – | 2008 | PL |
| Raz Dwa Trzy | Pod niebem | 1994 | Discogs + Spotify | 1994 | – | 1994 | PL |
| Raz Dwa Trzy | Trudno Nie Wierzyć W Nic | 2002 | Discogs | 2002 | – | 2008 | PL |
| Raz Dwa Trzy | Uciekaj moje serce | 2002 | Discogs | 2002 | – | 2008 | PL |
| Raz Dwa Trzy | W wielkim mieście | 1994 | Discogs + Spotify | 1994 | – | 1994 | PL |
| Razorlight | Golden Touch | 2003 | Discogs | 2003 | – | 2018 | GB |
| Rea Garvey | Wild Love | 2012 | Discogs + Spotify | 2012 | – | 2012 | DE |
| Reamonn | Supergirl | 2000 | Discogs + Spotify | 2000 | – | 2000 | DE |
| Red Box | Chenko (Tenka-Io) | 1986 | Discogs + Spotify | 1986 | – | 1986 | GB |
| Red Box | For America | 1986 | Discogs + Spotify | 1986 | – | 1986 | GB |
| Red Box | The Sign | 2010 | Discogs + Spotify | 2010 | – | 2010 | GB |
| Red Hot Chili Peppers | By the Way | 2002 | Discogs + Spotify | 2002 | – | 2002 | US |
| Red Hot Chili Peppers | Californication | 1999 | Discogs + MusicBrainz+Wikipedia + Spotify | 1999 | 1999 | 1999 | US |
| Red Hot Chili Peppers | Can't Stop | 2002 | Spotify + MusicBrainz | – | 2002 | 2002 | US |
| Red Hot Chili Peppers | Dani California | 2006 | Discogs + Spotify | 2006 | – | 2006 | US |
| Red Hot Chili Peppers | Otherside | 1999 | Discogs + Spotify | 1999 | – | 1999 | US |
| Red Hot Chili Peppers | Scar Tissue | 1999 | Discogs + Spotify | 1999 | – | 1999 | US |
| Red Hot Chili Peppers | Snow (Hey Oh) | 2006 | Discogs + Spotify | 2006 | – | 2006 | US |
| Red Hot Chili Peppers | Under the Bridge | 1991 | Discogs + Spotify | 1991 | – | 1991 | US |
| Red Lips | To Co Nam było | 2013 | Discogs + Spotify | 2013 | – | 2013 | PL |
| Redbone | Come and Get Your Love | 1973 | Discogs + Spotify | 1973 | – | 1973 | US |
| Rema & Selena Gomez | Calm Down | 2022 | Discogs | 2022 | – | 2023 | NG |
| Rena Rolska | Jeszcze Poczekajmy | 2001 | Discogs | 2001 | – | 2015 | PL |
| Renata Przemyk | Babę Zesłał Bóg | 2003 | Discogs | 2003 | – | 2011 | PL |
| Renata Przemyk | Kochana | 2003 | Discogs | 2003 | – | 2013 | PL |
| Renata Przemyk | Odjazd | 2009 | Spotify + MusicBrainz | – | 2009 | 2009 | PL |
| Renata Przemyk | Ten taniec | 1994 | Discogs | 1994 | – | 2013 | PL |
| Rendez Vous | A Na Plaży Anna | 1986 | Discogs | 1986 | – | 2017 | FR |
| Reni Jusis | Kiedyś Cię znajdę | 2003 | Discogs + Spotify | 2003 | – | 2003 | PL |
| Reni Jusis | Zakręcona | 1998 | Discogs | 1998 | – | 2005 | PL |
| Republika | Arktyka | 1983 | Discogs | 1983 | – | 2001 | PL |
| Republika | Biała Flaga | 1991 | Discogs – najwcześniejsze wydanie płytowe (album „1991”); Wikipedia: nagranie radiowe 1982, MusicBrainz: demo 1981 | 1991 | – | 2014 | PL |
| Republika | Kombinat | 1991 | Discogs | 1991 | – | 2014 | PL |
| Republika | Mamona | 1998 | Discogs + Spotify | 1998 | – | 1998 | PL |
| Republika | Moja krew | 1991 | Discogs | 1991 | – | 2011 | PL |
| Republika | Nieustanne tango | 1984 | Discogs | 1984 | – | 2002 | PL |
| Republika | Obcy astronom | 1984 | Discogs | 1984 | – | 2002 | PL |
| Republika | Odchodząc | 1998 | Discogs + Spotify | 1998 | – | 1998 | PL |
| Republika | Poranna wiadomość | 1984 | Discogs | 1984 | – | 2002 | PL |
| Republika | Raz na milion lat | 1998 | Discogs + Spotify | 1998 | – | 1998 | PL |
| Republika | Sexy Doll | 1991 | Discogs | 1991 | – | 2014 | PL |
| Republika | Tak Długo Czekam (Ciało) | 1993 | Discogs | 1993 | – | 2014 | PL |
| Republika | Telefony | 1991 | Discogs | 1991 | – | 2014 | PL |
| Republika | Zapytaj mnie czy Cię kocham | 1995 | Discogs + Spotify | 1995 | – | 1995 | PL |
| Republika | Znak "=" | 1983 | Discogs | 1983 | – | 2001 | PL |
| Republika | Śmierć na pięć (New) | 2003 | Discogs | 2003 | – | 2014 | PL |
| Republika | Śmierć W Bikini | 1983 | Discogs | 1983 | – | 2001 | PL |
| Rezerwat | Zaopiekuj sie mną | 1987 | Discogs | 1987 | – | 2011 | PL |
| RH+ | Po Prostu Miłość | 2008 | Spotify (MusicBrainz: 2011) | – | 2011 | 2008 | CL |
| Richard Ashcroft | A Song For The Lovers | 2000 | Discogs + Spotify | 2000 | – | 2000 | GB |
| Richard Marx | Hazard | 1991 | Discogs + Spotify | 1991 | – | 1991 | US |
| Richard Marx | Right Here Waiting | 1989 | Discogs + Spotify | 1989 | – | 1989 | US |
| Rick Astley | Never Gonna Give You Up | 1987 | Discogs + MusicBrainz+Wikipedia + Spotify | 1987 | 1987 | 1987 | GB |
| Rick Astley | Together Forever | 1987 | Discogs + Spotify | 1987 | – | 1987 | GB |
| Ricky Martin | Livin' la Vida Loca | 1999 | Discogs + Spotify | 1999 | – | 1999 | PR |
| Ride | Vapour Trail | 1990 | Discogs + Spotify | 1990 | – | 1990 | GB |
| Righeira | Vamos a la Playa | 1983 | Discogs | 1983 | – | 2012 | IT |
| Rihanna | Diamonds | 2012 | Discogs + Spotify | 2012 | – | 2012 | US |
| Rihanna | Disturbia | 2008 | Discogs + Spotify | 2008 | – | 2008 | US |
| Rihanna | Don't Stop The Music | 2007 | MusicBrainz (Spotify: 2008) | – | 2007 | 2008 | US |
| Rihanna | Love On The Brain | 2016 | Discogs + Spotify | 2016 | – | 2016 | US |
| Rihanna | Only Girl (In The World) | 2009 | Discogs | 2009 | – | 2010 | US |
| Rihanna | Pon de Replay | 2005 | Discogs + Spotify | 2005 | – | 2005 | US |
| Rihanna | S&M | 2009 | Discogs | 2009 | – | 2010 | US |
| Rihanna | Shut Up And Drive | 2007 | Discogs | 2007 | – | 2008 | US |
| Rihanna | SOS | 2006 | Discogs + Spotify | 2006 | – | 2006 | US |
| Rihanna | Umbrella | 2007 | Discogs + MusicBrainz+Wikipedia | 2007 | 2007 | – | US |
| Rihanna | Where Have You Been | 2011 | Discogs + Spotify | 2011 | – | 2011 | US |
| Rihanna & Mikky Ekko | Stay | 2012 | Discogs + Spotify | 2012 | – | 2012 | US |
| Rita Ora | Anywhere | 2017 | Discogs + Spotify | 2017 | – | 2017 | GB |
| Ritchie Valens | La Bamba | 1958 | Discogs | 1958 | – | 1959 | US |
| Riverside | Conceiving You | 2005 | Discogs + Spotify | 2005 | – | 2005 | PL |
| Riverside | River Down Below | 2018 | Discogs + Spotify | 2018 | – | 2018 | PL |
| Riverside | The Depth of Self-Delusion | 2013 | Discogs + Spotify | 2013 | – | 2013 | PL |
| Robbie Williams | Angels | 1997 | Discogs + MusicBrainz+Wikipedia + Spotify | 1997 | 1997 | 1997 | GB |
| Robbie Williams | Feel | 2002 | Discogs + Spotify | 2002 | – | 2002 | GB |
| Robbie Williams | Supreme | 2000 | Discogs + Spotify | 2000 | – | 2000 | GB |
| Robbie Williams | The Road To Mandalay | 2000 | Discogs + Spotify | 2000 | – | 2000 | GB |
| Robbie Williams & Nicole Kidman | Somethin' Stupid | 2001 | Discogs + Spotify | 2001 | – | 2001 | GB |
| Robert Chojnacki | Niecierpliwi | 1995 | Discogs + Spotify | 1995 | – | 1995 | PL |
| Robert Gawlinski | Cherman | 1999 | Discogs + Spotify | 1999 | – | 1999 | PL |
| Robert Gawlinski | Nie pokonasz miłości | 2001 | Spotify + MusicBrainz | – | 2001 | 2001 | PL |
| Robert Gawlinski | Nie stało się nic | 1997 | Discogs + Spotify | 1997 | – | 1997 | PL |
| Robert Gawlinski | O Sobie Samym | 1995 | Discogs + Spotify | 1995 | – | 1995 | PL |
| Robert Gawlinski | Sid i Nancy | 1997 | Discogs + Spotify | 1997 | – | 1997 | PL |
| Robert Miles | Children | 1995 | Discogs | 1995 | – | 1996 | IT |
| Robert Palmer | Addicted To Love | 1985 | Discogs | 1985 | – | 2005 | GB |
| Robert Palmer | Know by Now | 1994 | Discogs + Spotify | 1994 | – | 1994 | GB |
| Robert Palmer | Mercy Mercy Me / I Want You (Medley) | 1990 | Spotify + MusicBrainz | 2002 | 1990 | 1990 | GB |
| Robert Plant | 29 Palms | 1993 | Discogs + Spotify | 1993 | – | 1993 | GB |
| Robert Plant | Big Log | 1983 | Discogs + Spotify | 1983 | – | 1983 | GB |
| Robert Plant | I Believe | 1993 | Discogs + Spotify | 1993 | – | 1993 | GB |
| Robert Plant | Moonlight in Samosa | 1982 | Discogs + Spotify | 1982 | – | 1982 | GB |
| Roberta Flack | Killing Me Softly With His Song | 1973 | Discogs + Spotify | 1973 | – | 1973 | US |
| Roberta Flack | The First Time Ever I Saw Your Face | 1969 | Discogs + Spotify | 1969 | – | 1969 | US |
| Robin Schulz & Francesco Yates | Sugar | 2015 | Discogs + Spotify | 2015 | – | 2015 | DE |
| Robin Thicke & T.I. | Blurred Lines | 2013 | Discogs + Spotify | 2013 | – | 2013 | US |
| Robyn | Dancing On My Own | 2010 | Discogs + Spotify | 2010 | – | 2010 | SE |
| Rockwell | Somebody's Watching Me | 1983 | MusicBrainz (Spotify: 2010) | – | 1983 | 2010 | US |
| Rod Stewart | Baby Jane | 1983 | Discogs + Spotify | 1983 | – | 1983 | GB |
| Rod Stewart | Da Ya Think I'm Sexy? | 1978 | Spotify + MusicBrainz | 1984 | 1978 | 1978 | GB |
| Rod Stewart | Maggie May | 1971 | Discogs + Spotify | 1971 | – | 1971 | GB |
| Rod Stewart | Sailing | 1975 | Discogs + Spotify | 1975 | – | 1975 | GB |
| Rodríguez | Sugar Man | 1970 | Discogs + Spotify | 1970 | – | 1970 | US |
| Roger Hodgson | Lovers In The Wind | 1984 | Discogs + Spotify | 1984 | – | 1984 | GB |
| Roger Waters | The Tide Is Turning | 1987 | Discogs + Spotify | 1987 | – | 1987 | GB |
| Rosa Linn | SNAP | 2022 | Discogs + Spotify | 2022 | – | 2022 | AM |
| ROSALÍA | DESPECHÁ | 2022 | Spotify + MusicBrainz | – | 2022 | 2022 | ES |
| ROSÉ & Bruno Mars | APT. | 2024 | Discogs + Spotify | 2024 | – | 2024 | KR |
| Roxette | Fading Like A Flower (Every Time You Leave) | 1991 | Discogs + Spotify | 1991 | – | 1991 | SE |
| Roxette | It Must Have Been Love | 1987 | Discogs | 1987 | – | 1990 | SE |
| Roxette | Joyride | 1991 | Discogs + Spotify | 1991 | – | 1991 | SE |
| Roxette | Listen To Your Heart | 1988 | Discogs + Spotify | 1988 | – | 1988 | SE |
| Roxette | Spending My Time | 1991 | Discogs + Spotify | 1991 | – | 1991 | SE |
| Roxette | The Look | 1988 | Discogs + MusicBrainz+Wikipedia + Spotify | 1988 | 1988 | 1988 | SE |
| Roxie | Jesień trwa (bez końca) | 2026 | Spotify | – | – | 2026 | PL |
| Roxie & White 2115 | Chciałam Ciebie więcej | 2026 | Spotify | – | – | 2026 | PL |
| Roxy Music | Avalon | 1982 | Discogs + Spotify | 1982 | – | 1982 | GB |
| Roxy Music | Love Is The Drug | 1975 | Discogs + Spotify | 1975 | – | 1975 | GB |
| Roxy Music | More Than This | 1982 | Discogs + Spotify | 1982 | – | 1982 | GB |
| Roxy Music | Virginia Plain | 1972 | Discogs + Spotify | 1972 | – | 1972 | GB |
| Roy Orbison | California Blue | 1988 | MusicBrainz (Spotify: 1989) | – | 1988 | 1989 | US |
| Roy Orbison | In Dreams | 1963 | Discogs + Spotify | 1963 | – | 1963 | US |
| Roy Orbison | Oh, Pretty Woman | 1962 | Spotify (MusicBrainz: 1985) | 1964 | 1985 | 1962 | US |
| Roy Orbison | You Got It | 1989 | Discogs + Spotify | 1989 | – | 1989 | US |
| Royal Blood | Figure It Out | 2014 | Discogs + Spotify | 2014 | – | 2014 | GB |
| RSC | Kradniesz mi moją duszę | 1983 | Discogs | 1983 | – | 2004 | PL |
| RSC | Życie to teatr - Teatr pozoru | 1994 | Discogs | 1994 | – | 2004 | PL |
| Rudimental & Ella Eyre | Waiting All Night | 2013 | Discogs + Spotify | 2013 | – | 2013 | GB |
| Run–D.M.C. & Aerosmith | Walk This Way | 1986 | Discogs + Spotify | 1986 | – | 1986 | US |
| Run–D.M.C. & Jason Nevins | It's Like That | 1983 | MusicBrainz (Spotify: 2002) | 1988 | 1983 | 2002 | US |
| Rupert Holmes | Escape (The Pina Colada Song) | 1980 | Discogs | 1980 | – | 1998 | US |
| Rush | Nobody's Hero | 1993 | Spotify + MusicBrainz | – | 1993 | 1993 | CA |
| Rush | The Spirit Of Radio | 1980 | Discogs + Spotify | 1980 | – | 1980 | CA |
| Rush | Tom Sawyer | 1981 | Discogs + Spotify | 1981 | – | 1981 | CA |
| Ryszard Rynkowski | Szczęśliwej drogi już czas | 1991 | Discogs | 1991 | – | 1996 | PL |
| Ryszard Rynkowski | Wypijmy za błędy | 1991 | Discogs | 1991 | – | 1996 | PL |
| Ryuichi Sakamoto & David Sylvian | Forbidden Colours | 1983 | Discogs + Spotify | 1983 | – | 1983 | JP |
| Róisín Murphy | Overpowered | 2007 | Discogs + Spotify | 2007 | – | 2007 | IE |
| Róże Europy | Jedwab | 1993 | Discogs | 1993 | – | 2015 | PL |
| Róże Europy | Mamy dla Was Kamienie | 1988 | Discogs | 1988 | – | 1993 | PL |
| Róże Europy | Stańcie przed lustrami | 1988 | Discogs | 1988 | – | 2011 | PL |
| Röyksopp | What Else Is There? | 2005 | Discogs + Spotify | 2005 | – | 2005 | NO |
| Sabaton | Uprising | 2010 | Discogs + Spotify | 2010 | – | 2010 | SE |
| Sabrina | Boys - Summertime Love | 1987 | Discogs | 1987 | – | 1988 | IT |
| Sabrina Carpenter | Espresso | 2024 | Discogs + Spotify | 2024 | – | 2024 | US |
| Sabrina Carpenter | Manchild | 2025 | Discogs + Spotify | 2025 | – | 2025 | US |
| Sabrina Carpenter | Please Please Please | 2024 | Discogs + Spotify | 2024 | – | 2024 | US |
| Sade | By Your Side | 2000 | Discogs + Spotify | 2000 | – | 2000 | GB |
| Sade | No Ordinary Love | 1992 | Discogs + Spotify | 1992 | – | 1992 | GB |
| Sade | Smooth Operator | 1984 | Discogs | 1984 | – | 1994 | GB |
| Sade | Soldier of Love | 2009 | Discogs | 2009 | – | 2010 | GB |
| Sade | The Sweetest Taboo | 1985 | Discogs | 1985 | – | 1994 | GB |
| Sade | Your Love Is King | 1984 | Discogs + Spotify | 1984 | – | 1984 | GB |
| Saint Etienne | Only Love Can Break Your Heart | 1990 | Discogs | 1990 | – | 1991 | GB |
| Sal Solo | San Damiano | 1984 | Discogs | 1984 | – | 2006 | GB |
| Sam & Dave | Hold On, I'm Comin' | 1966 | Spotify (MusicBrainz: 1981) | – | 1981 | 1966 | US |
| Sam Brown & Pete Brown | Stop | 1988 | Spotify + MusicBrainz | – | 1988 | 1988 | GB |
| Sam Cooke | (What A) Wonderful World | 1985 | Discogs | 1985 | – | 2000 | US |
| Sam Cooke | A Change Is Gonna Come | 1964 | Discogs | 1964 | – | 2003 | US |
| Sam Fender | Seventeen Going Under | 2021 | Discogs + Spotify | 2021 | – | 2021 | GB |
| Sam Fender & Olivia Dean | Rein Me In | 2025 | Discogs + Spotify | 2025 | – | 2025 | GB |
| Sam Smith & Kim Petras | Unholy | 2022 | Discogs + Spotify | 2022 | – | 2022 | GB |
| sanah | Cicho sza | 2026 | Spotify + MusicBrainz | – | 2026 | 2026 | PL |
| sanah | etc. (na disco) | 2021 | Spotify + MusicBrainz | 2023 | 2021 | 2021 | PL |
| sanah | Hymn (J. Słowacki) | 2022 | Spotify + MusicBrainz | 2023 | 2022 | 2022 | PL |
| Sanah | Kolońska i szlugi | 2021 | Discogs + MusicBrainz+Wikipedia | 2021 | 2021 | – | PL |
| sanah | Melodia | 2020 | Discogs + MusicBrainz+Wikipedia | 2020 | 2020 | – | PL |
| sanah | Miłość jest ślepa | 2024 | Discogs + Spotify | 2024 | – | 2024 | PL |
| sanah | Nic dwa razy (W. Szymborska) | 2022 | Spotify + MusicBrainz | 2023 | 2022 | 2022 | PL |
| sanah | O miłości | 2024 | Discogs + Spotify | 2024 | – | 2024 | PL |
| sanah | Szampan | 2020 | Discogs + MusicBrainz+Wikipedia | 2020 | 2020 | – | PL |
| sanah | ten Stan | 2021 | Discogs + Spotify | 2021 | – | 2021 | PL |
| sanah & Dawid Podsiadło | Ostatnia nadzieja | 2022 | Discogs + MusicBrainz+Wikipedia | 2022 | 2022 | – | PL |
| sanah & ENKLAWA | itepe itede | 2026 | Spotify + MusicBrainz | – | 2026 | 2026 | PL |
| sanah & Vito Bambino | Ale jazz! | 2021 | Spotify + MusicBrainz | – | 2021 | 2021 | PL |
| Sananda Maitreya | Sign Your Name | 1987 | Spotify (MusicBrainz: 2025) | – | 2025 | 1987 | US |
| Sandra | (I'll Never Be) Maria Magdalena | 1985 | MusicBrainz (Spotify: 1987) | – | 1985 | 1987 | DE |
| Sandra | Everlasting Love | 1987 | Discogs + Spotify | 1987 | – | 1987 | DE |
| Sandra | In The Heat Of The Night | 1985 | Discogs | 1985 | – | 1992 | DE |
| Santana | Black Magic Woman | 1970 | Discogs | 1970 | – | 2007 | US |
| Santana | Europa (Earth's Cry Heaven's Smile) | 1998 | Discogs | 1998 | – | 2007 | US |
| Santana | Samba Pa Ti | 1970 | Discogs + Spotify | 1970 | – | 1970 | US |
| Santana & Rob Thomas | Smooth | 1999 | Discogs + Spotify | 1999 | – | 1999 | US |
| Sara James | ZRÓB TO DLA MNIE | 2026 | Spotify | – | – | 2026 | PL |
| Sarah Brightman & Andrea Bocelli | Time To Say Goodbye | 1996 | Discogs | 1996 | – | 2007 | GB |
| Sarsa | Czy będziemy się pamiętać? | 2026 | Spotify | – | – | 2026 | PL |
| Sarsa | Naucz Mnie | 2015 | Discogs + Spotify | 2015 | – | 2015 | PL |
| Sarsa | Zakryj | 2019 | Discogs + Spotify | 2019 | – | 2019 | PL |
| Savage Garden | To the Moon & Back | 1996 | Discogs | 1996 | – | 1997 | AU |
| Savage Garden | Truly Madly Deeply | 1997 | Discogs + Spotify | 1997 | – | 1997 | AU |
| Saxon | Broken Heroes | 1985 | Discogs + Spotify | 1985 | – | 1985 | GB |
| SBB | Memento z banalnym tryptykiem | 1981 | Discogs + MusicBrainz | 1981 | 1981 | 1980 | PL |
| Scatman John | Scatman (ski-ba-bop-ba-dop-bop) | 1995 | Discogs + Spotify | 1995 | – | 1995 | US |
| Scissor Sisters | I Don't Feel Like Dancin' | 2006 | Spotify + MusicBrainz | 2026 | 2006 | 2006 | US |
| Scorpions | No One Like You | 1982 | Discogs + Spotify | 1982 | – | 1982 | DE |
| Scorpions | Rock You Like a Hurricane | 1984 | Discogs + Spotify | 1984 | – | 1984 | DE |
| Scorpions | Still Loving You | 1984 | Discogs | 1984 | – | 2011 | DE |
| Scorpions | When the Smoke Is Going Down | 1982 | Discogs + Spotify | 1982 | – | 1982 | DE |
| Scorpions | Wind of Change | 1990 | Discogs + MusicBrainz+Wikipedia + Spotify | 1990 | 1990 | 1990 | DE |
| Scott Joplin | The Entertainer | 1970 | Discogs | 1970 | – | 2018 | US |
| Scott McKenzie | San Francisco (Be Sure to Wear Flowers in Your Hair) | 1967 | Discogs + Spotify | 1967 | – | 1967 | US |
| Screamin' Jay Hawkins | I Put a Spell On You | 1956 | Discogs | 1956 | – | 1958 | US |
| Seal | Crazy | 1990 | Discogs | 1990 | – | 2004 | GB |
| Seal | Kiss from a Rose | 1994 | Discogs + Spotify | 1994 | – | 1994 | GB |
| Seal | Love's Divine | 2003 | Spotify + MusicBrainz | 2004 | 2003 | 2003 | GB |
| Sebastian Riedel & Cree | Na Dnie Twojego Serca | 2015 | Spotify + MusicBrainz | – | 2015 | 2015 | ? |
| Seether & Amy Lee | Broken | 2002 | Discogs | 2002 | – | 2004 | US |
| Sepultura | Roots Bloody Roots | 1996 | Discogs + Spotify | 1996 | – | 1996 | BR |
| Serge Gainsbourg & Brigitte Bardot | Je t'aime moi non plus | 1969 | MusicBrainz (Spotify: 2006) | – | 1969 | 2006 | FR |
| Seweryn Krajewski | Uciekaj moje serce | 1983 | Discogs | 1983 | – | – | PL |
| Sex Pistols | Anarchy In The UK | 1976 | Discogs | 1976 | – | 1977 | GB |
| Sex Pistols | God Save The Queen | 1977 | Discogs + Spotify | 1977 | – | 1977 | GB |
| Shaboozey | A Bar Song (Tipsy) | 2024 | Discogs + Spotify | 2024 | – | 2024 | US |
| Shakin' Stevens | I Cry Just a Little Bit | 1983 | Discogs + Spotify | 1983 | – | 1983 | GB |
| Shakira | Whenever, Wherever | 2001 | Discogs + MusicBrainz+Wikipedia + Spotify | 2001 | 2001 | 2001 | CO |
| Shakira & Burna Boy | Dai Dai | 2026 | Discogs + Spotify | 2026 | – | 2026 | CO |
| Shania Twain | That Don't Impress Me Much | 1997 | MusicBrainz (Spotify: 1999) | – | 1997 | 1999 | CA |
| Shawn Mendes | Wonder | 2020 | Discogs + Spotify | 2020 | – | 2020 | CA |
| Sheryl Crow | All I Wanna Do | 1993 | Discogs | 1993 | – | 2021 | US |
| Shirley Bassey | Goldfinger - Main Title | 1964 | Spotify | 1995 | – | 1964 | MC |
| Shirley Bassey | This Is My Life | 1968 | Discogs | 1968 | – | 2018 | MC |
| Shocking Blue | Send Me A Postcard | 1968 | Discogs | 1968 | – | 1970 | NL |
| Shocking Blue | Venus | 1969 | Discogs | 1969 | – | 2011 | NL |
| Shouse & David Guetta | Love Tonight | 2017 | Discogs | 2017 | – | 2021 | AU |
| Sia | Chandelier | 2014 | Discogs + MusicBrainz+Wikipedia + Spotify | 2014 | 2014 | 2014 | AU |
| Sia | Elastic Heart | 2013 | Discogs | 2013 | – | 2014 | AU |
| Sia | Unstoppable | 2016 | Discogs + Spotify | 2016 | – | 2016 | AU |
| Sidney Polak | Chomiczówka | 2004 | Discogs + Spotify | 2004 | – | 2004 | PL |
| Sidney Polak & Pezet | Otwieram wino | 2004 | Discogs + Spotify | 2004 | – | 2004 | PL |
| Siekiera | Nowa Aleksandria | 1986 | Discogs | 1986 | – | 2012 | PL |
| Sigur Rós | Sæglópur | 2005 | Discogs + Spotify | 2005 | – | 2005 | IS |
| Simon & Garfunkel | Bridge Over Troubled Water | 1970 | Discogs + Spotify | 1970 | – | 1970 | US |
| Simon & Garfunkel | Cecilia | 1969 | Discogs | 1969 | – | 1970 | US |
| Simon & Garfunkel | El Condor Pasa (If I Could) | 1970 | Spotify + MusicBrainz | 1972 | 1970 | 1970 | US |
| Simon & Garfunkel | Mrs. Robinson | 1968 | Discogs + Spotify | 1968 | – | 1968 | US |
| Simon & Garfunkel | Scarborough Fair / Canticle | 1966 | Discogs + Spotify | 1966 | – | 1966 | US |
| Simon & Garfunkel | The Boxer | 1969 | Discogs | 1969 | – | 1970 | US |
| Simon & Garfunkel | The Sound of Silence | 1965 | Discogs + MusicBrainz | 1965 | 1965 | 1964 | US |
| Simple Minds | Belfast Child | 1989 | Discogs | 1989 | – | 2008 | GB |
| Simple Minds | Don't You (Forget About Me) | 1985 | MusicBrainz+Wikipedia + Spotify | 2013 | 1985 | 1985 | GB |
| Simple Minds | Let There Be Love | 1991 | Discogs + Spotify | 1991 | – | 1991 | GB |
| Simply Red | Holding Back the Years | 1985 | Discogs + Spotify | 1985 | – | 1985 | GB |
| Simply Red | If You Don't Know Me by Now | 1989 | Spotify + MusicBrainz | – | 1989 | 1989 | GB |
| Simply Red | Something Got Me Started | 1991 | Spotify + MusicBrainz | – | 1991 | 1991 | GB |
| Simply Red | Stars | 1991 | Discogs + Spotify | 1991 | – | 1991 | GB |
| Sinéad O'Connor | Fire on Babylon | 1994 | Discogs + Spotify | 1994 | – | 1994 | IE |
| Sinéad O'Connor | Mandinka | 1987 | Discogs + Spotify | 1987 | – | 1987 | IE |
| Sinéad O'Connor | Nothing Compares 2 U | 1990 | Discogs + MusicBrainz+Wikipedia + Spotify | 1990 | 1990 | 1990 | IE |
| Sinéad O'Connor | Troy | 1987 | Discogs + Spotify | 1987 | – | 1987 | IE |
| Sinéad O'Connor | You Made Me the Thief of Your Heart | 1994 | Discogs | 1994 | – | 1997 | IE |
| Sistars | Na dwa | 2005 | MusicBrainz (Spotify: 2006) | – | 2005 | 2006 | PL |
| Sistars | Sutra | 2004 | Discogs + Spotify | 2004 | – | 2004 | PL |
| Sistars & Numer Raz | Siła Sióstr | 2003 | Discogs | 2003 | – | 2018 | PL |
| Sister Sledge | He's the Greatest Dancer | 1978 | Discogs (ponowne sprawdzenie) | 1978 | 1979 | 1979 | US |
| Sister Sledge | We Are Family | 1978 | Discogs | 1978 | – | 1979 | US |
| Sisters of Mercy | Lucretia My Reflection | 1987 | Discogs + Spotify | 1987 | – | 1987 | GB |
| Sisters of Mercy | Temple of Love | 1983 | Discogs | 1983 | – | 1992 | GB |
| Sisters of Mercy | This Corrosion | 1987 | Discogs | 1987 | – | 1993 | GB |
| Sixpence None The Richer | Kiss Me | 1997 | Discogs + Spotify | 1997 | – | 1997 | US |
| Sixteen | Obudź We Mnie Wenus | 1997 | Discogs | 1997 | – | 2009 | PL |
| Skaldowie | Cała jesteś w skowronkach | 1969 | Discogs + Spotify | 1969 | – | 1969 | PL |
| Skaldowie | Dopóki jesteś | 1991 | Discogs | 1991 | – | 2008 | PL |
| Skaldowie | Krywaniu, Krywaniu | 1972 | Discogs + Spotify | 1972 | – | 1972 | PL |
| Skaldowie | Medytacje wiejskiego listonosza | 1969 | Discogs + MusicBrainz+Wikipedia | 1969 | 1969 | 2008 | PL |
| Skaldowie | Od wschodu do zachodu słońca | 1970 | Discogs + Spotify | 1970 | – | 1970 | PL |
| Skaldowie | Prześliczna wiolonczelistka | 1969 | Discogs + Spotify | 1969 | – | 1969 | PL |
| Skaldowie | Wszystko mi mówi, że mnie ktoś pokochał | 1968 | Discogs + Spotify | 1968 | – | 1968 | PL |
| Skaldowie & Lucja Prus | W żółtych płomieniach liści | 1972 | Spotify (MusicBrainz: 1998) | 1991 | 1998 | 1972 | PL |
| Skaldowie & Stanislaw Wenglorz | Nie widzę ciebie w swych marzeniach | 2000 | Discogs | 2000 | – | 2016 | PL |
| Skeeter Davis | The End of the World | 1962 | Discogs | 1962 | – | 1994 | US |
| Skid Row | 18 and Life | 1989 | Discogs + Spotify | 1989 | – | 1989 | US |
| Skid Row | I Remember You | 1989 | Discogs + Spotify | 1989 | – | 1989 | US |
| Skid Row | Youth Gone Wild | 1989 | Discogs + Spotify | 1989 | – | 1989 | US |
| Skolim | Wyglądasz Idealnie | 2022 | MusicBrainz (Spotify: 2024) | – | 2022 | 2024 | PL |
| SKUBAS | Haitańskie drzewa | 2020 | Spotify | – | – | 2020 | PL |
| SKUBAS | Linoskoczek | 2012 | Spotify + MusicBrainz | – | 2012 | 2012 | PL |
| SKUBAS | Nie mam dla ciebie miłości | 2014 | Spotify + MusicBrainz | – | 2014 | 2014 | PL |
| Skunk Anansie | Charlie Big Potato | 1999 | Discogs + Spotify | 1999 | – | 1999 | GB |
| Skunk Anansie | Hedonism (Just Because You Feel Good) | 1996 | Discogs + Spotify | 1996 | – | 1996 | GB |
| Slade | Coz I Luv You | 1971 | Discogs | 1971 | – | 1973 | GB |
| Slade | Far Far Away | 1974 | Discogs + Spotify | 1974 | – | 1974 | GB |
| Slade | Run Runaway | 1983 | Discogs + Spotify | 1983 | – | 1983 | GB |
| Slade | The Bangin' Man | 1974 | Discogs + Spotify | 1974 | – | 1974 | GB |
| Slaughter | Up All Night | 1990 | Discogs | 1990 | – | 1995 | US |
| Slayer | Angel Of Death | 1986 | Discogs + Spotify | 1986 | – | 1986 | US |
| Slayer | Raining Blood | 1986 | Discogs + Spotify | 1986 | – | 1986 | US |
| Slayer | Seasons In The Abyss | 1990 | Discogs + Spotify | 1990 | – | 1990 | US |
| Slik | Forever And ever | 1975 | Discogs | 1975 | – | 2011 | GB |
| Slipknot | Duality | 2004 | Discogs + Spotify | 2004 | – | 2004 | US |
| Sly & The Family Stone | If You Want Me to Stay | 1973 | Discogs + Spotify | 1973 | – | 1973 | US |
| Smokie | If You Think You Know How to Love Me | 1975 | Discogs + Spotify | 1975 | – | 1975 | GB |
| Smokie | Living Next Door to Alice | 1976 | Discogs + MusicBrainz | 1976 | 1976 | 1975 | GB |
| Smolik & Artur Rojek | 50 Tysięcy 881 | 2001 | Discogs | 2001 | – | 2021 | PL |
| Smolik & Kasia Kurzawska | Cye | 2006 | Discogs + Spotify | 2006 | – | 2006 | PL |
| SNAP! | Rhythm Is a Dancer | 1992 | Spotify (MusicBrainz: 1993) | – | 1993 | 1992 | DE |
| Sniff 'n' The Tears | Driver's Seat | 1978 | Spotify + MusicBrainz | – | 1978 | 1978 | GB |
| Snoop Dogg | Gin and Juice | 1993 | Discogs + Spotify | 1993 | – | 1993 | US |
| Snoop Dogg | Who Am I (What’s My Name)? | 1993 | Spotify (MusicBrainz: 1996) | 2000 | 1996 | 1993 | US |
| Snoop Dogg & Pharrell Williams | Drop It Like It's Hot | 2004 | Discogs + Spotify | 2004 | – | 2004 | US |
| Snow Patrol | Chasing Cars | 2006 | Discogs + Spotify | 2006 | – | 2006 | GB |
| Snowy White | Bird of Paradise | 1983 | Discogs | 1983 | – | 2003 | GB |
| Sobel & Czarny HIFI | Daj Mi Znać | 2020 | Spotify + MusicBrainz | – | 2020 | 2020 | PL |
| Sobel & Piotrek Lewandowski | Fiołkowe Pole | 2021 | Discogs + Spotify | 2021 | – | 2021 | PL |
| Soft Cell | Tainted Love | 1981 | Discogs + Spotify | 1981 | – | 1981 | GB |
| Solange | Cranes in the Sky | 2016 | Discogs + Spotify | 2016 | – | 2016 | US |
| Solange | Losing You | 2012 | Discogs + Spotify | 2012 | – | 2012 | US |
| Solomon Burke | Cry to Me | 1962 | Discogs | 1962 | – | 1998 | US |
| Solomon Burke | Everybody Needs Somebody to Love | 1964 | Discogs | 1964 | – | 1998 | US |
| sombr | 12 to 12 | 2025 | Discogs + Spotify | 2025 | – | 2025 | US |
| sombr | back to friends | 2025 | Discogs + MusicBrainz | 2025 | 2025 | 2024 | US |
| sombr | Homewrecker | 2026 | Discogs + Spotify | 2026 | – | 2026 | US |
| Sonic Youth | Teen Age Riot | 1988 | Discogs + Spotify | 1988 | – | 1988 | US |
| Sonny & Cher | I Got You Babe | 1965 | Discogs | 1965 | – | 1991 | US |
| Sonny & Cher | Little Man | 1966 | Discogs | 1966 | – | 2019 | US |
| Sophie B. Hawkins | Damn I Wish I Was Your Lover | 1992 | Discogs + Spotify | 1992 | – | 1992 | US |
| Sophie Ellis-Bextor | Murder On The Dancefloor | 2001 | Discogs | 2001 | – | 2002 | GB |
| Sorry Boys | Absolutnie, absolutnie | 2019 | Discogs + Spotify | 2019 | – | 2019 | PL |
| Sosnowski | Deszcz | 2019 | Spotify | – | – | 2019 | PL |
| Sosnowski | Pył | 2022 | Spotify + MusicBrainz | – | 2022 | 2022 | PL |
| Soul Asylum | Runaway Train | 1991 | Discogs | 1991 | – | 1992 | US |
| Soundgarden | Black Hole Sun | 1994 | Discogs + Spotify | 1994 | – | 1994 | US |
| Soundgarden | Fell On Black Days | 1993 | Discogs | 1993 | – | 1994 | US |
| Soundgarden | Spoonman | 1993 | Discogs | 1993 | – | 1994 | US |
| Soyka | Życie to krótki sen | 2002 | Spotify (MusicBrainz: 2008) | – | 2008 | 2002 | PL |
| Spandau Ballet | Gold | 1983 | Discogs | 1983 | – | 2000 | GB |
| Spandau Ballet | True | 1983 | Discogs | 1983 | – | 2008 | GB |
| Spice Girls | Wannabe | 1996 | Discogs + MusicBrainz+Wikipedia + Spotify | 1996 | 1996 | 1996 | GB |
| Spin Doctors | Two Princes | 1991 | Discogs + Spotify | 1991 | – | 1991 | US |
| Spiritualized | Ladies and gentlemen we are floating in space | 1997 | Discogs + Spotify | 1997 | – | 1997 | GB |
| Stan Borys | Jaskółka uwięziona | 1975 | Discogs | 1975 | – | 2009 | PL |
| Stan Borys | Spacer dziką plażą | 1969 | Discogs | 1969 | – | 2009 | PL |
| Stan Getz | The Girl From Ipanema | 1964 | Discogs + Spotify | 1964 | – | 1964 | US |
| Stan Ridgway | Camouflage | 1986 | Discogs | 1986 | – | 1993 | US |
| Stanisław Soyka | Cud niepamięci | 2002 | MusicBrainz (Spotify: 2016) | – | 2002 | 2016 | PL |
| Stanisław Soyka | Czas nas uczy pogody | 2016 | Spotify | – | – | 2016 | PL |
| Stanisław Soyka | Dziwny Jest Ten Swiat | 2012 | Spotify | – | – | 2012 | PL |
| Stanisław Soyka | Kiedy jesteś taka bliska | 2016 | Spotify | – | – | 2016 | PL |
| Stanisław Soyka | Tolerancja | 2016 | Spotify (MusicBrainz: 2023) | – | 2023 | 2016 | PL |
| Stanisław Soyka & Janusz Iwanski "yanina" | Tolerancja / Na Miły Bóg | 1992 | Spotify | – | – | 1992 | PL |
| Stardust & Benjamin Diamond | Music Sounds Better With You | 1998 | Discogs + Spotify | 1998 | – | 1998 | FR |
| Stare Dobre Małżeństwo | Bieszczadzkie anioły | 2000 | Discogs | 2000 | – | 2019 | PL |
| Stare Dobre Małżeństwo | Czarny blues o czwartej nad ranem | 1992 | Discogs | 1992 | – | 2019 | PL |
| Starsailor | Alcoholic | 2001 | Discogs + Spotify | 2001 | – | 2001 | GB |
| Starship | Nothing's Gonna Stop Us Now | 1987 | Spotify + MusicBrainz | – | 1987 | 1987 | US |
| Starship | Sara | 1985 | Discogs + Spotify | 1985 | – | 1985 | US |
| Starship | We Built This City | 1985 | Discogs + Spotify | 1985 | – | 1985 | US |
| Staszek z Gór & Sound'n'Grace | Tu Mój Dom | 2026 | Spotify | – | – | 2026 | ? |
| Status Quo | In The Army Now | 1986 | Discogs + Spotify | 1986 | – | 1986 | GB |
| Status Quo | Pictures of Matchstick Men | 1968 | Discogs + Spotify | 1968 | – | 1968 | GB |
| Status Quo | Rockin' All Over The World | 1977 | Discogs + Spotify | 1977 | – | 1977 | GB |
| Status Quo | Whatever You Want | 1979 | Discogs + Spotify | 1979 | – | 1979 | GB |
| Stealers Wheel | Stuck In The Middle With You | 1972 | Discogs + Spotify | 1972 | – | 1972 | GB |
| Steely Dan | Do It Again | 1972 | Discogs + Spotify | 1972 | – | 1972 | US |
| Stephen Sanchez | Until I Found You | 2021 | Discogs + Spotify | 2021 | – | 2021 | US |
| Steppenwolf | Born To Be Wild | 1968 | Discogs + Spotify | 1968 | – | 1968 | US |
| Stereo MC's | Connected | 1992 | Discogs + Spotify | 1992 | – | 1992 | GB |
| Stereophonics | Dakota | 2005 | Discogs + Spotify | 2005 | – | 2005 | GB |
| Stereophonics | Graffiti On The Train | 2013 | Discogs + Spotify | 2013 | – | 2013 | GB |
| Stereophonics | Maybe Tomorrow | 2003 | Discogs + Spotify | 2003 | – | 2003 | GB |
| Steve Hackett | In Memoriam | 1999 | Discogs + Spotify | 1999 | – | 1999 | GB |
| Steve Harley & Cockney Rebel | Sebastian | 1975 | Discogs + MusicBrainz | 1975 | 1975 | 1973 | GB |
| Steve Lacy | Bad Habit | 2022 | Discogs + Spotify | 2022 | – | 2022 | US |
| Steve Miller Band | Abracadabra | 1982 | Discogs + Spotify | 1982 | – | 1982 | US |
| Steve Miller Band | Fly Like An Eagle | 1976 | Discogs + Spotify | 1976 | – | 1976 | US |
| Stevie Nicks | Edge of Seventeen | 1981 | Discogs + Spotify | 1981 | – | 1981 | US |
| Stevie Wonder | Another Star | 1976 | Discogs + Spotify | 1976 | – | 1976 | US |
| Stevie Wonder | As | 1976 | Spotify + MusicBrainz | – | 1976 | 1976 | US |
| Stevie Wonder | For Once In My Life | 1968 | Discogs + Spotify | 1968 | – | 1968 | US |
| Stevie Wonder | He's Misstra Know-It-All | 1973 | Spotify + MusicBrainz | – | 1973 | 1973 | US |
| Stevie Wonder | Higher Ground | 1973 | Discogs + Spotify | 1973 | – | 1973 | US |
| Stevie Wonder | I Just Called To Say I Love You | 1984 | Discogs | 1984 | – | 1999 | US |
| Stevie Wonder | I Wish | 1976 | Discogs + Spotify | 1976 | – | 1976 | US |
| Stevie Wonder | Isn't She Lovely | 1976 | Spotify + MusicBrainz | 2002 | 1976 | 1976 | US |
| Stevie Wonder | Living For The City | 1973 | Discogs | 1973 | – | 2002 | US |
| Stevie Wonder | Master Blaster (Jammin') | 1980 | Discogs | 1980 | – | 2002 | US |
| Stevie Wonder | Part-Time Lover | 1985 | Discogs + Spotify | 1985 | – | 1985 | US |
| Stevie Wonder | Sir Duke | 1976 | Discogs + Spotify | 1976 | – | 1976 | US |
| Stevie Wonder | Superstition | 1972 | Discogs + Spotify | 1972 | – | 1972 | US |
| Sting | A Thousand Years | 1999 | Discogs + Spotify | 1999 | – | 1999 | GB |
| Sting | Englishman In New York | 1987 | Discogs + Spotify | 1987 | – | 1987 | GB |
| Sting | Fields Of Gold | 1993 | Discogs + Spotify | 1993 | – | 1993 | GB |
| Sting | Fragile | 1987 | Discogs + Spotify | 1987 | – | 1987 | GB |
| Sting | Mad About You | 1991 | Discogs + Spotify | 1991 | – | 1991 | GB |
| Sting | Moon Over Bourbon Street | 1985 | Discogs + Spotify | 1985 | – | 1985 | GB |
| Sting | Shape Of My Heart | 1993 | Discogs + Spotify | 1993 | – | 1993 | GB |
| Sting & Cheb Mami | Desert Rose | 1999 | Discogs + Spotify | 1999 | – | 1999 | GB |
| Strachy Na Lachy | Co się stało z Magdą K.? | 2005 | Discogs + Spotify | 2005 | – | 2005 | PL |
| Strachy Na Lachy | Czarny chleb i czarna kawa | 2005 | Discogs + Spotify | 2005 | – | 2005 | PL |
| Strachy Na Lachy | Dzień dobry, kocham Cię | 2005 | Discogs + Spotify | 2005 | – | 2005 | PL |
| Strachy Na Lachy | Piła tango | 2005 | Discogs + Spotify | 2005 | – | 2005 | PL |
| Strachy Na Lachy | Żyję w kraju | 2010 | Discogs + Spotify | 2010 | – | 2010 | PL |
| Stromae | Alors on danse | 2009 | Discogs + MusicBrainz+Wikipedia | 2009 | 2009 | 2010 | BE |
| Stromae | Formidable | 2013 | Discogs + Spotify | 2013 | – | 2013 | BE |
| Studio Buffo | Radość o poranku | 1997 | Spotify (MusicBrainz: 2012) | – | 2012 | 1997 | PL |
| Studio Buffo | Winda do nieba | 1997 | Spotify (MusicBrainz: 2012) | – | 2012 | 1997 | PL |
| Styx | Babe | 1979 | Discogs + Spotify | 1979 | – | 1979 | US |
| Styx | Boat On The River | 1979 | Discogs + Spotify | 1979 | – | 1979 | US |
| Styx | Mr. Roboto | 1983 | Discogs + Spotify | 1983 | – | 1983 | US |
| Suede | Beautiful Ones | 1996 | Discogs + Spotify | 1996 | – | 1996 | GB |
| Suede | Trash | 1996 | Discogs + Spotify | 1996 | – | 1996 | GB |
| Sufjan Stevens | Chicago | 2005 | Spotify + MusicBrainz | 2006 | 2005 | 2005 | US |
| Sugababes | About You Now | 2007 | Discogs + Spotify | 2007 | – | 2007 | GB |
| Sugababes | Push The Button | 2005 | Discogs + Spotify | 2005 | – | 2005 | GB |
| Sugababes | Round Round | 2002 | Discogs + Spotify | 2002 | – | 2002 | GB |
| Sumptuastic | Kołysanka | 2003 | Discogs + Spotify | 2003 | – | 2003 | PL |
| Supergrass | Alright | 1995 | Discogs + Spotify | 1995 | – | 1995 | GB |
| Supertramp | Breakfast In America | 1979 | Discogs + Spotify | 1979 | – | 1979 | GB |
| Supertramp | The Logical Song | 1979 | Discogs + Spotify | 1979 | – | 1979 | GB |
| Survivor | Eye of the Tiger | 1982 | Discogs + MusicBrainz+Wikipedia | 1982 | 1982 | 1985 | US |
| Suzanne Vega | Luka | 1987 | Discogs | 1987 | – | 2010 | US |
| Suzanne Vega | Tom's Diner | 1987 | Discogs + Spotify | 1987 | – | 1987 | US |
| Suzi Quatro | Can the Can | 1973 | Discogs + Spotify | 1973 | – | 1973 | US |
| Suzi Quatro | If You Can't Give Me Love | 1978 | Spotify + MusicBrainz | – | 1978 | 1978 | US |
| Suzi Quatro & Chris Norman | Stumblin' In | 1979 | Discogs | 1979 | – | 1999 | US |
| Sweet | Ballroom Blitz | 1974 | Discogs | 1974 | – | 2017 | GB |
| Sweet Noise & Anna Maria Jopek | Dzisiaj mnie kochasz, jutro nienawidzisz | 2002 | Discogs | 2002 | – | 2003 | PL |
| Swiernalis & Piotr Rogucki | Ogrodnik | 2020 | Spotify | – | – | 2020 | PL |
| Swietliki | Filandia | 2005 | Discogs + Spotify | 2005 | – | 2005 | PL |
| Sylvester | You Make Me Feel (Mighty Real) | 1978 | Discogs + Spotify | 1978 | – | 1978 | US |
| Sylwia Drabik | Łatwopalni | 2016 | Spotify | – | – | 2016 | ? |
| Sylwia Grzeszczak | MANGO | 2026 | Spotify | – | – | 2026 | PL |
| Sylwia Grzeszczak | Małe rzeczy | 2011 | Discogs + MusicBrainz+Wikipedia + Spotify | 2011 | 2011 | 2011 | PL |
| Sylwia Grzeszczak | Tamta dziewczyna | 2016 | Discogs + Spotify | 2016 | – | 2016 | PL |
| Sylwia Grzeszczak & Liber | Co Z Nami Będzie | 2008 | Discogs + Spotify | 2008 | – | 2008 | PL |
| Sylwia Wisniewska | 12 Łez | 2005 | Spotify + MusicBrainz | – | 2005 | 2005 | PL |
| System Of A Down | Chop Suey! | 2001 | Spotify + MusicBrainz | – | 2001 | 2001 | US |
| System Of A Down | Lonely Day | 2005 | Discogs + Spotify | 2005 | – | 2005 | US |
| System Of A Down | Lost In Hollywood | 2005 | Discogs + Spotify | 2005 | – | 2005 | US |
| System Of A Down | Toxicity | 2001 | Discogs + Spotify | 2001 | – | 2001 | US |
| SZA | Kill Bill | 2022 | Discogs + Spotify | 2022 | – | 2022 | US |
| Sztywny Pal Azji | Nieprzemakalni | 1988 | Discogs | 1988 | – | 2001 | PL |
| Sztywny Pal Azji | Spotkanie z... | 1988 | Discogs | 1988 | – | 2001 | PL |
| Sztywny Pal Azji | Wieża radości, wieża samotności | 1988 | Discogs | 1988 | – | 1998 | PL |
| Sława Przybylska | Gdzie są kwiaty | 1965 | Discogs | 1965 | – | 2015 | PL |
| Sława Przybylska | Okularnicy | 1999 | MusicBrainz (Spotify: 2009) | – | 1999 | 2009 | PL |
| Sława Przybylska | Pamietasz Była Jesień | 1959 | Discogs | 1959 | – | 2015 | PL |
| Sława Przybylska | Siedzieliśmy na dachu | 1964 | Spotify (MusicBrainz: 1999) | 2001 | 1999 | 1964 | PL |
| T. Rex | 20th Century Boy | 1973 | Discogs + Spotify | 1973 | – | 1973 | GB |
| T. Rex | Children of the Revolution | 1972 | Discogs | 1972 | – | 1973 | GB |
| T. Rex | Get It On | 1971 | Discogs + Spotify | 1971 | – | 1971 | GB |
| T. Rex | Hot Love - A Side | 1971 | Spotify | 1996 | – | 1971 | GB |
| T. Rex | Jeepster | 1971 | Discogs + Spotify | 1971 | – | 1971 | GB |
| t.A.T.u. | All The Things She Said | 2002 | Discogs + Spotify | 2002 | – | 2002 | RU |
| T.Love | Ajrisz | 2001 | Discogs + Spotify | 2001 | – | 2001 | PL |
| T.Love | Bóg | 1998 | Discogs | 1998 | – | 2014 | PL |
| T.Love | Chłopaki nie płaczą | 1997 | Discogs + Spotify | 1997 | – | 1997 | PL |
| T.Love | Dzikość serca | 1992 | Discogs + Spotify | 1992 | – | 1992 | PL |
| T.Love | I Love You | 1994 | Discogs | 1994 | – | 2014 | PL |
| T.Love | IV Liceum | 2008 | Discogs | 2008 | – | 2014 | PL |
| T.Love | Jest super | 1997 | Discogs + Spotify | 1997 | – | 1997 | PL |
| T.Love | King | 1992 | Discogs + Spotify | 1992 | – | 1992 | PL |
| T.Love | Lucy Phere | 2012 | Discogs + Spotify | 2012 | – | 2012 | PL |
| T.Love | Nie nie nie | 2001 | Spotify + MusicBrainz | – | 2001 | 2001 | PL |
| T.Love | To wychowanie | 1989 | Discogs | 1989 | – | 2014 | PL |
| T.Love | Warszawa | 1991 | Discogs + Spotify | 1991 | – | 1991 | PL |
| Tabb & Mezo | Ważne | 2005 | Spotify (MusicBrainz: 2007) | – | 2007 | 2005 | PL |
| Taco Hemingway & Lanek | POLSKIE TANGO | 2020 | Discogs + Spotify | 2020 | – | 2020 | PL |
| Taco Hemingway & Rumak | Deszcz na betonie | 2016 | Discogs + Spotify | 2016 | – | 2016 | PL |
| Taco Hemingway & Rumak | Następna stacja | 2015 | Discogs + Spotify | 2015 | – | 2015 | PL |
| TACONAFIDE & Quebonafide | Tamagotchi | 2018 | Discogs + Spotify | 2018 | – | 2018 | PL |
| Tadeusz Nalepa | Dbaj o miłość | 1989 | Discogs + MusicBrainz | 1989 | 1989 | 1988 | PL |
| Tadeusz Nalepa | To mój blues | 1985 | Discogs | 1985 | – | 1988 | PL |
| Tadeusz Wozniak | Hej, Hanno | 1992 | Discogs | 1992 | – | 2014 | PL |
| Tadeusz Woźniak | Smak i zapach pomarańczy | 1972 | Discogs + Spotify | 1972 | – | 1972 | PL |
| Tadeusz Woźniak | Zegarmistrz światła | 1972 | Discogs + Spotify | 1972 | – | 1972 | PL |
| Taio Cruz & Ludacris | Break Your Heart | 2009 | Discogs | 2009 | – | 2011 | GB |
| Take That | Back for Good | 1995 | Discogs + Spotify | 1995 | – | 1995 | GB |
| Talk Talk | It's My Life | 1984 | Spotify + MusicBrainz | 1985 | 1984 | 1984 | GB |
| Talk Talk | Life's What You Make It | 1986 | Discogs + Spotify | 1986 | – | 1986 | GB |
| Talk Talk | Living in Another World | 1986 | Discogs + Spotify | 1986 | – | 1986 | GB |
| Talk Talk | Such a Shame | 1984 | Discogs | 1984 | – | 1999 | GB |
| Talking Heads | Once in a Lifetime | 1980 | Discogs + Spotify | 1980 | – | 1980 | US |
| Talking Heads | Psycho Killer | 1977 | Discogs + Spotify | 1977 | – | 1977 | US |
| Talking Heads | Road to Nowhere | 1985 | Discogs + Spotify | 1985 | – | 1985 | US |
| Tame Impala | Borderline | 2019 | Discogs | 2019 | – | 2020 | AU |
| Tame Impala | Let It Happen | 2015 | Discogs + Spotify | 2015 | – | 2015 | AU |
| Tame Impala | The Less I Know The Better | 2015 | Discogs + Spotify | 2015 | – | 2015 | AU |
| Tanita Tikaram | I Think of You | 1998 | MusicBrainz (Spotify: 2019) | – | 1998 | 2019 | GB |
| Tanita Tikaram | Twist in My Sobriety | 1988 | Discogs + Spotify | 1988 | – | 1988 | GB |
| Tasmin Archer | Sleeping Satellite | 1992 | Discogs + Spotify | 1992 | – | 1992 | GB |
| Tate McRae | greedy | 2023 | Discogs + Spotify | 2023 | – | 2023 | CA |
| Tate McRae | you broke me first | 2020 | Discogs | 2020 | – | 2021 | CA |
| Tavares | Heaven Must Be Missing An Angel - Pt. 1 | 1976 | Discogs (ponowne sprawdzenie) | 1976 | 2014 | 1996 | US |
| Taylor Dayne | Tell It to My Heart | 1987 | Discogs | 1987 | – | 1988 | US |
| Taylor Swift | Anti-Hero | 2022 | Discogs + Spotify | 2022 | – | 2022 | US |
| Taylor Swift | august | 2020 | Discogs + Spotify | 2020 | – | 2020 | US |
| Taylor Swift | Blank Space | 2014 | Discogs + Spotify | 2014 | – | 2014 | US |
| Taylor Swift | cardigan | 2020 | Discogs + Spotify | 2020 | – | 2020 | US |
| Taylor Swift | Don’t Blame Me | 2017 | Spotify + MusicBrainz | – | 2017 | 2017 | US |
| Taylor Swift | Shake It Off | 2014 | Discogs + MusicBrainz+Wikipedia + Spotify | 2014 | 2014 | 2014 | US |
| Taylor Swift | The Fate of Ophelia | 2025 | Discogs + Spotify | 2025 | – | 2025 | US |
| Taylor Swift & Post Malone | Fortnight | 2024 | Discogs + Spotify | 2024 | – | 2024 | US |
| Tears for Fears | Everybody Wants to Rule the World | 1985 | Discogs + MusicBrainz+Wikipedia + Spotify | 1985 | 1985 | 1985 | GB |
| Tears For Fears | Mad World | 1982 | Discogs | 1982 | – | 1983 | GB |
| Tears For Fears | Shout | 1984 | Discogs | 1984 | – | 1985 | GB |
| Tears For Fears | Sowing The Seeds Of Love | 1989 | Discogs + Spotify | 1989 | – | 1989 | GB |
| Tears For Fears & Oleta Adams | Woman In Chains | 1989 | Discogs + Spotify | 1989 | – | 1989 | GB |
| Teddy Swims | Lose Control | 2023 | Discogs + Spotify | 2023 | – | 2023 | US |
| Temple Of The Dog | Hunger Strike | 1991 | Discogs + MusicBrainz | 1991 | 1991 | 1990 | US |
| Ten Sharp | You | 1991 | Discogs + Spotify | 1991 | – | 1991 | NL |
| Ten Typ Mes & Justyna Święs | Odporność | 2018 | Spotify + MusicBrainz | – | 2018 | 2018 | PL |
| Ten Years After | I'd Love to Change the World | 1971 | Spotify + MusicBrainz | – | 1971 | 1971 | GB |
| Ten Years After | I'm Going Home | 1968 | MusicBrainz (Spotify: 1975) | 1982 | 1968 | 1975 | GB |
| Ten Years After | Love Like a Man | 1970 | Discogs | 1970 | – | 2000 | GB |
| Teresa Tutinas | Jak cię miły zatrzymać | 1968 | Spotify (MusicBrainz: 1999) | 1995 | 1999 | 1968 | ? |
| Teresa Tutinas | Na Całych Jeziorach Ty | 1995 | Discogs | 1995 | – | 2014 | ? |
| Tesla | Love Song | 1989 | Discogs | 1989 | – | 1995 | US |
| Tesla | Modern Day Cowboy | 1986 | Discogs + Spotify | 1986 | – | 1986 | US |
| Test | Świat Jaki Jest | 2000 | Discogs | 2000 | – | 2015 | PL |
| The 5th Dimension | Aquarius/Let the Sunshine In (The Flesh Failures) | 1969 | MusicBrainz (Spotify: 2011) | – | 1969 | 2011 | US |
| The Alan Parsons Project | Don't Answer Me | 1984 | Spotify + MusicBrainz | 2014 | 1984 | 1984 | GB |
| The Alan Parsons Project | Eye In The Sky | 1982 | Discogs + Spotify | 1982 | – | 1982 | GB |
| The Alan Parsons Project | La Sagrada Familia | 1987 | Discogs + Spotify | 1987 | – | 1987 | GB |
| The Alan Parsons Project | Time | 1980 | Spotify + MusicBrainz | – | 1980 | 1980 | GB |
| The Animals | Don't Let Me Be Misunderstood | 1965 | MusicBrainz (Spotify: 2003) | – | 1965 | 2003 | GB |
| The Animals | House of the Rising Sun | 1970 | MusicBrainz (Spotify: 1990) | – | 1970 | 1990 | GB |
| The Animals | The House of the Rising Sun | 1964 | Discogs + MusicBrainz+Wikipedia | 1964 | 1964 | – | GB |
| THE ANXIETY & WILLOW | Meet Me At Our Spot | 2020 | Discogs + Spotify | 2020 | – | 2020 | US |
| The Archies | Sugar Sugar | 1969 | Spotify (MusicBrainz: 1982) | – | 1982 | 1969 | US |
| The Avalanches | Since I Left You | 2000 | Discogs | 2000 | – | 2001 | AU |
| The B-52's | Love Shack | 1989 | Spotify + MusicBrainz | – | 1989 | 1989 | US |
| The Band | The Night They Drove Old Dixie Down | 1969 | Discogs + Spotify | 1969 | – | 1969 | CA |
| The Bangles | Walk Like an Egyptian | 1985 | Spotify + MusicBrainz | – | 1985 | 1985 | US |
| The Bangles & Susanna Hoffs | Eternal Flame | 1988 | Spotify (MusicBrainz: 1989) | – | 1989 | 1988 | US |
| The Beach Boys | God Only Knows | 1966 | Discogs + Spotify | 1966 | – | 1966 | US |
| The Beach Boys | Good Vibrations | 1966 | Discogs + MusicBrainz+Wikipedia | 1966 | 1966 | 2006 | US |
| The Beach Boys | I Get Around | 1964 | Discogs + Spotify | 1964 | – | 1964 | US |
| The Beach Boys | Kokomo | 1988 | Discogs | 1988 | – | 2013 | US |
| The Beach Boys | Surfin' U.S.A. | 1963 | Spotify + MusicBrainz | 1965 | 1963 | 1963 | US |
| The Beach Boys | Wouldn't It Be Nice | 1966 | Spotify + MusicBrainz | 1968 | 1966 | 1966 | US |
| The Beaches | Blame Brett | 2023 | Discogs + Spotify | 2023 | – | 2023 | CA |
| The Beatles | A Day In The Life | 1967 | Discogs + Spotify | 1967 | – | 1967 | GB |
| The Beatles | A Hard Day's Night | 1964 | Spotify (MusicBrainz: 1984) | 1965 | 1984 | 1964 | GB |
| The Beatles | All My Loving | 1963 | Discogs + Spotify | 1963 | – | 1963 | GB |
| The Beatles | All You Need Is Love | 1967 | Discogs | 1967 | – | 1999 | GB |
| The Beatles | Come Together | 1969 | Discogs + Spotify | 1969 | – | 1969 | GB |
| The Beatles | Eleanor Rigby | 1966 | Discogs | 1966 | – | 1999 | GB |
| The Beatles | Help! | 1965 | Discogs + Spotify | 1965 | – | 1965 | GB |
| The Beatles | Here Comes The Sun | 1969 | Discogs + Spotify | 1969 | – | 1969 | GB |
| The Beatles | Hey Jude | 1968 | Discogs + MusicBrainz+Wikipedia | 1968 | 1968 | 1973 | GB |
| The Beatles | I Want To Hold Your Hand | 1963 | Discogs | 1963 | – | 2000 | GB |
| The Beatles | Lady Madonna | 1968 | Discogs | 1968 | – | 2000 | GB |
| The Beatles | Let It Be | 1970 | Discogs + MusicBrainz+Wikipedia + Spotify | 1970 | 1969 | 1970 | GB |
| The Beatles | Love Me Do | 1962 | Discogs | 1962 | – | 1963 | GB |
| The Beatles | Lucy In The Sky With Diamonds | 1967 | Discogs + Spotify | 1967 | – | 1967 | GB |
| The Beatles | Michelle | 1965 | Discogs + Spotify | 1965 | – | 1965 | GB |
| The Beatles | Now And Then | 2023 | Discogs + Spotify | 2023 | – | 2023 | GB |
| The Beatles | Ob-La-Di, Ob-La-Da | 1968 | Discogs + Spotify | 1968 | – | 1968 | GB |
| The Beatles | She Loves You | 1963 | Discogs + MusicBrainz+Wikipedia | 1963 | 1963 | 1988 | GB |
| The Beatles | Something | 1969 | Spotify (MusicBrainz: 1979) | – | 1979 | 1969 | GB |
| The Beatles | Strawberry Fields Forever | 1967 | Discogs + Spotify | 1967 | – | 1967 | GB |
| The Beatles | The Long And Winding Road | 1970 | Discogs + Spotify | 1970 | – | 1970 | GB |
| The Beatles | Twist And Shout | 1963 | Discogs + Spotify | 1963 | – | 1963 | GB |
| The Beatles | While My Guitar Gently Weeps | 1968 | Discogs + Spotify | 1968 | – | 1968 | GB |
| The Beatles | Yellow Submarine | 1966 | Discogs | 1966 | – | 1999 | GB |
| The Beatles | Yesterday | 1965 | Discogs + MusicBrainz+Wikipedia + Spotify | 1965 | 1965 | 1965 | GB |
| The Bellamy Brothers | Let Your Love Flow | 1975 | MusicBrainz (Spotify: 1976) | 1990 | 1975 | 1976 | US |
| The Beloved | Sweet Harmony | 1992 | Discogs | 1992 | – | 1993 | GB |
| The Black Eyed Peas | I Gotta Feeling | 2009 | MusicBrainz+Wikipedia | – | 2009 | – | US |
| The Black Keys | Lonely Boy | 2011 | Discogs + Spotify | 2011 | – | 2011 | US |
| The Bolshoi | Sunday Morning | 1986 | Discogs + Spotify | 1986 | – | 1986 | GB |
| The Boo Radleys | Wake up Boo! | 1995 | Spotify + MusicBrainz | – | 1995 | 1995 | GB |
| The Boomtown Rats | I Don't Like Mondays | 1979 | Spotify + MusicBrainz | – | 1979 | 1979 | IE |
| The Box Tops | The Letter | 1967 | Spotify + MusicBrainz | – | 1967 | 1967 | US |
| The Breeders | Cannonball | 1993 | Discogs + Spotify | 1993 | – | 1993 | US |
| The Buggles | Video Killed The Radio Star | 1979 | Discogs | 1979 | – | 1980 | GB |
| The Cardigans | Erase / Rewind | 1998 | Discogs + Spotify | 1998 | – | 1998 | SE |
| The Cardigans | Lovefool | 1996 | Discogs + Spotify | 1996 | – | 1996 | SE |
| The Cardigans | My Favourite Game | 1998 | Discogs + Spotify | 1998 | – | 1998 | SE |
| The Cars | Drive | 1984 | Discogs + Spotify | 1984 | – | 1984 | US |
| The Cars | Heartbeat City | 1984 | Discogs + Spotify | 1984 | – | 1984 | US |
| The Charlatans | The Only One I Know | 1990 | Discogs + Spotify | 1990 | – | 1990 | GB |
| The Chemical Brothers | Hey Boy Hey Girl | 1999 | Spotify + MusicBrainz | – | 1999 | 1999 | GB |
| The Chemical Brothers & Q-Tip | Galvanize | 2005 | Discogs + Spotify | 2005 | – | 2005 | GB |
| The Christians | Words | 1989 | Discogs | 1989 | – | 1993 | GB |
| The Church | Under the Milky Way | 1988 | Discogs + Spotify | 1988 | – | 1988 | AU |
| The Clash | London Calling | 1979 | Discogs + Spotify | 1979 | – | 1979 | GB |
| The Clash | Rock the Casbah | 1982 | Discogs + Spotify | 1982 | – | 1982 | GB |
| The Clash | Should I Stay or Should I Go | 1982 | Discogs + Spotify | 1982 | – | 1982 | GB |
| The Connells | '74-'75 | 1993 | Discogs + Spotify | 1993 | – | 1993 | US |
| The Contours | Do You Love Me | 1962 | Discogs + Spotify | 1962 | – | 1962 | US |
| The Cranberries | Animal Instinct | 1999 | Discogs + Spotify | 1999 | – | 1999 | IE |
| The Cranberries | Dreams | 1992 | Discogs | 1992 | – | 1993 | IE |
| The Cranberries | Linger | 1993 | Discogs + Spotify | 1993 | – | 1993 | IE |
| The Cranberries | Ode To My Family | 1994 | Discogs + Spotify | 1994 | – | 1994 | IE |
| The Cranberries | Salvation | 1996 | Discogs + Spotify | 1996 | – | 1996 | IE |
| The Cranberries | When You're Gone | 1996 | Spotify + MusicBrainz | 2017 | 1996 | 1996 | IE |
| The Cranberries | Zombie | 1994 | Discogs + Spotify | 1994 | – | 1994 | IE |
| The Crusaders | Street Life | 1979 | Discogs + Spotify | 1979 | – | 1979 | US |
| The Crystals | Then He Kissed Me | 1963 | Discogs | 1963 | – | 2011 | US |
| The Cult | She Sells Sanctuary | 1985 | Discogs + Spotify | 1985 | – | 1985 | GB |
| The Cure | A Forest | 1980 | Discogs + Spotify | 1980 | – | 1980 | GB |
| The Cure | Boys Don't Cry | 1979 | Spotify (MusicBrainz: 1986) | – | 1986 | 1979 | GB |
| The Cure | Close To Me | 1985 | Discogs + Spotify | 1985 | – | 1985 | GB |
| The Cure | Disintegration | 1989 | Discogs + Spotify | 1989 | – | 1989 | GB |
| The Cure | Friday I'm In Love | 1992 | Spotify + MusicBrainz | 2025 | 1992 | 1992 | GB |
| The Cure | Just Like Heaven | 1987 | Discogs + Spotify | 1987 | – | 1987 | GB |
| The Cure | Lovesong | 1989 | Discogs + Spotify | 1989 | – | 1989 | GB |
| The Cure | Lullaby | 1989 | Discogs | 1989 | – | 1990 | GB |
| The Cure | Pictures Of You | 1989 | Discogs | 1989 | – | 2008 | GB |
| The Cure | The Last Day Of Summer | 2000 | Discogs + Spotify | 2000 | – | 2000 | GB |
| The Cure | The Same Deep Water As You | 1989 | Discogs + Spotify | 1989 | – | 1989 | GB |
| The Dandy Warhols | Bohemian Like You | 2000 | Discogs + Spotify | 2000 | – | 2000 | US |
| The Darkness | I Believe In A Thing Called Love | 2003 | Discogs + Spotify | 2003 | – | 2003 | GB |
| The Dave Brubeck Quartet | Take Five | 1959 | Discogs + Spotify | 1959 | – | 1959 | US |
| The Doobie Brothers | Long Train Runnin' | 1973 | Discogs + Spotify | 1973 | – | 1973 | US |
| The Doobie Brothers | What a Fool Believes | 1978 | Discogs + Spotify | 1978 | – | 1978 | US |
| The Doors | Alabama Song (Whisky Bar) | 1967 | Discogs + Spotify | 1967 | – | 1967 | US |
| The Doors | Break on Through (To the Other Side) | 1967 | Discogs + Spotify | 1967 | – | 1967 | US |
| The Doors | Hello, I Love You | 1968 | Discogs + Spotify | 1968 | – | 1968 | US |
| The Doors | L.A. Woman | 1976 | Discogs | 1976 | – | 2021 | US |
| The Doors | Light My Fire | 1967 | Discogs + MusicBrainz+Wikipedia + Spotify | 1967 | 1967 | 1967 | US |
| The Doors | People Are Strange | 1967 | Discogs + Spotify | 1967 | – | 1967 | US |
| The Doors | Riders on the Storm | 1971 | Discogs + Spotify | 1971 | – | 1971 | US |
| The Doors | The End | 1967 | Discogs + Spotify | 1967 | – | 1967 | US |
| The Dumplings | Ach nie mnie jednej | 2018 | Discogs + MusicBrainz | 2018 | 2018 | 2017 | PL |
| The Dumplings | Betonowy las | 2014 | Discogs + Spotify | 2014 | – | 2014 | PL |
| The Dumplings | Kocham być z tobą | 2015 | Discogs + Spotify | 2015 | – | 2015 | PL |
| The Dumplings | Raj | 2018 | Discogs + Spotify | 2018 | – | 2018 | PL |
| The Emotions | Best of My Love | 1977 | Spotify (MusicBrainz: 1979) | – | 1979 | 1977 | US |
| The Everly Brothers | All I Have to Do Is Dream | 1958 | Discogs | 1958 | – | 1964 | US |
| The Farm | All Together Now | 1990 | Discogs | 1990 | – | 1991 | GB |
| The Flaming Lips | Do You Realize?? | 2002 | Discogs + Spotify | 2002 | – | 2002 | US |
| The Four Seasons | Beggin' | 1967 | Discogs + Spotify | 1967 | – | 1967 | US |
| The Four Seasons | December, 1963 (Oh What a Night!) | 1975 | Discogs + Spotify | 1975 | – | 1975 | US |
| The Go-Betweens | Love Goes On! | 1989 | Discogs | 1989 | – | 2020 | AU |
| The Goo Goo Dolls | Iris | 1998 | Spotify (MusicBrainz: 2004) | – | 2004 | 1998 | ? |
| The Guess Who | American Woman | 1970 | Discogs + Spotify | 1970 | – | 1970 | CA |
| The Hit Crew | Tubthumping (I Get Knocked Down) | 2007 | Spotify | – | – | 2007 | US |
| The Hives | Hate To Say I Told You So | 2000 | Discogs + Spotify | 2000 | – | 2000 | SE |
| The Hollies | The Air That I Breathe | 1974 | Discogs + Spotify | 1974 | – | 1974 | GB |
| The Hooters | All You Zombies | 1983 | Discogs | 1983 | – | 2001 | US |
| The Hooters | Johnny B. | 1987 | Discogs | 1987 | – | 2001 | US |
| The House of Love | Shine On | 1987 | Discogs | 1987 | – | 1990 | GB |
| The Human League | Don't You Want Me | 1981 | Spotify + MusicBrainz | 2005 | 1981 | 1981 | GB |
| The Ides Of March | Vehicle | 1970 | Discogs + Spotify | 1970 | – | 1970 | US |
| The Isley Brothers | Summer Breeze | 1973 | Discogs | 1973 | – | 2001 | US |
| The Isley Brothers | That Lady, Pts. 1 & 2 | 1973 | Spotify (MusicBrainz: 2016) | 1991 | 2016 | 1973 | US |
| The Isley Brothers | Twist And Shout | 1962 | Discogs | 1962 | – | 2005 | US |
| The Jackson 5 | ABC | 1970 | Discogs + Spotify | 1970 | – | 1970 | US |
| The Jackson 5 | I Want You Back | 1969 | Discogs + Spotify | 1969 | – | 1969 | US |
| The Jackson 5 | I'll Be There | 1970 | Spotify + MusicBrainz | 1975 | 1970 | 1970 | US |
| The Jacksons | Blame It on the Boogie | 1978 | Discogs + Spotify | 1978 | – | 1978 | US |
| The Jam | That's Entertainment | 1980 | Spotify + MusicBrainz | 2015 | 1980 | 1980 | GB |
| The Jam | Town Called Malice | 1982 | Discogs + Spotify | 1982 | – | 1982 | GB |
| The Killers | Human | 2008 | Discogs + Spotify | 2008 | – | 2008 | US |
| The Killers | Mr. Brightside | 2001 | Discogs | 2001 | 2003 | 2004 | US |
| The Killers | Somebody Told Me | 2003 | Discogs | 2003 | – | 2004 | US |
| The Kinks | All Day and All of the Night | 1964 | Discogs + Spotify | 1964 | – | 1964 | GB |
| The Kinks | Lola | 1970 | Discogs + Spotify | 1970 | – | 1970 | GB |
| The Kinks | Sunny Afternoon | 1966 | Discogs + Spotify | 1966 | – | 1966 | GB |
| The Kinks | Waterloo Sunset | 1967 | Discogs + Spotify | 1967 | – | 1967 | GB |
| The Kinks | You Really Got Me | 1964 | Discogs + MusicBrainz+Wikipedia + Spotify | 1964 | 1964 | 1964 | GB |
| The Knack | My Sharona | 1979 | Discogs + Spotify | 1979 | – | 1979 | US |
| The Knife | Heartbeats | 2002 | Discogs | 2002 | – | 2003 | SE |
| The La's | There She Goes | 1988 | Discogs | 1988 | – | 1990 | GB |
| The Legendary Pink Dots | Bella Donna | 2010 | Discogs + MusicBrainz | 2010 | 2010 | 1991 | GB |
| The Lemonheads | Mrs. Robinson | 1992 | Discogs + Spotify | 1992 | – | 1992 | US |
| The Libertines | Time for Heroes | 2002 | Discogs + Spotify | 2002 | – | 2002 | GB |
| The Lovin' Spoonful | Summer in the City | 1966 | Discogs + Spotify | 1966 | – | 1966 | US |
| The Lumineers | Ho Hey | 2012 | Discogs + Spotify | 2012 | – | 2012 | US |
| The Lumineers | Ophelia | 2016 | Discogs + Spotify | 2016 | – | 2016 | US |
| The Mamas & The Papas | California Dreamin' | 1965 | Discogs | 1965 | – | 1966 | US |
| The Manhattan Transfer | Chanson d'Amour | 1976 | Spotify + MusicBrainz | – | 1976 | 1976 | US |
| The Marías | No One Noticed | 2024 | Discogs + Spotify | 2024 | – | 2024 | US |
| The Michael Zager Band | Let's All Chant | 1977 | Spotify + MusicBrainz | – | 1977 | 1977 | US |
| The Mission | Butterfly On A Wheel | 1989 | Discogs | 1989 | – | 1990 | GB |
| The Monkees | I'm a Believer | 1966 | MusicBrainz (Spotify: 1967) | 1995 | 1966 | 1967 | US |
| The Moody Blues | Blue World | 1983 | Discogs + Spotify | 1983 | – | 1983 | GB |
| The Moody Blues | Melancholy Man | 1970 | Discogs + Spotify | 1970 | – | 1970 | GB |
| The Moody Blues | Nights In White Satin | 1967 | Discogs | 1967 | – | 2014 | GB |
| The Moody Blues | Your Wildest Dreams | 1986 | Discogs + Spotify | 1986 | – | 1986 | GB |
| The National | Fake Empire | 2007 | Discogs + Spotify | 2007 | – | 2007 | US |
| The National | I Need My Girl | 2013 | Discogs + Spotify | 2013 | – | 2013 | US |
| The Neighbourhood | Daddy Issues | 2015 | Discogs + Spotify | 2015 | – | 2015 | US |
| The Neighbourhood | Sweater Weather | 2012 | Discogs | 2012 | – | 2013 | US |
| The Notorious B.I.G. | Big Poppa | 1994 | MusicBrainz (Spotify: 2007) | – | 1994 | 2007 | US |
| The Notorious B.I.G. | Hypnotize | 1997 | MusicBrainz (Spotify: 2007) | – | 1997 | 2007 | US |
| The Notorious B.I.G. | Juicy | 1994 | MusicBrainz (Spotify: 2007) | – | 1994 | 2007 | US |
| The Notwist | Pilot | 2001 | Discogs | 2001 | – | 2002 | DE |
| The Offspring | Pretty Fly (For A White Guy) | 1998 | Discogs + Spotify | 1998 | – | 1998 | US |
| The Offspring | Self Esteem | 1994 | Discogs + Spotify | 1994 | – | 1994 | US |
| The Offspring | The Kids Aren't Alright | 1998 | Spotify + MusicBrainz | – | 1998 | 1998 | US |
| The Offspring | Why Don't You Get A Job | 1998 | Spotify + MusicBrainz | – | 1998 | 1998 | US |
| The Platters | Only You (And You Alone) | 1955 | Discogs | 1955 | – | 1986 | US |
| The Pointer Sisters | Fire | 1978 | Spotify + MusicBrainz | – | 1978 | 1978 | US |
| The Pointer Sisters | I'm So Excited | 1982 | Spotify + MusicBrainz | – | 1982 | 1982 | US |
| The Police | Can't Stand Losing You | 1978 | Spotify + MusicBrainz | – | 1978 | 1978 | GB |
| The Police | Every Breath You Take | 1983 | Discogs + MusicBrainz+Wikipedia + Spotify | 1983 | 1983 | 1983 | GB |
| The Police | Every Little Thing She Does Is Magic | 1981 | Discogs + Spotify | 1981 | – | 1981 | GB |
| The Police | Message In A Bottle | 1979 | Discogs + Spotify | 1979 | – | 1979 | GB |
| The Police | Roxanne | 1978 | Discogs + Spotify | 1978 | – | 1978 | GB |
| The Police | Walking On The Moon | 1979 | Discogs + Spotify | 1979 | – | 1979 | GB |
| The Police | Wrapped Around Your Finger | 1983 | Discogs + Spotify | 1983 | – | 1983 | GB |
| The Proclaimers | I'm Gonna Be (500 Miles) | 1987 | MusicBrainz (Spotify: 2003) | – | 1987 | 2003 | GB |
| The Prodigy | Breathe | 1996 | Discogs | 1996 | – | 1997 | GB |
| The Prodigy | Firestarter | 1996 | Discogs | 1996 | – | 1997 | GB |
| The Psychedelic Furs | Love My Way | 1982 | Discogs + Spotify | 1982 | – | 1982 | GB |
| The Raconteurs | Steady, As She Goes | 2006 | Discogs + Spotify | 2006 | – | 2006 | US |
| The Rapture | House Of Jealous Lovers | 2002 | Discogs | 2002 | – | 2003 | US |
| The Rembrandts | I'll Be There for You | 1995 | Spotify + MusicBrainz | – | 1995 | 1995 | US |
| The Righteous Brothers | Unchained Melody | 1965 | Discogs + Spotify | 1965 | – | 1965 | US |
| The Rolling Stones | (I Can't Get No) Satisfaction | 1965 | MusicBrainz+Wikipedia + Spotify | 1969 | 1965 | 1965 | GB |
| The Rolling Stones | Angie | 1973 | Discogs + Spotify | 1973 | – | 1973 | GB |
| The Rolling Stones | Anybody Seen My Baby? | 1997 | Discogs + Spotify | 1997 | – | 1997 | GB |
| The Rolling Stones | Brown Sugar | 1971 | Discogs + Spotify | 1971 | – | 1971 | GB |
| The Rolling Stones | Gimme Shelter | 1969 | Spotify (MusicBrainz: 1998) | 1971 | 1998 | 1969 | GB |
| The Rolling Stones | Honky Tonk Women | 1969 | Discogs | 1969 | – | 2019 | GB |
| The Rolling Stones | Miss You | 1978 | Discogs + Spotify | 1978 | – | 1978 | GB |
| The Rolling Stones | Paint It Black | 1966 | Discogs + MusicBrainz+Wikipedia + Spotify | 1966 | 1964 | 1966 | GB |
| The Rolling Stones | Start Me Up | 1981 | Discogs | 1981 | – | 2021 | GB |
| The Rolling Stones | Sympathy For The Devil | 1968 | Discogs + Spotify | 1968 | – | 1968 | GB |
| The Rolling Stones | Time Waits For No One | 1974 | Discogs + Spotify | 1974 | – | 1974 | GB |
| The Rolling Stones | Wild Horses | 1971 | Discogs + Spotify | 1971 | – | 1971 | GB |
| The Rolling Stones | You Can't Always Get What You Want | 1969 | Discogs + Spotify | 1969 | – | 1969 | GB |
| The Ronettes | Be My Baby | 1963 | Discogs | 1963 | – | 1964 | US |
| The Roots & Cody Chesnutt | The Seed (2.0) | 2002 | Spotify + MusicBrainz | – | 2002 | 2002 | US |
| The Roots & Tariq Trotter | You Got Me | 1999 | Spotify + MusicBrainz | – | 1999 | 1999 | US |
| The Rubettes | Sugar Baby Love | 1974 | Discogs | 1974 | – | 1990 | GB |
| The Shadows | Apache | 1960 | Discogs | 1960 | – | 1987 | GB |
| The Smashing Pumpkins | 1979 | 1995 | Discogs + Spotify | 1995 | – | 1995 | US |
| The Smashing Pumpkins | Disarm | 1993 | Discogs | 1993 | – | 2001 | US |
| The Smiths | How Soon Is Now? | 1984 | Discogs + Spotify | 1984 | – | 1984 | GB |
| The Smiths | There Is a Light That Never Goes Out | 1986 | Discogs + Spotify | 1986 | – | 1986 | GB |
| The Smiths | This Charming Man | 1983 | Discogs | 1983 | – | 1984 | GB |
| The Specials | Ghost Town | 1981 | Discogs | 1981 | – | 2000 | GB |
| The Stone Roses | I Wanna Be Adored | 1989 | Discogs + Spotify | 1989 | – | 1989 | GB |
| The Stooges | I Wanna Be Your Dog | 1969 | Discogs + Spotify | 1969 | – | 1969 | US |
| The Stranglers | Always the Sun | 1986 | Discogs | 1986 | – | 1990 | GB |
| The Stranglers | Golden Brown | 1981 | Discogs + Spotify | 1981 | – | 1981 | GB |
| The Stranglers | Midnight Summer Dream | 1982 | Discogs | 1982 | – | 1983 | GB |
| The Streets | Dry Your Eyes | 2004 | Discogs + Spotify | 2004 | – | 2004 | GB |
| The Streets | Weak Become Heroes | 2002 | Discogs + Spotify | 2002 | – | 2002 | GB |
| The Strokes | Last Nite | 2001 | Discogs + Spotify | 2001 | – | 2001 | US |
| The Style Council | Shout To The Top | 1984 | Discogs | 1984 | – | 2006 | GB |
| The Sugarhill Gang | Rapper's Delight | 1979 | MusicBrainz (Spotify: 2000) | – | 1979 | 2000 | US |
| The Sundays | Here's Where the Story Ends | 1990 | Spotify + MusicBrainz | – | 1990 | 1990 | GB |
| The Supremes | Baby Love | 1964 | Discogs + Spotify | 1964 | – | 1964 | US |
| The Supremes | You Can't Hurry Love | 1966 | Spotify + MusicBrainz | – | 1966 | 1966 | US |
| The Teardrop Explodes | Reward | 1981 | Discogs | 1981 | – | 2002 | GB |
| The Temper Trap | Sweet Disposition | 2009 | Discogs + Spotify | 2009 | – | 2009 | AU |
| The Temptations | Papa Was A Rollin' Stone | 1972 | Discogs | 1972 | – | 2000 | US |
| The The | Armageddon Days (Are Here Again) | 1989 | Discogs + Spotify | 1989 | – | 1989 | GB |
| The Ting Tings | That's Not My Name | 2007 | MusicBrainz (Spotify: 2008) | – | 2007 | 2008 | GB |
| The Trammps | Disco Inferno | 1976 | Discogs | 1976 | – | 2016 | US |
| The Trashmen | Surfin' Bird | 1963 | Discogs | 1963 | – | 1987 | US |
| The Triffids | Wide Open Road | 1986 | Discogs | 1986 | – | 2005 | AU |
| The Troggs | Wild Thing | 1966 | Discogs + Spotify | 1966 | – | 1966 | GB |
| The Turtles | Happy Together | 1966 | Discogs | 1966 | – | 1967 | US |
| The Velvet Underground & Nico | Heroin | 1966 | Discogs | 1966 | – | 1967 | US |
| The Velvet Underground & Nico | Sunday Morning | 1966 | Discogs | 1966 | – | 1967 | US |
| The Verve | Bitter Sweet Symphony | 1997 | Discogs + Spotify | 1997 | – | 1997 | GB |
| The Verve | Lucky Man | 1997 | Discogs + Spotify | 1997 | – | 1997 | GB |
| The Vines | Ride | 2004 | Discogs + Spotify | 2004 | – | 2004 | AU |
| The War On Drugs | Under The Pressure | 2014 | Discogs + Spotify | 2014 | – | 2014 | US |
| The Waterboys | The Return Of Pan | 1993 | Discogs + Spotify | 1993 | – | 1993 | GB |
| The Waterboys | The Whole of the Moon | 1985 | Discogs | 1985 | – | 1998 | GB |
| The Weeknd | Blinding Lights | 2019 | MusicBrainz+Wikipedia | 2020 | 2019 | 2020 | CA |
| The Weeknd & Ariana Grande | Save Your Tears | 2020 | Discogs | 2020 | – | 2021 | CA |
| The Weeknd & Daft Punk | I Feel It Coming | 2016 | Discogs | 2016 | – | 2023 | CA |
| The Weeknd & JENNIE | One Of The Girls | 2023 | Discogs + Spotify | 2023 | – | 2023 | CA |
| The Whispers | And the Beat Goes On | 1979 | Discogs + Spotify | 1979 | – | 1979 | US |
| The White Stripes | I Just Don't Know What to Do With Myself | 2002 | MusicBrainz (Spotify: 2003) | 2005 | 2002 | 2003 | US |
| The White Stripes | Icky Thump | 2007 | Discogs + Spotify | 2007 | – | 2007 | US |
| The White Stripes | Seven Nation Army | 2003 | Discogs + Spotify | 2003 | – | 2003 | US |
| The Who | Baba O'Riley | 1971 | Spotify + MusicBrainz | 2006 | 1971 | 1971 | GB |
| The Who | Behind Blue Eyes | 1971 | Discogs + Spotify | 1971 | – | 1971 | GB |
| The Who | My Generation | 1965 | Discogs + Spotify | 1965 | – | 1965 | GB |
| The Who | Who Are You | 1978 | Discogs + Spotify | 1978 | – | 1978 | GB |
| The Who | Won't Get Fooled Again | 1971 | Spotify (MusicBrainz: 1997) | 1982 | 1997 | 1971 | GB |
| The xx | Crystalised | 2009 | Discogs + Spotify | 2009 | – | 2009 | GB |
| The xx | Intro | 2009 | Discogs + Spotify | 2009 | – | 2009 | GB |
| The Yardbirds | Heart Full of Soul | 1965 | Discogs + Spotify | 1965 | – | 1965 | GB |
| The Zombies | She's Not There | 1964 | Discogs (ponowne sprawdzenie) | 1964 | 1975 | 1965 | GB |
| The Zombies | Time of the Season | 1968 | Discogs + Spotify | 1968 | – | 1968 | GB |
| Thelma Houston | Don't Leave Me This Way | 1978 | MusicBrainz (Spotify: 1998) | – | 1978 | 1998 | US |
| Thin Lizzy | Don't Believe A Word | 1976 | Spotify + MusicBrainz | 2020 | 1976 | 1976 | IE |
| Thin Lizzy | The Boys Are Back In Town | 1976 | Discogs + Spotify | 1976 | – | 1976 | IE |
| Thin Lizzy | Whiskey In The Jar | 1977 | Discogs + MusicBrainz | 1977 | 1977 | 1972 | IE |
| Third Eye Blind | Semi-Charmed Life | 1997 | Discogs + Spotify | 1997 | – | 1997 | US |
| This Mortal Coil | Song To The Siren | 1983 | Discogs | 1983 | – | 1984 | GB |
| Tiffany | I Think We're Alone Now | 1987 | Spotify + MusicBrainz | 2011 | 1987 | 1987 | US |
| Tilt | Jeszcze będzie przepięknie | 1996 | Discogs | 1996 | – | 2000 | PL |
| Tilt | Mówię ci, że | 1986 | Discogs | 1986 | – | 2000 | PL |
| Tilt | Nie wierzę politykom | 1990 | Discogs + MusicBrainz | 1990 | 1990 | 2000 | PL |
| Tilt | Runął już ostatni mur | 1985 | Discogs | 1985 | – | 2000 | PL |
| Tilt | Rzeka miłości, morze radości, ocean szczęścia | 1986 | Discogs | 1986 | – | 2000 | PL |
| Tilt | Tak jak ja kocham cię | 2000 | Spotify + MusicBrainz | – | 2000 | 2000 | PL |
| Timbaland & Justin Timberlake | Give It To Me | 2007 | Discogs + Spotify | 2007 | – | 2007 | US |
| Timbaland & Keri Hilson | The Way I Are | 2007 | Discogs + Spotify | 2007 | – | 2007 | US |
| Timbaland & OneRepublic | Apologize | 2007 | Discogs + Spotify | 2007 | – | 2007 | US |
| Tina Turner | Foreign Affair | 1989 | Discogs + Spotify | 1989 | – | 1989 | CH |
| Tina Turner | Goldeneye | 1995 | Discogs + Spotify | 1995 | – | 1995 | CH |
| Tina Turner | Private Dancer | 1984 | Discogs + Spotify | 1984 | – | 1984 | CH |
| Tina Turner | The Best | 1989 | MusicBrainz+Wikipedia + Spotify | – | 1989 | 1989 | CH |
| Tina Turner | We Don't Need Another Hero (Thunderdome) | 1984 | Spotify (MusicBrainz: 1985) | – | 1985 | 1984 | CH |
| Tina Turner | What's Love Got to Do with It | 1984 | Discogs – album „Private Dancer” (1984), utwór na trackliście; wynik automatyczny (box set 1990) był błędny | 1990 | – | 1993 | CH |
| Tina Turner & David Bowie | Tonight | 1985 | MusicBrainz (Spotify: 1988) | – | 1985 | 1988 | CH |
| Titiyo | Come Along | 2001 | Discogs + Spotify | 2001 | – | 2001 | SE |
| Tiësto & Ava Max | The Motto | 2021 | Discogs + MusicBrainz | 2021 | 2021 | 2023 | NL |
| Tiësto & Jonas Blue | Ritual | 2019 | Discogs + MusicBrainz | 2019 | 2019 | 2020 | NL |
| TLC | Waterfalls | 1994 | Discogs + Spotify | 1994 | – | 1994 | US |
| Tom Grennan | Little Bit of Love | 2021 | Discogs + Spotify | 2021 | – | 2021 | GB |
| Tom Jones | Delilah | 1968 | Discogs + Spotify | 1968 | – | 1968 | GB |
| Tom Jones | It's Not Unusual | 1965 | Discogs + Spotify | 1965 | – | 1965 | GB |
| Tom Jones | She's A Lady | 1971 | Spotify + MusicBrainz | 1997 | 1971 | 1971 | GB |
| Tom Jones & Mousse T. | Sexbomb | 1999 | Discogs + Spotify | 1999 | – | 1999 | GB |
| Tom Odell | Another Love | 2013 | Discogs + Spotify | 2013 | – | 2013 | GB |
| Tom Petty | Free Fallin' | 1989 | Discogs + Spotify | 1989 | – | 1989 | US |
| Tom Petty and the Heartbreakers | Into The Great Wide Open | 1991 | Discogs + Spotify | 1991 | – | 1991 | US |
| Tom Waits | Hold On | 1999 | Discogs + Spotify | 1999 | – | 1999 | US |
| Tom Walker | Leave a Light On | 2017 | Discogs + Spotify | 2017 | – | 2017 | GB |
| Tomasz Apanasiuk | Księżycowa prośba | 2025 | Spotify | – | – | 2025 | ? |
| Tommy James & The Shondells | Crimson & Clover | 1968 | Discogs | 1968 | – | 1989 | US |
| Tommy Richman | MILLION DOLLAR BABY | 2024 | Spotify + MusicBrainz | – | 2024 | 2024 | US |
| Tones and I | Dance Monkey | 2019 | Discogs + MusicBrainz+Wikipedia | 2019 | 2019 | – | AU |
| Toni Braxton | Un-Break My Heart | 1996 | Discogs + Spotify | 1996 | – | 1996 | US |
| TOOL | Pneuma | 2019 | Discogs + Spotify | 2019 | – | 2019 | US |
| TOOL | Schism | 2001 | Discogs + Spotify | 2001 | – | 2001 | US |
| TOOL | Sober | 1991 | Discogs | 1991 | – | 1993 | US |
| Toploader | Dancing in the Moonlight | 1999 | Discogs | 1999 | – | 2000 | GB |
| Tori Amos | A Sorta Fairytale | 2002 | Discogs + Spotify | 2002 | – | 2002 | US |
| Tori Amos | Cornflake Girl | 1994 | Discogs + Spotify | 1994 | – | 1994 | US |
| Tori Amos | Winter | 1992 | Discogs | 1992 | – | 2012 | US |
| Toto | Africa | 1982 | MusicBrainz+Wikipedia + Spotify | – | 1982 | 1982 | US |
| TOTO | Georgy Porgy | 1978 | Discogs + Spotify | 1978 | – | 1978 | US |
| TOTO | Hold the Line | 1978 | Discogs + Spotify | 1978 | – | 1978 | US |
| TOTO | Rosanna | 1982 | Discogs + Spotify | 1982 | – | 1982 | US |
| Tove Lo | Habits (Stay High) | 2013 | Discogs | 2013 | – | 2014 | SE |
| Tracy Chapman | Baby Can I Hold You | 1988 | Discogs + Spotify | 1988 | – | 1988 | US |
| Tracy Chapman | Fast Car | 1988 | Discogs + Spotify | 1988 | – | 1988 | US |
| Tracy Chapman | Talkin' Bout a Revolution | 1988 | Discogs + Spotify | 1988 | – | 1988 | US |
| Train | Drive By | 2012 | Discogs + Spotify | 2012 | – | 2012 | US |
| Traks | Long Train Running | 1982 | Discogs | 1982 | – | 2011 | IT |
| Travis | Sing | 2001 | Spotify + MusicBrainz | – | 2001 | 2001 | GB |
| Travis | Why Does It Always Rain On Me? | 1999 | Discogs + Spotify | 1999 | – | 1999 | GB |
| Travis Scott & Playboi Carti | FE!N | 2023 | Spotify + MusicBrainz | – | 2023 | 2023 | US |
| Tribute to Alibabki & Dymoll i Mucha | Grajmy sobie w zielone | 2020 | Spotify | – | – | 2020 | ? |
| Tricky & Martina Topley-Bird | Hell Is Round The Corner | 1995 | Discogs + Spotify | 1995 | – | 1995 | GB |
| Triumph | Lay It On The Line | 1979 | Discogs | 1979 | – | 2010 | CA |
| Trubadurzy | Będziesz ty | 1973 | Discogs | 1973 | – | 2006 | PL |
| Trubadurzy | Krajobrazy | 1968 | Discogs | 1968 | – | 2006 | PL |
| Trubadurzy | Znamy się tylko z widzenia | 1968 | Discogs | 1968 | – | 2006 | PL |
| Trzeci Wymiar | Dla Mnie Masz Stajla | 2003 | Discogs + Spotify | 2003 | – | 2003 | PL |
| TSA | 51 | 1982 | Discogs + Spotify | 1982 | – | 1982 | PL |
| TSA | Alien | 1984 | Discogs + Spotify | 1984 | – | 1984 | PL |
| TSA | Heavy Metal World | 1985 | Discogs + MusicBrainz | 1985 | 1985 | 1984 | PL |
| TSA | Trzy zapałki | 1982 | Discogs | 1982 | – | 1983 | PL |
| Turbo | Dorosłe dzieci | 1983 | Discogs | 1983 | – | 2000 | PL |
| Turbo | Smak ciszy | 1986 | Discogs | 1986 | – | 2009 | PL |
| Twenty One Pilots | Heathens | 2016 | Discogs + Spotify | 2016 | – | 2016 | US |
| Twenty One Pilots | Ride | 2015 | Discogs + Spotify | 2015 | – | 2015 | US |
| Twenty One Pilots | Stressed Out | 2015 | Discogs + Spotify | 2015 | – | 2015 | US |
| Twisted Sister | We're Not Gonna Take It | 1984 | Spotify + MusicBrainz | 2005 | 1984 | 1984 | US |
| Tyla | Water | 2023 | Spotify + MusicBrainz | 2024 | 2023 | 2023 | GB |
| Tymek & C0PIK | Poza kontrolą | 2019 | Spotify + MusicBrainz | – | 2019 | 2019 | PL |
| Tymek & Kuba Karaś | Oczko w głowie | 2020 | Spotify | – | – | 2020 | PL |
| U.S.A. For Africa | We Are The World | 1985 | Discogs + Spotify | 1985 | – | 1985 | US |
| U2 | Beautiful Day | 2000 | Discogs + Spotify | 2000 | – | 2000 | IE |
| U2 | Desire | 1988 | Discogs + Spotify | 1988 | – | 1988 | IE |
| U2 | Hold Me, Thrill Me, Kiss Me, Kill Me | 1995 | Discogs | 1995 | – | 2002 | IE |
| U2 | I Still Haven't Found What I'm Looking For | 1987 | Spotify + MusicBrainz | – | 1987 | 1987 | IE |
| U2 | Love Comes Tumbling | 1985 | Discogs + Spotify | 1985 | – | 1985 | IE |
| U2 | Miss Sarajevo | 2002 | Discogs | 2002 | – | 2006 | IE |
| U2 | New Year's Day | 1983 | Spotify (MusicBrainz: 2018) | – | 2018 | 1983 | IE |
| U2 | One | 1991 | Spotify (MusicBrainz: 2006) | – | 2006 | 1991 | IE |
| U2 | Pride (In The Name Of Love) | 1984 | Discogs | 1984 | – | 1998 | IE |
| U2 | Sunday Bloody Sunday | 1983 | Discogs | 1983 | – | 2006 | IE |
| U2 | The Unforgettable Fire | 1984 | Discogs + Spotify | 1984 | – | 1984 | IE |
| U2 | Walk On | 2000 | Spotify + MusicBrainz | – | 2000 | 2000 | IE |
| U2 | Where The Streets Have No Name | 1987 | Discogs + Spotify | 1987 | – | 1987 | IE |
| U2 | With or Without You | 1987 | Discogs + MusicBrainz+Wikipedia + Spotify | 1987 | 1987 | 1987 | IE |
| UB40 | (I Can't Help) Falling In Love With You | 1993 | Spotify + MusicBrainz | – | 1993 | 1993 | GB |
| UB40 | Red Red Wine | 1983 | Discogs | 1983 | – | 2000 | GB |
| UFO | Belladonna | 1976 | Discogs + Spotify | 1976 | – | 1976 | GB |
| Ugly Kid Joe | Cats In The Cradle | 1992 | Discogs + Spotify | 1992 | – | 1992 | US |
| Ultravox | All Fall Down | 1986 | Discogs + Spotify | 1986 | – | 1986 | GB |
| Ultravox | Dancing with Tears in My Eyes | 1984 | Discogs + Spotify | 1984 | – | 1984 | GB |
| Ultravox | Lament | 1984 | Discogs + Spotify | 1984 | – | 1984 | GB |
| Ultravox | Reap the Wild Wind | 1982 | Discogs + Spotify | 1982 | – | 1982 | GB |
| Ultravox | Vienna | 1980 | Discogs | 1980 | – | 1984 | GB |
| Underworld | Born Slippy (Nuxx) | 1995 | Discogs | 1995 | – | 2014 | GB |
| Uniatowski | 5 rano | 2018 | Discogs + Spotify | 2018 | – | 2018 | PL |
| Uniatowski | Honolulu | 2018 | Discogs + Spotify | 2018 | – | 2018 | PL |
| Urge Overkill | Girl, You'll Be a Woman Soon | 1992 | Spotify + MusicBrainz | – | 1992 | 1992 | US |
| Uriah Heep | Easy Livin' | 1972 | Discogs | 1972 | – | 1989 | GB |
| Uriah Heep | July Morning | 1971 | Discogs | 1971 | – | 2009 | GB |
| Uriah Heep | Lady In Black | 1971 | Discogs | 1971 | – | 2009 | GB |
| Urszula | Dmuchawce, latawce, wiatr | 1983 | Discogs + MusicBrainz+Wikipedia | 1983 | 1983 | 2014 | PL |
| Urszula | Dziś już wiem | 2010 | Discogs + Spotify | 2010 | – | 2010 | PL |
| Urszula | Konik Na Biegunach | 1996 | Discogs | 1996 | – | 2021 | PL |
| Urszula | Luz - Blues, W Niebie Same Dziury | 1983 | Discogs | 1983 | – | 2014 | PL |
| Urszula | Malinowy Król | 1984 | Discogs | 1984 | – | 2014 | PL |
| Urszula | Na Sen | 1996 | Discogs | 1996 | – | 2021 | PL |
| Urszula | Rysa Na Szkle | 1992 | Discogs | 1992 | – | 2021 | PL |
| Urszula Dudziak | Papaya | 1975 | Discogs | 1975 | – | 2009 | PL |
| Urszula Sipinska | Ale nie z tobą | 1971 | Discogs + Spotify | 1971 | – | 1971 | PL |
| Urszula Sipinska | Komu Weselne Dzieci | 1975 | Discogs | 1975 | – | 2014 | PL |
| Urszula Sipinska | Poziomki | 1995 | Discogs | 1995 | – | 2016 | PL |
| Urszula Sipinska | To był świat w zupełnie starym stylu | 1972 | Discogs + Spotify | 1973 | – | 1972 | PL |
| Urszula Sipinska | Zapomniałam twoje oczy | 1971 | Spotify | – | – | 1971 | PL |
| US 3 | Cantaloop | 1992 | Discogs | 1992 | – | 2001 | ? |
| Vampire Weekend | A-Punk | 2007 | Discogs | 2007 | – | 2008 | US |
| Van Halen | Ain't Talkin' 'Bout Love | 1978 | Spotify (MusicBrainz: 1986) | – | 1986 | 1978 | US |
| Van Halen | Hot for Teacher | 1984 | Discogs + Spotify | 1984 | – | 1984 | US |
| Van Halen | Jump | 1983 | Discogs | 1983 | – | 1984 | US |
| Van Halen | Panama | 1984 | Discogs + Spotify | 1984 | – | 1984 | US |
| Van Halen | Runnin' with the Devil | 1978 | Discogs + Spotify | 1978 | – | 1978 | US |
| Van Halen | Why Can't This Be Love | 1986 | Spotify + MusicBrainz | – | 1986 | 1986 | US |
| Van McCoy | The Hustle | 1975 | Discogs + Spotify | 1975 | – | 1975 | US |
| Van Morrison | Brown Eyed Girl | 1967 | Discogs + Spotify | 1967 | – | 1967 | GB |
| Vance Joy | Riptide | 2013 | Discogs | 2013 | – | 2014 | AU |
| Vanessa Paradis | Joe le taxi | 1987 | Discogs + Spotify | 1987 | – | 1987 | FR |
| Vangelis | Chariots Of Fire | 1981 | Discogs | 1981 | – | 2012 | GR |
| Vangelis | Conquest of Paradise | 1992 | Discogs + Spotify | 1992 | – | 1992 | GR |
| Variete | I znowu ktoś przestawił kamienie | 1997 | MusicBrainz (Spotify: 2011) | – | 1997 | 2011 | PL |
| Varius Manx | Maj | 2001 | Discogs + Spotify | 2001 | – | 2001 | PL |
| Varius Manx | Pocaluj noc (Do ciebie) | 1995 | Spotify + MusicBrainz | 2002 | 1995 | 1995 | PL |
| Varius Manx | Zanim Zrozumiesz | 1994 | Discogs | 1994 | – | 2016 | PL |
| Varius Manx & Kasia Stankiewicz | Orła cień | 1996 | Discogs | 1996 | – | 2016 | PL |
| Varius Manx & Kasia Stankiewicz | Piosenka księżycowa | 1994 | Discogs | 1994 | – | 2016 | PL |
| Varius Manx & Kasia Stankiewicz | Zamigotał świat | 1995 | Discogs | 1995 | – | 2016 | PL |
| Varius Manx / Kasia Stankiewicz & Varius Manx | Zanim zrozumiesz | 2016 | Spotify | – | – | 2016 | ? |
| Vavamuffin | Jah Jest Prezydentem | 2005 | Discogs + Spotify | 2005 | – | 2005 | PL |
| Vaya Con Dios | Nah Neh Nah | 1990 | Discogs + Spotify | 1990 | – | 1990 | BE |
| Vaya Con Dios | What's a Woman | 1990 | Spotify + MusicBrainz | 1998 | 1990 | 1990 | BE |
| Venus | Moje jedyne marzenie | 1999 | Discogs | 1999 | – | 2012 | BE |
| Venus | Windą Do Nieba | 1999 | Discogs | 1999 | – | 2012 | BE |
| Video | Środa Czwartek | 2011 | Discogs + Spotify | 2011 | – | 2011 | PL |
| Video & Anna Wyszkoni | Soft | 2008 | Discogs | 2008 | – | 2016 | PL |
| Village People | Go West | 1979 | Discogs + Spotify | 1979 | – | 1979 | US |
| Village People | In The Navy | 1979 | Discogs + Spotify | 1979 | – | 1979 | US |
| Village People | Y.M.C.A. | 1978 | MusicBrainz+Wikipedia + Spotify | – | 1978 | 1978 | US |
| Violent Femmes | Blister In The Sun | 1983 | Discogs + Spotify | 1983 | – | 1983 | US |
| Violetta Villas | Do ciebie mamo | 1964 | Discogs | 1964 | – | 2015 | PL |
| Virgin | 2 Bajki | 2005 | Discogs | 2005 | – | 2006 | PL |
| Virgin | Dzaga | 2004 | Discogs + Spotify | 2004 | – | 2004 | PL |
| Virgin | Znak Pokoju | 2005 | Discogs | 2005 | – | 2006 | PL |
| Visage | Fade To Grey | 1980 | Discogs | 1980 | – | 2010 | GB |
| Vito Bambino | Etna | 2023 | Discogs + Spotify | 2023 | – | 2023 | PL |
| Vito Bambino | Mimo najlepszych chęci | 2026 | Spotify | – | – | 2026 | PL |
| Vito Bambino | Nudy | 2023 | Discogs + MusicBrainz | 2023 | 2023 | 2021 | PL |
| Vito Bambino | Poszło | 2023 | Discogs + MusicBrainz | 2023 | 2023 | 2022 | PL |
| Vito Bambino | Rampage | 2020 | Discogs + Spotify | 2020 | – | 2020 | PL |
| Vito Bambino | Widzimisie | 2023 | Discogs + Spotify | 2023 | – | 2023 | PL |
| Vito Bambino & Zalia | Decyzje | 2026 | Spotify | – | – | 2026 | PL |
| Vixen | Edge Of A Broken Heart | 1988 | Discogs | 1988 | – | 2015 | US |
| Vixen | Kamienie | 2026 | Spotify | – | – | 2026 | US |
| Voo Voo | Gdybym | 2014 | Discogs + Spotify | 2014 | – | 2014 | PL |
| Voo Voo | Jak Gdyby Nigdy Nic | 1998 | MusicBrainz (Spotify: 2015) | – | 1998 | 2015 | PL |
| Voo Voo | Nabroilo Sie | 2001 | Discogs + Spotify | 2001 | – | 2001 | PL |
| Voo Voo | Nim Stanie Sie Tak, Jak Gdyby Nigdy Nic Nie Bylo | 1994 | Discogs + MusicBrainz | 1994 | 1994 | 2006 | PL |
| Voo Voo & Anna Maria Jopek | Moja Broń | 2003 | Discogs | 2003 | – | 2021 | PL |
| Voo Voo & Maciej Maleńczuk | Wszyscy muzycy to wojownicy | 2021 | Discogs + Spotify | 2021 | – | 2021 | PL |
| Voo Voo & Męskie Granie Orkiestra | Flota Zjednoczonych Sił | 1993 | Discogs | 1993 | – | 2020 | PL |
| VOX | A gdyby tak | 1980 | Discogs | 1980 | – | 2003 | PL |
| VOX | Bananowy song | 1980 | Discogs | 1980 | – | 2003 | PL |
| VOX | Masz w oczach dwa nieba | 1980 | Discogs | 1980 | – | 2003 | PL |
| W.A.S.P. | Wild Child | 1985 | Discogs + Spotify | 1985 | – | 1985 | US |
| Waglewski Fisz Emade | Ojciec | 2013 | Discogs + Spotify | 2013 | – | 2013 | ? |
| WALK THE MOON | Shut Up and Dance | 2014 | Discogs + Spotify | 2014 | – | 2014 | US |
| Walter Murphy | A Fifth Of Beethoven | 1976 | Discogs | 1976 | – | 1977 | US |
| WaluśKraksaKryzys & Błażej Król | TUŻ PRZED PÓŁNOCĄ | 2021 | Discogs + Spotify | 2021 | – | 2021 | PL |
| Wanda i Banda | Hi-Fi | 2003 | Spotify (MusicBrainz: 2005) | – | 2005 | 2003 | PL |
| Wanda i Banda | Nie Będę Julią | 1998 | MusicBrainz (Spotify: 2003) | – | 1998 | 2003 | PL |
| Wanda Warska | Ptaku mojego serca | 1975 | Spotify | – | – | 1975 | PL |
| Wang Chung | Dance Hall Days | 1983 | Discogs | 1983 | – | 1984 | GB |
| War | Low Rider | 1975 | Discogs + Spotify | 1975 | – | 1975 | US |
| Warhaus | Love's a Stranger | 2017 | Discogs + Spotify | 2017 | – | 2017 | BE |
| Warrant | Cherry Pie | 1990 | Discogs + Spotify | 1990 | – | 1990 | US |
| Warrant | Heaven | 1989 | Discogs + Spotify | 1989 | – | 1989 | US |
| Warrant | Uncle Tom's Cabin | 1990 | Spotify + MusicBrainz | – | 1990 | 1990 | US |
| Weezer | Buddy Holly | 1994 | Spotify + MusicBrainz | 1995 | 1994 | 1994 | US |
| Weezer | Island In The Sun | 2001 | Discogs + Spotify | 2001 | – | 2001 | US |
| Wet Wet Wet | Love Is All Around | 1994 | Discogs | 1994 | – | 1995 | GB |
| Wham! | Last Christmas | 1984 | MusicBrainz (Spotify: 2019) | – | 1984 | 2019 | GB |
| Wham! | Wake Me Up Before You Go-Go | 1984 | Spotify + MusicBrainz | – | 1984 | 1984 | GB |
| Wheatus | Teenage Dirtbag | 2000 | Discogs + MusicBrainz | 2000 | 2000 | 1999 | US |
| White Lion | Wait | 1987 | Discogs | 1987 | – | 2010 | US |
| White Town | Your Woman | 1997 | Discogs + Spotify | 1997 | – | 1997 | GB |
| Whitesnake | Here I Go Again | 1982 | Discogs | 1982 | – | 1987 | GB |
| Whitesnake | Is This Love | 1987 | Discogs + Spotify | 1987 | – | 1987 | GB |
| Whitesnake | Still Of The Night | 1987 | Discogs + Spotify | 1987 | – | 1987 | GB |
| Whitney Houston | How Will I Know | 1985 | Discogs + Spotify | 1985 | – | 1985 | US |
| Whitney Houston | I Have Nothing | 1992 | Spotify + MusicBrainz | 1993 | 1992 | 1992 | US |
| Whitney Houston | I Wanna Dance with Somebody (Who Loves Me) | 1987 | Discogs + MusicBrainz+Wikipedia + Spotify | 1987 | 1987 | 1987 | US |
| Whitney Houston | I Will Always Love You | 1992 | Discogs + MusicBrainz+Wikipedia + Spotify | 1992 | 1992 | 1992 | US |
| Whitney Houston | One Moment in Time | 1988 | Discogs | 1988 | – | 2021 | US |
| Wiesław Gołas | W polskę idziemy | 1998 | MusicBrainz (Spotify: 2014) | – | 1998 | 2014 | PL |
| Wiktor Waligóra | To jest to! | 2026 | Spotify + MusicBrainz | – | 2026 | 2026 | PL |
| Wiktor Waligóra & Wiktor Dyduła | Ciągle znajduję twoje ubrania | 2026 | Spotify + MusicBrainz | – | 2026 | 2026 | PL |
| Wild Cherry | Play That Funky Music | 1976 | Discogs + Spotify | 1976 | – | 1976 | US |
| Wilki | Baśka | 2002 | Discogs + MusicBrainz+Wikipedia | 2002 | 2002 | 2003 | PL |
| Wilki | Bohema | 2004 | Discogs | 2004 | – | 2005 | PL |
| Wilki | Eli Lama Sabachtani | 1992 | Discogs + Spotify | 1992 | – | 1992 | PL |
| Wilki | Eroll | 1992 | Discogs | 1992 | – | 2018 | PL |
| Wilki | Na zawsze i na wieczność | 2006 | Spotify + MusicBrainz | – | 2006 | 2006 | PL |
| Wilki | Slonce pokonal cień | 2004 | Discogs | 2004 | – | 2019 | PL |
| Wilki | Son of the Blue Sky | 1992 | Discogs + MusicBrainz+Wikipedia + Spotify | 1992 | 1992 | 1992 | PL |
| Wilki | Urke | 2002 | Discogs | 2002 | – | 2003 | PL |
| Will Smith | Men In Black | 1997 | Discogs + Spotify | 1997 | – | 1997 | US |
| will.i.am & Britney Spears | Scream & Shout | 2013 | Spotify + MusicBrainz | – | 2013 | 2013 | US |
| WILLOW | Wait a Minute! | 2015 | Spotify + MusicBrainz | – | 2015 | 2015 | US |
| Wilson Phillips | Hold On | 1990 | Discogs + Spotify | 1990 | – | 1990 | US |
| Winger | Seventeen | 1988 | Discogs + Spotify | 1988 | – | 1988 | US |
| Wings | Live And Let Die | 1973 | Discogs | 1973 | – | 1978 | GB |
| Wings | Mull Of Kintyre | 1977 | Discogs | 1977 | – | 1978 | GB |
| Wishbone Ash | Everybody Needs A Friend | 1973 | Discogs + Spotify | 1973 | – | 1973 | GB |
| Wishbone Ash | Persephone | 1974 | Discogs + Spotify | 1974 | – | 1974 | GB |
| Within Temptation | Memories | 2004 | Discogs + Spotify | 2004 | – | 2004 | NL |
| WizTheMc & bees & honey | Show Me Love | 2025 | Spotify + MusicBrainz | 2026 | 2025 | 2025 | DE |
| Wojciech Baranowski | Czułe miejsce | 2019 | Spotify | – | – | 2019 | ? |
| Wojciech Baranowski | Lubię być z nią | 2020 | Spotify | – | – | 2020 | ? |
| Wojciech Gassowski | Tak mi źle - Tylko wróć | 2015 | Spotify | – | – | 2015 | PL |
| Wojciech Młynarski | Absolutnie | 1975 | Discogs | 1975 | – | 2014 | PL |
| Wojciech Młynarski | Bynajmniej | 1968 | Discogs | 1968 | – | 2014 | PL |
| Wojciech Młynarski | Dziewczyny bądźcie dla nas dobre na wiosnę | 1968 | Discogs | 1968 | – | 2014 | PL |
| Wojciech Młynarski | Jesteśmy na wczasach | 1966 | Discogs | 1966 | – | 1967 | PL |
| Wojciech Młynarski | Jeszcze w zielone gramy | 1990 | Discogs | 1990 | – | 2019 | PL |
| Wojciech Młynarski | Lubię wrony | 1979 | Discogs | 1979 | – | 2014 | PL |
| Wojciech Młynarski | Moje ulubione drzewo | 1990 | Discogs | 1990 | – | 2014 | PL |
| Wojciech Młynarski | Nie ma jak u mamy | 1980 | Discogs | 1980 | – | 2014 | PL |
| Wojciech Młynarski | Róbmy swoje | 1987 | Discogs | 1987 | – | 2014 | PL |
| Wojciech Młynarski | Żniwna dziewczyna | 1966 | Discogs | 1966 | – | 2014 | PL |
| Wolna Grupa Bukowina | Majster Bieda | 1990 | Discogs | 1990 | – | 1999 | PL |
| Wolna Grupa Bukowina | Sielanka o domu | 1990 | Discogs | 1990 | – | 1999 | PL |
| Wu-Tang Clan | C.R.E.A.M. (Cash Rules Everything Around Me) | 1993 | Spotify + MusicBrainz | – | 1993 | 1993 | US |
| Wu-Tang Clan | Protect Ya Neck | 1992 | Discogs | 1992 | – | 1993 | US |
| Włodzimierz Korcz & Alicja Majewska | Być kobietą | 2006 | Spotify | – | – | 2006 | PL |
| Włodzimierz Korcz & Alicja Majewska | Jeszcze się tam żagiel bieli | 2006 | Spotify | – | – | 2006 | PL |
| Włodzimierz Korcz & Alicja Majewska | Odkryjemy miłość nieznaną | 1987 | Discogs | 1987 | – | 2006 | PL |
| Włodzimierz Votka | To Byly Piekne Dni | 2011 | Spotify | – | – | 2011 | ? |
| X Ambassadors | Renegades | 2015 | Discogs + Spotify | 2015 | – | 2015 | US |
| X Ambassadors | Unsteady | 2014 | Discogs | 2014 | – | 2015 | US |
| XTC | Dear God | 1986 | Discogs | 1986 | – | 1987 | GB |
| XYZ | Inside Out | 1989 | Discogs | 1989 | – | 2011 | US |
| Y&T | Summertime Girls | 1985 | Discogs | 1985 | – | 1990 | US |
| Yazoo | Don't Go | 1981 | MusicBrainz (Spotify: 1982) | – | 1981 | 1982 | GB |
| Yazoo | Happy People | 1983 | Discogs + Spotify | 1983 | – | 1983 | GB |
| Yazoo | Only You | 1982 | Discogs + Spotify | 1982 | – | 1982 | GB |
| Yeah Yeah Yeahs | Heads Will Roll | 2009 | Discogs + Spotify | 2009 | – | 2009 | US |
| Yeah Yeah Yeahs | Maps | 2003 | Discogs + Spotify | 2003 | – | 2003 | US |
| Yello | The Race | 1988 | Discogs | 1988 | – | 1992 | CH |
| Yes | Close to the Edge (i. The Solid Time of Change, ii. Total Mass Retain, iii. I Get up I Get Down, iv. Seasons of Man) | 1972 | Discogs + Spotify | 1972 | – | 1972 | GB |
| Yes | Going for the One | 1977 | Discogs + Spotify | 1977 | – | 1977 | GB |
| Yes | Into the Lens | 1980 | Discogs + Spotify | 1980 | – | 1980 | GB |
| Yes | Owner Of A Lonely Heart | 1983 | Discogs + Spotify | 1983 | – | 1983 | GB |
| Yes | Roundabout | 1971 | Discogs + Spotify | 1971 | – | 1971 | GB |
| Yes | Soon | 1975 | Discogs + MusicBrainz | 1975 | 1975 | 1974 | GB |
| Yes | Wonderous Stories | 1977 | Discogs | 1977 | – | 1981 | GB |
| Young Leosia | Wyspy | 2021 | Discogs + MusicBrainz | 2021 | 2021 | 2020 | PL |
| Youssou N'Dour & Neneh Cherry | 7 Seconds | 1994 | Discogs | 1994 | – | 2004 | SN |
| Yugopolis & Maciej Maleńczuk | Ostatnia Nocka | 2011 | Discogs + Spotify | 2011 | – | 2011 | PL |
| Yugoton & Kazik | Malcziki | 2001 | Discogs | 2001 | – | 2011 | PL |
| Yugoton & Pawel Kukiz | O nic nie pytaj (bo nie pytam ja) | 2001 | Discogs | 2001 | – | 2011 | PL |
| Yusuf / Cat Stevens | Lady D'Arbanville | 2020 | Spotify | – | – | 2020 | ? |
| Yusuf / Cat Stevens | Morning Has Broken | 2021 | Spotify | – | – | 2021 | ? |
| Yusuf / Cat Stevens | Wild World | 1970 | Spotify | 2020 | – | 1970 | ? |
| Zach Bryan | Something in the Orange | 2022 | Discogs + Spotify | 2022 | – | 2022 | US |
| Zach Bryan & Kacey Musgraves | I Remember Everything | 2023 | Discogs + Spotify | 2023 | – | 2023 | US |
| Zakopower | Boso | 2011 | Discogs + MusicBrainz+Wikipedia + Spotify | 2011 | 2011 | 2011 | PL |
| Zalia | daj mi znak | 2026 | Spotify | – | – | 2026 | PL |
| Zalia | tylko kochaj mnie | 2026 | Spotify | – | – | 2026 | PL |
| Zara Larsson | Lush Life | 2015 | Discogs | 2015 | – | 2017 | SE |
| Zara Larsson | Midnight Sun | 2025 | Discogs + Spotify | 2025 | – | 2025 | SE |
| ZAYN & Sia | Dusk Till Dawn | 2017 | Discogs + Spotify | 2017 | – | 2017 | GB |
| ZAYN & Taylor Swift | I Don’t Wanna Live Forever (Fifty Shades Darker) | 2016 | Discogs | 2016 | – | 2017 | GB |
| Zaz | Je veux | 2010 | Discogs + Spotify | 2010 | – | 2010 | FR |
| Zaz | Si jamais j'oublie | 2015 | Spotify + MusicBrainz | – | 2015 | 2015 | FR |
| Zbigniew Preisner & Andrzej Sikorowski | Wielka woda | 2010 | Discogs + Spotify | 2010 | – | 2010 | PL |
| Zbigniew Wodecki | Izolda | 1992 | Discogs | 1992 | – | 2004 | PL |
| Zbigniew Wodecki | Lubię wracać tam gdzie byłem | 1992 | Discogs | 1992 | – | 2004 | PL |
| Zbigniew Wodecki | Opowiadaj mi tak | 1992 | Discogs | 1992 | – | 2004 | PL |
| Zbigniew Wodecki | Rzuć to wszystko co złe | 1976 | Discogs + Spotify | 1976 | – | 1976 | PL |
| Zbigniew Wodecki | Wspomnienia tych dni | 1999 | Discogs | 1999 | – | 2006 | PL |
| Zbigniew Wodecki | Zacznij od Bacha | 1977 | Discogs | 1977 | – | 2004 | PL |
| Zbigniew Wodecki & Mitch & Mitch | Rzuć Wszystko Co Złe | 1976 | Discogs | 1976 | – | 2015 | PL |
| Zbigniew Zamachowski & Grupa MoCarta | Kobiety jak te kwiaty | 2011 | Discogs + Spotify | 2011 | – | 2011 | PL |
| Zdzisława Sośnicka & Zbigniew Wodecki | Z tobą chcę oglądać świat | 1997 | Discogs | 1997 | – | 2004 | PL |
| Zespół Dziecięcy Fasolki | Mydło lubi zabawę | 2015 | Spotify | – | – | 2015 | ? |
| Ziyo | Magiczne Słowa | 1994 | Discogs + Spotify | 1994 | – | 1994 | PL |
| Zoe Wees | Control | 2020 | Spotify + MusicBrainz | 2021 | 2020 | 2020 | DE |
| Zucchero | Baila (Sexy Thing) | 2001 | Discogs + Spotify | 2001 | – | 2001 | IT |
| Zucchero | Diamante | 1989 | Discogs + Spotify | 1989 | – | 1989 | IT |
| Zucchero & Paul Young | Senza Una Donna - Without A Woman | 1991 | Discogs | 1991 | – | 2004 | IT |
| ZZ Top | Blue Jean Blues | 1975 | Discogs + Spotify | 1975 | – | 1975 | US |
| ZZ Top | Gimme All Your Lovin' | 1983 | Spotify + MusicBrainz | – | 1983 | 1983 | US |
| ZZ Top | La Grange | 1973 | Discogs + Spotify | 1973 | – | 1973 | US |
| ZZ Top | Rough Boy | 1985 | Discogs + Spotify | 1985 | – | 1985 | US |
| ZZ Top | Sharp Dressed Man | 1983 | Spotify + MusicBrainz | – | 1983 | 1983 | US |
| Édith Piaf | La Vie en rose | 1947 | Discogs | 1947 | – | 2008 | FR |
| Édith Piaf | Milord | 1959 | Discogs | 1959 | – | 1986 | FR |
| Édith Piaf | Non, je ne regrette rien | 1960 | Discogs | 1960 | – | 1991 | FR |
| Ørganek | ØNA & Nosowska | Kochana | 2018 | Spotify | – | – | 2018 | PL |
| Łona I Webber | Błąd | 2016 | Discogs + Spotify | 2016 | – | 2016 | PL |
| Łona I Webber | Wyślij Sobie Pocztówkę | 2014 | Spotify + MusicBrainz | – | 2014 | 2014 | PL |
| Łucja Prus | Dookoła Noc Się Stała | 1974 | Discogs | 1974 | – | 2014 | PL |
| Łucja Prus | Nic dwa razy się nie zdarza | 1974 | Discogs | 1974 | – | 2015 | PL |
| Łukasz Zagrobelny | Życie na czekanie | 2007 | Discogs | 2007 | – | 2015 | PL |
| ŁZY Adam Konkol | Agnieszka | 2023 | Spotify | – | – | 2023 | PL |
| Łąki Łan | LASS | 2019 | Spotify + MusicBrainz | – | 2019 | 2019 | PL |
