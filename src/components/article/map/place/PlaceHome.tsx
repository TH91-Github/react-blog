
import { colors, media } from "assets/style/Variable";
import RatingStar from "components/element/RatingStar";
import styled from "styled-components";
import { PlaceDetailTabType } from "./PlaceDetailTab";
import { SvgCall, SvgPoint } from "assets/svg/common/CommonSvg";
import { SvgInternet } from "assets/svg/map/MapSvg";

export default function PlaceHome({kakaoPlace, placeData}:PlaceDetailTabType) {
  const urlHttps = (url:string) => { // kakako link 
    return url.replace('http:','https:')
  }
  return (
    <StylePlaceHome className="place-home">
      <div className="rating-wrap">
        <RatingStar 
          initNum={placeData?.rating ?? 0}
          onlyView={true}
          starWidth="30px"
          max={5} 
          bgColor={colors.yellow} />
      </div>
      <div className="address-info">
        <i className="icon-address"><SvgPoint $fillColor={colors.yellow} /></i>
        <p>
          <span>도로명</span>
          <span>{kakaoPlace.address?.road_address?.address_name || ''}</span>
        </p>
        <p>
          <span>지번</span>
          <span>{`${kakaoPlace.address?.address?.region_3depth_name || ''} ${kakaoPlace.address?.address?.main_address_no || ''}`}</span>
        </p>
        <p>
          <span>{kakaoPlace.address?.road_address?.zone_no || ''}</span>
        </p>
      </div>
      <div className="phone">
        <i className="icon-call"><SvgCall $fillColor={colors.yellow} /></i>
        <p>{kakaoPlace.phone ? <a href={`tel:${kakaoPlace.phone}`}>{kakaoPlace.phone}</a>: '-'}</p>
      </div>
      <div className="link">
        <i className="icon-internet"><SvgInternet $fillColor={colors.yellow} /></i>
        <p><a href={urlHttps(kakaoPlace.url)} target="_blank" rel="noopener noreferrer" title={`${kakaoPlace.place_name} | 카카오맵 새 창`}>{urlHttps(kakaoPlace.url)}</a></p>
      </div>
      {
        placeData?.etcUrlList && (
          <div className="">
            {
              placeData?.etcUrlList.map((etcItem,idx) => (
                <p className="etc" key={etcItem+'-'+idx}>
                  <a href={etcItem.url}>
                    {etcItem.title}
                  </a>
                </p>
              ))
            }
          </div>
        )
      }
      
    </StylePlaceHome>
  )
}

const StylePlaceHome = styled.div`
  display:flex;
  flex-direction: column;
  gap:20px;
  padding:20px 10px;
  & > div {
    position:relative;
    padding-left:25px;
  }
  .rating-wrap {
    position:relative;
    padding:0;
    .icon-rating {
      top:50%;
      transform:translateY(-50%);
    }
    .rating-select {
      padding:0;
    } 
    .max{
      color:${colors.subTextColor};
    }
  }
  p(not:.rating-result) {
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
  i[class*="icon-"]{
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
      display:block;
      white-space: nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
    }
  }
  ${media.mo} {
    padding:20px 15px 30px;
  }
`;
