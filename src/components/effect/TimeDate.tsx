import { memo, useEffect, useRef, useState } from "react";
import styled from "styled-components"

interface TimeDateType {
  view:'h' | 'hms'| 'hm' | 'ms';
  updateCheck?: 'h'|'m'; // 업데이트 받을 값 h, m 
  timeUpdate?: (val?:string) => void; // 업데이트 
  delimiterType?:string;
}
export const TimeDate = ({view, updateCheck, timeUpdate, delimiterType}:TimeDateType) => {
  const isTime = CurrentTime();

  const timeDelimiter = () => {
    let result : string | string[];
    
    switch(delimiterType) {
      case 'colon':
        result = ':';
        break;
      case 'dot':
        result = '.';
        break;
      case 'kor':
        result = ['시','분','초']
        break;
      default:
        result = ''
    }
    return result;
  }
  const updateTime = (hms:string, val:string) =>{ // 시, 분 업데이트 부모 체크
    if(updateCheck === hms){
      timeUpdate && timeUpdate(val);
    }
  }
  return (
    <StyleTimeDate>
      {/* 시 */}
      <TimeHours h={isTime.getHours()} update={updateTime}/>
      {/* 분 */}
      {
        view.includes('m') && <>
          <span className="delimiter">{Array.isArray(timeDelimiter()) ? timeDelimiter()[0] : timeDelimiter()}</span>
          <TimeMinutes m={isTime.getMinutes()} update={updateTime}/>
        </>
      }
      {/* 초 */}
      {
        view.includes('s') && <>
          <span className="delimiter">{Array.isArray(timeDelimiter()) ? timeDelimiter()[1] : timeDelimiter()}</span>
          <TimeSeconds s={isTime.getSeconds()} />
          <span className="delimiter">{delimiterType === 'kor' && (Array.isArray(timeDelimiter()) ? timeDelimiter()[2] : timeDelimiter())}</span>
        </>
      }
      
    </StyleTimeDate>
  );
};

const CurrentTime = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return time;
};

// 시
const TimeHours = memo(({ h, update }: { h: number, update: (type:string, val:string) => void }) => {
  const prevMinutesRef = useRef<number>(h);

  // useEffect는 비동기적, 렌더링 이후 실행이 필요한 경우. 현재는 그렇지 않기에 if로
  if (prevMinutesRef.current !== h) { 
    update('h',`${h}`);
    prevMinutesRef.current = h; 
  }
  return <span className="time h">{h}</span>;
});
// 분
const TimeMinutes = memo(({ m, update}: { m: number, update: (type:string, val:string) => void }) => {
  const prevMinutesRef = useRef<number>(m);

  if (prevMinutesRef.current !== m) { 
    update('m',`${m}`);
    prevMinutesRef.current = m; 
  }
  return <span className="time m">{m.toString().padStart(2, '0')}</span>;
});
// 초
const TimeSeconds = memo(({ s }: { s: number }) => {
  return <span className="time s">{s.toString().padStart(2, '0')}</span>;
});

const StyleTimeDate = styled.div`

`;

