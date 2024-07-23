import { createAsyncThunk } from "@reduxjs/toolkit";
import { firebaseGetDoc } from "api/firebaseDB/firebaseStore";
import { ResumeDocumentType, userLoginType } from "reducers/types";
import { actionUserLogin, RootState } from "store/store";

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

// ex) 참고용 React.memo event 전달 최신화가 안되어 store 최신을 못하는 경우 아래와 같이 사용.
export const toggleUserBookmark = createAsyncThunk(
  'map/toggleBookmark',
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    const currentState = state.storeUserLogin;
    console.log(currentState)
    const newStore:userLoginType = { ...currentState, user: null};
    dispatch(actionUserLogin(newStore));
    return newStore;
  }
);