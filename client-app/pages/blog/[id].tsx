import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import React from "react";
import { useDispatch } from "react-redux";
import noteApi, { PostedNote } from "../../api/note";

interface IProps {
  detailNote: PostedNote;
}

const blogDetail: NextPage<IProps> = ({ detailNote }) => {
  const dispatch = useDispatch();
  return (
    <>
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
