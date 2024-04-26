import MainPage from "pages/main/MainPage";
import ResumePage from "pages/resume/ResumePage";
import MapPage from "pages/map/MapPage";
import PortfolioPage from "pages/portfolio/PortfolioPage";
import WeatherPage from "pages/weather/WeatherPage";
import MemberPage from "pages/member/MemberPage";
import SignIn from "pages/member/SignIn";
import SignUp from "pages/member/SignUp";

export const routerList = [
  { // Main
    index: true,
    id: "Main",
    element: <MainPage />
  },
  {
    id: "Resume",
    path: "resume",
    title: "준비",
    element: <ResumePage />,
  },
  {
    id: "Weather",
    path: "weather",
    title: '날씨',
    element: <WeatherPage />,
  },
  {
    id: "Map favorites",
    path: "map",
    title: '나의 지도',
    element: <MapPage />,
  },
  {
    id: "Portfolio",
    path: "portfolio",
    title: '포트폴리오',
    element: <PortfolioPage />,
  },
  {
    id: "Member",
    path: "member",
    view: false,
    element: <MemberPage />,
    children: [
      {
        index: true,
        id: "SignIn",
        title: "로그인",
        element: <SignIn />
      },
      {
        id: "SignUp",
        path: "sign-up",
        title: "회원가입",
        element: <SignUp />,
      }
    ]
  }
];