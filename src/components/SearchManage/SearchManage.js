import React from "react";
import classNames from "classnames/bind";
import styles from "./SearchManage.module.scss";

const cx = classNames.bind(styles);

const SearchManage = ({ placeholder, onChange }) => {
  return (
    <div className={cx("search")}>
      <div className={cx("input-search")}>
        <input
          type="text"
          name="search"
          id="search"
          placeholder={placeholder}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default SearchManage;
