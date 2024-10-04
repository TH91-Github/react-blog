import { media } from "assets/style/Variable"
import { useEffect, useState } from "react"
import styled from "styled-components"
import { StringOnly } from "types/baseType"
import { PlaceDataTypeC } from "types/kakaoComon"

type PlaceThumbnailType = {
  placeData: PlaceDataTypeC
}
export const PlaceThumbnail = ({placeData}:PlaceThumbnailType) => {
  const [gallery, setGallery] = useState<StringOnly[]>([]);
  const maxSize = 3;

  useEffect(()=>{
    setGallery(placeData.galleryImgs.filter((_, idx)=>idx < maxSize));
  },[placeData.galleryImgs])

  return(
    <StylePlaceThumbnail className={`thumbnail-list ${gallery.length > 1 ? `thumbnail-${gallery.length}`: ''}`}>
      {
        gallery.map((galleryThumbnail, idx) => (
          <div className="thumbnail-item" key={idx}>
            <img src={galleryThumbnail.imgPath} alt={`${galleryThumbnail.userId}님 리뷰 - ${idx}`} />
            {
              (placeData.galleryImgs.length > maxSize && idx+1 === maxSize) && (
                <span className="gallery-sizse">
                  <span className="num">+ {placeData.galleryImgs.length - maxSize}</span>
                </span>
              )
            }
          </div>
        ))
      }
    </StylePlaceThumbnail>
  )
}

export const StylePlaceThumbnail = styled.div`
  display:flex;
  position:relative;
  width:100%;
  height:100%;
  gap:5px;
  &.thumbnail-3 {
    display:grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    .thumbnail-item{
      &:nth-child(1) {
        grid-column-start: 1;
        grid-row-start: 1;
        grid-row-end : 3;
        height:150px;
      }
      &:nth-child(2) {
        grid-row-start: 1;
        grid-row-end : 2;
      }
      &:nth-child(3) {
        grid-row-start: 2;
        grid-row-end : 3;
      }
    }
  }
  .thumbnail-item{
    display:block;
    overflow:hidden;
    position:relative;
    width:100%;
    & > img{
      display:block;
      width:100%;
      height:100%;
      object-fit: cover;
      object-position:center;
    }
  }
  .gallery-sizse {
    position:absolute;
    top:0;
    left:0;
    width:100%;
    height:100%;
    background: rgba(0,0,0,.5);
    .num{
      position:absolute;
      top:50%;
      left:50%;
      font-size:20px;
      color:#fff;
      transform: translate(-50%, -50%);
    }
  }
`;