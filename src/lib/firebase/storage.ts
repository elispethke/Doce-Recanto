import { getStorage, type FirebaseStorage } from "firebase/storage";
import { adminApp } from "./admin/app";

// Preparado para uso futuro (upload de imagens de produtos, fotos de motoristas
// etc — tudo isso é gerenciado pelo admin). O bucket já existe no projeto
// Firebase, mas nenhuma feature usa Storage ainda.
export const storage: FirebaseStorage = getStorage(adminApp);
