import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useDropdown } from "./dropdown-context";
import classNames from "classnames/bind";
import styles from "./SelectDropdown.module.scss";
const cx = classNames.bind(styles);

const SelectDropdown = ({ control, placeholder = "", className }) => {
  const { handleToggleDropdown, show } = useDropdown();

  return (
    <div className={cx("dropdown", className)}>
      <div
        className={cx("category")}
        control={control}
        onClick={handleToggleDropdown}
        name="category"
      >
        <span>{placeholder}</span>
        <span>
          {show ? (
            <FontAwesomeIcon
              className={cx("icon")}
              icon={faChevronDown}
            ></FontAwesomeIcon>
          ) : (
            <FontAwesomeIcon
              className={cx("icon")}
              icon={faChevronUp}
            ></FontAwesomeIcon>
          )}
        </span>
      </div>
    </div>
  );
};

export default SelectDropdown;
