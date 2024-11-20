import { StringLiteral } from "typescript";

export interface WeatherLocation {
  districtCode: string;
  addr1?: string;
  addr2?: string;
  addr3?: string;
  x: string;
  y: string;
  longH: string;
  longM: string;
  longS: string;
  latH: string;
  latM: string;
  latS: string;
  longS100: string;
  latS100: string;
  updateETC?: string;
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
  body: WeatherApiResponseBody;
  header: WeatherApiResponseHeader;
};