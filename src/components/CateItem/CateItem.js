import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./CateItem.module.scss";
import LabelStatus from "../label/LabelStatus";
import ActionView from "../Action/ActionView";
import ActionEdit from "../Action/ActionEdit";
import ActionDelete from "../Action/ActionDelete";
import { statusAddCate } from "../../configStatus";
import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

const CateItem = ({ data, ...props }) => {
  const navigate = useNavigate();

  const handleDelete = async (e) => {
    e.preventDefault();

    const docRefDelete = doc(db, "categories", data.id);
    const docData = await getDoc(docRefDelete);

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (docData.data().parentCategory?.id) {
          await deleteDoc(docRefDelete);
          const parentCategoryId = docData.data().parentCategory?.id;
          const docRef = doc(db, "categories", parentCategoryId);
          try {
            await updateDoc(docRef, {
              childrenCategory: arrayRemove({ id: data.id }),
            });
            console.log(data.id);
          } catch (error) {
            console.log("error");
          }
        } else {
          await deleteDoc(docRefDelete);
        }
        Swal.fire(
          "Deleted!",
          `Delete category ${data.name} successfully!`,
          "success"
        );
      }
    });
  };

  return (
    <>
      <tr className={cx("table-desktop")} key={data.id}>
        <td
          style={{
            fontSize: "16px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "13ch",
          }}
        >
          {data.id}
        </td>
        <td className={cx("padding-right")}>
          <div className={cx("post-item")}>
            <div className={cx("info-post")}>
              <p className={cx("post-title")}>{data.name}</p>
            </div>
          </div>
        </td>
        <td style={{ color: "#9ca3af", fontSize: "16px", fontStyle: "italic" }}>
          {data.slug}
        </td>
        <td>
          {data.status === statusAddCate.APPROVED && (
            <LabelStatus type="success">Approved</LabelStatus>
          )}
          {data.status === statusAddCate.UNAPPROVED && (
            <LabelStatus type="danger">Unapproved</LabelStatus>
          )}
        </td>
        <td>
          <div className={cx("actions")}>
            <ActionView></ActionView>
            <ActionEdit
              onClick={() => {
                navigate(`/manage/update-category?id=${data.id}`);
              }}
            ></ActionEdit>
            <ActionDelete onClick={handleDelete}></ActionDelete>
          </div>
        </td>
      </tr>

      <div className={cx("cate-mobile")}>
        <div className={cx("cate-mobile-tr")}>
          <span style={{ fontWeight: "600" }}>Id</span>
          <span style={{ color: "#6b7280" }}>{data.id}</span>
        </div>
        <div className={cx("cate-mobile-tr")}>
          <span style={{ fontWeight: "600" }}>Name</span>
          <span style={{ color: "#6b7280" }}>{data.name}</span>
        </div>
        <div className={cx("cate-mobile-tr")}>
          <span style={{ fontWeight: "600" }}>Slug</span>
          <span style={{ color: "#6b7280" }}>{data.slug}</span>
        </div>
        <div className={cx("cate-mobile-tr")}>
          <span style={{ fontWeight: "600" }}>Trạng thái</span>
          <span>
            {data.status === statusAddCate.APPROVED && (
              <LabelStatus type="success">Approved</LabelStatus>
            )}
            {data.status === statusAddCate.UNAPPROVED && (
              <LabelStatus type="danger">Unapproved</LabelStatus>
            )}
          </span>
        </div>
        <div className={cx("cate-mobile-tr")}>
          <span style={{ fontWeight: "600" }}>Hành động</span>
          <span>
            <div className={cx("actions")}>
              <ActionView></ActionView>
              <ActionEdit
                onClick={() => {
                  navigate(`/manage/update-category?id=${data.id}`);
                }}
              ></ActionEdit>
              <ActionDelete onClick={handleDelete}></ActionDelete>
            </div>
          </span>
        </div>
      </div>
    </>
  );
};

export default CateItem;
