// resume - firebase - document와 필드 구조
export interface CompanyType {
  name: string;
  entry: string;
  resignation: string;
}

export interface DocumentType {
  name: string;
  company: CompanyType[];
}

export interface ResumeState {
  data: DocumentType | null;
  loading: boolean;
  error: string | null;
}