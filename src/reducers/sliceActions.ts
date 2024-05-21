import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { firebaseGetDoc } from "api/firebaseDB/firebaseStore";
import { lightTheme } from 'assets/style/Variable';
import { StringOnly } from 'types/baseType';
import { DocumentType, ResumeState } from './types';

// mobile 체크
export const mobileChk = createSlice({ 
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
export const useTheme = createSlice({ // 
  name: "dark/light theme",
  initialState: themeInitialState,
  reducers: {
    actionTheme(state, propsAction: PayloadAction<ThemeState>){
      return state = propsAction.payload
    }
  }
})
// resume - firebase
// createAsyncThunk: redux Toolkit 비동기 작업을 정의 하는데 사용. - pending / fulfilled / rejected
export const fetchResumeData = createAsyncThunk<DocumentType>(
  'resume/fetchResumeData',
  async () => {
    const data = await firebaseGetDoc('thData', 'profile');
    if (!data) {
      throw new Error('Error - 찾을 수 없습니다.');
    }
    return data;
  }
);

const initialState: ResumeState = {
  data: null,
  loading: false,
  error: null
};

export const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchResumeData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResumeData.fulfilled, (state, action: PayloadAction<DocumentType>) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchResumeData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '데이터를 불러오지 못했습니다. 다시 시도해주세요.';
      });
  }
});
