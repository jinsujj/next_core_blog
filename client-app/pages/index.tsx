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
import noteApi from "../api/note";

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

    // sidebar filtering
    if (category) {
      console.log("category: "+category);
      store.dispatch(commonAction.setCategoryFilter(category as string));
    }
    else if (subCategory) {
      console.log("subCategory: "+subCategory);
      store.dispatch(commonAction.setSubCategoryFilter(subCategory as string));
    }
    else if (search) {
      store.dispatch(commonAction.setSearchFilter(search as string));
    }
    else {
      // init to random page
      const response = await noteApi.getNoteSummary();
      const randomIdx = Math.floor(Math.random() * response.data.length);
      const blogId = response.data[randomIdx].noteId;

      return {
        redirect:{
          destination: `/blog/${blogId}`,
          permanent: false,
        }
      };
    }

    return {
      props :{},
    }
  }
);


export default Home;
