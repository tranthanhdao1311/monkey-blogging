import React from "react";
import classNames from "classnames/bind";
import styles from "./PostTitle.module.scss";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

const PostTitle = ({ children, className, to = "" }) => {
  return (
    <div className={cx("post-title", className)}>
      <Link to={`/${to}`}>{children}</Link>
    </div>
  );
};

export default PostTitle;
