import type { NextPage } from "next";
import Body from "./components/Body";
import Footer from "./components/Footer";
import Header from "./components/Header";
import React from "react";

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
