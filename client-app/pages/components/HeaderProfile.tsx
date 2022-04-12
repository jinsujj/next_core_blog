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
  .btn-group {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 10px;
  }

  .userInfo {
    border: 1px solid ${palette.green_53};
    border-radius: 50px;
    padding: 0 15px;
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
  const userName = useSelector((state) => state.user.name);
  const postBlog = useSelector((state) => state.common.postblog);

  const onClickLogout = () => {
    try {
      userApi.Logout();
      dispatch(userActions.initUser());
    } catch (e: any) {
      console.log(e.message);
    }
  };

  const onClickPostBlog = () => {
    postBlog == true ? dispatch(commonAction.setPostBlog(false)): dispatch(commonAction.setPostBlog(true));
  };

  return (
    <Container>
      <div className="btn-group">
        {!postBlog && (
          <Button onClick={onClickPostBlog} width="110px" color ="green_8D">
            글쓰기
          </Button>
        )}
        {postBlog && (
          <Button onClick={onClickPostBlog} width="110px" color="green_8D">
            뒤로가기
          </Button>
        )}
        <Button onClick={onClickLogout} width="110px">
          Logout
        </Button>
        <div className="userInfo">{userName}</div>
      </div>
    </Container>
  );
};

export default HeaderProfile;
