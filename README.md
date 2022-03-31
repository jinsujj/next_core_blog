# next_core_blog

Warning : Props 'className' did not match
```
next로 styled-components로 스타일 적용하고, 개발 서버를 띄워서 확인해보면 첫 페이지 로딩은 문제없이 잘 작동하고, 새로고침 이후 Warning : Props 'className' did not match. Server : "블라블라" Client: :"블라블라" 경고메세지가 출력되고, 화면 스타일이 사라져버린다!
첫 페이지는 SSR로 작동하며 이후 CSR로 화면을 렌더링하게 되는데, 이때 서버에서 받은 해시+클래스명과 이후 클라이언트에서 작동하는 해시+클래스 명이 달라지면서 스타일을 불러올수 없는 문제가 발생한다.
```

```
npm i babel-plugin-styled-components
```

.babelrc 설정
```
{
  "presets": ["next/babel"],
  "plugins": ["babel-plugin-styled-components"]
}

프로젝트 루트에 .babelrc 파일을 추가하고, 위와 같이 작성한다.
nextjs 에서 바벨 설정을 추가할떄는 next/babel 프리셋을 항상 추가해야함을 잊지 말자!
```


에디터 히스토리
```
1. CKEditor 에디터
- typescript 지원 안됨.
- 구현 경험 없음
- somefeature is not free

2. SummerNote 에디터
- typescript 지원 안됨. 
- 구현 경험 있음 (이전 개발 블로그 CDN 방식) 동일 적용시 에러 
- has been blocked by CORS policy: Cross origin requests are only supported for protocol schemes: http, data, chrome, chrome-extension, chrome-untrusted, https.
  1. UseCors 설정했음에도, 해당 에러발생 
  2. ts 형식이 지원안되서 강제 js 변환해야하는 이슈, babel 에러 발생
  [solved] .env 설정 https~ 로 설정 
  [solved] axios module typescript 버전으로 재설치

3. Quill 에디터
- typescript 지원됨
  1. Quill SSR 지원 안됨
  [solved] 아래 에러에 대해서 동적으로 처리.
  *(document is not defined Error)
   dynamic(import('react-quill'), {
       ssr: false,
       loading: () => <p>Loading...</p>
   }
  2. 동적으로 처리시 해당 컴포넌트에 useRef 적용 안됨.
  3. Code highlighter 기능 not working without error
