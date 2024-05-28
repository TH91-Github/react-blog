const path = require('path');

module.exports = {
  entry: './src/index.tsx', // 시작 파일
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'), // 빌드 출력 디렉토리
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'], // 해석할 확장자
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/, // JS, JSX, TS, TSX 파일 처리
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/, // CSS 파일 처리
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/, // 이미지 파일 처리
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]', // 파일명에 해시 추가
              outputPath: 'images', // 출력 경로
            },
          },
        ],
      },
    ],
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'), // 개발 서버의 루트 디렉토리
    compress: true, // gzip 압축 활성화
    port: 3000, // 개발 서버 포트
    historyApiFallback: true, // SPA 라우팅 지원
  },
};
