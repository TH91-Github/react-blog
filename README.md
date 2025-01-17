## 안녕하세요.😁 
> 웹표준, 접근성, 페이지를 구성하는 기능, 애니메이션 등 퍼블리셔로 쌓은 경험을 바탕으로<br />
> 더 성장하여 프론트엔드 기술을 습득하고 목표로 하고 있습니다.<br /><br />
> 🖥️ React를 이용해서 일상에서 사용할 수 있는 화면과 기능을 만들고<br />
> 공유해서 같이 이용하고자 하는 목표로 진행하고 있습니다.<br /><br />
> 책임감을 가지고 일을 맡고 해결하며!<br />
> 해결하지 못한 부분은 다양하게 접근하고 해결하기 위해 노력합니다!

### 🧾 Portfolio & Resume 
- [이력서](https://main-th-blog.vercel.app/resume)
- [오픈 URL](https://th-react-blog.vercel.app/)

### Tech Stacks
- <span><img src="https://img.shields.io/badge/HTML-E86028?style=flat-square&logo=html&logoColor=white" alt="HTML"/></span>/<span><img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&amp;logo=css3&amp;logoColor=white" alt="css"/></span>
- <span><img src="https://img.shields.io/badge/Figma-F24E1E?style=flat-square&logo=Figma&logoColor=white" alt="figma"/></span>/<span><img src="https://img.shields.io/badge/Adobe Photoshop-31A8FF?style=flat-square&logo=Adobe Photoshop&logoColor=white" alt="Adobe Photoshop"/></span>
- <span><img src="https://img.shields.io/badge/SASS-CC6699?logo=sass&logoColor=white" alt="sass"/></span>
- <span><img src="https://img.shields.io/badge/styled components-DB7093?logo=styled-components&logoColor=white" alt="styled components"/>
- <span><img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=white" alt="React"></span>
- <span><img src="https://img.shields.io/badge/Vue.js-4FC08D?style=flat-square&logo=Vue.js&logoColor=white" alt="Vue" /></span>
- <span><img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=JavaScript&logoColor=white" alt="JavaScript"></span>
- <span><img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=TypeScript&logoColor=white" alt="TypeScript"></span>
- <span><img src="https://img.shields.io/badge/Git-F05032?style=flat-square&amp;logo=git&amp;logoColor=white" alt="git" /></span>/<span><img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=GitHub&logoColor=white" alt="GitHub" /></span>
- <span><img src="https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&amp;logo=firebase&amp;logoColor=black" alt="Firebase"></span>
- <span><img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=Vercel&logoColor=white" alt="Vercel" /></span>
### React Project
개인 프로젝트 - 지도, 날씨 등

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

### ✅ 시작
npm start
### node version
18.17.1
