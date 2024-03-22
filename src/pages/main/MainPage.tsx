import { colors } from "style/Variable"
import styled from "styled-components"


export default function MainPage() : JSX.Element{ 
  return (
    <StyleMain>
      MainPage
    </StyleMain>
  )
}


const StyleMain = styled.div`
position:relative;
width:100%;
min-height:100svh;
background: ${colors.gradientCloudyApple};
`
