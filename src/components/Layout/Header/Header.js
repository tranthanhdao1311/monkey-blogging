import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import images from "../../../asset/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  faBars,
  faChessKing,
  faHome,
  faMagnifyingGlass,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../../../button/Button";
import { useAuth } from "../../../context/auth-context";
import { auth, db } from "../../../firebase/firebase-config";
import { signOut } from "firebase/auth";
import HeadLessTippy from "@tippyjs/react/headless";
// import HeadLessTippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import ShowAllCate from "../../ShowAllCate/ShowAllCate";
import stickybits from "stickybits";
import { useRef } from "react";
import debounce from "lodash.debounce";
import Loading from "../../loading/Loading";
import { useToggleSideBar } from "../../../context/dashboard-context";
import { set } from "react-hook-form";

const cx = classNames.bind(styles);

const menuLinks = [
  {
    url: "/",
    title: "Trang chủ",
  },
];

function getLastName(name) {
  if (name) {
    const length = name.split(" ").length;
    return name.split(" ")[length - 1];
  } else {
    return "User";
  }
}

const Header = () => {
  const { userInfo } = useAuth();
  const { show, setShow } = useToggleSideBar();

  const handleLogout = () => {
    signOut(auth);
  };

  const navigate = useNavigate();

  const active = ({ isActive }) => (isActive ? cx("active") : "");

  const refSticky = useRef(null);
  useEffect(() => {
    if (refSticky.current) {
      stickybits(refSticky.current, {
        stickyBitStickyOffset: 0, // khoảng cách từ cạnh trên của trình duyệt đến phần tử
        // useStickyClasses: true, // sử dụng các lớp CSS cho phần tử khi nó đang sticky
      });
    }
  }, []);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const colRef = collection(db, "categories");
    const queries = query(
      colRef,
      where("status", "==", 1),
      where("parentCategory", "==", null)
    );

    onSnapshot(queries, (snapshot) => {
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

  const [menuCate, setMenuCate] = useState([]);
  const [id, setId] = useState("");
  const handleOnMouseOver = async (item) => {
    const colRef = doc(db, "categories", item.id);
    const docData = await getDoc(colRef);
    setMenuCate(docData.data().childrenCategory);
    setId(item.id);
  };

  const [showAllCate, setShowAllCate] = useState(false);
  const [showSubMenu, setShowSubMenu] = useState(true);

  const handleShowAll = () => {
    setShowAllCate((prev) => !prev);
    setShowSubMenu(true);
  };

  const handleClickParentCate = (item) => {
    setShowSubMenu(false);
    setShowAllCate(false);
    navigate(`/category/${item.slug}`);
  };

  const [valueSearch, setValueSearch] = useState("");
  const [posts, setPosts] = useState([]);
  const [loadingValueSearch, setLoadingValueSearch] = useState(false);

  useEffect(() => {
    if (valueSearch && valueSearch.length > 0) {
      const colRef = collection(db, "posts");
      setLoadingValueSearch(true);

      onSnapshot(colRef, (snapshot) => {
        let result = [];
        snapshot.forEach((doc) => {
          result.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        const postSearch =
          valueSearch &&
          result.filter((item) =>
            item.title.toLowerCase().includes(valueSearch.toLowerCase())
          );

        setLoadingValueSearch(false);
        setPosts(postSearch);
      });
    }
  }, [setShow, valueSearch]);

  const handleSearchPosts = debounce((e) => {
    if (e.target.value.length > 0) {
      setShow(true);
    } else {
      setShow(false);
    }
    setValueSearch(e.target.value);
  }, 500);

  const handleOnClickOutside = () => {
    setShow(false);
  };

  return (
    <>
      <header className={cx("header")}>
        <div style={{ borderBottom: "1px solid #e5e5e5" }}>
          <div className={cx("container")}>
            <div className={cx("header-main")}>
              <div className={cx("menu-left")}>
                <div className={cx("logo")}>
                  <Link onClick={() => handleClickParentCate()} to="/">
                    <img src={images.logo} alt="" />
                  </Link>
                </div>
                <ul className={cx("menu")}>
                  {menuLinks.map((item, index) => (
                    <li className={cx("menu-item")} key={index}>
                      <Link to={item.url}>{item.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={cx("menu-right")}>
                <div className={cx("box-search")}>
                  <HeadLessTippy
                    appendTo={() => document.body}
                    delay={[0, 800]}
                    offset={[14, 10]}
                    visible={show}
                    onClickOutside={handleOnClickOutside}
                    placement="bottom-start"
                    interactive
                    render={(attrs) => (
                      <div tabIndex="-1" {...attrs}>
                        <div className={cx("info-search")}>
                          {loadingValueSearch ? (
                            <Loading className={cx("border-loading")}></Loading>
                          ) : posts.length > 0 ? (
                            posts.slice(0, 6).map((item) => (
                              <Link key={item.id} to={`/${item.slug}`}>
                                <p className={cx("results")}>{item.title}</p>
                              </Link>
                            ))
                          ) : (
                            <p className={cx("no-results")}>
                              Không tìm thấy bài viết
                            </p>
                          )}
                          {posts.length > 0 && (
                            <Link to={`/search/${valueSearch}`}>
                              <p className={cx("see-all")}>
                                Xem tất cả {posts.length} bài viết được tìm thấy
                              </p>
                            </Link>
                          )}
                        </div>
                      </div>
                    )}
                  >
                    <div className={cx("search")}>
                      <input
                        onChange={(e) => handleSearchPosts(e)}
                        onFocus={() => valueSearch.length > 0 && setShow(true)}
                        type="text"
                        placeholder="Tìm kiếm..."
                      />
                      <FontAwesomeIcon
                        className={cx("icon")}
                        icon={faMagnifyingGlass}
                      ></FontAwesomeIcon>
                    </div>
                  </HeadLessTippy>
                </div>
                {!userInfo ? (
                  <>
                    <Link to="/sign-in">
                      <Button
                        type="button"
                        className={cx(
                          "btn-sign-up",
                          "bg-color-primary",
                          "size-btn"
                        )}
                      >
                        Đăng nhập
                      </Button>
                    </Link>
                    <Link to="/sign-in">
                      <Button
                        type="button"
                        className={cx("btn-sign-up-mobile", "bg-color-primary")}
                      >
                        <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/dashboard">
                      <Button
                        type="button"
                        className={cx("btn-sign-dashboard", "bg-color-primary")}
                      >
                        Dashboard
                      </Button>
                    </Link>
                    <HeadLessTippy
                      delay={[0, 800]}
                      offset={[14, 10]}
                      placement="bottom-start"
                      interactive
                      render={(attrs) => (
                        <div tabIndex="-1" {...attrs}>
                          <div
                            className={cx("logout")}
                            onClick={() => handleLogout()}
                          >
                            Đăng xuất
                          </div>
                        </div>
                      )}
                    >
                      <div className={cx("user")}>
                        <strong>Xin chào,</strong>
                        <span> {getLastName(userInfo?.displayName)}</span>
                      </div>
                    </HeadLessTippy>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      <header className={cx("header-cate")} ref={refSticky}>
        <div
          style={{
            borderBottom: "1px solid #e5e5e5",
          }}
        >
          <div className={cx("container-cate")}>
            <div className={cx("header-category")}>
              <div className={cx("box-icon-cate")}>
                <Link to="/">
                  <FontAwesomeIcon
                    className={cx("icon-cate")}
                    icon={faHome}
                  ></FontAwesomeIcon>
                </Link>
              </div>

              <div className={cx("box-ul")}>
                <ul className={cx("cate-list")}>
                  {categories.length > 0 &&
                    categories.slice(0, 13).map((item) => (
                      <div key={item.id}>
                        <HeadLessTippy
                          delay={[0, 0]}
                          placement="bottom-start"
                          interactive
                          // visible
                          // hideOnClick={item.id === id}
                          render={(attrs) => (
                            <ul
                              className={cx("menu-list-cate")}
                              tabIndex="-1"
                              {...attrs}
                            >
                              {item.id === id &&
                                menuCate.length > 0 &&
                                // eslint-disable-next-line array-callback-return
                                menuCate.map(
                                  (itemChildren) =>
                                    itemChildren.createAt !== null && (
                                      <li
                                        key={itemChildren.id}
                                        className={cx("menu-item-cate")}
                                      >
                                        <Link
                                          to={`/category/${item.slug}/${itemChildren.slug}`}
                                        >
                                          {itemChildren?.name}
                                        </Link>
                                      </li>
                                    )
                                )}
                            </ul>
                          )}
                        >
                          <li
                            className={cx(
                              "cate-item",
                              showAllCate && "color-cate-item"
                            )}
                            onMouseOver={() => handleOnMouseOver(item)}
                          >
                            <NavLink
                              className={active}
                              onClick={() => handleClickParentCate(item)}
                              style={{ padding: "16px 0", display: "block" }}
                              to={`/category/${item.slug}`}
                            >
                              {item.name}
                            </NavLink>
                          </li>
                        </HeadLessTippy>
                      </div>
                    ))}
                </ul>
                {/* </Tippy> */}
              </div>

              <p
                className={cx("all-cate", showAllCate && "active-all-cate")}
                onClick={() => handleShowAll()}
              >
                Tất cả
                <FontAwesomeIcon
                  style={{ fontSize: "16px" }}
                  icon={faBars}
                ></FontAwesomeIcon>
              </p>
            </div>
          </div>
        </div>
        {showAllCate && showSubMenu && (
          <ShowAllCate
            setShowSubMenu={setShowSubMenu}
            setShowAllCate={setShowAllCate}
          ></ShowAllCate>
        )}
      </header>
    </>
  );
};

export default Header;
