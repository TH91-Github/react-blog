// 특수문자 & 띄어쓰기 감지
export function specialCharactersSpacesCheck(text: string): boolean {
  const regex = /^[^\s\p{P}]+$/u;
  return !regex.test(text);
}

// 스페이스 바 감지
export function spacesCheck(text: string): boolean {
  const regex = /\s/;
  return regex.test(text);
}

// 영문 대/소문자와 숫자만 허용
export function enNumberCheck(text: string): boolean {
  // 영문자가 포함되어 있는지 확인하는 정규식
  const containsLetter = /[A-Za-z]/.test(text);
  // 영문 대/소문자와 숫자만으로 구성되어 있는지 확인하는 정규식
  const isAlphaNumeric = /^[A-Za-z0-9]+$/.test(text);
  return containsLetter && isAlphaNumeric;
}

// email 체크 : 한글 @ 포함 확인 / .포함 / id 4글자:{4,} .이후 2글자:{2,} 
export function emailCheck (email:string):boolean{
  const regex = /^[A-Za-z0-9._%+-]{4,}@[A-Za-z0-9-]+\.[A-Za-z]{2,}$/;
  return !regex.test(email)
}



