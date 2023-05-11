import React from "react";
import classNames from "classnames/bind";
import styles from "./UpdateUser.module.scss";
import DashboardTitle from "../../components/DashboardTitle/DashboardTitle";
import { useForm } from "react-hook-form";
import ImageUpload from "../../components/ImageUpload/ImageUpload";
import useFirebaseImage from "../../hook/useFirebaseImage";
import Button from "../../button/Button";
import Label from "../../components/label/Label";
import Input from "../../components/input/Input";
import Radio from "../../components/Radio/Radio";
import { statusAddUser, statusRoleUser } from "../../configStatus";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import InputTogglePassword from "../../components/input/InputTogglePassword";
import useRoleUser from "../../hook/useRoleUser";
import TextArea from "../../components/textarea/TextArea";

const cx = classNames.bind(styles);
const UpdateUser = () => {
  const [params] = useSearchParams();
  const userId = params.get("id");
  const navigate = useNavigate();

  const { roleUserId } = useRoleUser();
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
  });

  useEffect(() => {
    async function getData() {
      if (!userId) return;
      const docRef = doc(db, "users", userId);
      const get = await getDoc(docRef);
      reset(get && get.data());
    }
    getData();
  }, [userId, reset]);

  const imageUrl = getValues("image");
  const regex = /%2F(\S+)\?/gm.exec(imageUrl);
  const image_name = regex?.length > 0 ? regex[1] : "";

  async function handleDeleteAvatar() {
    const docRef = doc(db, "users", userId);
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

  const handleUpdateUser = async (values) => {
    if (roleUserId !== statusRoleUser.ADMIN) {
      toast.warning("You do not have permission to edit users");
    } else {
      console.log(values);
      if (!isValid) return;
      handleUploadImage(values.image);
      await updateDoc(doc(db, "users", userId), {
        image: image,
        fullname: values.fullname,
        username: values.username,
        email: values.email,
        password: values.password,
        status: Number(values.status),
        role: Number(values.role),
        desc: values.desc,
      });

      toast.success("Update user successfully!");
      navigate("/manage/user");
    }
  };

  const watchStatus = watch("status");
  const watchRole = watch("role");

  return (
    <div>
      <DashboardTitle
        title="Cập nhật thông tin người dùng"
        desc={`Cập nhật người dùng có email: ${userId} trong hệ thống`}
      ></DashboardTitle>
      <form onSubmit={handleSubmit(handleUpdateUser)}>
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
            <Label htmlFor="fullname">Họ và tên</Label>
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
            <Label htmlFor="username">Biệt danh</Label>
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
            <Label htmlFor="password">Mật khẩu</Label>
            <InputTogglePassword control={control}></InputTogglePassword>
          </div>
        </div>
        <div className={cx("form-layout")}>
          <div className={cx("input")}>
            <Label htmlFor="desc">Mô tả</Label>
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
            <Label htmlFor="status">Trạng thái</Label>
            <div className={cx("box-radio")}>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === statusAddUser.APPROVED}
                value={statusAddUser.APPROVED}
              >
                Duyệt
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === statusAddUser.PENDING}
                value={statusAddUser.PENDING}
              >
                Đang duyệt
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === statusAddUser.BANNED}
                value={statusAddUser.BANNED}
              >
                Từ chối
              </Radio>
            </div>
          </div>
          <div className={cx("input")}>
            <Label htmlFor="role">Quyền hạn</Label>
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
            Cập nhật
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateUser;
