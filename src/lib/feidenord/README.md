FeideStats.svelte er en visualiseringskomponent som viser statistikk for Feide-bruk (innloggingstjeneste for norske skoler).
Her er hvordan den fungerer:

Hovedfunksjonalitet

1. Data inn:

   - markers: Array med kommunedata (kommune, innlogginger, tjenester, elever)
   - mapsK/mapsF: GeoJSON-data for kommuner og fylker
   - label: Fylkesnavn som vises

2. Visualiseringselementer:

Kolonnestruktur (venstre til høyre):

- Kart: Lite fylkeskart med kommunen markert
- Elever: Antall elever (tall)
- Kommune: Kommunenavn
- Tjenester: Visualisert som små sirkler i et rutenett (SBox-klassen)
- Per elev: Sirkel hvor størrelse = innlogginger per elev
- Innlogginger: Punktdiagram på logaritmisk skala

Nøkkelkomponenter:

SBox-klassen (linje 28-46):

- Lager et rutenett for å vise antall tjenester
- Hver tjeneste = én liten sirkel
- Arrangert i kolonner på 4 høyde

Skalaer:

- x2Scale: Logaritmisk skala for innlogginger (bedre for store variasjoner)
- circleAreaScale: Kvadratrotskala for sirkler (areal proporsjonal med verdi)
- yScale: Lineær plassering av kommuner vertikalt

Farger:

- Alternerer mellom 3 fargepar for hver kommune
- Bruker dark() og light() funksjoner for konsistent fargebruk

Databehandling:

- smarkers: Ekspanderer hver kommune til individuelle tjeneste-sirkler
- legendmarkers: Lager forklaringselementer for sirkelstørrelser

Komponenten gir en omfattende oversikt over Feide-bruk per kommune med både numerisk og visuell representasjon av dataene.
