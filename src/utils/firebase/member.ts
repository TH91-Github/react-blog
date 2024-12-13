import { fireDB, firebaseStorage } from "../../firebase";
import { arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { UserBookmarkType, UserDataType } from "types/baseType";

// ✅ thData - user data
const baseDB = process.env.REACT_APP_DB ?? '';

// user 추가
export const userPushDataDoc = async(
  docName:string, collectionName:string, data:UserDataType, defaultBase:string = baseDB
) => {
  const userCollection = collection(fireDB, defaultBase, docName, collectionName);
  const newUserDoc = doc(userCollection);
  const newUserId = newUserDoc.id;
  data.id = newUserId; // doc 랜덤 id 추가
  try{
    await setDoc(newUserDoc, data);
    userPermissionUpdate(docName, data)
  }catch(error){
    console.log(error)
    return false;
  }
}

// 유저 승인/불허 필드 업데이트
export const userPermissionUpdate = async(
  docName:string, data:UserDataType
) => {
  const docRef = doc(fireDB, baseDB, docName);
  // 추가할 데이터 
  const userItemData = {
    id: data.id,
    email:data.email,
    time:data.signupTime,
    uid:data.uid
  }
  try {
    // 유저 목록과 비승인 계정 확인을 위해
    await updateDoc(docRef, {
      checkUser: arrayUnion(userItemData),
      userList: arrayUnion(userItemData),
    });
  } catch (error) {
    console.error("유저 목록 업데이트 오류 발생", error);
  }
}

// 즐겨찾기 필드 데이터 변경
export const userListsUpdatge = async(
  docName:string, collectionName:string, docId:string, upDatakey:string, updateData: string | UserBookmarkType[],
) => {
  const queryUpdateRef = collection(fireDB, baseDB, docName, collectionName);
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