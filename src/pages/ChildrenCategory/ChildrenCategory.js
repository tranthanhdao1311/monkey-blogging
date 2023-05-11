import React from "react";
import classNames from "classnames/bind";
import styles from "./ChildrenCategory.module.scss";
import { Link, NavLink, useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import AttentionPostItem from "../../components/AttentionPostItem/AttentionPostItem";

const cx = classNames.bind(styles);

const ChildrenCategory = () => {
  const params = useParams();
  const { slug } = params;
  const active = ({ isActive }) => (isActive ? cx("active") : "");

  const [postDetail, setPostDetail] = useState({});
  useEffect(() => {
    if (!slug) return;
    const docRef = collection(db, "categories");
    const q = query(docRef, where("slug", "==", slug));

    onSnapshot(q, (snapshot) => {
      snapshot.forEach((doc) => {
        setPostDetail({ id: doc.id, ...doc.data() });
      });
    });
  }, [slug]);

  const [data, setData] = useState({});
  useEffect(() => {
    async function fetchData() {
      if (!postDetail) return;

      const docRef = doc(db, "categories", postDetail?.parentCategory?.id);
      const docData = await getDoc(docRef);
      setData(docData.data());
    }
    fetchData();
  }, [postDetail]);

  const [posts, setPosts] = useState([]);
  const [first, ...order] = posts;
  useEffect(() => {
    if (postDetail && postDetail.id) {
      const colRef = collection(db, "posts");
      const q = query(
        colRef,
        where("status", "==", 1),
        where("category.id", "==", postDetail.id)
      );
      onSnapshot(q, (snapshot) => {
        const result = [];
        snapshot.forEach((doc) => {
          result.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setPosts(result);
      });
    }
  }, [postDetail]);

  const [postsChildren, setPostsChildren] = useState([]);

  const postsByCate = postsChildren.reduce((acc, post) => {
    const category = post.category.name;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(post);
    return acc;
  }, {});

  useEffect(() => {
    if (postDetail && postDetail.id) {
      const colRef = collection(db, "posts");
      const q = query(
        colRef,
        where("status", "==", 1),
        where("category.parentCategory.id", "==", postDetail.id)
      );
      onSnapshot(q, (snapshot) => {
        const result = [];
        snapshot.forEach((doc) => {
          result.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setPostsChildren(result);
      });
    }
  }, [postDetail]);

  if (!postDetail.id) return null;
  if (!first) return null;
  return (
    <div className={cx("container")}>
      <header className={cx("header-cate")}>
        <h1 className={cx("name")}>
          <Link to={`/category/${data.slug}`}>{data.name}</Link>
        </h1>
        <ul className={cx("cate-list")}>
          {data?.childrenCategory?.length > 0 &&
            data?.childrenCategory?.map(
              (item) =>
                item.createAt !== null && (
                  <li key={item.id} className={cx("cate-item")}>
                    <NavLink
                      className={active}
                      to={`/category/${data.slug}/${item.slug}`}
                    >
                      {item.name}
                    </NavLink>
                  </li>
                )
            )}
        </ul>
      </header>
      <div className={cx("content")}>
        <div className={cx("post-list")}>
          <div className={cx("first-item")}>
            <Link className={cx("image-link")} to={`/${first.slug}`}>
              <img className={cx("first-item-img")} src={first.image} alt="" />
            </Link>
            <div className={cx("info")}>
              <h2 className={cx("info-title")}>
                <Link to={`/${first.slug}`}>{first.title}</Link>
              </h2>
              <Link className={cx("info-desc")} to={`/${first.slug}`}>
                {first.desc}
              </Link>
            </div>
          </div>

          {order.length > 0 &&
            order.map((item) => (
              <AttentionPostItem data={item} key={item.id}></AttentionPostItem>
            ))}
        </div>

        <div className={cx("post-list-nav")}>
          {Object.entries(postsByCate).map((data) => {
            console.log(data);
            const [first, ...order] = data[1];
            return (
              <div>
                <h2 className={cx("list-nav-title")} key={data}>
                  {/* <Link to={`/category/${data[1].parentCategory.slug}`}> */}
                  {data[0]}
                  {/* </Link> */}
                </h2>
                <div className={cx("nav-first-item")}>
                  <img
                    className={cx("post-nav-img")}
                    src={first.image}
                    alt=""
                  />
                  <Link className={cx("post-nav-title")} to={`/${first.slug}`}>
                    {first.title}
                  </Link>
                </div>
                {order.map((item) => {
                  return (
                    <p className={cx("post-order-title")} key={item.id}>
                      <Link to={`/${item.slug}`}>{item.title}</Link>
                    </p>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChildrenCategory;
