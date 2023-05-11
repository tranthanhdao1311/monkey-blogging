import React from "react";
import classNames from "classnames/bind";
import styles from "./Radio.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { useController } from "react-hook-form";

const cx = classNames.bind(styles);

const Radio = ({ checked, children, control, name, ...rest }) => {
  const { field } = useController({
    control,
    name,
    defaultValue: "",
  });

  return (
    <label className={cx("radio")}>
      <input
        checked={checked}
        type="radio"
        className={cx("hidden")}
        // onClick={onClick}
        {...field}
        {...rest}
      />
      <div className={cx("custom-radio")}>
        {checked ? (
          <FontAwesomeIcon
            style={{ color: "white" }}
            icon={faCheck}
          ></FontAwesomeIcon>
        ) : (
          ""
        )}
      </div>
      <p>{children}</p>
    </label>
  );
};

export default Radio;
