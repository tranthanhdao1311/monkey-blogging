import React, { useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./SignInPage.module.scss";
import Label from "../../components/label/Label";
import Input from "../../components/input/Input";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../button/Button";
import { useAuth } from "../../context/auth-context";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../firebase/firebase-config";
import InputTogglePassword from "../../components/input/InputTogglePassword";
const cx = classNames.bind(styles);

const schema = yup.object({
  email: yup
    .string()
    .email("Please enter valid email address")
    .required("Please enter your email"),
  password: yup
    .string()
    .min(8, "Your password must be at least 8 characters or greater")
    .required("Please enter your password"),
});

const SignInPage = () => {
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  useEffect(() => {
    if (userInfo?.email) navigate("/");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({ mode: "onSubmit", resolver: yupResolver(schema) });

  const handleSignIn = async (values) => {
    console.log(values);
    if (!isValid) return;
    await signInWithEmailAndPassword(auth, values.email, values.password);
    navigate("/");
  };

  useEffect(() => {
    const arrError = Object.values(errors);
    if (arrError.length > 0) {
      for (let i = 0; i < arrError.length; i++) {
        const element = arrError[i];
        toast.error(element?.message, {
          pauseOnHover: false,
        });
      }
    }
  }, [errors]);

  const handleForgotPassword = (values) => {
    navigate("/forgot-password");
  };

  return (
    <form className={cx("form-sign-up")} onSubmit={handleSubmit(handleSignIn)}>
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
      <div className={cx("field")}>
        <Label className={cx("label")} htmlFor="password">
          Password
        </Label>
        <InputTogglePassword control={control}></InputTogglePassword>
      </div>
      <div className={cx("forgot-pass")} onClick={handleForgotPassword}>
        <p>Forgot password?</p>
      </div>
      <div className={cx("have-account")}>
        <p>You have not had an account? </p>
        <Link to="/sign-up">Register an account</Link>
      </div>
      <div className={cx("btn-submit")}>
        <Button
          type="submit"
          className={cx("bg-color-primary", "size-btn")}
          disabled={isSubmitting}
          isLoading={isSubmitting}
        >
          Sign In
        </Button>
      </div>
    </form>
  );
};

export default SignInPage;
