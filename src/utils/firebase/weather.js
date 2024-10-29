// 컬렉션, 문서 1~3에 따라 data 가져오기
export const getdepthCollectionDoc = async (firebaseFind) => {
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
    return null;
  }
};

// 날씨 추가
export const updateWeatherDoc = async(firebaseFind, weatherData)=>{
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
