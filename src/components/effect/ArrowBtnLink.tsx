import { colors, transitions } from "assets/style/Variable";
import { SvgArrow } from "assets/svg/common/CommonSvg";
import { NavLink } from "react-router-dom";
import styled from "styled-components"

interface ArrowBtnLinkType {
  link:string,
  title:string,
  onColor: string,
}
export const ArrowBtnLink = ({link, title, onColor}:ArrowBtnLinkType) => {
  return(
    <StyleArrowBtnLink $bgColor={onColor}>
      <NavLink to={link} title={title} className="btn-link-arrow">
        <span className="txt">{title}</span>
        {
          Array.from({ length:3}, (_) => (
            <span className="arrow"><SvgArrow $fillColor={onColor ?? colors.baseWhite}/></span>
          ))
        }
      </NavLink>
    </StyleArrowBtnLink>
  )
}

type StyleArrowBtnLinkType = {
  $bgColor: string,
}
const StyleArrowBtnLink = styled.div<StyleArrowBtnLinkType>`
  .btn-link-arrow{
    display:inline-block;
    overflow:hidden;
    position:relative;
    padding:8px 15px;
    border-radius:5px;
    transition:${transitions.base};
    border:1px solid ${({$bgColor}) => $bgColor};
    font-size:14px;
    &::before{
      position:absolute;
      top:0;
      left:0;
      width:100%;
      height:100%;
      transition:${transitions.base};
      background:${({$bgColor}) => $bgColor};
      content:'';
    }
    &:hover, &:focus {
      background:${colors.baseWhite};
      padding-right:30px;
      color:${({$bgColor}) => $bgColor};
      &::before{
        left:101%;
      }
      .txt{
        color:${({$bgColor}) => $bgColor};
      }
      .arrow {
        display:block;
      }
    }
    .txt{
      position:relative;
      transition:${transitions.base};
      color:${colors.baseWhite};
    } 
  }
  .arrow {
    display:none;
    position:absolute;
    top:50%;
    width:13px;
    height:13px;
    transform:translateY(-50%);
    opacity:0;
    & > svg{
      position:absolute;
      top:50%;
      transform:translateY(-50%);
    }
    &:nth-child(2){
      right:15px;
      animation: arrow1Ani 1s linear infinite both;
    }
    &:nth-child(3){
      right:10px;
      animation: arrow1Ani 1s .2s linear infinite both;
    }
    &:nth-child(4){
      right:5px;
      animation: arrow1Ani 1s .4s linear infinite both;
    }
    
    @keyframes arrow1Ani {
    0%, 100%{
      opacity:0;
    }
    50%{
      opacity:1;
    }
  }
  }
`;