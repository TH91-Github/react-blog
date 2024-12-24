import MainPage from "pages/main/MainPage";
import { UsersBoardPage } from "pages/manager/depth/UsersBoardPage";
import { UserValidityBoardPage } from "pages/manager/depth/UserValidityBoardPage";
import { ManagerPage } from 'pages/manager/ManagerPage';
import MapPage from "pages/map/MapPage";
import MemberPage from "pages/member/MemberPage";
import SignIn from "pages/member/SignIn";
import SignUp from "pages/member/SignUp";
import ResumePage from "pages/resume/ResumePage";
import { SquadRoomPage } from 'pages/room/SquadRoomPage';
import WeatherPage from "pages/weather/WeatherPage";

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
    id: "Manager",
    path: "manager",
    view: false,
    element: <ManagerPage />,
    children: [
      {
        index: true,
        // path:'user',
        id: "usersBoard",
        title: "사용자 관리",
        element: <UsersBoardPage />
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