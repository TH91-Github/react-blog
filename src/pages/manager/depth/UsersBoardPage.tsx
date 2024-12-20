import { colors } from "assets/style/Variable";
import { SvgUsers } from "assets/svg/common/CommonSvg";
import { UsersBoardLists } from "components/article/manager/UsersBoardLists";
import { LoadingAnimation } from "components/effect/LoadingAnimation";
import { useUserData } from "pages/member/js/userHook";
import styled from "styled-components";


export const UsersBoardPage = () =>{
  const { data, isLoading, removeUserData } = useUserData();

  // user 정보 수정
  const handleEdit = () =>{

  }
  // user 삭제
  const handleRemove = (idVal:string) =>{
    removeUserData(idVal);
  }
  return(
    <StyleUsersBoardPage>
      {
        !isLoading
          ? (
            <div className="board">
              <div className="head">
                <h3 className="title"><i className="icon"><SvgUsers $fillColor={colors.mSlateBlue}/></i>사용자 목록</h3>
                <p className="text">
                  <span className="desc">사용자 계정 관리를 위한 목록</span>
                  <span className="s-desc">(등급, 삭제, 제한, 활동 정보)</span>
                </p>
              </div>
              <div className="cont">
                {
                  data?.userList
                  ? (
                    <UsersBoardLists data={data.userList}/>
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
    </StyleUsersBoardPage>
  )
}

const StyleUsersBoardPage = styled.div`
  
`;