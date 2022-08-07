import React from "react";
import styled from "styled-components";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import the icons you need
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";

const Container = styled.footer`
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
    border-top: 1px solid #eee;
    background: #f5f5f5;
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

  p{
      margin: 0;
      padding: 0;
      border: 0;
      font-size: 100%;
      font: inherit;
      vertical-align: baseline;
  }
`;

const Footer = () => {
  return (
    <Container>
      <div className="inner clearfix">
        <div className="float--left">
          <p>©copyright Sasim</p> <br />
          <p>Powered by Next.js + .Net Core</p>
        </div>
        <ul className="site-links float--right">
          <li>
            <Link href="https://github.com/jinsujj">
              <a target='_blank'>
                <FontAwesomeIcon
                  icon={faGithub}
                  style={{ fontSize: 30, color: "black" }}
                />
              </a>
            </Link>
          </li>
          <li>
            <Link  href="https://www.linkedin.com/in/jinsu-jang-0b2269107/">
              <a target='_blank'>
                <FontAwesomeIcon
                  icon={faLinkedin}
                  style={{ fontSize: 30, color: "black" }}
                />
              </a>
            </Link>
          </li>
        </ul>
      </div>
    </Container>
  );
};

export default Footer;
