import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCl2W7B8I4P_udUJGI6f8wL3NBt4KF71FY",
  authDomain: "teslaa-50dd0.firebaseapp.com",
  projectId: "teslaa-50dd0",
  storageBucket: "teslaa-50dd0.firebasestorage.app",
  messagingSenderId: "410167268264",
  appId: "1:410167268264:web:181346cd2a5e71dd31439d",
  measurementId: "G-8M69RT28J4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Analytics is optional and only works in browser environments
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { app, auth, analytics };
