import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { firebaseApp } from "./app";

export const auth: Auth = getAuth(firebaseApp);

export const googleProvider = new GoogleAuthProvider();
