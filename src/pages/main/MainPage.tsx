import { breakpoints, colors, media, shadow } from "assets/style/Variable"
import styled from "styled-components"
import { rem } from "utils/common"

export default function MainPage() : JSX.Element{ 
  console.log('main')
  return (
      <StyleWrap className="main">
        <div className="visual">
          <div className="visual-bord">
            <div className="visual-text">
              <h1 className="title">Title</h1>
              <p className="desc">sub text</p>
            </div>
          </div>
          <div className="testbox"></div>
        </div>
        <div className="content">

        </div>
      </StyleWrap>
  )
}

const StyleWrap = styled.div`
  position:relative;
  width:100%;
  background: ${props => props.theme.type === 'dark' ? props.theme.gradientBg : colors.gradientCloudyApple}; 
  color:${(props)=> props.theme.color};
  .moon {
    position:fixed;
    z-index:999;
    top:50%;
    left:50%;
  }
  .visual {
    display:flex;
    justify-content:center;
    align-items:center;
    height:100svh;
    &-bord {
      position:relative;
      z-index:5;
      width:clamp(${rem(800)}, 80% , ${breakpoints.pc}px);
      height:clamp(${rem(500)}, 80%, ${rem(600)});
      border-top: 2px solid rgba(148,148,148, .3);
      border-radius:2px;
      background-color: rgba(227,227,227,0.3);
      backdrop-filter: blur(4px);
      box-shadow: ${shadow.whiteLine}; 
    }
    .visual-text {
      position:absolute;
      right:50px;
      bottom:50px;
      text-align:right;
      .title {
        font-size:${rem(48)};
        color:#fff;
        text-shadow: ${shadow.textBase};
      }
      .desc {
        font-size:${rem(18)};
        color:#fff;
        text-shadow: ${shadow.textBase};
      }
    }
    .testbox { 
      position:absolute;
      top:50%;
      left:50%;
      width:100px;
      height:100px;
      background:#000;
    }
  }
${media.mo}{
  .visual {
    &-bord {
      width: 80%;
      height:80%;
      min-height:400px;
    }
  }
}
`;
