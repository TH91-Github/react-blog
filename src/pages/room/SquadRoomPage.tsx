import { breakpoints, colors, media, shadow, transitions } from "assets/style/Variable";
import { FolderList } from "components/article/room/FolderLists";
import { RoomLists } from "components/article/room/RoomLists";
import { SquadRoomNav } from "components/article/room/SquadRoomNav";
import { ListBtnActive } from "components/effect/ListBtnActive";
import { useState } from "react";
import styled from "styled-components";

export const SquadRoomPage = () => {
  const [roomlistsView, setRoomlistsView] = useState([
    { id:'view-folder', title:'폴더로 보기', active:true, },
    { id:'view-lists', title: '리스트로 보기', active:false,}
  ])

  // ✅ 리스트 보여주는 방식 변경
  const roomViewActive = (activeNumber:number) => {
    setRoomlistsView(prev =>
      prev.map((prevItem, idx) => ({
        ...prevItem,
        active: idx === activeNumber,
      }))
    );
  }
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
                <ListBtnActive 
                  btnData={roomlistsView}
                  clickEvent={roomViewActive}/>
                <button 
                  type="button"
                  className="create-room">
                    <span>+ 팀룸 만들기</span>
                </button>
              </div>
            </div>
            <div 
              className="room-category">
              <RoomLists roomlistsView={roomlistsView} />
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
  background:${(props)=> props.theme.bgColor};
  &::before{
    position:absolute;
    width:100%;
    height:250px;
    background:${(props)=> props.theme.type ==='dark' ? colors.baseWhite : colors.baseBlack};
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
  .room-wrap{
    
  }
  .room-head {
    display:flex;
    justify-content: space-between;
  }
  .title-info {
    .title{
      font-size:24px;
      color:${(props)=> props.theme.colorChange};
    } 
    .desc{
      margin-top:10px;
      font-size:14px;
      color:${colors.lineColor};
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
    border:1px solid ${colors.blue};
    background:${colors.blue};
    font-size:14px;
    color:${colors.originWhite};
    transition: ${transitions.base};
    &:hover, &:focus {
      background:${colors.originWhite};
      color:${colors.blue};
    }
  }
  .room-category{
    margin-top:10px;
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