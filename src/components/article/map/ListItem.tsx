import { colors, ellipsisStyle, transitions } from "assets/style/Variable";
import Bookmark from "components/element/Bookmark";
import React, { useCallback } from "react";
import styled from "styled-components";
import AddressInfo from "./AddressInfo";
import { ListType } from "./SearchList";
import { actionAlert, actionUserLogin, AppDispatch, RootState } from "store/store";
import { useDispatch, useSelector } from "react-redux";
import { UserBookmarkType } from "types/baseType";
import { collectionDocUpdate } from "utils/firebase/common";

interface ListItemType {
  item: ListType;
  number:number;
  clickEvent: (e:ListType) => void;
  addressInfoEvent: (e:string) => void;
  bookmarkEvent: (e:string) => void;
}
const ListItem = ({ item,  number, clickEvent,addressInfoEvent, bookmarkEvent }:ListItemType) => {
  const dispatch = useDispatch<AppDispatch>(); 
  const {loginState, user} = useSelector((state: RootState) => state.storeUserLogin);

  const handleBookmarkClick = useCallback((eId:string) => {
    const newData = user ? {...user} : null;
    if(loginState && newData){// 로그인 유무
      const duplication = newData.kakaoMapData?.some(item => item.id === eId)
      const myBookmark : UserBookmarkType = { // 등록할 위치 정보
        id: eId,
        title: item.place_name ?? '장소 이름이 없어요😢',
        desc: '',
        bookmark: item ? item :null
      }
      if(newData.kakaoMapData){
        if(duplication){
          newData.kakaoMapData = newData.kakaoMapData.filter(item => item.id !==eId)
        }else{
          newData.kakaoMapData = [...newData.kakaoMapData, myBookmark]
        }
      }else{
        newData.kakaoMapData = [myBookmark]
      }
      dispatch(actionUserLogin({loginState, user: newData}));
      collectionDocUpdate('userData','users',newData.id, 'kakaoMapData', newData.kakaoMapData);
      bookmarkEvent(eId) // marke 리스트 업데이트.
    }else{ // 로그인 해주세요
      dispatch(actionAlert({titMessage:'로그인이 필요해요.. 😥',isPopup:true,ref:null}))
    }
  },[user])
  return(
    <StyleItem 
      className="item">
      <button 
        type="button"
        className="item-btn"
        onClick={()=>clickEvent(item)}>
        <span className="num">{number}</span>
        <span className="tit">{item.place_name}</span>
      </button>
      <AddressInfo 
        data={item} 
        clickEvent={addressInfoEvent} />
      <Bookmark
        itemKey={item.id} 
        bgColor={item.isBookmark ? colors.purple : colors.subTextColor} 
        clickEvent={handleBookmarkClick}/>
    </StyleItem>
  )
}
export default React.memo(ListItem, (prevProps, nextProps) => {
  return (
    prevProps.item.detailOpen === nextProps.item.detailOpen &&
    prevProps.item.place_name === nextProps.item.place_name && 
    prevProps.item.isBookmark === nextProps.item.isBookmark 
  );
});

const StyleItem = styled.li`
  padding:10px 25px 10px 15px;
  border-top:1px solid ${colors.lineColor};
  &:first-child {
    border-top:none;
  }
  .item-btn{
    overflow:hidden;
    display:flex;
    gap:10px;
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
    .tit {
      width:calc(100% - 30px);
      ${ellipsisStyle(2,20)}
      text-align:left;
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
  .address{

  }
  .bookmark-btn {
    display:block;
    position:absolute;
    top:15px;
    right:10px;
    width:15px;
  }
`;