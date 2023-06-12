import React from "react";
import classNames from "classnames/bind";
import styles from "./PostFeatureItem.module.scss";
import PostImage from "../PostImage/PostImage";
import PostCategory from "../PostCategory/PostCategory";
import PostInfo from "../PostInfo/PostInfo";
import PostTitle from "../PostTitle/PostTitle";
import LoadingSkeleton from "../LoadingSkeleton/LoadingSkeleton";
import { Link } from "react-router-dom";
import useTime from "../../hook/useTime";

const cx = classNames.bind(styles);

const PostFeatureItem = ({ data }) => {
  const { time, unit } = useTime(data);

  if (!data && !data.id) return null;

  const date = new Date(data?.createAt?.seconds * 1000);
  const formatDate = new Date(date).toLocaleDateString("vi-VI");
  return (
    <div>
      <div className={cx("post-item")} key={data.id}>
        <PostImage
          to={data.slug}
          className={cx("img")}
          url={data.image}
        ></PostImage>
        <div className={cx("header-post")}>
          <div className={cx("header-post-left")}>
            {data?.category?.name ? (
              <PostCategory
                to={`${data.category.parentCategory.slug}/${data.category?.slug}`}
              >
                {data.category.name}
              </PostCategory>
            ) : (
              <PostCategory>News</PostCategory>
            )}
          </div>
          <div className={cx("header-post-right")}>
            {data?.user?.username && (
              <PostInfo time={time} unit={unit}></PostInfo>
            )}
          </div>
        </div>
        <PostTitle to={data.slug} className={cx("style-posttitle")}>
          {data.title}
        </PostTitle>
        <Link to={data.slug} className={cx("overlay")}></Link>
      </div>
    </div>
  );
};

export default PostFeatureItem;

export const SkeletonFeature = () => {
  return (
    <div className={cx("post-item")}>
      <LoadingSkeleton width="100%" radius="15px"></LoadingSkeleton>
      <div className={cx("header-post")}>
        <div className={cx("header-post-left")}>
          <LoadingSkeleton
            width="80px"
            height="29px"
            radius="8px"
          ></LoadingSkeleton>
        </div>
      </div>
      <PostTitle className={cx("style-posttitle")}>
        <LoadingSkeleton
          width="250px"
          height="40px"
          radius="8px"
        ></LoadingSkeleton>
      </PostTitle>
    </div>
  );
};
