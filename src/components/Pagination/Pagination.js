import React from "react";
import classNames from "classnames/bind";
import styles from "./Pagination.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
const cx = classNames.bind(styles);

const Pagination = () => {
  return (
    <div className={cx("pagination")}>
      <FontAwesomeIcon icon={faChevronLeft}></FontAwesomeIcon>
      <ul className={cx("pagination-list")}>
        <li className={cx("pagination-item", "active")}>1</li>
        <li className={cx("pagination-item")}>2</li>
        <li className={cx("pagination-item")}>3</li>
        <li className={cx("pagination-item")}>...</li>
        <li className={cx("pagination-item")}>4</li>
        <li className={cx("pagination-item")}>5</li>
      </ul>
      <FontAwesomeIcon icon={faChevronRight}></FontAwesomeIcon>
    </div>
  );
};

export default Pagination;
