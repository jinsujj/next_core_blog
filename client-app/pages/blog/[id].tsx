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
import useUtterances from "../../hooks/useUtterances";
import Router from "next/router";
import { NextSeo } from "next-seo";
import { format } from "date-fns";
import Head from "next/head";

import Prism from "prismjs";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import "prismjs/plugins/line-numbers/prism-line-numbers";
import "prismjs/components/prism-typescript.min";
import "prismjs/components/prism-jsx.min";
import "prismjs/components/prism-tsx.min";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-java";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-bash";

const Container = styled.div`
  margin-top: 56px;

  .inner {
    max-width: 940px;
    overflow-x: scroll;
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

    @media only screen and (max-width: 768px) {
      line-height: 36px;
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
    display: flex;
    padding-top: 40px;

    @media only screen and (max-width: 480px) {
      display: flex;
      float: left !important;
      padding-top: 12px !important;
    }
  }

  .post_info ul {
    display: flex;
    font-weight: 400;
    font-size: 14px;
    color: black;

    @media only screen and (max-width: 768px) {
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
  }

  .post_info ul li {
    width: auto;
    font-weight: bold;
    font-size: 14px;
    color: black;
    line-height: 8px;
    margin-left: 5px;
  }

  .board {
    width:100%;
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
    width: 100%;
    max-width: 940px !important;
  }

  .noAuthority {
    padding: 50% 0%;
    text-align: center;
  }

  .title_input {
    align-items: center;
    border: 1px solid ${palette.gray_cd};
    padding: 4px 4px 4px 4px;
    background-color: ${palette.gray_f5};
  }

  .title {
    align-items: center;
    padding-top: 1px;
  }

  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid ${palette.blockQuote};
  }

  ul li {
    padding: 5px 0px 5px 5px;
    margin-bottom: 5px;
    border-bottom: 1px solid #efefef;
  }

  ol li {
    margin-bottom: 0.5rem;
  }

  .iframe {
    position: relative;
    width: 100%;
    overflow: hidden;
    padding-top: 56.25%; /* 16:9 Aspect Ratio */
  }
  .note-video-clip {
    position: absolute;
    top: 10;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    border: none;
  }
`;

interface IProps {
  detailNote: PostedNote;
}

const blogDetail: NextPage<IProps> = ({ detailNote }) => {
  if (detailNote.noteId === undefined) {
    return (
      <>
        <Container>
          <div className="inner">
            <div className="noAuthority">
              <h1>조회 권한이 없습니다</h1>
            </div>
          </div>
        </Container>
      </>
    );
  }

  const canonicalUrl = `https://www.owl-dev.me/blog/${detailNote.noteId}`;
  const SearchQuery = useSelector((state) => state.common.search);
  const postState = useSelector((state) => state.common.postState);
  const sideBarCategory = useSelector((state) => state.common.sideBarCategory);
  const sideBarSubCategory = useSelector(
    (state) => state.common.sideBarSubCategory
  );

  const dispatch = useDispatch();
  dispatch(commonAction.setPostUserIdOfNote(detailNote.userId));
  useUtterances(detailNote.noteId.toString());

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  useEffect(() => {
    return () => {
      if (
        detailNote.category !== sideBarCategory ||
        detailNote.subCategory !== sideBarSubCategory
      ) {
        Router.push("/");
      } else if (SearchQuery.includes(detailNote.title)) {
        Router.push("/");
      }
    };
  }, [sideBarCategory, sideBarSubCategory, SearchQuery]);

  return (
    <>
      <Head>
        <title>{detailNote.title}</title>
      </Head>
      <NextSeo
        title={detailNote.title}
        description={
          "(" + detailNote.title + ") CTO 가 되고픈 부엉이 개발자 블로그 입니다"
        }
        canonical={canonicalUrl}
        openGraph={{
          url: canonicalUrl,
          title: detailNote.title,
          description: `CTO 가 되고픈 부엉이 개발자 블로그 입니다`,
          images: [
            {
              url: `https://backend.owl-dev.me/files/${detailNote.thumbImage}`,
              width: 800,
              height: 600,
              alt: "Owl",
              type: "svg",
            },
          ],
          site_name: `${detailNote.category}`,
        }}
      />
      <Header />
      <Container>
        <div className="inner">
          <div className="board">
            {postState === "read" && (
              <div className="summary clearfix">
                <h1 className="summary__title float--left">
                  {detailNote.title}
                </h1>
                <div className="post_info float--right">
                  <ul>
                    <li>
                      <FontAwesomeIcon
                        icon={faCalendarCheck}
                        style={{ fontSize: 12, color: "black" }}
                      />
                    </li>
                    <li>
                      {format(
                        new Date(detailNote.postDate.replace(/-/g, "/")),
                        "yyyy-MM-dd"
                      )}
                    </li>
                  </ul>
                </div>
              </div>
            )}
            {postState === "write" && (
              <div className="board clearfix">
                <div className="board">
                  <Editor NoteInfo={undefined} />
                </div>
              </div>
            )}
            {postState === "modify" && (
              <div className="board clearfix">
                <div className="board">
                  <Editor NoteInfo={detailNote} />
                </div>
              </div>
            )}
            {postState === "read" && (
              <div className="board clearfix">
                <div
                  className="board"
                  dangerouslySetInnerHTML={{ __html: detailNote.content }}
                />
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
  let id = Number(context.query.id as string);
  let ip = String(
    context.req.headers["x-real-ip"] ||
      context.req.connection.remoteAddress ||
      ("" as string)
  );

  noteApi.postIpLog({ip,id});
  const { data: detailNote } = await noteApi.getNoteById(id);

  return {
    props: {
      detailNote,
    },
  };
};
