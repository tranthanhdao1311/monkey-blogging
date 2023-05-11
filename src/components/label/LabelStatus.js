import React from "react";
import classNames from "classnames/bind";
import styles from "./LabelStatus.module.scss";
const cx = classNames.bind(styles);

const LabelStatus = ({ children, type = "default" }) => {
  //   switch (type) {
  //     case "success":
  //       return (type = "success");
  //     case "warning":
  //       return (type = "warning");
  //     case "danger":
  //       return (type = "danger");
  //     default:
  //       break;
  //   }
  return <div className={cx("label-status", type)}>{children}</div>;
};

export default LabelStatus;
