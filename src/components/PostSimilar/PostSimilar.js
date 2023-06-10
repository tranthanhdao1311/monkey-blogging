import React from "react";
import classNames from "classnames/bind";
import styles from "./PostSimilar.module.scss";
import PostCategory from "../PostCategory/PostCategory";
import PostTitle from "../PostTitle/PostTitle";
import PostInfo from "../PostInfo/PostInfo";
import PostImage from "../PostImage/PostImage";
import { useState } from "react";
import { useEffect } from "react";
import {
  collection,
  limit,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/firebase-config";

const cx = classNames.bind(styles);

const PostSimilar = ({ data }) => {
  const [similar, setSimilar] = useState([]);
  useEffect(() => {
    async function getData() {
      const colRef = collection(db, "posts");
      const queries = query(
        colRef,
        where("category.id", "==", data.category?.id),
        where("status", "==", 1),
        limit(5)
      );
      onSnapshot(queries, (snapshot) => {
        let results = [];
        snapshot.forEach((doc) => {
          if (doc.id === data.id) {
            return null;
          } else {
            results.push({
              id: doc.id,
              ...doc.data(),
            });
          }
        });
        setSimilar(results);
      });
    }
    getData();
  }, [data.category?.id, data.id]);
  return (
    <>
      {similar.length > 0 && (
        <div className={cx("container")}>
          <div className={cx("post-similar")}>
            <span className={cx("border-title")}></span>
            <h1 className={cx("title")}>Bài viết liên quan</h1>
            <div className={cx("content")}>
              <div className={cx("post-list")}>
                {similar.map((item) => {
                  const date = new Date(item.createAt?.seconds * 1000);
                  const formatDate = new Date(date).toLocaleDateString("vi-VI");

                  return (
                    <div
                      className={cx("post-item")}
                      key={item.id}
                      // onClick={() => {
                      //   navigate(`/${item.slug}`);
                      // }}
                    >
                      <PostImage
                        to={item.slug}
                        url={item?.image}
                        className={cx("size-img-medium")}
                      ></PostImage>
                      <PostCategory to={item.category?.slug}>
                        {item?.category?.name}
                      </PostCategory>

                      <PostTitle
                        to={item.slug}
                        className={cx("style-posttitle")}
                      >
                        {item?.title}
                      </PostTitle>
                      <PostInfo
                        date={formatDate}
                        author={item.user?.username}
                        bgColorDot={cx("bg-color-dot")}
                        className={cx("post-info-style")}
                      ></PostInfo>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostSimilar;
