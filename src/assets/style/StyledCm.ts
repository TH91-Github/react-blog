import styled, {css} from 'styled-components';
import { StyleProps } from 'types/baseType';
import { breakpoints, media } from './Variable';

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
    padding: 0 20px;
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