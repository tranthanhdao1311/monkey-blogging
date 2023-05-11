import React, { useEffect } from "react";
import DashboardTitle from "../../components/DashboardTitle/DashboardTitle";
import classNames from "classnames/bind";
import styles from "./UpdateCategory.module.scss";
import Label from "../../components/label/Label";
import Input from "../../components/input/Input";
import Radio from "../../components/Radio/Radio";
import { statusAddCate, statusRoleUser } from "../../configStatus";
import Button from "../../button/Button";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import slugify from "slugify";
import { toast } from "react-toastify";
import useRoleUser from "../../hook/useRoleUser";

const cx = classNames.bind(styles);

const UpdateCategory = () => {
  const [params] = useSearchParams();
  const categoryId = params.get("id");
  const { roleUserId } = useRoleUser();
  const {
    control,
    watch,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const navigate = useNavigate();

  useEffect(() => {
    const colRef = doc(db, "categories", categoryId);
    async function fetch() {
      const singleDoc = await getDoc(colRef);
      reset(singleDoc.data());
    }
    fetch();
  }, [categoryId, reset]);

  const watchStatus = watch("status");

  const handleUpdateCate = async (values) => {
    if (roleUserId !== statusRoleUser.ADMIN) {
      toast.warning("You do not have permission to edit categories");
    } else {
      values.slug = slugify(values.slug || values.name, { lower: true });
      await updateDoc(doc(db, "categories", categoryId), {
        name: values.name,
        slug: values.slug,
        status: Number(values.status),
      });
      toast.success(`Update category successfully!`);
      navigate("/manage/category");
    }
  };
  if (!categoryId) return null;

  return (
    <>
      <DashboardTitle
        title="Cập nhật danh mục"
        desc={`Cập nhật danh mục có id: ${categoryId}`}
      ></DashboardTitle>
      <form
        className={cx("add-category")}
        onSubmit={handleSubmit(handleUpdateCate)}
      >
        <div className={cx("form-layout")}>
          <div className={cx("input")}>
            <Label htmlFor="name">Tên danh mục</Label>
            <Input
              name="name"
              id="name"
              type="text"
              control={control}
              placeholder="Enter your name"
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
        <div className={cx("form-layout")}>
          <div className={cx("input")}>
            <Label htmlFor="category" className={cx("title")}>
              Trạng thái
            </Label>
            <div className={cx("box-status")}>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === statusAddCate.APPROVED}
                value={statusAddCate.APPROVED}
              >
                Duyệt
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === statusAddCate.UNAPPROVED}
                value={statusAddCate.UNAPPROVED}
              >
                Chưa duyệt
              </Radio>
            </div>
          </div>
        </div>

        <div className={cx("wrapper-btn-category")}>
          <Button
            className={cx("btn-add-category")}
            type="submit"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            Cập nhật
          </Button>
        </div>
      </form>
    </>
  );
};

export default UpdateCategory;
