import "../styles/globals.css";
import type { AppProps } from "next/app";
import { wrapper } from "../store";
import Head from "next/head";

import "@fortawesome/fontawesome-svg-core/styles.css"; // import Font Awesome CSS
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>사심가득 블로그</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
export default wrapper.withRedux(MyApp);
