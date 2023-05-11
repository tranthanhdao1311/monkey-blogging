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
        className={children ? cx("style-new") : cx("input", className)}
        type={type}
        placeholder={placeholder}
        {...field}
        {...props}
      ></textarea>

      {children}
    </div>
  );
};

export default TextArea;
