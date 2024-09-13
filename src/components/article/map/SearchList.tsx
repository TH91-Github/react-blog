// SearchList
import { colors, media, transitions } from "assets/style/Variable";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import styled from "styled-components";
import { ListType, MapDataType, MarkerType } from "types/kakaoComon";
import ListItem from "./ListItem";

interface SearchListType {
  searchData: MapDataType,
  listClick: (e:string) => void,
  isMoList:boolean,
  moListClick: () => void,
}
export default function SearchList({searchData, listClick, isMoList, moListClick}:SearchListType) {
  const isMobile = useSelector((state : RootState) => state.mobileChk);
  const useLocation = useSelector((state : RootState) => state.storeLocation);
  const [markerList, setMarkerList] = useState<ListType[]>([]);
  const addressText = useLocation.address ? useLocation.address.address_name.split(' ').slice(1, 3).join(' ') : '현재 위치를 불러올 수 없습니다.';

  // 검색 결과 리스트 업데이트
  useEffect(()=>{
    let addressList = searchData.markerList?.map(item => ({ ...item, detailOpen: false, isBookmark:false }))
    setMarkerList(addressList)
  },[searchData.markerList])

  // 목록 클릭
  const handleItemClick = (itemData:MarkerType) => {
    handleAddressDetailPopup(''); // 상세 주소 팝업 초기화
    listClick(itemData.id) // 선택한 data id 전달
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

  const handleSearchListClose = () => {
    moListClick();
  }

  return (
    <StyleSearchList className={isMoList ? 'active':''}>
      <div className="location">
        <p className="tit">
          📌 <span className="blind">현재 위치</span> 
          {addressText}
        </p>
        <span className="desc">
          ⚠️ 현재 위치와 다를 수 있습니다.<br />
          서비스 준비로 최대 15개 노출됩니다.<br />
          (위치 포함해서 더 정확하게 검색해주세요!!🙏)
        </span>
      </div>
      <div className="search-list">
        <div className="search-list-inner">
          {
            (markerList && markerList.length > 0) 
            ? (
              <ul>
                {
                  markerList?.map((item,idx) => (
                    <ListItem
                      item={item}
                      number={idx+1}
                      clickEvent={handleItemClick}
                      addressInfoEvent={handleAddressDetailPopup}
                      key={idx} />
                  ))
                }
              </ul>
            )
            : (
              <p className="no-results">
                검색된 목록이 없어요.. 🤔
              </p>
            )
          }
        </div>
      </div>
      {
        isMobile && ( 
          <button className="close-btn" onClick={handleSearchListClose}>
            <span className="blind">검색 목록 닫기</span>
          </button>
        )
      }
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
  .search-list {
    overflow:hidden;
    flex-grow:1;
    position:relative;
    padding-top:5px;
    &::before{
      display:block;
      position:absolute;
      z-index:100;
      top:0;
      left:0;
      width:calc(100% - 5px);
      height:1px;
      ${props => props.theme.shadowLine};
      content:'';
    }
  }
  .search-list-inner{
    overflow-y: auto;
    height:100%;
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
  .no-results {
    padding-top:15px;
  }
  ${media.mo}{
    gap:0;
    position:absolute;
    z-index:104;
    top:0;
    left:0;
    width:100%;
    height:calc(100vh - 60px);
    padding:0;
    transform:translateX(-110%);
    transition: ${transitions.base};
    .location{
      padding:15px;
      background: ${props => props.theme.type === 'dark' ? colors.baseBlack : colors.originWhite};
      ${props => props.theme.shadowLine};
    }
    .search-list {
      padding:0 15px;
      background:${props => props.theme.opacityBg};
      backdrop-filter:blur(2px);
      &::before {
        top:-1px;
        width:calc(100%);
      }
    }
    .no-results {
      position:absolute;
      top:50%;
      left:50%;
      padding:4px 8px 5px;
      border-radius:5px;
      background:${props => props.theme.bgColor};
      transform: translate(-50%, -50%);
    }
    &.active {
      transform:translateX(0%);
    }
  }
`;