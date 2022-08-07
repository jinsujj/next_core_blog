import React from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import useModal from "../../hooks/useModal";
import { useSelector } from "../../store";
import Sidebar from "./Sidebar";
import { commonAction } from "../../store/common";
import HeaderAuths from "./HeaderAuth";
import HeaderProfile from "./HeaderProfile";
import AuthModal from "./authModal/AuthModal";
import Router from "next/router";

const Container = styled.div`
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
  background: white;

  position: relative;

  .inner {
    display: flex;
    max-width: 940px;
    margin: 0 auto;
    box-sizing: border-box;
    position: relative;
    padding-left: 20px;
    padding-right: 20px;

    @media only screen and (max-width: 768px){
      width: 100%;
    }
  }
  .wrapper {
    display: block;
    justify-content: center;
    width: 25%;


    @media only screen and (max-width: 768px){
      width: auto;
    }
  }
  .toggle-btn {
    background: url("../img/toggle_blue.svg");
    width: 27px;
    height: 18px;
    cursor: pointer;
    text-indent: -9999px;
    margin: 28px 0px;

    @media only screen and (max-width: 768px){
      float: left;
    }
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
    text-decoration: none;

    @media only screen and (max-width: 768px){
      padding: 18px 0;
      font-size: 18px;
      font-weight: bold;
      line-height: 18px;
    }
  }

  .btn-group {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 10px;

    @media only screen and (max-width: 768px){
      margin-right: 0px;
    }
  }

  a {
    text-decoration: none;
    color: black;
  }

  .home-button {
    border: none;
    background-color: white;
  }
`;

const Header = () => {
  const isToggle = useSelector((state) => state.common.toggle);
  const isLogged = useSelector((state) => state.user.isLogged);

  const { openModal, ModalPortal, closeModal } = useModal();
  const dispatch = useDispatch();

  const changeToggle = () => {
    dispatch(commonAction.setToggleMode(!isToggle));
  };

  const goHome = (event: React.MouseEvent<HTMLButtonElement>) =>{
    dispatch(commonAction.initCommonState());
    Router.push("/");
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
            <button className="home-button"  onClick={goHome}>
              <a>부엉이 개발자</a>
            </button>
          </div>
          <div className="btn-group">
            {isLogged && <HeaderProfile />}
            {!isLogged && <HeaderAuths />}
            <ModalPortal>
              <AuthModal closeModal={closeModal} />
            </ModalPortal>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Header;
