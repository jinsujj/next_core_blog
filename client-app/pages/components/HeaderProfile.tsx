import Router from "next/router";
import React from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import userApi from "../../api/user";
import { useSelector } from "../../store";
import { commonAction } from "../../store/common";
import { userActions } from "../../store/user";
import palette from "../../styles/palette";
import Button from "./common/Button";

const Container = styled.div`
  position: relative;

  .btn-group {
    display: flex;
    justify-content: center;
    align-items: center;

    @media only screen and (max-width: 768px) {
      width: 100%;
      float: right;
    }
  }

  .userInfo {
    border: 1px solid ${palette.green_53};
    border-radius: 50px;
    padding: 0 10px;
    width: auto;
    height: 30px;

    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 10px;

    color: ${palette.black};
    font-size: 16px;
    font-weight: 600;

    @media only screen and (max-width: 768px) {
      display: none;
    }
  }

  .logout-button {
    @media only screen and (max-width: 768px) {
      display: none;
    }
  }
`;

const HeaderProfile = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user);
  const postState = useSelector((state) => state.common.postState);
  const userIfofNote = useSelector((state) => state.common.userIdOfNote);

  const onClickLogout = () => {
    try {
      userApi.Logout();
      dispatch(userActions.initUser());
      Router.push("../");
    } catch (e: any) {
      console.log(e.message);
    }
  };

  const onClickPostBlog = () => {
    if (postState === "read" && userIfofNote === userInfo.userId) {
      dispatch(commonAction.setPostState("modify"));
      return;
    }
    if (postState === "read" && userIfofNote !== userInfo.userId) {
      dispatch(commonAction.setPostState("write"));
      return;
    }
    if (postState === "write" || postState === "modify") {
      dispatch(commonAction.setPostState("read"));
      Router.push("../");
    }
  };

  return (
    <Container>
      <div className="btn-group">
        {postState === "read" && userIfofNote === userInfo.userId && (
          <Button onClick={onClickPostBlog} width="110px" color="green_8D">
            ????????????
          </Button>
        )}
        {postState !== "write" && userIfofNote !== userInfo.userId && (
          <Button onClick={onClickPostBlog} width="110px" color="green_8D">
            ?????????
          </Button>
        )}
        {postState !== "read" && userInfo.name.length > 0 && (
          <Button onClick={onClickPostBlog} width="110px" color="green_8D">
            ????????????
          </Button>
        )}
        <div className="logout-button">
          <Button onClick={onClickLogout} width="110px">
            Logout
          </Button>
        </div>
        <div className="userInfo">{userInfo.name}</div>
      </div>
    </Container>
  );
};

export default HeaderProfile;
