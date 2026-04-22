# 🛵 scooter-goose 🪿

En enkel länksamling byggd med Express.js. Spara, visa och ta bort webbläsarbokmärken via ett REST API med en HTML-frontend.

## Funktioner

- Lägg till länkar med titel, URL och valfri kategori
- Lista alla sparade länkar
- Ta bort länkar
- Data sparas i en lokal JSON-fil mellan körningar
- Felhantering med tydliga meddelanden i frontend

## Teknik

- [Express.js](https://expressjs.com/) – webbserver och REST API
- [dotenv](https://www.npmjs.com/package/dotenv) – konfiguration via miljövariabler
- Vanilla HTML och JavaScript i frontend
- `node:fs/promises` för fillagring

## Kom igång

### Krav

- Node.js 18 eller senare
- npm

### Installation

```bash
git clone https://github.com/ditt-användarnamn/scooter-goose.git
cd scooter-goose
npm install
```

### Konfiguration

Kopiera `.env.example` till `.env`:

```bash
cp .env.example .env
```

`.env` innehåller:

```
PORT=3000
NODE_ENV=development
```

### Starta servern

```bash
npm start
```

Eller med automatisk omstart vid filändringar:

```bash
npm run dev
```

Öppna `http://localhost:3000` i webbläsaren.

## API

| Metod  | Route          | Beskrivning                  |
| ------ | -------------- | ---------------------------- |
| GET    | /api/links     | Hämta alla sparade länkar    |
| POST   | /api/links     | Lägg till en ny länk         |
| DELETE | /api/links/:id | Ta bort en länk med givet id |

### POST /api/links

Request body:

```json
{
	"title": "MDN Web Docs",
	"url": "https://developer.mozilla.org",
	"category": "Dokumentation"
}
```

`title` och `url` är obligatoriska. `category` är valfritt och får standardvärdet `Övrigt`.

## Projektstruktur

```
scooter-goose/
  public/
    index.html      – HTML-frontend
  .env.example      – mall för miljövariabler
  .gitignore
  package.json
  README.md
  server.js         – Express-server och API
```

## Licens

MIT
