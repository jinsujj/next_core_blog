import { route } from "next/dist/server/router";
import { Router } from "next/router";
import { stringify } from "querystring";
import React from "react";
import { useState } from "react";
import styled from "styled-components";
import palette from "../../../styles/palette";
import Button from "../common/Button";
import Input from "../common/Input";

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
    margin-top: 14px;
    margin-bottom: 14px;
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

interface IProps {
  closeModal: () => void;
}

const SignUpModal = ({closeModal}: IProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setpassword] = useState('');
  const [passwordConfirm, setpasswordConfirm] = useState('');

  const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  }

  const onChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) =>{
    setEmail(event.target.value);
  }

  const onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) =>{
    setpassword(event.target.value);
  }

  const onChangePasswordConfirm = (event: React.ChangeEvent<HTMLInputElement>) => {
    setpasswordConfirm(event.target.value);
  }

  const Login = () => {};

  const Register = () => {
    if(password !== passwordConfirm){
      alert("비밀번호가 동일하지 않습니다");
    }
  };

  return (
    <Container>
      <div className="title">Hello Join My World :D</div>
      <div className="button-group">
        <Input type="text" color="gray_D9" placeholder="닉네임" onChange={onChangeName} useValidation={false} />
      </div>
      <div className="button-group">
        <Input type="text" color="gray_D9" placeholder="이메일" onChange={onChangeEmail}useValidation={false}  />
      </div>
      <div className="button-group">
        <Input type="password" color="gray_D9" placeholder="비밀번호" onChange={onChangePassword} useValidation/>
      </div>
      <div className="button-group">
        <Input type="password" color="gray_D9" placeholder="비밀번호 확인" onChange={onChangePasswordConfirm} useValidation/>
      </div>
      <Button width="100%" color="blue_fb" onClick={Register}>
        회원가입
      </Button>
      <div className="route-menu">
        <div className="float--left">비밀번호 찾기</div>
        <div className="float--right" onClick={Login}>
          로그인
        </div>
      </div>
    </Container>
  );
};

export default SignUpModal;
