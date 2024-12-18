
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
