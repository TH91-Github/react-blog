import { _black, StyledSvg, SvgPropsType } from "../common/CommonSvg"

// 폴더 
export const SvgFolder = (({$fillColor}:SvgPropsType ) => {
  return <StyledSvg $fillColor={$fillColor || _black }  viewBox="0 0 24 24" fill="none">
   <path d="M4 2C3.20435 2 2.44129 2.31607 1.87868 2.87868C1.31607 3.44129 1 4.20435 1 5V19C1 19.7957 1.31607 20.5587 1.87868 21.1213C2.44129 21.6839 3.20435 22 4 22H20C20.7957 22 21.5587 21.6839 22.1213 21.1213C22.6839 20.5587 23 19.7957 23 19V8C23 7.20435 22.6839 6.44129 22.1213 5.87868C21.5587 5.31607 20.7957 5 20 5H11.5352L10.1289 2.8906C9.75799 2.3342 9.13352 2 8.46482 2H4Z"/>
  </StyledSvg>
})