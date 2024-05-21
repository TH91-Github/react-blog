import { InnerStyle } from 'assets/style/StyledCm';
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
  if (!resumeData) return null;
  return (
    <StyleWrap className="resume">
      <div className="resume-wrap">

        {/* scale 작아질 본문 내용 */}
        <StyleStudyInner>
          {/* 
            📘 개인 추가 정보
            이메일
            skills 
          */}
          <div className="resume-side">
            <div className="other-info sticky">
              <div className="other-info-item">
                {/* 간단한 추가 설명 */}
                <p>abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz</p>
              </div>
              <div className="other-info-item">
                {/* 전화번호 이메일 sns */}
                텍스트 입력 !!
              </div>
              <div className="other-info-item">
                {/* 스킬 리스트 */}
                skills abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz
              </div>
            </div>
          </div>
          {/* 
            📗 회사 및 작업물 
            이름 & 사진
            간단한 소개
            -------
            경력 - 회사명 입사 마지막(재직중) (캐러셀 버튼 클릭 시 하단 포트폴리오 변경)
            ------
            포트 폴리오 선택된 회사 포트폴리오
            -----------
          */}
          <div className="resume-info">
            <div className="resume-user">
              {/* 이름 & 사진 간단한 소개 */}
            </div>
            <div className="career">
              <div className="company">
                {/* 경력 - 회사명 입사 마지막(재직중) (캐러셀 버튼 클릭 시 하단 포트폴리오 변경) */}
              </div>
              <div className="project">
                {/*  포트 폴리오 선택된 회사 포트폴리오 */}
              </div>
            </div>
          </div>
        </StyleStudyInner>
      </div>


      {/* 임시 정보 박스 */}
      <div className="fixed-box">
        <p>{resumeData.name}</p>
        <p>Company:</p>
        {resumeData.company.map((company: CompanyType, index: number) => (
          <div key={index}>
            <p>Name: {company.name}</p>
            <p>Entry: {company.entry}</p>
            <p>Resignation: {company.resignation}</p>
          </div>
        ))}
      </div>
      
    </StyleWrap>
  );
}

const StyleWrap = styled.div`
  .fixed-box{
    position:fixed;
    left:0;
    bottom:0;
  }
  .profile{
    position:relative;
    border:1px solid red;
  }
  .portfolio{
    position:relative;
    z-index:2;
    height:2000px;
    border-radius:5px;
    border-left:1px solid rbga(255,255,255,.3);
    box-shadow:rgba(127, 127, 127, .5) -10px 13px 13px;
  }


`;
const StyleStudyInner = styled(InnerStyle)`
  display:grid;
  grid-template-columns: 3fr 7fr;
  margin-top:30px;
`;

const LoadingMessage = styled.div`
  position:fixed;
  text-align:center;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 20px;
  font-size: 18px;
  color: red;
`;