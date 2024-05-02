import { DocumentType, CompanyType, firebaseGetDoc } from "api/firebaseDB/firebaseStore";
import { useEffect, useState } from "react";
import styled from "styled-components";

export default function ResumePage(){
  const [resumeData, setResumeData] = useState<DocumentType | null>(null); // unknown | {받아온 데이터 type}

  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        const data = await firebaseGetDoc('thData','profile'); // 비동기 함수 호출 및 결과 대기
        setResumeData(data); // 결과를 상태에 설정
      } catch (error) {
        console.log(error)
      }
    };

    fetchResumeData(); // 비동기 함수 호출
  }, []);

  console.log(resumeData);
  if(!resumeData) return null

  return (
    <StyleWrap className="resume">
      <p>타이틀</p>
      <p>{resumeData.name}</p>

      <p>Company:</p>
      {resumeData.company.map((company: CompanyType, index: number) => (
        <div key={index}>
          <p>Name: {company.name}</p>
          <p>Entry: {company.entry}</p>
          <p>Resignation: {company.resignation}</p>
        </div>
      ))}
    </StyleWrap>
  );
}

const StyleWrap = styled.div``;