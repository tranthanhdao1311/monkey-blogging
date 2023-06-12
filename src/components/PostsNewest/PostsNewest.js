import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./PostsNewest.module.scss";
import PostCategory from "../PostCategory/PostCategory";
import PostTitle from "../PostTitle/PostTitle";
import PostInfo from "../PostInfo/PostInfo";
import PostImage from "../PostImage/PostImage";
import {
  collection,
  limit,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import LoadingSkeleton from "../LoadingSkeleton/LoadingSkeleton";
import PostNewestFirst from "../PostNewestFirst/PostNewestFirst";
import PostNewestOrder from "../PostNewestOrder/PostNewestOrder";

const cx = classNames.bind(styles);

const PostsNewest = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const colRef = collection(db, "posts");
    const queries = query(
      colRef,
      where("status", "==", 1),
      where("featurePost", "==", false),
      where("bannerPost", "==", false),
      where("attentionPost", "==", false),
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

  const [first, ...order] = posts;

  return (
    <div className={cx("container")}>
      <div className={cx("posts-newest")}>
        <span className={cx("border-title")}></span>
        <h1 className={cx("title")}>Mới nhất</h1>
        {posts.length <= 0 && <SkeletonNewest></SkeletonNewest>}
        <div className={cx("content")}>
          {posts.length > 0 && (
            <>
              <div className={cx("left")}>
                <PostNewestFirst data={first}></PostNewestFirst>
              </div>
              <div className={cx("right")}>
                {order.length > 0 &&
                  order.map((item) => (
                    <PostNewestOrder
                      key={item.id}
                      data={item}
                    ></PostNewestOrder>
                  ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostsNewest;

const SkeletonNewest = () => {
  return (
    <div className={cx("content")}>
      <div className={cx("left")}>
        <LoadingSkeleton
          width="610px"
          height="320px"
          radius="15px"
        ></LoadingSkeleton>
        <LoadingSkeleton
          width="80px"
          height="30px"
          radius="8px"
          margin="4px 0"
        ></LoadingSkeleton>
        <LoadingSkeleton
          width="80%"
          height="30px"
          radius="8px"
          margin="10px 0 0 0 "
        ></LoadingSkeleton>
        <LoadingSkeleton
          width="200px"
          height="21px"
          radius="8px"
          margin="10px 0 0 0 "
        ></LoadingSkeleton>
      </div>
      <div className={cx("right")}>
        <div className={cx("post-item")}>
          <LoadingSkeleton
            width="160px"
            height="110px"
            radius="15px"
          ></LoadingSkeleton>

          <div className={cx("post-info")}>
            <LoadingSkeleton
              width="80px"
              height="30px"
              radius="8px"
            ></LoadingSkeleton>

            <LoadingSkeleton
              width="216px"
              height="21px"
              radius="8px"
              margin="10px 0 0 0 "
            ></LoadingSkeleton>

            <LoadingSkeleton
              width="180px"
              height="21px"
              radius="8px"
              margin="10px 0 0 0 "
            ></LoadingSkeleton>
          </div>
        </div>
        <div className={cx("post-item")}>
          <LoadingSkeleton
            width="160px"
            height="110px"
            radius="15px"
          ></LoadingSkeleton>

          <div className={cx("post-info")}>
            <LoadingSkeleton
              width="80px"
              height="30px"
              radius="8px"
            ></LoadingSkeleton>

            <LoadingSkeleton
              width="216px"
              height="21px"
              radius="8px"
              margin="10px 0 0 0 "
            ></LoadingSkeleton>

            <LoadingSkeleton
              width="180px"
              height="21px"
              radius="8px"
              margin="10px 0 0 0 "
            ></LoadingSkeleton>
          </div>
        </div>
        <div className={cx("post-item")}>
          <LoadingSkeleton
            width="160px"
            height="110px"
            radius="15px"
          ></LoadingSkeleton>

          <div className={cx("post-info")}>
            <LoadingSkeleton
              width="80px"
              height="30px"
              radius="8px"
            ></LoadingSkeleton>

            <LoadingSkeleton
              width="216px"
              height="21px"
              radius="8px"
              margin="10px 0 0 0 "
            ></LoadingSkeleton>

            <LoadingSkeleton
              width="180px"
              height="21px"
              radius="8px"
              margin="10px 0 0 0 "
            ></LoadingSkeleton>
          </div>
        </div>
      </div>
    </div>
  );
};
