export interface KORLocationType {
  districtCode: string | number; // 문자열 또는 숫자 가능
  addr1: string;
  addr2?: string;
  addr3?: string;                // 주소는 문자열
  x: string | number;                    // x, y는 숫자로 변환 가능하면 number로 변경 가능
  y: string | number;
  longH: string | number;
  longM: string | number;
  longS: string | number;
  latH: string | number;
  latM: string | number;
  latS: string | number;
  longS100: string | number;
  latS100: string | number;
  updateETC?: string | number
}

export type RequestNameType = 'getUltraSrtNcst' | 'getUltraSrtFcst' | 'getVilageFcst';
export interface WeatherCategoryListsType {
  value: string | number;
  obsrValue?: string | number;
  category: string | number;
}
export interface WeatherTimeListType {
  time: string | number;
  categoryList: WeatherCategoryListsType[];
}
export interface WeatherTimeDataType { // day 날씨 정보
  date: string | number;
  TMN: string | null;
  TMX: string | null;
  timeLists: WeatherTimeListType[];
  getUltraSrtNcst: number | string;
  getUltraSrtFcst: number | string;
  getVilageFcst: number | string;
}

// 해당 지역 날씨 데이터 타입
export interface WeatherLocationType { 
  baseUpdate: number | string,
  date: string,
  res:WeatherTimeDataType[],
  xy: {
    nx:number,
    ny:number,
  }
}

export interface WeatherApiDataType {
  [key:string]: string | number;
}
// 기상청 요청 API type
interface WeatherApiResponseBody {
  dataType: string;
  items: {
    item: WeatherApiDataType[]; // 아이템의 구체적인 타입을 알면 정의
  };
  numOfRows: number;
  pageNo: number;
  totalCount: number;
};

interface WeatherApiResponseHeader {
  resultCode: string;
  resultMsg: string;
};

export interface WeatherApiResponseType {
  response: {
    body: WeatherApiResponseBody;
    header: WeatherApiResponseHeader;
  };
};
export interface WeatherFirebaseUpdateDocType {
  title:string;
  coords:{
    nx:number;
    ny:number;
  }
  col1:string;
  col2:string;
  doc1:string;
  doc2:string;
}