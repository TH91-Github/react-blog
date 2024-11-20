
import { WeatherLocation } from "types/weatherType";
import { fbWeatherDB } from "../../firebase";
import { locationCategory } from "utils/kakaomap/common";

// ✅ 날씨 옵션 공통
export const firebaseWeatherOpt = (location:WeatherLocation) => ({
  DB: fbWeatherDB,
  col1: 'weather',
  doc1: location.addr1 ? (locationCategory(location.addr1) || "ETC") : "ETC",
  col2: 'districtCode',
  doc2: `${location.districtCode}`, // 문자 & 숫자 섞여있다.
});