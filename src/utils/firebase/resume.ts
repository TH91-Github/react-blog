import { doc, getDoc } from "firebase/firestore";
import { fireDB } from "../../firebase";

// ✅ thData - user data
const baseDB = process.env.REACT_APP_DB ?? '';
const docName = 'resume';

// 유저 정보 가져오기 - 필드
export const resumeGetDataDoc = async () => {
  const docRef = doc(fireDB, baseDB, docName);
  const userDoc = await getDoc(docRef);
  if (userDoc.exists()) {
      return userDoc.data();
  } else {
      return null
  }
}
