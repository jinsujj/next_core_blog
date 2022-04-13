import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import noteApi, { PostedNote } from "../../api/note";
import { useSelector } from "../../store";
import palette from "../../styles/palette";
import Editor from "../components/Editor";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck, faEye } from "@fortawesome/free-solid-svg-icons";

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
    display: flex;
    font-weight: 400;
    font-size: 14px;
    color: black;
  }

  .post_info ul li:first-child {
    width: auto;
    font-weight: 400;
    font-size: 14px;
    color: black;
    margin-left: 5px;
    padding-top: 12px;
  }

  .post_info ul li {
    width: auto;
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
  const dispatch = useDispatch();
  const postblog = useSelector((state) => state.common.postblog);

  const leftPad = (value: number) => {
    if (value >= 10) {
      return value;
    }
    return `0${value}`;
  };

  const toStringByFormatting = (source: Date, delimiter = "-") => {
    const year = source.getFullYear();
    const month = leftPad(source.getMonth() + 1);
    const day = leftPad(source.getDate());
    return [year, month, day].join(delimiter);
  };

  return (
    <>
      <Header />
      <Container>
        <div className="inner">
          <div className="board">
            {!postblog && (
              <div className="summary clearfix">
                <h2 className="summary__title float--left">
                  {detailNote.title}
                </h2>
                <div className="post_info float--right">
                  <ul>
                    <li>
                      <FontAwesomeIcon
                        icon={faCalendarCheck}
                        style={{ fontSize: 12, color: "black" }}
                      />
                    </li>
                    <li>
                      {toStringByFormatting(new Date(detailNote.postDate))}
                    </li>
                  </ul>
                  <ul>
                    <li>
                      <FontAwesomeIcon
                        icon={faEye}
                        style={{ fontSize: 12, color: "black" }}
                      />
                    </li>
                    <li>{detailNote.readCount}</li>
                  </ul>
                </div>
              </div>
            )}
            {postblog && (
              <div className="board clearfix">
                <div className="board">
                  <Editor NoteInfo={undefined} mode={"WRITE"} />
                </div>
              </div>
            )}
            {!postblog && (
              <div className="board clearfix">
                <div className="board">
                  <Editor NoteInfo={detailNote} mode={"READ"} />
                </div>
              </div>
            )}
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
