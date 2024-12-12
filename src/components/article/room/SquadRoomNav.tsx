import { colors } from "assets/style/Variable";
import { roomCategory } from "pages/room/roomData";
import styled from "styled-components"

export const SquadRoomNav = () => {
  return (
    <StyleSquadRoomNav>
      <h3 className="blind">Quick Nav</h3>
      <ul>
        {/* 홈에 있을 경우 전체 팀룸 보여주기. */}
        <li>
          <button type="button">
            <span>전체</span>
          </button>
        </li>
        {
          roomCategory.map((categoryItem,dix) =>(
            <li>
              <button 
                type="button"
                title={`${categoryItem.title} 보기`}>
                <span className="tit">{categoryItem.title}</span>
                {
                  (categoryItem.state !== '') && (
                    <span className="state">({categoryItem.state})</span>
                  )
                }
              </button>
            </li>
          ))
        }
        </ul>
    </StyleSquadRoomNav>
  )
}

const StyleSquadRoomNav = styled.div`
  display:flex;
  justify-content:center;
  flex-direction: column;
  align-items:center;
  position:fixed;
  top:0;
  left:0;
  padding:0 0 0 30px;
  height:100%;

  ul {
    li {
      margin-top:5px;
      &:first-child {
        margin-top:0;
      }
    }
  }
  .state {
    font-size:14px;
    color:${colors.subTextColor};
  }
`;