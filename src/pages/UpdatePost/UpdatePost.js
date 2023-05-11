import React from "react";
import classNames from "classnames/bind";
import styles from "./UpdatePost.module.scss";
import { useNavigate, useSearchParams } from "react-router-dom";
import DashboardTitle from "../../components/DashboardTitle/DashboardTitle";
import { useForm } from "react-hook-form";
import Label from "../../components/label/Label";
import Input from "../../components/input/Input";
import ImageUpload from "../../components/ImageUpload/ImageUpload";
import useFirebaseImage from "../../hook/useFirebaseImage";
import { Dropdown } from "../../components/Dropdown";
import { useState } from "react";
import { useEffect } from "react";
import parse from "html-react-parser";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import { statusAddPost } from "../../configStatus";
import slugify from "slugify";
import { toast } from "react-toastify";
import Toggle from "../../components/Toggle/Toggle";
import Radio from "../../components/Radio/Radio";
import Button from "../../button/Button";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageUploader from "quill-image-uploader";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import NotFoundPage from "../NotFoundPage/NotFoundPage";
import { useAuth } from "../../context/auth-context";

const cx = classNames.bind(styles);

const modules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"],
    ["blockquote"],
    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: "ordered" }, { list: "bullet" }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["link", "image"],
  ],
};

const UpdatePost = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const postId = params.get("id");
  const [content, setContent] = useState("");
  const { userInfo } = useAuth();
  const [idUserPost, setIdUserPost] = useState();

  const schema = yup.object().shape({
    title: yup.string().required("Please enter your title"),
    image: yup.string().required("File is required"),
    category: yup.object({
      name: yup.string().required("Please select category"),
    }),
    // content: yup.string().required("Please enter your content").nullable(),
  });

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isValid, isSubmitting },
    watch,
    reset,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const imageUrl = getValues("image");
  const imageRegex = /%2F(\S+)\?/gm.exec(imageUrl);
  const image_name = imageRegex?.length > 0 ? imageRegex[1] : "";

  async function handleDeleteAvatar() {
    const docRef = doc(db, "posts", postId);
    await updateDoc(docRef, {
      image: "",
    });
  }

  useEffect(() => {
    async function fetch() {
      const docRefPostId = doc(db, "posts", postId);
      const get = await getDoc(docRefPostId);
      setIdUserPost(get.data()?.user.id);
      reset(get.data());
      setContent(get?.data()?.content || "");
      setLabel(get.data()?.category?.name || "");
    }

    fetch();
  }, [postId, reset]);

  const watchStatus = watch("status");
  const watchFeaturePost = watch("featurePost");
  const watchBannerPost = watch("bannerPost");

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
  }, [setImage, imageUrl]);

  useEffect(() => {
    const arrError = Object.values(errors);
    if (arrError.length > 0) {
      toast.error(arrError[0]?.message || arrError[0]?.name.message, {
        pauseOnHover: false,
      });
    }
  }, [errors]);
  const handleUpdatepost = async (values) => {
    if (!isValid) return;

    if (idUserPost !== userInfo.uid) {
      toast.warning(`Can't edit because you're not the author`);
    } else {
      try {
        values.slug = slugify(values.slug || values.title, { lower: true });
        const docRef = doc(db, "posts", postId);
        await updateDoc(docRef, {
          title: values.title,
          slug: values.slug,
          category: values.category,
          featurePost: values.featurePost,
          bannerPost: values.bannerPost,
          status: Number(values.status),
          image: image,
          content,
        });

        handleUploadImage(values.image);
        toast.success("Update post successfully!");
        navigate("/manage/post");
      } catch (error) {
      } finally {
      }
    }
  };

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    async function getData() {
      const colRef = collection(db, "categories");
      const q = query(colRef, where("status", "==", 1));
      const querySnapshot = await getDocs(q);
      let arr = [];

      querySnapshot.forEach((doc) => {
        arr.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setCategories(arr);
    }
    getData();
  }, []);

  const [label, setLabel] = useState("");

  const handleSelectCategory = async (item) => {
    const docRef = doc(db, "categories", item.id);
    const docData = await getDoc(docRef);
    setValue("category", {
      id: docData.id,
      ...docData.data(),
    });
    setLabel(item.name);
  };
  if (!postId) return <NotFoundPage></NotFoundPage>;
  return (
    <div>
      <DashboardTitle
        title="Cập nhật bài viết"
        desc={`Cập nhật bài viết có id: ${postId}`}
      ></DashboardTitle>
      <form
        className={cx("add-post")}
        onSubmit={handleSubmit(handleUpdatepost)}
      >
        <div className={cx("form-layout")}>
          <div className={cx("input")}>
            <Label htmlFor="title">Tên bài viết</Label>
            <Input
              name="title"
              id="title"
              type="text"
              control={control}
              placeholder="Enter your title"
              className={cx("width-input")}
            ></Input>
          </div>
          <div className={cx("input")}>
            <Label htmlFor="slug">Slug</Label>
            <Input
              name="slug"
              id="slug"
              type="text"
              control={control}
              placeholder="Enter your slug"
              className={cx("width-input")}
            ></Input>
          </div>
        </div>
        {/*  */}
        <div className={cx("form-layout")}>
          <div className={cx("input")}>
            <Label>Hình ảnh</Label>
            <ImageUpload
              progress={progress}
              onChange={onSelectImage}
              name="image"
              id="image"
              image={image}
              control={control}
              handleDeleteImage={handleDeleteImage}
            ></ImageUpload>
          </div>
          <div className={cx("input")}>
            <Label htmlFor="catrgoryId">Danh mục</Label>
            <Dropdown control={control} name="categoryId">
              <Dropdown.SelectDropdown
                placeholder={label || "Please select an option"}
              ></Dropdown.SelectDropdown>
              <Dropdown.List>
                {categories.map((item) => (
                  <Dropdown.Option
                    key={item.id}
                    className={cx("dropdown-item")}
                    onClick={() => handleSelectCategory(item)}
                  >
                    {item.name}
                  </Dropdown.Option>
                ))}
              </Dropdown.List>
            </Dropdown>
          </div>
        </div>
        <div className={cx("form-content")}>
          <Label className={cx("label-content-margin")}>Nội dung</Label>
          <div className={cx("entry-content")}>
            <ReactQuill
              modules={modules}
              theme="snow"
              value={content}
              onChange={setContent}
            />
          </div>
        </div>

        {/*  */}
        <div className={cx("form-layout")}>
          <div className={cx("input")}>
            <div className={cx("toggle-hide")}>
              <div>
                <Label>Nổi bật</Label>

                <Toggle
                  on={watchFeaturePost === true}
                  onClick={() => {
                    setValue("featurePost", !watchFeaturePost);
                  }}
                ></Toggle>
              </div>
              <div>
                <Label>Slider</Label>

                <Toggle
                  on={watchBannerPost === true}
                  onClick={() => {
                    setValue("bannerPost", !watchBannerPost);
                  }}
                ></Toggle>
              </div>
            </div>
          </div>
          <div className={cx("input")}>
            <Label htmlFor="status">Trạng thái</Label>
            <div className={cx("box-radio")}>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === statusAddPost.APPROVED}
                // onClick={() => setValue("status", statusAddPost.APPROVED)}
                value={statusAddPost.APPROVED}
              >
                Duyệt
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === statusAddPost.PENDING}
                // onClick={() => setValue("status", statusAddPost.PENDING)}
                value={statusAddPost.PENDING}
              >
                Đang duyệt
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === statusAddPost.REJECT}
                // onClick={() => setValue("status", statusAddPost.REJECT)}
                value={statusAddPost.REJECT}
              >
                Từ chối
              </Radio>
            </div>
          </div>
        </div>

        {/*  */}
        <div className={cx("wrapper-btn-add")}>
          <Button
            className={cx("btn-add-post")}
            type="submit"
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

export default UpdatePost;
