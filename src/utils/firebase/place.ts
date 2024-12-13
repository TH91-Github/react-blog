import { collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query, runTransaction, setDoc, startAfter, updateDoc, where } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { StringOnly } from "types/baseType";
import { PlaceDataTypeC, QueryReviewDataTypeC, ReviewAddDocTypeC, ReviewDataTypeC, ReviewRemoveTypeC } from "types/kakaoComon";
import { getEmailId } from "utils/common";
import { fbMapStorage, fbMapDB, } from "../../firebase";
// ✅ Map Place
// ✒️ place 정보 등록
export const addDocPlace = async (collectionName:string, docId:string, place_name:string) => {
  const placeDocRef = doc(fbMapDB, 'map', 'mapData', collectionName, docId);
  const placeInitInfo: PlaceDataTypeC = {
    id: docId,
    name: place_name,
    rating: 0,
    ratingResult:0,
    reviewArr: [],
    galleryImgs:[],
    updateTime: new Date(),
    etcUrlList:[],
  };
  try{
    await setDoc(placeDocRef, placeInitInfo);
  }catch(error){
    console.log('❌ plact 기본 정보 등록 실패 '+error)
  }
}

// ✅ place 정보 가져오기 - 카카오 api 외 추가된 정보
export const getDocPlace = async (collectionName: string, docId: string): Promise<null | PlaceDataTypeC> => {
  const placeDocRef = doc(fbMapDB, 'map', 'mapData', collectionName, docId);
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
  const reviewcollectionRef = collection(fbMapDB, 'map', 'mapData', collectionName, docId, 'review');
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
    // console.log('❌ 리뷰가 없어요! ');
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
  const reviewsCollectionRef = collection(fbMapDB, 'map', 'mapData', collectionName, docId, 'review');
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
    await runTransaction(fbMapDB, async (transaction) => {
      // 트랜잭션 - place 업데이트 할 문서 가져오기
      const placeDocRef = doc(fbMapDB, 'map', 'mapData', collectionName, docId);
      const placeDocSnapshot = await transaction.get(placeDocRef);
      const newTime = new Date();
      
      if (placeDocSnapshot.exists()) {
        const getPlaceData = placeDocSnapshot.data();
        const newReviewArr = [ // place 정보 필드에 리뷰 간략 정보 추가
          ...getPlaceData.reviewArr,
          { docId: newReviewDoc.id, userId: userId }
        ];
        // ✔️ 이미지 추가
        const galleryImg = imgUrl.map((imgUrlItem:string) => (
          {userId:userId, imgPath: imgUrlItem, uploadTime: newTime}
        ))
        const newGalleryArr = galleryImg.length > 0 ? [...getPlaceData.galleryImgs, ...galleryImg]: [...getPlaceData.galleryImgs]

        // ✔️ 별점
        const newRatingResult = (parseFloat(getPlaceData.ratingResult) || 0) + rating;
        const newRating = parseFloat((newRatingResult / (newReviewArr.length ?? 1)).toFixed(1)); 

        // place 문서 업데이트
        transaction.update(placeDocRef, {
          reviewArr: newReviewArr,
          ratingResult: newRatingResult,
          galleryImgs: newGalleryArr,
          rating: newRating,
          updateTime : newTime,
        });
        // 최종 리뷰 등록 
        transaction.set(newReviewDoc, newReviewData);
      }else{
        throw new Error('❌ 문서가 존재하지 않습니다');
      }
    });
    await allReviewAddDoc(reviewData, newReviewDoc.id); // 리뷰 검수를 위함.
  }catch(error){
    await mapDeleteStorageImg(imgUrl); // ✔️ 리뷰 실패할 경우 등록한 이미지 다시 삭제
    console.log('❌ 리뷰 등록에 실패!! -' + error)
  }
}

// ✅ 전체 리뷰 목록 - 추가
export const allReviewAddDoc = async(reviewData:ReviewAddDocTypeC, reviewDocId:string) =>{
  const {collectionName, docId, authorId, userId, nickName, reviewText} = reviewData;
  const reviewsCollectionRef = collection(fbMapDB, 'map', 'reviewAll', 'reviewList');
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
  const {collectionName, docId, removeId, removeImg, rating} = removeData;
  const reviewRemoveRef = collection(fbMapDB, 'map', 'mapData', collectionName, docId,'review');
  const reviewRemoveDoc = doc(reviewRemoveRef,removeId);
  try{
    await runTransaction(fbMapDB, async (transaction) => {
      // 트랜잭션 - place 업데이트 할 문서 가져오기
      const removeDocRef = doc(fbMapDB, 'map', 'mapData', collectionName, docId);
      const removePlaceDocSnapshot = await transaction.get(removeDocRef);

      // 이미지 삭제 - store(데이터) 와 storage(이미지) 다르기에 이미지 요청부터 성공/실패 체크
      if (removeImg.length > 0) {
        try {
          await mapDeleteStorageImg(removeImg);
        } catch (imgError) {
          throw new Error('❌ 이미지 삭제 실패로 인해 리뷰 삭제를 진행할 수 없어요... ');
        }
      }
      // firbase store 삭제
      if (removePlaceDocSnapshot.exists()) {
        const getRemovePlaceData = removePlaceDocSnapshot.data();

         // 리뷰 제거
         const removeReviewArr = getRemovePlaceData.reviewArr.filter(
          (removeReviewArrItem: StringOnly) =>
            removeReviewArrItem.docId !== removeId
        );
        // 갤러리 관련 정보 제거
        const removeGallery = getRemovePlaceData.galleryImgs.filter(
          (galleryItem: any) => !removeImg.includes(galleryItem.imgPath)
        );
        // 평점 계산
        const removeRatingResult = parseFloat(
          ((getRemovePlaceData.ratingResult || 0) - rating).toFixed(1)
        );
        const removeRating = removeReviewArr.length > 0 
          ? parseFloat((removeRatingResult / removeReviewArr.length).toFixed(1)) 
          : 0;

        // place 문서 업데이트
        if (removeReviewArr.length === 0 && removeRatingResult === 0) {
          // 리뷰가 없다면 해당 업체 doc 삭제
          transaction.delete(removeDocRef);
        } else {
          // 그렇지 않다면 문서 업데이트
          transaction.update(removeDocRef, {
            reviewArr: removeReviewArr,
            ratingResult: removeRatingResult,
            rating: removeRating,
            galleryImgs: removeGallery,
            updateTime: new Date(),
          });
        }
        // 리뷰 삭제
        transaction.delete(reviewRemoveDoc);
      }else{
        throw new Error('❌ 문서가 존재하지 않습니다');
      }
    });
    await allReviewRemove(removeData); // 전체 리뷰 삭제
  }catch(error){
    console.log('❌ 리뷰 삭제 실패!');
  }
}

// ✅ 전체 리뷰 목록 - 삭제
export const allReviewRemove = async(removeData:ReviewRemoveTypeC) => {
  const { removeId, authorId} = removeData;
  const allReviewListRemoveRef = collection(fbMapDB, 'map', 'reviewAll', 'reviewList');
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
  const { collectionName, docId, updateDocId, updateKey, likeList} = updateData;
  try{
    const placeUpdateRef = collection(fbMapDB, 'map', 'mapData', collectionName, docId,'review');
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

// 🖼️ 이미지 업로드 경로 반환 - MAP 전용 DB가 다름.
export const mapImguploadStorage = async (file: File, folder:string = 'images', email:string) => {
  const nowTime = new Date().getTime();
  const storageRef = ref(fbMapStorage, `${folder}/${getEmailId(email)}-${file.name}-${nowTime}`);
  try {
    await uploadBytes(storageRef, file);
    return storageRef.fullPath; // 업로드된 이미지 경로 반환
  } catch (error) {
    console.error("firebase storage 이미지 업로드 실패");
    throw error;
  }
};

export const mapGetStorageImgUrl = async (fullPath: string) => {
  try {
    const storageRef = ref(fbMapStorage, fullPath);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error("firebase storage 이미지 URL 가져오기 실패..");
    throw error;
  }
};

export const mapDeleteStorageImg = async (imgListsPaths: string[]) => {
  try {
    const deleteImgPromises = imgListsPaths.map((imgItem) => {
      const imgStorageRef = ref(fbMapStorage, imgItem); 
      return deleteObject(imgStorageRef); 
    });
    await Promise.all(deleteImgPromises); // 모든 처리를 기다려야하는 경우 map 사용 적절. foreach x
    console.log("firebase storage 이미지들 삭제 성공");
  } catch (error) {
    console.error("❌ storage img 삭제 실패! ", error);
  }
}