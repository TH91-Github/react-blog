import { breakpoints, colors, media, shadow, transitions } from "assets/style/Variable";
import { FolderList } from "components/article/room/FolderLists";
import { SquadRoomNav } from "components/article/room/SquadRoomNav";
import { ListBtnActive } from "components/effect/ListBtnActive";
import { useState } from "react";
import styled from "styled-components";

export const SquadRoomPage = () => {
  const [roomViewType, setRoomViewType] = useState([
    { id:'view-1', title:'폴더로 보기', active:true, },
    { id:'view-2', title: '리스트로 보기', active:false,}
  ])

  // ✅ 리스트 보여주는 방식 변경
  const roomViewActive = (activeNumber:number) => {
    setRoomViewType(prev =>
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
        <div className="squad-room-nav">
          <h2 className="squad-room-title">팀 룸</h2>
          <SquadRoomNav />
          <span>
            {/* 홈에 있을 경우 전체 팀룸 보여주기. */}
            <button 
              type="button">
              <span>홈</span> 
            </button>
          </span>
          <ul>
            <li>
              알림
            </li>
            <li>
              캘린더
            </li>
            <li>
              여행
            </li>
            <li>
              가계부
            </li>
          </ul>
        </div>
        {/* center - content */}
        <div className="squad-room-content">
          <div className="room-wrap">
            <div className="room-head">
              <div className="title-info">
                <h3 className="title">
                  함께 하고 있는 방
                  <span className="room-size">{ false && 0}</span>
                </h3>
                <p className="desc">함께 공간을 만들어서 공유하세요! 😉</p>
              </div>
              <div className="room-btns">
                <ListBtnActive 
                  btnData={roomViewType}
                  clickEvent={roomViewActive}/>
                <button 
                  type="button"
                  className="create-room">
                    <span>+ 팀룸 만들기</span>
                </button>
              </div>
            </div>
            <div 
              className={`room-category ${roomViewType.find(roomType => roomType.active)?.id === 'view-1' ? '':'lists'}`}>
              <div className="room-lists">
                {/* 여행 */}
                <div className="room-lists-item">
                  <FolderList />
                </div>
                {/* 금전 */}
                <div className="room-lists-item">
                  <FolderList />
                </div>
                {/* 캘린더 */}
                <div className="room-lists-item">
                  <FolderList />
                </div>
              </div>
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
  .squad-room-nav {
    display:flex;
    justify-content:center;
    flex-direction: column;
    align-items:center;
    position:fixed;
    top:0;
    left:0;
    padding:0 0 0 30px;
    height:100%;
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
  .room-lists {
    display:flex;
    gap:30px;
    width:max-content;
    &-item{ 
      width:200px;
    }
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