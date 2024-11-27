import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { lightTheme } from 'assets/style/Variable';
import { KakaofireStore, KeyObjectAnyType } from 'types/kakaoComon';
import { fetchResumeData } from './thunk/asyncThunk';
import { AlertCommonType, ResumeDocumentType, ResumeState, TestStateType, ThemeState, UserLoginType, WeatherActionType } from './types';

// 📍테스트용 
const testState : TestStateType = {
  isOn: false,
  arr: []
};
export const testSlice = createSlice({
  name: "user login",
  initialState: testState,
  reducers: {
    actionTest(state, propsAction: PayloadAction<TestStateType>){
      return { ...state, ...propsAction.payload };
    },
  },
})
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
      return { ...state, ...propsAction.payload };
    }
  }
})
// 📍alert
const alertCommon :AlertCommonType = {
  isPopup: false,
  titMessage: '',
  txtMessage:'',
  checkBtn:false,
  confirmState:false,
  autoClose: undefined,
};
export const alertCommonSlice = createSlice({
  name: "alert",
  initialState: alertCommon,
  reducers: {
    actionAlert(state, propsAction: PayloadAction<AlertCommonType>){
      return { ...state, ...propsAction.payload };
    },
  },
})

// 📍logIn 상태 
const userLoginState: UserLoginType = {
  loginState: false,
  user: null
};
export const userLoginSlice = createSlice({
  name: "user login",
  initialState: userLoginState,
  reducers: {
    actionUserLogin(state, propsAction: PayloadAction<UserLoginType>){
      return { ...state, ...propsAction.payload };
    },
  },
  //  👇 참고용
  // extraReducers: (builder) => { 
  //   builder.addCase(toggleUserBookmark.fulfilled, (state, action) => {
  //     state.user = action.payload.user;
  //   });
  // },
})

// 📍weather 날씨 
const weatherState:WeatherActionType= {
  data: null, // date, res, xy, baseUpdate
  coords: null,
  location: null,
  loading:false,
  error:false,
};
export const weatherSlice = createSlice({
  name: "weather",
  initialState: weatherState,
  reducers: {
    actionWeathcer(state, propsAction:PayloadAction<Partial<WeatherActionType>>){ // Partial 일부 필드만 업데이트할 때 안전하게 병합 가능.
      return { ...state, ...propsAction.payload };
    },
  },
})

// 📍kakao map data - firebase
const kakaoDataState:KakaofireStore[] = [];
export const storeKakaoDataSlice = createSlice({
  name: "kakao map data",
  initialState: kakaoDataState,
  reducers: {
    actionKakaoDataUpdate(state, propsAction: PayloadAction<[]>){
      return state = propsAction.payload;
    }
  }
})

// 📍접속 위치 정보
const userLocationState: KeyObjectAnyType = {
  road_address: null,
  address: null,
  coords: null,
  weather: null,
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
const resumeSliceState: ResumeState = {
  data: null,
  loading: false,
  error: null
};
// 비동기 액션 asyncThunk 사용 ➡️ ./thunk/asyncThunk.ts
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
