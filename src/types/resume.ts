
export interface ResumeIntroduceType{
  name:string;
  job:string;
  desc:string;
}

export interface SubDescription {
  sTitle: string;
  descList:string[];
}
export interface ResumeProjectType{
  title:string;
  descInfo:SubDescription[];
  skills:string[];
  desc:string[];
  startDate:string;
  endDate:string;
  company:string;
}

export interface ResumeCompanyType{
  nameKo:string,
  nameEn:string;
  desc:string;
  startDate:string;
  endDate:string;
}

export interface ResumeDataType {
  introduce: ResumeIntroduceType;
  project:ResumeProjectType;
  company:ResumeCompanyType;
  startWorkDate:string; 
}