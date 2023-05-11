import React from "react";
import classNames from "classnames/bind";
import styles from "./List.module.scss";
import { useDropdown } from "./dropdown-context";
const cx = classNames.bind(styles);
const List = ({ children, className }) => {
  const { show } = useDropdown();
  return (
    <div className={cx("dropdown-menu", className)}>
      {show && (
        <div className={cx("dropdown-list")}>
          {/* {categories.map((item) => (
              <div
                key={item.id}
                className={cx("dropdown-item")}
                data-value={item.name}
                onClick={handleClickDropdownItem}
              >
                {item.name}
              </div>
            ))} */}
          {children}
        </div>
      )}
    </div>
  );
};

export default List;
