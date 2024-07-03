import { colors, transitions } from "assets/style/Variable";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components"

interface LayerPopupType {
  titMessage: string,
  descMessage?: string,
  autoclose?: boolean,
  dimmedView?: boolean,
  titleAlign?: string,
  descAlign?: string,
  checkBtn?: boolean,
  closeBtn?: boolean,
  layerPopupActive?: () => void
}
export default function LayerPopup (props : LayerPopupType) {
  const [dimmed, setDimmed] = useState(true);
  const [isHidden, setIsHidden] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);
  /*
    자동으로 닫기 
    딤드 유무 
    메세지 유무
    titleAlign
    descAlign
    텍스트 정렬
    확인 / 닫기
  */
  useEffect(() => {
    const handleTransitionEnd = () => {
      if (isHidden) {
        console.log('ㅇㅇ')
        props.layerPopupActive && props.layerPopupActive();
      }
    };
    const layerPopupEl = popupRef.current;
    layerPopupEl?.addEventListener('transitionend', handleTransitionEnd);

    return () => {
      layerPopupEl?.removeEventListener('transitionend', handleTransitionEnd);
    };
  }, [isHidden, props.layerPopupActive]);

  const handleClose = () => {
    console.log('닫기')
    setIsHidden(true);
  }
  return (
    <>
      {
        dimmed && <StyleDimmed className={`layer-popup ${isHidden ? 'hidden' : ''}`}/>
      }
      <StyleLayerPopup
        ref={popupRef}
        className={`layer-popup ${isHidden ? 'hidden' : ''}`} >
        <div className="layer-popup-inner">
          <p className="title">{props.titMessage}</p>
          { 
            props.descMessage && <p className="desc">{props.descMessage}</p>
          }
          {
            (props.checkBtn || props.closeBtn) && 
            <div className="btn-article">
              <button 
                type="button"
                className="btn">
                <span>확인</span>  
              </button>
              {
                false && 
                <button
                  type="button"
                  className="btn">
                  <span>취소</span>
                </button>
              }
            </div>
          }
          <button
            className="close-btn"
            onClick={handleClose}>
            <span className="blind">닫기</span>
          </button>
        </div>
      </StyleLayerPopup>
    </>
  )
}

const StyleLayerPopup = styled.div`
  position:fixed;
  z-index:991;
  top:50%;
  left:50%;
  text-align:center;
  transform: translate(-50%, -50%);
  transition: opacity 0.5s ease-out;
  &.hidden {
    opacity:0;
    pointer-events:none;
  }
  .layer-popup-inner {
    display:flex;
    justify-content:center;
    align-items: center;
    position:relative;
    min-width:180px;
    min-height:100px;
    padding:20px;
    border-radius:10px;
    background: ${colors.originWhite};
  }
  .title {
    font-size:18px;
  }
  .desc {
    position:relative;
    margin-bottom:20px;
    padding-bottom:20px;
    font-weight:300;
    color:${colors.subTextColor};
    &::before {
      position:absolute;
      top:0;
      left:50%;
      width:5px;
      height:5px;
      border-radius:50%;
      background:${colors.purple};
      transform: translateX(-50%);
      content:'';
    }
  }
  .btn-article {
    display:flex;
    justify-content:center;
    position:relative;
    margin-top:15px;
    padding-top:15px;
    border-top:1px solid #dbdbdb;
    &::before {
      position:absolute;
      top:0;
      left:50%;
      width:5px;
      height:5px;
      border-radius:50%;
      background:${colors.purple};
      transform: translateX(-50%);
      content:'';
    }
  }
  .btn {
    width:100%;
    max-width:120px;
    padding:8px 15px;
    border-radius:5px;
    border:1px solid ${colors.blue};
    font-weight:600;
    transition: ${transitions.base};
    &:hover, &:focus {
      background:${colors.blue};
      color: ${colors.originWhite};
    }
  }
  .close-btn {
    position:absolute;
    top:10px;
    right:10px;
    width:20px;
    height:20px;
    transition: ${transitions.base};
    &::before, &::after {
      position:absolute;
      top: 50%;
      left:50%;
      width: 3px;
      height: 100%;
      border-radius: 3px;
      background:${colors.baseBlack};
      transform: translate(-50%, -50%) rotate(-45deg);
      content:"";
    }
    &::after{ 
      transform: translate(-50%, -50%) rotate(-135deg);
    }
    &:hover, &:focus {
      transform: rotate(180deg);
    }
  }
`;
const StyleDimmed = styled.div`
  position:fixed;
  z-index:990;
  top:0;
  left:0;
  width:100%;
  height:100%;
  background:rgba(0,0,0,.5);
  transition: opacity 0.5s ease-out;
  &.hidden {
    opacity:0;
    pointer-events:none;
  }
`;