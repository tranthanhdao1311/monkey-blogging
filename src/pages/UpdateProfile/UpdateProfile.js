import React from "react";
import classNames from "classnames/bind";
import styles from "./UpdateProfile.module.scss";
import DashboardTitle from "../../components/DashboardTitle/DashboardTitle";
import { useForm } from "react-hook-form";
import ImageUpload from "../../components/ImageUpload/ImageUpload";
import useFirebaseImage from "../../hook/useFirebaseImage";
import Button from "../../button/Button";
import Label from "../../components/label/Label";
import Input from "../../components/input/Input";
import { statusRoleUser } from "../../configStatus";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase-config";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import InputTogglePassword from "../../components/input/InputTogglePassword";
import useRoleUser from "../../hook/useRoleUser";
import TextArea from "../../components/textarea/TextArea";
import { useAuth } from "../../context/auth-context";
import { sendPasswordResetEmail, updatePassword } from "firebase/auth";
import { useToggleSideBar } from "../../context/dashboard-context";
const cx = classNames.bind(styles);
const UpdateProfile = () => {
  const navigate = useNavigate();
  const { userInfo } = useAuth();

  const { roleUserId } = useRoleUser();
  const { setShow } = useToggleSideBar();
  useEffect(() => {
    setShow(false);
  }, [setShow]);
  const {
    control,
    setValue,
    getValues,
    handleSubmit,
    reset,
    formState: { isValid, isSubmitting },
  } = useForm({
    mode: "onChange",
  });

  useEffect(() => {
    async function getData() {
      if (!userInfo) return;
      const docRef = doc(db, "users", userInfo.uid);
      const get = await getDoc(docRef);
      reset(get && get.data());
    }
    getData();
  }, [userInfo, reset]);

  const imageUrl = getValues("image");
  const regex = /%2F(\S+)\?/gm.exec(imageUrl);
  const image_name = regex?.length > 0 ? regex[1] : "";

  async function handleDeleteAvatar() {
    const docRef = doc(db, "users", userInfo.uid);
    await updateDoc(docRef, {
      image: "",
    });
  }

  const {
    progress,
    image,
    setImage,
    handleUploadImage,
    onSelectImage,
    handleDeleteImage,
  } = useFirebaseImage(setValue, getValues, image_name, handleDeleteAvatar);

  useEffect(() => {
    setImage(imageUrl);
  }, [imageUrl, setImage]);

  const handleUpdateProfile = async (values) => {
    if (roleUserId !== statusRoleUser.ADMIN) {
      toast.warning("You do not have permission to edit users");
    } else {
      console.log(values);
      if (!isValid) return;
      handleUploadImage(values.image);

      await updateDoc(doc(db, "users", userInfo.uid), {
        image: image,
        fullname: values.fullname,
        username: values.username,
        email: values.email,
        password: values.password,
        status: Number(values.status),
        role: Number(values.role),
        desc: values.desc,
      });

      sendPasswordResetEmail(auth, values.email).then(() => {
        console.log("send password successfully");
      });

      toast.success("Update user successfully!");
      navigate("/manage/user");
    }
  };

  return (
    <div>
      <DashboardTitle
        title="Update profile"
        desc={`Update profile id: ${userInfo.uid} to system`}
      ></DashboardTitle>
      <form onSubmit={handleSubmit(handleUpdateProfile)}>
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
            <Label htmlFor="password">Password</Label>
            <InputTogglePassword control={control}></InputTogglePassword>
          </div>
          <div className={cx("input")}>
            <Label htmlFor="newpassword">New password</Label>
            <InputTogglePassword
              name="newpassword"
              control={control}
            ></InputTogglePassword>
          </div>
        </div>
        <div className={cx("form-layout")}>
          <div className={cx("input")}>
            <Label htmlFor="confirmpassword">Confirm password</Label>
            <InputTogglePassword
              name="confirmpassword"
              control={control}
            ></InputTogglePassword>
          </div>
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

        <div className={cx("btn-add-user")}>
          <Button
            type="submit"
            className={cx("btn")}
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            Update profile
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;
