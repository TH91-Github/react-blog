import styled from "styled-components"
import { FolderList } from "./FolderLists";
import { RoomlistsViewType } from "types/roomType";
import { roomCategory } from "pages/room/roomData";

interface RoomListsType {
  roomlistsView : RoomlistsViewType[]
}
export const RoomLists = ({roomlistsView}:RoomListsType) =>{
  return(
    <StyleRoomLists 
      className={
        `room-lists ${ roomlistsView.find(roomType => roomType.active)?.id === 'view-lists' ? 'view-lists':''}`
      } >
      {
       roomCategory.map((categoryItem,idx) =>(
        <div className="room-item" key={idx}>
          <FolderList subject={categoryItem}/>
        </div>
       )) 
      }
    </StyleRoomLists>
  )
}

const StyleRoomLists = styled.div`
  display:flex;
  gap:30px;
  width:max-content;
  .room-item{ 
    width:200px;
  }
`;