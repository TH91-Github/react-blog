import LayerPopup from "./LayerPopup";
import { useDispatch, useSelector } from "react-redux";
import { actionAlert, AppDispatch, RootState } from "store/store";


// ✅ 전체 화면 영역 fixed - 바깥 위치하기 위해 컴포넌트화
export default function FixedPopup () {
  const dispatch = useDispatch<AppDispatch>(); 
  const alert = useSelector((state : RootState) => state.storeAlert);
  const initAlert = {
    isPopup:false, 
    titMessage:'', 
    ref:null,
    txtMessage: '',
    autoClose: undefined
  }
  const layerPopupClose = () => {
    dispatch(actionAlert(initAlert))
  }
  return (
    <>
      {
        alert.isPopup && 
          <LayerPopup 
            titMessage={alert.titMessage} 
            layerPopupClose={layerPopupClose} 
            autoCloseSecond={alert.autoClose && alert.autoClose}
          />
      }
    </>
  )
}