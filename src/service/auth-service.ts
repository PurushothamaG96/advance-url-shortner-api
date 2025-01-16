import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { firebaseConfig } from "../config/firebase";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export async function registerUser(email: string, password: string) {
  const user = await createUserWithEmailAndPassword(auth, email, password);
  return user;
}

export async function loginUser(email: string, password: string) {
  const user = await signInWithEmailAndPassword(auth, email, password);
  return user;
}
