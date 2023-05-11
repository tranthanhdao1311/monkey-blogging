import React from "react";
import classNames from "classnames/bind";
import styles from "./Button.module.scss";
import Loading from "../components/loading/Loading";
import PropTypes from "prop-types";

const cx = classNames.bind(styles);

const Button = ({
  children,
  type = "button",
  className,
  onClick,
  isLoading,
  ...props
}) => {
  const child = !!isLoading ? (
    <Loading className={cx("size-medium")}></Loading>
  ) : (
    children
  );
  return (
    <button
      type={type}
      className={cx("btn", className)}
      onClick={onClick}
      {...props}
    >
      {child}
    </button>
  );
};

Button.propTypes = {
  type: PropTypes.oneOf(["button", "submit"]).isRequired,
  isLoading: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node,
};

export default Button;
