import React from 'react';
import MainPage from "pages/main/MainPage";
import ResumePage from "pages/resume/ResumePage";
import MapPage from "pages/map/MapPage";
import PortfolioPage from "pages/portfolio/PortfolioPage";
import WeatherPage from "pages/weather/WeatherPage";
import MemberPage from "pages/member/MemberPage";
import SignIn from "pages/member/SignIn";
import SignUp from "pages/member/SignUp";
import StudyPage from "pages/study/StudyPage";

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
    view: false,
    title: '포트폴리오',
    element: <PortfolioPage />,
  },
  {
    id: "Study",
    path: "study",
    title: '스터디',
    element: <StudyPage />,
    children:[
      {
        id:"Study Detail",
        path:"detail/:id",
        title:"스터디 상세페이지",
        element: <StudyPage />
      }
    ]
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