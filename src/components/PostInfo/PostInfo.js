import React from "react";
import { Link } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./PostInfo.module.scss";
const cx = classNames.bind(styles);

const PostInfo = ({
  time = "Mar 23",
  unit = "",
  author = "Andiez Le",
  className,
  bgColorDot,
}) => {
  return (
    <div className={cx("date-author", className)}>
      <span className={cx("date")}>{time + " " + unit}</span>
      <span className={cx("dot", bgColorDot)}></span>
      <Link to="/author" className={cx("author")}>
        {author}
      </Link>
    </div>
  );
};

export default PostInfo;
