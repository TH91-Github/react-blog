import { useEffect, useRef } from "react";
import LayerPopup, { LayerRefType } from "./LayerPopup";
import { useDispatch, useSelector } from "react-redux";
import { actionAlert, AppDispatch, RootState } from "store/store";
import InputElement, { InputElementRef } from "./InputElement";


// ✅ 전체 화면 영역 fixed - 바깥 위치하기 위해 컴포넌트화
export default function FixedPopup () {
  const dispatch = useDispatch<AppDispatch>(); 
  const refPopup = useRef<LayerRefType>(null);
  const alert = useSelector((state : RootState) => state.storeAlert);
  const initAlert = {
    isPopup:false, 
    titMessage:'', 
    txtMessage: '',
    autoClose: undefined,
  }
  const layerPopupClose = () => {
    dispatch(actionAlert({...initAlert}))
  }
  const confirmEvent = () => {
    dispatch(actionAlert({...initAlert, confirmState:true}))
  }

  return (
    <>
      {
        alert.isPopup && 
          <LayerPopup 
            ref={refPopup}
            titMessage={alert.titMessage}
            txtMessage={alert.txtMessage}
            layerPopupClose={layerPopupClose}
            confirmBtn={alert.checkBtn}
            confirmEvent={confirmEvent}
            autoCloseSecond={alert.autoClose && alert.autoClose}
          />
      }
    </>
  )
}