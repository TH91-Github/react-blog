import { colors, transitions } from "assets/style/Variable"
import { SvgEdit, SvgRemove, SvgUser } from "assets/svg/common/CommonSvg"
import { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { actionAlert, AppDispatch, RootState } from "store/store"
import styled from "styled-components"
import { UserDataType } from "types/baseType"
import { dateChange, partialUndisclosed } from "utils/common"
import { ManagerRank } from "./ManagerRank"

interface UsersBoardListsType {
  data:UserDataType[]
}
export const UsersBoardLists = ({data}:UsersBoardListsType) => {
  const { user } = useSelector((state: RootState) => state.storeUserLogin);
  const dispatch = useDispatch<AppDispatch>();

  const disabled = useCallback((message:1 | 2) =>{
    const loginMessage = '로그인(관리자 등급 이상) 후 이용 가능해요. 😁';
    const rankMessage = '관리자 등급 이상 가능해요..! 🙏';

    dispatch(actionAlert({titMessage:message ===1 ? loginMessage:rankMessage, isPopup:true, autoClose:2000}))
  },[dispatch]);
  // user 정보 수정
  const handleEdit = () =>{
    if(!user) disabled(1)
    if(user && Number(user.rank) < 3) disabled(2);
  }
  // user 삭제
  const handleRemove = () =>{
    if(!user) disabled(1)
    if(user && Number(user.rank) < 3) disabled(2);
  }

  return(
    <StyleUsersBoardLists>
      <div className="board-head">
        <div className="info">
          <span className="profile"></span>
          <span className="email">이메일</span>
          <span className="nickName">닉네임</span>
          <span className="rank">회원등급</span>
          <span className="state">상태</span>
          <span className="time">가입시간</span>
        </div>
        <div className="change">
          <span>편집</span>
        </div>
      </div>
      <ul>
        {
          data.map((listsItem:UserDataType, idx:number) =>(
            <li className="list-item" key={idx}>
              <div className="info">
                <span className="profile">
                  {
                    listsItem.profile !== '-' 
                      ? <img src={listsItem.profile} alt="프로필 사진" />
                      : <i><SvgUser $fillColor={colors.mSlateBlue} /></i>
                  }
                  <span className="img"></span>
                </span>
                <span className="email">{partialUndisclosed(listsItem.email)}</span>
                <span className="nickName">{partialUndisclosed(listsItem.nickName)}</span>
                <span className="rank">{<ManagerRank rank={listsItem.rank} />}</span>
                <span className="state">
                  <span className={`icon ${listsItem.permission?'':'not'}`}>{listsItem.permission ? 'ㅇㅇ': '비승인'}</span>
                </span>
                <span className="time">{dateChange('y2mdwhm',listsItem.signupTime)}</span>
              </div>
              <div className="btn-article change">
                <button
                  type="button"
                  className="btn edit"
                  onClick={handleEdit}>
                    <span className="icon"><SvgEdit $fillColor={colors.mSlateBlue }/></span>
                    <span className="blind">수정</span>
                </button>
                <button
                  type="button"
                  className="btn remove"
                  onClick={handleRemove}>
                    <span className="icon"><SvgRemove $fillColor={colors.mSlateBlue } /></span>
                    <span className="blind">삭제</span>
                </button>
              </div>
            </li>
          ))
        }
      </ul>
    </StyleUsersBoardLists>
  )
}

const StyleUsersBoardLists = styled.div`
  overflow:hidden;
  border:1px solid ${colors.lineColor};
  border-radius:5px;
  .board-head {
    display:flex;
    align-items:center;
    justify-content: space-between;
    padding:5px 15px;
    background:${colors.mSlateBlue};
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
      &.profile{
        width:30px;
      }
      &.email{
        width:220px;
      }
      &.state{
        width:70px;
      }
      &.time{
        width:110px;
      }
    }
  }
  .list-item{
    .profile {
      position:relative;
      width:30px;
      height:30px;
      & > i {
        overflow:hidden;
        display:block;
        position:relative;
        width:100%;
        height:100%;
        border-radius:50%;
        border:1px solid ${colors.lineColor};
        background:${colors.baseWhite};
        & > svg { 
          position:absolute;
          left:50%;
          bottom:0;
          width:24px;
          height:24px;
          transform: translateX(-50%);
        }
      }
    }
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
      &.edit{
        &:hover {
          path {
            stroke: ${colors.yellow};
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