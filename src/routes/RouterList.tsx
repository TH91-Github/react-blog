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
import { HubRoomPage } from 'pages/hubRoom/HubRoomPage';

export const routerList = [
  { // Main
    index: true,
    id: "Main",
    element: <MainPage />
  },
  {
    id: "Resume",
    path: "resume",
    title: "🧾이력서",
    view:['main-th-blog','localhost'],
    element: <ResumePage />,
  },
  {
    id: "Weather",
    path: "weather",
    title: '🌤️날씨',
    element: <WeatherPage />,
    view:['localhost'],
  },
  {
    id: "Map",
    path: "map",
    title: '🗺️지도',
    element: <MapPage />,
  },
  {
    id: "Hub-Room",
    path: "HubRoom",
    title: '🗂️ 허브 (팀)룸',
    view:['localhost'],
    element: <HubRoomPage />,
  },
  {
    id: "Study",
    path: "study",
    element: <StudyPage />,
    view:['localhost'],
    children:[
      {
        id:"Study Detail",
        path:"detail/:id",
        title:"📚스터디",
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