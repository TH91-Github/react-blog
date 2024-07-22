import { StringOnly, UserDataType } from "types/baseType";

export interface ThemeState {
  mode:string
  color:StringOnly
}
// 로그인 user 상태
export interface userLoginType {
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