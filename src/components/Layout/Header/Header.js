import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import images from "../../../asset/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  faBars,
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
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import ShowAllCate from "../../ShowAllCate/ShowAllCate";
import stickybits from "stickybits";
import { useRef } from "react";

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
                <div className={cx("search")}>
                  <input type="text" placeholder="Tìm kiếm..." />
                  <FontAwesomeIcon
                    className={cx("icon")}
                    icon={faMagnifyingGlass}
                  ></FontAwesomeIcon>
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
                    <HeadLessTippy
                      delay={[0, 800]}
                      offset={[14, 10]}
                      interactive
                      render={(attrs) => (
                        <div tabIndex="-1" {...attrs} className="logout">
                          <div onClick={() => handleLogout()}>Đăng xuất</div>
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
                    categories.map((item) => (
                      <div key={item.id}>
                        <HeadLessTippy
                          delay={[0, 0]}
                          placement="bottom-start"
                          offset={[14, 10]}
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
