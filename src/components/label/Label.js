import React from "react";
import classNames from "classnames/bind";
import styles from "./Label.module.scss";

const cx = classNames.bind(styles);

const Label = ({ htmlFor, className, children, ...props }) => {
  return (
    <label className={cx("title", className)} htmlFor={htmlFor} {...props}>
      {children}
    </label>
  );
};

export default Label;
