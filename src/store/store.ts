import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit'

const mobileChk = createSlice({ // mobile 체크
  name: "Mobile check",
  initialState: false,
  reducers: {
    sSetMobileChk(state, propsName: PayloadAction<boolean>){
      return state = propsName.payload;
    }
  }
})

export const store = configureStore({
  reducer: { 
    mobileChk: mobileChk.reducer
  }
}) 
export type RootState = ReturnType<typeof store.getState>
export const { sSetMobileChk } = mobileChk.actions;