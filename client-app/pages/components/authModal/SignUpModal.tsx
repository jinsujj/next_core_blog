import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import userApi from "../../../api/user";
import useValidateMode from "../../../hooks/useValidateMode";
import { authAction } from "../../../store/auth";
import palette from "../../../styles/palette";
import Button from "../common/Button";
import Input from "../common/Input";

const Container = styled.form`
  @media only screen and (max-width: 768px) {
    width: 100%;
    padding: 26px;
    height: 480px;
  }

  z-index: 11;
  width: 540px;
  height: 460px;
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

const SignUpModal = ({ closeModal }: IProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailErrorMsg, setEmailErrorMsg] = useState("");
  const [password, setpassword] = useState("");
  const [passwordConfirm, setpasswordConfirm] = useState("");

  const dispatch = useDispatch();
  const { setValidateMode } = useValidateMode();

  const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const onChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setpassword(event.target.value);
  };

  const onChangePasswordConfirm = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setpasswordConfirm(event.target.value);
    if (password !== event.target.value) {
      setValidateMode(true);
    } else {
      setValidateMode(false);
    }
  };

  const onSubmiRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // nickname check
    if (name.trim().length === 0) {
      setValidateMode(true);
      return;
    }

    // password check
    if (password !== passwordConfirm) {
      setValidateMode(true);
      return;
    }

    try {
      const { data } = await userApi.AddUser({
        name: name,
        email: email,
        password: password,
        confirmPassword: passwordConfirm,
      });
      alert("?????? ???????????????");
      closeModal();
    } catch (e: any) {
      const errorMessage: string = e.message;
      if (errorMessage.includes("401")) {
        setEmailErrorMsg("?????? Eamil ??? ???????????????");
      }
      if (errorMessage.includes("400")) {
        setEmailErrorMsg("????????? ????????? ????????????");
      }
      setValidateMode(true);
    }
  };

  const changeToLoginModal = () => {
    dispatch(authAction.setAuthMode("login"));
  };

  useEffect(() => {
    return () => {
      setValidateMode(false);
      setEmailErrorMsg("");
    };
  }, [email]);

  return (
    <Container onSubmit={onSubmiRegister}>
      <div className="title">Hello Join My World :D</div>
      <div className="button-group">
        <Input
          type="text"
          color="gray_D9"
          placeholder="?????????"
          onChange={onChangeName}
          useValidation={name.trim().length === 0}
          errorMessage={"???????????? ??????????????????."}
        />
      </div>
      <div className="button-group">
        <Input
          type="text"
          color="gray_D9"
          placeholder="?????????"
          onChange={onChangeEmail}
          useValidation={emailErrorMsg.length > 0}
          errorMessage={emailErrorMsg}
        />
      </div>
      <div className="button-group">
        <Input
          type="password"
          color="gray_D9"
          placeholder="????????????"
          onChange={onChangePassword}
          errorMessage={"??????????????? ???????????? ????????????"}
          useValidation={password !== passwordConfirm}
        />
      </div>
      <div className="button-group">
        <Input
          type="password"
          color="gray_D9"
          placeholder="???????????? ??????"
          onChange={onChangePasswordConfirm}
          errorMessage={"??????????????? ???????????? ????????????"}
          useValidation
        />
      </div>
      <Button width="100%" color="blue_fb" type="submit">
        ????????????
      </Button>
      <div className="route-menu">
        <div className="float--right" onClick={changeToLoginModal}>
          ?????????
        </div>
      </div>
    </Container>
  );
};

export default SignUpModal;
