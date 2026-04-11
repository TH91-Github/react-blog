import { colors, media, shadow, transitions } from "assets/style/Variable";
import { SvgSearch } from "assets/svg/common/CommonSvg";
import { SvgThermometer } from "assets/svg/weather/weatherSvg";
import InputElement, { InputElementRef } from "components/element/InputElement";
import { useCallback, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import styled from "styled-components";
import { MarkerPositionType } from "types/kakaoComon";
import { keyWordFindLocation, keyWordFindLocations } from "utils/weather/korLocation";

interface SearchWrapType {
  searchUpdate: (searchCoords: MarkerPositionType) => void;
}

export const SearchWrap = ({ searchUpdate }: SearchWrapType) => {
  const { requesting } = useSelector((state: RootState) => state.storeWeather);
  const inputRef = useRef<InputElementRef>(null);
  const errorTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isFocus, setIsFocus] = useState(false);
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [addrVal, setAddrVal] = useState("");

  const searchList = useMemo(() => {
    if (!addrVal.trim()) return [];
    // 검색어 포함 지역 미리보기
    return keyWordFindLocations(addrVal);
  }, [addrVal]);

  const errorActive = useCallback((errorVal: string) => {
    setIsError({ error: true, message: errorVal });
    if (errorTimeout.current) {
      clearTimeout(errorTimeout.current);
    }
    // 연속 요청을 막기 위해
    errorTimeout.current = setTimeout(() => {
      setIsError({ error: false, message: "" });
      inputRef.current?.inputIsFocus();
    }, 1000);
  }, []);

  const handleFocus = useCallback(() => {
    setIsFocus(true);
  }, []);

  const handleFocusOut = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value.trim().length > 0) {
      setIsFocus(false);
      setAddrVal(e.target.value.trim());
    } else {
      setIsFocus(false);
      setAddrVal("");
    }
  }, []);

  // 미리보기 지역을 나타내기 위함. - 진행 예정
  const handleChange = useCallback((v: string) => {
    setAddrVal(v.trim());
    setIsFocus(true);
  }, []);

  const updateLocation = useCallback((lat: string | number, lng: string | number, label?: string) => {
    if (label) {
      inputRef.current?.initValue(label);
      setAddrVal(label);
    }
    setIsFocus(false);
    searchUpdate({ lat: Number(lat), lng: Number(lng) });
  }, [searchUpdate]);

  const handleClick = useCallback(() => {
    if (!inputRef.current || isError.error) return;

    if (requesting) {
      errorActive('✋ 잠시 후에 시도해주세요!!');
      return;
    }

    const inputVal = inputRef.current.getInputElement()?.value ?? "";

    if (!inputVal.trim()) {
      errorActive('✋ 검색어를 입력해주세요.');
      return;
    }

    const addrResult = keyWordFindLocation(inputVal);
    if (addrResult) {
      updateLocation(addrResult.latS100, addrResult.longS100);
      return;
    }

    errorActive('✋ 입력하신 지역을 찾을 수 없습니다.');
  }, [errorActive, isError.error, requesting, updateLocation]);

  return (
    <StyleSearchWrap className={isFocus ? "isFocus" : ""}>
      <div className="search">
        <span className="search-icon"><SvgSearch $fillColor={isFocus ? colors.mSlateBlue : colors.lineColor} /></span>
        <label htmlFor="weahter-search" className="blind">\uc9c0\uc5ed \uac80\uc0c9</label>
        <InputElement
          ref={inputRef}
          id={"weahter-search"}
          name={"weahter-search"}
          keyEnter={handleClick}
          focusEvent={handleFocus}
          blurEvent={handleFocusOut}
          changeEvent={handleChange}
          focusColor={colors.mSlateBlue}
          placeholder={"\uc9c0\uc5ed\uba85\uc744 \uac80\uc0c9\ud574 \uc8fc\uc138\uc694"}
        />
        <button
          type="button"
          className="btn"
          onClick={handleClick}>
          <span className="btn-icon"><SvgThermometer /></span>
        </button>
      </div>
      {
        isFocus && searchList.length > 0 && (
          // 검색창 바로 아래 지역 선택 목록
          <div className="search-result">
            <ul>
              {
                searchList.map((item) => {
                  const label = [item.addr1, item.addr2, item.addr3].filter(Boolean).join(" ");
                  return (
                    <li key={`${item.districtCode}`}>
                      <button
                        type="button"
                        onMouseDown={() => updateLocation(item.latS100, item.longS100, label)}>
                        {label}
                      </button>
                    </li>
                  );
                })
              }
            </ul>
          </div>
        )
      }
      {isError.error && <div className="error-txt">{isError.message}</div>}
    </StyleSearchWrap>
  );
};

const StyleSearchWrap = styled.div`
  position:relative;
  .search{
    overflow:hidden;
    display:flex;
    align-items:center;
    position:relative;
    height:40px;
    border-radius:5px;
  }
  .search-icon {
    display:flex;
    align-items:center;
    justify-content:center;
    width:40px;
    height:40px;
    border:1px solid ${colors.lineColor};
    border-right:none;
    border-top-left-radius:5px;
    border-bottom-left-radius:5px;
    transition:${transitions.base};
    & > svg {
      width:20px;
      height:20px;
      g {
        transition:${transitions.base};
      }
    }
  }
  .input-item {
    margin-left:-1px;
    width:300px;
    height:100%;
    border-radius:0;
    .input  {
      height:100%;
      border-top:1px solid ${colors.lineColor};
      border-bottom:1px solid ${colors.lineColor};
      border-right:none;
      border-left: none;
      border-radius:0;
      &:focus{
        border-right:none;
        border-left: none;
      }
    }
  }
  .btn {
    position:relative;
    width:40px;
    height:100%;
    border-top-right-radius:5px;
    border-bottom-right-radius:5px;
    border:1px solid ${colors.lineColor};
    transition:${transitions.base};
    svg {
      transition:${transitions.base};
    }
    .btn-icon {
      display:inline-block;
      position:absolute;
      top:50%;
      left:50%;
      width:25px;
      height:25px;
      transform:translate(-50%, -50%);
      svg {
        fill:${colors.lineColor};
      }
    }
    &:hover, &:focus{
      background:${colors.mSlateBlue};
      svg {
        fill:${colors.baseWhite};
      }
    }
  }
  &.isFocus {
    .search-icon {
      border-color:${colors.mSlateBlue};
    }
    .input  {
      border-top:1px solid ${colors.mSlateBlue};
      border-bottom:1px solid ${colors.mSlateBlue};
    }
    .btn {
      border:1px solid ${colors.mSlateBlue};
      svg{
        fill:${colors.mSlateBlue};
      }
      &:hover, &:focus{
        svg{
          fill:${colors.baseWhite};
        }
      }
    }
  }
  .search-result{
    position:absolute;
    z-index:30;
    top:calc(100% + 8px);
    left:0;
    width:100%;
    padding:8px;
    border:1px solid ${colors.lineColor};
    border-radius:8px;
    background:${colors.originWhite};
    box-shadow:${shadow.bgBase};
    ul {
      display:flex;
      flex-direction:column;
      gap:4px;
    }
    button {
      display:block;
      width:100%;
      padding:8px 10px;
      border-radius:6px;
      font-size:13px;
      text-align:left;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
      transition:${transitions.base};
      &:hover, &:focus {
        background:rgba(98, 114, 164, 0.12);
      }
    }
  }
  .error-txt{
    position:absolute;
    z-index:31;
    top:calc(100% + 10px);
    left:50px;
    font-size:14px;
    color:${colors.red};
  }
  ${media.mo}{
    width:100%;
    .search{
      width:100%;
      .input-item {
        flex-grow:1;
      }
    }
    .search-result {
      width:100%;
    }
    .error-txt{
      width:100%;
      left:0;
      padding:5px;
      border-radius:5px;
      background:${colors.opacityBg};
      box-shadow:${shadow.bgBase};
    }
  }
`;
