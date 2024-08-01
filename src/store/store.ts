import { configureStore } from '@reduxjs/toolkit';
import { alertCommonSlice, mobileChkSlice, resumeSlice, storeKakaoDataSlice, testSlice, themeSlice, userLocationSlice, userLoginSlice } from 'reducers/sliceActions';
import { thunk } from 'redux-thunk';

export const store = configureStore({
  reducer: { 
    storeTest: testSlice.reducer, // 테스트 확인용
    mobileChk: mobileChkSlice.reducer,
    storeTheme: themeSlice.reducer,
    storeAlert: alertCommonSlice.reducer, // 기본 문구 alert 공통 팝업
    storeResume: resumeSlice.reducer,
    storeUserLogin: userLoginSlice.reducer, // 유저정보
    storeKakaoData: storeKakaoDataSlice.reducer,
    storeLocation: userLocationSlice.reducer, // 현재위치
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
  devTools:true,
}) 

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export const { actionTest } = testSlice.actions;
export const { actionMobileChk } = mobileChkSlice.actions;
export const { actionTheme } = themeSlice.actions;
export const { actionAlert } = alertCommonSlice.actions;
export const { actionUserLogin } = userLoginSlice.actions;
export const { actionUserLocationUpdate } = userLocationSlice.actions;
export const { actionKakaoDataUpdate } = storeKakaoDataSlice.actions;


