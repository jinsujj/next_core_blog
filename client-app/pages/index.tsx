import type { GetServerSideProps, NextPage } from "next";
import Body from "./components/Body";
import Footer from "./components/Footer";
import Header from "./components/Header";
import React from "react";
import { wrapper } from "../store";
import userApi from "../api/user";
import { userActions } from "../store/user";
import cookie from "cookie"; 
import { commonAction } from "../store/common";

const Home: NextPage = ({}) => {
  return (
    <>
      <Header />
      <Body/>
      <Footer />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const { req } = context;
    const cookieHeader = req?.headers.cookie;

    const { category = null, subCategory = null, search = null } = context.query;

   // sidebar filtering
    if (category) {
      console.log("category: "+category);
      store.dispatch(commonAction.setCategoryFilter(category as string));
    }
    if (subCategory) {
      console.log("subCategory: "+subCategory);
      store.dispatch(commonAction.setSubCategoryFilter(subCategory as string));
    }
    if (search) {
      store.dispatch(commonAction.setSearchFilter(search as string));
    }

    // Cookie check
    if (cookieHeader) {
      const cookies = cookie.parse(cookieHeader);
      const userLoginCookie = cookies["UserLoginCookie"];
      console.log("UserLoginCookie: ", userLoginCookie);

      if (userLoginCookie) {
        const data = await userApi.meAPI(cookieHeader);
        if (data.data.userId) {
          store.dispatch(userActions.setLoggedUser(data.data));
        } else {
          store.dispatch(userActions.initUser());
        }
      }
    }
    return {
      props: {},
    };
  }
);


export default Home;
