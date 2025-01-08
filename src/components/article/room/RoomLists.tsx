import { roomCategory } from "pages/room/roomData";
import styled from "styled-components";
import { FolderList } from "./FolderLists";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Carousel from "components/element/Carousel";




export const RoomLists = () =>{

  return(
    <StyleRoomLists className="room-lists">
      <Carousel
        carouselOpt={{
          slidesPerView: 'auto',
          spaceBetween: 20,
          navigation:true,
          pagination: { clickable: true },
          virtual:true,
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
  .carousel-item {
    width:200px;
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