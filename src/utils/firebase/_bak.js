import { collection, deleteDoc, doc, getCountFromServer, getDoc, getDocs, limit, orderBy, query, runTransaction, setDoc, startAfter, updateDoc, where } from "firebase/firestore";
import { storeWeatherDB, studyDB } from "../../firebase";
import { locationCategory } from "../kakaomap";

const defaultCollection = 'react';
// document name, 하위 collection name, 비교 key - id, email 등, 비교할 value
 const duplicateDoc = async(docName, collectionName, key, val) => {
  // 문서 필드 내 key(id, email 등)값 조회
  const queryDuplicate = collection(studyDB, defaultCollection, docName, collectionName);
  const duplicatResult = query(queryDuplicate, where(key, '==', val));
  const querySnapshot = await getDocs(duplicatResult);
  return querySnapshot.empty
}
// 추가 
 const pushDataDoc = async(docName, collectionName, data) => {
  const userCollection = collection(studyDB, defaultCollection, docName, collectionName);
  const newUserDoc = doc(userCollection);
  const newUserId = newUserDoc.id;
  data.id = newUserId; // doc 랜덤 id 추가
  await setDoc(newUserDoc, data);
  return data;
}

// key, val 비교 및 조회 후 가져오기
 const duplicateGetDoc = async(docName, collectionName, key, val)=> {
  // 문서 필드 내 key(id, email 등)값 조회
  const queryGetDocRef = collection(studyDB, defaultCollection, docName, collectionName);
  const getDocResult = query(queryGetDocRef, where(key, '==', val));
  const querySnapshot = await getDocs(getDocResult);
  if (!querySnapshot.empty) {// 정보가 있을 경우
    const docId = querySnapshot.docs[0].id; // 조건에 맞는 첫 번째 문서의 ID 가져오기
    const findUserDocRef = doc(queryGetDocRef, docId); // queryGetDocRef 기준 하위 컬렉션 필드 값
    const userDocSnap = await getDoc(findUserDocRef); // 필드 id 가져온 값
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data()
      return userData;
    } else {
      return null; // 하위 컬렉션 id에 맞는 필드가 없는 경우 반환
    }
  } else { // 정보가 없는 경우 null
    return null;
  }
}

// 필드 id 찾은 후 삭제 - login
 const removeIDDoc = async(docName, collectionName, emailId) => {
  const queryRemoveRef = collection(studyDB, defaultCollection, docName, collectionName);
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

 const collectionDocList = async(docName, collectionName) => {
  const collectionRef = collection(studyDB, defaultCollection, docName, collectionName);
  const collectionSnapshot = await getDocs(collectionRef);
  const docList = [];

  console.log(collectionRef)
  if (collectionSnapshot.empty) { // 컬렉션 또는 문서가 없을 경우
    return null;
  }
  collectionSnapshot.forEach((docItem) => { // 2 detpth collection > doc 목록
    docList.push(docItem.data())
  })
  return docList;
}

// 여러 필드가 있는 경우 날짜별로 가져오기 및 startAfter, limit 활용 끊어서 가져오기
 const listDateQueryDoc = async (docName, collectionName, lastDoc, loadSize) => {
  const collectionRef = collection(studyDB, defaultCollection, docName, collectionName);
  const getPageNum= loadSize ?? 5;
  const querySort = lastDoc
    ? query( // 불러온 마지막에서 + 5  
        collectionRef,
        orderBy('update', 'desc'),
        startAfter(lastDoc),
        limit(getPageNum+1)
      )
    : query( // 처음 불러오는 경우
        collectionRef,
        orderBy('update', 'desc'),
        limit(getPageNum+1)
      );
  const documentSnapshots = await getDocs(querySort);
  if (documentSnapshots.empty) {
    console.log('더 이상 문서가 없습니다.');
    return { docs: [], lastDoc: null, size:0 }; // 데이터가 없으면 lastDoc을 null로 반환
  }
  const listsDocs = documentSnapshots.docs.map(doc => doc.data());
  // 👇 
  const trimmedDocs = listsDocs.slice(0, getPageNum);  
  const lastVisibleDoc = documentSnapshots.docs.length > loadSize ? documentSnapshots.docs[loadSize - 1] : null;
  const queryDoc = query(collectionRef, orderBy('update', 'desc'));  // 5개 아닌 전체 문서 수를 가져오기 위함.
  const queryDocSnapshot = await getCountFromServer(queryDoc); // getCountFromServer 문서 개수만 반환할 수 있다. getDocs일 경우 문서 수만큼 요청 비용이 발생하기 때문.
  const queryDocSize = queryDocSnapshot.data().count;

  return { docs: trimmedDocs, lastDoc: lastVisibleDoc, size:queryDocSize };
};

// blog detail 정보 가져오기
 const blogDetailDoc = async (docName, collectionName, detailDocId) => {
  const blogDetailRef = collection(studyDB, defaultCollection, docName, collectionName);
  const blogDetailDoc = doc(blogDetailRef, detailDocId); // 문서 id 접근
  const blogDocSnap = await getDoc(blogDetailDoc);
  if(blogDocSnap.exists()){
    const data = blogDocSnap.data()
    return data
  }else{
    return null
  }
}

// blog 컬렉션 글 DOC 삭제
 const removeBlogDoc = async(docName, collectionName, findDocID, chkUid) => {
  const blogRef = collection(studyDB, defaultCollection, docName, collectionName);
  const blogDoc = doc(blogRef,findDocID); // blog 컬렉션 > 문서
  const blogSnapshot = await getDoc(blogDoc); 
  if(blogSnapshot.exists()){
    const docData = blogSnapshot.data(); 
    if (docData.auth === chkUid) {
      await deleteDoc(blogDoc); // 해당 BLOG 글(문서) 삭제
    }else{
      console.log('글 삭제는 작성자만 할 수 있습니다.')
      // throw new Error("글 삭제는 작성자만 할 수 있습니다.");
    }
  }else{
    console.log('blog 글이 없습니다.')
    // throw new Error("blog 글이 없습니다.");
  }
}
 const removeBlogPreviewAllDoc = async(docName, collectionName, findDocID, chkUid) => {
  const queryRemoveRef = collection(studyDB, defaultCollection, docName, collectionName);
  const removeDocResult = query(queryRemoveRef, where('blogDocId', '==', findDocID));
  const querySnapshot = await getDocs(removeDocResult);
  if (!querySnapshot.empty){ 
    const blogPreviewDoc = doc(queryRemoveRef,querySnapshot.docs[0].id);
    const blogPreviewSnapshot = await getDoc(blogPreviewDoc); 
    if(blogPreviewSnapshot.exists()){
      const docData = blogPreviewSnapshot.data(); 
      if (docData.auth === chkUid) {
        await deleteDoc(blogPreviewDoc);
      }else{
        console.log('등록한 계정과 다른 계정!!')
      }
    }else{
      console.log('해당 글이 없어요.');
    }
  }else{
    console.log('정보 삭제를 실패했어요.. 😢')
  }
}

// blog 컬렉션 글 DOC 업데이트
 const updateBlogDoc = async(docName, collectionName, findDocID, chkUid, newData) => {
  const {title,text,update} = newData
  const blogRef = collection(studyDB, defaultCollection, docName, collectionName);
  const blogDoc = doc(blogRef,findDocID);
  const blogSnapshot = await getDoc(blogDoc); 
  if(blogSnapshot.exists()){
    const docData = blogSnapshot.data(); 
    const changeData = {...docData, title, text, update} // 업데이트 및 추가
    if (docData.auth === chkUid) {
      await updateDoc(blogDoc, changeData);
    }else{
      throw new Error("글 수정은 작성자만 할 수 있습니다.");
    }
  }else{
    throw new Error("blog 글이 없습니다.");
  }
}

 const updateBlogPreviewDoc = async(docName, collectionName, findDocID, chkUid, newData) => {
  const {title,text,update} = newData
  const blogPreviewRef = collection(studyDB, defaultCollection, docName, collectionName);
  const blogPreviewDocResult = query(blogPreviewRef, where('blogDocId', '==', findDocID));
  const querySnapshot = await getDocs(blogPreviewDocResult);

  if (!querySnapshot.empty){ 
    const blogPreviewDoc = doc(blogPreviewRef,querySnapshot.docs[0].id);
    const blogPreviewSnapshot = await getDoc(blogPreviewDoc); 
    if(blogPreviewSnapshot.exists()){
      const docData = blogPreviewSnapshot.data(); 
      const changeData = {...docData, title, text, update} // 업데이트 및 추가
      if (docData.auth === chkUid) {
        console.log(changeData)
        await updateDoc(blogPreviewDoc, changeData);
      }else{
        throw new Error("글 수정은 작성자만 할 수 있습니다.");
      }
    }else{
      throw new Error("blog 글이 없습니다.");
    }
  }else{
    console.log('정보 삭제를 실패했어요.. 😢')
  }
}


// 컬렉션, 문서 1~3에 따라 data 가져오기
 const getdepthCollectionDoc = async (firebaseFind) => {
  const {DB, col1, doc1, col2, doc2, col3, doc3} = firebaseFind;
  let docRef;
  if(doc3){
    docRef = doc(DB, col1, doc1, col2, doc2, col3, doc3);
  }else if(doc2){
    docRef = doc(DB, col1, doc1, col2, doc2);
  }else{
    docRef = doc(DB, col1, doc1);
  }
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data(); 
    } else {
      return null;
    }
  } catch (error) { 
    console.error("에러 찾기", error);
    return null;
  }
};

// ✅ 날씨 옵션 공통
 const firebaseWeatherOpt = (location) => ({
  DB: storeWeatherDB,
  col1: 'weather',
  doc1: locationCategory(location.addr1),
  col2: 'districtCode',
  doc2: `${location.districtCode}`, // 문자 & 숫자 섞여있다.
});

// ✅ firebase 필요 데이터 생성 및 전달
 const firebaseWeatherUpdate = async(location, data) => {
  if (!data?.res) return;
  const locationTitle = (location.addr2 || "") + " " + (location.addr3 || "") || location.addr1;
  const firebaseFind = {
    ...firebaseWeatherOpt(location),
    title:locationTitle,
    coords:data.xy
  }
  await updateWeatherDoc(firebaseFind, data);
};

// ✅ 최종 - 날씨 추가
 const updateWeatherDoc = async(firebaseFind, weatherData)=>{
  const {DB, col1, doc1, col2, doc2, title,coords} = firebaseFind;
  const doc3Year = weatherData.date.slice(0, 4); // ex - 2024

  // 날짜별 데이터 분리 {...}
  const resultData = weatherData.res?.reduce((acc, item) => {
    const { date, ...rest } = item; 
    acc[date] = { date, ...rest}; // 최종 업데이트 시간 추가
    return acc;
  }, {});

  const docRef = doc(DB, col1, doc1, col2, doc2); // 행정구역 컬렉션 문서
  const yearDocRef = doc(docRef, "year", doc3Year); // 년도 컬렉션 문서

  try {
    const mainDocSnapshot = await getDoc(docRef);
    if (!mainDocSnapshot.exists()) { 
      await setDoc(docRef, { // 문서가 없으면 생성
        id: doc2,
        title: title,
        coords:coords,
      });
    }

    await runTransaction(DB, async (transaction) => {
      // 트랜잭션 내부에서는 연도별 데이터만 처리
      const yearDocSnapshot = await transaction.get(yearDocRef);
      if (yearDocSnapshot.exists()) {
        const existingData = yearDocSnapshot.data();
        const updatedData = { ...existingData, ...resultData };
        transaction.set(yearDocRef, updatedData, { merge: true });
      } else {
        transaction.set(yearDocRef, resultData);
      }
    });

  } catch (error) {
    console.log(error)
  }
}
