import React from "react";
import { colors, ellipsisStyle, transitions } from "assets/style/Variable";
import styled from "styled-components";
import AddressInfo from "./AddressInfo";
import { ListType } from "./SearchList";
import Bookmark from "./Bookmark";

interface ListItemType {
  item: ListType;
  number:number;
  clickEvent: (e:ListType) => void;
  addressInfoEvent: (e:string) => void;
}
const ListItem = ({ item,  number, clickEvent,addressInfoEvent }:ListItemType) => {
  return(
    <StyleItem 
      className="item">
      <button 
        type="button"
        className="item-btn"
        title={item.place_name}
        onClick={()=>clickEvent(item)}>
        <span className="num">{number}</span>
        <span className="tit">{item.place_name}</span>
      </button>
      <AddressInfo 
        data={item} 
        clickEvent={addressInfoEvent} />
      <Bookmark
        bookmarkItem={item} />
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