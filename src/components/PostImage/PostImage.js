import React from "react";
import { Link } from "react-router-dom";
import "./PostImage.module.scss";
import classNames from "classnames/bind";
import styles from "./PostImage.module.scss";

const cx = classNames.bind(styles);
const PostImage = ({ url = "", alt = "", className = "", to = "" }) => {
  if (to) {
    return (
      <Link to={`/${to}`}>
        <img
          src={url}
          alt={alt}
          className={cx("img", className)}
          loading="lazy"
        />
      </Link>
    );
  }
  return (
    <>
      <img
        src={url}
        alt={alt}
        className={cx("img", className)}
        loading="lazy"
      />
    </>
  );
};

export default PostImage;
