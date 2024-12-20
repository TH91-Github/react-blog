import { colors } from "assets/style/Variable";
import { SvgUserNot } from "assets/svg/common/CommonSvg";
import { UserValidityBoardLists } from "components/article/manager/UserValidityBoardLists";
import { LoadingAnimation } from "components/effect/LoadingAnimation";
import { useUserData } from "pages/member/js/userHook";
import styled from "styled-components";

export const UserValidityBoardPage = () =>{
  const { data, isLoading, updateUserData, removeUserData } = useUserData();

  // 승인
  const handlePass = (idVal:string) => {
    updateUserData(idVal);
  }

  // 계정 삭제
  const handleRemove = (idVal:string) =>{
    removeUserData(idVal);
  }
  
  return(
    <StyleUserValidityBoardPage>
      {
        !isLoading
          ? (
            <div className="board">
              <div className="head">
                <h3 className="title"><i className="icon"><SvgUserNot $fillColor={colors.red} /></i>비승인 대기 ID 목록</h3>
                <p className="text">
                  <span className="desc">테스트 및 불필요하게 생성된 계정을 관리하기 위한 목록</span>
                  <span className="s-desc">(가입 제한, 인증이 없는 회원가입으로 인한 회원 관리)</span>
                </p>
              </div>
              <div className="cont">
                {
                  data?.checkUser
                  ? (
                    <UserValidityBoardLists 
                      data={data.checkUser}
                      passFn={handlePass}
                      removeFn={handleRemove}/>
                  )
                  : (
                    <div className="error">
                      <p className="message">😢 사용자 리스트 정보를 불러오지 못했어요...</p>
                    </div>
                  )
                }
              </div>
            </div>
          )
          : (
            <div>
              <LoadingAnimation />
            </div>
          )
      }
    </StyleUserValidityBoardPage>
  )
}

const StyleUserValidityBoardPage = styled.div`

`; 