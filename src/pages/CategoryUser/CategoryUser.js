import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./CategoryUser.module.scss";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/firebase-config";

const cx = classNames.bind(styles);
const CategoryUser = () => {
  const params = useParams();
  const { slug } = params;
  const navigate = useNavigate();
  const [postDetail, setPostDetail] = useState({});
  useEffect(() => {
    async function fetchData() {
      if (!slug) return;
      const docRef = collection(db, "categories");
      const q = query(docRef, where("slug", "==", slug));

      onSnapshot(q, (snapshot) => {
        snapshot.forEach((doc) => {
          setPostDetail({ id: doc.id, ...doc.data() });
        });
      });
    }
    fetchData();
  }, [slug]);

  const [posts, setPosts] = useState([]);
  const postFirst = posts.slice(0, 1);
  const postSecond = posts.slice(1, 3);
  const postOrder = posts.slice(3);

  useEffect(() => {
    if (postDetail && postDetail.id) {
      const colRef = collection(db, "posts");
      const q = query(
        colRef,
        where("status", "==", 1),
        where("category.parentCategory.id", "==", postDetail?.id)
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

  if (!postDetail.id) return null;

  return (
    <div className={cx("container")}>
      <header className={cx("header-cate")}>
        <h1 className={cx("name")}>
          <Link to={`/category/${postDetail.slug}`}>{postDetail.name}</Link>
        </h1>
        <ul className={cx("cate-list")}>
          {postDetail?.childrenCategory.length > 0 &&
            postDetail?.childrenCategory.map(
              (item) =>
                item.createAt !== null && (
                  <li key={item.id} className={cx("cate-item")}>
                    <Link
                      to={`/category/${postDetail.slug}/${item.slug}`}
                      onClick={() =>
                        navigate(`/category/${postDetail.slug}/${item.slug}`)
                      }
                    >
                      {item.name}
                    </Link>
                  </li>
                )
            )}
        </ul>
      </header>
      <div className={cx("content")}>
        <div className={cx("content-top")}>
          <div className={cx("post-list-first")}>
            {postFirst.length > 0 &&
              postFirst.map((item) => (
                <>
                  <Link to={`/${item.slug}`} className={cx("first-img-link")}>
                    <img className={cx("first-img")} src={item.image} alt="" />
                  </Link>
                  <h2 className={cx("first-info-title")}>
                    <Link to={`/${item.slug}`}>{item.title}</Link>
                  </h2>
                  <p className={cx("first-info-desc")}>
                    <Link to={`/${item.slug}`}>{item.desc}</Link>
                  </p>
                </>
              ))}
          </div>
          <div className={cx("post-list-nav")}>
            {postSecond.length > 0 &&
              postSecond.map((item) => (
                <div className={cx("nav-item")}>
                  <Link className={cx("nav-link")} to={`/${item.slug}`}>
                    <img className={cx("nav-img")} src={item.image} alt="" />
                    <p className={cx("nav-title")}>
                      <Link to={`/${item.slug}`}>{item.title}</Link>
                    </p>
                  </Link>

                  <Link className={cx("nav-item-desc")} to={`/${item.slug}`}>
                    {item.desc}
                  </Link>
                </div>
              ))}
          </div>
        </div>
        <div className={cx("order-list")}>
          {postOrder.length > 0 &&
            postOrder.map((item) => (
              <div className={cx("order-item")}>
                <Link
                  to={`/${item.slug}`}
                  className={cx("order-item-img-link")}
                >
                  <img
                    className={cx("order-item-img")}
                    src={item.image}
                    alt=""
                  />
                </Link>
                <Link
                  to={`/${item.slug}`}
                  className={cx("order-item-title-link")}
                >
                  {item.title}
                </Link>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryUser;
