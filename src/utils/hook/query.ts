import { useQuery, useQueryClient } from "@tanstack/react-query";
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


// ✅ 데이터 list query
// export const useInfiniteList = (key=[], requestInfo) =>{
//   const {defaultDoc, listCol, requestNum} = requestInfo; // 문서, 하위 컬렉션, 불러오는 리스트 요청 수

//   // fetchNextPage, React Query의 useInfiniteQuery 훅이 반환하는 함수! 다음 페이지 데이터를 가져옴.
//   // hasNextPage : 다음 페이지가 있는지 여부를 나타낸다. boolean
//   // isFetchingNextPage, 다음 페이지를 불러오는 중인지 여부를 나타낸다.

//   return useInfiniteQuery({
//     queryKey: [...key],
//     queryFn: async ({ pageParam }) => await listDateQueryDoc(defaultDoc, listCol, pageParam, requestNum),
//     getNextPageParam: (page) => { // 다음 페이지
//       return page.lastDoc || undefined;
//     }, 
//     getPreviousPageParam: (page) => { // 이전 페이지
//       return page.lastDoc || undefined;
//     },
//   })
// }
