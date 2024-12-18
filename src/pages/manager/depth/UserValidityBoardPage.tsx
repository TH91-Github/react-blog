import { LoadingAnimation } from "components/effect/LoadingAnimation";
import styled from "styled-components"
import { userGetDataDoc } from "utils/firebase/member";
import { useDataQuery } from "utils/hook/query";

export const UserValidityBoardPage = () =>{
  const { data, isLoading } = useDataQuery(
    ['managerUserLists'], 
    () => userGetDataDoc('userData'), // () => 사용.
  );
  console.log(data)
  return(
    <StyleUserValidityBoardPage>
      {
        !isLoading
          ? (
            <div className="board">
              <div className="head">
                <h3 className="title">비승인 대기 ID 목록</h3>
                <p className="text">
                  <span className="desc">테스트 및 불필요하게 생성된 계정을 관리하기 위한 목록</span>
                  <span className="s-desc">(인증 없이 가입으로 인한 무분별하게 생성된 계정 관리)</span>
                </p>
              </div>
              <div className="cont">
                
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