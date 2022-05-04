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
config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above

const app = ({ Component, pageProps }: AppProps) => {
  const dispatch = useDispatch();
  dispatch(commonAction.setPostState("read"));
  
  return (
    <>
      <Head>
        <title>부엉이 개발자 블로그</title>
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
    axios.defaults.headers.common["Cookie"] = context.ctx.req?.headers.cookie || "";
    const data = await userApi.meAPI();
    if(data.data.userId){
      store.dispatch(userActions.setLoggedUser(data.data));  
    }
    else{
      store.dispatch(userActions.initUser());
    }
  } catch (e: any) {
      console.log(e.message);
  }
  return { ...appInitalProps };
});

export default wrapper.withRedux(app);
