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
import { useEffect, useState } from "react";
import kakaoApi, { kakaoToken, kakaoTokenResponse } from "../api/kakao";
config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above


const app = ({ Component, pageProps }: AppProps) => {
  const dispatch = useDispatch();
  dispatch(commonAction.setPostState("read"));

  useEffect(() => {
    // kakao Login check
    const search = decodeURI(window.location.href).split("?")[1];
    const KAKAO_ACCESS_CODE = new URLSearchParams(search).get("code") || "";

    if(KAKAO_ACCESS_CODE.length > 1 ){
      kakaoLogin(KAKAO_ACCESS_CODE);
    }
  }, []);

  const kakaoLogin = async (KAKAO_ACCESS_CODE:string) => {
    const token:kakaoTokenResponse = await kakaoApi.postAccesCode({
      client_id: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID || "",
      redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI || "",
      code: KAKAO_ACCESS_CODE,
      client_secret: process.env.NEXT_PUBLIC_KAKAO_CLIENT_SECRET || "",
    });

    const {data} = await kakaoApi.postKaKaoToken(token.access_token);
    dispatch(userActions.setLoggedUser(data));
    console.log(data);
  };

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
      <Component {...pageProps} />
      <div id="root-modal" />
    </>
  );
};

// Cookie Check
app.getInitialProps = wrapper.getInitialAppProps((store) => async (context) => {
  //process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  const appInitalProps = await App.getInitialProps(context);
  const cookieObject = context.ctx.req?.headers.cookie;
  try {
    axios.defaults.headers.common["Cookie"] =
      context.ctx.req?.headers.cookie || "";

    const data = await userApi.meAPI();
    if (data.data.userId) {
      store.dispatch(userActions.setLoggedUser(data.data));
    } else {
      store.dispatch(userActions.initUser());
    }
  } catch (e: any) {
    console.log(e.message);
  }
  return { ...appInitalProps };
});

export default wrapper.withRedux(app);
