import React from "react";
import classNames from "classnames/bind";
import styles from "./PostCategory.module.scss";
import { Link } from "react-router-dom";
const cx = classNames.bind(styles);
const PostCategory = ({ children, className = "bg-primary", to = "" }) => {
  return (
    <Link to={`/category/${to}`} className={cx("post-category", className)}>
      {children}
    </Link>
  );
};

export default PostCategory;
