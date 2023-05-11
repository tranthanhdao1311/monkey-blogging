import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./AttentionPost.module.scss";
import { Link } from "react-router-dom";
import {
  collection,
  limit,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import AttentionPostItem from "../AttentionPostItem/AttentionPostItem";
import images from "../../asset/image";

const cx = classNames.bind(styles);
const AttentionPost = () => {
  const [post, setPost] = useState([]);
  useEffect(() => {
    const colRef = collection(db, "posts");
    const queries = query(
      colRef,
      where("status", "==", 1),
      where("attentionPost", "==", true),
      limit(6)
    );

    onSnapshot(queries, (snapshot) => {
      const result = [];
      snapshot.forEach((doc) => {
        result.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setPost(result);
    });
  }, []);

  if (!post) return null;
  return (
    <div className={cx("container")}>
      <div className={cx("attention-post")}>
        <div className={cx("border-title")}></div>
        <h1 className={cx("title")}>Đáng chú ý</h1>

        <div className={cx("post-list")}>
          {post.length > 0 &&
            post.map((item) => (
              <AttentionPostItem data={item} key={item.id}></AttentionPostItem>
            ))}
        </div>
      </div>
      <div className={cx("advertisement")}>
        <img src={images.banner1} alt="" />
      </div>
    </div>
  );
};

export default AttentionPost;
