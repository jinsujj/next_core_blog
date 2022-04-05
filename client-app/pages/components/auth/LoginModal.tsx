import { AxiosError } from "axios";
import Router, { useRouter } from "next/router";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import userApi from "../../../api/user";
import useModal from "../../../hooks/useModal";
import useValidateMode from "../../../hooks/useValidateMode";
import palette from "../../../styles/palette";
import Button from "../common/Button";
import Input from "../common/Input";
import SignUpModal from "./SignUpModal";

const Container = styled.form`
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

interface IProps {
  closeModal: () => void;
}

const LoginModal = ({closeModal}: IProps) => {
  const { openModal, ModalPortal } = useModal();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const {setValidateMode} = useValidateMode();

  const onChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };


  const onSubmitLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidateMode(true);

    if(!email || !password){
      alert("Email 과 비밀번호를 입력해 주세요");
    }
    else{
      const loginBody ={email, password};
      try{
        const {data} = await userApi.Login(loginBody);
        setValidateMode(false);
        closeModal();
      }
      catch(e:any){
        const errorMessage:string = e.message;
        if(errorMessage.includes("401")){
          alert("해당 계정이 없거나 비밀번호가 일치하지 않습니다");
          return;
        }
        if(errorMessage.includes("400")){
          alert("이메일 형식이 아닙니다");
          return;
        }
      }
    }
  };

  const Register = (e: React.MouseEvent<HTMLDivElement>) =>{
    e.preventDefault();
    return (
      <ModalPortal>
        <SignUpModal closeModal={closeModal}/>
      </ModalPortal>
    );
  };

  useEffect(() => {
    return () =>{
      setValidateMode(false);
    }
  },[]);

  return (
    <Container onSubmit={onSubmitLogin}>
      <div className="title">Hello Dev World :D</div>
      <div className="button-group">
        <Input
          type="text"
          color="gray_D9"
          placeholder="이메일"
          useValidation
          onChange={onChangeEmail}
        />
      </div>
      <div className="button-group">
        <Input
          type="password"
          color="gray_D9"
          placeholder="비밀번호"
          useValidation
          onChange={onChangePassword}
        />
      </div>
      <Button width="100%" color="blue_fb" type="submit">
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
