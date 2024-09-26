import { DocumentData, runTransaction } from "firebase/firestore";
import { AllReviewDocType, PlaceDataTypeC, PlaceRemoveType, PlaceUpdateType, ReviewAddDocTypeC } from "types/kakaoComon";
import { collection, deleteDoc, doc, fireDB, getDoc, getDocs, limit, orderBy, query, setDoc, startAfter, updateDoc, where } from "../../firebase";

// ✅ Map Place
// place 정보 가져오기 
/*
  📌 개선 - 최적화 필요 부분.
  placeDocRef에서 기본 문서 정보 1회 읽기.
  리뷰 문서 100개에 대해 getDocs() 호출 시 100회 읽기 발생.

  - 별점 계산도 변경하기
  - 읽기 권한
*/

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

// ✅ 1. place 정보 가져오기 - 카카오 api 외 추가된 정보
export const getDocPlace = async (collectionName: string, docId: string): Promise<null | PlaceDataTypeC> => {
  const placeDocRef = doc(fireDB, 'map', 'mapData', collectionName, docId);
  const placeDocSnap = await getDoc(placeDocRef);
  if (placeDocSnap.exists()) { // 📰 카카오 기본 정보 외 추가 정보
    return placeDocSnap.data() as PlaceDataTypeC;
  }else{ // 리뷰 추가 정보가 없는 장소
    return null
  }
}

// ✅ 2. place 리뷰 정보 가져오기
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

// export const getDocReview = async (collectionName: string, docId: string, reviewLimit:number = 10, lastDoc:any ) => {
//   const reviewsCollectionRef = collection(fireDB, 'map', 'mapData', collectionName, docId, 'review');

//   const querySort = lastDoc
//     ? query( // 불러온 마지막에서 + reviewLimit(10) 
//         reviewsCollectionRef,
//         orderBy('time', 'desc'),
//         startAfter(lastDoc),
//         limit(reviewLimit+1)
//       )
//     : query( // 처음 불러오는 경우
//         reviewsCollectionRef,
//         orderBy('time', 'desc'),
//         limit(reviewLimit+1)
//       );

//   const documentSnapshots = await getDocs(querySort);
//   if (documentSnapshots.empty) {
//     console.log('더 이상 문서가 없습니다.');
//     return { reviews: [], lastDoc: null }; // 데이터가 없으면 lastDoc을 null로 반환
//   }

//   const listsDocs = documentSnapshots.docs.map(doc => doc.data());
//   // 👇 
//   const trimmedDocs = listsDocs.slice(0, reviewLimit);  
//   const lastVisibleDoc = documentSnapshots.docs.length > reviewLimit ? documentSnapshots.docs[reviewLimit - 1] : null;
//   return { reviews: trimmedDocs, lastDoc: lastVisibleDoc };
// }

// 4. review 등록
export const reviewAddDoc = async(reviewData:ReviewAddDocTypeC) => {
  const {collectionName, docId, authorId, userId, nickName, rating, reviewText} = reviewData;
  const reviewsCollectionRef = collection(fireDB, 'map', 'mapData', collectionName, docId, 'review');
  const newReviewDoc = doc(reviewsCollectionRef);
  const newReviewData = {
    id: newReviewDoc.id,
    authorID: authorId,
    userId:userId,
    nickName: nickName,
    reviewText: reviewText,
    rating: rating,
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

// 전체 리뷰 목록 - 추가
export const allReviewAddDoc = async(reviewData:ReviewAddDocTypeC, reviewDocID:string) =>{
  const {collectionName, docId, authorId, userId, nickName, reviewText} = reviewData;
  const reviewsCollectionRef = collection(fireDB, 'map', 'reviewAll', 'reviewList');
  const newAllReviewDoc = doc(reviewsCollectionRef);
  const newAllReviewData = {
    id: newAllReviewDoc.id, // all doc id
    collectionName:collectionName, // place 지역
    docId:docId, // place ID
    reviewDocID: reviewDocID, // place review id
    authorID: authorId,
    userId:userId,
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


// 전체 리뷰 목록 - 추가
export const allReviewAddDoc2 = async(placeData:AllReviewDocType) =>{
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