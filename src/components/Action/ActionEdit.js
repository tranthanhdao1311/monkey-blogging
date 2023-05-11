import React from "react";
import classNames from "classnames/bind";
import styles from "./ActionStyle.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
const cx = classNames.bind(styles);

const ActionEdit = ({ onClick = () => {} }) => {
  return (
    <span className={cx("span-icon")} onClick={onClick}>
      <FontAwesomeIcon icon={faPenToSquare}></FontAwesomeIcon>
    </span>
  );
};

export default ActionEdit;
