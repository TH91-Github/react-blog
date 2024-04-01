
import MainPage from "pages/main/MainPage";
import PortfolioPage from "pages/portfolio/PortfolioPage";

interface RouterType {
  index?: boolean,
  id: string,
  path?: string,
  title?: string
  desc? : string,
  element : JSX.Element,
}

export const routerList : RouterType[]= [
  { // Main
    index: true,
    id:"Main",
    element: <MainPage />
  },
  // {
  //   id:"Resume",
  //   path:"resume",
  //   title:"dd",
  //   element: <PortfolioPage/>,
  // },
  {
    id:"Weather",
    path:"weather",
    title : '날씨',
    element: <PortfolioPage/>,
  },
  {
    id:"Map favorites",
    path:"map",
    title : '나의 지도',
    element: <PortfolioPage/>,
  },
  // {
  //   id:"Portfolio",
  //   path:"portfolio",
  //   title : '포트폴리오',
  //   element: <PortfolioPage/>,
  // },
]