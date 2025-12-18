import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCK1sYFxfagqWYXF_inVcVIEqWDikrwa9c",
  authDomain: "oncode-d4d30.firebaseapp.com",
  projectId: "oncode-d4d30",
  storageBucket: "oncode-d4d30.firebasestorage.app",
  messagingSenderId: "980831695207",
  appId: "1:980831695207:web:3e864fefdc5f37e97fffc2",
  measurementId: "G-Q8ZDLJQNRB"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export { db, auth, storage, app };
