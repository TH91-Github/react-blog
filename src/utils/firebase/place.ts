import { AllReviewDocType, PlaceDataTypeC, PlaceRemoveType, PlaceReviewType, PlaceUpdateType, ReviewDataType } from "types/kakaoComon";
import { collection, deleteDoc, doc, fireDB, getDoc, getDocs, query, setDoc, updateDoc, where, limit, orderBy, startAfter } from "../../firebase";
import { DocumentData } from "firebase/firestore";

// ✅ Map Place
// place 정보 가져오기 
/*
  📌 개선 - 최적화 필요 부분.
  placeDocRef에서 기본 문서 정보 1회 읽기.
  리뷰 문서 100개에 대해 getDocs() 호출 시 100회 읽기 발생.

  - 별점 계산도 변경하기
  - 읽기 권한
*/

// ✅ 1. place 정보 가져오기 - 카카오 api 외 추가된 정보
export const getDocPlace = async (collectionName: string, docId: string): Promise<null | PlaceDataTypeC> => {
  const placeDocRef = doc(fireDB, 'map', 'mapData', collectionName, docId);
  const placeDocSnap = await getDoc(placeDocRef);
  if (placeDocSnap.exists()) { // 📰 카카오 기본 정보 외 추가 정보
    console.log('place 요청')
    return placeDocSnap.data() as PlaceDataTypeC;
  }else{ // 리뷰 추가 정보가 없는 장소
    return null
  }
}
// ✒️ 2. place 리뷰 정보 가져오기
export const getDocReview = async (collectionName: string, docId: string, lastVisibleDoc:any, reviewLimit:number = 10) => {
  const reviewsCollectionRef = collection(fireDB, 'map', 'mapData', collectionName, docId, 'review');
  let q;
  if (lastVisibleDoc) {
    // 추가 데이터를 요청할 때는 startAfter를 사용하여 페이징 처리
    q = query(reviewsCollectionRef, orderBy('timestamp', 'desc'), startAfter(lastVisibleDoc), limit(reviewLimit));
  } else {
    // 첫 요청일 때는 마지막 문서 없이 초기 10개만 가져옴
    q = query(reviewsCollectionRef, orderBy('timestamp', 'desc'), limit(reviewLimit));
  }
  const querySnapshot = await getDocs(q);

  const reviews: DocumentData[] = [];
  let lastDoc: DocumentData | null = null;

  querySnapshot.forEach((doc) => {
    reviews.push({ ...doc.data(), id: doc.id });
  });

  // 마지막 문서를 페이징 처리에 사용하기 위해 저장
  lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

  return { reviews, lastDoc };
}


export const placeGetDoc2 = async (collectionName: string, docId: string): Promise<null | ReviewDataType> => {
  const placeDocRef = doc(fireDB, 'map', 'mapData', collectionName, docId);
  const placeDocSnap = await getDoc(placeDocRef);
  const reviewData: ReviewDataType = { rating: 0, data: null };

  if (placeDocSnap.exists()) {
    // review 컬렉션의 모든 문서 가져오기
    const reviewsCollectionRef = collection(fireDB, 'map', 'mapData', collectionName, docId, 'review');
    const reviewDocsSnap = await getDocs(reviewsCollectionRef);
    console.log('review 요청')
    if (!reviewDocsSnap.empty) {
      const reviewsData: any[] = [];
      let totalRating = 0;
      
      reviewDocsSnap.forEach((reviewDoc) => {
        totalRating += parseFloat(reviewDoc.data().rating);
        reviewsData.push(reviewDoc.data());
      });
      
      // 별점 & 댓글 데이터
      const resultRating = parseFloat((totalRating / reviewDocsSnap.size).toFixed(1));
      reviewData.rating = resultRating;
      reviewData.data = reviewsData;

      // 기존, 최신 별점 체크 업데이트
      if (placeDocSnap.data().rating !== resultRating) {
        await updateDoc(placeDocRef, {
          rating: resultRating,
          // reviewCount: reviewDocsSnap.size, 총 리뷰 수를 여기에 저장
          updateTime: new Date(),
        });
      }
      return reviewData;
    } else {
      // review 컬렉션에 문서가 없을 경우 데이터 초기화
      reviewData.rating = 0;
      reviewData.data = null

      // 별점이 0이 아니라면 업데이트
      if (placeDocSnap.data().rating !== 0) {
        await updateDoc(placeDocRef, {
          rating: 0,
          updateTime: new Date(),
        });
      }
      return null;
    }
  } else {
    return null;
  }
};

// review 문서 추가 
export const placeAddDoc = async(placeData:PlaceReviewType) :Promise<boolean>=> {
  const {collectionName, docId, placeName, rating} = placeData;
  try { 
    const placeDocRef = doc(fireDB, 'map', 'mapData', collectionName, docId);
    const placeDocSnap = await getDoc(placeDocRef);
    console.log('동작')
    if (!placeDocSnap.exists()) { // 기본 필드가 없을 경우 새롭게 추가
      await setDoc(placeDocRef, {
        id: docId,
        name:placeName,
        rating: rating,
        updateTime: new Date(),
      });
    }
    await placeReviewAddDoc(placeData)
    return true;
  } catch (error){
    console.log(error + 'review 에러')
    throw new Error('error 리뷰 문서 에러');
  }
}
// review 컬렉션 문서 & 필드 등록
const placeReviewAddDoc = async(placeData:PlaceReviewType) =>{
  const {collectionName, docId, authorId, nickName, rating, reviewText} = placeData;
  try{
    const reviewsCollectionRef = collection(fireDB, 'map', 'mapData', collectionName, docId,'review');
    const duplicateReviewQuery = query(reviewsCollectionRef, where('authorID', '==', authorId), limit(1));// 유저 아이디 체크
    const querySnapshot = await getDocs(duplicateReviewQuery);
    const newReviewDoc = doc(reviewsCollectionRef);
    const review = 1;
    const reviewData = {
      authorID: authorId,
      nickName: nickName,
      id: newReviewDoc.id,
      reviewText: reviewText,
      rating: rating,
      order: review,
      time: new Date(),
    }
    // 해당 유저 아이디로 몇번의 글을 썼는지 파악해야함
    if (!querySnapshot.empty) {
      // reviewData.order = review + querySnapshot.size;
      reviewData.order = querySnapshot.size + 1;
    }
    // 유저 정보 리뷰 목록에도 추가 
    await setDoc(newReviewDoc, reviewData);

    await allReviewAddDoc(reviewData); // 리뷰 검수를 위함.

    return true; // 성공적으로 완료
  } catch (error){
    console.log(error)
    throw new Error('error 리뷰 등록 에러');
  }
}
// 전체 리뷰 목록 - 추가
export const allReviewAddDoc = async(placeData:AllReviewDocType) =>{
  try{
    const allReviewListRef = collection(fireDB, 'map', 'reviewAll', 'reviewList');
    const newAllReviewDoc = doc(allReviewListRef);
    const newAllReviewDocID = newAllReviewDoc.id;
    placeData.allID = newAllReviewDocID; // doc 랜덤 id 추가
    await setDoc(newAllReviewDoc, placeData);
  } catch (error){
    console.log(error)
    throw new Error('error 전체 리스트에 리뷰 등록 에러');
  }
}
// review 컬렉션 문서 & 필드 삭제
export const placeReviewRemoveDoc = async(removeData:PlaceRemoveType) => {
  const {collectionName, docId, removeId, authorId} = removeData;
  try{
    const placeRemoveRef = collection(fireDB, 'map', 'mapData', collectionName, docId,'review');
    const placeRemoveDoc = doc(placeRemoveRef,removeId);
    const placeRemoveSnapshot = await getDoc(placeRemoveDoc); 
    if(placeRemoveSnapshot.exists()){
      const docData = placeRemoveSnapshot.data(); 
      if (docData.authorID === authorId) { // user 확인 한번 더
        allReviewRemoveDoc(removeData)
        await deleteDoc(placeRemoveDoc);
      }
    }else{
      throw new Error("⚠️ 리뷰가 없어요!!");
    }
  }catch(error){
    throw new Error('error')
  }
}

// 전체 리뷰 목록 - 삭제
export const allReviewRemoveDoc = async(removeData:PlaceRemoveType) => {
  const { removeId, authorId} = removeData;
  const allReviewListRemoveRef = collection(fireDB, 'map', 'reviewAll', 'reviewList');
  const findRemoveDoc = query(allReviewListRemoveRef, where('id', '==', removeId));
  const querySnapshot = await getDocs(findRemoveDoc);
  
  if (querySnapshot.empty) {
    throw new Error("⚠️ 리뷰가 없어요!!");
  }
  const reviewDoc = querySnapshot.docs[0];
  const reviewData = reviewDoc.data();
  const reviewDocId = reviewData.allID;

  if (reviewData.authorID !== authorId) {
    throw new Error("⚠️ 권한이 없어요!!");
  }
  // 문서 삭제
  const allPlaceRemoveDoc = doc(allReviewListRemoveRef, reviewDocId);
  await deleteDoc(allPlaceRemoveDoc);
}

// 특정 place 업데이트
export const placeReviewUpdateDoc = async(updateData:PlaceUpdateType) => {
  const { collectionName, docId, updateDocId, authorId, updateKey, likeList} = updateData;
  try{
    const placeUpdateRef = collection(fireDB, 'map', 'mapData', collectionName, docId,'review');
    const placeUpdateDoc = doc(placeUpdateRef, updateDocId);
    const placeUpdateSnapshot = await getDoc(placeUpdateDoc); 

    if(placeUpdateSnapshot.exists()){
      await updateDoc(placeUpdateDoc, {
        [updateKey]: likeList 
      });
    }else{
      console.log("⚠️ 리뷰가 없습니다!!");
    }
  }catch(error){
    console.log("⚠️ 업데이트 실패");
  }
}