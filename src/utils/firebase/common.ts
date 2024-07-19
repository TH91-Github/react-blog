import { UserDataType } from "types/baseType";
import { fireDB, collection, doc, getDocs, setDoc, query, where } from "../../firebase";

// 추가
export const pushDataDoc = async(docName:string, collectionName:string, data:UserDataType) => {
  const userCollection = collection(fireDB, 'thData', docName, collectionName);
  const newUserDoc = doc(userCollection);
  const newUserId = newUserDoc.id;
  data.id = newUserId; // doc 랜덤 id 추가
  await setDoc(newUserDoc, data);
} 

// document name, 하위 collection name, 비교 key - id, email 등, 비교할 value
export const duplicateDoc = async(docName:string, collectionName:string, key:string, val:string) :Promise<boolean>=> {
  // 문서 필드 내 id 값 찾기
  const queryDuplicate = collection(fireDB, 'thData', docName, collectionName);
  const duplicatResult = query(queryDuplicate, where(key, '==', val));
  const querySnapshot = await getDocs(duplicatResult);
  return querySnapshot.empty
}

   