# F.C. Kannetje — website

Kleine one-page website voor straatvoetbalteam F.C. Kannetje.
Gewoon HTML, CSS en JavaScript: geen build-stap, geen frameworks en geen backend.

```
index.html      → alle teksten, selectie, uitslagen
style.css       → kleuren, lettertypes, layout, animaties
script.js       → rollende bal, schop-animatie, cursor, scroll-effecten
assets/img/     → logo en foto's
```

## 1. Lokaal openen

Dubbelklik op `index.html`. De site opent dan in je browser.

Krijg je een lokale server, bijvoorbeeld met VS Code en de extensie *Live Server*? Dan werkt dat ook.

## 2. Naar GitHub uploaden

1. Ga naar https://github.com/new en maak een repository aan (bijv. `fc-kannetje`). Zet hem op **Public**.
2. Klik op **"uploading an existing file"**.
3. Sleep deze bestanden en mappen erin:
   - `index.html`
   - `style.css`
   - `script.js`
   - `README.md`
   - de map `assets`
4. Klik op **Commit changes**.

(De map `.claude` hoeft niet mee. Die is alleen voor de lokale preview.)

## 3. GitHub Pages aanzetten

1. Ga in je repository naar **Settings → Pages**.
2. Kies bij *Source*: **Deploy from a branch**.
3. Kies branch **main** en map **/ (root)**, en klik op **Save**.
4. Na 1–2 minuten staat de site op `https://<jouw-gebruikersnaam>.github.io/fc-kannetje/`.

## 4. Inhoud aanpassen

Alles staat in `index.html`. Zoek op de teksten tussen blokhaken `[ ... ]`. Dat zijn de placeholders:

| Placeholder | Waar | Wat |
|---|---|---|
| `[KORTE TEKST OVER HET TEAM …]` | sectie *Team* | 2–3 zinnen over het team. Haal daarna ook de class `placeholder-text` weg. |
| `[TEAMFOTO]`, `[ACTIEFOTO]` | fotostrip | Vervang het hele `<figure class="strip__item strip__item--empty">`-blok door een kopie van een blok mét foto. |
| `[TEGENSTANDER]`, `[DATUM]`, `[TIJD]`, `[VELD]` | kaart *Volgende wedstrijd* | De eerstvolgende wedstrijd. |
| `[UITSLAG]` | kaart *Speeldag 6* | Vul de score in op de plekken van de `–` en geef de kaart `is-win`, `is-draw` of `is-loss`. |

**Uitslagen.** Elke wedstrijd is één `<li class="card ...">`. Kopieer een kaart om er een toe te voegen. De gekleurde streep zet je met:
`is-win` (geel), `is-draw` (grijs), `is-loss` (rood) of `is-pending` (gestippeld).
Werk daarna ook het scorebord bij (`board__num`: gewonnen / gelijk / verloren / doelpunten).

**Selectie.** Staat onder `<!-- Squad 2026 -->`. Elk `<li><b>nummer</b>Naam</li>` is één speler.

**Foto's.** Zet nieuwe foto's in `assets/img/` en pas het `src="..."` in `index.html` aan.
- Gebruik JPG of WebP, liefst maximaal ~1600px breed en onder de 300 KB.
- `assets/img/team.jpg` is ook de grote achtergrond in de hero. Een scherpere versie (bijv. 1600×2000) maakt veel verschil, want de huidige komt van Instagram en is maar 512px breed.
- `assets/img/logo.jpg` is het logo (nu 150px, van Instagram). Heb je het origineel als PNG of SVG? Vervang het dan en pas de `.jpg`-verwijzingen in `index.html` aan.

**Kleuren.** Bovenaan `style.css` onder `:root`: `--yellow`, `--asphalt` (zwart) en `--chalk` (wit).

**Route van de rollende bal.** In `script.js` bij `const route = [...]`. `p` is hoe ver je gescrold hebt (0 = boven, 1 = onder), en `x`/`y` is de positie op het scherm (0–1).

## Goed om te weten

- Bij *Verminder beweging* (reduced motion) in het besturingssysteem verdwijnt de rollende bal en staan alle andere animaties stil.
- Op touchscreens schiet de speler één keer vanzelf zodra hij in beeld komt. Daarna werkt het met een tik.
- Op computers met een muis verschijnt een eigen cursor die verandert in "GO", "VOLG" of "SHOOT".
- Alle paden zijn relatief, dus de site werkt op GitHub Pages zonder aanpassingen.
