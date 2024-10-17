import { doc, getDoc } from "firebase/firestore";
import { fbMapDB } from "../../firebase";
import { AppDispatch, actionKakaoDataUpdate } from "store/store";

// firebase - kakao map data 
export const fetchKakaoMapData = async (dispatch:AppDispatch) => {
  try {
    const docRef = doc(fbMapDB, 'kakaomap', 'places');
    const mapData = await getDoc(docRef);
    if (mapData.exists() && mapData.data().places) {
      const data = mapData.data().places;
      dispatch(actionKakaoDataUpdate(data));
      return { success: true, message: "데이터가 성공적으로 업데이트되었습니다." };
    } else {
      console.log("데이터가 없습니다.");
      return { success: false, message: "데이터가 없습니다." };
    }
  } catch (error) {
    console.error("데이터를 가져오는데 실패했습니다.", error);
    return { success: false, message: "데이터를 가져오는데 실패했습니다." };
  }
};