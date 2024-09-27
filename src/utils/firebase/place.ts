import { runTransaction } from "firebase/firestore";
import { StringOnly } from "types/baseType";
import { PlaceDataTypeC, QueryReviewDataTypeC, ReviewAddDocTypeC, ReviewDataTypeC, ReviewRemoveTypeC } from "types/kakaoComon";
import { collection, deleteDoc, doc, fireDB, getDoc, getDocs, limit, orderBy, query, setDoc, startAfter, updateDoc, where } from "../../firebase";

// ✅ Map Place
// ✒️ place 정보 등록
export const addDocPlace = async (collectionName:string, docId:string, place_name:string) => {
  const placeDocRef = doc(fireDB, 'map', 'mapData', collectionName, docId);
  const placeInitInfo: PlaceDataTypeC = {
    id: docId,
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

// ✅ place 정보 가져오기 - 카카오 api 외 추가된 정보
export const getDocPlace = async (collectionName: string, docId: string): Promise<null | PlaceDataTypeC> => {
  const placeDocRef = doc(fireDB, 'map', 'mapData', collectionName, docId);
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
  docId: string, 
  lastDoc: ReviewDataTypeC[] | null = null, 
  getPageNum: number = 5
): Promise<QueryReviewDataTypeC> => {
  const reviewcollectionRef = collection(fireDB, 'map', 'mapData', collectionName, docId, 'review');
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
  const {collectionName, docId, authorId, userId, nickName, rating, reviewText, imgUrl} = reviewData;
  const reviewsCollectionRef = collection(fireDB, 'map', 'mapData', collectionName, docId, 'review');
  const newReviewDoc = doc(reviewsCollectionRef);
  const newReviewData = {
    id: newReviewDoc.id,
    authorId: authorId,
    userId:userId,
    nickName: nickName,
    reviewText: reviewText,
    rating: rating,
    like: [],
    imgUrl: imgUrl,
    time: new Date(),
  }
  try{
    await runTransaction(fireDB, async (transaction) => {
      // 트랜잭션 - place 업데이트 할 문서 가져오기
      const placeDocRef = doc(fireDB, 'map', 'mapData', collectionName, docId);
      const placeDocSnapshot = await transaction.get(placeDocRef);
      if (placeDocSnapshot.exists()) {
        const getPlaceData = placeDocSnapshot.data();
        const newReviewArr = [ // place 정보 필드에 리뷰 간략 정보 추가
          ...getPlaceData.reviewArr,
          { docId: newReviewDoc.id, userId: userId }
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
export const allReviewAddDoc = async(reviewData:ReviewAddDocTypeC, reviewDocId:string) =>{
  const {collectionName, docId, authorId, userId, nickName, reviewText} = reviewData;
  const reviewsCollectionRef = collection(fireDB, 'map', 'reviewAll', 'reviewList');
  const newAllReviewDoc = doc(reviewsCollectionRef);
  const newAllReviewData = {
    id: newAllReviewDoc.id, // all doc id
    collectionName:collectionName, // place 지역
    docId:docId, // place ID
    reviewDocId: reviewDocId, // place review id
    authorId: authorId,
    userId:userId,
    nickName: nickName,
    reviewText: reviewText,
  }
  try{
    await setDoc(newAllReviewDoc, newAllReviewData);
  }catch(error){
    console.log('❌ 전체 리뷰 리스트에 추가 실패!!' + error)
  }
}

// ✅ review 컬렉션 문서 & 필드 삭제
export const reviewRemove = async(removeData:ReviewRemoveTypeC) => {
  const {collectionName, docId, removeId, authorId,rating} = removeData;
  const reviewRemoveRef = collection(fireDB, 'map', 'mapData', collectionName, docId,'review');
  const reviewRemoveDoc = doc(reviewRemoveRef,removeId);

  try{
    await runTransaction(fireDB, async (transaction) => {
      // 트랜잭션 - place 업데이트 할 문서 가져오기
      const placeDocRef2 = doc(fireDB, 'map', 'mapData', collectionName, docId);
      const placeDocSnapshot2 = await transaction.get(placeDocRef2);

      if (placeDocSnapshot2.exists()) {
        const getPlaceData2 = placeDocSnapshot2.data();

        const removeReviewArr = getPlaceData2.reviewArr.filter((removeReviewArrItem:StringOnly) => removeReviewArrItem.docId !== removeId)
        const updateRatingResult = parseFloat(((getPlaceData2.ratingResult || 0) - rating).toFixed(1));
        const newRating2 = removeReviewArr.length > 0 
          ? parseFloat((updateRatingResult / removeReviewArr.length).toFixed(1)) 
          : 0;
        
        // place 문서 업데이트
        transaction.update(placeDocRef2, {
          reviewArr: removeReviewArr,
          ratingResult: updateRatingResult,
          rating: newRating2,
          updateTime : new Date(),
        });
        // // 최종 리뷰 등록 
        transaction.delete(reviewRemoveDoc);
      }else{
        throw new Error('❌ 문서가 존재하지 않습니다');
      }
    });
    await allReviewRemove(removeData); // 전체 리뷰 삭제
    console.log('✅ 리뷰 등록 성공!');
  }catch(error){
    console.log('❌ 리뷰 삭제 실패!');
  }
}

// ✅ 전체 리뷰 목록 - 삭제
export const allReviewRemove = async(removeData:ReviewRemoveTypeC) => {
  const { removeId, authorId} = removeData;
  const allReviewListRemoveRef = collection(fireDB, 'map', 'reviewAll', 'reviewList');
  const findRemoveDoc = query(allReviewListRemoveRef, where('reviewDocId', '==', removeId));
  const querySnapshot = await getDocs(findRemoveDoc);

  if (querySnapshot.empty) {
    throw new Error("⚠️ 전체 리뷰가 없어요!!");
  }
  const reviewDoc = querySnapshot.docs[0];
  const reviewData = reviewDoc.data();
  const reviewDocId = reviewData.id;
  if (reviewData.authorId !== authorId) {
    throw new Error("⚠️ 전체 리뷰 삭제 권한이 없어요!!");
  }
  // 문서 삭제
  const allReviewRemoveDoc = doc(allReviewListRemoveRef, reviewDocId);
  await deleteDoc(allReviewRemoveDoc);
}

// 특정 place 업데이트 - 하트 > 잔업
export const placeReviewUpdateDoc = async(updateData:any) => {
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