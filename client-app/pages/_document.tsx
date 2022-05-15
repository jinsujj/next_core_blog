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

          {/* jquery 3.6.0 */}
          <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

          {/* bootstrap  3.4.1*/}
          <link
            href="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"
            rel="stylesheet"
          />
          <script src="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>

          {/* summmernote 0.8.20 */}
          <link
            href="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote.min.css"
            rel="stylesheet"
          />
          <script src="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote.min.js"></script>

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
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
