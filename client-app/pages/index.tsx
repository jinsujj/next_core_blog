import type { NextPage } from "next";
import Body from "./components/Body";
import Footer from "./components/Footer";
import Header from "./components/Header";

const Home: NextPage = () => {
  return (
    <>
      <Header />
      <Body />
      <Footer />
    </>
  );
};

export default Home;
