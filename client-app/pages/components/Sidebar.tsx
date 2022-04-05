import React from "react";
import { useDispatch } from "react-redux";
import styled, { css } from "styled-components";
import { useSelector } from "../../store";
import { commonAction } from "../../store/common";
import Button from "./common/Button";
import Input from "./common/Input";

interface StyledProps {
  istoggle: boolean;
}

const Container = styled.div<StyledProps>`
  width: 330px;
  height: 100%;
  overflow-y: auto;

  border: 1px solid #eee;
  position: fixed;
  z-index: 1;
  background: #fff;

  ${(props) =>
    !props.istoggle &&
    css`
      visibility: hidden;
      width: 0px;
      left: -500px;
      transition: all 0.5s;
    `}

  ${(props) =>
    props.istoggle &&
    css`
      visibility: visible;
      width: 330px;
      left: 0px;
      transition: all 0.5s;
    `}

    .inner {
    margin-left: 28px;
    margin-right: 28px;
  }

  .toggle-btn {
    background: url("../img/toggle_blue.svg");
    width: 28px !important;
    height: 18px;
    cursor: pointer;
    text-indent: -9999px;
    margin: 27px 0;
  }

  #search-form {
    margin-top: 33px;
    display: flex;
    position: relative;
  }

  #search {
    width:280px;
  }

  .search-submit {
    background: url("../img/search.png");
    position: absolute;
    top: 2px;
    right: 5px;
    width: 32px;
    height: 32px;
    text-indent: -9999px;
    border: none;
    cursor: pointer;
  }

  .input--text {
    width: 100%;
    height: 40px;
    padding: 2px 10px;
    border: 1px solid #18a0fb;
    border-radius: 4px;
    box-sizing: border-box;
    outline: none;
    font-size: 16px;
    font-weight: 200;
    line-height: 20px;
  }

  .input--text:focus {
    border-color: #51a7e8;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.075),
      0 0 5px rgba(81, 167, 232, 0.5);
  }

  .btn-group {
    display: none;
  }

  .visit--count {
    margin-top: 28px;
  }
  .visit--count ul {
    display: flex;
    margin-bottom: 8px;
  }
  .visit--count ul li:first-child {
    font-weight: bold;
    font-size: 12px;
    line-height: 15px;
    color: black;
    margin-right: 8px;
  }
  .visit--count ul li {
    font-weight: normal;
    font-size: 12px;
    line-height: 15px;
    color: #219653;
  }

  .category {
    margin: 20px 0;
    border-top: 1px solid #219653;
  }
  .category .menu {
    margin-top: 24px;
    margin-bottom: 12px;
    font-weight: bold;
    font-size: 24px;
    line-height: 29px;
    color: black;
    display: flex;
  }
  .category .menu .count {
    font-size: 12px;
    line-height: 29px;
    color: #eb5757;
    margin-left: 8px;
  }
  .category .sub--menu {
    margin-bottom: 4px;
    font-size: 24px;
    line-height: 29px;
    color: black;
    display: flex;
  }
  .category .sub--menu .count {
    font-size: 12px;
    line-height: 29px;
    color: #eb5757;
    margin-left: 4px;
  }
`;

const Sidebar = () => {
  const isToggle = useSelector((state) => state.common.toggle);
  const dispatch = useDispatch();

  const changeToggle = () => {
    dispatch(commonAction.setToggleMode(!isToggle));
    console.log(isToggle);
  };

  return (
    <Container istoggle={isToggle}>
      <div className="inner">
        <div className={`toggle-btn`} onClick={changeToggle}>
          Header Menu Button
        </div>
        <form id="search-form" method="post" action="#">
          <Input
            type="text"
            id="search"
            placeholder="Search"
            useValidation={false}
          />
          <Input className="search-submit" type="submit" value="submit" useValidation={false}/>
        </form>
        <div className="btn-group toggle">
          <Button>Login</Button>
          <Button>Register</Button>
        </div>
        <div className="visit--count">
          <ul>
            <li>Total visit</li>
            <li>10,000</li>
          </ul>
          <ul>
            <li>Today visit</li>
            <li>100</li>
          </ul>
        </div>
        <div className="category">
          <ul className="menu">
            <li>
              <a href="#">Category1</a>
            </li>
            <li className="count">(140)</li>
          </ul>
          <ul className="sub--menu">
            <li>
              <a href="#">name</a>
            </li>
            <li className="count">(40)</li>
          </ul>
        </div>
      </div>
    </Container>
  );
};

export default Sidebar;
