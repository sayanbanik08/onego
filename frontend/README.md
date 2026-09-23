# Onego React Native

Onego has been converted from Flutter/Dart to Expo React Native with TypeScript.

## Run

```bash
cd frontend
npm install
npx expo start
```

The conversion preserves the original splash, authentication entry, landscape dashboard, skill carousel, branded cards, glowing navigation dock, and Onego visual language. Authentication currently keeps the original guest flow; wire your Clerk React Native/Expo credentials into `App.tsx` when ready.
