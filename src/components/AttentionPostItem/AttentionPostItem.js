import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./AttentionPostItem.module.scss";
import { Link } from "react-router-dom";
import PostImage from "../PostImage/PostImage";
import useTime from "../../hook/useTime";
const cx = classNames.bind(styles);

const AttentionPostItem = ({ data }) => {
  const { time, unit } = useTime(data);
  if (!data && !data.id) return null;

  return (
    <div className={cx("post-item")} key={data.id}>
      <PostImage
        className={cx("img")}
        url={data.image}
        to={data.slug}
      ></PostImage>
      <div className={cx("info")}>
        <Link to={`/${data.slug}`} className={cx("title-post")}>
          {data.title}
        </Link>
        <div>
          <Link
            to={`/category/${data?.category.parentCategory.slug}/${data?.category?.slug}`}
            className={cx("category")}
          >
            {data?.category?.name}
          </Link>
          <span> - </span>
          <span className={cx("time-post")}>{time + " " + unit}</span>
        </div>
        <p className={cx("desc")}>{data.desc}</p>
      </div>
    </div>
  );
};

export default AttentionPostItem;
