import { InnerStyle } from 'assets/style/StyledCm';
import { colors, media } from 'assets/style/Variable';
import StudyListPage from 'components/article/study/StudyListPage';
import BackBtn from "components/element/BackBtn";
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { mapObjectChange } from 'utils/common';
import StudyDetail from "./StudyDetail";
import { StudyDataType, studyDataBase } from './study';

interface StudyPageProps {}

export default function StudyPage({}: StudyPageProps) {
  const params = useParams<{ id?: string }>(); // useParams를 제네릭으로 타입 지정
  const [studyData, setStudyData] = useState<StudyDataType[] | null>(null); // StudyItem[] 타입으로 지정
  const [navList, setNavList] = useState<{ title: string; size: number }[]>([]); // navList 타입 지정
  const [studyList, setStudyList] = useState<StudyDataType[]>([]);
  const navigate = useNavigate();

  // data load
  const dataLoad = useCallback(() => {
    const studyListData = studyDataBase;
    setStudyData(studyListData);
    navListAdd(studyListData);
    setStudyList(studyListData);
  }, []);

  useEffect(() => {
    dataLoad();
  }, [dataLoad]);

  function navListAdd(navData: StudyDataType[]) {
    // 함수 내부에서 navData의 타입 지정
    const listMap = new Map<string, number>();

    for (let item of navData) {
      for (let keyVal of item.keyword) {
        listMap.set(keyVal, (listMap.get(keyVal) || 0) + 1);
      }
    }

    setNavList(mapObjectChange(listMap));
  }

  function studyListUpdate(selectKey: string) {
    let newList: StudyDataType[] | null = null;
    if (selectKey === "All") {
      newList = studyData;
    } else {
      newList = studyData?.filter((item) => item.keyword.includes(selectKey)) ?? null
    }
    setStudyList(newList || []);
  }

  function navBtn(navTit: string) {
    studyListUpdate(navTit);
    console.log(params.id)
    if (params.id) navigate(`/study`);
  }

  function detailPageLink(detailItem: StudyDataType) {
    navigate(`/study/detail/${detailItem.id}`);
    detailData();
  }

  const detailData = useCallback(() => {
    if (params.id) console.log("오케이");
  }, [params.id]);

  return (
    <StyleWrap className="study">
      <StyleStudyInner>
        <div className="study-nav">
          <div className="study-sticky">
            <ul className="nav-lists">
              {navList?.map((item, idx) => (
                <li className="nav-item" key={idx}>
                  <button type="button" className="nav-btn" onClick={() => navBtn(item.title)}>
                    <span className="tit">{item.title}</span>
                    <span className="num">({item.size})</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="study-cont">
          {!params.id ? (
            <StudyListPage studyList={studyList} clickEvent={detailPageLink} />
          ) : (
            <div className="study-detail">
              <StudyDetail />
              <BackBtn />
            </div>
          )}
        </div>
      </StyleStudyInner>
    </StyleWrap>
  );
}

const StyleWrap = styled.div`
  background: ${props => props.theme.type === 'dark' ? colors.bgSubBlack : colors.baseWhite}; 
  .study{
    &-nav {
      display:flex;
      flex-direction: column;
      gap:20px;
      position:relative;
      height:100%;
      padding:20px;
    }
    &-sticky {
      display:block;
      position:sticky;
      top:80px;
    }
    &-cont {
      position:relative;
      border:1px solid red;
      height:1200px;
      padding:20px;
      border-radius:10px;
      border:1px solid ${colors.lineColor};
      background:${props => props.theme.type === 'dark' ? colors.bgContBlack : colors.originWhite}; 
      .btn {
        &.back{
          position:absolute;
          top:20px;
          right:20px;
        }
      }
    }
  }
`;
const StyleStudyInner = styled(InnerStyle)`
  display:grid;
  grid-template-columns: 3fr 7fr;
  gap: 20px;
  padding-top:70px;
  ${media.mo}{
    padding-top:70px;
  }
`;
