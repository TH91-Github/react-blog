import { configureStore} from '@reduxjs/toolkit'
import { mobileChk, resumeSlice, useTheme } from 'reducers/sliceActions';

export const store = configureStore({
  reducer: { 
    mobileChk: mobileChk.reducer,
    useTheme: useTheme.reducer,
    resume: resumeSlice.reducer
  }
}) 

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export const { actionMobileChk } = mobileChk.actions;
export const { actionTheme } = useTheme.actions;