import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./SidebarDashboard.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faBookOpen,
  faBoxArchive,
  faFlag,
  faTableCellsLarge,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase/firebase-config";
import { useToggleSideBar } from "../../../context/dashboard-context";

const cx = classNames.bind(styles);

const sidebarItems = [
  {
    title: "Dashboard",
    icon: <FontAwesomeIcon icon={faTableCellsLarge}></FontAwesomeIcon>,
    to: "/dashboard",
  },
  {
    title: "Danh sách bài viết",
    icon: <FontAwesomeIcon icon={faBookOpen}></FontAwesomeIcon>,
    to: "/manage/post",
  },
  {
    title: "Danh mục",
    icon: <FontAwesomeIcon icon={faBoxArchive}></FontAwesomeIcon>,
    to: "/manage/category",
  },
  {
    title: "Người dùng",
    icon: <FontAwesomeIcon icon={faUsers}></FontAwesomeIcon>,

    to: "/manage/user",
  },
];

const SidebarDashboard = () => {
  const active = ({ isActive }) => (isActive ? cx("active") : "");

  const navigate = useNavigate();
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const { setShow } = useToggleSideBar();

  const handleClickItem = () => {
    setShow(false);
  };

  return (
    <>
      <div className={cx("sidebar-list")}>
        {sidebarItems.map((item, index) => (
          <NavLink
            className={active}
            to={item.to}
            key={index}
            onClick={handleClickItem}
          >
            <div className={cx("item-sidebar")}>
              <div className={cx("item-link")}>
                <p>{item.icon}</p>
                <p>{item.title}</p>
              </div>
            </div>
          </NavLink>
        ))}

        <div className={cx("item-sidebar")}>
          <div className={cx("item-link")} onClick={handleLogout}>
            <p>
              <FontAwesomeIcon icon={faArrowRightFromBracket}></FontAwesomeIcon>
            </p>
            <p>Đăng xuất</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarDashboard;
