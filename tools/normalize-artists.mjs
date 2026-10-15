// Ujednolicenie zapisu wykonawców w songs.js, songs-sp.js i facts.js (klucze „wykonawca|tytuł”).
// Zamiany dotyczą całych nazw wykonawców (części rozdzielone „ & ” albo całego pola a / ma).
// Uruchomienie: node tools/normalize-artists.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const MAP = {
  // ta sama nazwa zapisana różnie – zapis oficjalny (strona wykonawcy / Wikipedia)
  'Made In Poland': 'Made in Poland', 'KAT': 'Kat', 'KULT': 'Kult', 'Chłopcy Z Placu Broni': 'Chłopcy z Placu Broni',
  'Ira': 'IRA', 'Kazik Na Żywo': 'Kazik na Żywo', 'GOLEC UORKIESTRA': 'Golec uOrkiestra', 'TEDE': 'Tede',
  'Blue Cafe': 'Blue Café', 'Pin': 'PIN', 'Strachy Na Lachy': 'Strachy na Lachy', 'ENEJ': 'Enej',
  "Sound n' Grace": "Sound'n'Grace", 'Sanah': 'sanah', 'Bambi': 'bambi', 'MODELKI': 'Modelki', 'TOTO': 'Toto',
  'Tears For Fears': 'Tears for Fears', "GIGI D'AGOSTINO": "Gigi D'Agostino", 'Outkast': 'OutKast', 'JAŸ-Z': 'Jay-Z',
  'Black Eyed Peas': 'The Black Eyed Peas', 'MIKA': 'Mika', 'Empire Of The Sun': 'Empire of the Sun',
  'Sunstroke Project': 'SunStroke Project', 'Charli xcx': 'Charli XCX', 'felix jaehn': 'Felix Jaehn', 'Zayn': 'ZAYN',
  'Keiino': 'KEiiNO', 'THE ROOP': 'The Roop', 'the Roop': 'The Roop', 'Twocolors': 'twocolors', 'Katseye': 'KATSEYE',
  'Noon': 'NOON', 'przyłu': 'Przyłu', 'Schafter': 'schafter', 'Oki': 'OKI', 'Marketa Irglova': 'Markéta Irglová',
  'Panic! At The Disco': 'Panic! at the Disco', 'Abradab / GrubSon': 'Abradab & Grubson', 'SMOLIK / KEV FOX': 'Smolik & Kev Fox',
  'Kool & the Gang': 'Kool & The Gang', 'Katrina & the Waves': 'Katrina & The Waves',
  // ten sam wykonawca pod różnymi nazwami
  'Niemen': 'Czesław Niemen', 'Soyka': 'Stanisław Soyka', 'Kazik Staszewski': 'Kazik', 'Anna Rusowicz': 'Ania Rusowicz',
  'Dwa plus Jeden': '2 plus 1', 'Banda i Wanda': 'Wanda i Banda', 'Grzegorz Z Ciechowa': 'Grzegorz z Ciechowa',
  // brakujące polskie znaki
  'Andrzej Dabrowski': 'Andrzej Dąbrowski', 'Emilian Kaminski': 'Emilian Kamiński', 'Miro Kepinski': 'Miro Kępiński', 'Antonina Krzyszton': 'Antonina Krzysztoń', 'Bohdan Lazuka': 'Bohdan Łazuka',
  'Dorota Miskiewicz': 'Dorota Miśkiewicz', 'Dzamble': 'Dżamble', 'Elzbieta Wojnowska': 'Elżbieta Wojnowska',
  'Formacja Niezywych Schabuff': 'Formacja Nieżywych Schabuff', 'Halina Frackowiak': 'Halina Frąckowiak',
  'Jacek Bonczyk': 'Jacek Bończyk', 'Jan Kanty Pawluskiewicz': 'Jan Kanty Pawluśkiewicz', 'Janusz Iwanski': 'Janusz Iwański',
  'Janusz Iwanski "yanina"': 'Janusz Iwański', 'Kalina Jedrusik': 'Kalina Jędrusik', 'Kabaret Starszych Panow': 'Kabaret Starszych Panów',
  'Leszek Kaminski': 'Leszek Kamiński', 'Maciej Malenczuk z zespolem Psychodancing': 'Maciej Maleńczuk & Psychodancing',
  'Marek Bilinski': 'Marek Biliński', 'Mietek Szczesniak': 'Mietek Szcześniak', 'Mira Kubasinska': 'Mira Kubasińska',
  'Pawel Kukiz': 'Paweł Kukiz', 'Przemyslaw Gintrowski': 'Przemysław Gintrowski', 'Robert Gawlinski': 'Robert Gawliński',
  'Stanislaw Wenglorz': 'Stanisław Wenglorz', 'Swiernalis': 'Świernalis', 'Swietliki': 'Świetliki', 'Sylwia Wisniewska': 'Sylwia Wiśniewska',
};

const fix = (a) => {
  if (MAP[a]) return MAP[a];
  return a.split(' & ').map((p) => MAP[p] || p).join(' & ').split(' & ')
    .filter((p, i, arr) => arr.indexOf(p) === i).join(' & '); // bez powtórzeń („Macklemore & Ryan Lewis & Macklemore”)
};
const fixKey = (k) => { const i = k.indexOf('|'); return i < 0 ? k : fix(k.slice(0, i)) + k.slice(i); };

const dir = new URL('..', import.meta.url);
let n = 0;
// songs.js – pola a i ma
const songsFile = new URL('songs.js', dir);
const songs = readFileSync(songsFile, 'utf8').replace(/\b(a|ma): "((?:[^"\\]|\\.)*)"/g, (m, f, v) => {
  const old = JSON.parse(`"${v}"`);
  const nv = fix(old);
  if (nv === old) return m;
  n += 1;
  return `${f}: ${JSON.stringify(nv)}`;
});
writeFileSync(songsFile, songs);
// songs-sp.js i facts.js – klucze obiektów
for (const name of ['songs-sp.js', 'facts.js']) {
  const file = new URL(name, dir);
  const src = readFileSync(file, 'utf8').replace(/"((?:[^"\\]|\\.)*)":/g, (m, v) => {
    const old = JSON.parse(`"${v}"`);
    const nv = old.includes('|') ? fixKey(old) : fix(old);
    return nv === old ? m : `${JSON.stringify(nv)}:`;
  });
  writeFileSync(file, src);
}
console.log(`zmienione pola wykonawców w songs.js: ${n}`);
