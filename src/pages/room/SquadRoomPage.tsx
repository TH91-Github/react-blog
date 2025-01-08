import { breakpoints, colors, media, shadow, transitions } from "assets/style/Variable";
import { RoomLists } from "components/article/room/RoomLists";
import { SquadRoomNav } from "components/article/room/SquadRoomNav";
import styled from "styled-components";

export const SquadRoomPage = () => {

  return (
    <StyledSquadRoomPage className="squad-room">
      <div className="squad-room-inner">
        {/* left - 사이드 바 */}
        <SquadRoomNav />
        {/* center - content */}
        <div className="squad-room-content">
          <div className="room-wrap">
            <div className="room-head">
              <div className="title-info">
                <h3 className="title">
                  함께 하고 있는 공간
                  <span className="room-size">{ false && 0}</span>
                </h3>
                <p className="desc">함께 공간을 만들어서 공유하세요! 😉</p>
              </div>
              <div className="room-btns">
                <button 
                  type="button"
                  className="create-room">
                    <span>+ 방 만들기</span>
                </button>
              </div>
            </div>
            <div className="room-category">
              <RoomLists />
            </div>
          </div>
        </div>
      </div>
    </StyledSquadRoomPage>
  )
}
const StyledSquadRoomPage = styled.div`
  overflow-x:hidden;
  position:relative;
  padding-top:65px;
  background: ${props => props.theme.type === 'dark' ? colors.bgSubBlack : `linear-gradient(to top, #e6e9f0 0%, #eef1f5 100%)`}; 
  &::before{
    position:absolute;
    width:100%;
    height:250px;
    background-color: ${props => props.theme.type === 'dark' ? 'rgba(205,205,205, .3)': colors.baseWhite}; 
    backdrop-filter: blur(3px);
    box-shadow: ${shadow.whiteLine}; 
    content:'';
  }
  .squad-room-inner {
    position:relative;
    width:100%;
    max-width:${breakpoints.pc}px;
    padding:0 30px;
    margin:0 auto;
  }
  .squad-room-content {
    padding: 60px 0 30px 120px;
    height:200svh;
    border:1px solid blue;
  }
  .room-head {
    display:flex;
    justify-content: space-between;
  }
  .title-info {
    .title{
      font-size:24px;
    } 
    .desc{
      margin-top:10px;
      font-size:14px;
      color:${(props)=> props.theme.type === 'dark' ? colors.lineColor : colors.baseBlack};
    }
  }
  .room-size {
    font-size:14px;
    margin-left:5px;
  }
  .room-btns{
    display:flex;
    gap:10px;
    align-items:center;
    .btn-lists{
      button {
        font-size:14px;
      }
    }
  }
  .create-room {
    padding:5px;
    border-radius:5px;
    border:1px solid ${colors.mSlateBlue};
    background:${colors.mSlateBlue};
    font-size:14px;
    color:${colors.originWhite};
    transition: ${transitions.base};
    &:hover, &:focus {
      background:${colors.originWhite};
      color:${colors.mSlateBlue};
    }
  }
  .room-category{
    margin-top:20px;
  }
  ${(props)=> props.theme.type === 'dark' && `
    .btn-lists, .create-room {
      box-shadow:${shadow.bgBase};
    }
  `}
  ${media.minPc}{
    .squad-room-content{
      padding-left:0;
    }
  }
`;