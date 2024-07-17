import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { firebaseGetDoc } from "api/firebaseDB/firebaseStore";
import { lightTheme } from 'assets/style/Variable';
import { UserDataType } from 'types/baseType';
import { KeyObjectAnyType } from 'types/kakaoComon';
import { ResumeDocumentType, ResumeState, ThemeState, userLoginType } from './types';

// 📍mobile 체크
export const mobileChkSlice = createSlice({ 
  name: "Mobile check",
  initialState: false,
  reducers: {
    actionMobileChk(state, propsAction: PayloadAction<boolean>){
      return state = propsAction.payload;
    }
  }
})
// 📍dark/light 모드 체크
const themeInitialState: ThemeState ={
  mode:'light',
  color: lightTheme
}
export const themeSlice = createSlice({
  name: "dark/light theme",
  initialState: themeInitialState,
  reducers: {
    actionTheme(state, propsAction: PayloadAction<ThemeState>){
      return state = propsAction.payload
    }
  }
})

// 📍user data - firebase
const userDataState: UserDataType[] = [];
export const storeUserListsSlice = createSlice({
  name: "user lists",
  initialState: userDataState,
  reducers: {
    actionUserListUpdate(state, propsAction: PayloadAction<UserDataType[]>){
      return state = propsAction.payload;
    }
  }
})

// 📍logIn 상태 및 Auth, user DB 정보
const userLoginState: userLoginType = {
  loginState: false,
  user: null
};
export const userLoginSlice = createSlice({
  name: "user login",
  initialState: userLoginState,
  reducers: {
    actionUserLoginUpdate(state, propsAction: PayloadAction<userLoginType>){
      return state = propsAction.payload;
    }
  }
})

// 📍접속 위치 정보
const userLocationState: KeyObjectAnyType = {
  road_address: null,
  address: null,
  coords: null
};
export const userLocationSlice = createSlice({
  name: "user location",
  initialState: userLocationState,
  reducers: {
    actionUserLocationUpdate(state, propsAction: PayloadAction<KeyObjectAnyType>){
      return state = propsAction.payload;
    }
  }
})


// 🌟 resume - firebase
// createAsyncThunk: redux Toolkit 비동기 작업을 정의 하는데 사용. - pending / fulfilled / rejected
export const fetchResumeData = createAsyncThunk<ResumeDocumentType>(
  'resume/fetchResumeData',
  async () => {
    const data = await firebaseGetDoc('thData', 'profile');
    if (!data) {
      throw new Error('Error - 찾을 수 없습니다.');
    }
    return data;
  }
);

const resumeSliceState: ResumeState = {
  data: null,
  loading: false,
  error: null
};

export const resumeSlice = createSlice({
  name: 'resume',
  initialState : resumeSliceState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchResumeData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResumeData.fulfilled, (state, action: PayloadAction<ResumeDocumentType>) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchResumeData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '데이터를 불러오지 못했습니다. 다시 시도해주세요.';
      });
  }
});
