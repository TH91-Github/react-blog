// SearchList
import { colors } from "assets/style/Variable";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import styled from "styled-components";
import { MapDataType, MarkerType } from "types/kakaoComon";
import ListItem from "./ListItem";

interface SearchListType {
  searchData: MapDataType
}
export interface ListType extends MarkerType {
  detailOpen: boolean;
  isBookmark: boolean;
} 
export default function SearchList({searchData}:SearchListType) {
  const useLocation = useSelector((state : RootState) => state.storeLocation);
  const {user} = useSelector((state: RootState) => state.storeUserLogin);
  const [markerList, setMarkerList] = useState<ListType[]>([]);
  const addressText = useLocation.address ? useLocation.address.address_name.split(' ').slice(1, 3).join(' ') : '현재 위치를 불러올 수 없습니다.';

  // 검색 결과 리스트 업데이트
  useEffect(()=>{
    let addressList = searchData.markerList?.map(item => ({ ...item, detailOpen: false, isBookmark:false }))
    if(user){
      const userBookmark = user.kakaoMapData?.map(item => item.id)
      addressList = addressList.map(item => {
        return userBookmark?.includes(item.id) ? {...item, isBookmark: !item.isBookmark} : item
      })
    }
    setMarkerList(addressList)
  },[searchData.markerList,user])

  // 목록 클릭
  const handleItemClick = (itemData:MarkerType) => {
    const {lat, lng} = itemData.position;
    const pointer = new kakao.maps.LatLng(lat, lng)
    if (searchData.mapRef) {
    const projection = searchData.mapRef.getProjection();
    const newCenterPoint = projection.pointFromCoords(pointer);
    newCenterPoint.x += -135; // 메뉴 리스트 가로 만큼 재이동
    const newCenterCoords = projection.coordsFromPoint(newCenterPoint);
    // 클릭 장소 중심 이동
    searchData.mapRef.setCenter(newCenterCoords);
    }
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
  
  // 리스트 북마크 아이콘 업데이트
  const handleBookmarkClick = useCallback((eId:string) => {
    setMarkerList(prev => prev.map(
      item => item.id === eId ? { ...item, isBookmark: !item.isBookmark } : item
    ))
  },[setMarkerList])

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
  position:relative;
  z-index:102;
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
    overflow-y: auto;
    & > ul > li{
      position:relative;
    }
    &::-webkit-scrollbar {
      width:5px;
    }
    &::-webkit-scrollbar-thumb {
      background: ${colors.navy};
      border-radius: 5px;
    }
    &::-webkit-scrollbar-track {
      background: ${colors.baseWhite};
    }
  }
`;