import { faCalendarCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatDistance } from "date-fns";
import Link from "next/link";
import React from "react";
import styled, { css } from "styled-components";
import { PostedNote } from "../../api/note";
import palette from "../../styles/palette";

interface StyledProps {
  isPost: string;
}

const Container = styled.div<StyledProps>`
  .imageWrapper {
    display: block;
    border-radius: 4px;
    position: relative;

    ${(props) =>
      props.isPost === "N" &&
      css`
        border: 1px solid ${palette.gray_f5};
        background-color: ${palette.gray_f5};
      `}
  }

  img {
    width: 100%;
    height: 100%;
    ${(props) =>
      props.isPost === "N" &&
      css`
        opacity: 0.2;
      `}
  }
  img:hover {
    background-color: white;
    opacity: 0.7;
  }

  .blogTitle {
    text-align: center;
    font-weight: bold;
    color: ${(props) =>
      props.isPost === "N" ? `${palette.gray_7d}` : `${palette.black}`};
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
  .iconDateTime {
    width: 100%;
    justify-content: center;
    display: flex;
    margin-right: 8px;
  }
`;

export interface IProps {
  blog: PostedNote;
}

const host = process.env.NEXT_PUBLIC_API_URL + "/files/";
const BlogCard = ({ blog }: IProps) => {
  if (blog.thumbImage === null) blog.thumbImage = "default.svg";

  var blogPostDate = blog.postDate.replace(/-/g, "/");

  return (
    <Container isPost={blog.isPost}>
      <div className="imageWrapper">
        <Link href={`/blog/${blog.noteId}`} key={blog.noteId}>
          <img key={blog.noteId} src={`${host}${blog.thumbImage}`} />
        </Link>
        <div className="blogTitle">
          <p>{blog.title}</p>
        </div>
        <div className="blogData">
          <div className="iconDateTime">
            <FontAwesomeIcon
              icon={faCalendarCheck}
              style={{ fontSize: 14, color: `${palette.gray_bb}` }}
            />
            <p>
              {formatDistance(new Date(), new Date(blogPostDate), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default BlogCard;
