import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Addpost.module.scss";
import Label from "../../components/label/Label";
import Input from "../../components/input/Input";
import { useForm } from "react-hook-form";
import Button from "../../button/Button";
import { Dropdown } from "../../components/Dropdown";
import Radio from "../../components/Radio/Radio";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import slugify from "slugify";
import ImageUpload from "../../components/ImageUpload/ImageUpload";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import useFirebaseImage from "../../hook/useFirebaseImage";
import { useAuth } from "../../context/auth-context";
import Toggle from "../../components/Toggle/Toggle";
import DashboardTitle from "../../components/DashboardTitle/DashboardTitle";
import { statusAddPost } from "../../configStatus";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

const Addpost = () => {
  const [label, setLabel] = useState("");
  const [categories, setCategories] = useState([]);

  const schema = yup.object().shape({
    title: yup.string().required("Please enter your title"),
    image: yup.string().required("File is required"),
    category: yup.object({
      name: yup.string().required("Please select category"),
    }),
  });
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      title: "",
      slug: "",
      image: "",
      category: {},
      featurePost: false,
      bannerPost: false,
      attentionPost: false,
      desc: "",
      status: statusAddPost.PENDING,
      user: {},
      content: "",
    },

    resolver: yupResolver(schema),
  });
  const watchStatus = watch("status");
  const watchFeaturePost = watch("featurePost");
  const watchBannerPost = watch("bannerPost");
  const watchAttentionPost = watch("attentionPost");

  const {
    progress,
    image,
    setImage,
    handleUploadImage,
    onSelectImage,
    handleDeleteImage,
  } = useFirebaseImage(setValue, getValues);

  const [loading, setLoading] = useState(false);

  const handleAddpost = async (values) => {
    setLoading(true);

    try {
      values.slug = slugify(values.slug || values.title, { lower: true });
      console.log(values);
      const colRef = collection(db, "posts");
      await addDoc(colRef, {
        title: values.title,
        slug: values.slug,
        category: values.category,
        featurePost: values.featurePost,
        bannerPost: values.bannerPost,
        desc: values.desc,
        attentionPost: values.attentionPost,
        status: Number(values.status),
        image: image,
        user: values.user,
        createAt: serverTimestamp(),
      });

      handleUploadImage(values.image);
      toast.success("Add post new successfully!");
      reset({
        title: "",
        slug: "",
        image: "",
        category: {},
        desc: "",
        featurePost: false,
        bannerPost: false,
        AttentionPost: false,
        status: statusAddPost.PENDING,
        user: {},
      });
      setLabel(null);
      setImage("");
      navigate("/manage/post");
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function fetchDataUser() {
      if (!userInfo.uid) return;
      const docRef = doc(db, "users", userInfo.uid);
      const docData = await getDoc(docRef);
      setValue("user", {
        id: docData.id,
        ...docData.data(),
      });
    }
    fetchDataUser();
  }, [userInfo.uid, setValue]);

  useEffect(() => {
    const arrError = Object.values(errors);
    if (arrError.length > 0) {
      toast.error(arrError[0]?.message || arrError[0]?.name?.message, {
        pauseOnHover: false,
      });
    }
  }, [errors]);

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

  const handleSelectCategory = async (item) => {
    const docRef = doc(db, "categories", item.id);
    const docData = await getDoc(docRef);
    setValue("category", {
      id: docData.id,
      ...docData.data(),
    });
    setLabel(docData.data().name);
  };

  return (
    <div>
      <DashboardTitle title="Add post" desc="Add new post"></DashboardTitle>
      <form className={cx("add-post")} onSubmit={handleSubmit(handleAddpost)}>
        <div className={cx("form-layout")}>
          <div className={cx("input")}>
            <Label htmlFor="title">Title</Label>
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
            <Label>Image</Label>
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
            <Label htmlFor="category">Category</Label>
            <Dropdown control={control} name="category" id="category">
              <Dropdown.SelectDropdown
                placeholder={label || "Please select category"}
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

        <div className={cx("form-layout")}>
          <div className={cx("input")}>
            <Label htmlFor="desc">Description short</Label>
            <Input
              name="desc"
              id="desc"
              type="text"
              control={control}
              placeholder="Enter your description"
              className={cx("width-input")}
            ></Input>
          </div>
        </div>
        {/*  */}
        <div className={cx("form-layout")}>
          <div className={cx("input")}>
            <div className={cx("toggle-hide")}>
              <div>
                <Label>Feature post</Label>

                <Toggle
                  on={watchFeaturePost === true}
                  onClick={() => {
                    setValue("featurePost", !watchFeaturePost);
                  }}
                ></Toggle>
              </div>

              <div>
                <Label>Banner post</Label>

                <Toggle
                  on={watchBannerPost === true}
                  onClick={() => {
                    setValue("bannerPost", !watchBannerPost);
                  }}
                ></Toggle>
              </div>
              <div>
                <Label>Attention post</Label>

                <Toggle
                  on={watchAttentionPost === true}
                  onClick={() => {
                    setValue("attentionPost", !watchAttentionPost);
                  }}
                ></Toggle>
              </div>
            </div>
          </div>

          <div className={cx("input")}>
            <Label htmlFor="status">Status</Label>
            <div className={cx("box-radio")}>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === statusAddPost.APPROVED}
                // onClick={() => setValue("status", statusAddPost.APPROVED)}
                value={statusAddPost.APPROVED}
              >
                Approved
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === statusAddPost.PENDING}
                // onClick={() => setValue("status", statusAddPost.PENDING)}
                value={statusAddPost.PENDING}
              >
                Pending
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === statusAddPost.REJECT}
                // onClick={() => setValue("status", statusAddPost.REJECT)}
                value={statusAddPost.REJECT}
              >
                Reject
              </Radio>
            </div>
          </div>
        </div>

        {/*  */}
        <div className={cx("wrapper-btn-add")}>
          <Button
            className={cx("btn-add-post")}
            type="submit"
            isLoading={loading}
            disabled={loading}
          >
            Add new post
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Addpost;
