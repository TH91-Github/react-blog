
import { KORLocationType, WeatherFirebaseUpdateDocType, WeatherLocationType, WeatherTimeDataType } from "types/weatherType";
import { fbWeatherDB } from "../../firebase";
import { locationCategory } from "utils/kakaomap/common";
import { doc, getDoc, runTransaction, setDoc } from "firebase/firestore";
import { StringOnly } from "types/baseType";

export const getWeatherdepthCollectionDoc = async (firebaseFind:StringOnly) => {
  const {col1, doc1, col2, doc2, col3, doc3} = firebaseFind;
  let docRef;
  if(doc3){
    docRef = doc(fbWeatherDB, col1, doc1, col2!, doc2!, col3!, doc3!);
  }else if(doc2){
    docRef = doc(fbWeatherDB, col1, doc1, col2!, doc2!);
  }else{
    docRef = doc(fbWeatherDB, col1, doc1);
  }
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data(); 
    } else {
      return null;
    }
  } catch (error) { 
    console.error("날씨 문서 가져오기 실패", error);
    return null;
  }
};

// ✅ 날씨 옵션 공통
export const firebaseWeatherOpt = (location:KORLocationType) => ({
  col1: 'weather',
  doc1: location.addr1 ? (locationCategory(location.addr1) || "ETC") : "ETC",
  col2: 'districtCode',
  doc2: `${location.districtCode}`, // 문자 & 숫자 섞여있다.
});

// ✅ firebase 필요 데이터 생성 및 전달
export const firebaseWeatherUpdate = async(location:KORLocationType, data:WeatherLocationType) => {
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
export const updateWeatherDoc = async(firebaseFind:WeatherFirebaseUpdateDocType, weatherData:WeatherLocationType)=>{
  const {col1, doc1, col2, doc2, title,coords} = firebaseFind;
  const doc3Year = weatherData.date.slice(0, 4); // ex - 2024

  // 날짜별 데이터 분리 {...}
  const resultData = weatherData.res?.reduce((acc:{[key: number]: WeatherTimeDataType}, item:WeatherTimeDataType) => {
    const { date, ...rest } = item; 
    acc[Number(date)] = { date, ...rest}; // 최종 업데이트 시간 추가
    return acc;
  }, {});
  const docRef = doc(fbWeatherDB, col1, doc1, col2, doc2); // 행정구역 컬렉션 문서
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
    await runTransaction(fbWeatherDB, async (transaction) => {
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