import { getFirestore, type Firestore } from "firebase/firestore";
import { customerApp } from "./app";

export const customerDb: Firestore = getFirestore(customerApp);
