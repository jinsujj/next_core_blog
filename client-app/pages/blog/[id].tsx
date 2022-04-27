import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import React, { useEffect, useMemo, useState } from "react";
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
import dateFormat from "../../lib/dateFormat";
import useUtterances from "../../hooks/useUtterances";
import Router from "next/router";

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

    @media only screen and (max-width: 768px){
      line-height: 48px;
      font-weight: 600;
      font-size: 24px;
      align-items: center;
    }
  }

  .summary__write {
    border-bottom: 2px solid ${palette.green_53};
    width: 100%;
    display: flex;
    align-items: center;
  }

  .post_info {
    margin-top: 12px;

    @media only screen and (max-width: 380px){
      display: flex;
      float: left !important;
      margin-top: -12px;
    }
  }

  .post_info ul {
    display: flex;
    font-weight: 400;
    font-size: 14px;
    color: black;

    @media only screen and (max-width: 768px){
      margin-right: 8px;
      margin-bottom: 4px;
    }
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
  const SearchQuery = useSelector((state) => state.common.search);
  const postState = useSelector((state) => state.common.postState);
  const sideBarCategory  = useSelector((state) => state.common.sideBarCategory);
  const sidgBarSubCategory = useSelector((state)=> state.common.sideBarSubCategory);
  
  const dispatch = useDispatch();
  dispatch(commonAction.setPostUserIdOfNote(detailNote.userId));
  useUtterances(detailNote.noteId.toString());

  useEffect(() =>{
    return () => {
      if(detailNote.category !== sideBarCategory || detailNote.subCategory !== sidgBarSubCategory){
        Router.push("/");
      }
      else if(SearchQuery.includes(detailNote.title)){
        Router.push("/");  
      }
    };
  },[sideBarCategory,sidgBarSubCategory,SearchQuery]);


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
  const userId = context.query.hasOwnProperty('me')? context.query.me: 0;
  const id = context.query.id;
  const { data: detailNote } = await noteApi.getNoteById(Number(id as string) ,Number(userId as string));
  return {
    props: {
      detailNote,
    },
  };
};
