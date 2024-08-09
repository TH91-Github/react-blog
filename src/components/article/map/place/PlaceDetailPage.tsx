import { colors } from "assets/style/Variable";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import styled from "styled-components";
import { MarkerType, PlacePopStateType } from "types/kakaoComon";
import Bookmark from "../Bookmark";
import PlaceDetailTab from "./PlaceDetailTab";

interface placePopChangeType {
  placeData: PlacePopStateType;
  placePopChange: (e:MarkerType | null) => void; 
}
export interface PlaceType {
  place : MarkerType
}
export default function PlaceDetailPage ({placeData, placePopChange}:placePopChangeType) {
  const { place } = placeData;
  const {address, road_address} = place!.address;
  const { user } = useSelector((state: RootState) => state.storeUserLogin);
  
  const handleCloseClick = () =>{ 
    placePopChange(null);
  }

  const categoryTxt = (string?:string|null|undefined) => {
    const text = string ? string.split(' ') : ' ';
    return text[text.length - 1];
  }
  return (
    <StylePlaceDetail className="place-detail">
      <div className="place-inner">
        <div className="place-head">
          <div className="thumbnail">
            {/* <img src="" alt="" /> */}
            <p className="desc">😅<br />등록된 이미지가 없어요.<br /> 준비중...</p>
          </div>
          <div className="place-tit">
            <p className="tit">{place!.place_name}</p>
            <p className="category-desc">
              { categoryTxt(place!.category_name)} 
            </p>
          </div>
          <div className="place-bookmark">
            <Bookmark bookmarkItem={place!} />
          </div>
        </div>
        <div className="place-cont">
          <PlaceDetailTab place={place} />
        </div>
      </div>
      <button 
        type="button"
        title="상세 닫기"
        className="close-arrow"
        onClick={handleCloseClick} >
        <span className="text">닫기</span>
      </button>
    </StylePlaceDetail>
  )
}

const StylePlaceDetail = styled.div`
  position:relative;
  width:300px;
  height:100%;
  &::before {
    position:absolute;
    top:0;
    left:0; 
    width:100%;
    height:100%;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    background: ${props => props.theme.type === 'dark' ? colors.baseBlack : colors.originWhite};
    ${props => props.theme.shadowLine};
    animation:placeOnBGAni .5s;
    content:'';
  }
  @keyframes placeOnBGAni {
    0% {
      opacity:0;
      transform:translateX(-100%) scaleX(0.1); 
      background:${props => props.theme.opacityBg};
    }
    50%, 100% {
      opacity:1;
      transform:translateX(0) scaleX(1); 
    }
  }
  .place-inner{
    overflow-y:auto;
    position:absolute;
    width:100%;
    height:100%;
    opacity:0;
    animation:placeFadeIn .5s .3s both;
    &::-webkit-scrollbar {
      width:5px;
    }
    &::-webkit-scrollbar-thumb {
      background: ${colors.lineColor};
      border-radius: 5px;
    }
    &::-webkit-scrollbar-track {
      background: ${colors.baseWhite};
    }
  }
  @keyframes placeFadeIn {
    0% {opacity:0;}
    100% {opacity:1;}
  }
  .place-head {
    display:flex;
    flex-wrap: wrap;
    gap:20px;
    padding:10px 10px 0;
  }
  .thumbnail {
    position:relative;
    width:100%;
    height:150px;
    border:1px solid ${colors.lineColor};
    .desc {
      position:absolute;
      top:50%;
      left:50%;
      transform: translate(-50%, -50%);
      font-size:12px;
      text-align:center;
      line-height:1.5;
      color:${colors.subTextColor};
    }
  }
  .place-tit {
    flex-grow:1;
    position:relative;
    padding-left:20px;
    &::before {
      position:absolute;
      top:12px;
      left:5px;
      width:5px;
      height:5px;
      border-radius:50%;
      background:${colors.purple};
      animation:titleCircleAni 1s ease infinite;
      content:'';
    }
    @keyframes titleCircleAni{ 
      0% {
        opacity:1;
        transform: scale(1);
      }
      100% {
        opacity:0;
        transform: scale(2);
      }
    }
    &::after {
      position:absolute;
      top:12px;
      left:5px;
      width:5px;
      height:5px;
      border-radius:50%;
      background:${colors.purple};
      content:'';
    }
    .tit{
      font-size:24px;
      font-weight:600;
    }
    .category-desc{
      margin-top:5px;
      font-size:14px;
      color:${colors.subTextColor};
    }
  }
  .place-bookmark {
    flex-basis: 20px;
    padding:5px 0;
  }
  .place-cont {
    position:relative;
    margin-top:15px;
    padding-bottom:10px;
    border-top:5px solid ${colors.lineColor};
  }
`;
