
import React from 'react';

interface ThemeType {
  theme: string,
  children: React.ReactNode;
}
const MyComponent = React.memo(({ theme }:ThemeType) => {

  console.log('MyComponent')

  return (
    <div className={`App ${theme ? 'dark-mode' : 'light-mode'}`}>
      {/* 컴포넌트 내용 */}
    </div>
  );
});

export default MyComponent;


