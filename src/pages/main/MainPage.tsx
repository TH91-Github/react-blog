import { colors } from "assets/style/Variable"
import styled from "styled-components"


export default function MainPage() : JSX.Element{ 
  return (
    <StyleMain className="main">
      <div className="visual">
        <div className="visual-bord">

        </div>
      </div>
      <div className="content">

      </div>
    </StyleMain>
  )
}


const StyleMain = styled.div`
position:relative;
width:100%;
background: ${colors.gradientCloudyApple};
  .visual {
    display:flex;
    height:100svh;
    &-bord {
      position:relative;
      border-radius: 30px;
      width:80%;
      height:clamp(31.25rem, 80%, );
      min-width
      background-color: rgba(255,255,192,0.1);
      backdrop-filter: blur(10px);
    }
  }
`
