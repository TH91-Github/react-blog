// resume - firebase - document와 필드 구조
export interface ResumCompanyType {
  name: string;
  entry: string;
  current?: string;
}
export interface ResumeSkillsType {
  [key:string]:number | string
}
// current, github 필드 값은 있으나 오류로 옵셔널 체인징 사용 5/24 
// 캐시 문제일지 이후 삭제 예정
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