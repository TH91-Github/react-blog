import { LayerRefType } from "components/element/LayerPopup";
import { StringOnly, UserDataType } from "types/baseType";
import { MarkerPositionType } from "types/kakaoComon";
import { WeatherLocation } from "types/weatherType";

export interface ThemeState {
  mode:string
  color:StringOnly
}
// 로그인 user 상태
export interface UserLoginType {
  loginState: boolean,
  user: UserDataType | null,
}

// resume - firebase - document와 필드 구조
export interface ResumCompanyType {
  name: string;
  entry: string;
  current?: string;
}
export interface ResumeSkillsType {
  [key:string]:number | string
}
export interface ResumeDocumentType {
  company: ResumCompanyType[];
  name: string;
  phone: string;
  github?: string;
  email?:string;
  skills?: ResumeSkillsType[]
}

export interface ResumeState {
  data: ResumeDocumentType | null;
  loading: boolean;
  error: string | null;
}

export interface AlertCommonType {
  isPopup: boolean;
  titMessage: string;
  txtMessage?: string;
  checkBtn?: boolean,
  confirmState?:boolean,
  autoClose?: number | undefined;
}

export interface WeatherActionType { // 수정 진행중
  data: null | any;
  coords: null | MarkerPositionType;
  location: null | WeatherLocation;
  loading: boolean;
}

export interface TestStateType {
  isOn:boolean;
  arr: any;
}
