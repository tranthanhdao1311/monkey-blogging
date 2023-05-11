import React from "react";
import classNames from "classnames/bind";
import styles from "./LoadingSkeleton.module.scss";

const cx = classNames.bind(styles);
const LoadingSkeleton = (props) => {
  return (
    <div
      className={cx("skeleton")}
      style={{
        width: props.width,
        height: props.height,
        borderRadius: props.radius,
        margin: props.margin,
      }}
    ></div>
  );
};

export default LoadingSkeleton;
