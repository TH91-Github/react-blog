import { PlaceReviewType, ReviewDataType } from "types/kakaoComon";
import { collection, doc, fireDB, getDoc, getDocs, query, setDoc, updateDoc, where } from "../../firebase";
import { DateChange } from "utils/common";

// ✅ Map Place
// place 정보 가져오기 
export const placeGetDoc = async(collectionName:string, docId:string) :Promise<null | ReviewDataType>=> {
  const placeDocRef = doc(fireDB, 'map', 'mapData', collectionName, docId);
  const placeDocSnap = await getDoc(placeDocRef);
  const reviewData:ReviewDataType = {rating: 0, data:null};

  if(placeDocSnap.exists()){
    // review 컬렉션의 모든 문서 가져오기
    const reviewsCollectionRef = collection(fireDB, 'map', 'mapData', collectionName, docId, 'review');
    const reviewDocsSnap = await getDocs(reviewsCollectionRef);
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
    if(placeDocSnap.data().rating !== resultRating) {
      await updateDoc(placeDocRef, { 
        rating: resultRating,
        updateTime: DateChange('full'),
      });
    }
    return reviewData;
  }else{
    return null
  }
}

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
  const {collectionName, docId, userId, nickName, rating, reviewText} = placeData;
  try{
    const reviewsCollectionRef = collection(fireDB, 'map', 'mapData', collectionName, docId,'review');
    const duplicateReview = query(reviewsCollectionRef, where('authorID', '==', userId)); // 유저 아이디 체크
    const querySnapshot = await getDocs(duplicateReview);
    const newReviewDoc = doc(reviewsCollectionRef);
    const review = 1;
    const reviewData = {
      authorID: userId,
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
    return true; // 성공적으로 완료
  } catch (error){
    console.log(error)
    throw new Error('error 리뷰 등록 에러');
  }
}

// 전체 리뷰 목록 - 추가
export const allReviewAddDoc = async(placeData:PlaceReviewType) =>{
  try{
    const allReviewListRef = collection(fireDB, 'map', 'reviewAll', 'reviewList');
    const newAllReviewDoc = doc(allReviewListRef);
    const newAllReviewDocID = newAllReviewDoc.id;
    placeData.id = newAllReviewDocID; // doc 랜덤 id 추가
    await setDoc(newAllReviewDoc, placeData);
  } catch (error){
    console.log(error)
    throw new Error('error 전체 리스트에 리뷰 등록 에러');
  }
}
// 전체 리뷰 목록 - 삭제