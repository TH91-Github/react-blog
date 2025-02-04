import { breakpoints, colors, media, shadow } from "assets/style/Variable";
import { SvgArrow } from 'assets/svg/common/CommonSvg';
import { Finish } from 'components/article/main/Finish';
import MainVisualIcon from 'components/article/main/MainVisualIcon';
import { MapCont } from 'components/article/main/MapCont';
import { WeatherCont } from 'components/article/main/WeatherCont';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { RootState } from 'store/store';
import styled from "styled-components";
import { rem } from "utils/common";

export default function MainPage() : JSX.Element{ 
  const {user} = useSelector((state : RootState) => state.storeUserLogin);
  
  return (
      <StyleWrap className="main">
        <div className="visual">
          <MainVisualIcon />
          <div className="visual-bord">
            <div className="visual-text">
              <h1 className="title">Story Blog</h1>
              <p className="desc"><span className="text-bg">날씨 정보와 지도를 활용해 <br className="m-br" />여행 계획을 세우고 기록을 남겨보세요.</span></p>

              {/* 공유 룸 작업 완료 후 
              <p className="desc"><span className="text-bg">여행의  순간을 정리하고 <br className="m-br" />공유할 수 있어요! 😁</span></p> */}
              {
                !user && ( 
                  <div className="btn-article">
                    <NavLink 
                      to="/member" 
                      className="text-bg" 
                      title="로그인 하기">
                      <span>로그인 하기</span>
                      {
                        Array.from({ length:2}, (_, idx) => (
                          <span className="arrow" key={idx}><SvgArrow $fillColor={colors.baseBlack}/></span>
                        ))
                      }
                    </NavLink>
                  </div>
                )
              }
            </div>
          </div>
        </div>
        <div className="content">
          <WeatherCont />
          <MapCont /> 
          <Finish />
        </div>
      </StyleWrap>
  )
}

const StyleWrap = styled.div`
  position:relative;
  width:100%;
  background: ${props => props.theme.type === 'dark' ? props.theme.gradientBg : colors.gradientCloudyApple}; 
  color:${(props)=> props.theme.color};
  .moon {
    position:fixed;
    z-index:999;
    top:50%;
    left:50%;
  }
  .visual {
    display:flex;
    justify-content:center;
    align-items:center;
    position:relative;
    height:100svh;
    &-bord {
      position:relative;
      z-index:5;
      width:clamp(${rem(800)}, 90% , ${breakpoints.pc}px);
      height:clamp(${rem(500)}, 90%, ${rem(600)});
      border-top: 2px solid rgba(148,148,148, .3);
      border-radius:5px;
      background-color: rgba(205,205,205, .3);
      backdrop-filter: blur(3px);
      box-shadow: ${shadow.whiteLine}; 
    }
    .visual-text {
      position:absolute;
      right:50px;
      bottom:50px;
      text-align:right;
      .title {
        font-size:${rem(48)};
        color: ${colors.baseWhite};
        text-shadow: ${({theme}) => theme.type === 'dark' ? shadow.textBaseW : shadow.textBase};
      }
      .desc {
        margin-top:14px;
        & + .desc {
          margin-top:5px;
        }
      }
      .text-bg{
        display:inline-block;
        padding:2px 5px;
        border-radius:5px;
        background:${({theme}) => theme.type === 'dark' ? 'transparent' : 'rgba(255,255,255,.3)'  };
        color: ${({theme}) => theme.type === 'dark' ? colors.baseWhite : colors.baseBlack };
        text-shadow: rgba(124, 124, 124, 0.6) 1px 1px 0px;
      }
      .btn-article{
        margin-top:10px;
        & > a { 
          position:relative;
          padding-right:25px;
        }
        .arrow {
          display:block;
          position:absolute;
          top:50%;
          width:12px;
          height:12px;
          transform: translateY(-50%);
          line-height:0;
          &:nth-child(2){
            right:10px;
            animation: arrow1Ani 1s linear infinite both;
          }
          &:nth-child(3){
            right:5px;
            animation: arrow1Ani 1s .2s linear infinite both;
          }
        }
      }
    }
  }
  .info-wrap {
    .title{
      font-size:36px;
    }
    .desc {
      margin-top:10px;
      font-size:18px;
    }
    .btn-article {
      margin-top:20px;
    }
  }
  
  ${media.mo}{
    .visual {
      padding:0 15px;
      &-bord {
        width: 100%;
        height:clamp(${rem(400)}, 80%, ${rem(600)});
      }
      .visual-text {
        width:100%;
        right:auto;
        bottom:100px;
        text-align:center;
        .title {
          font-size:${rem(36)};
        }
        .desc {
          font-size:14px;
          line-height:21px;
        }
        .btn-article{
          margin-top:5px;
          & > a { 
            font-size:14px;
          }
        }   
      }
    }
    .info-wrap {
      .title{
        font-size:28px;
      }
      .desc {
        font-size:16px;
      }
    }
  }
`;
