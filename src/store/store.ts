import { configureStore } from '@reduxjs/toolkit';
import { mobileChkSlice, resumeSlice, storeKakaoDataSlice, themeSlice, userLocationSlice, userLoginSlice } from 'reducers/sliceActions';
import { thunk } from 'redux-thunk';

export const store = configureStore({
  reducer: { 
    mobileChk: mobileChkSlice.reducer,
    storeTheme: themeSlice.reducer,
    storeResume: resumeSlice.reducer,
    storeUserLogin: userLoginSlice.reducer, // 유저정보
    storeKakaoData: storeKakaoDataSlice.reducer,
    storeLocation: userLocationSlice.reducer, // 현재위치
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
}) 

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export const { actionMobileChk } = mobileChkSlice.actions;
export const { actionTheme } = themeSlice.actions;
export const { actionUserLogin } = userLoginSlice.actions;
export const { actionUserLocationUpdate } = userLocationSlice.actions;
export const { actionKakaoDataUpdate } = storeKakaoDataSlice.actions;


