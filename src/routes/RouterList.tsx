
import MainPage from "pages/main/MainPage";
import PortfolioPage from "pages/portfolio/PortfolioPage";

export const routerList = [
  { // Main
    index: true,
    id:"Main",
    element: <MainPage />
  },
  {
    id:"Portfolio",
    path:"portfolio",
    element: <PortfolioPage/>,
  },
]