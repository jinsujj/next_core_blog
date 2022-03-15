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
