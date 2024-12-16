import React from 'react';
import MainPage from "pages/main/MainPage";
import ResumePage from "pages/resume/ResumePage";
import MapPage from "pages/map/MapPage";
import WeatherPage from "pages/weather/WeatherPage";
import MemberPage from "pages/member/MemberPage";
import SignIn from "pages/member/SignIn";
import SignUp from "pages/member/SignUp";
import StudyPage from "pages/study/StudyPage";
import { SquadRoomPage } from 'pages/room/SquadRoomPage';
import { ManagerPage } from 'pages/manager/ManagerPage';
import { UserRankBoardPage } from 'pages/manager/UserRankBoardPage';
import { UserValidityBoardPage } from 'pages/manager/UserValidityBoardPage';


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
  },
  {
    id: "Map",
    path: "map",
    title: '🗺️지도',
    element: <MapPage />,
  },
  {
    id: "Room",
    path: "squadRoom",
    title: '🗂️ 팀 방',
    view:['localhost'],
    element: <SquadRoomPage />,
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
    id: "Manager",
    path: "manager",
    view: false,
    element: <ManagerPage />,
    children: [
      {
        index: true,
        path:'rank',
        id: "userRankBoard",
        title: "사용자 등급관리",
        element: <UserRankBoardPage />
      },
      {
        id: "UserValidityBoard",
        path: "validity",
        title: "사용자 승인 관리",
        element: <UserValidityBoardPage />,
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