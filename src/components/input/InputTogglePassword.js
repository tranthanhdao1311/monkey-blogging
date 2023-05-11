import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import Input from "./Input";
import classNames from "classnames/bind";
import PropTypes from "prop-types";
import styles from "./InputTogglePassword.module.scss";

const cx = classNames.bind(styles);
const InputTogglePassword = ({ control, name = "password" }) => {
  const [showPass, setShowPass] = useState(false);

  return (
    <>
      <Input
        className={cx("input")}
        type={showPass ? "text" : "password"}
        name={name}
        placeholder="Enter your password"
        control={control}
      >
        {!showPass ? (
          <FontAwesomeIcon
            className={cx("icon-eye")}
            icon={faEyeSlash}
            onClick={() => setShowPass(true)}
          ></FontAwesomeIcon>
        ) : (
          <FontAwesomeIcon
            className={cx("icon-eye")}
            icon={faEye}
            onClick={() => setShowPass(false)}
          ></FontAwesomeIcon>
        )}
      </Input>
    </>
  );
};

InputTogglePassword.propTypes = {
  name: PropTypes.string,
  control: PropTypes.any.isRequired,
};

export default InputTogglePassword;
