import React, { useEffect, useState } from "react";
import DashboardTitle from "../../components/DashboardTitle/DashboardTitle";
import Input from "../../components/input/Input";
import classNames from "classnames/bind";
import styles from "./AddCategory.module.scss";
import Label from "../../components/label/Label";
import { useForm } from "react-hook-form";
import Radio from "../../components/Radio/Radio";
import Button from "../../button/Button";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import { toast } from "react-toastify";
import slugify from "slugify";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { statusAddCate } from "../../configStatus";
import { Dropdown } from "../../components/Dropdown";
const cx = classNames.bind(styles);

const schema = yup.object().shape({
  name: yup.string().required("Please enter your name category"),
});

const AddCategory = () => {
  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    getValues,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      slug: "",
      status: statusAddCate.APPROVED,
      createAt: new Date(),
      parentCategory: null,
      childrenCategory: [],
    },
    resolver: yupResolver(schema),
  });
  const watchStatus = watch("status");

  const [x, setX] = useState([]);

  const [id, setId] = useState("");
  useEffect(() => {
    const colRef = collection(db, "categories");
    const q = query(
      colRef,
      where("status", "==", 1),
      where("parentCategory.id", "==", id)
    );
    onSnapshot(q, (snapshot) => {
      const result = [];
      snapshot.forEach((doc) => {
        result.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setX(result);
    });
  }, [id]);
  console.log(id);

  useEffect(() => {
    if (id) {
      updateDoc(doc(db, "categories", id), {
        childrenCategory: arrayUnion(...x),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [x]);

  const handleAddCategory = async (values) => {
    if (!isValid) return;
    const cloneValues = { ...values };
    try {
      cloneValues.slug = slugify(cloneValues.slug || cloneValues.name, {
        lower: true,
      });

      cloneValues.status = Number(cloneValues.status);
      const colRef = collection(db, "categories");
      await addDoc(colRef, {
        ...cloneValues,
        createAt: serverTimestamp(),
      });

      toast.success("Add category successfully!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      reset({
        name: "",
        slug: "",
        parentCategory: cloneValues.parentCategory,
        childrenCategory: [],
        status: statusAddCate.APPROVED,
        createAt: new Date(),
      });
    }
  };

  useEffect(() => {
    const arrError = Object.values(errors);
    if (arrError.length > 0) {
      toast.error(arrError[0]?.message, {
        pauseOnHover: false,
      });
    }
  }, [errors]);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const colRef = collection(db, "categories");
    const queries = query(colRef, where("status", "==", 1));
    onSnapshot(queries, (snapshot) => {
      const result = [];
      snapshot.forEach((doc) => {
        result.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setCategories(result);
    });
  }, []);

  const [label, setLabel] = useState("");

  const handleSelectCategory = async (item) => {
    const colRef = doc(db, "categories", item.id);
    const docData = await getDoc(colRef);
    setValue(
      "parentCategory",
      {
        id: docData.id,
        ...docData.data(),
      }
      // ...docData.data(),
    );
    setLabel(docData.data().name);
    setId(docData.id);
  };

  return (
    <>
      <DashboardTitle
        title="New category"
        desc="Add new category"
      ></DashboardTitle>
      <form
        className={cx("add-category")}
        onSubmit={handleSubmit(handleAddCategory)}
      >
        <div className={cx("form-layout")}>
          <div className={cx("input")}>
            <Label htmlFor="name">Name</Label>
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
            <Label htmlFor="parentCategory">Parent Category</Label>
            <Dropdown
              control={control}
              name="parentCategory"
              id="parentCategory"
            >
              <Dropdown.SelectDropdown
                placeholder={label || "Please select parent category"}
              ></Dropdown.SelectDropdown>
              <Dropdown.List>
                {categories.length > 0 &&
                  categories.map((item) => (
                    <Dropdown.Option
                      onClick={() => handleSelectCategory(item)}
                      key={item.id}
                    >
                      {item.name}
                    </Dropdown.Option>
                  ))}
              </Dropdown.List>
            </Dropdown>
          </div>
          <div className={cx("input")}>
            <Label htmlFor="category" className={cx("title")}>
              Status
            </Label>
            <div className={cx("box-status")}>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === statusAddCate.APPROVED}
                // onClick={() => setValue("status", statusAddCate.APPROVED)}
                value={statusAddCate.APPROVED}
              >
                APPROVED
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === statusAddCate.UNAPPROVED}
                // onClick={() => setValue("status", statusAddCate.UNAPPROVED)}
                value={statusAddCate.UNAPPROVED}
              >
                UNAPPROVED
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
            Add new category
          </Button>
        </div>
      </form>
    </>
  );
};

export default AddCategory;
