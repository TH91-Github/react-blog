import { AllReviewDocType, PlaceRemoveType, PlaceReviewType, ReviewDataType } from "types/kakaoComon";
import { collection, deleteDoc, doc, fireDB, getDoc, getDocs, query, setDoc, updateDoc, where } from "../../firebase";
import { DateChange } from "utils/common";

// ✅ Map Place
// place 정보 가져오기 
export const placeGetDoc = async (collectionName: string, docId: string): Promise<null | ReviewDataType> => {
  const placeDocRef = doc(fireDB, 'map', 'mapData', collectionName, docId);
  const placeDocSnap = await getDoc(placeDocRef);
  const reviewData: ReviewDataType = { rating: 0, data: null };

  if (placeDocSnap.exists()) {
    // review 컬렉션의 모든 문서 가져오기
    const reviewsCollectionRef = collection(fireDB, 'map', 'mapData', collectionName, docId, 'review');
    const reviewDocsSnap = await getDocs(reviewsCollectionRef);

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
    const duplicateReview = query(reviewsCollectionRef, where('authorID', '==', authorId)); // 유저 아이디 체크
    const querySnapshot = await getDocs(duplicateReview);
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
      reviewData.order = review + querySnapshot.size;
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
    console.log('⚠️오류가 발생하여 리뷰 삭제했어요 😲')
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
