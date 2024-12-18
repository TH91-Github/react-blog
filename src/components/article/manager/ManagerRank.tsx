import { colors } from "assets/style/Variable";
import { useMemo } from "react";
import styled from "styled-components";


interface ManagerRankType {
  rank: string;
}
interface RankElementType {
  [key:string] : JSX.Element;
}
export const ManagerRank = ({rank}:ManagerRankType) =>{
  
  const managerRank = [
    {
      title:'관리자',
      rank:'3',
    },
    {
      title:'관계자',
      rank:'2',
    },
    {
      title:'VIP',
      rank:'1',
    },
    {
      title:'일반 회원',
      rank:'0',
    },
  ]
  const rankData = useMemo(() => {
    return managerRank.find((item) => item.rank === rank);
  }, [rank]);
  return (
    <StyleManagerRank className={`rank-${rank}`}>
      <span>{rankData ? rankData.title : '비회원'}</span>
    </StyleManagerRank>
  )
}

const StyleManagerRank = styled.div`
  
`;