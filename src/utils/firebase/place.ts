import { runTransaction } from "firebase/firestore";
import { AllReviewDocType, PlaceDataTypeC, PlaceRemoveType, PlaceUpdateType, QueryReviewDataTypeC, ReviewAddDocTypeC, ReviewDataTypeC, ReviewRemoveTypeC } from "types/kakaoComon";
import { collection, deleteDoc, doc, fireDB, getDoc, getDocs, limit, orderBy, query, setDoc, startAfter, updateDoc, where } from "../../firebase";

// ✅ Map Place
// ✒️ place 정보 등록
export const addDocPlace = async (collectionName:string, docID:string, place_name:string) => {
  const placeDocRef = doc(fireDB, 'map', 'mapData', collectionName, docID);
  const placeInitInfo: PlaceDataTypeC = {
    id: docID,
    name: place_name,
    rating: 0,
    ratingResult:0,
    reviewArr: [], 
    updateTime: new Date(),
  };
  try{
    await setDoc(placeDocRef, placeInitInfo);
  }catch(error){
    console.log('❌ plact 기본 정보 등록 실패 '+error)
  }
}

// ✅ 1. place 정보 가져오기 - 카카오 api 외 추가된 정보
export const getDocPlace = async (collectionName: string, docID: string): Promise<null | PlaceDataTypeC> => {
  const placeDocRef = doc(fireDB, 'map', 'mapData', collectionName, docID);
  const placeDocSnap = await getDoc(placeDocRef);
  if (placeDocSnap.exists()) { // 📰 카카오 기본 정보 외 추가 정보
    return placeDocSnap.data() as PlaceDataTypeC;
  }else{ // 리뷰 추가 정보가 없는 장소
    return null
  }
}

// ✅ review 정보 가져오기
export const getDocReview = async ( 
  collectionName: string, 
  docID: string, 
  lastDoc: ReviewDataTypeC[] | null = null, 
  getPageNum: number = 5
): Promise<QueryReviewDataTypeC> => {
  const reviewcollectionRef = collection(fireDB, 'map', 'mapData', collectionName, docID, 'review');
  const querySort = lastDoc
    ? query( 
        reviewcollectionRef,
        orderBy('time', 'desc'),
        startAfter(lastDoc),
        limit(getPageNum)
      )
    : query( 
        reviewcollectionRef,
        orderBy('time', 'desc'),
        limit(getPageNum)
      );
  const reviewSnapshots = await getDocs(querySort);
  if (reviewSnapshots.empty) {
    console.log('❌ 더 이상 문서가 없어요! ');
    return { docs: [], lastDoc: null };
  }

  const reviewDocsArr: ReviewDataTypeC[] = reviewSnapshots.docs.map((reviewItem) => ({
    ...reviewItem.data()
  })) as ReviewDataTypeC[]; // firebase 등록된 값이랑 오차가 발생하여 강제 변환

  const lastDocChk = (reviewSnapshots.docs.length > getPageNum 
    ? reviewSnapshots.docs[reviewSnapshots.docs.length - 1] 
    : null) as ReviewDataTypeC[] | null; // firebase 등록된 값이랑 오차가 발생하여 강제 변환

  return { docs: reviewDocsArr, lastDoc: lastDocChk };
};

// ✅ review 등록
export const reviewAddDoc = async(reviewData:ReviewAddDocTypeC) => {
  const {collectionName, docID, authorID, userID, nickName, rating, reviewText} = reviewData;
  const reviewsCollectionRef = collection(fireDB, 'map', 'mapData', collectionName, docID, 'review');
  const newReviewDoc = doc(reviewsCollectionRef);
  const newReviewData = {
    id: newReviewDoc.id,
    authorID: authorID,
    userID:userID,
    nickName: nickName,
    reviewText: reviewText,
    rating: rating,
    time: new Date(),
  }
  try{
    await runTransaction(fireDB, async (transaction) => {
      // 트랜잭션 - place 업데이트 할 문서 가져오기
      const placeDocRef = doc(fireDB, 'map', 'mapData', collectionName, docID);
      const placeDocSnapshot = await transaction.get(placeDocRef);
      if (placeDocSnapshot.exists()) {
        const getPlaceData = placeDocSnapshot.data();
        const newReviewArr = [ // place 정보 필드에 리뷰 간략 정보 추가
          ...getPlaceData.reviewArr,
          { docID: newReviewDoc.id, userID: userID }
        ];

        const newRatingResult = (getPlaceData.ratingResult || 0) + rating;
        const newRating = parseFloat((newRatingResult / newReviewArr.length).toFixed(1)); 
        // place 문서 업데이트
        transaction.update(placeDocRef, {
          reviewArr: newReviewArr,
          ratingResult: newRatingResult,
          rating: newRating,
          updateTime : new Date(),
        });
        // 최종 리뷰 등록 
        transaction.set(newReviewDoc, newReviewData);
      }else{
        throw new Error('❌ 문서가 존재하지 않습니다');
      }
    });

    await allReviewAddDoc(reviewData, newReviewDoc.id); // 리뷰 검수를 위함.
    console.log('✅ 리뷰 등록 성공!');
  }catch(error){
    console.log('❌ 리뷰 등록에 실패!! -' + error)
  }
}

// ✅ 전체 리뷰 목록 - 추가
export const allReviewAddDoc = async(reviewData:ReviewAddDocTypeC, reviewDocID:string) =>{
  const {collectionName, docID, authorID, userID, nickName, reviewText} = reviewData;
  const reviewsCollectionRef = collection(fireDB, 'map', 'reviewAll', 'reviewList');
  const newAllReviewDoc = doc(reviewsCollectionRef);
  const newAllReviewData = {
    id: newAllReviewDoc.id, // all doc id
    collectionName:collectionName, // place 지역
    docID:docID, // place ID
    reviewDocID: reviewDocID, // place review id
    authorID: authorID,
    userID:userID,
    nickName: nickName,
    reviewText: reviewText,
  }
  console.log(newAllReviewData)
  try{
    await setDoc(newAllReviewDoc, newAllReviewData);
  }catch(error){
    console.log('❌ 전체 리뷰 리스트에 추가 실패!!' + error)
  }
}

// ✅ review 컬렉션 문서 & 필드 삭제
export const reviewRemoveDoc = async(removeData:ReviewRemoveTypeC) => {
  const {collectionName, docID, removeID, authorID} = removeData;
  try{
    const placeRemoveRef = collection(fireDB, 'map', 'mapData', collectionName, docID,'review');
    const placeRemoveDoc = doc(placeRemoveRef,removeID);
    const placeRemoveSnapshot = await getDoc(placeRemoveDoc); 
    if(placeRemoveSnapshot.exists()){
      const docData = placeRemoveSnapshot.data(); 
      if (docData.authorID === authorID) { // user 확인 한번 더
        // allReviewRemoveDoc(removeData)
        await deleteDoc(placeRemoveDoc);
      }
    }else{
      throw new Error("⚠️ 리뷰가 없어요!!");
    }
  }catch(error){
    throw new Error('error')
  }
}

// export const reviewRemoveDoc = async(removeData:PlaceRemoveType) => {
//   const {collectionName, docID, removeID, authorID} = removeData;
//   try{
//     const placeRemoveRef = collection(fireDB, 'map', 'mapData', collectionName, docID,'review');
//     const placeRemoveDoc = doc(placeRemoveRef,removeID);
//     const placeRemoveSnapshot = await getDoc(placeRemoveDoc); 
//     if(placeRemoveSnapshot.exists()){
//       const docData = placeRemoveSnapshot.data(); 
//       if (docData.authorID === authorID) { // user 확인 한번 더
//         allReviewRemoveDoc(removeData)
//         await deleteDoc(placeRemoveDoc);
//       }
//     }else{
//       throw new Error("⚠️ 리뷰가 없어요!!");
//     }
//   }catch(error){
//     throw new Error('error')
//   }
// }

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