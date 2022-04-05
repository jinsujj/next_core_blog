import Link from "next/link";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import useModal from "../../hooks/useModal";
import { useSelector } from "../../store";
import Button from "./common/Button";
import LoginModal from "./auth/LoginModal";
import Sidebar from "./Sidebar";
import SignUpModal from "./auth/SignUpModal";
import { commonAction } from "../../store/common";

const Container = styled.div`
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
  background: white;

  position: relative;

  .inner {
    display: flex;
    max-width: 1200px;
    margin: 0 auto;
    box-sizing: border-box;
    position: relative;
    padding-left: 20px;
    padding-right: 20px;
  }
  .wrapper {
    display: block;
    justify-content: center;
    width: 270px;
  }
  .toggle-btn {
    background: url("../img/toggle_blue.svg");
    width: 27px;
    height: 18px;
    cursor: pointer;
    text-indent: -9999px;
    margin: 28px 0px;
  }
  .title-group {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
  }
  .title-group .logo {
    background: url("../img/owl.svg");
    width: 36px;
    height: 36px;
    display: block;
    text-indent: -9999px;
  }
  .title-group a {
    display: block;
    padding: 21.5px 0;
    font-size: 24px;
    font-weight: bold;
    line-height: 29px;
  }

  .btn-group {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 10px;
  }
`;

const Header = () => {
  const [clicklogin, setClickLogin] = useState(true);
  const isToggle = useSelector((state) => state.common.toggle);
  const dispatch = useDispatch();

  const changeToggle = () => {
    dispatch(commonAction.setToggleMode(!isToggle));
    console.log(isToggle);
  };

  const { openModal, ModalPortal, closeModal } = useModal();

  const onClickLogin = () => {
    setClickLogin(true);
    openModal();
  };

  const onClickRegister = () =>{
    setClickLogin(false);
    openModal();
  }

  return (
    <>
      <Sidebar />
      <Container>
        <div className="inner">
          <div className="wrapper">
            <div
              className={`toggle-btn ${isToggle ? "on" : ""}`}
              onClick={changeToggle}
            >
              Header Menu Button
            </div>
          </div>
          <div className="title-group">
            <div className="logo">부엉이</div>
            <Link href="/">
              <a>부엉이 개발자</a>
            </Link>
          </div>
          <div className="btn-group">
            <Button onClick={onClickLogin}>Login</Button>
            <Button onClick={onClickRegister}>Register</Button>
            <ModalPortal>
                {clicklogin && (
                    <LoginModal closeModal={closeModal}/>
                )}
                {!clicklogin && (
                    <SignUpModal closeModal={closeModal}/>
                )}
            </ModalPortal>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Header;
