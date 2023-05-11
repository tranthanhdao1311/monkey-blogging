import React from "react";
import classNames from "classnames/bind";
import styles from "./Toggle.module.scss";
const cx = classNames.bind(styles);

const Toggle = (props) => {
  const { on, onClick, ...rest } = props;
  return (
    <label className={cx("label")}>
      <input
        type="checkbox"
        checked={on}
        className={cx("hidden")}
        onClick={onClick}
        onChange={() => {}}
      />
      <div className={cx("custom-checkbox", `${on ? "active" : ""}`)}>
        <span className={cx("spinner", `${on ? "active" : ""}`)}></span>
      </div>
    </label>
  );
};

export default Toggle;
