import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Featured.module.scss";
import {
  collection,
  limit,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import PostFeatureItem, {
  SkeletonFeature,
} from "../PostFeatureItem/PostFeatureItem";

const cx = classNames.bind(styles);

const Featured = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const colRef = collection(db, "posts");
    const queries = query(
      colRef,
      where("status", "==", 1),
      where("featurePost", "==", true),
      limit(4)
    );
    onSnapshot(queries, (snapshot) => {
      let result = [];
      snapshot.forEach((doc) => {
        result.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setPosts(result);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // if (posts.length <= 0) return <Skeleton></Skeleton>;

  return (
    <>
      <div className={cx("container")}>
        <div className={cx("featured-posts")}>
          <span className={cx("border-title")}></span>
          <h1 className={cx("title")}>Bài viết nổi bật</h1>

          <div className={cx("post-list")}>
            {posts.length <= 0 && (
              <>
                <SkeletonFeature></SkeletonFeature>
                <SkeletonFeature></SkeletonFeature>
                <SkeletonFeature></SkeletonFeature>
                <SkeletonFeature></SkeletonFeature>
              </>
            )}
            {posts.length > 0 &&
              posts.map((post) => (
                <PostFeatureItem key={post.id} data={post}></PostFeatureItem>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Featured;
