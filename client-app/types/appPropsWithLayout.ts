import { AppProps } from "next/app";
import { ReactElement, ReactNode } from "react"


type NextPageWithLayout = {
    (pageProps: any): ReactElement;
    getLayout?: (page: ReactElement) => ReactNode;
};


type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout & { (props: any): JSX.Element };
};

export default AppPropsWithLayout;

