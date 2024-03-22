import { configureStore, createSlice } from '@reduxjs/toolkit'

const mobileChk = createSlice({ // mobile 체크
  name: "Mobile check",
  initialState: false,
  reducers: {
    sSetMobileChk(state, propsName){
      return state = propsName.payload;
    }
  }
})

export default configureStore({
  reducer: { 
    mobileChk: mobileChk.reducer
  }
}) 

export const { sSetMobileChk } = mobileChk.actions;