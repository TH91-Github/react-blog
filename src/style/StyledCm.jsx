import styled, {css, keyframes} from 'styled-components';
import { breakpoints, colors, media} from './Variable';

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
})`
  display:inline-block;
  ${props => `
    ${props.$width && `width:${props.$width}`};
    ${props.$height && `width:${props.$height}`};
  `}
  cursor:pointer;
`;


// ♣ ICON
export const Icon = styled.i`
  display:inline-block;
  position:relative;
  width: ${props => props.width || "20px"};
  height: ${props => props.width || "20px"};
  border-radius: ${props => props.$borderRadius || 0};
  ${props => props.$bg 
    && 
    `
      background: ${props.$bg};
      border:1px solid ${props.$bg};
    `
  };
`;