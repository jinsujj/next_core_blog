import React, { Component, useMemo } from "react";
import { useEffect } from "react";
import { useState } from "react";
import styled, { css } from "styled-components";
import noteApi, { PostedNote } from "../../api/note";
import { useSelector } from "../../store";
import palette from "../../styles/palette";
import Editor from "./Editor";
import { useDispatch } from "react-redux";
import { commonAction } from "../../store/common";
import BlogCard from "./BlogCard";
import Masonry, {ResponsiveMasonry } from "react-responsive-masonry";

interface StyledProps {
  $isdark: boolean;
}

const Container = styled.div<StyledProps>`
  ${(props) =>
    props.$isdark &&
    css`
      background-color: ${palette.dark_19} !important;
      .summary__write {
        color: ${palette.gray_dc};
      }
    `}

  padding-top: 56px;

  h1 {
    font-size: 24px;
  }
  .inner {
    max-width: 940px;
    margin: 0 auto;
    box-sizing: border-box;
    position: relative;
    padding: 0 20px;
  }

  .board {
    padding-bottom: 10px;
    font-family: "Nanum Gothic", sans-serif;
  }

  .summary__write {
    border-bottom: 2px solid ${palette.green_53};
    padding-bottom: 4px;
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
`;


const Body: React.FC = () => {
  const userId = useSelector((state) => state.user.userId);
  const [postNotes, setPostNotes] = useState<PostedNote[]>([]);
  const postState = useSelector((state) => state.common.postState);
  const searchQuery = useSelector((state) => state.common.search);
  const setCategoryFilter = useSelector((state) => state.common.sideBarCategory);
  const setSubCategoryFilter = useSelector((state) => state.common.sideBarSubCategory);
  const isDarkMode = useSelector((state) => state.common.isDark);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(commonAction.setPostUserIdOfNote(0));
  }, [dispatch]);

  // Get BlogCard data
  useEffect(() => {
    const fetchNotes = async () => {
      if (searchQuery.length > 0) {
        const blogs = await noteApi.getNoteBySearch(searchQuery);
        setPostNotes(blogs.data || []);
      } else if (setCategoryFilter.length > 0 || setSubCategoryFilter.length > 0) {
        const blogs = await noteApi.getNoteByCategory(userId, setCategoryFilter, setSubCategoryFilter);
        setPostNotes(blogs.data || []);
      } else {
        const blogs = await noteApi.getNoteAll(userId);
        setPostNotes(blogs.data || []);
      }

      dispatch(commonAction.setToggleMode(false));
      dispatch(commonAction.setPostState("read"));
    };

    fetchNotes();
  }, [dispatch, userId, searchQuery, setCategoryFilter, setSubCategoryFilter]);

  return (
    <Container $isdark={isDarkMode}>
      <div className="inner">
        <div className="board">
          {setCategoryFilter && postState == "read" && (
            <h1 className="summary__write">
              {setCategoryFilter} , {setSubCategoryFilter} List.
            </h1>
          )}
          {postState == "read" && (
            <ResponsiveMasonry
              columnsCountBreakPoints={{ 350: 1, 450: 2, 650: 3, 900: 4 }}
            >
              <Masonry columnsCount={5} gutter="20px">
                {postNotes.map((blog, index) => (
                  <BlogCard blog={blog} key={index} />
                ))}
              </Masonry>
            </ResponsiveMasonry>
          )}
          {postState == "write" && (
            <>
              <div className="board clearfix">
                <div className="board">
                  <Editor NoteInfo={undefined} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Container>
  );
};

export default Body;
