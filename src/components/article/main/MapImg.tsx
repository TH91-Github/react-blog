import mapBg from "assets/images/main/map/map_bg.png";
import mapImg1 from "assets/images/main/map/map_1.png";
import mapImg2 from "assets/images/main/map/map_2.png";
import mapImg3 from "assets/images/main/map/map_3.png";
import mapImg4 from "assets/images/main/map/map_4.png";
import mapImg5 from "assets/images/main/map/map_5.png";
import mapImg6 from "assets/images/main/map/map_6.png";
import styled from "styled-components";
import { colors, shadow } from "assets/style/Variable";

// 이미지 배열
// 경기도 - > 강원도 -> 충청도 -> 경상도 -> 전라도 
const mapImages = [mapImg1, mapImg2, mapImg3, mapImg4, mapImg5, mapImg6];
export const MapImg = () => {
  const pointerArr = [
    { group:0, title:'인천광역시'},{ group:0, title:'서울'},{ group:0, title:'경기도'},
    { group:1, title:'강원도'},{ group:2, title:'충청북도'},{ group:2, title:'세종특별자치시청'},{ group:2, title:'대전광역시'},{ group:2, title:'충청남도'},
    { group:3, title:'경상북도'},{ group:3, title:'대구광역시'},{ group:3, title:'경상남도'},{ group:3, title:'울산광역시'},{ group:3, title:'부산광역시'},{ group:3, title:'울릉도'},
    { group:4, title:'전라북도'},{ group:4, title:'광주광역시'},{ group:4, title:'전라남도'},{ group:5, title:'제주도'},
  ]
  return (
    <StyleMapImg>
      <div className="img-wrap">
        <span className="bg"><img src={mapBg} alt="대한민국 지도" /></span>
        {/* 큰 분류 - 수도권, 강원도, 충청도, 경상도, 전라도, 제주도 */}
        {
          mapImages.map((_, idx) => (
            <StyleImgMap 
              key={idx}
              $idx={idx}
              className={`img-map map${idx + 1}`} />
          ))
        }
        <div className="map-point">
          {
            pointerArr.map((pointItem,idx) => (
              <StylePointMap 
                $idx={idx}
                $groupNum={pointItem.group}
                className={`icon-point addr-${idx} active-${pointItem.group}`} 
                key={idx}>
                <span className="txt">{pointItem.title}</span>
              </StylePointMap>
            ))
          }
        </div>
      </div>
    </StyleMapImg>
  )
}

const StyleMapImg = styled.div`
  position:relative;
  width:80%;
  margin:0 auto;
  .img-wrap {
    position:relative;
  }
  .bg {
    display:block;
    width:100%;
  }
`;

type StyleMapImgType = { 
  $idx:number
}
const StyleImgMap = styled.div<StyleMapImgType>`
  display:block;
  position:absolute;
  top:0;
  left:0;
  width:100%;
  height:100%;
  background-size: cover;
  background-position: center;
  opacity:0.3;
  background-image: ${({ $idx }) => `url(${mapImages[$idx]})`};
  animation: mainMapAni 24s ${({$idx}) => $idx*4}s linear infinite both;
  @keyframes mainMapAni {
    0%, 16.66666666668%, 100%{
      opacity:0.3;
      transform:translateY(1px);
    }
    4.16666666667%, 12.50000000001%{
      opacity:1;
      transform:translateY(0px);
    }
  }
`;
type StylePointMapType = {
  $idx:number,
  $groupNum:number,
}
const StylePointMap = styled.div<StylePointMapType>`
  display:block;
  position:absolute;
  width:20px;
  height:20px;
  animation: pointActiveAni 24s ${({$groupNum}) => $groupNum*4}s linear infinite both;
  @keyframes pointActiveAni {
    0%, 16.66666666668%, 100%{
      transform:translateY(0);
    }
    4.16666666667%, 12.50000000001%{
      transform:translateY(-5px);
    }
  }

  &::before{
    position:absolute;
    top:50%;
    left:50%;
    border-top:20px solid rgb(${colors.yellowRgb});
    border-right:10px solid transparent;
    border-left:10px solid transparent;
    content:'';
    transform:translate(-50%, -50%);
    filter: drop-shadow(0 0 2px rgba(255, 191, 16, 0.7)) drop-shadow(0 0 5px rgba(255, 191, 16, 0.7)) drop-shadow(0 0 15px rgba(255, 191, 16, 0.7))
  }
  &::after{
    position:absolute;
    top:50%;
    left:50%;
    border-top:16px solid ${colors.baseWhite};
    border-right:6px solid transparent;
    border-left:6px solid transparent;
    transform:translate(-50%, -50%);
    content:'';
  }
  &.addr-0 { // 인천
    top:17%;
    left:24.3%;
    .txt{
      left:auto;
      right:0;
      transform:translateX(0%);
    }
  }
  &.addr-1 { // 서울
    top:16.3%;
    left:30.3%;
  }
  &.addr-2 { // 경기도
    top:19.5%;
    left:37.5%;
  }
  &.addr-3 { // 강원도
    top:13.5%;
    left:53%;
  }
  &.addr-4 { // 충북
    top:28.8%;
    left:43%;
  }
  &.addr-5 { // 세종
    top:34.5%;
    left:34.5%;
  }
  &.addr-6 { // 대전
    top:38.8%;
    left:37%;
  }
  &.addr-7 { // 충남
    top:37.8%;
    left:26%;
  }
  &.addr-8 { // 경북
    top:35.8%;
    left:64%;
  }
  &.addr-9 { // 대구
    top:45.8%;
    left:59%;
  }
  &.addr-10 { // 경남
    top:53.8%;
    left:50%;
  }
  &.addr-11 { // 울산
    top:53%;
    left:71%;
  }
  &.addr-12 { // 부산
    top:59.5%;
    left:67%;
  }
  &.addr-13 { // 울릉도
    top:17.5%;
    left:97.3%;
  }
  &.addr-14 { // 전라북도
    top:51.8%;
    left:33%;
  }
  &.addr-15 { // 광주
    top:60.8%;
    left:27%;
  }
  &.addr-16 { // 전라남도
    top:63.8%;
    left:33.3%;
  }
  &.addr-17 { // 제주
    top:93%;
    left:23%;
  }
  .txt{
    display:inline-block;
    position:absolute;
    top:-28px;
    left:50%;
    font-size:12px;
    font-weight:600;
    white-space: nowrap;
    padding:2px;
    border-radius:2px;
    background-color: rgba(227,227,227,0.3);
    backdrop-filter: blur(3px);
    box-shadow: ${shadow.whiteLine}; 
    transform:translateX(-50%);
    animation:pointTxtActiveAni 24s ${({$groupNum}) => $groupNum*4}s linear infinite;
    @keyframes pointTxtActiveAni {
      0%, 16.66666666668%, 100%{
        color:#000;
        text-shadow:none;
      }
      4.16666666667%, 12.50000000001%{
        color:#fff;
        text-shadow:rgba(127, 127, 127, 1) 1px 1px 1px;
      }
    }
  }
`;
