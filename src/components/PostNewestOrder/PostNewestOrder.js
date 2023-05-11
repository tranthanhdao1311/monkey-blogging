import React from "react";
import classNames from "classnames/bind";
import styles from "./PostNewestOrder.module.scss";
import PostImage from "../PostImage/PostImage";
import PostCategory from "../PostCategory/PostCategory";
import PostTitle from "../PostTitle/PostTitle";
import PostInfo from "../PostInfo/PostInfo";
import useTime from "../../hook/useTime";

const cx = classNames.bind(styles);

const PostNewestOrder = ({ data }) => {
  const { time, unit } = useTime(data);
  return (
    <div className={cx("post-item")}>
      <PostImage
        to={data?.slug}
        url={data?.image}
        className={cx("size-img-small")}
      ></PostImage>

      <div className={cx("post-info")}>
        <PostCategory
          to={`${data?.category.parentCategory.slug}/${data?.category?.slug}`}
          className={cx("bg-postcate")}
        >
          {data?.category?.name}
        </PostCategory>

        <PostTitle to={data?.slug} className={cx("style-posttitle")}>
          {data?.title}
        </PostTitle>
        <PostInfo
          time={time}
          unit={unit}
          author={data?.user?.username}
          bgColorDot={cx("bg-color-dot")}
          className={cx("post-info-style")}
        ></PostInfo>
      </div>
    </div>
  );
};

export default PostNewestOrder;
