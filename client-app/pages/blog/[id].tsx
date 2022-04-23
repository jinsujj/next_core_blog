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
import { commonAction } from "../../store/common";
import { write } from "fs";
import dateFormat from "../../lib/dateFormat";
import useUtterances from "../../hooks/useUtterances";

const Container = styled.div`
  margin-top: 56px;

  .inner {
    max-width: 1200px;
    margin: 0 auto;
    box-sizing: border-box;
    position: relative;
    padding: 0 20px;
    padding-bottom: 10px;
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
    min-height: 500px;
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

  .utterances {
    width:100%;
    max-width: 1200px !important;
  }
`;

interface IProps {
  detailNote: PostedNote;
}

const blogDetail: NextPage<IProps> = ({ detailNote }) => {
  const postState = useSelector((state) => state.common.postState);
  const userInfo = useSelector((state) => state.user);

  const dispatch = useDispatch();
  dispatch(commonAction.setPostUserIdOfNote(detailNote.userId));

  useUtterances(detailNote.noteId.toString());

  return (
    <>
      <Header />
      <Container>
        <div className="inner">
          <div className="board">
            {postState === "read" && (
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
                      {dateFormat.toStringByFormatting(new Date(detailNote.postDate))}
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
            {postState === "write" && (
              <div className="board clearfix">
                <div className="board">
                  <Editor NoteInfo={undefined}/>
                </div>
              </div>
            )}
            {postState === "modify" && (
              <div className="board clearfix">
                <div className="board">
                  <Editor NoteInfo={detailNote}/>
                </div>
              </div>
            )}
            {postState === "read" && (
              <div className="board clearfix">
                <div className="board">
                  <Editor NoteInfo={detailNote} />
                </div>
              </div>
            )}
          </div>
          <div className="utterances" id={detailNote.noteId.toString()}></div>
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
