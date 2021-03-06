import React, { useMemo } from "react";
import { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import noteApi, { PostedNote } from "../../api/note";
import { useSelector } from "../../store";
import palette from "../../styles/palette";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import Editor from "./Editor";
import { useDispatch } from "react-redux";
import { commonAction } from "../../store/common";
import BlogCard from "./BlogCard";


const Container = styled.div`
  margin-top: 56px;

  .inner {
    max-width: 1200px;
    margin: 0 auto;
    box-sizing: border-box;
    position: relative;
    padding: 0 20px;
  }

  .board {
    padding-bottom: 10px;
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
  .float--left {
    float: left;
  }
  .float--right {
    float: right;
  }
`;

const Body = () => {
  const userId = useSelector((state) => state.user.userId);
  const [postNotes, setPostNotes] = useState<PostedNote[]>([]);
  const postState = useSelector((state) => state.common.postState);
  const searchQuery = useSelector((state) => state.common.search);
  const setCategoryFilter = useSelector((state) => state.common.sideBarCategory);
  const setSubCategoryFilter = useSelector((state) => state.common.sideBarSubCategory);

  const dispatch = useDispatch();
  useMemo(()=>{
    dispatch(commonAction.setPostUserIdOfNote(0));
  },[]);

  // Get BlogCard data 
  useEffect(() => {
    if(searchQuery.length >0){
      const Notes = noteApi.getNoteBySearch(searchQuery).then((res) => setPostNotes(res.data||[]));
    }
    else if(setCategoryFilter.length >0 || setSubCategoryFilter.length>0 ){
      const Notes = noteApi.getNoteByCategory(userId, setCategoryFilter,setSubCategoryFilter).then((res) => setPostNotes(res.data||[]));
    }
    else{
      const Notes = noteApi.getNoteAll(userId).then((res) => setPostNotes(res.data||[]));
    }
    dispatch(commonAction.setToggleMode(false));
    dispatch(commonAction.setPostState('read'));
  }, [userId,searchQuery,setCategoryFilter,setSubCategoryFilter]);

  return (
    <Container>
      <div className="inner">
        <div className="board">
          {setCategoryFilter && postState =="read" && (
            <h3 className="summary__write">
            {setCategoryFilter} , {setSubCategoryFilter} List.
            </h3>
          )}
          {postState == "read" && (
            <ResponsiveMasonry
              columnsCountBreakPoints={{ 350: 1, 450: 2, 650:3, 900: 4 }}
            >
              <Masonry columnsCount={5} gutter={20}>
                {postNotes.map((blog, index) => (
                      <BlogCard blog={blog} key={index}/>
                  ))}
              </Masonry>
            </ResponsiveMasonry>
          )}
          {postState =="write" && (
            <>
              <div className="board clearfix">
                <div className="board">
                  <Editor NoteInfo={undefined}/>
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
