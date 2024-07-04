import { colors } from "assets/style/Variable";
import styled from "styled-components"
import { MarkerType } from "./KakaoMap";

interface SearchListType {
  searchData: MarkerType[] | null
}
export default function SearchList({searchData}:SearchListType) {
  console.log(searchData)
  /*
    검색 결과 
    전체 및 검색 결과 수
    페이지 단위
    < > 이전 다음 버튼 생성 후 호출 또는
    호출은 여러개 후 리스트 노출만 < > 관리 <-- 요청 없이 이 방법이 더 좋을 수도
  */
  return (
    <StyleSearchList>
      <div>
        {
          searchData?.map((item,idx) => (
            idx < 10 &&
            <p key={idx}>
              {item.content}
            </p>
          ))
        }
      </div>
    </StyleSearchList>
  )
}

const StyleSearchList = styled.div`
  padding:10px;
  border-bottom-left-radius:10px;
  background: ${props => props.theme.type === 'dark' ? colors.baseBlack : colors.originWhite};
  box-shadow: rgba(127,127,127, 0.3) 1px 5px 5px;
`;