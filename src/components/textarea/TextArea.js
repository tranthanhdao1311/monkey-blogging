import React from "react";
import { useController } from "react-hook-form";
import classNames from "classnames/bind";
import styles from "./TextArea.module.scss";

const cx = classNames.bind(styles);

const TextArea = ({
  type,
  name,
  placeholder,
  control,
  icon,
  className,
  children,
  ...props
}) => {
  const { field } = useController({ control, name });

  return (
    <div className={cx("box-input")}>
      <textarea
        autoComplete="off"
        icon={icon}
        style={props.error && { border: "1px solid red !important" }}
        className={cx("input", className)}
        type={type}
        placeholder={placeholder}
        {...field}
        {...props}
      ></textarea>
      <p style={{ color: "red" }}>{props.error}</p>
    </div>
  );
};

export default TextArea;
