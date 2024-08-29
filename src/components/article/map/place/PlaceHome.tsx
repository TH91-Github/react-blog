import { SvgCall, SvgInternet, SvgPoint } from "assets/style/SVGIcon";
import { colors } from "assets/style/Variable";
import styled from "styled-components";
import { PlaceType } from "./PlaceDetailPage";

export default function PlaceHome({place}:PlaceType) {

  const urlHttps = (url:string) => { // kakako link 
    return url.replace('http:','https:')
  }

  return (
    <StylePlaceHome className="place-home">
      <div className="address-info">
        <i className="icon-address"><SvgPoint $fillColor={colors.yellow} /></i>
        <p><span>도로명</span><span>{place.address.road_address.address_name}</span></p>
        <p><span>지번</span><span>{`${place.address.address.region_3depth_name} ${place.address.address.main_address_no}`}</span></p>
        <p><span>(우)</span><span>{place.address.road_address.zone_no}</span></p>
      </div>
      <div className="phone">
        <i className="icon-call"><SvgCall $fillColor={colors.yellow} /></i>
        <p>{place.phone ? <a href={`tel:${place.phone}`}>{place.phone}</a>: '-'}</p>
      </div>
      <div className="link">
        <i className="icon-internet"><SvgInternet $fillColor={colors.yellow} /></i>
        <p><a href={urlHttps(place.url)} target="_blank" rel="noopener noreferrer" title={`${place.place_name} | 카카오맵 새 창`}>{urlHttps(place.url)}</a></p>
      </div>
      {/* 
        주소
        영업시간
        번호
        카카오맵 링크
        네이버 블로그 있다면 블로그 링크
      */}
    </StylePlaceHome>
  )
}

const StylePlaceHome = styled.div`
  display:flex;
  flex-direction: column;
  gap:20px;
  padding:0 10px;
  & > div {
    position:relative;
    padding-left:25px;
  }
  p {
    display:flex;
    gap:5px;
    font-size:14px;
    color:${colors.subTextColor};
    span:first-child {
      flex-basis:40px
    }
    span:last-child {
      display:inline-block;
      position:relative;
      padding-left:10px;
      &::before {
        position:absolute;
        top:50%;
        left:0;
        width:1px;
        height:60%;
        background:${colors.lineColor};
        transform:translateY(-50%);
        content:'';
      }
    }
  }
  .address-info {
    display:flex;
    flex-direction: column;
    gap:5px;
  }
  [class*="icon-"]{
    display:block;
    position:absolute;
    top:0;
    left:0;
    width:15px;
    height:15px;
  }
  .icon-address{
    display:block;
    top:1px;
    &::before, &::after {
      position:absolute;
      bottom:calc(-50% + 1px);
      left:50%;
      width:100%;
      height:100%;
      border-radius:50%;
      background: ${colors.yellow};
      transform: translateX(-50%);
      animation: activePointAni 2s .7s ease infinite both;
      pointer-events:none;
      content:'';
    }
    &::after {
      animation: activePointAni 2s ease infinite both;
    }
  }
  .link { 
    a {
      white-space: nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
    }
  }
  
`;
