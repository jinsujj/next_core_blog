import { copyFileSync } from "fs";
import Router from "next/router";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import userApi from "../../api/user";
import { useSelector } from "../../store";
import { commonAction } from "../../store/common";
import { userActions } from "../../store/user";
import palette from "../../styles/palette";
import Button from "./common/Button";

const Container = styled.div`
  .btn-group {
    display: flex;
    justify-content: center;
    align-items: center;
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
      if(postState === 'read' && userIfofNote === userInfo.userId){
        dispatch(commonAction.setPostState('modify'));
        return;
      }
      if(postState !== 'write' && userIfofNote === 0){
        dispatch(commonAction.setPostState('write'));
        return;
      }
      if(postState === 'write' || postState === 'modify'){
        dispatch(commonAction.setPostState("read"));
        Router.push("../");
      }
  };

  return (
    <Container>
      <div className="btn-group">
        {postState === 'read' && (userIfofNote === userInfo.userId) && (
          <Button onClick={onClickPostBlog} width="110px" color ="green_8D">
           수정하기
          </Button>
        )
        }
        {postState !== 'write' && (userIfofNote !== userInfo.userId) && (
          <Button onClick={onClickPostBlog} width="110px" color ="green_8D">
            글쓰기
          </Button>
        )}
        {postState !== 'read' && (userInfo.name.length> 0) && (
          <Button onClick={onClickPostBlog} width="110px" color="green_8D">
            뒤로가기
          </Button>
        )}
        <Button onClick={onClickLogout} width="110px">
          Logout
        </Button>
        <div className="userInfo">{userInfo.name}</div>
      </div>
    </Container>
  );
};

export default HeaderProfile;
