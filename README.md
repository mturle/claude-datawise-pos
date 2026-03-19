# DataWise — Baza POS FMCG

Interaktywna strona produktowa z zakładkami.

## Uruchomienie lokalne

```bash
npm install
npm run dev
# → http://localhost:5173
```

## Deploy na Vercel

### Opcja A — Vercel CLI (najszybciej)
```bash
npm install
npx vercel
# Odpowiedz na 3 pytania → gotowy publiczny URL
```

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

## Struktura
```
src/
  App.jsx      # cała aplikacja (dane + komponenty)
  main.jsx     # punkt wejścia React
index.html
vite.config.js
vercel.json
```

## Personalizacja
Wszystkie treści (statystyki, opisy, kontakt) znajdziesz w sekcji `Data` na górze pliku `src/App.jsx`.
Zaktualizuj email i numer telefonu w komponencie `TabKontakt`.
