# MadRedder

MadRedder er en mobilapp (Expo + React Native) udviklet som eksamensprojekt i **Innovation og Ny Teknologi**. Appen gør overskudsmad fra virksomhedskantiner, såsom _Compass Group_, _ISS_,og _Coor_, synlig og nem at reservere for medarbejdere, samtidig med at kantinen får et simpelt værktøj til at oprette og administrere dagens “Lykkeposer”, (retter).

## Funktioner i prototypen

**Medarbejder**
- Opret bruger og log ind (Firebase Auth)
- Tilknyt arbejdsplads via 4-cifret arbejdspladskode (locID)
- Se tilbud for din lokation (Firestore query filtreret på locID)
- Reserver “Lykkepose” (qty reduceres med Firestore transaction)
- Se egne reserverede tilbud (gemmes lokalt i appen via AsyncStorage)

**Kantinepanel**
- Adgang til kantinepanel for brugere med `role: "canteen"`, i FireBase
- Opret, redigér og slet tilbud (title, price, qty, pickup-window, items)
- Tilbud knyttes til kantinens `locID`

**Profil**
- Opdatér telefonnummer
- Skift password
- Slet bruger

## Teknologi

- Expo + React Native
- React Navigation (Native Stack)

- `.env` via `dotenv` og `app.config.js` (Firebase keys eksponeres som `expo.extra`. .env filen vil blive afleveret og/eller linket i rapporten)

## Start projektet:

### 1) Installer afhængigheder
```bash
npm install

### 2) Start expo
```bash
npx expo start -c