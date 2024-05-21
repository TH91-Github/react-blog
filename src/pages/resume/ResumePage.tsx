import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchResumeData } from 'reducers/sliceActions';
import { CompanyType } from 'reducers/types';
import { RootState, AppDispatch } from 'store/store';
import styled from 'styled-components';

export default function ResumePage() {
  const dispatch: AppDispatch = useDispatch();
  const { data: resumeData, loading, error } = useSelector((state: RootState) => state.resume);

  useEffect(() => {
    console.log(resumeData)
    if (!resumeData) { // 데이터가 없을 때만 fetch
      dispatch(fetchResumeData());
    }
  }, [dispatch, resumeData]);

  if (loading) {
    return <LoadingMessage>데이터를 불러오는 중입니다...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  if (!resumeData) {
    return null;
  }

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

const LoadingMessage = styled.div`
  text-align: center;
  padding: 20px;
  font-size: 18px;
  color: #888;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 20px;
  font-size: 18px;
  color: red;
`;