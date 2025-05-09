## React Project
개인 프로젝트 - 지도, 날씨 등

### 안녕하세요.😁 
> 🖥️ React 프로젝트 공공 데이터 API 와 카카오맵을 활용하여 
> 지역별 날씨 검색과 지도 검색 및 특정 플레이스 리뷰 별점을 기록할 수 있도록 하였습니다.
<br /><br />

### 🧾 Portfolio & Resume 
- <a href="https://main-th-blog.vercel.app/resume" target="_blank" rel="noopener noreferrer">Resume</a>
- <a href="https://th-react-blog.vercel.app" target="_blank" rel="noopener noreferrer">일반 URL</a>

### Tech Stacks
- <span><img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=white" alt="React"></span>
- <span><img src="https://img.shields.io/badge/styled components-DB7093?logo=styled-components&logoColor=white" alt="styled components"/></span>
- <span><img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=TypeScript&logoColor=white" alt="TypeScript"></span>
- <span><img src="https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&amp;logo=firebase&amp;logoColor=black" alt="Firebase"></span>
- <span><img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=Vercel&logoColor=white" alt="Vercel" /></span>
- <span><img src="https://img.shields.io/badge/공공 데이터-008FC7.svg?style=for-the-badge&logoColor=000000" alt="공공 데이터" /></span>
- <span><img src="https://img.shields.io/badge/kakao Map-ffcd00.svg?style=for-the-badge&logoColor=000000" alt="Kakao Map" /></span>

### 날씨 - 기상청 오픈 API
- [공공데이터 포털](https://www.data.go.kr/index.do)
- 주단기예보조회, 초단기예보조회, 초단기실황조회 순차적으로 요청 및 업데이트를 진행.
#### 공공데이터 API 요청 딜레이 시간 감소
> 첫 요청으로 받은 데이터를 Firebase에 저장한 후, 
> 동일한 시간과 위치라면 공공데이터에 재요청하지 않고 Firebase에 요청 후 데이터 활용
- 2회 요청 시 데이터 요청 시 공공데이터 API의 딜레이 시간을 최소화하여, 빠르고 효율적인 데이터 처리.
- 공공데이터 무료제공 요청 횟수(10,000회) 여유로운 firebase(50,000회) 요청 수 활용 비용 절감.
- react-Query를 활용하여 서버 상태 관리 및 데이터 페칭을 최적화하고 효율적인 비동기 데이터 요청과 캐싱을 구현하여 성능을 개선

### 지도 - 카카오 맵 오픈 API
- [kakaomap](https://apis.map.kakao.com/)
- 검색, Place 정보, 즐겨찾기, 지도 클릭 지점 Place 정보 List 노출.
> 카카오맵에서 검색, 클릭 지점 반경 내 Place 받아오기, 마크 표시를 활용하여
> 지도에 노출하고 회원일 경우 댓글, 리뷰, 사진 등록, 즐겨찾기 기능을 서비스를 제공.

#### 📰 Firebase 
> 회원관리 및 데이터 사용.<br />
> Firebase에서 제공하는 Authentication 보안 된 회원관리를 하며,
> Firestore에 추가 유저, 날씨, 위치(즐겨찾기, 리뷰 등) 데이터 관리를 하고 있습니다.
> Storage를 이용하여 img 추가, 삭제 관리하고 있습니다.
- Firestore Database
- Authentication
- Storage



| 분류               | 라이브러리/패키지 이름                                  | 설명 |
|--------------------|---------------------------------------------------------|------|
| **기본 프레임워크** | `react`, `react-dom`, `react-scripts`                  | React 18 기반 CRA (Create React App) 프로젝트 |
| **상태 관리**       | `@reduxjs/toolkit`, `redux-thunk`, `react-redux`       | Redux 및 Thunk 미들웨어 기반 전역 상태 관리 |
|                    | `@tanstack/react-query`, `@tanstack/react-query-devtools` | 서버 상태 및 캐싱 관리 (비동기 API 데이터 처리 최적화) |
| **차트**            | `@nivo/bar`, `@nivo/line`                               | Nivo 기반 데이터 시각화 라이브러리 (Bar/Line 차트) |
| **지도 관련**       | `react-kakao-maps-sdk`                                  | Kakao 지도 SDK를 React에서 사용하기 위한 래퍼 |
| **UI / 스타일링**   | `styled-components`                                     | CSS-in-JS 방식의 컴포넌트 스타일링 도구 |
| **슬라이더**        | `swiper`                                                | 모바일 및 웹 슬라이더, 캐러셀 구현 |
| **성능 최적화**     | `react-lazyload`                                        | 컴포넌트/이미지 Lazy Load 처리 |
| **유형 시스템**     | `typescript`, `@types/*`                                | TypeScript 및 관련 타입 선언 패키지 |
| **테스트**          | `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event` | React Testing Library 기반 유닛 테스트 환경 구성 |
| **기타 도구**       | `web-vitals`                                            | 성능 측정 (LCP, FID, CLS 등 웹 바이탈 수치 측정) |
|                    | `firebase`                                              | 백엔드 기능 (인증, DB, 호스팅 등) 사용 |

감사합니다. 😀 






