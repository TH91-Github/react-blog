import { SvgCode } from 'assets/style/SVGIcon';
import { InnerStyle } from 'assets/style/StyledCm';
import { colors } from 'assets/style/Variable';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchResumeData } from 'reducers/sliceActions';
import { CompanyType } from 'reducers/types';
import { RootState, AppDispatch } from 'store/store';
import OtherInfo from 'components/article/resume/OtherInfo';
import styled from 'styled-components';
import UserProfile from 'components/article/resume/UserProfile';
import Career from 'components/article/resume/Career';

export default function ResumePage() {
  const dispatch: AppDispatch = useDispatch();
  const { data: resumeData, loading, error } = useSelector((state: RootState) => state.resume);
  const theme = useSelector((state : RootState) => state.useTheme);

  console.log(theme)
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
          <div className="resume-side">
            <span className="resume-icon">
              <SvgCode $fillColor={theme.color.color} />
            </span>
            <OtherInfo />
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
            <span className="resume-icon">
              <SvgCode $fillColor={theme.color.color} />
            </span>
            <UserProfile />
            <Career />
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
  background: ${props => props.theme.type === 'dark' ? colors.bgSubBlack : colors.baseWhite}; 
  .fixed-box{
    position:fixed;
    left:0;
    bottom:0;
  }
  .resume {
    &-icon{
      display:block;
      position:absolute;
      top:0;
    }
    &-side {
      position:relative;
      padding:350px 30px 30px;
      .resume-icon{
        width:330px;
        height:330px;
        right:0;
        // clamp
        transform: translate(165px, 0);
      }
    }
    &-info {
      overflow:hidden;
      position:relative;
      z-index:2;
      height:2000px;
      padding:30px;
      border-radius:5px;
      border-left:1px solid rgba(255,255,255,0.3);
      background: ${props => props.theme.type === 'dark' ? colors.bgSubBlack : colors.baseWhite}; 
      box-shadow: ${props => props.theme.type === 'dark' ? 'rgba(36, 36, 36, .5) -10px 13px 13px;' : 'rgba(127, 127, 127, .5) -5px 8px 10px;'}; 
      .resume-icon{
        left:0;
        width:400px;
        height:400px;
        transform: translate(-200px, -50px);
      }
    }
  }

`;
const StyleStudyInner = styled(InnerStyle)`
  display:grid;
  grid-template-columns: 3fr 7fr;
  margin-top:30px;
  padding:0;
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