import { SvgCode } from 'assets/style/SVGIcon';
import { InnerStyle } from 'assets/style/StyledCm';
import { colors } from 'assets/style/Variable';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchResumeData } from 'reducers/sliceActions';
import { RootState, AppDispatch } from 'store/store';
import OtherInfo from 'components/article/resume/OtherInfo';
import styled from 'styled-components';
import UserProfile from 'components/article/resume/UserProfile';
import Career from 'components/article/resume/Career';

export default function ResumePage() {
  const dispatch: AppDispatch = useDispatch();
  const { data: resumeData, loading, error } = useSelector((state: RootState) => state.resume);
  const theme = useSelector((state : RootState) => state.useTheme);

  useEffect(() => {
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
            <OtherInfo useData={resumeData}/>
          </div>
          <div className="resume-info">
            <span className="resume-icon">
              <SvgCode $fillColor={theme.color.color} />
            </span>
            <UserProfile />
            <Career />
          </div>
        </StyleStudyInner>
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
      width:30%;
      padding:350px 30px 30px;
      .resume-icon{
        width:330px;
        height:330px;
        right:0;
        transform: translate(165px, 0);
      }
    }
    &-info {
      overflow:hidden;
      position:relative;
      width:70%;
      z-index:2;
      padding:30px 30px 70px;
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
  display:flex;
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