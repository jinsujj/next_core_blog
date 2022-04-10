import react from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import userApi from "../../api/user";
import useModal from "../../hooks/useModal";
import { authAction } from "../../store/auth";
import AuthModal from "./auth/AuthModal";
import LoginModal from "./auth/LoginModal";
import SignUpModal from "./auth/SignUpModal";
import Button from "./common/Button";

const Container = styled.div`
  .btn-group {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 10px;
  }
`;

const HeaderAuths = () => {
  const { openModal, ModalPortal, closeModal } = useModal();
  const dispatch = useDispatch();

  const onClickLogin = () => {
    dispatch(authAction.setAuthMode("login"));
    openModal();
  };

  const onClickRegister = () => {
    dispatch(authAction.setAuthMode("signup"));
    openModal();
  };

  return (
    <Container>
      <div className="btn-group">
        <Button onClick={onClickLogin}>Login</Button>
        <Button onClick={onClickRegister}>Register</Button>
        <ModalPortal>
          <AuthModal closeModal={closeModal}/>
        </ModalPortal>
      </div>
    </Container>
  );
};

export default HeaderAuths;
