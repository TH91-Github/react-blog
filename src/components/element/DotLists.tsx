import styled from "styled-components"

interface DotListsType {
  type?:string
  dotColor?:string
}
export default function DotLists({type, dotColor}:DotListsType){
  return (
    <StyleLists className={`dot-lists ${type ? type : ''}`} $dotColor={dotColor || '#000'}>
      <li>한글</li>
    </StyleLists>
  )
}
type dotType={
  $dotColor: string
}
const StyleLists = styled.ul<dotType>`
  & > li{
    position:relative;
    padding-left:12px;
    &::before{
      position:absolute;
      top:7px;
      left:0;
      width:4px;
      height:4px;
      border-radius:50%;
      background:${props => props.$dotColor};
      content:'';
    }    
  }
`;