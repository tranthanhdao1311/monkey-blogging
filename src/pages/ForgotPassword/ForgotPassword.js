import React from "react";
import { useForm } from "react-hook-form";
import classNames from "classnames/bind";
import styles from "./ForgotPassword.module.scss";
import Label from "../../components/label/Label";
import Input from "../../components/input/Input";
import Button from "../../button/Button";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase/firebase-config";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const cx = classNames.bind(styles);

const ForgotPassword = () => {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({ mode: "onChange" });
  const handleSendPassword = (values) => {
    sendPasswordResetEmail(auth, values.email).then(() => {
      Swal.fire(
        "Success!",
        `Send password reset email successfully!`,
        "success"
      );
    });
  };
  return (
    <form
      className={cx("form-sign-up")}
      onSubmit={handleSubmit(handleSendPassword)}
    >
      <div className={cx("field")}>
        <Label className={cx("label")} htmlFor="email">
          Email address
        </Label>
        <Input
          className={cx("input")}
          type="email"
          name="email"
          placeholder="Enter your email"
          control={control}
        ></Input>
      </div>
      <div className={cx("have-account")}>
        <p>You already have an account? </p>
        <Link to="/sign-in">Login</Link>
      </div>
      <div className={cx("btn-submit")}>
        <Button
          type="submit"
          className={cx("bg-color-primary", "size-btn")}
          disabled={isSubmitting}
          isLoading={isSubmitting}
        >
          Send
        </Button>
      </div>
    </form>
  );
};

export default ForgotPassword;
