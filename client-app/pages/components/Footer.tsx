import React from "react";
import styled, { css } from "styled-components";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import the icons you need
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import useRouterReady from "../../hooks/useRouterReady";
import { useSelector } from "../../store";
import palette from "../../styles/palette";
import Link from "next/link";

interface StyledProps {
  $isdark: boolean;
}

const Container = styled.footer<StyledProps>`
  ${(props) =>
    props.$isdark &&
    css`
      background-color: ${palette.dark_15} !important;
      color: ${palette.gray_dd} !important;
      .inner {
        background: ${palette.dark_15} !important;
        border-top: 1px solid ${palette.dark_15} !important;
      }
    `}

  position: relative;

  .clearfix::after {
    content: "";
    clear: both;
    display: block;
  }

  .inner {
    max-width: 940px;
    margin: 0 auto;
    box-sizing: border-box;
    position: relative;
    padding: 30px 20px;
    border-top: 1px solid ${palette.gray_ee};
    background: ${palette.gray_f5};
  }

  .site-links {
    display: flex;
  }

  .site-links li {
    font-size: 24px;
    font-weight: 500;
    margin-right: 10px;
    color: black;
    line-height: 30px;
  }

  .site-links li a:hover {
    text-decoration: underline;
  }

  .float--left {
    float: left;
  }
  .float--right {
    float: right;
  }

  p {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }
`;


const Footer = () => {
  const view = useRouterReady();
  const isDarkMode = useSelector((state) => state.common.isDark);
  const iconColor = isDarkMode === true ? "white" : "black";
  if (!view) {
    return null;
  }

  return (
    <Container $isdark={isDarkMode}>
      <div className="inner clearfix">
        <div className="float--left">
          <p>©copyright Sasim</p> <br />
          <p>Powered by Next.js + .Net Core</p>
        </div>
        <ul className="site-links float--right">
        <li>
          <Link href="https://github.com/jinsujj" passHref>
            <FontAwesomeIcon icon={faGithub} style={{ fontSize: 30, color: iconColor }} />
          </Link>
        </li>
        <li>
          <Link href="https://www.linkedin.com/in/jinsu-jang-0b2269107/" passHref>
            <FontAwesomeIcon icon={faLinkedin} style={{ fontSize: 30, color: iconColor }} />
          </Link>
        </li>
      </ul>
      </div>
    </Container>
  );
};

export default Footer;
