import React from 'react';
import { SvgCode } from 'assets/style/SVGIcon';
import { InnerStyle } from 'assets/style/StyledCm';
import { colors, media, transitions } from 'assets/style/Variable';
import OtherInfo from 'components/article/resume/OtherInfo';
import ResumeMain from 'components/article/resume/ResumeMain';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchResumeData } from 'reducers/sliceActions';
import { AppDispatch, RootState } from 'store/store';
import styled from 'styled-components';

// Resume 데이터만 reducers를 통해 가져오기 - 테스트 겸 연습용
export default function ResumePage() {
  const { data: resumeData, loading, error } = useSelector((state: RootState) => state.resume);
  const dispatch: AppDispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.useTheme);
  const [sideView, setSideView] = useState<boolean>(false);

  useEffect(() => {
    if (!resumeData) {
      dispatch(fetchResumeData());
    }
  }, [dispatch, resumeData]);

  function toggleSideView(){
    setSideView(prev => !prev);
  }
  
  if (loading) {
    return <LoadingMessage>데이터를 불러오는 중입니다...</LoadingMessage>;
  }
  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }
  if (!resumeData) return null;

  return (
    <StyleWrap className={`resume ${sideView ? 'side-view':''}`}>
      <div className="resume-wrap">
        {/* scale 작아질 본문 내용 */}
        <StyleStudyInner>
          <div className="resume-side">
            <span className="resume-icon">
              <SvgCode $fillColor={theme.color.color} />
            </span>
            <OtherInfo 
              moView={sideView} 
              moSideInfoMore={toggleSideView} 
              useData={resumeData} 
            />
          </div>
          <div className="resume-info">
            <span className="resume-icon">
              <SvgCode $fillColor={theme.color.color} />
            </span>
            <ResumeMain moView={sideView} />
          </div>
        </StyleStudyInner>
      </div>
    </StyleWrap>
  );
}

const StyleWrap = styled.div`
  background: ${props => props.theme.type === 'dark' ? colors.bgSubBlack : colors.baseWhite}; 
  .resume {
    &-icon{
      display:block;
      position:absolute;
      top:0;
    }
    &-side {
      position:relative;
      width:30%;
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
  ${media.mo}{
    .resume {
      &-side {
        width:50px;
        transition:${transitions.base};
        .resume-icon{
          width:54px;
          height:54px;
          transform: translate(27px, 3px);
        }
      }
      &-info {
        width:calc(100% - 50px);
        transition:${transitions.base};
        .resume-icon{
          width:60px;
          height:60px;
          transform: translate(-30px, -2px);
        }
      }
    }
    &.side-view {
      .resume {
        &-side {
          width:calc(100% - 50px);
        }
        &-info{
          width:50px;
        }
      }
    }
  }
`;
const StyleStudyInner = styled(InnerStyle)`
  display:flex;
  padding:70px 0;
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