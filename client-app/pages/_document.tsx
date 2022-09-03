import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";
import { GA_TRACKING_ID } from "../utils/gtag";

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
          <link rel="shortcut icon" type="image/x-icon" href="./img/owl.svg" />
          <link rel="icon" href="./img/owl.svg" />
          <link rel="apple-touch-icon" href="./img/owl.svg" />

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
          <link
            href="https://hangeul.pstatic.net/hangeul_static/css/NanumHimNaeRaNeunMarBoDan.css"
            rel="stylesheet"
          />
          <link
            href="https://hangeul.pstatic.net/hangeul_static/css/NanumBaReunHiPi.css"
            rel="stylesheet"
          ></link>

          {/* bootstrap  3.4.1*/}
          <link
            rel="stylesheet"
            href="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"
          />
          {/* summmernote 0.8.20 */}
          <link
            href="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote.min.css"
            rel="stylesheet"
          />
         {/* prism one-dark theme */}
          <link
            href="../css/prism-one-dark.css"
            rel="stylesheet"
          />

          {/* google Adsense */}
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2309486098831986"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
          {/* jquery 3.6.0 */}
          <script src="https://code.jquery.com/jquery-3.6.1.slim.min.js" />
          <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js"></script>
          {/* fontawesom */}
          <script src="https://kit.fontawesome.com/3ec141240c.js"></script>
          {/* bootstrap */}
          <script src="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>

          {/* summernote */}
          <script src="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote.min.js"></script>
          <script src="../js/summernote-ext-syntax.js"></script>
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
        </body>
      </Html>
    );
  }
}

export default MyDocument;
