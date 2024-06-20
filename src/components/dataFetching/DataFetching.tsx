import { fireDB, doc, getDoc } from "../../firebase";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

interface DataFetchingType {
  collection: string,
  document: string,
  actionFunc: (d :any) => any;
}
export default function DataFetching({collection, document, actionFunc} : DataFetchingType){
  const dispatch = useDispatch();
  useEffect(()=>{
    const fetchUsers = async () => {
      try {
        const docRef = doc(fireDB, collection, document);
        const userData = await getDoc(docRef);
        if (userData.exists() && userData.data().userList) {
          const data = userData.data().userList;
          dispatch(actionFunc(data))
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