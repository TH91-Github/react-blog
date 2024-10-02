import { ListBar } from "assets/style/StyledCm";
import { colors } from "assets/style/Variable";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components"
import { ScrollList } from "./ScrollList";

interface ImgUploadType {
  preview?: boolean,
  imgLength?: number,
  imgSize?: number,
  imgUpdate: (imgData:ImgFileType[]) => void,
}
export interface ImgFileType {
  file: File;
  url: string;
}
export const ImgUpload = ({preview = true, imgLength, imgSize, imgUpdate}:ImgUploadType) => {
  const [imgFileArr, setImgFileArr] = useState<ImgFileType[]>([]);
  const [isError, setIsError] = useState({state:false, desc:''});
  const imgRef = useRef<HTMLInputElement | null>(null);
  const errorTimeRef =  useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxLength = imgLength ?? 3;
  const maxSize = (imgSize ?? 6) * 1024 * 1024; // 기본 6MB
  const noticeList = useMemo(() => [
    `최대 ${maxLength}개의 이미지만 등록 가능합니다.`,
    "이미지는 jpg, jpeg, png 형식만 가능합니다.",
    `이미지당 최대 용량은 ${imgSize ?? 5}MB입니다.`,
  ], [maxLength, imgSize]);

  const errorChk = useCallback(( number:number) => {
    setIsError({state: true, desc: noticeList[number]});
    if (errorTimeRef.current) clearTimeout(errorTimeRef.current);
    errorTimeRef.current = setTimeout(() => {
      setIsError({state:false, desc:''})
    }, 2500);
  },[noticeList])

  // input 이미지 업로드
  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      if(files.length <= maxLength && (imgFileArr.length + files.length <= maxLength) ){
        const imgFiles = Array.from(files); 
        const hasError = imgFiles.some((imgItem) => {
          if (!["image/jpeg", "image/png"].includes(imgItem.type)) { // 이미지 확장자 체크
            errorChk(1)
            return true;
          }
          if (imgItem.size > maxSize) {// EX) 6MB보다 클 경우
            errorChk(2);
            return true;
          }
          return false;
        });
        if (!hasError) {
          const newFiles = imgFiles.map(file => ({
            file,
            url: URL.createObjectURL(file) //이미지 URL
          }));
          setImgFileArr((prevFiles) => [...newFiles, ...prevFiles]);
        }
      }else{
        // 제한 된 이미지 수 안내
        errorChk(0);
      }
      // ✅ onChange 이벤트 리셋 (같은 이미지 올릴 수 있도록 하기 위함. 에러 발생 이미지 포함)
      if (imgRef.current) { 
        imgRef.current.value = "";
      }
    }
  }, [imgFileArr, maxLength, maxSize, errorChk]);

  // button 삭제
  const handleImgRemove = useCallback((removeIndex: number) => {
    setImgFileArr((prev) => prev.filter((_, idx) => idx !== removeIndex));
  },[])

  useEffect(()=>{ // 추가 삭제 시 부모에게 전달
    imgUpdate(imgFileArr)
  },[imgFileArr])

  return (
    <StyleImgUpload className="imgupload">
      {
        imgFileArr.length > 0
        ? (
          preview ? (
            <ScrollList 
              isScroll={imgFileArr.length > 1 ? true : false} 
              flexType={'x'}>
              <ul className="img-preview-lists">
                {
                  imgFileArr.map((imgItem, index) => (
                    <FileItem 
                      preview={preview}
                      imgData={imgItem} 
                      index={index}
                      handleClickEvent={handleImgRemove} 
                      key={index} />
                  ))
                }
              </ul>
            </ScrollList>
          )
          : (
            <ul className="upload-lists">
              {
                imgFileArr.map((imgItem, index) => (
                  <FileItem 
                    preview={preview}
                    imgData={imgItem} 
                    index={index}
                    handleClickEvent={handleImgRemove} 
                    key={index} />
                ))
              }
            </ul>
          )
        )
        : <p className="text">🖼️ 사진을 등록해 주세요.😁</p>
      }
      <div className="img-add">
        <input 
          ref={imgRef}
          type="file"
          id="image-upload" 
          className="input-upload" 
          name="file" 
          accept="image/jpeg, image/png" 
          multiple
          onChange={handleUpload} />
        <label htmlFor="image-upload" className="btn-upload btn">사진 추가</label>
      </div>
      <div className="notice-wrap">
        {
          isError.state 
          ? (
            <p className="error">에러 ! {isError.desc}</p>
          )
          : (
            <ListBar>
              {
                noticeList.map((noticeItem,idx) => 
                  <li key={idx}>
                    {noticeItem}
                  </li>
                )
              }
            </ListBar>
          )
        }
      </div>
    </StyleImgUpload>
  )
}

// ⭐ 이미지 item
interface FileItemType {
  preview: boolean,
  imgData: ImgFileType,
  index: number,
  handleClickEvent: (e: number) => void,
}
const FileItem = ({preview, imgData, index, handleClickEvent}:FileItemType) => {
  const handleItemClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    handleClickEvent(index)
  },[index,handleClickEvent])
  return (
    <li>
      {
        preview 
          ? (
            <img src={imgData.url} alt={`업로드 이미지 - ${index}`} />
          )
          : <p>{imgData.file.name}</p>
      } 
      <button 
        type="button" 
        className="close-btn"
        title="삭제"
        onClick={(e) => handleItemClick(e)} >
        <span>삭제</span>
      </button>
    </li>
  )
}
const StyleImgUpload = styled.div`
  position:relative;
  .img-preview-lists {
    & > li {
      overflow:hidden;
      position:relative;
      .close-btn {
        position:absolute;
        z-index:5;
        top:5px;
        right:5px;
        width:20px;
        height:20px;
        border-radius:5px;
        background: rgba(0,0,0,.5);
        &::before, &::after{
          background:${colors.baseWhite};
        }
      }
    }
  }
  .upload-lists {
    & > li {
      position:relative;
      padding:10px 10px;
      border-top:1px solid ${colors.lineColor};
      font-size:14px;
      &::before {
        position:absolute;
        top:50%;
        left:0;
        width:5px;
        height:1px;
        background:${props => props.theme.color};
        content:'';
      }
      &:first-child {
        border:none;
      }
      .close-btn {
        top:50%;
        right:5px;
        width:15px;
        height:15px;
        transform:translateY(-50%);
      }
    }
  }

  .input-upload {
    position:absolute;
    top:0;
    left:0;
    width:1px;
    height:1px;
    opacity:0;
  }
  .img-add {
    margin-top:20px;
  }
  .btn-upload{
    display:block;
    width:100%;
    padding: 8px;
    border-radius: 5px;
    border:1px solid ${colors.navy};
    font-weight: 600;
    text-align:center;
    transition: all .3s;
    cursor:pointer;
    &:focus, &:hover{ 
      background:${colors.navy};
      color:${colors.baseWhite};
    }
  }
  .notice-wrap {
    margin-top:10px;
    & > ul {
      & > li {
        margin-top:8px;
        font-size:12px;
        color:${colors.subTextColor};
        &:first-child{
          margin-top:0;
        }
      }
    }
  }
  .error{
    font-size:12px;
    color:${colors.red};
    animation: error-text-ani 0.8s infinite;
  }
  @keyframes error-text-ani {
    0%, 100%{
      opacity:1;    
    }
    50% { 
      opacity:0.5;
    }
  }
`;