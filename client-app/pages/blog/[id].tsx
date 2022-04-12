import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import styled from "styled-components";
import noteApi, { PostedNote } from "../../api/note";
import { useSelector } from "../../store";
import palette from "../../styles/palette";
import Input from "../components/common/Input";
import Editor from "../components/Editor";
import Footer from "../components/Footer";
import Header from "../components/Header";

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
    border-bottom: 2px solid ${palette.green_53};
    width: 100%;
  }

  .summary__title {
    font-weight: 600;
    font-size: 32px;
  }

  .summary__write {
    border-bottom: 2px solid ${palette.green_53};
    width: 100%;
    display: flex;
    align-items: center;
  }

  .post_info {
    margin-top: 12px;
  }

  .post_info ul {
    font-weight: 400;
    font-size: 14px;
    color: black;
  }

  .post_info ul li:first-child {
    float: left;
    font-weight: 400;
    font-size: 14px;
    color: black;
    margin-left: 5px;
    padding-top: 12px;
  }

  .post_info ul li {
    float: left;
    font-weight: bold;
    font-size: 14px;
    color: black;
    line-height: 8px;
    margin-left: 5px;
    padding-top: 12px;
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

  .title {
    align-items: center;
    border: 1px solid ${palette.gray_cd};
    padding: 4px 4px 4px 4px;
    background-color: ${palette.gray_f5};
  }

  .float--left {
    float: left;
  }
  .float--right {
    float: right;
  }
`;

interface IProps {
  detailNote: PostedNote;
}

const blogDetail: NextPage<IProps> = ({ detailNote }) => {
  const userInfo = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(detailNote);
  }, []);

  return (
    <>
      <Header />
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
              <div className="board">
                <Editor NoteInfo={detailNote} mode={"READ"} />
              </div>
            </div>
          </div>
        </div>
      </Container>
      <Footer />
    </>
  );
};

export default blogDetail;

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { id } = context.query;

  const { data: detailNote } = await noteApi.getNoteById(Number(id as string));
  return {
    props: {
      detailNote,
    },
  };
};
