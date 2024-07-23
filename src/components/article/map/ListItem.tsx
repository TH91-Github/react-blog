import { colors, transitions } from "assets/style/Variable";
import Bookmark from "components/element/Bookmark";
import React from "react";
import styled from "styled-components";
import AddressInfo from "./AddressInfo";
import { ListType } from "./SearchList";

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

  const handleBookmarkClick = (eId:string) => {
    bookmarkEvent(eId)
  }
  console.log(item.id)
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
        clickEvent={addressInfoEvent}/>
      <Bookmark
        itemKey={item.id} 
        bgColor={item.bookmark?colors.purple :colors.subTextColor} 
        clickEvent={handleBookmarkClick}/>
    </StyleItem>
  )
}
export default React.memo(ListItem, (prevProps, nextProps) => {
  return (
    prevProps.item.detailOpen === nextProps.item.detailOpen &&
    prevProps.item.place_name === nextProps.item.place_name && 
    prevProps.item.bookmark === nextProps.item.bookmark
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