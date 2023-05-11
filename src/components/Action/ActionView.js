import React from "react";
import classNames from "classnames/bind";
import styles from "./ActionStyle.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
const cx = classNames.bind(styles);

const ActionView = ({ onClick = () => {} }) => {
  return (
    <span className={cx("span-icon")} onClick={onClick}>
      <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
    </span>
  );
};

export default ActionView;
