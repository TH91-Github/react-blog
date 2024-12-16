import styled from "styled-components";
import { StyleProps } from "types/baseType";
import { IconAnimation } from "types/weatherType";

interface MoonIconType extends IconAnimation {
  moonType?: "crescent" | "full"
  isStar?: boolean;
}
export const MoonIcon = ({moonType = "crescent", isStar=true, desc, isAnimation = true}:MoonIconType) => { 
  console.log(isAnimation)
  return( 
    <StyleMoonIcon className={`crescent-moon ${isAnimation ? 'ani':''}`}>
      {
        moonType === 'crescent'
          ? <span className="moon crescent"><img src={require('assets/images/weather/crescent-moon.png')} alt="" /></span>
          : <span className="moon full"><img src={require('assets/images/weather/moon.png')} alt="" /></span>
      }
      {
        isStar && (
          <span className={`star-wrap ${moonType === 'crescent' ? 'm-crescent': 'm-full'}`}>
            <span className="moon-star"></span>
            <span className="moon-star"></span>
          </span>
        )
      }
      {desc && <p className="blind">{desc}</p>}
    </StyleMoonIcon>
  )
}

const StyleMoonIcon = styled.span<StyleProps>`
  display:block;
  position:relative;
  width:100%;
  height:100%;
  pointer-events:none;
  & span {
    display:block;
    position:absolute;
  }
  .moon {
    z-index:2;
    top:50%;
    left:50%;
    width: 100%;
    height: 100%;
    transform: translate(-50%, -50%);
    &.crescent {
      width:80%;
      height:80%;
      img {
        width:auto;
        height:100%;
        transform: rotate(-30deg);
      }
    }
  }
  .star-wrap {
    width:100%;
    height:100%;
    .moon-star {    
      &:first-child{
        width:17.6%;
        height:17.86666666667%;
        background: url('${require('assets/images/weather/star-1.png')}') no-repeat;
        background-size: cover;
      }
      &:last-child {
        width:23.73333333333%;
        height:22.66666666667%;
        background: url('${require('assets/images/weather/star-2.png')}') no-repeat;
        background-size: cover;
      }
    }
    &.m-crescent{
      .moon-star {
        &:first-child{ 
          top:64%;
          left:7%;
        }
        &:last-child {
          top:15%;
          right:0;
        }
      }
    }
    &.m-full {
      .moon-star {
        &:first-child{ 
          top:18%;
          left:9%;
        }
        &:last-child {
          top:35%;
          right:3%;
        }
      }
    }
  }

  &.ani {
    .star-wrap {
      .moon-star {    
        &:first-child{
          animation: aniMoonStar 2.5s infinite;
        }
        &:last-child {
          animation: aniMoonStar 2.5s 1s infinite;
        }
      }
    }
    @keyframes aniMoonStar {
      0%, 100%{transform:scale(1); opacity:1;}
      50% {transform:scale(0.7);opacity:0;}
    }
  }
  
`;

