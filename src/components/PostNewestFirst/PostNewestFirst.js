import React from "react";
import classNames from "classnames/bind";
import styles from "./PostNewestFirst.module.scss";
import PostImage from "../PostImage/PostImage";
import PostCategory from "../PostCategory/PostCategory";
import PostTitle from "../PostTitle/PostTitle";
import PostInfo from "../PostInfo/PostInfo";
import useTime from "../../hook/useTime";

const cx = classNames.bind(styles);

const PostNewestFirst = ({ data }) => {
  const { time, unit } = useTime(data);
  return (
    <>
      <PostImage
        to={data?.slug}
        url={data?.image}
        className={cx("size-img-big")}
      ></PostImage>

      <PostCategory to={data?.category?.slug}>
        {data?.category?.name}
      </PostCategory>

      <PostTitle to={data?.slug} className={cx("style-h1-title")}>
        {data.title}
      </PostTitle>
      <PostInfo
        time={time}
        unit={unit}
        author={data?.user?.username}
        bgColorDot={cx("bg-color-dot")}
        className={cx("post-info-style")}
      ></PostInfo>
    </>
  );
};

export default PostNewestFirst;
