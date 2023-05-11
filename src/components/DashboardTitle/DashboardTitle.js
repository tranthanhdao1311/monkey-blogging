import React from "react";
import classNames from "classnames/bind";
import styles from "./DashboardTitle.module.scss";

const cx = classNames.bind(styles);

const DashboardTitle = ({ title, desc }) => {
  return (
    <div className={cx("heading")}>
      <h2 className={cx("title-add-post")}>{title}</h2>
      <span className={cx("desc-title")}>{desc}</span>
    </div>
  );
};

export default DashboardTitle;
