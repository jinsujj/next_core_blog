import {
  faCalendarCheck,
  faComment,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { Children } from "react";
import styled from "styled-components";
import { PostedNote } from "../../api/note";
import dateFormat from "../../lib/dateFormat";
import palette from "../../styles/palette";

const Container = styled.div`
  .imageWrapper {
    display: block;
    border-radius: 4px;
    position: relative;
  }

  img {
    width: 100%;
    height: 100%;
  }
  img:hover {
    background-color: white;
    opacity: 0.7;
  }

  .blogTitle {
    text-align: center;
    font-weight: bold;
    color: ${palette.gray_7d};
    margin: 4px 0;
  }

  .blogData {
    display: flex;
    justify-content: center;
    margin-bottom: 2px;
    font-size: 14px;
    p {
      margin-left: 4px;
      margin-right: 4px;
    }
  }
  .iconGroup {
    display: flex;
    margin-right: 8px;
  }
`;

export interface IProps {
  blog: PostedNote;
}

const host = process.env.NEXT_PUBLIC_API_URL + "/files/";
const BlogCard = ({ blog }: IProps) => {
  let postDate = new Date(blog.postDate);

  return (
    <Container>
      <div className="imageWrapper">
        <Link href={`/blog/${blog.noteId}`} key={blog.noteId}>
          <img key={blog.noteId} src={`${host}${blog.thumbImage}`} />
        </Link>
        <div className="blogTitle">
          <p>{blog.title}</p>
        </div>
        <div className="blogData">
          <div className="iconGroup">
            <FontAwesomeIcon
              icon={faEye}
              style={{ fontSize: 14, color: `${palette.gray_bb}` }}
            />
            <p>{blog.readCount}</p>
          </div>
          <div className="iconGroup">
            <FontAwesomeIcon
              icon={faComment}
              style={{ fontSize: 14, color: `${palette.gray_bb}` }}
            />
            <p>{}</p>
          </div>
        </div>
        <div className="blogData">
          <div className="iconGroup">
            <FontAwesomeIcon
              icon={faCalendarCheck}
              style={{ fontSize: 14, color: `${palette.gray_bb}` }}
            />
            <p>{dateFormat.toStringByFormatting(postDate)}</p>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default BlogCard;
