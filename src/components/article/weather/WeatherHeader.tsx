import { colors, media } from "assets/style/Variable";
import { SvgPoint } from "assets/svg/common/CommonSvg";
import { useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import styled from "styled-components";
import { MarkerPositionType } from "types/kakaoComon";
import { isPcMo, weatherClock } from "utils/common";
import { getStableCurrentWeatherTimeLists } from "utils/weather/weather";
import { SearchWrap } from "./SearchWrap";
import { WeatherIcon } from "./weatherIcon/WeatherIcon";

interface WeatherHeaderType {
  addrUpdate: (searchCoords: MarkerPositionType) => void;
}

const AlertTriangleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
      stroke={colors.yellow}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M12 9v4" stroke={colors.yellow} strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="17" r="1" fill={colors.yellow} />
  </svg>
);

export const WeatherHeader = ({ addrUpdate }: WeatherHeaderType) => {
  const { data } = useSelector((state: RootState) => state.storeWeather);
  const useLocation = useSelector((state: RootState) => state.storeLocation);
  const addressText = useLocation.address
    ? useLocation.address.address_name.split(" ").slice(0, 3).join(" ")
    : "현재 위치를 불러오지 못했습니다.";
  const userDevices = isPcMo();
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handleClick = useCallback(() => {
    if (!useLocation.coords) return;
    addrUpdate(useLocation.coords);
  }, [addrUpdate, useLocation.coords]);

  const locationWeatherIcon = useMemo(() => {
    return getStableCurrentWeatherTimeLists(data?.res?.[0]?.timeLists ?? [], weatherClock());
  }, [data]);

  return (
    <StyleWeatherHeader>
      <SearchWrap searchUpdate={addrUpdate} />
      <button
        type="button"
        className="location"
        title="현재 위치 날씨 보기"
        onClick={handleClick}>
        {
          useLocation.address
            ? <>
                <span className="icon"><SvgPoint $fillColor={colors.mSlateBlue} /></span>
                <span className="txt">{addressText}</span>
                <span className="icon weather-icon">
                  {locationWeatherIcon && <WeatherIcon isAnimation={false} categoryLists={locationWeatherIcon.categoryList} />}
                </span>
              </>
            : <span className="blind">현재 위치 로딩 중</span>
        }
      </button>
      {
        userDevices.devices === "pc" && (
          // PC는 접속 위치 오차 안내만 버튼+툴팁으로 노출
          <div className="guide-wrap">
            <button
              type="button"
              className="guide-btn"
              onClick={() => setTooltipOpen((prev) => !prev)}
              aria-expanded={tooltipOpen}>
              <span className="guide-icon"><AlertTriangleIcon /></span>
              <span className="guide-text">접속 위치 안내</span>
            </button>
            {
              tooltipOpen && (
                <div className="guide-tooltip">
                  PC에서는 접속 위치가 정확하지 않을 수 있어요. 현재 위치 버튼이나 검색으로 지역을 다시 선택해 주세요.
                </div>
              )
            }
          </div>
        )
      }
    </StyleWeatherHeader>
  );
};

const StyleWeatherHeader = styled.div`
  position:relative;
  z-index:20;
  display:flex;
  gap:20px;
  align-items:center;
  margin-top:30px;
  padding:10px 20px;
  border-radius:5px;
  ${({theme}) => theme.translucence};
  background: ${({theme}) => theme.opacityBg};
  .location{
    display:flex;
    align-items:center;
    gap:6px;
    flex:1;
    justify-content:flex-start;
    min-width:0;
    .icon {
      flex-shrink:0;
      width:18px;
      height:18px;
    }
    .weather-icon {
      width:22px;
      height:22px;
    }
    .txt {
      font-size:14px;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
    }
  }
  .guide-wrap {
    position:relative;
    margin-left:auto;
    z-index:10;
  }
  .guide-btn {
    display:flex;
    align-items:center;
    gap:6px;
    color:${colors.yellow};
  }
  .guide-icon {
    width:16px;
    height:16px;
  }
  .guide-text {
    font-size:12px;
    white-space:nowrap;
  }
  .guide-tooltip {
    position:absolute;
    top:calc(100% + 8px);
    right:0;
    z-index:20;
    width:260px;
    padding:10px 12px;
    border-radius:8px;
    background:${({theme}) => theme.type === 'dark' ? 'rgba(16,16,16,.92)' : 'rgba(255,255,255,.96)'};
    box-shadow:0 8px 24px rgba(0,0,0,.12);
    font-size:12px;
    line-height:1.5;
  }
  ${media.mo}{
    flex-direction:column;
    gap:10px;
    align-items:stretch;
    margin-top:20px;
    .guide-wrap {
      display:none;
    }
  }
`;
