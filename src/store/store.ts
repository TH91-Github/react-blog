import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { lightTheme } from 'assets/style/Variable';
import { StringOnly } from 'types/baseType';

// mobile 체크
const mobileChk = createSlice({ 
  name: "Mobile check",
  initialState: false,
  reducers: {
    actionMobileChk(state, propsAction: PayloadAction<boolean>){
      return state = propsAction.payload;
    }
  }
})
// dark/light 모드 체크
interface ThemeState {
  mode:string;
  color:StringOnly
}
const themeInitialState: ThemeState ={
  mode:'light',
  color: lightTheme
}
const useTheme = createSlice({ // 
  name: "dark/light theme",
  initialState: themeInitialState,
  reducers: {
    actionTheme(state, propsAction: PayloadAction<ThemeState>){
      return state = propsAction.payload
    }
  }
})

export const store = configureStore({
  reducer: { 
    mobileChk: mobileChk.reducer,
    useTheme: useTheme.reducer
  }
}) 
export type RootState = ReturnType<typeof store.getState>
export const { actionMobileChk } = mobileChk.actions;
export const { actionTheme } = useTheme.actions;