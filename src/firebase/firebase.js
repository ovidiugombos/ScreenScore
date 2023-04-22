import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDD62X88__q9QGQkGAfSPeN-0WmL5FHtHs",
  authDomain: "screenscore-89794.firebaseapp.com",
  projectId: "screenscore-89794",
  storageBucket: "screenscore-89794.appspot.com",
  messagingSenderId: "317607165150",
  appId: "1:317607165150:web:d177359e8f99059668164f",
  measurementId: "G-92TDM8BFVL",
};

const app = initializeApp(firebaseConfig);

export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
