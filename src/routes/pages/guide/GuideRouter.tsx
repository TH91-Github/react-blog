import { AssetsPage } from "pages/guide/assets/AssetsPage";
import { ComponentsPage } from "pages/guide/components/ComponentsPage";
import { BreakpointsPage } from "pages/guide/foundation/BreakpointsPage";
import { DesignPage } from "pages/guide/foundation/DesignPage";
import { FoundationPage } from "pages/guide/foundation/FoundationPage";
import { IconPage } from "pages/guide/foundation/IconPage";
import { HooksPage } from "pages/guide/hooks/HooksPage";
import { PreferencesPage } from "pages/guide/preferences/PreferencesPage";
import { FolderStructurePage } from "pages/guide/principles/FolderStructurePage";
import { NamingConventionsPage } from "pages/guide/principles/NamingConventionsPage";
import { PrinciplesPage } from "pages/guide/principles/PrinciplesPage";
import { UtilsPage } from "pages/guide/utils/UtilsPage";


export const guideList = [
  {
    id:'principles',
    path: "principles",
    title:'📔 규칙',
    element: <PrinciplesPage />,
    children: [
      {
        id:'NamingConventions',
        path: "naming-conventions",
        title:'✍️ 네이밍 규칙',
        element: <NamingConventionsPage />
      },
      {
        id:'FolderStructure',
        path: "naming-conventions",
        title:'📂 폴더 구조',
        element: <FolderStructurePage />
      },
    ],
  },
  {
    id:'Foundation',
    path: "foundation",
    title:'기본 가이드',
    element: <FoundationPage />,
    children: [
      {
        id:'Design',
        path: "design",
        title:'디자인',
        element: <DesignPage />
      },
      {
        id:'Icon',
        path: "icon",
        title:'아이콘 모음',
        element: <IconPage />
      },
      {
        id:'Breakpoints',
        path: "breakpoints",
        title:'Breakpoints',
        element: <BreakpointsPage />
      },
    ],
  },
  {
    id:'Assets', 
    path: "assets",
    title:'리소스',
    element: <AssetsPage />,
  },
  {
    id:'Components',
    path: "components",
    title:'컴포넌트',
    element: <ComponentsPage />,
  },
  {
    id:'Hooks',
    path: "hooks",
    title:'커스텀 훅',
    element: <HooksPage />,
  },
  {
    id:'Utils',
    path: "utils",
    title:'유틸 함수',
    element: <UtilsPage />,
  },
  {
    id:'Preferences',
    path: "preferences",
    title:'환경설정',
    element: <PreferencesPage />,
  },
];

/*
guide/
├── principles/ # 규칙
│   ├── namingConventions - class, 컴포넌트 명 style 등
│   ├── folder
│   ├── 
│   └── 
├── foundation/      # 기본적인 규칙 (컬러,
│   ├── design - colors, , font, shadows
│   ├── breakpoints
│   ├── Dark mode
│   ├── Themes
│   └── Animation
├── assets/
│   ├── 
│   └── 
├── components/
│   ├── 
│   └── 
├── hooks/
│   ├── 
│   └── 
├── pages/
│   ├── 
│   └── 
├── utils/
│   ├── 
│   └── 
└── contributing.md

.md 설명

## 📌 네이밍 규칙
- `PascalCase` 사용 (`Button.js`, `Modal.js`)
- `index.js` 활용 (`import { Button } from './Button'`)

## 📌 Props 네이밍 가이드
- `isDisabled` (✅ `is` prefix 사용)
- `onClick` (✅ 이벤트 핸들러는 `on` prefix)
- `variant` (✅ 스타일 변형을 위한 `variant` prop)

- `components/` → **재사용 가능한 UI 컴포넌트**
- `pages/` → **라우트 페이지 컴포넌트**
- `hooks/` → **커스텀 훅**
- `utils/` → **유틸 함수**
- `styles/` → **전역 스타일**

*/