
import styled from "styled-components";
import { mapDataType, MarkerType } from "types/kakaoComon";
import { colors, transitions } from "assets/style/Variable";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import AddressInfo from "./AddressInfo";

interface SearchListType {
  searchData: mapDataType
}
export default function SearchList({searchData}:SearchListType) {
  const useLocation = useSelector((state : RootState) => state.storeLocation);
  const addressText = useLocation.address ? useLocation.address.address_name.split(' ').slice(1, 3).join(' ') : '현재 위치를 불러올 수 없습니다.'

  /*
    검색 결과 
    전체 및 검색 결과 수
    페이지 단위
    < > 이전 다음 버튼 생성 후 호출 또는
    호출은 여러개 후 리스트 노출만 < > 관리 <-- 요청 없이 이 방법이 더 좋을 수도
  */
  const handleItemClick = (itemData:MarkerType) => {
    // console.log(itemData)
  }
  return (
    <StyleSearchList>
      <div className="location">
        <p className="tit">
          📌 <span className="blind">현재 위치</span> 
          {addressText}
        </p>
        <span className="desc">⚠️ 현재 위치가 다를 수 있습니다.</span>
      </div>
      <div className="search-list">
        <ul>
          {
            searchData.markerList && searchData.markerList.map((item,idx) => (
              <li 
                className="item"
                key={idx}>
                <button 
                  type="button"
                  className="item-btn"
                  onClick={()=>handleItemClick(item)}>
                  <span className="num">{idx + 1}</span>
                  <span className="tit">{item.content}</span>
                </button>
                <AddressInfo addressData={item!.address}/>
              </li>
            ))
          }
        </ul>
      </div>
    </StyleSearchList>
  )
}

const StyleSearchList = styled.div`
  flex-grow:1;
  overflow:hidden;
  display:flex;
  flex-direction:column;
  gap:20px;
  padding:10px;
  border-bottom-left-radius:10px;
  .location {
    .desc{
      font-size:12px;
      font-weight:300;
      color:${colors.subTextColor};
    }
  }
  .search-list{
    flex-grow:1;
    overflow:hidden;
    overflow-y: scroll;
    & > ul {

    }
    &::-webkit-scrollbar {
      width:8px;
    }
    &::-webkit-scrollbar-thumb {
      background: ${colors.lineColor};
      border-radius: 5px;
    }
    &::-webkit-scrollbar-track {
      background: ${colors.baseWhite};
    }
  }
  .item {
    padding:10px 15px;
    font-size:16px;
  }
  .item-btn{
    overflow:hidden;
    display:flex;
    gap:10px;
    align-items:center;
    position:relative;
    padding:2px 0 3px;
    .num {
      display:inline-block;
      width:20px;
      height:20px;
      border-radius:50%;
      background:${colors.yellow};
      font-size:14px;
      line-height:20px;
      color:${colors.originWhite};
      transition: ${transitions.base};
    }
    &::after{
      position:absolute;
      right:0;
      bottom:0;
      width:calc(100% - 30px);
      height:2px;
      border-radius:2px;
      background:${colors.purple};
      transition: ${transitions.base};
      transform: translateX(100%);
      content:'';
    }
    &:hover, &:focus {
      &::after {
        transform: translateX(0);
      }
      .num {
        background:${colors.purple};
      }
    }
  }
`;