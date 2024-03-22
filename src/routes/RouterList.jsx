
import MainPage from "pages/main/MainPage";
import PortfolioPage from "pages/portfolio/PortfolioPage";

export const routerList = [
  { // Main
    index: true,
    element: <MainPage />
  },
  {
    title:"portfolio",
    path:"portfolio",
    element: <PortfolioPage/>,
  },
]