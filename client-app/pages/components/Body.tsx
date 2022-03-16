import React from "react";
import styled from "styled-components";

const Container = styled.div`
  margin-top: 56px;

  .inner {
    max-width: 1200px;
    margin: 0 auto;
    box-sizing: border-box;
    position: relative;
    padding: 0 20px;
  }

  .summary {
    border-bottom: 2px solid #219653;
    width: 100%;
  }

  .summary__title {
    font-weight: 600;
    font-size: 32px;
  }

  .post_info ul {
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;
    color: black;
  }

  .post_info ul li:first-child {
    float: left;
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;
    color: black;
    margin-left: 5px;
    padding-top: 4px;
  }

  .post_info ul li {
    float: left;
    font-weight: bold;
    font-size: 14px;
    line-height: 17px;
    color: black;
    margin-left: 5px;
    padding-top: 4px;
  }

  .board {
    min-height: 800px;
  }

  /* FLOAT CLEARFIX */
  .clearfix::after {
    content: "";
    clear: both;
    display: block;
  }

  .float--left {
    float: left;
  }
  .float--right {
    float: right;
  }
`;

const Body = () => {
    
  return (
    <Container>
      <div className="inner">
        <div className="board">
          <div className="summary clearfix">
            <h2 className="summary__title float--left">Title</h2>
            <div className="post_info float--right">
              <ul>
                <li>작성일</li>
                <li>2021.12.03</li>
              </ul>
              <ul>
                <li>조회수</li>
                <li>5621</li>
              </ul>
            </div>
          </div>
          <div className="board clearfix">
            <div className="board"></div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Body;
