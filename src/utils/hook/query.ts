import { QueryFunction, QueryKey, useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
// import { listDateQueryDoc } from "../study/firebase";

// ✅ 공통 query
export const useDataQuery = (
  key: string[] = [],
  fetchFn:() => any, // 추후 다른 방법으로 any 개선.
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: key,
    queryFn: async () => await fetchFn() ?? null,  // () => 사용하여 클로저로 useFn에 접근하여 호출한다.
    staleTime: 1000 * 60 * 5, // 5분
    enabled,
  });
};
// ※ 클로저 -  내부 함수가 외부 데이터를 기억하고 사용할 수 있도록 만드는 기능

// ✅ 재요청 + 주소 이동
export const useInvaliQuery = () => {
  const queryClient = useQueryClient(); 
  const navigate = useNavigate();

  const queryKeyInvali = (keyArray:string[], afterLink?:string) => { // 여러개 재요청할 경우. EX : [[key],[key]], 끝나고 이동할 주소 
    keyArray.forEach((key) => {
      queryClient.invalidateQueries({ queryKey: [key] });
    });
    if (afterLink) navigate(afterLink);
  };
  return { queryKeyInvali };
};