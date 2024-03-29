import "../styles/globals.css";
import App, { AppProps } from "next/app";
import { wrapper } from "../store";
import Head from "next/head";
import "@fortawesome/fontawesome-svg-core/styles.css"; // import Font Awesome CSS
import { config } from "@fortawesome/fontawesome-svg-core";
import axios from "../api";
import { userActions } from "../store/user";
import userApi from "../api/user";
import { useDispatch } from "react-redux";
import { commonAction } from "../store/common";
import { NextSeo } from "next-seo";
import { useEffect } from "react";
import kakaoApi from "../api/kakao";
import React from "react";

config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above

const app = ({ Component, pageProps }: AppProps) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(commonAction.setPostState("read"));
    dispatch(commonAction.setDarkMode(getInitDarkMode()));

    // kakao Login check
    const parameterCheck = decodeURI(window.location.href).split("?")[1];
    const kakao_access_code =
      new URLSearchParams(parameterCheck).get("code") || "";

    if (kakao_access_code.length > 1) {
      kakaoLogin(kakao_access_code).finally(() => {
        window.history.pushState(null, "부엉이 개발자", "/");
      });
    }
  }, []);

  const kakaoLogin = async (code: string) => {
    try {
      const user = await kakaoApi.postkakaoLogin(code);

      dispatch(userActions.setLoggedUser(user));
    } catch (e: any) {
      console.log(e.message);
    }
  };

  const getInitDarkMode = () => {
    const now = new Date();
    const utcNow = now.getTime() + now.getTimezoneOffset() * 60 * 1000; // UTC 시간 밀리세컨드로 변환
    const koreanTimeDiff = 9 * 60 * 60 * 1000; // 한국시간은 UTC 보다 9시간 빠름
    const koreaNow = new Date(utcNow + koreanTimeDiff);
    if (18 <= koreaNow.getHours() || koreaNow.getHours() <= 6) return true;

    return false;
  };

  const AnyComponent = Component as any;

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
      <AnyComponent {...pageProps} />
      <div id="root-modal" />
    </>
  );
};

// Cookie Check
app.getInitialProps = wrapper.getInitialAppProps((store) => async (context) => {
  // 로컬에서 실행시 주석 해제
  //process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  const appInitalProps = await App.getInitialProps(context);

  try {
    axios.defaults.headers.common["Cookie"] =
      context.ctx.req?.headers.cookie || "";
    const data = await userApi.meAPI();

    if (data.data.userId) store.dispatch(userActions.setLoggedUser(data.data));
    else store.dispatch(userActions.initUser());
  } catch (e: any) {
    console.log(e.message);
  }
  return { ...appInitalProps };
});

export default wrapper.withRedux(app);
