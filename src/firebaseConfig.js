import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB3VAlJjA0e2xGytNF5_u4n0PLKhwc_oXQ",

  authDomain: "fullstackproject-bdd9b.firebaseapp.com",

  projectId: "fullstackproject-bdd9b",

  appId: "1:182068037581:web:4a012bf1a1d738b85e2684",

};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
