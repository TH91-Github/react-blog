import mapReviewImg from "assets/images/main/map/map_review.png";
import { breakpoints, colors, media, shadow } from "assets/style/Variable";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { MapImg } from "./MapImg";
import { ArrowBtnLink } from "components/effect/ArrowBtnLink";

export const MapCont = () => {
  return (
    <StyleMapCont>
      <div className="map-inner">
        <div className="map-img">
          <MapImg />
        </div>
        <div className="map-info">
          <h2 className="title">새로운 곳, 기억에 남는 곳</h2>
          <p className="desc">자유롭게 기록하고 <br className="m-br" />나만의 플레이스를 만들어요! 😁</p>
          <div className="btn-article">
            <ArrowBtnLink 
              link={'/Map'} 
              title={'플레이스 만들기'}
              onColor={colors.mSlateBlue} />
          </div>
        </div>
      </div>
      
    </StyleMapCont>
  )
}

const StyleMapCont = styled.div`
  overflow:hidden;
  display:flex;
  align-items:center;
  min-height:100svh;
  padding:80px 0 0;
  .map-inner {
    display:flex;
    width:100%;
    max-width:${breakpoints.pc}px;
    margin:0 auto;
    padding:0 30px;
    .map-img {
      width:60%;
    }
    .map-info{ 
      display:flex;
      flex-direction:column;
      justify-content:center;
      width:40%;
      padding:30px;
      .title{ 
        position:relative;
        &::before{
          position:absolute;
          top:-50px;
          width:100px;
          height:44px;
          background:url(${mapReviewImg}) no-repeat 0 0;
          background-size: cover;
          content:'';
        }
      }
      .desc{
        margin-top:10px;
      }
    }
    .btn-article {
      margin-top:20px;
    }
  }
  ${media.mo}{  
    .map-inner {
      display:block;
      position:relative;
      .map-img {
        width:100%;
      }
      .map-info{
        position:absolute;
        top:50%;
        left:50%;
        width:380px;
        max-width:80%;
        padding:80px 30px 30px;
        border-top: 2px solid rgba(148,148,148, .3);
        border-radius:5px;
        background-color:${props => props.theme.opacityBg};
        backdrop-filter: blur(3px);
        box-shadow: ${shadow.whiteLine}; 
        transform:translate(-50%, -50%);
        text-align:center;
        .title{
          &::before{
            left:50%;
            transform:translateX(-50%);
          }
        }
      }
    }
    
  }
`;