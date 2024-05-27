import styled, {css} from 'styled-components';
import { StyleProps } from 'types/baseType';
import { breakpoints, colors, media } from './Variable';

// css
export const notice = css`
  display:inline-block;
  position:relative;
  padding-left:1em;
  &::before {
    position:absolute;
    top:0;
    left:0;
    content:'※';
  }
`;

export const Button = styled.button.attrs({
  type:'button',
})<StyleProps>`
  display:inline-block;
  ${props => `
    ${props.$width && `width:${props.$width}`};
    ${props.$height && `width:${props.$height}`};
  `}
  cursor:pointer;
`;

export const InnerStyle = styled.div`
  width:100%;
  max-width:${breakpoints.pc}px;
  margin:0 auto;
  padding:0 30px;
  ${media.mo} {
    padding: 0 15px;
  }
`;

// ♣ ICON
export const Icon = styled.i<StyleProps>`
  display:inline-block;
  position:relative;
  width: ${props => props.$width || "20px"};
  height: ${props => props.$height || "20px"};
  border-radius: ${props => props.$borderRadius || 0};
  ${props => props.$bg 
    && 
    `
      background: ${props.$bg};
      border:1px solid ${props.$bg};
    `
  };
`;


export const StyleArrowLeft = styled.button.attrs({
  type:'button',
})<StyleProps>`
  overflow:hidden;
  display:inline-block;
  position:relative;
  width: 30px;
  height: 30px;
  border:1px solid ${props => props.$bg || colors.baseWhite};
  border-radius:3px;
  &::before {
    position:absolute;
    z-index:2;
    top:50%;
    left:50%;
    width: 14px;
    height: 14px;
    margin:-8px 0 0 -7px;
    border: 2px solid ${colors.blue};
    border-left: 0;
    border-top: 0;
    border-radius:0px;
    transform: rotate(135deg);
    transition: all 0.3s ease-in-out;
    content:'';
  }
  &::after {
    position:absolute;
    z-index:2;
    top:50%;
    left:50%;
    width:65%;
    height:2px;
    margin-left:2px;
    border-radius:2px;
    background:${colors.blue};
    transform: translate(-50%, -50%);
    transition: all 0.3s ease-in-out;
    content:'';
  }
  ${media.pc}{
    &:hover, &:focus{
      &::before {
        border-color:${colors.yellow};
      }
      &::after{
        background:${colors.yellow};
        animation: back-arrow-ani .3s ease;
        
      }
    }
  }
  ${media.mo}{
    &:active {
      &::before {
      }
      &::after{
        animation: back-arrow-ani .3s ease;
      }
    }
  }
  @keyframes back-arrow-ani {
    0%{
      transform: translate(100%, -50% );
    }
    100%{
      transform: translate(-50%, -50%);
    }
  }

  .txt{
    position:absolute;
    top:-999px;
    left:-999px;
    opacity:0;
    text-indent:-999px;
  }
`;
