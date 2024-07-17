import styled from "styled-components"
import AddressInfo from "./AddressInfo";
import Bookmark from "components/element/Bookmark";
import { colors, transitions } from "assets/style/Variable";
import React from "react";
import { ListType } from "./SearchList";
import { useSelector } from "react-redux";
import { RootState } from "store/store";

interface ListItemType {
  item: ListType;
  number:number;
  clickEvent: (e:ListType) => void;
  addressInfoEvent: (e:string) => void;
  bookmarkEvent: (e:string) => void;
}

const ListItem = ({
  item, 
  number, 
  clickEvent,
  addressInfoEvent,
  bookmarkEvent
}:ListItemType) => {
  const {loginState,user} = useSelector((state : RootState) => state.storeUserLogin);
  console.log('list')
  console.log(user)

  const handleBookmarkClick = (eId:string) => {
    
    console.log(item)
    console.log(loginState)
  }
  
  /*
    유저 정보가 있을시 - 로그인
    유저 bookmarkData - 내장소 있는지 없다면 내장소 추가
    내장소 데이터가 있다면 위치 값 비교 
    // 다르다면 추가 같다면 삭제
    const map = new Map();
    map.set('a', (map.get('a') || {test:'111'}));

  */
  return(
    <StyleItem 
      className="item">
      <button 
        type="button"
        className="item-btn"
        onClick={()=>clickEvent(item)}>
        <span className="num">{number}</span>
        <span className="tit">{item.content}</span>
      </button>
      <AddressInfo 
        data={item} 
        clickEvent={addressInfoEvent}/>
      <Bookmark
        itemKey={item.id} 
        bgColor={colors.subTextColor} 
        clickEvent={handleBookmarkClick}/>
    </StyleItem>
  )
}
export default React.memo(ListItem, (prevProps, nextProps) => {
  return (
    prevProps.item.detailOpen === nextProps.item.detailOpen &&
    prevProps.item.content === nextProps.item.content
  );
});

const StyleItem = styled.li`
  padding:10px 15px;
  font-size:16px;
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
    .tit {
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
  .bookmark-btn {
    display:block;
    position:absolute;
    top:15px;
    right:10px;
    width:15px;
  }
`;