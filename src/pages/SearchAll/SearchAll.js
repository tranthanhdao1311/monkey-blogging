import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "../CategoryUser/CategoryUser.module.scss";
import { Link, useParams } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import { useToggleSideBar } from "../../context/dashboard-context";

const cx = classNames.bind(styles);

const SearchAll = () => {
  const params = useParams();
  const { value } = params;
  const [posts, setPosts] = useState([]);
  const postFirst = posts.slice(0, 1);
  const postSecond = posts.slice(1, 3);
  const postOrder = posts.slice(3);

  // hide show results search
  const { setShow, show } = useToggleSideBar();
  console.log(show);
  useEffect(() => {
    setShow(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps, no-use-before-define
  }, [value, posts]);
  //

  useEffect(() => {
    if (value && value.length > 0) {
      const colRef = collection(db, "posts");

      onSnapshot(colRef, (snapshot) => {
        let result = [];
        snapshot.forEach((doc) => {
          result.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        const postSearch =
          value &&
          result.filter((item) =>
            item.title.toLowerCase().includes(value.toLowerCase())
          );

        setPosts(postSearch);
      });
    }
  }, [value]);
  return (
    <div className={cx("container")}>
      <p style={{ color: "#232323", fontSize: "22px", fontWeight: "400" }}>
        Tìm thấy <strong>{posts.length}</strong> bài viết cho từ khóa{" "}
        <strong>'{value}'</strong>
      </p>
      <div className={cx("content")}>
        <div className={cx("content-top")}>
          <div className={cx("post-list-first")}>
            {postFirst.length > 0 &&
              postFirst.map((item) => (
                <div key={item.id}>
                  <Link to={`/${item.slug}`} className={cx("first-img-link")}>
                    <img className={cx("first-img")} src={item.image} alt="" />
                  </Link>
                  <h2 className={cx("first-info-title")}>
                    <Link to={`/${item.slug}`}>{item.title}</Link>
                  </h2>
                  <p className={cx("first-info-desc")}>
                    <Link to={`/${item.slug}`}>{item.desc}</Link>
                  </p>
                </div>
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

export default SearchAll;
