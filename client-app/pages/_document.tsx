import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";


class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          {/* Standard Font */}
          <link href="https://fonts.googleapis.com/css?family=Nanum+Gothic+Coding:400" rel="stylesheet"/>
          <link href="https://fonts.googleapis.com/css?family=Nanum+Gothic:400" rel="stylesheet"></link>
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;500;600" rel="stylesheet"/>
          <link href="https://hangeul.pstatic.net/hangeul_static/css/NanumHimNaeRaNeunMarBoDan.css" rel="stylesheet"/>
          <link href="https://hangeul.pstatic.net/hangeul_static/css/NanumBaReunHiPi.css" rel="stylesheet"></link>

          
          {/* jquery 3.6.0 */}
          <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

          {/* bootstrap  3.4.1*/}
          <link
            href="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css" rel="stylesheet"/>
          <script src="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>

          {/* summmernote 0.8.20 */}
          <link href="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote.min.css" rel="stylesheet"/>
          <script src="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote.min.js"></script>
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
