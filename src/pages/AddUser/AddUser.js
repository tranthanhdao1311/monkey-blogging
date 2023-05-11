import React from "react";
import classNames from "classnames/bind";
import styles from "./AddUser.module.scss";
import DashboardTitle from "../../components/DashboardTitle/DashboardTitle";
import { useForm } from "react-hook-form";
import ImageUpload from "../../components/ImageUpload/ImageUpload";
import useFirebaseImage from "../../hook/useFirebaseImage";
import Button from "../../button/Button";
import Label from "../../components/label/Label";
import Input from "../../components/input/Input";
import Radio from "../../components/Radio/Radio";
import { statusAddUser, statusRoleUser } from "../../configStatus";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../../firebase/firebase-config";
import { toast } from "react-toastify";
import InputTogglePassword from "../../components/input/InputTogglePassword";
import TextArea from "../../components/textarea/TextArea";

const cx = classNames.bind(styles);
const AddUser = () => {
  const {
    control,
    setValue,
    getValues,
    handleSubmit,
    watch,
    reset,
    formState: { isValid, isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      image: "",
      fullname: "",
      username: "",
      email: "",
      password: "",
      status: 2,
      role: "",
      desc: "",
      createdAt: new Date(),
    },
  });

  const {
    progress,
    image,
    setImage,
    handleUploadImage,
    onSelectImage,
    handleDeleteImage,
  } = useFirebaseImage(setValue, getValues);

  const handleAddUser = async (values) => {
    console.log(values);
    if (!isValid) return;
    handleUploadImage(values.image);
    await createUserWithEmailAndPassword(auth, values.email, values.password);
    await updateProfile(auth.currentUser, {
      displayName: values.username,
    });
    toast.success("Create user successfully!");
    await setDoc(doc(db, "users", auth.currentUser.uid), {
      image: image,
      fullname: values.fullname,
      username: values.username,
      email: values.email,
      password: values.password,
      status: Number(values.status),
      role: Number(values.role),
      desc: values.desc,
      createdAt: serverTimestamp(),
    });
    reset({
      image: "",
      fullname: "",
      username: "",
      email: "",
      password: "",
      status: 2,
      role: "",
      desc: "",
    });
    setImage("");
  };
  const watchStatus = watch("status");
  const watchRole = watch("role");

  return (
    <div>
      <DashboardTitle
        title="New user"
        desc="Add new user to system"
      ></DashboardTitle>
      <form onSubmit={handleSubmit(handleAddUser)}>
        <ImageUpload
          className={cx("image-upload")}
          name="image"
          id="image"
          progress={progress}
          onChange={onSelectImage}
          image={image}
          control={control}
          handleDeleteImage={handleDeleteImage}
        ></ImageUpload>
        <div className={cx("form-layout")}>
          <div className={cx("input")}>
            <Label htmlFor="fullname">Fullname</Label>
            <Input
              name="fullname"
              id="fullname"
              type="text"
              control={control}
              placeholder="Enter your fullname"
              className={cx("width-input")}
            ></Input>
          </div>
          <div className={cx("input")}>
            <Label htmlFor="username">Username</Label>
            <Input
              name="username"
              id="username"
              type="text"
              control={control}
              placeholder="Enter your username"
              className={cx("width-input")}
            ></Input>
          </div>
        </div>
        <div className={cx("form-layout")}>
          <div className={cx("input")}>
            <Label htmlFor="email">Email</Label>
            <Input
              name="email"
              id="email"
              type="email"
              control={control}
              placeholder="Enter your email"
              className={cx("width-input")}
            ></Input>
          </div>
          <div className={cx("input")}>
            <Label htmlFor="password">Password</Label>
            <InputTogglePassword control={control}></InputTogglePassword>
          </div>
        </div>

        <div className={cx("form-layout")}>
          <div className={cx("input")}>
            <Label htmlFor="desc">Description</Label>
            <TextArea
              name="desc"
              id="desc"
              type="text"
              control={control}
              className={cx("text-area")}
              placeholder="Enter your description"
            ></TextArea>
          </div>
        </div>
        <div className={cx("form-layout")}>
          <div className={cx("input")}>
            <Label htmlFor="status">Status</Label>
            <div className={cx("box-radio")}>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === statusAddUser.APPROVED}
                value={statusAddUser.APPROVED}
              >
                Approved
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === statusAddUser.PENDING}
                value={statusAddUser.PENDING}
              >
                Pending
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === statusAddUser.BANNED}
                value={statusAddUser.BANNED}
              >
                Banned
              </Radio>
            </div>
          </div>
          <div className={cx("input")}>
            <Label htmlFor="role">Role</Label>
            <div className={cx("box-radio")}>
              <Radio
                name="role"
                control={control}
                checked={Number(watchRole) === statusRoleUser.ADMIN}
                value={statusRoleUser.ADMIN}
              >
                Admin
              </Radio>
              <Radio
                name="role"
                control={control}
                checked={Number(watchRole) === statusRoleUser.MODERATOR}
                value={statusRoleUser.MODERATOR}
              >
                Moderator
              </Radio>
              <Radio
                name="role"
                control={control}
                checked={Number(watchRole) === statusRoleUser.USER}
                value={statusRoleUser.USER}
              >
                User
              </Radio>
            </div>
          </div>
        </div>
        <div className={cx("btn-add-user")}>
          <Button
            type="submit"
            className={cx("btn")}
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            Add new user
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddUser;
