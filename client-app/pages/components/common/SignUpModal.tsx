import { route } from "next/dist/server/router";
import { Router } from "next/router";
import React from "react";
import styled from "styled-components";
import palette from "../../../styles/palette";
import Button from "./Button";
import Input from "./Input";

const Container = styled.div`
  z-index: 11;
  width: 540px;
  height: 500px;
  padding: 30px;
  background-color: white;

  .title {
    color: ${palette.blue_fb};
    font-size: 32px;
    line-height: 40px;
    font-weight: 700;
    text-align: center;
    align-items: center;
    margin-bottom: 36px;
  }

  .button-group {
    margin-top: 18px;
    margin-bottom: 18px;
  }

  .route-menu {
    color: ${palette.blue_fb};
    position: relative;

    font-size: 14px;
    font-weight: 400;
  }

  .float--left {
    margin-top: 16px;
    float: left;
    &:hover {
      cursor: pointer;
      font-weight: bold;
    }
  }
  .float--right {
    margin-top: 16px;
    float: right;
    &:hover {
      cursor: pointer;
      font-weight: bold;
    }
  }
`;

const SignUpModal = () => {
  const Login = () => {};

  const Register = () => {};

  return (
    <Container>
      <div className="title">Hello Join My World :D</div>
      <div className="button-group">
        <Input type="text" color="gray_D9" placeholder="닉네임" />
      </div>
      <div className="button-group">
        <Input type="text" color="gray_D9" placeholder="이메일" />
      </div>
      <div className="button-group">
        <Input type="password" color="gray_D9" placeholder="비밀번호" />
      </div>
      <div className="button-group">
        <Input type="password" color="gray_D9" placeholder="비밀번호 확인" />
      </div>
      <Button width="100%" color="blue_fb" onClick={Login}>
        로그인
      </Button>
      <div className="route-menu">
        <div className="float--left">비밀번호 찾기</div>
        <div className="float--right" onClick={Register}>
          회원가입
        </div>
      </div>
    </Container>
  );
};

export default SignUpModal;