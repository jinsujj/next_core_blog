import "../styles/globals.css";
import { wrapper } from "../store";
import Head from "next/head";
import "@fortawesome/fontawesome-svg-core/styles.css"; // import Font Awesome CSS
import { config } from "@fortawesome/fontawesome-svg-core";
import { userActions } from "../store/user";
import userApi from "../api/user";
import { useDispatch } from "react-redux";
import { commonAction } from "../store/common";
import { NextSeo } from "next-seo";
import { useEffect } from "react";
import kakaoApi from "../api/kakao";
import React from "react";
import AppPropsWithLayout from "../types/AppPropsWithLayout";
import { GetServerSideProps } from "next/types";

// font Awesome css 자동추가방지 
config.autoAddCss = false

function MyApp({Component, pageProps}: AppPropsWithLayout){
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(commonAction.setPostState("read"));
    dispatch(commonAction.setDarkMode(initDarkMode()));

    (async () => {
      const kakaoAccessCode = new URLSearchParams(window.location.search).get('code');
      if (kakaoAccessCode) {
        try {
          const user = await handleKakaoLogin(kakaoAccessCode);
          dispatch(userActions.setLoggedUser(user));
          window.history.pushState(null, "부엉이 개발자", "/");
        } catch (error) {
          console.error('Login failed:', error);
        }
      }
    })();
  },[]);

  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <>
      <NextSeo
        title="부엉이 개발자 블로그"
        description="CTO 가 되고픈 부엉이 블로그 입니다"
        canonical="https://www.owl-dev.me"
        openGraph={{
          url: `https://www.owl-dev.me`,
          title: "부엉이 개발자 블로그",
          description: "CTO 가 되고픈 부엉이 블로그 입니다",
          images: [
            {
              url: "https://www.owl-dev.me/img/owl.svg",
              width: 800,
              height: 600,
            },
          ],
        }}
      />
      <Head>
        <title>부엉이 개발자 블로그</title>
        <meta
          name="naver-site-verification"
          content="857ab4a6de4aa0b0ddd2df29bcd1fb3129fe9198"
        />
        <meta
          name="google-site-verification"
          content="sxi1RDD-x-R6U-lHMRiV2kEtt-m7NVfNAaK-JoPyzTA"
        />
      </Head>
      {getLayout(<Component {...pageProps} />)}
      <div id="root-modal" />
    </>
  )
}

const initDarkMode = () => {
    const now = new Date();
    const utcNow = now.getTime() + now.getTimezoneOffset() * 60 * 1000; // UTC 시간 밀리세컨드로 변환
    const koreanTimeDiff = 9 * 60 * 60 * 1000; // 한국시간은 UTC 보다 9시간 빠름
    const koreaNow = new Date(utcNow + koreanTimeDiff);
    if (18 <= koreaNow.getHours() || koreaNow.getHours() <= 6) return true;

    return false;
  };

 const handleKakaoLogin = async (code: string) => {
        return await kakaoApi.postkakaoLogin(code);
  };


export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(store => async (context) => {
  const cookieHeader = context.req?.headers.cookie;
  const data = await userApi.meAPI(cookieHeader);

  if (data.data.userId) {
    store.dispatch(userActions.setLoggedUser(data.data));
  } else {
    store.dispatch(userActions.initUser());
  }
  return { props: {} };
});

export default wrapper.withRedux(MyApp);
