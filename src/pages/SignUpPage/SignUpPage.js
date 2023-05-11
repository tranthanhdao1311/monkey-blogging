import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./SignUpPage.module.scss";
import { Link, useNavigate } from "react-router-dom";
import Label from "../../components/label/Label";
import Input from "../../components/input/Input";
import { useForm } from "react-hook-form";
import Button from "../../button/Button";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../../firebase/firebase-config";
import {
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import InputTogglePassword from "../../components/input/InputTogglePassword";
import images from "../../asset/image";
import { statusAddUser, statusRoleUser } from "../../configStatus";

const cx = classNames.bind(styles);

const schema = yup.object({
  fullname: yup.string().required("Please enter your fullname"),
  email: yup
    .string()
    .email("Please enter valid email address")
    .required("Please enter your email"),
  password: yup
    .string()
    .min(8, "Your password must be at least 8 characters or greater")
    .required("Please enter your password"),
});

const SignUpPage = () => {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({ mode: "onSubmit", resolver: yupResolver(schema) });

  const handleSignUp = async (values) => {
    if (!isValid) return;
    console.log(values);
    await createUserWithEmailAndPassword(auth, values.email, values.password);
    await updateProfile(auth.currentUser, {
      displayName: values.username,
      photoURL: images.logo,
    });

    toast.success("Create user successfully!");
    // const colRef = collection(db, "users");
    await setDoc(doc(db, "users", auth.currentUser.uid), {
      image: images.logo,
      fullname: values.fullname,
      username: values.username,
      email: values.email,
      password: values.password,
      status: statusAddUser.APPROVED,
      role: statusRoleUser.USER,
      desc: "",
      createdAt: serverTimestamp(),
    });

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

  return (
    <form className={cx("form-sign-up")} onSubmit={handleSubmit(handleSignUp)}>
      <div className={cx("field")}>
        <Label className={cx("label")} htmlFor="fullname">
          Fullname
        </Label>
        <Input
          name="fullname"
          type="text"
          placeholder="Enter your fullname"
          className={cx("input")}
          control={control}
        ></Input>
      </div>
      <div className={cx("field")}>
        <Label className={cx("label")} htmlFor="username">
          Username
        </Label>
        <Input
          name="username"
          type="text"
          placeholder="Enter your username"
          className={cx("input")}
          control={control}
        ></Input>
      </div>
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
      <div className={cx("have-account")}>
        <p>You already have an account? </p>
        <Link to="/sign-in"> Login</Link>
      </div>
      <div className={cx("btn-submit")}>
        <Button
          type="submit"
          className={cx("btn-sign-up", "bg-color-primary", "size-btn")}
          disabled={isSubmitting}
          isLoading={isSubmitting}
        >
          Sign Up
        </Button>
      </div>
    </form>
  );
};

export default SignUpPage;
