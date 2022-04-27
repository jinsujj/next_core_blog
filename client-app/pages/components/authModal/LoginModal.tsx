import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import userApi from "../../../api/user";
import useModal from "../../../hooks/useModal";
import useValidateMode from "../../../hooks/useValidateMode";
import { authAction } from "../../../store/auth";
import { userActions } from "../../../store/user";
import palette from "../../../styles/palette";
import Button from "../common/Button";
import Input from "../common/Input";

const Container = styled.form`
  @media only screen and (max-width: 768px){
      width: 100%;
      padding: 26px;
  }

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

  .stay-login {
    display: flex;
    margin-bottom: 10px;
    color: ${palette.blue_fb};
    font-size: 14px;
    font-weight: 400;

    input {
      margin-right: 10px;
    }
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

const LoginModal = ({ closeModal }: IProps) => {
  const [stayLogin, setStayLogin] = useState<boolean>(false);
  const { openModal, ModalPortal } = useModal();
  const [email, setEmail] = useState("");
  const [emailErrorMsg, setEmailErrorMsg] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { setValidateMode } = useValidateMode();

  const onChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const onChangeStayLogin = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStayLogin(event.target.checked);
  };

  const onSubmitLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidateMode(true);

    if (stayLogin) {
      localStorage.setItem("Email", email);
    }

    if (!email || !password) {
      alert("Email 과 비밀번호를 입력해 주세요");
    } else {
      const loginBody = { email, password };
      try {
        const { data } = await userApi.Login(loginBody);
        dispatch(userActions.setLoggedUser(data));
        setValidateMode(false);
        closeModal();
      } catch (e: any) {
        const errorMessage: string = e.message;
        if (errorMessage.includes("401")) {
          setEmailErrorMsg("해당 계정이 없거나 비밀번호가 일치하지 않습니다");
          return;
        }
        if (errorMessage.includes("400")) {
          setEmailErrorMsg("이메일 형식이 아닙니다");
          return;
        }
        if (errorMessage.includes("403")){
          setEmailErrorMsg("5회 이상 틀렸습니다. 10분 뒤에 재 로그인 바랍니다.");
          return;
        }
      }
    }
  };

  const changeToSignupModal = () => {
    dispatch(authAction.setAuthMode("signup"));
  };

  useEffect(() => {
    setValidateMode(false);

    const email = localStorage.getItem("Email");
    if (email) {
      setEmail(email);
      setStayLogin(true);
    }
  }, []);

  return (
    <Container onSubmit={onSubmitLogin}>
      <div className="title">Hello Dev World :D</div>
      <div className="button-group">
        <Input
          type="text"
          color="gray_D9"
          placeholder="이메일"
          useValidation={emailErrorMsg.length > 0}
          errorMessage={emailErrorMsg}
          onChange={onChangeEmail}
          value={email}
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
      <div className="stay-login">
        <input
          type="checkbox"
          checked={stayLogin}
          onChange={onChangeStayLogin}
        />
        <div>Email 기억하기</div>
      </div>
      <Button width="100%" color="blue_fb" type="submit">
        로그인
      </Button>
      <div className="route-menu">
        <div className="float--left">비밀번호 찾기</div>
        <div className="float--right" onClick={changeToSignupModal}>
          회원가입
        </div>
      </div>
    </Container>
  );
};

export default LoginModal;
