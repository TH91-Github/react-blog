import { colors } from "assets/style/Variable";
import styled from "styled-components";

interface BlockquoteType {
  lineColor?:string;
  children: React.ReactNode;
} 
export const Blockquote = ({lineColor, children}:BlockquoteType) => {
  return(
    <StyleBlockquote $lineColor={lineColor ?? colors.mSlateBlue}>
      {children}
    </StyleBlockquote>
  )
}
interface StyleBlockquoteType {
  $lineColor?:string
}
const StyleBlockquote = styled.div<StyleBlockquoteType>`
  width:100%;
  padding:0 14px;
  border-left:3px solid ${({$lineColor})=>$lineColor};
`;
