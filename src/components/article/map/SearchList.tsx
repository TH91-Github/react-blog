
import styled from "styled-components";
import CurrentLocation from "./CurrentLocation";
import { mapDataType } from "types/kakaoComon";

interface SearchListType {
  searchData: mapDataType | null
}
export default function SearchList({searchData}:SearchListType) {
  /*
    검색 결과 
    전체 및 검색 결과 수
    페이지 단위
    < > 이전 다음 버튼 생성 후 호출 또는
    호출은 여러개 후 리스트 노출만 < > 관리 <-- 요청 없이 이 방법이 더 좋을 수도
  */
  return (
    <StyleSearchList>
      <CurrentLocation />
      <div>
        {
          searchData && searchData.markerList.map((item,idx) => (
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
`;