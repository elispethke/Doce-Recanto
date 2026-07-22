import { getStorage, type FirebaseStorage } from "firebase/storage";
import { firebaseApp } from "./app";

// Preparado para uso futuro (upload de imagens de produtos, fotos de motoristas etc).
// O bucket já existe no projeto Firebase, mas nenhuma feature usa Storage ainda.
export const storage: FirebaseStorage = getStorage(firebaseApp);
