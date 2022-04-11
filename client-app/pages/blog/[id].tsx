import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import React from "react";
import { useDispatch } from "react-redux";
import noteApi, { PostedNote } from "../../api/note";
import { useSelector } from "../../store";
import Input from "../components/common/Input";
import Editor from "../components/Editor";

interface IProps {
  detailNote: PostedNote;
}

const blogDetail: NextPage<IProps> = ({ detailNote }) => {
  const userInfo = useSelector((state) => state.user);
  const dispatch = useDispatch();

  return (
    <div className="board">
          {!userInfo && (
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
          )}
          {userInfo && (
            <div className="summary clearfix">
              <div className="title">
                <Input type="text" placeholder="제목" color="gray_cd" focusColor="gray_80" useValidation={false}/>
              </div>
            </div>
          )}
          <div className="board clearfix">
            <div className="board">
              <Editor />
            </div>
          </div>
        </div>
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
