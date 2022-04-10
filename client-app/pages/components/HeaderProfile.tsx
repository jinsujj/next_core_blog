import React from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import userApi from "../../api/user";
import { useSelector } from "../../store";
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
    border-top: 1px solid ${palette.green_53};
    border-bottom: 1px solid ${palette.green_53};
    border-radius: 50px;
    padding: 0 15px;
    width: auto;
    height: 30px;

    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 30px;

    color: ${palette.black};
    font-size: 16px;
    font-weight: 600;
  }
`;

const HeaderProfile = () => {
  const dispatch = useDispatch();
  const userName = useSelector((state) => state.user.name);

  const onClickLogout = () => {
    try {
      userApi.Logout();
      dispatch(userActions.initUser());
    } catch (e: any) {
      console.log(e.message);
    }
  };


  return (
    <Container>
      <div className="btn-group">
        <div className="userInfo">{userName} 님</div>
        <Button onClick={onClickLogout} width="110px">Logout</Button>
      </div>
    </Container>
  );
};

export default HeaderProfile;
