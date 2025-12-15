// scripts/seedOffers.mjs
// Client-baseret seeding (respekterer Firestore rules). Kræver at dine regler tillader write til offers.
import { config as loadEnv } from "dotenv";
loadEnv();

import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// locID kan angives som første CLI-argument, ellers fallback til 1234
const locID = process.argv[2] || "1234";

const offers = [
  { id: "1", title: "Pastaboks", items: ["Pasta", "Tomatsauce", "Salat"], price: 15, pickup: "15:30-16:30", qty: 3 },
  { id: "2", title: "Vegetarboks", items: ["Grønt", "Hummus", "Brød"], price: 12, pickup: "15:30-16:00", qty: 0 },
  { id: "3", title: "Smørrebrød mix", items: ["Æg/rejer", "Frikadelle", "Kartoffel"], price: 20, pickup: "14:45-15:30", qty: 6 },
  { id: "4", title: "Suppe + brød", items: ["Tomatsuppe", "Flüte"], price: 10, pickup: "15:00-16:00", qty: 4 },
  { id: "5", title: "Salatbowl", items: ["Kylling", "Quinoa", "Dressing"], price: 18, pickup: "15:15-16:15", qty: 2 },
  { id: "6", title: "Wokboks", items: ["Nudler", "Grøntsager", "Soja"], price: 16, pickup: "15:20-16:20", qty: 5 },
  { id: "7", title: "Lasagne", items: ["Oksekød", "Ost", "Salat"], price: 22, pickup: "15:30-16:30", qty: 1 },
  { id: "8", title: "Dessertboks", items: ["Cheesecake", "Frugt"], price: 8, pickup: "15:30-16:00", qty: 7 },
];

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed() {
  console.log(`Seeding offers for locID=${locID} ...`);
  await Promise.all(
    offers.map((o) =>
      setDoc(doc(db, "offers", o.id), {
        ...o,
        price: Number(o.price),
        qty: Number(o.qty),
        locID,
        active: true,
        createdAt: serverTimestamp(),
      })
    )
  );
  console.log("Done.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
