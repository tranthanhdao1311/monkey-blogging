import React, { useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./DashboardHeader.module.scss";
import { Link, useNavigate } from "react-router-dom";
import images from "../../../asset/image";
import Button from "../../../button/Button";
import { useAuth } from "../../../context/auth-context";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebase-config";
import { useState } from "react";
import useRoleUser from "../../../hook/useRoleUser";
import { statusRoleUser } from "../../../configStatus";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useToggleSideBar } from "../../../context/dashboard-context";

const cx = classNames.bind(styles);
const DashboardHeader = () => {
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const [imageUser, setImageUser] = useState("");
  useEffect(() => {
    async function getData() {
      const docRef = doc(db, "users", userInfo.uid);
      const getRef = await getDoc(docRef);
      setImageUser(getRef.data()?.image);
    }
    getData();
  }, [userInfo]);

  const { roleUserId } = useRoleUser();
  function handleClick() {
    if (roleUserId === statusRoleUser.USER) {
      toast.warning("You do not have permission to edit the post");
    } else {
      navigate("/add-post");
    }
  }

  const { setShow } = useToggleSideBar();
  const handleToggleSideBar = () => {
    setShow((prev) => !prev);
  };

  return (
    <header className={cx("header")}>
      <Link className={cx("logo")} to="/">
        <img className={cx("img-logo")} src={images.logo} alt="" />

        <span>Monkey Blogging</span>
      </Link>
      <div className={cx("bars-mobile")}>
        <FontAwesomeIcon
          onClick={() => handleToggleSideBar()}
          className={cx("bars-icon")}
          icon={faBars}
        ></FontAwesomeIcon>
      </div>
      <div className={cx("header-middle")}>
        <Button
          onClick={handleClick}
          className={cx("btn-new-post-mobile")}
          type="button"
        >
          Thêm bài viết
        </Button>
      </div>

      <div className={cx("header-right")}>
        <Button
          onClick={handleClick}
          className={cx("btn-new-post")}
          type="button"
        >
          Thêm bài viết
        </Button>
        <Link to="/manage/update-profile" className={cx("header-avt")}>
          <img src={imageUser} alt="" />
        </Link>
      </div>
    </header>
  );
};

export default DashboardHeader;
