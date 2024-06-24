import { SvgLogOut, SvgLogin } from "assets/style/SVGIcon";
import { colors } from "assets/style/Variable";
import { auth, signOut } from "../../../firebase";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { AppDispatch, RootState, actionUserLoginUpdate } from "store/store";
import styled from "styled-components";

export default function UserLogin(){
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const {loginState, user} = useSelector((state : RootState) => state.storeUserLogin);
  const theme = useSelector((state : RootState) => state.storeTheme);
  const [myPagelayer, setMyPagelayer] = useState(false);
  const userMyRef = useRef(null);

  const handleMyPageOn = () => { //로그인 시 내정보 간단 레이어 팝업
    setMyPagelayer(prev => !prev);
  }

  useEffect(()=>{ // 그 외 클릭 시 팝업 닫기
    const handleDomClick = (e:MouseEvent) =>{
      const clickTarget = e.target as HTMLElement | null;
      if (!clickTarget?.closest('.user-my')) {
        setMyPagelayer(false);
      }
    }
    myPagelayer
      ? document.addEventListener("mousedown", handleDomClick)
      : document.removeEventListener("mousedown", handleDomClick)
    return () => {
      document.removeEventListener("mousedown", handleDomClick);
    }
  },[myPagelayer])
  const handleLogOut = async() => { // 로그아웃
    console.log('로그아웃')
    try {
      if(loginState){
        const userLoginData = {
          loginState: false,
          uid: null,
          user: null
        }
        dispatch(actionUserLoginUpdate(userLoginData));
        await signOut(auth);
        navigate('/');
      }
    } catch (error) {
      console.error("로그아웃 Error", error);
    }
  }

  const handleUserRemove = () => {
    console.log('계정 삭제');
  }
  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    const nextFocusEl = e.relatedTarget;
    if(!nextFocusEl?.closest('.user-my')){
      setMyPagelayer(false);
    }
  }
  return(
    <StyleWrap>
      {
        loginState && user
          ?
          <div className="user">
            <button 
              className="user-btn"
              onClick={handleMyPageOn}>
              <span className='nickname'>
                {user.nickName}  
              </span>님
            </button>
            {
              myPagelayer && 
              <div 
                className="user-my"
                ref={userMyRef}
                tabIndex={-1}
                onBlur={handleBlur} >
                {/* my page 준비중 */}
                <div className="my-item">
                  <span className="txt">{user.email}</span>
                </div>
                <div className="my-item">
                  <button 
                    className="btn logout"
                    title="로그아웃 하기"
                    onClick={handleLogOut}>
                    <span className="icon"><SvgLogOut $fillColor={theme.mode === 'light' ? '#000':'#fff'}/></span>
                    <span className="txt">로그아웃</span>
                  </button>
                </div>
                <div className="my-item">
                  <button 
                    className="btn remove"
                    title="계정 삭제"
                    onClick={handleUserRemove}>
                    <span className="txt">계정삭제</span>
                  </button>
                </div>
              </div>
            }
          </div>
          :
          <div className="logIn">
            <NavLink
              to="/member" 
              className="logout-btn"
              title="로그인 하기">
              <span className="icon"><SvgLogin $fillColor={theme.mode === 'light' ? '#000':'#fff'} /></span>
            </NavLink>
          </div>
      }
    </StyleWrap>
  )
}

const StyleWrap = styled.div`
  .user{
    position:relative;
    text-align:right;
    &-btn {
      .nickname {
        font-weight:600;
      }
    }
    &-my{
      position:absolute;
      top:calc(100% + 10px);
      right:0;
      border-radius:5px;
    }
    .my-item {
      margin-top:2px;
      &:first-child {
        & > span, button {
          border-top-left-radius: 10px;
        }
      }
      &:last-child {
        & > span, button {
          border-bottom-left-radius: 10px;
          border-bottom-right-radius: 10px;
        }
      }
      & > span, button {
        display:block;
        padding:10px;
        background: ${props => props.theme.type === 'dark' ? colors.baseBlack : colors.baseWhite}; 
      }
      .btn { 
        display:flex;
        gap:5px;
        justify-content:end;
        align-items:center;
        overflow:hidden;
        position:relative;
        width:100%;
        &:hover, &:focus{
          .txt {
            color:${colors.blue};
          }
          svg { 
            fill:${colors.blue};
          }
        }
        & > *{
          position:relative;
          index:1px;
        }
      }
      .txt {
        font-size:12px;
        font-weight:300;
      }
      .remove {
        .txt {
          font-weight:600;
          color:${colors.red}
        }
      }
    }
  }
`;