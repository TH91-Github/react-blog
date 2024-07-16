// SearchList
import { colors, transitions } from "assets/style/Variable";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import styled from "styled-components";
import { mapDataType, MarkerType } from "types/kakaoComon";
import ListItem from "./ListItem";
interface SearchListType {
  searchData: mapDataType
}
export interface ListType extends MarkerType {
  detailOpen: boolean
} 
export default function SearchList({searchData}:SearchListType) {
  const useLocation = useSelector((state : RootState) => state.storeLocation);
  const [markerList, setMarkerList] = useState<ListType[]>([]);
  const addressText = useLocation.address ? useLocation.address.address_name.split(' ').slice(1, 3).join(' ') : '현재 위치를 불러올 수 없습니다.';

  // 검색 결과 리스트 업데이트
  useEffect(()=>{
    const addressList = searchData.markerList?.map(item => ({ ...item, detailOpen: false }))
    setMarkerList(addressList)
  },[searchData.markerList])

  // 목록 클릭
  const handleItemClick = (itemData:MarkerType) => {
    // console.log(itemData)
  }
  // 상세 주소 팝업
  const handleAddressDetailPopup = useCallback((detailID:string) =>{
    setMarkerList(
      prev => prev.map(
        item => item.id === detailID 
        ? {...item, detailOpen: !item.detailOpen}
        : {...item, detailOpen: false}
      )
    )
  },[])
  // 북마크
  const handleBookmarkClick = (e:string) => {
    console.log('클릭')
  }
  return (
    <StyleSearchList>
      <div className="location">
        <p className="tit">
          📌 <span className="blind">현재 위치</span> 
          {addressText}
        </p>
        <span className="desc">⚠️ 현재 위치와 다를 수 있습니다.</span>
      </div>
      <div className="search-list">
        <ul>
          {
            markerList?.map((item,idx) => (
              <ListItem
                item={item}
                number={idx+1}
                clickEvent={handleItemClick}
                addressInfoEvent={handleAddressDetailPopup}
                bookmarkEvent={handleBookmarkClick}
                key={idx} />
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
    .tit{
      font-size:14px;
    }
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
    & > ul > li{
      position:relative;
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
`;