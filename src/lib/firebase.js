import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD_M7PcngnRh6NDcd04DKNfORQ1JjUDMtc",
  authDomain: "inkmind-6aeac.firebaseapp.com",
  projectId: "inkmind-6aeac",
  storageBucket: "inkmind-6aeac.firebasestorage.app",
  messagingSenderId: "152558314367",
  appId: "1:152558314367:web:7d2c71bb963f946b67f04a"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
