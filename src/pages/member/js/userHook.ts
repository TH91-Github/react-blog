import { UserListDataType } from "types/baseType";
import { userDataDocUpdate, userDocRemove, userDocUpdate, userGetDataDoc } from "utils/firebase/member";
import { useDataQuery, useInvaliQuery } from "utils/hook/query";

// 유저 리스트 
export const useUserData = () => {
  const { queryKeyInvali } = useInvaliQuery();

  const { data, isLoading } = useDataQuery(
    ['managerUserData'],
    () => userGetDataDoc(),
  );

  // 갱신
  const initQuery = () =>{
    queryKeyInvali(['managerUserData']);
    console.log('다시 불러오기')
  }

  // ✅ 새롭게 목록 업데이트
  const updateUserData = (idVal: string) =>{
    if (!data) return;
    const checkUserPass = data.checkUser.filter((userItem:UserListDataType) => userItem.id !== idVal);
    const userListPass = data.userList.map((userItem:UserListDataType) => (
      userItem.id === idVal ? { ...userItem, permission: true } : userItem)
    );
    const updateData = {
      checkUser: checkUserPass,
      userList: userListPass,
    }
    // userData 비승인 목록 제거 및 유저 목록 permission: true
    userDataDocUpdate(updateData)
    // 유저 정보 승인으로 업데이트
    userDocUpdate(idVal, 'permission', true);
    // // 사용자, 비승인 목록 query 재요청 ✅ 테스트 계정 만들고 테스트 + userList 에서 상태 업데이트 해야함
    initQuery();
  }

  // ✅ 삭제
  const removeUserData = async (idVal: string) => {
    if (!data) return;
    const checkUserRemove = data.checkUser.filter((userItem: UserListDataType) => userItem.id !== idVal);
    const userListRemove = data.userList.filter((userItem: UserListDataType) => userItem.id !== idVal);
    const removeData = data.userList.find((userItem: UserListDataType) => userItem.id === idVal) ?? null;
    // 삭제 유저 목록에 추가 -> Authentication 삭제까지 개발하지 않았음(추후 개발)
    // 삭제 리스트 보고 수 작업으로 삭제
    const removeUpdateData = {
      checkUser: checkUserRemove ?? [],
      userList: userListRemove ?? [],
      removeList: [...data.removeList, removeData].filter(Boolean), // undefined 나올경우 제거
    };
    console.log('삭제 진행')
    // 유저 리스트 삭제
    await userDataDocUpdate(removeUpdateData);
    // 유저 Doc 삭제
    await userDocRemove(idVal)
    initQuery();
  };

  return { data, isLoading, updateUserData, removeUserData };
};