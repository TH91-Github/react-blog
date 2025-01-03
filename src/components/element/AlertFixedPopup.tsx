import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AlertCommonType } from "reducers/types";
import { actionAlert, AppDispatch, RootState } from "store/store";
import AlertLayerPopup, { AlertLayerPopupRefType } from "./AlertLayerPopup";


// ✅ 전체 화면 영역 fixed - 바깥 위치하기 위해 컴포넌트화
export default function AlertFixedPopup () {
  const dispatch = useDispatch<AppDispatch>(); 
  const refPopup = useRef<AlertLayerPopupRefType>(null);
  const alert = useSelector((state : RootState) => state.storeAlert);
  const initAlert:AlertCommonType = {
    isPopup:false, 
    titMessage:'', 
    txtMessage: '',
    autoClose: undefined,
    checkBtn: false,
    confirmState:false,
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
          <AlertLayerPopup 
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