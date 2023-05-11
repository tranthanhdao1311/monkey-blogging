import React from "react";
import classNames from "classnames/bind";
import styles from "./Loading.module.scss";

const cx = classNames.bind(styles);
const Loading = ({ className, size = "size-medium" }) => {
  return <div className={cx("loading", className, size)}></div>;
};

export default Loading;
