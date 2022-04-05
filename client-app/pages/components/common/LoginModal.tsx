import { AxiosError } from "axios";
import Router from "next/router";
import React from "react";
import { useState } from "react";
import styled from "styled-components";
import userApi from "../../../api/user";
import useModal from "../../../hooks/useModal";
import palette from "../../../styles/palette";
import Button from "./Button";
import Input from "./Input";
import SignUpModal from "./SignUpModal";

const Container = styled.div`
  z-index: 11;
  width: 540px;
  height: 400px;
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

interface LoginModel {
  Email: string,
  Password: string,
}

const LoginModal = () => {
  const { openModal, ModalPortal, closeModal } = useModal();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    setEmail(event.target.value);
  };

  const onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    setPassword(event.target.value);
  };

  const Login = () => {
    const loginModel :LoginModel= {
      Email: email,
      Password: password,
    };

    const result = userApi.Login(loginModel).then(
      (res) => {
        console.log(res);
        alert("로그인 확인");
        closeModal();
      }
    ).catch(
      (error : AxiosError) =>{
        console.log(error);
        alert("에러");
      }
    );
  };

  const Register = () => {
    closeModal();
    return (
      <ModalPortal>
        <SignUpModal />
      </ModalPortal>
    );
  };

  return (
    <Container>
      <div className="title">Hello Dev World :D</div>
      <div className="button-group">
        <Input
          type="text"
          color="gray_D9"
          placeholder="이메일"
          onChange={onChangeEmail}
        />
      </div>
      <div className="button-group">
        <Input
          type="password"
          color="gray_D9"
          placeholder="비밀번호"
          onChange={onChangePassword}
        />
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

export default LoginModal;
