import { breakpoints, colors, transitions } from "assets/style/Variable";
import { HubRoomNav } from "components/article/hubRoom/HubRoomNav";
import { ListBtnActive } from "components/effect/ListBtnActive";
import { useState } from "react";
import styled from "styled-components";

export const HubRoomPage = () => {
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
    <StyledHubRoomPage className="hub-room">
      <div className="hub-room-inner">
        {/* left - 사이드 바 */}
        <div className="hub-room-nav">
          <h2 className="hub-room-title">팀 룸</h2>
          <HubRoomNav />
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
        <div className="hub-room-content">
          <div className="team-room">
            <div className="team-head">
              <div className="title-info">
                <h3 className="title">
                  참여하고 있는 
                  <span className="room-size">0</span>
                </h3>
                <p className="desc"></p>
              </div>
              <div className="room-btns">
                <ListBtnActive 
                  btnData={roomViewType}
                  clickEvent={roomViewActive}/>
                <button 
                  type="button"
                  className="create-team">
                    <span>+ 팀룸 만들기</span>
                </button>
              </div>
            </div>
            <div className={roomViewType.find((roomType,idx) => roomType.active)?.id === 'view-1' ? '':'lists' }>
              dd
            </div>
          </div>
        </div>
      </div>
    </StyledHubRoomPage>
  )
}
const StyledHubRoomPage = styled.div`
  overflow-x:hidden;
  position:relative;
  padding-top:65px;
  background:${(props)=> props.theme.bgColor};
  .hub-room-inner {
    position:relative;
    width:100%;
    max-width:${breakpoints.pc}px;
    padding:0 30px;
    margin:0 auto;
  }
  .hub-room-nav {
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
  .hub-room-content {
    padding: 30px 0 30px 120px;
    height:200svh;
    border:1px solid blue;
  }
  .team-room{
    
  }
  .team-head {
    display:flex;
    justify-content: space-between;
  }
  .title {
    
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
  
  .create-team {
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
`;