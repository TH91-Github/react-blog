import { media } from "assets/style/Variable";
import styled from "styled-components"

interface NavContLayoutType {
  navChildren:React.ReactNode;
  contChildren:React.ReactNode;
  navWidth?:number;
}

// NavContLayout : 왼쪽 nav와 오른쪽 컨텐츠를 다루는 layout 컴포넌트.
export const NavContLayout = ({navChildren,contChildren, navWidth = 250}:NavContLayoutType) =>{
  return( 
    <StyleNavContLayout $navW={navWidth}>
      <div className="nav">
        {navChildren}
      </div>
      <div className="cont">
        {contChildren}
      </div>
    </StyleNavContLayout>
  )
}

export type StyleNavContLayoutType = {
  $navW:number,
}
const StyleNavContLayout = styled.div<StyleNavContLayoutType>`
  display:flex;
  .nav { 
    flex-shrink:0;
    position:relative;
    width:100%;
    max-width:${props => props.$navW}px;
  }
  .cont{
    flex-grow:1;
    border:1px solid blue;
    height:2000px;
  }
  ${media.mo}{

  }
`;