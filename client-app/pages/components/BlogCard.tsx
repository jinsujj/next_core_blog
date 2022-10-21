import { faCalendarCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatDistance } from "date-fns";
import Link from "next/link";
import { format } from "path";
import React from "react";
import styled, { css } from "styled-components";
import { PostedNote } from "../../api/note";
import { useSelector } from "../../store";
import palette from "../../styles/palette";

interface StyledProps {
  isPost: string;
  isDark: boolean;
}

const Container = styled.div<StyledProps>`
  ${(props) =>
    props.isDark &&
    css`
      color: ${palette.gray_dc} !important;
      p {
        color: ${palette.gray_d9} !important;
      }
      img {
        opacity: 0.5 !important;
      }
      img:hover {
        opacity: 0.8 !important;
      }
    `}

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

const BlogCard = ({ blog }: IProps) => {
  const isDarkMode = useSelector((state) => state.common.isDark);
  const imgUri = process.env.NEXT_PUBLIC_API_URL + "/files/";

  if (blog.thumbImage === null) blog.thumbImage = "default.svg";

  var blogDate = blog.postDate.replace(/-/g, "/");
  if (blog.modifyDate !== null && blog.modifyDate !== undefined)
     blogDate = blog.modifyDate?.replace(/-/g, "/");

  return (
    <Container isPost={blog.isPost} isDark={isDarkMode}>
      <div className="imageWrapper">
        <Link href={`/blog/${blog.noteId}`} key={blog.noteId}>
          <img key={blog.noteId} src={`${imgUri}${blog.thumbImage}`} />
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
            {formatDistance(new Date(), new Date(blogDate), {
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
