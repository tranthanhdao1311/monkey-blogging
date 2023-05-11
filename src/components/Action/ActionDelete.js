import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import classNames from "classnames/bind";
import styles from "./ActionStyle.module.scss";
const cx = classNames.bind(styles);

const ActionDelete = ({ onClick = () => {} }) => {
  return (
    <span className={cx("span-icon")} onClick={onClick}>
      <FontAwesomeIcon icon={faTrashCan}></FontAwesomeIcon>
    </span>
  );
};

export default ActionDelete;
