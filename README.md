# DataWise — Baza POS FMCG

Interaktywna strona produktowa z zakładkami.

## Uruchomienie lokalne

```bash
npm install
npm run dev
# → http://localhost:5173
```

## Deploy na Vercel

Projekt jest już zlinkowany z projektem Vercel `datawise-pos` (katalog `.vercel/`).

### Opcja A — Vercel CLI (najszybciej)
```bash
npm install
npx vercel          # deploy preview
npx vercel --prod   # deploy produkcyjny (przepina alias prod)
```
Nowy deploy dziedziczy zmienne środowiskowe ze scope **Production** danego projektu — patrz sekcja niżej.

### Opcja B — GitHub + Vercel (zalecane do produkcji)
1. Wrzuć projekt na GitHub:
   ```bash
   git init && git add . && git commit -m "init"
   gh repo create datawise-pos --public --push
   ```
2. Wejdź na [vercel.com](https://vercel.com) → **Add New Project**
3. Importuj repo → kliknij **Deploy**
4. Vercel automatycznie redeploy-uje przy każdym `git push`

### Opcja C — przeciągnij folder na Vercel
1. Zbuduj projekt: `npm run build`
2. Wejdź na [vercel.com/new](https://vercel.com/new)
3. Przeciągnij folder `dist/` na stronę

## Zmienne środowiskowe (formularz kontaktowy)
Formularz w zakładce „Próbka & Kontakt" korzysta z funkcji serverless `api/contact.js`,
która wysyła maila przez SMTP. Ustaw w Vercel (**Settings → Environment Variables**, scope
**Production**) — `.env.local` działa tylko lokalnie i nie jedzie na Vercel:

| Zmienna | Opis |
|---|---|
| `SMTP_HOST` | serwer SMTP (domyślnie `smtp.home.pl`) |
| `SMTP_PORT` | port (domyślnie `465`) |
| `SMTP_USER` | login skrzynki |
| `SMTP_PASS` | hasło skrzynki |
| `SMTP_TO`   | odbiorca zapytań (domyślnie `info@datawise.pl`) |

Po zmianie zmiennych wykonaj ponowny deploy.

## Struktura
```
src/
  App.jsx           # logika + komponenty zakładek
  translations.js   # WSZYSTKIE treści (PL/EN) — tu edytujesz teksty
  styles.js         # cały CSS jako string GLOBAL_CSS
  main.jsx          # punkt wejścia React
api/
  contact.js        # serverless: wysyłka formularza przez SMTP
public/assets/
  data-sample-new.geojson  # próbka danych do mapy w zakładce „Przykład"
  DataWise_logo.png
index.html
vite.config.js
vercel.json
```

## Personalizacja
- **Treści** (statystyki, opisy, etykiety, kontakt) — `src/translations.js`, obiekt `T` z kluczami `pl` i `en`.
- **Wygląd** — `src/styles.js` (zmienne kolorów w `:root`).
- **Dane mapy** — `public/assets/data-sample-new.geojson`; markery kodują profil klienta (kształt) i affinity ruchu (kolor).
