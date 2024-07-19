import { SvgLogOut, SvgLogin } from "assets/style/SVGIcon";
import { colors, shadow } from "assets/style/Variable";
import { arrayRemove, auth, deleteUser, doc, fireDB, signOut, updateDoc} from "../../../firebase";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { AppDispatch, RootState, actionUserLogin } from "store/store";
import styled from "styled-components";

export default function UserLogin(){
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  // const userData = useSelector((state : RootState) => state.storeUserLists);
  const {loginState, user} = useSelector((state : RootState) => state.storeUserLogin);
  const theme = useSelector((state : RootState) => state.storeTheme);
  const [myPagelayer, setMyPagelayer] = useState(false);

  const handleMyPageOn = () => { //로그인 시 내정보 간단 레이어 팝업
    setMyPagelayer(prev => !prev);
  }

  useEffect(()=>{ // 그 외 클릭 시 팝업 닫기
    const handleDomClick = (e:MouseEvent) =>{
      const clickTarget = e.target as HTMLElement | null;
      if (!clickTarget?.closest('.user')) {
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

  // 로그인 한 유저 정보 초기화
  const userLoginInit = (loginState: boolean) => {
    const userLoginData = {
      loginState,
      user: null
    };
    dispatch(actionUserLogin(userLoginData));
  }

  // 로그아웃
  const handleLogOut = async () => { 
    try {
      if (loginState) {
        userLoginInit(false);
        await signOut(auth);
        navigate('/');
      }
    } catch (error) {
      console.error("로그아웃 Error", error);
    }
  }
  
  const handleUserRemove = async() => {
    // console.log('계정 삭제');
    // const currentUser = auth.currentUser; // 로그인 정보
    // if (currentUser) {
    //   // user 정보가 많을 경우 filter 보다 splice를 사용해서
    //   const indexToRemove = userData.findIndex(item => item.uid === currentUser.uid && item.email === currentUser.email);
    //   try {
    //     if (indexToRemove !== -1) {
    //       const removeData = [...userData];
    //       const userToRemove = removeData.splice(indexToRemove, 1)[0]; // 제거된 요소 반환

    //       // firestore에서 사용자 정보 제거
    //       const docRef = doc(fireDB, 'thData', 'userData');
    //       await updateDoc(docRef, {
    //         userList: arrayRemove(userToRemove)
    //       });

    //       // firebase - Authentication에서 사용자 계정 삭제
    //       await deleteUser(currentUser).then(() => {
    //         // dispatch(actionUserListUpdate(removeData));
    //         userLoginInit(false);
    //         navigate('/');
    //       }).catch((error) => {
    //         console.log(error.message);
    //       });
    //     }
    //   }catch (error) {
    //     console.error("Error removing document: ", error);
    //   }
    // }
  }

  const handleBlur = (e: React.FocusEvent<HTMLButtonElement>) => {
    const nextFocusEl = e.relatedTarget as HTMLElement;
    if(!nextFocusEl?.closest('.user')){
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
              <div className="user-my">
                {/* my page 준비중 */}
                <div className="my-item">
                  <span className="txt">{user.email}</span>
                </div>
                <div className="my-item">
                  <button 
                    className="btn logout"
                    title="로그아웃 하기"
                    onBlur={handleBlur} 
                    onClick={handleLogOut}>
                    <span className="icon"><SvgLogOut $fillColor={theme.mode === 'light' ? '#000':'#fff'}/></span>
                    <span className="txt">로그아웃</span>
                  </button>
                </div>
                <div className="my-item">
                  <button 
                    className="btn remove"
                    title="계정 삭제"
                    onBlur={handleBlur} 
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
        box-shadow:${shadow.bgBase};
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