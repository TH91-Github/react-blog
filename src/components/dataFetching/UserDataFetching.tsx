import { fireDB, doc, getDoc } from "../../firebase";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { actionUserUpdate } from "store/store";

export default function UserDataFetching(){
  const dispatch = useDispatch();
  useEffect(()=>{
    const fetchUsers = async () => {
      try {
        const docRef = doc(fireDB, 'thData', 'userData');
        const userData = await getDoc(docRef);
        if (userData.exists() && userData.data().userList) {
          const data = userData.data().userList;
          console.log(data)
          dispatch(actionUserUpdate(data))
        } else {
          console.log("데이터가 없습니다.");
        }
      } catch (error) {
        console.error("데이터를 가져오는데 실패했습니다.", error);
      }
    };
    fetchUsers();
  },[dispatch])
  // 데이터 로드, 렌더링 X
  return null;
}