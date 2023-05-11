import React from "react";
import { useController } from "react-hook-form";
import classNames from "classnames/bind";
import styles from "./Input.module.scss";
import PropTypes from "prop-types";

const cx = classNames.bind(styles);

const Input = ({
  type = "text",
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
      <input
        autoComplete="off"
        icon={icon}
        className={children ? cx("style-new") : cx("input", className)}
        type={type}
        placeholder={placeholder}
        {...field}
        {...props}
      />

      {children}
    </div>
  );
};

Input.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  children: PropTypes.any,
  control: PropTypes.any.isRequired,
};

export default Input;
