import { collection, doc, getDoc } from "firebase/firestore"
import { fireDB } from "../../firebase"

export interface DocumentType {
  name: string
  phone: string
  email: string
  company: CompanyType[]
}

export interface CompanyType {
  name: string
  entry: string
  resignation: string
}

export const firebaseGetDoc = async (collectionType : string, docType: string):Promise<DocumentType | null> => {
  const db = collection(fireDB, collectionType)
  const docRef = doc(db, docType);
  const data = await getDoc(docRef);
  if (data.exists()) {
    return data.data() as DocumentType
  } else {
    console.log('document ❌');
    return null;
  }
}
