import { KORLocationType, MidForecastDayType, WeatherCategoryListsType } from "types/weatherType";
import { fromToday } from "utils/common";

type MidLandForecastItem = {
  [key: string]: string | number | undefined;
  regId?: string;
};

type MidTaForecastItem = {
  [key: string]: string | number | undefined;
  regId?: string;
};

type MidForecastApiResponse<T> = {
  response?: {
    header?: {
      resultCode?: string;
      resultMsg?: string;
    };
    body?: {
      items?: {
        item?: T[];
      };
    };
  };
};

type MidRegionCode = {
  landRegId: string;
  taRegId: string;
};

const MID_FORECAST_REGION_CODES: Record<string, MidRegionCode> = {
  서울특별시: { landRegId: "11B00000", taRegId: "11B10101" },
  인천광역시: { landRegId: "11B00000", taRegId: "11B20201" },
  경기도: { landRegId: "11B00000", taRegId: "11B20601" },
  강원도: { landRegId: "11D10000", taRegId: "11D10301" },
  충청북도: { landRegId: "11C10000", taRegId: "11C10301" },
  대전광역시: { landRegId: "11C20000", taRegId: "11C20401" },
  세종특별자치시: { landRegId: "11C20000", taRegId: "11C20404" },
  충청남도: { landRegId: "11C20000", taRegId: "11C20401" },
  광주광역시: { landRegId: "11F20000", taRegId: "11F20501" },
  전라남도: { landRegId: "11F20000", taRegId: "11F20501" },
  전북특별자치도: { landRegId: "11F10000", taRegId: "11F10201" },
  전라북도: { landRegId: "11F10000", taRegId: "11F10201" },
  대구광역시: { landRegId: "11H10000", taRegId: "11H10701" },
  경상북도: { landRegId: "11H10000", taRegId: "11H10701" },
  부산광역시: { landRegId: "11H20000", taRegId: "11H20201" },
  울산광역시: { landRegId: "11H20000", taRegId: "11H20101" },
  경상남도: { landRegId: "11H20000", taRegId: "11H20301" },
  제주특별자치도: { landRegId: "11G00000", taRegId: "11G00201" },
  제주도: { landRegId: "11G00000", taRegId: "11G00201" },
};

function getMidForecastKey() {
  return process.env.REACT_APP_WEATHER_MID_KEY || process.env.REACT_APP_WEATHER_KEY;
}

function normalizeServiceKey(serviceKey: string) {
  try {
    return decodeURIComponent(serviceKey);
  } catch (error) {
    return serviceKey;
  }
}

function getLatestMidForecastTmFc() {
  const now = new Date();
  const currentDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10).replace(/-/g, "");
  const currentHourMinute = Number(`${now.getHours().toString().padStart(2, "0")}${now.getMinutes().toString().padStart(2, "0")}`);

  if (currentHourMinute >= 1800) return `${currentDate}1800`;
  if (currentHourMinute >= 600) return `${currentDate}0600`;

  const previousDate = fromToday(-1);
  return `${previousDate}1800`;
}

function getMidRegionCode(location: KORLocationType) {
  return MID_FORECAST_REGION_CODES[location.addr1] || MID_FORECAST_REGION_CODES["서울특별시"];
}

async function fetchMidForecastApi<T>(endpoint: string, query: Record<string, string>) {
  const serviceKey = getMidForecastKey() || "";
  const searchParams = new URLSearchParams({
    serviceKey: normalizeServiceKey(serviceKey),
    pageNo: "1",
    numOfRows: "10",
    dataType: "JSON",
    ...query,
  });

  const response = await fetch(`https://apis.data.go.kr/1360000/MidFcstInfoService/${endpoint}?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error(`중기예보 요청 실패: ${response.status}`);
  }

  const result = await response.json() as MidForecastApiResponse<T>;
  const resultCode = result.response?.header?.resultCode;

  if (resultCode && resultCode !== "00") {
    throw new Error(`중기예보 응답 오류: ${resultCode}`);
  }

  return result;
}

function getLandWeatherText(item: MidLandForecastItem, dayOffset: number) {
  if (dayOffset >= 8) {
    return `${item[`wf${dayOffset}`] ?? "-"}`.trim() || "-";
  }

  const amWeather = `${item[`wf${dayOffset}Am`] ?? ""}`.trim();
  const pmWeather = `${item[`wf${dayOffset}Pm`] ?? ""}`.trim();
  return amWeather || pmWeather || "-";
}

function getRainProbability(item: MidLandForecastItem, dayOffset: number) {
  if (dayOffset >= 8) {
    const value = item[`rnSt${dayOffset}`];
    return value === undefined ? "-" : `${value}%`;
  }

  const amRain = item[`rnSt${dayOffset}Am`];
  const pmRain = item[`rnSt${dayOffset}Pm`];
  const candidates = [amRain, pmRain]
    .map((value) => (value === undefined ? null : Number(value)))
    .filter((value): value is number => value !== null && !Number.isNaN(value));

  if (!candidates.length) return "-";
  return `${Math.max(...candidates)}%`;
}

export function createMidWeatherCategoryList(weatherText: string): WeatherCategoryListsType[] {
  const normalizedText = weatherText.replace(/\s/g, "");

  let sky = "3";
  let pty = "0";

  if (normalizedText.includes("맑")) sky = "1";
  if (normalizedText.includes("흐")) sky = "4";
  if (normalizedText.includes("구름")) sky = "3";
  if (normalizedText.includes("비/눈")) pty = "2";
  else if (normalizedText.includes("눈")) pty = "3";
  else if (normalizedText.includes("비")) pty = "1";
  else if (normalizedText.includes("소나기")) pty = "4";

  return [
    { category: "SKY", value: sky },
    { category: "PTY", value: pty },
  ];
}

export async function getMidWeeklyForecast(location: KORLocationType): Promise<MidForecastDayType[]> {
  const midKey = getMidForecastKey();
  if (!midKey) return [];

  try {
    const { landRegId, taRegId } = getMidRegionCode(location);
    const tmFc = getLatestMidForecastTmFc();

    const [landResponse, taResponse] = await Promise.all([
      fetchMidForecastApi<MidLandForecastItem>("getMidLandFcst", { regId: landRegId, tmFc }),
      fetchMidForecastApi<MidTaForecastItem>("getMidTa", { regId: taRegId, tmFc }),
    ]);

    const landItem = landResponse.response?.body?.items?.item?.[0];
    const taItem = taResponse.response?.body?.items?.item?.[0];

    if (!landItem && !taItem) return [];

    const weeklyDays: MidForecastDayType[] = [];

    for (let dayOffset = 4; dayOffset <= 10; dayOffset += 1) {
      weeklyDays.push({
        date: fromToday(dayOffset),
        weatherText: landItem ? getLandWeatherText(landItem, dayOffset) : "-",
        rainProbability: landItem ? getRainProbability(landItem, dayOffset) : "-",
        TMN: taItem?.[`taMin${dayOffset}`] ? `${taItem[`taMin${dayOffset}`]}` : null,
        TMX: taItem?.[`taMax${dayOffset}`] ? `${taItem[`taMax${dayOffset}`]}` : null,
      });
    }

    return weeklyDays;
  } catch (error) {
    console.log("중기예보 가져오기 실패", error);
    return [];
  }
}
