import { doc, getDoc } from "firebase/firestore";
import { fireDB } from "../../firebase";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { actionUserUpdata } from "store/store";

export default function UserDataFetching(){
  const dispatch = useDispatch();
  useEffect(()=>{
    const fetchUsers = async () => {
      const docRef = doc(fireDB, 'thData', 'userData');
      const userData = await getDoc(docRef);
      if (userData.exists() && userData.data().userList) {
        const data = userData.data().userList;
        dispatch(actionUserUpdata(data))
      } else {
        // docSnap.data() will be undefined in this case
        console.log("데이터를 가져오는데 실패했습니다.");
      }
    };
    fetchUsers();
  },[])
  // 데이터 로드, 렌더링 X
  return null;
}