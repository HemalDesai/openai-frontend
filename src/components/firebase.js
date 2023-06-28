import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBaEycfi782c_wB5fvvHS5-nDMs-srN-xg",
  authDomain: "assignment-23c7c.firebaseapp.com",
  projectId: "assignment-23c7c",
  storageBucket: "assignment-23c7c.appspot.com",
  messagingSenderId: "188202144721",
  appId: "1:188202144721:web:6a3de1ac93dcfb1beb06f0",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);

export { auth, database, app, storage };
