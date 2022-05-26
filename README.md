> ### 부엉이 개발 블로그 사이트.

Full Stack 개발자가 되기 위해 쌓아온 그간의 경험을 모아서, 최신 트렌드 기술로 리뉴얼 한 개발 블로그입니다.

<div align=center>
  <p>🔨Techs that I've used in this Project.🔧</p>
  <img src="https://img.shields.io/badge/TypeScript-3766AB?style=flat-square&logo=TypeScript&logoColor=white"/>
   <img src="https://img.shields.io/badge/CSharp-53328c?style=flat-square&logo=C Sharp&logoColor=white"/>
   <img src="https://img.shields.io/badge/CSS-1572b6?style=flat-square&logo=CSS3&logoColor=white"/>
   <img src="https://img.shields.io/badge/Next.js-black?style=flat-square&logo=Next.js&logoColor=white"/>
   <img src="https://img.shields.io/badge/.Net Core-9556ce?style=flat-square&logo=.NET&logoColor=white"/>
   <img src="https://img.shields.io/badge/Mysql-42759c?style=flat-square&logo=MySQL&logoColor=white"/>
   <img src="https://img.shields.io/badge/Nginx-009137?style=flat-square&logo=Bloglovin&logoColor=white"/>
<br/>

<p align="center">
  <br/>
  <p>🦉owl-dev.me🦉 </p>
  <a href="https://www.owl-dev.me" target="_blank">
     <img src="https://img.shields.io/badge/부엉이 개발자 블로그-6d4534?style=flat-square&logo=Bloglovin&logoColor=white"/></a>
  <br/><br/>
  <img src="https://jinsujj.github.io/github_css_study/img/next_core_blog.jpg" width="40%"/>
</p>
  
Front-end : Next.js  <br>
Back-end  : .Net Core 5 <br>
Language  : typescript , C# , SQL <br>
Database  : MySQL 
<br/>
</div> 

구조설명
------
>해당 리포지토리는 ASP.NET 프로젝트의 폴더 구조 형태에서 'client-app' 폴더를 새로운 next.js 프로젝트로 구성하여 Frontend 부분과, Backend 부분을 같이 관리하고 있습니다. <br/>
<br/>

<b>'next_core_blog_erd'</b> - mysql ERD 구조를 보관하고 있습니다. <br/>
<b>'CommonLibrary'</b>      - *FileUpload* , *Security* 관련 Library 를 처리합니다. <br/> 
<b>'Startup.cs'</b>         - *'Cookie'* 및 *'Cors'*, *'DB Repository'* 를 관리합니다. <br/>
<b>'Context/DapperContext'</b> - mysql Db 와 ORM 연동을 해줍니다 <br/>
<br/>
<b>'client-app/api'</b>    - api(axios) 정의 부분입니다 <br/>
<b>'client-app/hooks'</b>  - *'모달'*, *'댓글(Utterance)'*, *'검증(validate)'* hook 으로 처리합니다<br/>
<b>'client-app/pages'</b>  - posting글(blog/[id]) 과 componet 를 관리합니다 <br/>
<b>'client-app/store'</b>  - Redux 관련 *'권한'*, *'카테고리'*, *'공통'*, *'유저'* 를 관리합니다.  <br/>
<b>'client-app/utils'</b>  - Google Analytics 구현 관련 처리합니다 <br/>
<br/>

부엉이 개발자 사이트 제작기
------
https://www.owl-dev.me/blog/26

https://www.owl-dev.me/blog/13

https://www.owl-dev.me/blog/30


<br/><br/>
비고
------
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

