import React from "react";
import classNames from "classnames/bind";
import styles from "./ShowAllCate.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import { useState } from "react";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

const ShowAllCate = ({ setShowAllCate, setShowSubMenu }) => {
  const handleHideAllCate = () => {
    setShowAllCate(false);
  };

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const colRef = collection(db, "categories");
    const q = query(
      colRef,
      where("status", "==", 1),
      where("parentCategory", "==", null)
    );
    onSnapshot(q, (snapshot) => {
      const result = [];
      snapshot.forEach((doc) => {
        result.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setCategories(result);
    });
  }, []);

  const [showAllMap, setShowAllMap] = useState({});

  const handleLoadMore = (item) => {
    setShowAllMap((prevMap) => ({
      ...prevMap,
      [item.id]: true,
    }));
  };

  const handleLinkClick = () => {
    setShowAllCate(false);
    setShowSubMenu((prev) => !prev);
  };
  return (
    <div className={cx("wrap-all-menu")}>
      <div className={cx("container")}>
        <header className={cx("header-all-menu")}>
          <p className={cx("title")}>Tất cả chuyên mục</p>
          <div className={cx("close")} onClick={() => handleHideAllCate()}>
            <p>Đóng</p>
            <FontAwesomeIcon
              className={cx("icon-close")}
              icon={faXmark}
            ></FontAwesomeIcon>
          </div>
        </header>
        <div className={cx("content", "custom-scroll-bar")}>
          {categories.length > 0 &&
            categories.map((item, index) => {
              const showAll = showAllMap[item.id];
              const arrChildrenCate = item.childrenCategory;

              return (
                <ul className={cx("cate-menu-list")} key={item.id}>
                  <li className={cx("parent-cate")}>
                    <Link
                      onClick={() => handleLinkClick()}
                      className={cx("cate-menu-item-link")}
                      to={`/category/${item.slug}`}
                    >
                      {item.name}
                    </Link>
                  </li>
                  {showAll
                    ? item.childrenCategory.map((item1) => {
                        return (
                          item1.createAt !== null && (
                            <li className={cx("cate-menu-item")} key={item1.id}>
                              <Link
                                onClick={() => handleLinkClick()}
                                className={cx("cate-menu-item-link")}
                                to={`/category/${item.slug}/${item1.slug}`}
                              >
                                {item1.name}
                              </Link>
                            </li>
                          )
                        );
                      })
                    : item.childrenCategory.slice(0, 8).map((item1) => {
                        return (
                          item1.createAt !== null && (
                            <li className={cx("cate-menu-item")} key={item1.id}>
                              <Link
                                onClick={() => handleLinkClick()}
                                className={cx("cate-menu-item-link")}
                                to={`/category/${item.slug}/${item1.slug}`}
                              >
                                {item1.name}
                              </Link>
                            </li>
                          )
                        );
                      })}

                  {!showAll && arrChildrenCate.length > 8 && (
                    <li
                      className={cx("load-more-cate")}
                      onClick={() => handleLoadMore(item)}
                    >
                      Xem thêm
                    </li>
                  )}
                </ul>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default ShowAllCate;
