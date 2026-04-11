import { collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query, runTransaction, setDoc, startAfter, updateDoc, where } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { StringOnly } from "types/baseType";
import { PlaceDataTypeC, QueryReviewDataTypeC, ReviewAddDocTypeC, ReviewDataTypeC, ReviewRemoveTypeC } from "types/kakaoComon";
import { getEmailId } from "utils/common";
import { fbMapStorage, fbMapDB } from "../../firebase";

// ✅ Map Place
// ✒️ place 정보 등록
export const addDocPlace = async (collectionName: string, docId: string, place_name: string) => {
  const placeDocRef = doc(fbMapDB, "map", "mapData", collectionName, docId);
  const placeInitInfo: PlaceDataTypeC = {
    id: docId,
    name: place_name,
    rating: 0,
    ratingResult: 0,
    reviewArr: [],
    galleryImgs: [],
    updateTime: new Date(),
    etcUrlList: [],
  };

  try {
    await setDoc(placeDocRef, placeInitInfo);
  } catch (error) {
    console.log("place init failed", error);
    throw error;
  }
};

export const getDocPlace = async (collectionName: string, docId: string): Promise<null | PlaceDataTypeC> => {
  const placeDocRef = doc(fbMapDB, "map", "mapData", collectionName, docId);

  try {
    const placeDocSnap = await getDoc(placeDocRef);

    if (placeDocSnap.exists()) {// 📰 카카오 기본 정보 외 추가 정보
      return placeDocSnap.data() as PlaceDataTypeC;
    }

    return null;
  } catch (error) { 
    console.log("place fetch failed", error);
    throw error;
  }
};

export const getDocReview = async (
  collectionName: string,
  docId: string,
  lastDoc: ReviewDataTypeC[] | null = null,
  getPageNum: number = 5
): Promise<QueryReviewDataTypeC> => {
  const reviewcollectionRef = collection(fbMapDB, "map", "mapData", collectionName, docId, "review");

  try {
    const querySort = lastDoc
      ? query(reviewcollectionRef, orderBy("time", "desc"), startAfter(lastDoc), limit(getPageNum))
      : query(reviewcollectionRef, orderBy("time", "desc"), limit(getPageNum));

    const reviewSnapshots = await getDocs(querySort);

    if (reviewSnapshots.empty) {
      return { docs: [], lastDoc: null };
    }

    const reviewDocsArr: ReviewDataTypeC[] = reviewSnapshots.docs.map((reviewItem) => ({
      ...reviewItem.data(),
    })) as ReviewDataTypeC[];

    const lastDocChk = (
      reviewSnapshots.docs.length > getPageNum
        ? reviewSnapshots.docs[reviewSnapshots.docs.length - 1]
        : null
    ) as ReviewDataTypeC[] | null;

    return { docs: reviewDocsArr, lastDoc: lastDocChk };
  } catch (error) {
    console.log("review fetch failed", error);
    throw error;
  }
};

export const reviewAddDoc = async (reviewData: ReviewAddDocTypeC) => {
  const { collectionName, docId, authorId, userId, nickName, rating, reviewText, imgUrl } = reviewData;
  const reviewsCollectionRef = collection(fbMapDB, "map", "mapData", collectionName, docId, "review");
  const newReviewDoc = doc(reviewsCollectionRef);
  const newReviewData = {
    id: newReviewDoc.id,
    authorId,
    userId,
    nickName,
    reviewText,
    rating,
    like: [],
    imgUrl,
    time: new Date(),
  };

  try {
    await runTransaction(fbMapDB, async (transaction) => {
      const placeDocRef = doc(fbMapDB, "map", "mapData", collectionName, docId);
      const placeDocSnapshot = await transaction.get(placeDocRef);
      const newTime = new Date();

      if (!placeDocSnapshot.exists()) {
        throw new Error("place doc does not exist");
      }

      const getPlaceData = placeDocSnapshot.data();
      const newReviewArr = [...getPlaceData.reviewArr, { docId: newReviewDoc.id, userId }];
      const galleryImg = imgUrl.map((imgUrlItem: string) => ({
        userId,
        imgPath: imgUrlItem,
        uploadTime: newTime,
      }));
      const newGalleryArr = galleryImg.length > 0 ? [...getPlaceData.galleryImgs, ...galleryImg] : [...getPlaceData.galleryImgs];
      const newRatingResult = (parseFloat(getPlaceData.ratingResult) || 0) + rating;
      const newRating = parseFloat((newRatingResult / (newReviewArr.length ?? 1)).toFixed(1));

      transaction.update(placeDocRef, {
        reviewArr: newReviewArr,
        ratingResult: newRatingResult,
        galleryImgs: newGalleryArr,
        rating: newRating,
        updateTime: newTime,
      });
      transaction.set(newReviewDoc, newReviewData);
    });

    await allReviewAddDoc(reviewData, newReviewDoc.id);
  } catch (error) {
    await mapDeleteStorageImg(imgUrl);
    console.log("review add failed", error);
    throw error;
  }
};

export const allReviewAddDoc = async (reviewData: ReviewAddDocTypeC, reviewDocId: string) => {
  const { collectionName, docId, authorId, userId, nickName, reviewText } = reviewData;
  const reviewsCollectionRef = collection(fbMapDB, "map", "reviewAll", "reviewList");
  const newAllReviewDoc = doc(reviewsCollectionRef);
  const newAllReviewData = {
    id: newAllReviewDoc.id,
    collectionName,
    docId,
    reviewDocId,
    authorId,
    userId,
    nickName,
    reviewText,
  };

  try {
    await setDoc(newAllReviewDoc, newAllReviewData);
  } catch (error) {
    console.log("review list add failed", error);
  }
};

export const reviewRemove = async (removeData: ReviewRemoveTypeC) => {
  const { collectionName, docId, removeId, removeImg, rating } = removeData;
  const reviewRemoveRef = collection(fbMapDB, "map", "mapData", collectionName, docId, "review");
  const reviewRemoveDoc = doc(reviewRemoveRef, removeId);

  try {
    await runTransaction(fbMapDB, async (transaction) => {
      const removeDocRef = doc(fbMapDB, "map", "mapData", collectionName, docId);
      const removePlaceDocSnapshot = await transaction.get(removeDocRef);

      if (removeImg.length > 0) {
        try {
          await mapDeleteStorageImg(removeImg);
        } catch (imgError) {
          throw new Error("image delete failed");
        }
      }

      if (!removePlaceDocSnapshot.exists()) {
        throw new Error("place doc does not exist");
      }

      const getRemovePlaceData = removePlaceDocSnapshot.data();
      const removeReviewArr = getRemovePlaceData.reviewArr.filter(
        (removeReviewArrItem: StringOnly) => removeReviewArrItem.docId !== removeId
      );
      const removeGallery = getRemovePlaceData.galleryImgs.filter(
        (galleryItem: any) => !removeImg.includes(galleryItem.imgPath)
      );
      const removeRatingResult = parseFloat(((getRemovePlaceData.ratingResult || 0) - rating).toFixed(1));
      const removeRating = removeReviewArr.length > 0
        ? parseFloat((removeRatingResult / removeReviewArr.length).toFixed(1))
        : 0;

      if (removeReviewArr.length === 0 && removeRatingResult === 0) {
        transaction.delete(removeDocRef);
      } else {
        transaction.update(removeDocRef, {
          reviewArr: removeReviewArr,
          ratingResult: removeRatingResult,
          rating: removeRating,
          galleryImgs: removeGallery,
          updateTime: new Date(),
        });
      }

      transaction.delete(reviewRemoveDoc);
    });

    await allReviewRemove(removeData);
  } catch (error) {
    console.log("review remove failed", error);
    throw error;
  }
};

export const allReviewRemove = async (removeData: ReviewRemoveTypeC) => {
  const { removeId, authorId } = removeData;
  const allReviewListRemoveRef = collection(fbMapDB, "map", "reviewAll", "reviewList");
  const findRemoveDoc = query(allReviewListRemoveRef, where("reviewDocId", "==", removeId));
  const querySnapshot = await getDocs(findRemoveDoc);

  if (querySnapshot.empty) {
    throw new Error("all review not found");
  }

  const reviewDoc = querySnapshot.docs[0];
  const reviewData = reviewDoc.data();
  const reviewDocId = reviewData.id;

  if (reviewData.authorId !== authorId) {
    throw new Error("all review remove forbidden");
  }

  const allReviewRemoveDoc = doc(allReviewListRemoveRef, reviewDocId);
  await deleteDoc(allReviewRemoveDoc);
};

export const placeReviewUpdateDoc = async (updateData: any) => {
  const { collectionName, docId, updateDocId, updateKey, likeList } = updateData;

  try {
    const placeUpdateRef = collection(fbMapDB, "map", "mapData", collectionName, docId, "review");
    const placeUpdateDoc = doc(placeUpdateRef, updateDocId);
    const placeUpdateSnapshot = await getDoc(placeUpdateDoc);

    if (placeUpdateSnapshot.exists()) {
      await updateDoc(placeUpdateDoc, {
        [updateKey]: likeList,
      });
    } else {
      console.log("review doc does not exist");
    }
  } catch (error) {
    console.log("review update failed");
  }
};

export const mapImguploadStorage = async (file: File, folder: string = "images", email: string) => {
  const nowTime = new Date().getTime();
  const storageRef = ref(fbMapStorage, `${folder}/${getEmailId(email)}-${file.name}-${nowTime}`);

  try {
    await uploadBytes(storageRef, file);
    return storageRef.fullPath;
  } catch (error) {
    console.error("firebase storage upload failed");
    throw error;
  }
};

export const mapGetStorageImgUrl = async (fullPath: string) => {
  try {
    const storageRef = ref(fbMapStorage, fullPath);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error("firebase storage url failed");
    throw error;
  }
};

export const mapDeleteStorageImg = async (imgListsPaths: string[]) => {
  try {
    const deleteImgPromises = imgListsPaths.map((imgItem) => {
      const imgStorageRef = ref(fbMapStorage, imgItem);
      return deleteObject(imgStorageRef);
    });
    await Promise.all(deleteImgPromises);
    console.log("firebase storage image deleted");
  } catch (error) {
    console.error("storage img delete failed", error);
    throw error;
  }
};
