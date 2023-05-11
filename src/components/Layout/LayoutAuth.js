import React from "react";
import classNames from "classnames/bind";
import styles from "./LayoutAuth.module.scss";
import { Link } from "react-router-dom";
import images from "../../asset/image";

const cx = classNames.bind(styles);

const LayoutAuth = ({ children }) => {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("logo")}>
          <Link to="/">
            <img src={images.logo} alt="monkey-blogging" />
          </Link>
        </div>
        <h1 className={cx("title")}>Monkey Blogging</h1>
        {children}
      </div>
    </div>
  );
};

export default LayoutAuth;
