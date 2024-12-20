import { arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { UserBookmarkType, UserDataType, UserListDataType } from "types/baseType";
import { fireDB } from "../../firebase";

// ✅ thData - user data
const baseDB = process.env.REACT_APP_DB ?? '';
const docUser = 'userData';
const colUser = 'users';

// 유저 정보 가져오기 - 필드
export const userGetDataDoc = async () => {
  const docRef = doc(fireDB, baseDB, docUser);
  const userDoc = await getDoc(docRef);
  if (userDoc.exists()) {
      return userDoc.data();
  } else {
      return null
  }
}

// user 추가
export const userPushDataDoc = async(data:UserDataType) => {
  const userCollection = collection(fireDB, baseDB, docUser, colUser);
  const newUserDoc = doc(userCollection);
  const newUserId = newUserDoc.id;
  data.id = newUserId; // doc 랜덤 id 추가
  try {
    // 유저 리스트 및 승인 관련 데이터
    const userItemData = {
      id: data.id,
      email: data.email,
      nickName: data.nickName,
      signupTime: data.signupTime,
      uid: data.uid,
      rank: data.rank,
      permission: false,
      profile: '-',
    };
    // Firestore에 새 유저 데이터 추가
    await setDoc(newUserDoc, data);

    // 비승인 목록 및 기존 유저 목록에 업데이트
    const docRef = doc(fireDB, baseDB, docUser);
    await updateDoc(docRef, {
      checkUser: arrayUnion(userItemData), // 비승인
      userList: arrayUnion(userItemData), // 가입 유저 리스트
    });
  } catch (error) {
    console.error("사용자 리스트 추가 오류 발생..", error);
  }
}

interface userDataDocType {
  removeList?: UserListDataType[]
  checkUser?: UserListDataType[];
  userList?:UserListDataType[];
}
// 유저 승인/불허 필드 업데이트
export const userDataDocUpdate = async (data:userDataDocType) => {
  const docRef = doc(fireDB, baseDB, docUser);
  try {
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      const currentData = docSnapshot.data();
      const updateData = {
        ...currentData,
        removeList: data?.removeList || currentData.removeList,
        checkUser: data.checkUser || currentData.checkUser,
        userList: data.userList || currentData.userList
      }
      await updateDoc(docRef, updateData);
    }else{
      console.error("문서가 존재하지 않습니다.");
    }
  } catch (error) {
    console.error("유저 목록 업데이트 오류 발생", error);
  }
};

// 유저 개인 정보 업데이트
export const userDocUpdate = async<T>(
  docId:string, upDatakey:string, updateData: T,
) => {
  const queryUpdateRef = collection(fireDB, baseDB, docUser, colUser);
  const upDateDoc = doc(queryUpdateRef, docId);
  try{
    const upDateSnap = await getDoc(upDateDoc);
    if(upDateSnap.exists()){
      const data = upDateSnap.data();
      const changeData = { ...data, [upDatakey]:updateData}; // upDatakey 변경 key val : 변경 data
      await updateDoc(upDateDoc, changeData);
    }else{
      console.log('upDate document를 찾지 못했어요. 😢')
    }
  }catch(error){
    console.error('유저 개인 정보 업데이트 오류')
  }
}

// 유저 개인정보 삭제
export const userDocRemove = async(docID:string) => {
  try{
    const findUserDocRef = doc(fireDB, baseDB, docUser, colUser, docID);
    await deleteDoc(findUserDocRef);
  }catch(error){
    console.error('정보 삭제를 실패했어요.. 😢 '+error)
  }
}