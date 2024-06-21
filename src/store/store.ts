import { configureStore} from '@reduxjs/toolkit'
import { mobileChkSlice, resumeSlice, themeSlice, storeUserListsSlice, userLoginSlice } from 'reducers/sliceActions';

export const store = configureStore({
  reducer: { 
    mobileChk: mobileChkSlice.reducer,
    storeTheme: themeSlice.reducer,
    storeResume: resumeSlice.reducer,
    storeUserLists: storeUserListsSlice.reducer,
    storeUserLogin: userLoginSlice.reducer,
  }
}) 

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export const { actionMobileChk } = mobileChkSlice.actions;
export const { actionTheme } = themeSlice.actions;
export const { actionUserListUpdate } = storeUserListsSlice.actions;
export const { actionUserLoginUpdate } = userLoginSlice.actions;