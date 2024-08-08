import { UserBookmarkType, UserDataType } from "types/baseType";
import { collection, deleteDoc, doc, fireDB, getDoc, getDocs, query, setDoc, updateDoc, where } from "../../firebase";

// ✅ thData 기본
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
  // 문서 필드 내 key(id, email 등)값 조회
  const queryDuplicate = collection(fireDB, 'thData', docName, collectionName);
  const duplicatResult = query(queryDuplicate, where(key, '==', val));
  const querySnapshot = await getDocs(duplicatResult);
  return querySnapshot.empty
}

// key, val 비교 및 조회 후 가져오기
export const duplicateGetDoc = async(docName:string, collectionName:string, key:string, val:string) :Promise<null | UserDataType>=> {
  // 문서 필드 내 key(id, email 등)값 조회
  const queryGetDocRef = collection(fireDB, 'thData', docName, collectionName);
  const getDocResult = query(queryGetDocRef, where(key, '==', val));
  const querySnapshot = await getDocs(getDocResult);
  if (!querySnapshot.empty) {// 정보가 있을 경우
    const docId = querySnapshot.docs[0].id; // 조건에 맞는 첫 번째 문서의 ID 가져오기
    const findUserDocRef = doc(queryGetDocRef, docId); // queryGetDocRef 기준 하위 컬렉션 필드 값
    const userDocSnap = await getDoc(findUserDocRef); // 필드 id 가져온 값
    
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data() as UserDataType; // UserDataType으로 타입 재선언
      return userData;
    } else {
      return null; // 하위 컬렉션 id에 맞는 필드가 없는 경우 반환
    }
  } else { // 정보가 없는 경우 null
    return null;
  }
}

// 필드 데이터 변경
export const collectionDocUpdate = async(docName:string, collectionName:string, docId:string, upDatakey:string, updateData: string | UserBookmarkType[]) => {
  const queryUpdateRef = collection(fireDB, 'thData', docName, collectionName);
  const upDateDoc = doc(queryUpdateRef, docId);
  const upDateSnap = await getDoc(upDateDoc);

  if(upDateSnap.exists()){
    const data = upDateSnap.data();
    const changeData = { ...data, [upDatakey]:updateData}; // upDatakey 변경 key val : 변경 data
    await updateDoc(upDateDoc, changeData);
  }else{
    console.log('upDate document를 찾지 못했어요. 😢')
  }
}

// 필드 id 찾은 후 삭제
export const removeDoc = async(docName:string, collectionName:string, emailId:string) => {
  const queryRemoveRef = collection(fireDB, 'thData', docName, collectionName);
  const removeDocResult = query(queryRemoveRef, where('email', '==', emailId));
  const querySnapshot = await getDocs(removeDocResult);

  if (!querySnapshot.empty){ 
    const docId = querySnapshot.docs[0].id;
    const findUserDocRef = doc(queryRemoveRef, docId);
    await deleteDoc(findUserDocRef);
  }else{
    console.log('정보 삭제를 실패했어요.. 😢')
  }
}





const TEST = async (docName: string, collectionName: string, subCollectionName: string, key: string, val: string): Promise<boolean> => {
  // 문서 내 컬렉션 경로 설정
  const docRef = doc(fireDB, 'map', docName);
  const subCollectionRef = collection(docRef, collectionName, subCollectionName);
  
  // 쿼리 설정
  const duplicatResult = query(subCollectionRef, where(key, '==', val));
  
  // 쿼리 실행
  const querySnapshot = await getDocs(duplicatResult);
  
  // 결과 반환
  return querySnapshot.empty;
}
