import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";
import React from "react";
import { GA_TRACKING_ID } from "../utils/gtag";


const NaverMapClientId = process.env.NEXT_PUBLIC_CREACT_APP_MAP_CLIENT_ID;
class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          {/* favIcon */}
          <link rel="shortcut icon" type="image/x-icon" href="/img/owl.svg" />
          <link rel="icon" href="/img/owl.svg" />
          <link rel="apple-touch-icon" href="/img/owl.svg" />

          {/* Standard Font */}
          <link
            href="https://fonts.googleapis.com/css?family=Nanum+Gothic+Coding:400"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Nanum+Gothic:400"
            rel="stylesheet"
          ></link>
          <link
            href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;500;600"
            rel="stylesheet"
          />

          {/* bootstrap  3.4.1*/}
          <link rel="stylesheet" href="../css/bootstrap.min.css" />
          {/* summmernote 0.8.18 */}
          <link
            href="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote.min.css"
            rel="stylesheet"
          />
          {/* prism one-dark theme */}
          <link href="../css/prism-one-dark.css" rel="stylesheet" />
        </Head>
        <body>
          <Main />
          <NextScript />
          {/* jquery 3.6.1 */}
          <script src="https://code.jquery.com/jquery-3.6.1.slim.min.js" />
          <script
            async
            src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js"
          />
          {/* fontawesom */}
          <script
            async
            src="https://kit.fontawesome.com/3ec141240c.js"
          />
          {/* bootstrap */}
          <script
            async
            src="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"
          />
          {/* summernote */}
          <script
            async
            src="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote.min.js"
          />
          <script async src="../js/summernote-ext-syntax.js"/>
          {/* Global Site Tag (gtag.js) - Google Analytics */}
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());
                      gtag('config', '${GA_TRACKING_ID}', {
                        page_path: window.location.pathname,
                      });`,
            }}
          />
          {/* google Adsense */}
          <script
            defer
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2309486098831986"
          />
          {/* NaverMap */}
          <script
            type="text/javascript"
            src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${NaverMapClientId}`}
          />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
