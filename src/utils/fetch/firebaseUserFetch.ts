import { fireDB, doc, getDoc } from "../../firebase";
import { AppDispatch } from "store/store";
// firebase - User data
// export const fetchUserData = async (dispatch:AppDispatch) => {
//   try {
//     const docRef = doc(fireDB, 'thData', 'userData');
//     const userData = await getDoc(docRef);
//     if (userData.exists() && userData.data().userList) {
//       const data = userData.data().userList;
//       dispatch(actionUserListUpdate(data));
//       return { success: true, message: "데이터가 성공적으로 업데이트되었습니다." };
//     } else {
//       console.log("데이터가 없습니다.");
//       return { success: false, message: "데이터가 없습니다." };
//     }
//   } catch (error) {
//     console.error("데이터를 가져오는데 실패했습니다.", error);
//     return { success: false, message: "데이터를 가져오는데 실패했습니다." };
//   }
// };
