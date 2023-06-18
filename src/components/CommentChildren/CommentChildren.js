import React from "react";
import classNames from "classnames/bind";
import styles from "./CommentChildren.module.scss";
import { useAuth } from "../../context/auth-context";
import { useForm } from "react-hook-form";

const cx = classNames.bind(styles);

const CommentChildren = ({ data }) => {
  const { userInfo } = useAuth();
  const { control, handleSubmit } = useForm({
    mode: "onChange",
    defaultValues: {
      comment: "",
      commentChildren: [],
      createAt: "",
      idPost: "",
      idUser: "",
      userName: "",
    },
  });
  return (
    <>
      {data.commentChildren?.map((item) => (
        <li key={item.id}>
          <span>{item.userName}</span>
          <span>{item.commentChildren}</span>
        </li>
      ))}
    </>
  );
};

export default CommentChildren;
