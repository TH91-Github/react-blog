import Carousel from "components/element/Carousel";
import { roomCategory } from "pages/room/roomData";
import styled from "styled-components";
import { FolderList } from "./FolderLists";
import { transitions } from "assets/style/Variable";

export const RoomLists = () =>{

  return(
    <StyleRoomLists className="room-lists">
      <Carousel
        carouselOpt={{
          slidesPerView: 'auto',
          spaceBetween: 20,
          navigation:true,
        }}
      >
        {roomCategory.map((categoryItem,idx) => (
          <div className="room-item" key={idx}>
            <h4 className="tit">{categoryItem.title}</h4>
            <FolderList subject={categoryItem}/>
          </div>
        ))}
      </Carousel>
    </StyleRoomLists>
  )
}

const StyleRoomLists = styled.div`
  position:relative;
  &:hover{
    .carousel-btns{ 
      .btn-prev, .btn-next{ 
        transform:translate(0, -50%);
        opacity:1;
      }
    }
  }
  .carousel-item {
    width:200px;
  }
  .carousel-btns{
    & > button {
      display:block;
      position:absolute;
      z-index:1;
      top:50%;
      width:30px;
      height:30px;
      opacity:0;
      transition:${transitions.base};
    }
    .btn-prev{
      left:0;
      transform:translate(-105%, -50%);
      &:focus{
        transform:translate(0, -50%);
        opacity:1;
      }
    }
    .btn-next{
      right:0;
      transform:translate(105%, -50%);
      &:focus{
        transform:translate(0, -50%);
        opacity:1;
      }
    }
  }
  .room-item{
    position:relative;
    width:100%;
    .tit{
      position:absolute;
      z-index:2;
      top:10px;
      right:10px;
      font-size:14px;
    }
  }
`;