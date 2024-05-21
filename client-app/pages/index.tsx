import type { GetServerSideProps, NextPage } from "next";
import Body from "./components/Body";
import Footer from "./components/Footer";
import Header from "./components/Header";
import React from "react";
import { wrapper } from "../store";
import userApi from "../api/user";
import { userActions } from "../store/user";
import cookie from "cookie"; 
import noteApi, { PostedNote } from "../api/note";

interface IProps {
  blogContents: PostedNote[];
}

const Home: NextPage<IProps> = ({blogContents}) => {
  return (
    <>
      <Header />
      <Body blogContents ={blogContents} />
      <Footer />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const { req } = context;
    const cookieHeader = req?.headers.cookie;

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

    const state = store.getState();
    const blogContentsResponse = await noteApi.getNoteAll(state.user.userId);
    const blogContents = blogContentsResponse.data;

    return {
      props: {blogContents},
    };
  }
);


export default Home;
