import { breakpoints, colors, media, shadow, transitions } from "assets/style/Variable";
import { RoomLists } from "components/article/room/RoomLists";
import { SquadRoomNav } from "components/article/room/SquadRoomNav";
import { ArrowBtnLink } from "components/effect/ArrowBtnLink";
import { LoadingAnimation } from "components/effect/LoadingAnimation";
import { Blockquote } from "components/element/Blockquote";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import styled from "styled-components";

export const SquadRoomPage = () => {
  const { isLoading:useLoading, user } = useSelector((state : RootState) => state.storeUserLogin);

  return (
    <StyledSquadRoomPage className="squad-room">
      <div className="squad-room-head">
        <div className="squad-room-info">
          <div className="icon-lists">
            {/* 카테고리 아이콘 여러개 */}
          </div>
          <h2>기록, 정보를 함께하는 공간</h2>
          <p>원하는 주제로 방을 만들어서 공유하세요! 😉</p>
        </div>
      </div>
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
                  <span className="room-total">{ false && 0}</span>
                </h3>
                <Blockquote>
                  <p className="desc">
                    가계부, 달력, 메모장, 여행 등 다양한 기록 정보를 <span>보기 쉽고 직관적</span>으로 표현하며, <br />
                    <span>필요한 기능</span>을 연구하고 요청을 반영해 개발하여 <span>서비스</span>를 제공하는 것을 목표로 하고 있어요. 🙇‍♂️
                  </p>
                </Blockquote>
                <p className="s-desc">
                  회원이 아니어도 공개된 방은 확인할 수 있어요.<br />
                  로그인 후 나만의 공간을 만들어 기록을 시작해보세요! 😁
                </p>
              </div>
              <div className="room-btns">
                {
                  user && (
                    <button 
                      type="button"
                      className="create-room">
                        <span>+ 방 만들기</span>
                    </button>
                  )
                }
              </div>
            </div>
            <div className="room-category">
            {
                useLoading ? (
                  <div className="room-login">
                    <LoadingAnimation />
                  </div>
                )
                : !user 
                ? (
                  <div className="room-login">
                    <p className="title">방 정보를 불러오지 못했어요.🥲</p>
                    <p>정보를 불러오기 위해서 로그인이 필요해요 !</p>
                    <div className="btn-article">
                      <ArrowBtnLink 
                        link={'/member'} 
                        title={'로그인'}
                        altTitle={'로그인하러 가기'}
                        onColor={colors.mSlateBlue} />
                    </div>
                  </div>
                )
                : (
                  <RoomLists />
                )
              }
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
  .squad-room-head {
    display:flex;
    justify-content:center;
    align-items:center;
    width:100%;
    height:30svh;
    min-height:250px;
    background:${colors.darkNavy};
  }
  .squad-room-info{
    color:#fff;
    text-align:center;
    h2{ 
      font-size:28px;
    }
    p {
      margin-top:10px;
    }
  }
  .squad-room-inner {
    position:relative;
    width:100%;
    max-width:${breakpoints.pc}px;
    padding:0 30px;
    margin:0 auto;
  }
  .squad-room-content {
    padding: 30px 0 30px 120px;
    height:200svh;
    border:1px solid blue;
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
        color:${(props)=> props.theme.type === 'dark' ? colors.lineColor : colors.baseBlack};
        & > span {
          font-weight:600;
          color:${colors.mSlateBlue};
        }
      }
      .s-desc{
        margin-top:10px;
        font-size:14px;
      }
    }
    .room-total {
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
  }
  .room-login{
    display:flex;
    flex-direction:column;
    gap:5px;
    justify-content:center;
    align-items:center;
    position:relative;
    height:220px;
    border:1px solid ${colors.mSlateBlue};
    border-radius:5px;
    background:${({theme}) => theme.opacityBg};
    .btn-article {
      margin-top:10px;
    }
  }
  .room-category{
    margin-top:20px;
  }
  
  ${media.minPc}{
    .squad-room-content{
      padding-left:0;
    }
  }
`;