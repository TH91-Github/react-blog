import { colors } from "assets/style/Variable";

export const managerNavData = {
  title:'일반 설정',
  color: colors.mSlateBlue,
  lists:[
    {
      subTitle:'계정',
      isIcon: true,
      subLists:[
        {
          tit:'사용자',
          link:'/manager',
          icon:'users',
        },
        {
          tit:'비승인',
          link:'/manager/validity',
          icon:'userNot',
        }
      ]
    }
  ]
}

export const managerRank = [
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
    title:'일반',
    rank:'0',
  },
]