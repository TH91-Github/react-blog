import { colors, transitions } from "assets/style/Variable"
import { SvgCheckPass, SvgRemove } from "assets/svg/common/CommonSvg"
import { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { actionAlert, AppDispatch, RootState } from "store/store"
import styled from "styled-components"
import { UserDataType } from "types/baseType"
import { dateChange, partialUndisclosed } from "utils/common"
import { ManagerRank } from "./ManagerRank"

interface UserValidityBoardListsType {
  data:UserDataType[]
}
export const UserValidityBoardLists = ({data}:UserValidityBoardListsType) => {
  const { user } = useSelector((state: RootState) => state.storeUserLogin);
  const dispatch = useDispatch<AppDispatch>();

  const disabled = useCallback((message:1 | 2) =>{
    const loginMessage = '로그인(관리자 등급 이상) 후 이용 가능해요. 😁';
    const rankMessage = '관리자 등급 이상 가능해요..! 🙏';

    dispatch(actionAlert({titMessage:message ===1 ? loginMessage:rankMessage, isPopup:true, autoClose:2000}))
  },[dispatch]);
  // user 정보 수정
  const handlePass = () =>{
    if(!user) disabled(1)
    if(user && Number(user.rank) < 3) disabled(2);
  }
  // user 삭제
  const handleRemove = () =>{
    if(!user) disabled(1)
    if(user && Number(user.rank) < 3) disabled(2);
  }

  return(
    <StyleUserValidityBoardLists>
      <div className="board-head">
        <div className="info">
          <span className="state">상태</span>
          <span className="email">이메일</span>
          <span className="nickName">닉네임</span>
          <span className="rank">회원등급</span>
          <span className="time">가입시간</span>
        </div>
        <div className="change">
          <span>승인관리</span>
        </div>
      </div>
      <ul>
        {
          data.map((listsItem:UserDataType, idx:number) =>(
            <li className="list-item" key={idx}>
              <div className="info">
                <span className="state">
                  <span className="icon not">비승인</span>
                </span>
                <span className="email">{partialUndisclosed(listsItem.email)}</span>
                <span className="nickName">{partialUndisclosed(listsItem.nickName)}</span>
                <span className="rank">{<ManagerRank rank={listsItem.rank} />}</span>
                <span className="time">{dateChange('y2mdwhm',listsItem.signupTime)}</span>
              </div>
              <div className="btn-article change">
                <button
                  type="button"
                  className="btn pass"
                  title="회원 승인하기"
                  onClick={handlePass}>
                    <span className="icon"><SvgCheckPass $fillColor={colors.navy }/></span>
                    <span className="blind">승인</span>
                </button>
                <button
                  type="button"
                  className="btn remove"
                  title="회원 삭제하기"
                  onClick={handleRemove}>
                    <span className="icon"><SvgRemove $fillColor={colors.navy } /></span>
                    <span className="blind">삭제</span>
                </button>
              </div>
            </li>
          ))
        }
      </ul>
    </StyleUserValidityBoardLists>
  )
}

const StyleUserValidityBoardLists = styled.div`
  overflow:hidden;
  border:1px solid ${colors.lineColor};
  border-radius:5px;
  .board-head {
    display:flex;
    align-items:center;
    justify-content: space-between;
    padding:5px 15px;
    background:${colors.navy};
    font-size:14px;
    color:#fff;
    .change{
      justify-content:center;
    }
  }
  .change {
    display:flex;
    gap:5px;
    flex-shrink: 0;
    width:65px;
  }
  .list-item {
    display:flex;
    align-items:center;
    justify-content: space-between;
    padding:5px 15px;
  }
  .info{
    flex-grow:1;
    display:flex;
    align-items:center;
    gap:10px;
    position:relative;
    width:calc(100% - 65px);
    & > * {
      display:block;
      width:calc((100% - 480px)/2);
      &.state{
        width:70px;
      }
      &.email{
        width:220px;
      }
      &.time{
        width:110px;
      }
    }
  }
  .list-item{
    .state {
      .icon{
        display:block;
        width:50%;
        height:20px;
        border-radius:3px;
        background:${colors.blue};
        font-size:12px;
        text-align:center;
        line-height:20px;
        color:${colors.baseWhite};
        &.not{
          background:${colors.red};
        }
      }
    }
    .time {
      font-size:12px;
    }
  }
  .btn-article{
    .btn {
      display:flex;
      justify-content:center;
      align-items:center;
      position:relative;
      width:30px;
      height:30px;
      .icon {
        position:relative;
        width:20px;
        height:20px;
      }
      path{
        transition: ${transitions.base};
      }
      &.pass{
        &:hover {
          path {
            fill: ${colors.green};
          }
        }
      }
      &.remove{
        &:hover {
          path { 
            fill: ${colors.red};
          }
        }
      }
    }
  }
`;